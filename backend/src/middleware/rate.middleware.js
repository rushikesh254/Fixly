import rateLimit from "express-rate-limit";

// Rate limiting middleware

// Rate limiter for authentication routes to prevent brute-force attacks.
// Kept low enough to stop credential stuffing but high enough that switching
// between accounts during normal use does not lock anyone out.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs( 15 minutes )
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Rate limiter for refresh-token endpoint
// Higher limit because access tokens expire every 15 minutes and the
// frontend may hit this endpoint across multiple tabs / parallel requests.
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // limit each IP to 60 requests per windowMs
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

// General API rate limiter for all other routes.
// The dashboards fetch several resources per page view, so a low ceiling would
// lock a single user out during normal browsing. Abuse protection for the
// sensitive endpoints is handled by authLimiter above.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (15 minutes )
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Rate limiter for the public contact form to stop it being used as a mail relay
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 messages per hour
  message: {
    success: false,
    message: "Too many messages sent. Please try again later.",
  },
});

export { apiLimiter, authLimiter, contactLimiter, refreshLimiter };
