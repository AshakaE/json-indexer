import { Processor, Process } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { AllDocs, AllDocsDocument } from 'src/Database/all-docs.schema';
import { StructuredTypeJSON, LargeTypeJSON } from 'src/Database/jsonData';
import { PROCESS_NAME, QUEUE_NAME } from 'src/globals';

@Processor(QUEUE_NAME)
export class QueueService {
  constructor(
    @InjectModel(AllDocs.name)
    private docsModel: Model<AllDocsDocument>,
  ) {}

  @Process(PROCESS_NAME)
  async handleJSONChunks(
    job: Job<{
      chunkId: number;
      chunk: StructuredTypeJSON[] | LargeTypeJSON[];
    }>,
  ) {
    const { chunkId, chunk } = job.data;

    if (!chunk?.length) return { chunkId, processed: 0 };

    const remappedChunk = chunk.map(
      (item: LargeTypeJSON | StructuredTypeJSON) => ({
        updateOne: {
          filter: { docId: item.id },
          update: {
            $setOnInsert: {
              docId: item.id,
              data: item,
              createdAt: new Date(),
            },
          },
          upsert: true,
        },
      }),
    );

    try {
      const result = await this.docsModel.bulkWrite(remappedChunk, {
        ordered: false,
      });

      return {
        chunkId,
        processed: chunk.length,
        inserted: result.upsertedCount,
        skipped: chunk.length - result.upsertedCount,
      };
    } catch (error) {
      console.log(error.code, error.message);
    }
  }
}
