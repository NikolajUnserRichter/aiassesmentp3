# P3 AI Risk Assessment Tool - Backend Setup Guide

This guide explains how to set up and configure the PostgreSQL database and Azure AD authentication for the P3 AI Risk Assessment Tool.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Azure AD tenant and application registration
- npm or yarn package manager

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

#### Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE p3_ai_assessment;

# Create user (optional)
CREATE USER p3_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE p3_ai_assessment TO p3_user;
```

#### Configure Environment Variables

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` and update the following values:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=p3_ai_assessment
DB_USER=p3_user
DB_PASSWORD=your_secure_password

# Azure AD Configuration (see next section)
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
AZURE_AD_TENANT_ID=your_tenant_id
AZURE_AD_REDIRECT_URI=http://localhost:3000/auth/callback

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
```

#### Run Database Migrations

```bash
npm run migrate
```

This will create the necessary database tables and indexes.

### 3. Azure AD Configuration

#### Register Application in Azure AD

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the details:
   - **Name**: P3 AI Risk Assessment Tool
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: Web - `http://localhost:3000/auth/callback`
5. Click **Register**

#### Configure Application

After registration:

1. **Copy Application (client) ID** and add to `.env` as `AZURE_AD_CLIENT_ID`
2. **Copy Directory (tenant) ID** and add to `.env` as `AZURE_AD_TENANT_ID`
3. Go to **Certificates & secrets**:
   - Click **New client secret**
   - Add a description and choose expiration
   - **Copy the value** and add to `.env` as `AZURE_AD_CLIENT_SECRET`
4. Go to **API permissions**:
   - Ensure these permissions are added:
     - Microsoft Graph > Delegated > User.Read
     - Microsoft Graph > Delegated > openid
     - Microsoft Graph > Delegated > profile
     - Microsoft Graph > Delegated > email
   - Click **Grant admin consent** (requires admin privileges)

#### Update Redirect URIs for Production

For production deployment, add your production redirect URI:
- Go to **Authentication** > **Platform configurations** > **Web**
- Add your production URL (e.g., `https://yourdomain.com/auth/callback`)

## Running the Application

### Development Mode

```bash
# Start backend server with auto-reload
npm run dev
```

### Production Mode

```bash
# Start backend server
npm start
```

The API server will be available at `http://localhost:3000`

### Serve Frontend

For development, you can serve the frontend using any static file server:

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js http-server (install globally: npm install -g http-server)
http-server -p 8080

# Using PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

## API Endpoints

### Authentication

- `GET /auth/login` - Initiate Azure AD login
- `GET /auth/callback` - OAuth2 callback (handles token exchange)
- `GET /auth/logout` - Logout endpoint
- `GET /auth/me` - Get current user information

### Assessments

All assessment endpoints require authentication (Bearer token).

- `POST /api/assessments` - Create new assessment
- `GET /api/assessments` - Get all assessments for current user
- `GET /api/assessments/:id` - Get specific assessment
- `DELETE /api/assessments/:id` - Delete assessment

### Health Check

- `GET /health` - Server health status

## Frontend Integration

The frontend needs to be updated to:

1. Initiate Azure AD login flow
2. Store access token (in localStorage or sessionStorage)
3. Include token in API requests
4. Save assessments to backend instead of local export

See `FRONTEND_INTEGRATION.md` for detailed integration steps.

## Database Schema

### Assessments Table

```sql
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    risk_level VARCHAR(50) NOT NULL,
    risk_score INTEGER NOT NULL,
    project_type VARCHAR(100) NOT NULL,
    ai_tool VARCHAR(100) NOT NULL,
    ai_use_cases TEXT NOT NULL,
    data_types TEXT NOT NULL,
    autonomy VARCHAR(50) NOT NULL,
    impact VARCHAR(50) NOT NULL,
    transparency VARCHAR(50) NOT NULL,
    measures JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Security Considerations

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use HTTPS in production** - Protect tokens in transit
3. **Implement token refresh** - For long-running sessions
4. **Rate limiting** - Already configured (100 requests per 15 minutes)
5. **CORS** - Configure allowed origins in production
6. **Helmet.js** - Security headers already configured
7. **Validate all inputs** - Backend validation is in place

## Troubleshooting

### Database Connection Errors

- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Ensure database exists: `psql -l`

### Azure AD Authentication Errors

- Verify all Azure AD credentials in `.env`
- Check redirect URI matches Azure AD configuration
- Ensure API permissions are granted
- Check that client secret hasn't expired

### CORS Errors

- Add your frontend URL to `ALLOWED_ORIGINS` in `.env`
- Restart the backend server after changes

## Production Deployment

### Environment Variables

Set all environment variables in your production environment:
- Use secure, randomly generated secrets
- Use production Azure AD redirect URIs
- Configure production database connection
- Set `NODE_ENV=production`

### Database

- Use managed PostgreSQL service (Azure Database for PostgreSQL, AWS RDS, etc.)
- Enable SSL connections
- Regular backups
- Monitor performance

### Application

- Use process manager (PM2, systemd)
- Enable HTTPS (use nginx or similar as reverse proxy)
- Monitor logs and errors
- Set up health checks

### Example PM2 Configuration

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server/index.js --name p3-api

# Save PM2 configuration
pm2 save

# Setup auto-start on reboot
pm2 startup
```

## License

Copyright © 2024 P3
