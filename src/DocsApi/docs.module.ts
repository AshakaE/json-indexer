import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AllDocs, AllDocsSchema } from 'src/Database/all-docs.schema';
import { AllDocsController } from './docs.controller';
import { AllDocsService } from './docs.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AllDocs.name, schema: AllDocsSchema }]),
  ],
  controllers: [AllDocsController],
  providers: [AllDocsService],
})
export class AllDocsModule {}
