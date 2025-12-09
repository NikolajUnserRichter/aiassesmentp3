# Docker Deployment Guide

This guide explains how to deploy the P3 AI Risk Assessment Tool using Docker and Docker Compose.

## Prerequisites

- Docker (v20.10 or higher)
- Docker Compose (v2.0 or higher)

## Quick Start with Docker Compose

### 1. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and set your configuration:

```env
# Database
DB_PASSWORD=your_secure_database_password

# Azure AD
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
AZURE_AD_TENANT_ID=your_tenant_id
AZURE_AD_REDIRECT_URI=http://localhost:3000/auth/callback

# CORS
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:80
```

### 2. Start Services

```bash
# Start database and API server
docker-compose up -d

# Or with pgAdmin for database management (development)
docker-compose --profile dev up -d
```

### 3. Run Database Migrations

```bash
# Execute migrations in the API container
docker-compose exec api npm run migrate
```

### 4. Access the Application

- **Frontend**: Serve the frontend files using any web server on port 8080
- **API**: http://localhost:3000
- **pgAdmin** (if started): http://localhost:5050

## Manual Docker Build

### Build the API Image

```bash
docker build -t p3-ai-assessment-api .
```

### Run with Docker Network

```bash
# Create network
docker network create p3-network

# Run PostgreSQL
docker run -d \
  --name p3-postgres \
  --network p3-network \
  -e POSTGRES_DB=p3_ai_assessment \
  -e POSTGRES_USER=p3_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:15-alpine

# Run API
docker run -d \
  --name p3-api \
  --network p3-network \
  -e DB_HOST=p3-postgres \
  -e DB_PORT=5432 \
  -e DB_NAME=p3_ai_assessment \
  -e DB_USER=p3_user \
  -e DB_PASSWORD=your_password \
  -e AZURE_AD_CLIENT_ID=your_client_id \
  -e AZURE_AD_CLIENT_SECRET=your_client_secret \
  -e AZURE_AD_TENANT_ID=your_tenant_id \
  -e AZURE_AD_REDIRECT_URI=http://localhost:3000/auth/callback \
  -p 3000:3000 \
  p3-ai-assessment-api
```

## Production Deployment

### Environment Configuration

For production, update your `.env`:

```env
NODE_ENV=production
DB_PASSWORD=strong_random_password
AZURE_AD_REDIRECT_URI=https://yourdomain.com/auth/callback
ALLOWED_ORIGINS=https://yourdomain.com
```

### Use Docker Secrets

For production, use Docker secrets instead of environment variables:

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  api:
    secrets:
      - db_password
      - azure_ad_client_secret
    environment:
      - DB_PASSWORD_FILE=/run/secrets/db_password
      - AZURE_AD_CLIENT_SECRET_FILE=/run/secrets/azure_ad_client_secret

secrets:
  db_password:
    external: true
  azure_ad_client_secret:
    external: true
```

### SSL/TLS

Use a reverse proxy (nginx, Traefik) for HTTPS:

```yaml
# Add to docker-compose.yml
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
```

## Managing the Application

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f db
```

### Stop Services

```bash
docker-compose down

# Also remove volumes (WARNING: deletes database)
docker-compose down -v
```

### Restart Services

```bash
docker-compose restart api
```

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Database Backup and Restore

### Backup

```bash
# Backup database
docker-compose exec db pg_dump -U p3_user p3_ai_assessment > backup.sql

# Or with timestamp
docker-compose exec db pg_dump -U p3_user p3_ai_assessment > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore

```bash
# Restore from backup
docker-compose exec -T db psql -U p3_user p3_ai_assessment < backup.sql
```

## Health Checks

### Check API Health

```bash
curl http://localhost:3000/health
```

### Check Database Connection

```bash
docker-compose exec db pg_isready -U p3_user
```

## Troubleshooting

### Database Connection Issues

```bash
# Check if database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Test connection from API container
docker-compose exec api node -e "const {Pool}=require('pg'); const pool=new Pool({host:'db',port:5432,database:'p3_ai_assessment',user:'p3_user',password:process.env.DB_PASSWORD}); pool.query('SELECT NOW()', (err,res)=>{console.log(err||res.rows); pool.end()});"
```

### API Issues

```bash
# Check API logs
docker-compose logs api

# Restart API
docker-compose restart api

# Enter API container for debugging
docker-compose exec api sh
```

### Port Conflicts

If ports are already in use, change them in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Use port 3001 instead of 3000
```

## Scaling (Optional)

For high availability, scale the API service:

```bash
docker-compose up -d --scale api=3
```

Add a load balancer (nginx, HAProxy) to distribute traffic.

## Monitoring

Add monitoring services to `docker-compose.yml`:

```yaml
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    depends_on:
      - prometheus
```

## Security Best Practices

1. **Never commit `.env` file** with real credentials
2. **Use strong passwords** for database and pgAdmin
3. **Enable SSL/TLS** in production
4. **Regular backups** of database
5. **Update images** regularly for security patches
6. **Use Docker secrets** in production
7. **Limit container resources** to prevent DoS

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
