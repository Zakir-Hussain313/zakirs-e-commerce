import ProductModel from "./Product.model";
import MediaModel from "./Media.model";
import CategoryModel from './category.model'

// Force model registration by referencing them
void ProductModel;
void MediaModel;
void CategoryModel;

export const Models = {
  ProductModel,
  MediaModel,
  CategoryModel,
};
