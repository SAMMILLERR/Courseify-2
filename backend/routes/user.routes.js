import express from "express"
import { signup , login , logout, Purchases } from "../controllers/user.controller.js";
import { usermiddleware } from "../middlewares/user.mid.js";

const router=express.Router();

router.post("/signup",signup);
router.post("/login" , login);
router.get("/logout",logout);
router.get("/purchases" , usermiddleware ,Purchases);


export default router;