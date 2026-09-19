import { contactMessageTemplate } from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import { contactSchema } from "../validation/contact.validation.js";

// Messages from the public contact form are forwarded to the support inbox. They
// are not persisted, so there is no store of visitor data to protect.
const sendContactMessage = async (req, res, next) => {
  try {
    const result = contactSchema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(", ");
      return res.status(400).json({ success: false, message: messages });
    }
    const { name, email, subject, message } = result.data;

    const supportInbox = process.env.EMAIL_USER;
    if (!supportInbox) {
      console.error("Contact form is not configured: EMAIL_USER is missing");
      return res.status(500).json({
        success: false,
        message: "Messaging is not available right now. Please try again later.",
      });
    }

    try {
      await sendEmail({
        email: supportInbox,
        subject: `Fixly contact: ${subject || "General enquiry"}`,
        message: contactMessageTemplate({ name, email, subject, message }),
      });
    } catch (emailError) {
      console.error("Contact email failed to send:", emailError.message);
      return res.status(500).json({
        success: false,
        message: "Could not send your message. Please try again later.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Thanks for reaching out. We will get back to you shortly.",
    });
  } catch (error) {
    console.error("Error sending contact message:", error);
    error.statusCode = 500;
    next(error);
  }
};

export { sendContactMessage };
