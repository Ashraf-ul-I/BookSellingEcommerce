import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const token = req.cookies.token; // Assuming the token is stored in cookies
    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token with your secret
        req.user = decoded; // Attach user info (e.g., { _id, email }) to req.user
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token." });
    }
};
