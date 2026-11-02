const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    description: {
      type: String,
      required: [true, 'Property description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
    },

    propertyType: {
      type: String,
      enum: [
        'plot', 'house', 'apartment', 'townhouse',
        'land', 'commercial', 'villa', 'penthouse',
        'farmhouse', 'cottage', 'bungalow',
      ],
      required: [true, 'Property type is required'],
      lowercase: true,
    },

    listingType: {
      type: String,
      enum: ['sale', 'rent'],
      required: true,
    },

    price: {
      type: Number,
      required: [true, 'Property price is required'],
      min: [1, 'Price must be greater than zero'],
      index: true,
    },

    // Property location
    location: {
      landmark: {
        type: String,
        trim: true,
        default: '',
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },

      town: {
        type: String,
        trim: true,
        default: '',
      },

      village: {
        type: String,
        trim: true,
        default: '',
      },

      locality: {
        type: String,
        trim: true,
        default: '',
      },

      areaType: {
        type: String,
        enum: ['city', 'town', 'village', 'suburb', 'rural'],
        default: 'city',
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        required: true,
        trim: true,
        default: 'India',
      },

      pincode: {
        type: String,
        required: true,
        validate: {
          validator: (value) => /^[1-9][0-9]{5}$/.test(value),
          message: 'Enter a valid 6-digit Indian PIN code',
        },
      },

      coordinates: {
        latitude: {
          type: Number,
          required: true,
          min: -90,
          max: 90,
        },

        longitude: {
          type: Number,
          required: true,
          min: -180,
          max: 180,
        },
      },
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    images: {
      type: [{
        type: String,
        trim: true,
      }],
      required: true,
      validate: {
        validator: (images) => images.length > 0,
        message: 'At least one property image is required',
      },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPromoted: {
      type: Boolean,
      default: false,
    },

    promotionEndDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Search and filtering indexes
propertySchema.index({
  'location.city': 1,
  'location.state': 1,
});

propertySchema.index({
  propertyType: 1,
  listingType: 1,
  price: 1,
});

propertySchema.index({
  isAvailable: 1,
  isVerified: 1,
});

propertySchema.index({
  'location.coordinates': '2dsphere',
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;