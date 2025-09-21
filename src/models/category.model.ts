import mongoose, { Document, Model, Schema } from "mongoose";

// Define OTP document type
export interface ICategory extends Document {
    name : string,
    slug : string,
    deletedAt : Date
}

// Define Schema
const CategorySchema: Schema<ICategory> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true
        },
        deletedAt : {
            type : Date,
            default : null,
            index : true
        }

    },
    { timestamps: true }
);


// Define model
const CategoryModel: Model<ICategory> =
    mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema, "categories");

export default CategoryModel;
