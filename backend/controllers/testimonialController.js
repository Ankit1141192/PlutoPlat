
const mongoose = require("mongoose");
const Testimonial = require("../models/Testimonial");

// CREATE TESTIMONIAL
exports.createTestimonial = async (req, res) => {
  try {
    const { name, rating, imageUrl, company, role, message } = req.body;

    const testimonial = await Testimonial.create({
      name,
      rating,
      imageUrl,
      company,
      role,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: testimonial,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to create testimonial",
      error: error.message,
    });
  }
};

// GET ALL TESTIMONIALS
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
      error: error.message,
    });
  }
};

// GET SINGLE TESTIMONIAL
exports.getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID",
      });
    }

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch testimonial",
      error: error.message,
    });
  }
};

// UPDATE TESTIMONIAL
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID",
      });
    }

    const allowedFields = [
      "name",
      "rating",
      "imageUrl",
      "company",
      "role",
      "message",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to update testimonial",
      error: error.message,
    });
  }
};

// DELETE TESTIMONIAL
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID",
      });
    }

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
      error: error.message,
    });
  }
};
