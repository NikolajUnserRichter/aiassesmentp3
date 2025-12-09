/**
 * Assessment Routes
 * API endpoints for managing AI risk assessments
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { requireAuth, getUserFromToken } = require('../middleware/auth');

/**
 * POST /api/assessments
 * Create a new assessment
 */
router.post('/', requireAuth, async (req, res) => {
    try {
        const user = getUserFromToken(req.accessToken);
        
        if (!user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Could not extract user information from token'
            });
        }
        
        const {
            riskLevel,
            riskScore,
            projectType,
            aiTool,
            aiUseCases,
            dataTypes,
            autonomy,
            impact,
            transparency,
            measures
        } = req.body;
        
        // Validate required fields
        if (!riskLevel || riskScore === undefined || !projectType || !aiTool || 
            !aiUseCases || !dataTypes || !autonomy || !impact || !transparency || !measures) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Missing required fields'
            });
        }
        
        // Insert assessment into database
        const query = `
            INSERT INTO assessments (
                user_id, user_email, user_name,
                risk_level, risk_score, project_type, ai_tool,
                ai_use_cases, data_types, autonomy, impact, transparency,
                measures
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *
        `;
        
        const values = [
            user.userId,
            user.email,
            user.name,
            riskLevel,
            riskScore,
            projectType,
            aiTool,
            JSON.stringify(aiUseCases),
            JSON.stringify(dataTypes),
            autonomy,
            impact,
            transparency,
            JSON.stringify(measures)
        ];
        
        const result = await pool.query(query, values);
        
        res.status(201).json({
            message: 'Assessment created successfully',
            assessment: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error creating assessment:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create assessment'
        });
    }
});

/**
 * GET /api/assessments
 * Get all assessments for the authenticated user
 */
router.get('/', requireAuth, async (req, res) => {
    try {
        const user = getUserFromToken(req.accessToken);
        
        if (!user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Could not extract user information from token'
            });
        }
        
        const query = `
            SELECT * FROM assessments
            WHERE user_id = $1
            ORDER BY created_at DESC
        `;
        
        const result = await pool.query(query, [user.userId]);
        
        res.json({
            assessments: result.rows
        });
        
    } catch (error) {
        console.error('Error fetching assessments:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch assessments'
        });
    }
});

/**
 * GET /api/assessments/:id
 * Get a specific assessment by ID
 */
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const user = getUserFromToken(req.accessToken);
        
        if (!user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Could not extract user information from token'
            });
        }
        
        const { id } = req.params;
        
        const query = `
            SELECT * FROM assessments
            WHERE id = $1 AND user_id = $2
        `;
        
        const result = await pool.query(query, [id, user.userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Assessment not found'
            });
        }
        
        res.json({
            assessment: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error fetching assessment:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch assessment'
        });
    }
});

/**
 * DELETE /api/assessments/:id
 * Delete a specific assessment
 */
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const user = getUserFromToken(req.accessToken);
        
        if (!user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Could not extract user information from token'
            });
        }
        
        const { id } = req.params;
        
        const query = `
            DELETE FROM assessments
            WHERE id = $1 AND user_id = $2
            RETURNING id
        `;
        
        const result = await pool.query(query, [id, user.userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Assessment not found'
            });
        }
        
        res.json({
            message: 'Assessment deleted successfully'
        });
        
    } catch (error) {
        console.error('Error deleting assessment:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to delete assessment'
        });
    }
});

module.exports = router;
