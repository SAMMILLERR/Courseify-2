import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/purchase.model.js";

export const createCourse = async (req, res) => {
  const adminId= req.adminId;
  console.log(adminId)
  // 1) Destructure inputs
  const { title, description, price } = req.body;
  const { image } = req.files || {};

  // 2) Validate
  const allowedTypes = ['image/jpeg','image/png','image/gif'];
  if (!title || !description || !price || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!allowedTypes.includes(image.mimetype)) {
    return res.status(400).json({ message: "Invalid image type" });
  }

  // 3) Upload to Cloudinary
  let cloudResponse;
  try {
    cloudResponse = await cloudinary.uploader.upload(image.tempFilePath);
  } catch (err) {
    return res.status(500).json({ message: "Cloudinary upload failed", error: err });
  }

  // 4) Build a Mongoose document
  const course = new Course({
    title,
    description,
    price,
    image: {
      public_id: cloudResponse.public_id,
      url:       cloudResponse.secure_url || cloudResponse.url
    },
    creatorId:adminId
  });

  // 5) Save to MongoDB
  try {
    const saved = await course.save();
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({ message: "Error saving course", error: err });
  }
};

export const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const adminId = req.adminId;
  const { title, description, price, image } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (course.creatorId.toString() !== adminId) {
      return res.status(403).json({ error: "Forbidden: you may only update your own courses" });
    }

    if (title != null) course.title = title;
    if (description != null) course.description = description;
    if (price != null) course.price = price;

    if (image?.public_id && image?.url) {
      course.image.public_id = image.public_id;
      course.image.url = image.url;
    }

    await course.save();

    return res.status(200).json({ message: "Course updated successfully", course });
  } catch (err) {
    console.error("Error in course updating", err);
    return res.status(500).json({ error: "Error in course updating" });
  }
};







export const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  const adminId = req.adminId;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (course.creatorId.toString() !== adminId) {
      return res.status(403).json({ error: "Forbidden: you may only delete your own courses" });
    }

    await course.deleteOne();
    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course", err);
    return res.status(500).json({ error: "Error deleting course" });
  }
};


export const getCourses = async(req,res)=>{
    try{
        const courses= await Course.find({});
        res.status(200).json({
            success:true,
            count:courses.length,
            courses
        })
    }
    catch(error){
             res.status(500).json({error:"Error in finding courses"});
             console.log(error);
    }
}

export const getCourseDetails= async(req,res)=>{
    const {courseId} = req.params;
    try{
        const course = await Course.findById(courseId);
        if(!course){
            res.status(404).json({message:"Course not present"});
        }
        res.status(200).json({message:"Course Found",course}
        )
    }
    catch(error){
        console.log(error);
        res.status(400).json({error:"Invalid courseId entered"});
    }
}

export const buyCourses = async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not available" });
    }

    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({ error: "User has already purchased the course" });
    }

    const newPurchase = new Purchase({ userId, courseId });
    await newPurchase.save();

    res.status(201).json({
      message: "Course purchased successfully",
      newPurchase
    });
  } catch (error) {
    res.status(500).json({ error: "Error in buying course" });
  }
};


