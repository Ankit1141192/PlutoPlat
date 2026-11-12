const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },

    client: {
      type: String,
      trim: true,
      default: '',
    },

    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: 5,
    },

    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },

    avatar: {
      type: String,
      trim: true,
      default: '',
    },

    company: {
      type: String,
      trim: true,
      default: '',
    },

    property: {
      type: String,
      trim: true,
      default: '',
    },

    role: {
      type: String,
      trim: true,
      default: 'Private Client',
    },

    message: {
      type: String,
      trim: true,
      default: '',
    },

    content: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual id matching _id
testimonialSchema.virtual('id').get(function () {
  return this._id ? this._id.toString() : '';
});

// Sync aliases before save
testimonialSchema.pre('save', function (next) {
  const author = this.client || this.name || 'Private Client';
  this.client = author;
  this.name = author;

  const text = this.content || this.message || 'Exceptional discretion and bespoke property advisory.';
  this.content = text;
  this.message = text;

  const photo = this.avatar || this.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
  this.avatar = photo;
  this.imageUrl = photo;

  const affiliation = this.property || this.company || 'Trophy Estate Acquisition';
  this.property = affiliation;
  this.company = affiliation;

  if (typeof next === 'function') {
    return next();
  }
});

// Format normalized JSON for frontend
testimonialSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  obj.client = obj.client || obj.name;
  obj.name = obj.name || obj.client;
  obj.content = obj.content || obj.message;
  obj.message = obj.message || obj.content;
  obj.avatar = obj.avatar || obj.imageUrl;
  obj.imageUrl = obj.imageUrl || obj.avatar;
  obj.property = obj.property || obj.company;
  obj.company = obj.company || obj.property;
  return obj;
};

module.exports = mongoose.model('Testimonial', testimonialSchema);
