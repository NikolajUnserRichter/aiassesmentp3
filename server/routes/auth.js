/**
 * Authentication Routes
 * Azure AD OAuth2 login/logout endpoints
 */

const express = require('express');
const router = express.Router();
const { getAuthCodeUrl, acquireTokenByCode } = require('../config/auth');

/**
 * GET /auth/login
 * Redirect to Azure AD login page
 */
router.get('/login', async (req, res) => {
    try {
        const authUrl = await getAuthCodeUrl();
        res.redirect(authUrl);
    } catch (error) {
        console.error('Error generating auth URL:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to initiate login'
        });
    }
});

/**
 * GET /auth/callback
 * Handle OAuth2 callback from Azure AD
 */
router.get('/callback', async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Authorization code not provided'
            });
        }
        
        const tokenResponse = await acquireTokenByCode(code);
        
        // In a production app, you'd want to:
        // 1. Store the token in a session or JWT
        // 2. Redirect to the frontend with the token
        // 3. Use httpOnly cookies for security
        
        // For this implementation, we'll return the token as JSON
        // The frontend can store it and use it for API calls
        res.json({
            accessToken: tokenResponse.accessToken,
            idToken: tokenResponse.idToken,
            account: tokenResponse.account,
            expiresOn: tokenResponse.expiresOn,
        });
        
    } catch (error) {
        console.error('Error handling callback:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Authentication failed'
        });
    }
});

/**
 * GET /auth/logout
 * Logout user (client-side token removal)
 */
router.get('/logout', (req, res) => {
    // With Azure AD, logout happens client-side by clearing the token
    // You can optionally redirect to Azure AD logout endpoint
    const logoutUrl = `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/logout`;
    res.json({
        message: 'Logged out successfully',
        logoutUrl: logoutUrl
    });
});

/**
 * GET /auth/me
 * Get current user information from token
 */
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No access token provided'
            });
        }
        
        const token = authHeader.substring(7);
        
        // Decode JWT token to get user info
        const { getUserFromToken } = require('../middleware/auth');
        const user = getUserFromToken(token);
        
        if (!user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid token'
            });
        }
        
        res.json({ user });
        
    } catch (error) {
        console.error('Error getting user info:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to get user information'
        });
    }
});

module.exports = router;
