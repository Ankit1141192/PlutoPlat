const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property ID is required'],
      index: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer ID is required'],
      index: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller ID is required'],
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => /^\+?[1-9]\d{9,14}$/.test(value),
        message: 'Invalid phone number',
      },
    },

    message: {
      type: String,
      required: [true, 'Enquiry message is required'],
      trim: true,
      minlength: 5,
      maxlength: 2000,
    },

    enquiryType: {
      type: String,
      enum: [
        'property_information',
        'site_visit',
        'price_negotiation',
        'buying',
        'renting',
        'other',
      ],
      default: 'property_information',
    },

    status: {
      type: String,
      enum: [
        'pending',
        'contacted',
        'interested',
        'not_interested',
        'closed',
        'cancelled',
      ],
      default: 'pending',
      index: true,
    },

    siteVisit: {
      requested: {
        type: Boolean,
        default: false,
      },

      date: {
        type: Date,
        default: null,
      },

      notes: {
        type: String,
        default: '',
        trim: true,
      },
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    adminNotes: {
      type: String,
      default: '',
      trim: true,
    },

    source: {
      type: String,
      enum: ['website', 'mobile_app', 'admin', 'other'],
      default: 'website',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Seller dashboard enquiries
enquirySchema.index({
  seller: 1,
  status: 1,
  createdAt: -1,
});

// Buyer dashboard enquiries
enquirySchema.index({
  buyer: 1,
  createdAt: -1,
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;