import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    firstName: {
      type: String,
      default: "FirstName",
    },
    lastName: {
      type: String,
      default: "LastName",
    },
    address: {
      streetAddress: String,
      city: String,
      stateOrRegion: String,
      postalCode: String,
      country: String,
    },
    phoneNumber: String,
    taxIdCode: String,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
