import mongoose, { Schema, Document, Model } from "mongoose";

// 1️⃣ Define the Media interface
export interface ICoupon extends Document {
    discountPercentage?: number;
    code?: string;
    deletedAt?: Date | null;
    minShoppingAmount?: number;
    validity?: Date ;
}

// 2️⃣ Define the schema
const couponSchema: Schema<ICoupon> = new Schema(
    {
        code: {
            type: String,
            unique: true,
            trim: true,
            reqired: true,
        },
        discountPercentage: {
            type: Number,
            reqired: true,
            trim: true,
        },
        minShoppingAmount: {
            type: Number,
            reqired: true,
            trim: true,
        },
        validity: {
            type: Date,
            reqired: true,
        },
        deletedAt: {
            type: Date,
            default: null,
            index: true,
        },
    },
    { timestamps: true }
);

const CouponModel: Model<ICoupon> =
    mongoose.models.Coupon ||
    mongoose.model<ICoupon>("Coupon", couponSchema, "coupons");

export default CouponModel;
