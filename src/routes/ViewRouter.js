import { Router } from "express";
const router = Router();

router.get("/home", async (req, res, next) => {
  res.render("home");
})

router.get("/realTimeProducts", async (req, res, next) => {
  res.render("realTimeProducts");
})

export default router;
