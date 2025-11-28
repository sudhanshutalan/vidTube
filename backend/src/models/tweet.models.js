import mongoose, { Schema, model } from "mongoose";
import mongooseAggrigatePaginate from "mongoose-aggregate-paginate-v2";

const tweetSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
  },
  { timestamps: true },
);

tweetSchema.plugin(mongooseAggrigatePaginate);

export const Tweet = model("Tweet", tweetSchema);
