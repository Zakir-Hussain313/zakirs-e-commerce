import { z } from "zod";

export const zSchema = z.object({

  name: z.string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must not exceed 50 characters" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password must be at most 64 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[\W_]/, { message: "Password must contain at least one special character" }),

  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only numbers" }),

  _id: z
    .string()
    .min(3, " Id is required"),

  alt: z
    .string()
    .min(3),

  title: z
    .string()
    .min(3),

  review: z
    .string()
    .min(3, "Review is required."),

  slug: z
    .string()
    .min(3, "Slug is required."),

  category: z.string()
    .min(3, 'Category is required'),

  mrp: z
    .union([
      z.number().positive('Expected Positive value , recieved negative'),
      z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number.')
    ]),

  sellingPrice: z
    .union([
      z.number().positive('Expected Positive value , recieved negative'),
      z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number.')
    ]),

  discountPercentage: z
    .union([
      z.number().positive('Expected Positive value , recieved negative'),
      z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number.')
    ]),

  description: z
    .string()
    .min(3, 'Discription is required'),

  media: z
    .array(z.string()),

  product: z
    .string()
    .min(3, 'Product is required'),

  userId: z
    .string()
    .optional(),

  sku: z
    .string()
    .min(3, 'SKU is required'),

  color: z
    .string()
    .min(3, 'Color is required'),

  size: z
    .string()
    .min(1, 'Size is required'),

  code: z
    .string()
    .min(3, "Code must be at least 3 characters long")
    .max(50, "Code must not exceed 50 characters"),

  minShoppingAmount: z
    .union([
      z.number().positive('Expected Positive value , recieved negative'),
      z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number.')
    ]),

  rating: z
    .union([
      z.number().positive('Expected Positive value , recieved negative'),
      z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number.')
    ]),

  validity: z
    .coerce.date(),

  cartTotal: z
  .number(),

  phone : z
  .string()
  .min(10,'Phone number is required'),

  country : z
  .string()
  .min(3,'country is required'),

  city : z
  .string()
  .min(3,'city is required'),

  state : z
  .string()
  .min(3,'state is required'),

  pincode : z
  .string()
  .min(3,'pincode is required'),

  landmark : z
  .string()
  .min(3,'landmark is required'),

  ordernote : z
  .string()
  .min(3,'order note is required').optional(),

});

export type AuthSchemaType = z.infer<typeof zSchema>;
