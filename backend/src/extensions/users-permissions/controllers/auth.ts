/**
 * Custom auth controller for password reset
 */

import crypto from 'crypto';

export default {
  async forgotPassword(ctx) {
    const { email } = ctx.request.body;

    if (!email) {
      return ctx.badRequest('Email is required');
    }

    try {
      // Find user by email
      const user = await strapi
        .query('plugin::users-permissions.user')
        .findOne({ where: { email: email.toLowerCase() } });

      if (!user) {
        // Don't reveal if user exists for security
        return ctx.send({
          ok: true,
          message: 'If the email exists, a password reset link has been sent.',
        });
      }

      // Generate secure random token
      const resetToken = crypto.randomBytes(32).toString('hex');

      // Update user with reset token
      await strapi
        .query('plugin::users-permissions.user')
        .update({
          where: { id: user.id },
          data: { resetPasswordToken: resetToken },
        });

      // Send email with reset link
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

      try {
        await strapi.plugins.email.services.email.send({
          to: user.email,
          subject: 'Reset your password',
          html: `
            <h2>Reset Your Password</h2>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <p><a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>Or copy and paste this link into your browser:</p>
            <p>${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          `,
        });
      } catch (emailError) {
        strapi.log.error('Error sending password reset email:', emailError);
        // Still return success to not reveal if email exists
      }

      return ctx.send({
        ok: true,
        message: 'If the email exists, a password reset link has been sent.',
      });
    } catch (error) {
      strapi.log.error('Error in forgot password:', error);
      return ctx.internalServerError('An error occurred while processing your request.');
    }
  },

  async resetPassword(ctx) {
    const { code, password, passwordConfirmation } = ctx.request.body;

    if (!code || !password || !passwordConfirmation) {
      return ctx.badRequest('Code, password, and password confirmation are required');
    }

    if (password !== passwordConfirmation) {
      return ctx.badRequest('Passwords do not match');
    }

    if (password.length < 6) {
      return ctx.badRequest('Password must be at least 6 characters');
    }

    try {
      // Find user by reset token
      const user = await strapi
        .query('plugin::users-permissions.user')
        .findOne({ where: { resetPasswordToken: code } });

      if (!user) {
        return ctx.badRequest('Invalid or expired reset token');
      }

      // Hash password using bcrypt (Strapi's default)
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);

      await strapi
        .query('plugin::users-permissions.user')
        .update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            resetPasswordToken: null, // Clear the token
          },
        });

      return ctx.send({
        ok: true,
        message: 'Password has been reset successfully.',
      });
    } catch (error) {
      strapi.log.error('Error in reset password:', error);
      return ctx.internalServerError('An error occurred while resetting your password.');
    }
  },
};

