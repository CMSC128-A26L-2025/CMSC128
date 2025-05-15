import express from "express";
import { register} from "../controllers/authControllers/register.js";
import { login } from "../controllers/authControllers/login.js";
import { refresh } from "../controllers/authControllers/refresh.js";
import { logout } from "../controllers/authControllers/logout.js";
const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/refresh", refresh);
router.post("/logout", logout);

export default router;
