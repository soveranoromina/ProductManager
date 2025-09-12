import { Router } from "express"
const router = Router()

router.get("/home", async (req, res, next) => {
  res.render("home", {
    title: "Home"
  })
})

router.get("/realTimeProducts", async (req, res, next) => {
  res.render("realTimeProducts", {
    title: "Real time products"
  })
})

router.get("/cart/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    res.render("cart", {
      title: "Cart details",
      cartId: id 
    })
  } catch (error) {
    next(error)
  }
})

export default router
