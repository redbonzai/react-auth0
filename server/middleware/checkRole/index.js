export const checkRole = (role) => {
    return (req, res, next) => {
        const assignedRoles = req.user['http://localhost:3000/roles'];
        if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
            return next();
        } else {
            return res.status(401).send('Insufficient role')
        }
    };
}