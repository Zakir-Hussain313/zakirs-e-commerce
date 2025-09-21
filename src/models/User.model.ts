import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// ✅ Define TypeScript interface for User
export interface User extends Document {
  role: "user" | "admin";
  name: string;
  email: string;
  password: string;
  avatar?: {
    url?: string;
    public_id?: string;
  };
  isEmailVerified: boolean;
  phone?: string;
  address?: string;
  deletedAt?: Date | null;

  // Methods
  comparePassword(password: string): Promise<boolean>;
}

// ✅ Create Schema
const userSchema = new Schema<User>(
  {
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false, 
    },
    avatar: {
      url: {
        type: String,
        trim: true,
      },
      public_id: {
        type: String,
        trim: true,
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
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

// ✅ Pre-save hook to hash password
userSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Create Model
const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", userSchema, "users");

export default UserModel;
