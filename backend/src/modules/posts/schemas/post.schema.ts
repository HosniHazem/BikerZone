import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({
    type: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
    required: false,
  })
  location?: {
    lat: number;
    lng: number;
    address: string;
  };

  @Prop({ type: [String], default: [] })
  hashtags: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
  likes: string[];

  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({
    type: [
      {
        userId: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  comments: Array<{
    userId: string;
    content: string;
    createdAt: Date;
  }>;

  @Prop({ type: Number, default: 0 })
  commentsCount: number;

  @Prop({ default: false })
  isReported: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Indexes for better performance
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ hashtags: 1 });
PostSchema.index({ likesCount: -1 });
PostSchema.index({ 'location.lat': 1, 'location.lng': 1 });
