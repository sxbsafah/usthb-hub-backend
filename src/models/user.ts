import mongoose from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  firstName: string;
  lastName: string;
  otp: {
    code?: string;
    expiresAt?: Date;
    isVerified: boolean;
  };
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: mongoose.Schema.Types.String,
      required: [true, "Username is required"],
      maxLength: [20, "Username must be at most 20 characters long"],
      minLength: [3, "Username must be at least 3 characters long"],
      unique: [true, "Username must be unique"],
    },
    email: {
      type: mongoose.Schema.Types.String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    password: {
      type: mongoose.Schema.Types.String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
      validate: {
        validator: (value: string) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/.test(value),
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      },
    },
    role: {
      type: mongoose.Schema.Types.String,
      enum: {
        values: ["admin", "user"],
        message: "Role must be either 'admin' or 'user'",
      },
      default: "user",
      required: [true, "Role is required"],
    },
    firstName: {
      type: mongoose.Schema.Types.String,
      required: [true, "First name is required"],
      maxLength: [30, "First name must be at most 30 characters long"],
      minLength: [2, "First name must be at least 2 characters long"],
    },
    lastName: {
      type: mongoose.Schema.Types.String,
      required: [true, "Last name is required"],
      maxLength: [30, "Last name must be at most 30 characters long"],
      minLength: [2, "Last name must be at least 2 characters long"],
    },
    otp: {
      type: {
        code: mongoose.Schema.Types.String,
        expiresAt: mongoose.Schema.Types.Date,
        isVerified: mongoose.Schema.Types.Boolean,
      },
      default: {
        isVerified: false,
        code: undefined,
        expiresAt: undefined,
      },
      required: [true, "OTP information is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
