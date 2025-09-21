import mongoose, { Document, Model, Schema } from "mongoose";

// Define OTP document type
export interface IOTP extends Document {
  email: string;
  otp: string;
  expiredAt: Date;
}

// Define Schema
const otpSchema: Schema<IOTP> = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiredAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
    },
  },
  { timestamps: true }
);

// TTL index to auto-delete expired OTPs
otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

// Define model
const OTPModel: Model<IOTP> =
  mongoose.models.OTP || mongoose.model<IOTP>("OTP", otpSchema, "otps");

export default OTPModel;
