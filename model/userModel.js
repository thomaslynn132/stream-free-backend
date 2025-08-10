import { Schema, model } from "mongoose";
import { hash as _hash } from "bcrypt";

const subscriptionSchema = new Schema({
  status: {
    type: String,
    enum: ["active", "expired"],
    default: "expired",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  plan: {
    type: String,
    enum: ["basic", "standard", "premium"],
  },
});

const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Please enter your full name"],
    min: [3, "Full name must be at least 3 characters"],
    max: [50, "Full name must be at most 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: [true, "Email already exists"],
    lowercase: [true, "Email must be in lowercase"],
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    min: [8, "Password must be at least 8 characters"],
  },
  refreshToken: { type: String },
  bookMark: {
    type: Array,
    default: [],
  },
  watchList: [
    {
      kind: {
        type: String,
        enum: ["Movies", "Series"],
        required: true,
      },
      item: {
        type: Schema.Types.ObjectId,
        refPath: "watchList.kind",
        required: true,
      },
    },
  ],
  subscription: {
    type: subscriptionSchema,
    default: null,
  },
  timeTrial: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.pre("save", function (next) {
  let user = this;

  if (!user.isModified("password")) return next();

  _hash(user.password, 10, (err, hash) => {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

const User = model("Users", userSchema);

export default User;