/**
 * Migration Runner
 * Executes database migrations in order
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Database connection
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'p3_ai_assessment',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function runMigrations() {
    console.log('Starting database migrations...');
    
    try {
        // Create migrations tracking table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Get all migration files
        const migrationsDir = __dirname;
        const files = fs.readdirSync(migrationsDir)
            .filter(f => f.endsWith('.sql'))
            .sort(); // Files should be named with numeric prefix like 001_*, 002_*, etc.
        
        if (files.length === 0) {
            console.log('No migration files found.');
            return;
        }
        
        console.log(`Found ${files.length} migration file(s)`);
        
        for (const file of files) {
            // Check if migration has already been executed
            const { rows } = await pool.query(
                'SELECT * FROM migrations WHERE name = $1',
                [file]
            );
            
            if (rows.length > 0) {
                console.log(`Skipping migration ${file} (already executed)`);
                continue;
            }
            
            console.log(`Running migration: ${file}`);
            
            // Read and execute migration
            const migrationSQL = fs.readFileSync(
                path.join(migrationsDir, file),
                'utf8'
            );
            
            await pool.query(migrationSQL);
            
            // Record migration as executed
            await pool.query(
                'INSERT INTO migrations (name) VALUES ($1)',
                [file]
            );
            
            console.log(`✓ Completed migration: ${file}`);
        }
        
        console.log('All migrations completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run migrations if executed directly
if (require.main === module) {
    runMigrations();
}

module.exports = { runMigrations };
