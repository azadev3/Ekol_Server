const Role = require("../models/RoleModel");

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: "Səlahiyyətləndirmə məcburidir" });
      }

      const userRole = await Role.findById(user.user_role).populate("role_permissions");
      
      if (!userRole) {
        return res.status(403).json({ error: "Rol tapılmadı" });
      }
      
      const hasPermission = userRole.role_permissions.some((perm) => perm.name === requiredPermission);
      
      if (!hasPermission) {
        return res.status(403).json({ error: "Bu əməliyyat üçün icazəniz yoxdur." });
      }
      
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };
};

module.exports = checkPermission;
