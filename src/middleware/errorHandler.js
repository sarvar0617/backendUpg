import { z } from "zod";

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Invalid request parameters",
        issues: error.issues,
      },
    });
  }

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? "Internal server error" : error.message;

  return res.status(statusCode).json({
    success: false,
    error: { message },
  });
};
