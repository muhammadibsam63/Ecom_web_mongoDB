import crypto from 'crypto';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import AuditLog from '../models/AuditLog.js';

// Helper to send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  // Remove password from output
  user.password = undefined;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        phone: user.phone,
      },
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    // Generate email verification token (in production, send email)
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Log registration
    await AuditLog.create({
      user: user._id,
      action: 'REGISTER',
      resource: 'User',
      resourceId: user._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (user.isLocked) {
      return res.status(401).json({
        success: false,
        message: 'Account is temporarily locked. Please try again later.',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated. Contact support.',
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    await user.resetLoginAttempts();

    // Merge guest cart if guestId provided
    const guestId = req.headers['x-guest-id'];
    if (guestId) {
      const guestCart = await Cart.findOne({ guestId });
      if (guestCart && guestCart.items.length > 0) {
        let userCart = await Cart.findOne({ user: user._id });
        if (!userCart) {
          userCart = await Cart.create({ user: user._id, items: [] });
        }
        // Merge items
        for (const item of guestCart.items) {
          const existing = userCart.items.find(
            (i) =>
              i.product.toString() === item.product.toString() &&
              JSON.stringify(i.variant) === JSON.stringify(item.variant)
          );
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            userCart.items.push(item);
          }
        }
        await userCart.save();
        await Cart.deleteOne({ guestId });
      }
    }

    await AuditLog.create({
      user: user._id,
      action: 'LOGIN',
      resource: 'User',
      resourceId: user._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist', 'name slug price images rating')
      .select('-password');

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    const { currentPassword, newPassword } = req.body;

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // Don't reveal if email exists
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.',
      });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // In production: send email with reset URL
    // const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent.',
      // Only for development - remove in production
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verifyemail/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};
