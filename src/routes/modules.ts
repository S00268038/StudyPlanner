import { Router } from "express";
import { listModules, getModule, addModule, editModule, removeModule } from "../controllers/modules.js";

const router = Router();
router.get("/", listModules);
router.post("/", addModule);
router.get("/:id", getModule);
router.put("/:id", editModule);
router.delete("/:id", removeModule);

export default router;