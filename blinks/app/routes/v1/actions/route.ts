import { Router } from "express";
import { get, post } from "./controller";

const router = Router();
router.route("/transfer-sol").get(get).post(post);

export default router;
