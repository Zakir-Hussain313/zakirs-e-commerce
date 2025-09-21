import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

import CategoryModel from "../../../../models/category.model";
import ProductModel from "../../../../models/Product.model";
import ProductVariantModel from "../../../../models/ProductVarient.model";
import MediaModel from "../../../../models/Media.model";

import { response } from "@/lib/helperFunction";
import { connectDB } from "../../../../lib/dataBaseConnection";

// Utility function with types
function getRandomItems<T>(array: T[], count = 1): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Next.js 13+ App Router Request Handler type
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    // Fetch all categories
    const categories = await CategoryModel.find();
    if (categories.length === 0) {
      return response(false, 400, "No categories found!");
    }

    const mediaList = await MediaModel.find();
    const mediaMap = mediaList.map((media) => media._id);

    const colors = ["Red", "Blue", "Green", "Black"];
    const sizes = ["S", "M", "L", "XL", "2XL"];

    const products = [];
    const variants = [];

    for (const category of categories) {
      for (let i = 0; i < 5; i++) {
        const mrp = Number(faker.commerce.price({ min: 500, max: 2000, dec: 0 }));
        const discountPercentage = faker.number.int({ min: 10, max: 50 });
        const sellingPrice = Math.round(mrp - (mrp * discountPercentage) / 100);

        const productId = new mongoose.Types.ObjectId();
        const selectedMedia = getRandomItems(mediaMap, 4);

        const product = {
          _id: productId,
          name: faker.commerce.productName(),
          slug: faker.lorem.slug(),
          category: category._id,
          mrp,
          sellingPrice,
          discountPercentage,
          media: selectedMedia,
          description: faker.commerce.productDescription(),
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        products.push(product);

        // Generate 20 variants (4 colors x 5 sizes)
        for (const color of colors) {
          for (const size of sizes) {
            const variantMedia = getRandomItems(mediaMap, 4);

            const variant = {
              _id: new mongoose.Types.ObjectId(),
              product: productId,
              color,
              size,
              mrp: product.mrp,
              sellingPrice: product.sellingPrice,
              discountPercentage: product.discountPercentage,
              sku: `${product.slug}-${color}-${size}-${faker.number.int({
                min: 1000,
                max: 9999,
              })}`,
              stock: faker.number.int({ min: 10, max: 100 }),
              media: variantMedia,
              deletedAt: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            variants.push(variant);
          }
        }
      }
    }

    // Insert data into MongoDB
    await ProductModel.insertMany(products);
    await ProductVariantModel.insertMany(variants);

    return response(true, 200, "Fake data generated successfully.");
  } catch (error: any) {
    return response(false, 500, error.message);
  }
}
