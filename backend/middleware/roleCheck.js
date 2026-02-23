const roleCheck = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. ${req.user.role} role does not have permission to access this resource`,
            });
        }

        next();
    };
};

module.exports = roleCheck;
