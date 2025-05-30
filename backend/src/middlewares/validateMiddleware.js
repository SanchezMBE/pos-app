export const validateMiddleware = (schema, location = "body") => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[location];
      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
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

      req[location] = result.data;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Validation error: ${error.message}`
      });
    }
  };
};
