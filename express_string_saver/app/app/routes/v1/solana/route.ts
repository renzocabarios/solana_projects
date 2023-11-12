import { Router } from "express";
import { getAll, add, update } from "./controller";

const router = Router();
router.route("/").get(getAll).post(add);
router.route("/:id").patch(update);

export default router;
