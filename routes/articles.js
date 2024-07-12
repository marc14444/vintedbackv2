import ArticlesControllers from "../controllers/articles.js";
import { Router } from "express";
import { verifyToken } from "../Midlleware/auth.js";
const router = Router();

router.get("/",verifyToken, ArticlesControllers.getAll);
router.get("/:id",verifyToken, ArticlesControllers.getArticles);
router.put("/:id",verifyToken, ArticlesControllers.updateArticles);
router.post("/",verifyToken, ArticlesControllers.createArticles);
router.delete("/:id",verifyToken, ArticlesControllers.deleteArticles);
export default router;