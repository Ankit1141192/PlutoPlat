const express = require("express");
const router = express.Router();

const {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  moderateTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../../controllers/testimonialController");
const { authenticate, optionalAuthenticate, authorize } = require("../../middlewares/auth");

// CREATE (Authenticated or Guest; checks 1 feedback per user, defaults to pending for review)
router.post("/", optionalAuthenticate, createTestimonial);

// GET ALL (Public sees only approved; SuperAdmin sees all)
router.get("/", optionalAuthenticate, getAllTestimonials);

// GET SINGLE
router.get("/:id", optionalAuthenticate, getTestimonialById);

// MODERATE / APPROVE (SuperAdmin only)
router.patch("/:id/moderate", authenticate, authorize("super_admin"), moderateTestimonial);
router.patch("/:id/approve", authenticate, authorize("super_admin"), moderateTestimonial);

// UPDATE (SuperAdmin only: users cannot edit submitted feedback)
router.put("/:id", authenticate, authorize("super_admin"), updateTestimonial);

// DELETE (SuperAdmin only)
router.delete("/:id", authenticate, authorize("super_admin"), deleteTestimonial);

module.exports = router;
