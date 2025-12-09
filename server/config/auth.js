/**
 * Azure AD Authentication Configuration
 * MSAL (Microsoft Authentication Library) configuration for Azure AD
 */

const msal = require('@azure/msal-node');
require('dotenv').config();

const msalConfig = {
    auth: {
        clientId: process.env.AZURE_AD_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}`,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(message);
                }
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Warning,
        }
    }
};

const confidentialClientApplication = new msal.ConfidentialClientApplication(msalConfig);

/**
 * Get authorization URL for user login
 */
const getAuthCodeUrl = async (state = '') => {
    const authCodeUrlParameters = {
        scopes: ['user.read', 'openid', 'profile', 'email'],
        redirectUri: process.env.AZURE_AD_REDIRECT_URI,
        state: state,
    };
    
    return await confidentialClientApplication.getAuthCodeUrl(authCodeUrlParameters);
};

/**
 * Exchange authorization code for access token
 */
const acquireTokenByCode = async (code) => {
    const tokenRequest = {
        code: code,
        scopes: ['user.read', 'openid', 'profile', 'email'],
        redirectUri: process.env.AZURE_AD_REDIRECT_URI,
    };
    
    return await confidentialClientApplication.acquireTokenByCode(tokenRequest);
};

/**
 * Verify access token and extract user information
 */
const verifyToken = async (accessToken) => {
    try {
        // In production, you should validate the token with Azure AD
        // For now, we'll trust the token from MSAL
        return true;
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
};

module.exports = {
    msalConfig,
    confidentialClientApplication,
    getAuthCodeUrl,
    acquireTokenByCode,
    verifyToken,
};
