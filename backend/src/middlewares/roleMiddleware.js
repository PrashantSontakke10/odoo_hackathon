exports.authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Current role (${req.user ? req.user.role : 'Unknown'}) is not authorized to access this route.` 
            });
        }
        next();
    };
};
