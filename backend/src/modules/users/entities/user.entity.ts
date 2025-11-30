import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Exclude } from 'class-transformer';

export enum BikeType {
  SPORT = 'sport',
  CRUISER = 'cruiser',
  TOURING = 'touring',
  ADVENTURE = 'adventure',
  CUSTOM = 'custom',
  STANDARD = 'standard',
}

export enum UserRole {
  USER = 'user',
  GARAGE = 'garage',
  ADMIN = 'admin',
}

export type UserDocument = User & Document;

@Schema({
  timestamps: { 
    createdAt: 'created_at',
    updatedAt: 'updated_at' 
  },
  toJSON: {
    transform: function(doc, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      delete ret.refresh_token;
      return ret;
    },
  },
})
export class User {
  id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  avatar_url: string;

  @Prop({ 
    type: String,
    enum: Object.values(BikeType),
  })
  bike_type: BikeType;

  @Prop()
  bike_model: string;

  @Prop()
  bike_year: number;

  @Prop()
  bike_mileage: number;

  @Prop({ 
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  })
  role: UserRole;

  @Prop({ default: false })
  is_verified: boolean;

  @Prop()
  verification_token: string;

  @Prop()
  @Exclude()
  refresh_token: string;

  @Prop()
  fcm_token: string;

  @Prop({
    type: {
      alerts: { type: Boolean, default: true },
      posts: { type: Boolean, default: true },
      bookings: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
    default: {
      alerts: true,
      posts: true,
      bookings: true,
      marketing: false,
    },
  })
  notification_preferences: {
    alerts: boolean;
    posts: boolean;
    bookings: boolean;
    marketing: boolean;
  };

  @Prop()
  last_login: Date;

  @Prop({ default: true })
  is_active: boolean;

  // Note: For relationships, you'll need to use populate() in your service
  // These are just for type information and documentation
  bookings: any[]; // Replace 'any' with your Booking type
  reviews: any[];   // Replace 'any' with your Review type
}

export const UserSchema = SchemaFactory.createForClass(User);
