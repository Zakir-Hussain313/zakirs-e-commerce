import mongoose, { Schema, Document, Model } from "mongoose";


// 1️⃣ Define the Media interface
export interface IMedia extends Document {
  asset_id: string;
  public_id: string;
  path: string;
  secure_url: string;
  thumbnail_url: string;
  alt?: string;
  title?: string;
  deletedAt?: Date | null;
}

// 2️⃣ Define the schema
const mediaSchema: Schema<IMedia> = new Schema(
  {
    asset_id: {
      type: String,
      required: true,
      trim: true,
    },
    public_id: {
      type: String,
      required: true,
      trim: true,
    },
    path: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail_url: {
      type: String,
      required: true,
      trim: true,
    },
    secure_url: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// 3️⃣ Fix OverwriteModelError by reusing model if already compiled
const MediaModel: Model<IMedia> =
  (mongoose.models.Media as Model<IMedia>) ||
  mongoose.model<IMedia>("Media", mediaSchema, "medias");

export default MediaModel;
