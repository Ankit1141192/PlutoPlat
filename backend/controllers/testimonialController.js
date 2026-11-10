const mongoose = require('mongoose');
const Testimonial = require('../models/Testimonial');
const { sendNotification } = require('../utils/notificationService');

const normalizeTestimonial = (item) => {
  const t = item.toObject ? item.toObject() : item;
  const id = t._id ? t._id.toString() : (t.id || String(Date.now()));
  const author = t.client || t.name || 'Private Client';
  const text = t.content || t.message || 'Exceptional discretion and bespoke property advisory.';
  const photo = t.avatar || t.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
  const prop = t.property || t.company || 'Trophy Estate Acquisition';

  return {
    ...t,
    id,
    _id: id,
    client: author,
    name: author,
    content: text,
    message: text,
    avatar: photo,
    imageUrl: photo,
    property: prop,
    company: prop,
    rating: Number(t.rating) || 5,
    role: t.role || 'Private Investor',
  };
};

// CREATE TESTIMONIAL
exports.createTestimonial = async (req, res) => {
  try {
    const { name, client, rating, imageUrl, avatar, company, property, role, message, content } = req.body;

    const author = (name || client || '').trim();
    const text = (message || content || '').trim();

    if (!author || !text) {
      return res.status(400).json({
        success: false,
        message: 'Client name and testimonial message are required.',
      });
    }

    const testimonial = await Testimonial.create({
      name: author,
      client: author,
      rating: Number(rating) || 5,
      imageUrl: (imageUrl || avatar || '').trim(),
      avatar: (avatar || imageUrl || '').trim(),
      company: (company || property || '').trim(),
      property: (property || company || '').trim(),
      role: (role || 'Private Investor').trim(),
      message: text,
      content: text,
    });

    // Notify SuperAdmins and broadcast to community
    await sendNotification({
      recipientRole: 'super_admin',
      title: 'New Client Testimonial Received',
      message: `${author} left a ${rating || 5}★ review: "${text.substring(0, 70)}..."`,
      type: 'testimonial',
      category: 'General',
    });

    return res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: normalizeTestimonial(testimonial),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create testimonial',
      error: error.message,
    });
  }
};

// GET ALL TESTIMONIALS
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    const normalized = testimonials.map(normalizeTestimonial);

    return res.status(200).json({
      success: true,
      total: normalized.length,
      data: normalized,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
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
        message: 'Invalid testimonial ID',
      });
    }

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: normalizeTestimonial(testimonial),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonial',
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
        message: 'Invalid testimonial ID',
      });
    }

    const updates = { ...req.body };
    if (updates.name && !updates.client) updates.client = updates.name;
    if (updates.client && !updates.name) updates.name = updates.client;
    if (updates.content && !updates.message) updates.message = updates.content;
    if (updates.message && !updates.content) updates.content = updates.message;
    if (updates.avatar && !updates.imageUrl) updates.imageUrl = updates.avatar;
    if (updates.imageUrl && !updates.avatar) updates.avatar = updates.imageUrl;
    if (updates.property && !updates.company) updates.company = updates.property;
    if (updates.company && !updates.property) updates.property = updates.company;

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
        message: 'Testimonial not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: normalizeTestimonial(testimonial),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update testimonial',
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
        message: 'Invalid testimonial ID',
      });
    }

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial',
      error: error.message,
    });
  }
};
