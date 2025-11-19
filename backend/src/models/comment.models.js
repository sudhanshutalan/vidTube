import mongoose, { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
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

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = model("Comment", commentSchema);
