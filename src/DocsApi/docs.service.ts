import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AllDocs, AllDocsDocument } from 'src/Database/all-docs.schema';

@Injectable()
export class AllDocsService {
  constructor(
    @InjectModel(AllDocs.name)
    private docsModel: Model<AllDocsDocument>,
  ) {}

  async search(
    criteria: Record<string, any>,
    page = 1,
    limit = 100,
    sort: Record<string, 1 | -1> = { createdAt: -1 },
  ): Promise<{ data: AllDocs[]; total: number; page: number; pages: number }> {
    const actualLimit = Math.min(limit, 100);
    const skip = (page - 1) * actualLimit;

    const [data, total] = await Promise.all([
      this.docsModel
        .find(criteria)
        .sort(sort)
        .skip(skip)
        .limit(actualLimit)
        .exec(),

      this.docsModel.countDocuments(criteria).exec(),
    ]);

    return {
      data,
      total,
      page,
      pages: Math.ceil(total / actualLimit),
    };
  }
}
