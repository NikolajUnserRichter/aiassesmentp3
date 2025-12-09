# P3 AI Risk Assessment Tool

A comprehensive risk assessment tool for AI systems used in P3 consulting projects, with consideration for EU AI Act and GDPR compliance.

## Features

- 🎯 **Multi-step Risk Assessment** - Comprehensive evaluation of AI systems
- 🔐 **Azure AD Authentication** - Secure user authentication
- 💾 **PostgreSQL Database** - Store assessment results with user information
- 🌐 **Multi-language Support** - English and German interfaces
- 🌓 **Dark/Light Themes** - User preference for visual comfort
- 📊 **Risk Analysis** - Automated risk scoring and recommendations
- 📄 **Export Functionality** - Download assessments as CSV
- ♿ **Accessible Design** - WCAG 2.1 AA compliant

## Quick Start

### Frontend Only (No Backend)

Simply open `index.html` in a web browser. The tool will work without authentication and database storage.

```bash
# Using Python
python3 -m http.server 8080

# Or any static file server
```

Then navigate to `http://localhost:8080`

### Full Setup (Backend + Frontend)

For full functionality with database storage and user authentication:

1. **Clone the repository**
   ```bash
   git clone https://github.com/NikolajUnserRichter/aiassesmentp3.git
   cd aiassesmentp3
   ```

2. **Set up the backend**
   
   See [BACKEND_SETUP.md](BACKEND_SETUP.md) for detailed instructions on:
   - PostgreSQL database setup
   - Azure AD configuration
   - Environment variables
   - Running migrations

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Start the backend server**
   ```bash
   npm start
   ```

7. **Serve the frontend**
   ```bash
   # In a separate terminal
   python3 -m http.server 8080
   ```

8. **Access the application**
   
   Navigate to `http://localhost:8080`

## Documentation

- **[BACKEND_SETUP.md](BACKEND_SETUP.md)** - Complete backend setup guide
- **[FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)** - Frontend integration guide
- **[REFACTORING_DOCUMENTATION.md](REFACTORING_DOCUMENTATION.md)** - Architecture and design decisions

## Project Structure

```
aiassesmentp3/
├── index.html              # Main application page
├── css/                    # Modular stylesheets
│   ├── variables.css       # Design tokens and themes
│   ├── base.css           # Base styles and typography
│   ├── animations.css     # Keyframe animations
│   ├── layout.css         # Page layout and structure
│   ├── components.css     # Reusable UI components
│   └── responsive.css     # Mobile/tablet responsive styles
├── js/
│   └── script.js          # Application logic and API integration
├── server/                # Backend Express.js server
│   ├── index.js          # Main server file
│   ├── config/           # Configuration (database, auth)
│   ├── middleware/       # Authentication middleware
│   ├── routes/           # API routes
│   └── migrations/       # Database migrations
├── package.json          # Node.js dependencies
├── .env.example          # Environment variables template
└── README.md            # This file
```

## API Endpoints

### Authentication
- `GET /auth/login` - Initiate Azure AD login
- `GET /auth/callback` - OAuth callback handler
- `GET /auth/logout` - Logout endpoint
- `GET /auth/me` - Get current user info

### Assessments (Requires Authentication)
- `POST /api/assessments` - Create new assessment
- `GET /api/assessments` - List user's assessments
- `GET /api/assessments/:id` - Get specific assessment
- `DELETE /api/assessments/:id` - Delete assessment

## Technologies Used

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Modular CSS architecture
- Responsive design with CSS Grid
- Intersection Observer API for scroll effects

### Backend
- Node.js & Express.js
- PostgreSQL database
- Azure AD / MSAL for authentication
- Security: Helmet.js, CORS, Rate limiting

## Security

- 🔐 Azure AD OAuth2 authentication
- 🛡️ SQL injection prevention (parameterized queries)
- 🚦 Rate limiting on API endpoints
- 🔒 Helmet.js security headers
- 🌐 CORS configuration
- 🔑 Token-based authorization

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This is a P3 internal tool. For contributions or issues, please contact the development team.

## License

Copyright © 2024 P3. All rights reserved.

## Support

For setup assistance or issues:
1. Check the documentation in [BACKEND_SETUP.md](BACKEND_SETUP.md)
2. Review [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)
3. Contact the IT team for Azure AD configuration help
