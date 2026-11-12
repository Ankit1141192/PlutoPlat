const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      validate: {
        validator: (value) => {
          if (!value) return false;
          const cleaned = value.replace(/[\s\-\(\)]/g, '');
          return /^\+?[0-9]{10,15}$/.test(cleaned);
        },
        message: 'Please enter a valid phone number (at least 10 digits)',
      },
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must contain at least 8 characters'],
      select: false,
    },

    profileImage: {
      type: String,
      default:
        'https://res.cloudinary.com/dxjv6gq3f/image/upload/v1698250910/PlutoPlat/user-icon-1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1.png',
    },

    agency: {
      type: String,
      trim: true,
      default: '',
    },

    rera: {
      type: String,
      trim: true,
      default: '',
    },

    bio: {
      type: String,
      trim: true,
      default: '',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // User's current or registered location
    location: {
      address: {
        type: String,
        trim: true,
        default: '',
      },

      landmark: {
        type: String,
        trim: true,
        default: '',
      },

      city: {
        type: String,
        trim: true,
        default: '',
        index: true,
      },

      state: {
        type: String,
        trim: true,
        default: '',
      },

      country: {
        type: String,
        trim: true,
        default: 'India',
      },

      pincode: {
        type: String,
        trim: true,
        default: '',
      },

      coordinates: {
        latitude: {
          type: Number,
          default: null,
        },

        longitude: {
          type: Number,
          default: null,
        },
      },
    },

    savedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],

    role: {
      type: String,
      enum: ['user', 'admin', 'super_admin'],
      default: 'user',
    },

    subscriptionTier: {
      type: String,
      default: 'free',
    },

    // Security & Account Lockout
    loginAttempts: {
      type: Number,
      default: 0,
      required: true,
      select: false,
    },

    lockUntil: {
      type: Date,
      default: null,
      select: false,
    },

    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      select: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Maximum 2 concurrent device sessions tracking
    activeSessions: {
      type: [
        {
          sessionId: { type: String, required: true },
          deviceInfo: { type: String, default: '' },
          ip: { type: String, default: '' },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual avatar property mapping to profileImage
userSchema.virtual('avatar').get(function () {
  return this.profileImage;
});

userSchema.virtual('avatar').set(function (val) {
  this.profileImage = val;
});

// Sanitize phone and hash password before saving
userSchema.pre('save', async function () {
  if (this.phone) {
    this.phone = this.phone.replace(/[\s\-\(\)]/g, '');
  }
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if account is currently locked
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Calculate remaining lock minutes
userSchema.methods.getLockRemainingMinutes = function () {
  if (!this.lockUntil) return 0;
  const remainingMs = new Date(this.lockUntil).getTime() - Date.now();
  return Math.max(1, Math.ceil(remainingMs / (60 * 1000)));
};

// Handle failed login attempt (locks for 30 minutes after 5 attempts)
userSchema.methods.handleFailedLogin = async function () {
  if (this.lockUntil && this.lockUntil <= Date.now()) {
    this.loginAttempts = 1;
    this.lockUntil = null;
    return this.constructor.updateOne({ _id: this._id }, { loginAttempts: 1, lockUntil: null });
  }

  const attempts = (this.loginAttempts || 0) + 1;
  this.loginAttempts = attempts;
  let lockUntil = null;

  if (attempts >= 5) {
    lockUntil = new Date(Date.now() + 30 * 60 * 1000);
    this.lockUntil = lockUntil;
  }

  return this.constructor.updateOne({ _id: this._id }, { loginAttempts: attempts, lockUntil });
};

// Reset login attempts on successful login
userSchema.methods.handleSuccessfulLogin = async function () {
  this.loginAttempts = 0;
  this.lockUntil = null;
  this.lastLogin = new Date();
  return this.constructor.updateOne(
    { _id: this._id },
    { loginAttempts: 0, lockUntil: null, lastLogin: this.lastLogin }
  );
};

// Generate signed JWT token with optional sessionId for concurrent device control
userSchema.methods.generateAuthToken = function (sessionId = null) {
  const secret = process.env.JWT_SECRET || 'PlutoPlatSecureSecretKey2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  const payload = {
    id: this._id,
    email: this.email,
    role: this.role,
  };

  if (sessionId) {
    payload.sessionId = sessionId;
  }

  return jwt.sign(payload, secret, { expiresIn });
};

// Exclude sensitive data from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  obj.avatar = obj.profileImage;
  delete obj.password;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
