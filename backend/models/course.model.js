import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true },
  image: {
    public_id: { type: String, required: true },
    url:       { type: String, required: true }
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  "Admin",
    required: true
  }
});


export const Course=mongoose.model("Course",CourseSchema);