import express from 'express'
import { createCourse,updateCourse,deleteCourse, getCourses,getCourseDetails, buyCourses } from '../controllers/course.controller.js'
import { usermiddleware } from '../middlewares/user.mid.js';
import { adminmiddleware } from '../middlewares/admin.mid.js';

const router =express.Router()

router.post("/create",adminmiddleware,createCourse)
router.put("/update/:courseId",adminmiddleware,updateCourse);
router.delete("/delete/:courseId",adminmiddleware,deleteCourse);
router.get("/courses",getCourses);
router.get("/:courseId",getCourseDetails)

router.post("/buy/:courseId",usermiddleware,buyCourses)

export default router;