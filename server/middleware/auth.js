/**
 * Authentication Middleware
 * Validates Azure AD access tokens for API requests
 */

const { verifyToken } = require('../config/auth');

/**
 * Middleware to check if user is authenticated via Azure AD
 */
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No access token provided'
            });
        }
        
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        const isValid = await verifyToken(token);
        
        if (!isValid) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid or expired access token'
            });
        }
        
        // Attach token to request for use in routes
        req.accessToken = token;
        
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Authentication failed'
        });
    }
};

/**
 * Extract user information from access token
 * This should decode the JWT token to get user claims
 */
const getUserFromToken = (token) => {
    try {
        // Decode JWT token (base64 decode the payload)
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token format');
        }
        
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        
        return {
            userId: payload.oid || payload.sub, // Object ID or Subject
            email: payload.email || payload.preferred_username || payload.upn,
            name: payload.name,
        };
    } catch (error) {
        console.error('Error extracting user from token:', error);
        return null;
    }
};

module.exports = {
    requireAuth,
    getUserFromToken,
};
