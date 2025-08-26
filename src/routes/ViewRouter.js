import { Router } from "express";
const router = Router();

router.get("/home", async (req, res, next) => {
  res.render("home", {
    title: "Home"
  });
})

router.get("/realTimeProducts", async (req, res, next) => {
  res.render("realTimeProducts", {
    title: "Real time products"
  });
})

export default router;
