import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum BikeCategory {
  SPORT = 'sport',
  CRUISER = 'cruiser',
  TOURING = 'touring',
  ADVENTURE = 'adventure',
  STANDARD = 'standard',
  CUSTOM = 'custom',
}

export enum VideoLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export type VideoDocument = Video & Document;

@Schema({ 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Video {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ required: true, type: Number })
  duration: number; // in seconds

  @Prop({ 
    type: String,
    enum: Object.values(BikeCategory),
  })
  category: BikeCategory;

  @Prop({ 
    type: String,
    enum: Object.values(VideoLevel),
    default: VideoLevel.BEGINNER,
  })
  level: VideoLevel;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
  likes: string[];

  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  uploadedBy: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isFeatured: boolean;
}

export const VideoSchema = SchemaFactory.createForClass(Video);

// Indexes
VideoSchema.index({ title: 'text', description: 'text', tags: 'text' });
VideoSchema.index({ category: 1, level: 1 });
VideoSchema.index({ views: -1 });
VideoSchema.index({ likesCount: -1 });
VideoSchema.index({ uploadedBy: 1 });
