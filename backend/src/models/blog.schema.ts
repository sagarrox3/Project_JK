import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mongoose, Types } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true, minlength: 20 })
  content: string;

  @Prop({type: Types.ObjectId, ref: 'User',  required: true })
  authorId: Types.ObjectId;

  @Prop({ default: [] })
  tags: string[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
