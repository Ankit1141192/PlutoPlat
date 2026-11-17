const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: false,
      default: null,
      index: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
      index: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
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
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: [true, 'Enquiry message is required'],
      trim: true,
      maxlength: 2000,
    },

    propertyTitle: {
      type: String,
      default: '',
      trim: true,
    },

    budget: {
      type: String,
      default: '',
      trim: true,
    },

    enquiryType: {
      type: String,
      default: 'property_information',
    },

    status: {
      type: String,
      default: 'incompleted',
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
