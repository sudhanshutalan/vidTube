import mongoose, { Schema, model } from "mongoose";

const tweetSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: Sting,
    },
  },
  { timestamps: true },
);

export const Tweet = model("Tweet", tweetSchema);
