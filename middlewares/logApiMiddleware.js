// Define your API token
const API_TOKEN = process.env.API_TOKEN || 'YOUR_API_TOKEN_CVAR';

const logApiMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied, token not provided' });

    if (token === API_TOKEN) {
        next();
    } else {
        // Return a 400 error if the token is not valid
        res.status(400).json({ message: 'Invalid Token' });
    }

};

module.exports = logApiMiddleware;
