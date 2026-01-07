import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum AlertType {
  POLICE = 'police',
  TRAFFIC = 'traffic',
  ACCIDENT = 'accident',
  ROADWORK = 'roadwork',
  WEATHER = 'weather',
  OTHER = 'other',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export type AlertDocument = Alert & Document;

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
export class Alert {
  @Prop({ 
    type: String,
    enum: Object.values(AlertType),
    required: true,
  })
  type: AlertType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String },
    },
    required: true,
  })
  location: {
    lat: number;
    lng: number;
    address?: string;
  };

  @Prop({ 
    type: String,
    enum: Object.values(AlertSeverity),
    default: AlertSeverity.MEDIUM,
  })
  severity: AlertSeverity;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: Date, required: true })
  validUntil: Date;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
  upvotes: string[];

  @Prop({ type: Number, default: 0 })
  upvotesCount: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
  downvotes: string[];

  @Prop({ type: Number, default: 0 })
  downvotesCount: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: String, nullable: true })
  imageUrl?: string;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);

// Indexes
AlertSchema.index({ 'location.lat': 1, 'location.lng': 1 });
AlertSchema.index({ type: 1, severity: 1 });
AlertSchema.index({ validUntil: 1 });
AlertSchema.index({ userId: 1 });
AlertSchema.index({ isActive: 1, isVerified: 1 });
