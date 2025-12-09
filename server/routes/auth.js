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
        
        // SECURITY: For production, use httpOnly cookies or server-side sessions
        // This implementation redirects to frontend with token as URL parameter
        // which should only be used for development/POC
        
        // TODO: Production approach:
        // 1. Store token in httpOnly cookie or server-side session
        // 2. Redirect to frontend without token in URL
        // 3. Frontend makes authenticated requests with cookies
        
        // For development: redirect to frontend with token
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
        const redirectUrl = `${frontendUrl}/?token=${encodeURIComponent(tokenResponse.accessToken)}&user=${encodeURIComponent(JSON.stringify(tokenResponse.account))}`;
        
        res.redirect(redirectUrl);
        
    } catch (error) {
        console.error('Error handling callback:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
        res.redirect(`${frontendUrl}/?error=authentication_failed`);
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
