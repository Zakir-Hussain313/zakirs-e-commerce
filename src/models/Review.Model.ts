import mongoose, { Schema, Document, Model } from "mongoose";

// 1️⃣ Define the Media interface
export interface IReview extends Document {
    product : mongoose.Schema.Types.ObjectId;
    user : mongoose.Schema.Types.ObjectId;
    rating : number;
    title : string;
    review : string
    deletedAt?: Date | null;
}

// 2️⃣ Define the schema
const ReviewSchema: Schema<IReview> = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            reqired: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            reqired: true,
        },
        rating : {
            type : Number,
            required : true
        },
        title : {
            type : String,
            required : true
        },
        review : {
            type : String,
            required : true
        },
        deletedAt: {
            type: Date,
            default: null,
            index: true,
        },
    },
    { timestamps: true }
);

const ReviewModel: Model<IReview> =
    mongoose.models.Review ||
    mongoose.model<IReview>("Review", ReviewSchema, "reviews");

export default ReviewModel;
