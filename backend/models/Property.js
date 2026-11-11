const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [250, 'Title cannot exceed 250 characters'],
    },

    slug: {
      type: String,
      trim: true,
      default: '',
    },

    subtitle: {
      type: String,
      trim: true,
      default: '',
    },

    description: {
      type: String,
      trim: true,
      default: '',
    },

    propertyType: {
      type: String,
      trim: true,
      default: 'villa',
      lowercase: true,
    },

    type: {
      type: String,
      trim: true,
      default: 'Villas',
    },

    listingType: {
      type: String,
      enum: ['sale', 'rent', 'buy', 'Buy', 'Rent'],
      default: 'sale',
    },

    purpose: {
      type: String,
      trim: true,
      default: 'Buy',
    },

    price: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Property price is required'],
      index: true,
    },

    numericPrice: {
      type: Number,
      default: 0,
      index: true,
    },

    beds: {
      type: Number,
      default: 3,
    },

    baths: {
      type: Number,
      default: 3,
    },

    sqft: {
      type: String,
      default: '',
    },

    lotSize: {
      type: String,
      default: '',
    },

    yearBuilt: {
      type: Number,
      default: 2024,
    },

    garage: {
      type: String,
      default: '',
    },

    // Property location
    location: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        address: 'Prime Corridor',
        city: 'Kanpur',
        state: 'Uttar Pradesh',
        country: 'India',
        pincode: '208001',
      }),
    },

    // Geo Coordinates for Leaflet Map
    coordinates: {
      lat: {
        type: Number,
        default: 26.474,
      },
      lng: {
        type: Number,
        default: 80.335,
      },
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    image: {
      type: String,
      trim: true,
      default: '',
    },

    images: {
      type: [{
        type: String,
        trim: true,
      }],
      default: [],
    },

    features: {
      type: [String],
      default: [],
    },

    amenities: {
      type: [String],
      default: [],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ['draft', 'pending', 'active', 'approved', 'rejected'],
      default: 'active',
      index: true,
    },

    rejectionReason: {
      type: String,
      default: '',
      trim: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isPromoted: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
    },

    agent: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
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
propertySchema.virtual('id').get(function () {
  return this._id ? this._id.toString() : '';
});

// Sync image, numericPrice, location before save
propertySchema.pre('save', function () {
  if (!this.image && this.images && this.images.length > 0) {
    this.image = this.images[0];
  }
  if (!this.images || this.images.length === 0) {
    if (this.image) {
      this.images = [this.image];
    }
  }

  // Sync numericPrice
  if (typeof this.price === 'number') {
    this.numericPrice = this.price;
  } else if (typeof this.price === 'string') {
    const parsed = parseInt(this.price.replace(/[^\d]/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) {
      this.numericPrice = parsed;
    }
  }

  if (this.featured) this.isFeatured = true;
  if (this.isFeatured) this.featured = true;

  if (this.status === 'approved') this.status = 'active';
});

// Format normalized JSON for frontend
propertySchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();

  // Ensure location string for frontend components that expect string
  if (typeof obj.location === 'object' && obj.location !== null) {
    const loc = obj.location;
    obj.locationString = `${loc.city || ''}${loc.state ? ', ' + loc.state : ''}`.trim() || loc.address || 'Civil Lines, Kanpur';
    obj.address = loc.address || obj.locationString;
    obj.city = loc.city || '';
  } else if (typeof obj.location === 'string') {
    obj.locationString = obj.location;
    obj.address = obj.location;
  }

  if (!obj.image && obj.images && obj.images.length > 0) {
    obj.image = obj.images[0];
  }

  if (!obj.numericPrice && typeof obj.price === 'number') {
    obj.numericPrice = obj.price;
  }

  return obj;
};

// Search indexes
propertySchema.index({
  'location.city': 1,
  'location.state': 1,
});

propertySchema.index({
  title: 'text',
  description: 'text',
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
