import jwt from "jsonwebtoken";

// Authentication Middleware
export const isAuthenticated = async (req, res, next) => {
  try {
    // 1. Get JWT token from cookies
    const token = req.cookies?.token;

    // 2. Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in to continue.",
      });
    }

    // 3. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach authenticated user's details to the request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    // 5. Pass control to the next middleware or route handler
    return next();
  } catch (error) {
    // 6. Handle invalid or expired tokens
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Your session is invalid or has expired. Please log in again.",
      });
    }

    // 7. Handle unexpected server errors
    console.error("Authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
