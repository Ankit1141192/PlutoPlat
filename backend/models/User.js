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
        validator: (value) => /^\+?[1-9]\d{9,14}$/.test(value),
        message: 'Please enter a valid phone number',
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
        validate: {
          validator: (value) =>
            value === '' || /^[1-9][0-9]{5}$/.test(value),
          message: 'Enter a valid 6-digit Indian PIN code',
        },
      },

      coordinates: {
        latitude: {
          type: Number,
          min: -90,
          max: 90,
        },

        longitude: {
          type: Number,
          min: -180,
          max: 180,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
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
  // If a previous lock expired, reset counter
  if (this.lockUntil && this.lockUntil <= Date.now()) {
    this.loginAttempts = 1;
    this.lockUntil = null;
    return this.save();
  }

  this.loginAttempts = (this.loginAttempts || 0) + 1;

  // After 5 attempts, lock for 30 minutes
  if (this.loginAttempts >= 5) {
    this.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
  }

  return this.save();
};

// Reset login attempts on successful login
userSchema.methods.handleSuccessfulLogin = async function () {
  this.loginAttempts = 0;
  this.lockUntil = null;
  this.lastLogin = new Date();
  return this.save();
};

// Generate signed JWT token
userSchema.methods.generateAuthToken = function () {
  const secret = process.env.JWT_SECRET || 'PlutoPlatSecureSecretKey2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    secret,
    { expiresIn }
  );
};

// Exclude sensitive data from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
