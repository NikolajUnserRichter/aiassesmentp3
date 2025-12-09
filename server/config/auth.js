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
 * IMPORTANT: In production, this should validate the token with Azure AD
 */
const verifyToken = async (accessToken) => {
    try {
        // TODO: In production, implement proper token validation:
        // 1. Decode JWT header to get key ID (kid)
        // 2. Fetch Azure AD public keys from https://login.microsoftonline.com/{tenant}/discovery/v2.0/keys
        // 3. Verify signature using the appropriate public key
        // 4. Validate claims (issuer, audience, expiration)
        
        // For MVP/development: decode and check basic structure
        const parts = accessToken.split('.');
        if (parts.length !== 3) {
            console.error('Invalid token format');
            return false;
        }
        
        // Decode payload
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        
        // Basic validation
        if (!payload.exp || payload.exp * 1000 < Date.now()) {
            console.error('Token expired');
            return false;
        }
        
        if (!payload.oid && !payload.sub) {
            console.error('Token missing user identifier');
            return false;
        }
        
        // TODO: Add issuer and audience validation
        // if (payload.iss !== `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`) {
        //     return false;
        // }
        
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
