export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user exists on the request (set by authMiddleware)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      // Check if the user's role is in the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: insufficient permissions'
        });
      }
      
      // User has the required role, continue
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Role verification error'
      });
    }
  };
};