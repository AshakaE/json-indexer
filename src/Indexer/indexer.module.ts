import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AllDocs, AllDocsSchema } from 'src/Database/all-docs.schema';
import { IndexerService } from './indexer.service';
import { QueueService } from './queue.service';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME } from 'src/globals';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    BullModule.registerQueue({
      name: QUEUE_NAME,
    }),
    MongooseModule.forFeature([{ name: AllDocs.name, schema: AllDocsSchema }]),
  ],
  controllers: [],
  providers: [IndexerService, QueueService],
})
export class IndexerModule {}
