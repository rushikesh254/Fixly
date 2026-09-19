import nodemailer from "nodemailer";

// Universal email sender:
// 1. If RESEND_API_KEY is configured, sends via Resend REST API over HTTPS (port 443)
//    which works on ALL cloud hosts (Render, Vercel, AWS, etc.) without any firewall blocks.
// 2. Otherwise, uses Nodemailer SMTP with connection timeouts and flexible port support (465 SSL or 587 STARTTLS).
const sendEmail = async (options) => {
  // 1. Modern HTTP-based transactional mail (Resend)
  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Fixly <onboarding@resend.dev>",
        to: options.email,
        subject: options.subject,
        html: options.message,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Resend API error (${res.status}): ${errorText}`);
    }
    return;
  }

  // 2. Standard SMTP (Gmail, Mailtrap, etc.)
  const port = Number(process.env.EMAIL_PORT) || 465;
  const isSecure = port === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: port,
    secure: isSecure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
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
