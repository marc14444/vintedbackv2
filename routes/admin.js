import adminControllers from "../controllers/admin.js";
import { Router } from "express";
const router = Router();

router.get("/", adminControllers.getAll);
router.get("/:id", adminControllers.getAdmin);
router.put("/:id", adminControllers.updateAdmin); 
router.post("/", adminControllers.createAdmin);
router.post("/login", adminControllers.loginAdmin);
router.delete("/:id", adminControllers.deleteAdmin);

export default router;
