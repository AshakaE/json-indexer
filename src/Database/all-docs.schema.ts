import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AllDocsDocument = AllDocs & Document;

@Schema({ strict: false, timestamps: true })
export class AllDocs {
  @Prop({ type: Array, required: true })
  data!: any[];

  @Prop({ required: true, index: true, unique: true })
  docId: string;
}

export const AllDocsSchema = SchemaFactory.createForClass(AllDocs);
