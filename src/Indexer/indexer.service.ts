import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { LargeTypeJSON, StructuredTypeJSON } from 'src/Database/jsonData';
import { ConfigService } from '@nestjs/config';
import { QUEUE_NAME } from 'src/globals';

@Injectable()
export class IndexerService implements OnModuleInit {
  private readonly CHUNK_LIMIT = 1000;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectQueue(QUEUE_NAME)
    private injestQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.ingestData();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async ingestData() {
    console.info('Checking for new data');
    try {
      const [firstResponse, secondResponse] = await Promise.all([
        firstValueFrom(
          this.httpService.get(
            this.configService.get<string>('STRUCTURED_JSON_URL'),
          ),
        ),
        firstValueFrom(
          this.httpService.get(
            this.configService.get<string>('LARGE_JSON_URL'),
          ),
        ),
      ]);
      const data = [
        ...(firstResponse.data as StructuredTypeJSON[]),
        ...(secondResponse.data as LargeTypeJSON[]),
      ];

      const totalChunks = Math.ceil(data.length / this.CHUNK_LIMIT);

      for (let i = 0; i < totalChunks; i++) {
        const chunkStart = i * this.CHUNK_LIMIT;
        const chunkEnd = chunkStart + this.CHUNK_LIMIT;
        const chunk = data.slice(chunkStart, chunkEnd);
        const chunkId = Date.now();
        await this.injestQueue.add('data-ingest', {
          chunkId,
          chunk,
        });
      }
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
    }
  }
}
