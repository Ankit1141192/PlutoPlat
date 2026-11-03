
const express = require("express");
const router = express.Router();

const {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} = require("../../controllers/testimonialController");

// CREATE
router.post("/", createTestimonial);

// GET ALL
router.get("/", getAllTestimonials);

// GET SINGLE
router.get("/:id", getTestimonialById);

// UPDATE
router.put("/:id", updateTestimonial);

// DELETE
router.delete("/:id", deleteTestimonial);

module.exports = router;
