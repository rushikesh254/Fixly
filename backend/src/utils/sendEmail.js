import nodemailer from "nodemailer";

// utility function to send email using nodemailer

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g., "smtp.gmail.com" for Gmail OR mailtrap.io for testing
    port: Number(process.env.EMAIL_PORT), //
    auth: {
      user: process.env.EMAIL_USER, // email address to send email from (e.g., "
      pass: process.env.EMAIL_PASS, // password for the email address or app password if using Gmail with 2FA enabled)
    },
  });

  const mailOptions = {
    from: `Fixly Team <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
