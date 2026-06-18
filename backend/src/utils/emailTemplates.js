const verifyEmailTemplate = (url) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Fixly</h1>
      </div>
      <div style="padding: 30px; background-color: #f9fafb;">
        <h2 style="color: #1f2937;">Verify Your Email</h2>
        <p style="color: #6b7280; line-height: 1.6;">
          Thank you for registering with Fixly. Please click the button below to verify your email address.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          If the button doesn't work, copy and paste this link in your browser:
          <br>
          <span style="color: #2563eb;">${url}</span>
        </p>
      </div>
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>&copy; 2026 Fixly. All rights reserved.</p>
      </div>
    </div>
  `;
};

const resetPasswordTemplate = (url) => {
  return `
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Fixly</h1>
      </div>
      <div style="padding: 30px; background-color: #f9fafb;">
        <h2 style="color: #1f2937;">Reset Your Password</h2>
        <p style="color: #6b7280; line-height: 1.6;">
          You requested a password reset. Click the button below to reset your password. This link expires in 15 minutes.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          If the button doesn't work, copy and paste this link in your browser:
          <br>
          <span style="color: #2563eb;">${url}</span>
        </p>
      </div>
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>&copy; 2026 Fixly. All rights reserved.</p>
      </div>
    </div>
    `;
};

export { resetPasswordTemplate, verifyEmailTemplate };
