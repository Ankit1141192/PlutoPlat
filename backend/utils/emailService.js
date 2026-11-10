const nodemailer = require('nodemailer');

/**
 * Configure Nodemailer SMTP Transporter using Gmail App Password
 */
const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'ankit2914978@gmail.com',
      pass: (process.env.EMAIL_PASS || 'bslh bndk sglu tlmb').trim(),
    },
  });
};

/**
 * Send Luxury HTML Password Reset Email
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.name - Recipient user name
 * @param {string} options.resetUrl - Full URL to ResetPassword.jsx (e.g. https://domain/reset-password?token=XYZ)
 * @param {string} options.resetToken - Raw verification token
 * @param {string} options.portalName - 'Client Desk', 'Broker Workstation', or 'SuperAdmin Executive Control'
 */
const sendPasswordResetEmail = async ({ to, name, resetUrl, resetToken, portalName = 'PlutoPlat Portal' }) => {
  try {
    const transporter = getTransporter();
    const recipientName = name ? name.trim() : 'Member';
    const senderEmail = process.env.EMAIL_USER || 'ankit2914978@gmail.com';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your PlutoPlat Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0D0B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F7F5F0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0A0D0B; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #121714; border: 1px solid #28332A; border-radius: 4px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
          
          <!-- Gold Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #B49A70, #DFC59B, #B49A70);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 36px 36px 20px; text-align: center; border-bottom: 1px solid #1E2720;">
              <div style="font-family: Georgia, serif; font-size: 26px; letter-spacing: 0.15em; font-weight: bold; color: #FFFFFF; text-transform: uppercase;">
                PLUTO<span style="color: #B49A70;">PLAT</span>
              </div>
              <div style="font-size: 11px; letter-spacing: 0.25em; color: #B49A70; text-transform: uppercase; margin-top: 6px; font-weight: 600;">
                ${portalName}
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 36px 24px;">
              <h1 style="font-family: Georgia, serif; font-size: 22px; font-weight: normal; color: #FFFFFF; margin: 0 0 16px; line-height: 1.4;">
                Password Recovery Request
              </h1>
              
              <p style="font-size: 14px; line-height: 1.6; color: #BBB8AD; margin: 0 0 20px;">
                Dear <strong style="color: #FFFFFF;">${recipientName}</strong>,
              </p>
              
              <p style="font-size: 14px; line-height: 1.6; color: #BBB8AD; margin: 0 0 28px;">
                We received an authorized request to reset the security credentials for your <strong style="color: #DFC59B;">${portalName}</strong> account. Please click the button below to open your reset password console and configure a new master password.
              </p>

              <!-- Reset Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 30px;">
                <tr>
                  <td align="center" style="background-color: #B49A70; border-radius: 2px;">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 34px; font-size: 13px; font-weight: 700; letter-spacing: 0.15em; color: #0A0D0B; text-decoration: none; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback Token Card -->
              <div style="background-color: #0E1310; border: 1px solid #243026; border-radius: 4px; padding: 18px; margin-bottom: 24px;">
                <div style="font-size: 11px; letter-spacing: 0.15em; color: #B49A70; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">
                  Verification Token (15-Minute Expiry)
                </div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 13px; color: #52E5A3; word-break: break-all; background-color: #070908; padding: 10px; border-radius: 2px; border: 1px solid #1A241D;">
                  ${resetToken}
                </div>
                <div style="font-size: 11px; color: #8F8C81; margin-top: 8px; line-height: 1.4;">
                  If the button does not open automatically, copy this token into the verification input on the Reset Password page.
                </div>
              </div>

              <!-- Direct Link -->
              <p style="font-size: 12px; line-height: 1.5; color: #7A776D; margin: 0 0 10px;">
                Direct URL:
              </p>
              <p style="font-size: 11px; color: #B49A70; word-break: break-all; margin: 0 0 24px;">
                <a href="${resetUrl}" style="color: #B49A70; text-decoration: underline;">${resetUrl}</a>
              </p>

              <!-- Warning -->
              <div style="border-top: 1px solid #1E2720; padding-top: 20px; font-size: 12px; line-height: 1.5; color: #8F8C81;">
                <strong>Security Notice:</strong> This link and token expire in 15 minutes. If you did not initiate this request, your account is safe and no changes have been applied. Please disregard this notice.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #0A0D0B; text-align: center; border-top: 1px solid #1E2720;">
              <p style="font-size: 11px; color: #5E5B52; margin: 0 0 6px;">
                &copy; 2026 PlutoPlat Sovereign Real Estate Advisory. All rights reserved.
              </p>
              <p style="font-size: 10px; color: #4A4740; margin: 0;">
                Confidential Automated Telemetry &bull; Kanpur &bull; New Delhi &bull; Mumbai &bull; Dubai
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const info = await transporter.sendMail({
      from: `"PlutoPlat Sovereign Real Estate" <${senderEmail}>`,
      to,
      subject: `[PlutoPlat] Reset Your Password — ${portalName}`,
      text: `Hello ${recipientName},\n\nYou requested a password reset for your ${portalName} account.\n\nClick the link below to set your new password:\n${resetUrl}\n\nOr use this verification token: ${resetToken}\n\nThis token will expire in 15 minutes.\n\nPlutoPlat Security Team`,
      html: htmlContent,
    });

    console.log(`[Email Service] Password reset email delivered to ${to} (MessageID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email Service Error] Failed to send email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
};
