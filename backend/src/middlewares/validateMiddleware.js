export const validateMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      // Validate the request body against the schema
      const result = schema.safeParse(req.body);

      if (!result.success) {
        // Format Zod errors into a more readable format
        const formattedErrors = result.error.errors.map((error) => ({
          path: error.path.join("."),
          message: error.message
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: formattedErrors
        });
      }

      // Validation successful, replace req.body with validated data
      req.body = result.data;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Validation error: ${error.message}`
      });
    }
  };
};
