import mongoose, { Schema, Document, Model } from 'mongoose';
import { hashPassword } from '../common/utils/password';
import { USER_ROLES } from '../common/constants';

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  role: keyof typeof USER_ROLES;
  refreshToken?: string;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
       match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 5,
      select: false, 
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String as any,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.ADMIN
    },
    refreshToken: {
      type: String,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error: any) {
    next(error);
  }
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
