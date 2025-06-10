import express from "express"
import { signup ,login ,logout, mycourses} from "../controllers/admin.controller.js";
import { adminmiddleware } from "../middlewares/admin.mid.js";

const router=express.Router();

router.post("/signup",signup);
router.post("/login" , login);
router.get("/logout",logout);
// routes/course.js
router.get("/my-courses", adminmiddleware, mycourses);



export default router;