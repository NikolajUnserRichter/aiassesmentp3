# Frontend Integration Guide

This document describes the changes needed in the frontend to integrate with the backend API and Azure AD authentication.

## Overview

The frontend needs to be updated to:
1. Authenticate users via Azure AD
2. Store and manage access tokens
3. Save assessments to the backend database
4. Retrieve and display saved assessments

**SECURITY NOTE**: This implementation uses sessionStorage for token storage and URL parameters for token passing. This is suitable for development/POC but has security implications:
- Tokens in sessionStorage are vulnerable to XSS attacks
- Tokens in URL parameters may be logged in browser history
- For production, use httpOnly cookies or implement a more secure session management system

## Authentication Flow

### 1. Login Process

```javascript
// User clicks login button
async function login() {
    // Redirect to backend login endpoint
    window.location.href = 'http://localhost:3000/auth/login';
}
```

### 2. Handle Callback

After Azure AD authentication, the user is redirected to `/auth/callback`, which returns the access token. You need to:

1. Create a callback page (or handle in existing page)
2. Extract the token from the response
3. Store the token securely
4. Redirect to the main application

```javascript
// In callback handler or main page
async function handleAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Backend redirects with token as URL parameter
    const token = urlParams.get('token');
    const userStr = urlParams.get('user');
    
    if (token) {
        // Store access token (NOTE: sessionStorage is vulnerable to XSS)
        sessionStorage.setItem('accessToken', token);
        if (userStr) {
            sessionStorage.setItem('user', decodeURIComponent(userStr));
        }
        
        // Remove tokens from URL for security
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}
```

### 3. Check Authentication Status

```javascript
function isAuthenticated() {
    return sessionStorage.getItem('accessToken') !== null;
}

function getAccessToken() {
    return sessionStorage.getItem('accessToken');
}

function logout() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    window.location.href = 'http://localhost:3000/auth/logout';
}
```

## API Integration

### 1. Save Assessment

Update the `calculateRisk()` function to save to backend:

```javascript
async function saveAssessmentToBackend(assessment) {
    const token = getAccessToken();
    
    if (!token) {
        console.error('User not authenticated');
        return null;
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/assessments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(assessment)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save assessment');
        }
        
        const data = await response.json();
        return data.assessment;
    } catch (error) {
        console.error('Error saving assessment:', error);
        return null;
    }
}

// Modify calculateRisk() to save to backend
function calculateRisk() {
    const projectType = getSelectedValues('projectType');
    const aiTool = getSelectedValues('aiTool');
    const aiUseCases = getSelectedValues('aiUseCase');
    const dataTypes = getSelectedValues('dataType');
    const autonomy = getSelectedValues('autonomy');
    const impact = getSelectedValues('impact');
    const transparency = getSelectedValues('transparency');
    
    if (!projectType || !aiTool || aiUseCases.length === 0 || dataTypes.length === 0 || !autonomy || !impact || !transparency) {
        return;
    }
    
    currentAssessment = performAssessment(projectType, aiTool, aiUseCases, dataTypes, autonomy, impact, transparency);
    updateResults(currentAssessment);
    
    // Save to backend if authenticated
    if (isAuthenticated()) {
        saveAssessmentToBackend(currentAssessment).then(savedAssessment => {
            if (savedAssessment) {
                console.log('Assessment saved successfully', savedAssessment);
                currentAssessment.id = savedAssessment.id;
            }
        });
    }
    
    // Automatically navigate to results tab
    setTimeout(() => {
        showTab('results');
    }, AUTO_NAVIGATION_DELAY_MS);
}
```

### 2. Load Previous Assessments

```javascript
async function loadUserAssessments() {
    const token = getAccessToken();
    
    if (!token) {
        return [];
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/assessments', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load assessments');
        }
        
        const data = await response.json();
        return data.assessments;
    } catch (error) {
        console.error('Error loading assessments:', error);
        return [];
    }
}

// Display previous assessments
async function displayPreviousAssessments() {
    const assessments = await loadUserAssessments();
    
    // Create UI to display previous assessments
    // This could be a new tab or section
    const container = document.getElementById('previousAssessments');
    
    if (assessments.length === 0) {
        container.innerHTML = '<p>No previous assessments found.</p>';
        return;
    }
    
    container.innerHTML = assessments.map(assessment => `
        <div class="assessment-item">
            <h4>${assessment.project_type}</h4>
            <p>Risk Level: ${assessment.risk_level}</p>
            <p>Date: ${new Date(assessment.created_at).toLocaleDateString()}</p>
            <button onclick="loadAssessment(${assessment.id})">View</button>
        </div>
    `).join('');
}
```

## UI Updates

### 1. Add Login/Logout Button

Add to the header or navigation:

```html
<div id="authSection">
    <!-- Show when not authenticated -->
    <button id="loginBtn" onclick="login()" style="display: none;">
        🔐 Login with Azure AD
    </button>
    
    <!-- Show when authenticated -->
    <div id="userInfo" style="display: none;">
        <span id="userName"></span>
        <button onclick="logout()">Logout</button>
    </div>
</div>
```

### 2. Update UI Based on Auth Status

```javascript
function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    
    if (isAuthenticated()) {
        const user = JSON.parse(sessionStorage.getItem('user'));
        loginBtn.style.display = 'none';
        userInfo.style.display = 'block';
        userName.textContent = user.name || user.username || 'User';
    } else {
        loginBtn.style.display = 'block';
        userInfo.style.display = 'none';
    }
}

// Call on page load
window.addEventListener('load', updateAuthUI);
```

### 3. Add Previous Assessments Tab (Optional)

```html
<div class="tabs">
    <div class="tab active" onclick="showTab('assessment')" data-tab="assessment">Assessment</div>
    <div class="tab" onclick="showTab('results')" data-tab="results">Risk Analysis</div>
    <div class="tab" onclick="showTab('measures')" data-tab="measures">Recommendations</div>
    <div class="tab" onclick="showTab('history')" data-tab="history">History</div>
</div>

<div id="history" class="tab-content">
    <div class="content">
        <h2>Previous Assessments</h2>
        <div id="previousAssessments"></div>
    </div>
</div>
```

## Configuration

### API Base URL

Create a configuration object for the API URL:

```javascript
const API_CONFIG = {
    baseUrl: 'http://localhost:3000', // Change for production
    endpoints: {
        auth: '/auth',
        assessments: '/api/assessments'
    }
};

// Use in fetch calls
fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.assessments}`, ...)
```

## Production Considerations

1. **API URL**: Update `API_CONFIG.baseUrl` for production
2. **HTTPS**: Use HTTPS in production
3. **Token Storage**: Consider using httpOnly cookies instead of sessionStorage for better security
4. **Error Handling**: Add user-friendly error messages
5. **Loading States**: Show loading indicators during API calls
6. **Offline Support**: Handle cases where backend is unavailable

## Example Full Integration

See `js/script.js` for a complete example of the integrated code.

## Testing

1. Start backend: `npm start` (in root directory)
2. Start frontend: `python3 -m http.server 8080` (or any static server)
3. Navigate to `http://localhost:8080`
4. Click login button
5. Authenticate with Azure AD
6. Complete an assessment
7. Verify it's saved in the database

## Troubleshooting

### CORS Errors
- Ensure backend is running
- Check `ALLOWED_ORIGINS` in backend `.env`

### Authentication Errors
- Verify Azure AD configuration
- Check redirect URI matches
- Ensure token is being stored and sent correctly

### API Errors
- Check browser console for errors
- Verify token is valid (not expired)
- Check network tab for request/response details
