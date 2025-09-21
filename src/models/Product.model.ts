import mongoose, { Schema } from "mongoose";
import './Media.model';
// Define Schema
const productSchema: Schema= new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Category'
        },
        mrp: {
            type: Number,
            required: true
        },
        sellingPrice: {
            type: Number,
            required: true
        },
        discountPercentage: {
            type: Number,
            required: true
        },
        media: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Media'
            }
        ],
        description: {
            type: String,
            required : true
        },
        deletedAt: {
            type: Date,
            default: null,
            index: true
        }

    },
    { timestamps: true }
);


productSchema.index({ category : 1 });
const ProductModel =
    mongoose.models.Product || mongoose.model("Product", productSchema, "products");

export default ProductModel;
