import { query, queryOne, withTransaction } from './postgres';
import type { User, Assessment } from '@/types';

// ============================================================================
// USER QUERIES
// ============================================================================

interface DbUser {
  id: string;
  azure_id: string;
  email: string;
  name: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export async function getUserByAzureId(azureId: string): Promise<User | null> {
  const user = await queryOne<DbUser>(
    'SELECT * FROM users WHERE azure_id = $1',
    [azureId]
  );

  if (!user) return null;

  return {
    id: user.id,
    azure_id: user.azure_id,
    email: user.email,
    name: user.name,
    role: user.role as 'user' | 'admin',
    created_at: user.created_at.toISOString(),
    updated_at: user.updated_at.toISOString(),
  };
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await queryOne<DbUser>(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  if (!user) return null;

  return {
    id: user.id,
    azure_id: user.azure_id,
    email: user.email,
    name: user.name,
    role: user.role as 'user' | 'admin',
    created_at: user.created_at.toISOString(),
    updated_at: user.updated_at.toISOString(),
  };
}

export async function createUser(userData: {
  azure_id: string;
  email: string;
  name: string;
  role?: string;
}): Promise<User> {
  const user = await queryOne<DbUser>(
    `INSERT INTO users (azure_id, email, name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userData.azure_id, userData.email, userData.name, userData.role || 'user']
  );

  if (!user) throw new Error('Failed to create user');

  return {
    id: user.id,
    azure_id: user.azure_id,
    email: user.email,
    name: user.name,
    role: user.role as 'user' | 'admin',
    created_at: user.created_at.toISOString(),
    updated_at: user.updated_at.toISOString(),
  };
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramCount = 1;

  if (userData.email) {
    fields.push(`email = $${paramCount++}`);
    values.push(userData.email);
  }
  if (userData.name) {
    fields.push(`name = $${paramCount++}`);
    values.push(userData.name);
  }
  if (userData.role) {
    fields.push(`role = $${paramCount++}`);
    values.push(userData.role);
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const user = await queryOne<DbUser>(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  if (!user) return null;

  return {
    id: user.id,
    azure_id: user.azure_id,
    email: user.email,
    name: user.name,
    role: user.role as 'user' | 'admin',
    created_at: user.created_at.toISOString(),
    updated_at: user.updated_at.toISOString(),
  };
}

// ============================================================================
// ASSESSMENT QUERIES
// ============================================================================

interface DbAssessment {
  id: string;
  user_id: string;
  project_type: string;
  ai_tool: string;
  ai_use_cases: string[];
  data_types: string[];
  autonomy_level: string;
  impact_scope: string;
  transparency_level: string;
  risk_score: number;
  risk_level: string;
  measures: string[];
  status: string;
  created_at: Date;
  updated_at: Date;
  completed_at: Date | null;
}

function mapAssessment(row: DbAssessment): Assessment {
  return {
    id: row.id,
    user_id: row.user_id,
    project_type: row.project_type,
    ai_tool: row.ai_tool,
    ai_use_cases: row.ai_use_cases,
    data_types: row.data_types,
    autonomy_level: row.autonomy_level,
    impact_scope: row.impact_scope,
    transparency_level: row.transparency_level,
    risk_score: row.risk_score,
    risk_level: row.risk_level as Assessment['risk_level'],
    measures: row.measures,
    status: row.status as Assessment['status'],
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
    completed_at: row.completed_at?.toISOString(),
  };
}

export async function getAssessments(userId: string): Promise<Assessment[]> {
  const rows = await query<DbAssessment>(
    'SELECT * FROM assessments WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows.map(mapAssessment);
}

export async function getAssessment(id: string): Promise<Assessment | null> {
  const row = await queryOne<DbAssessment>(
    'SELECT * FROM assessments WHERE id = $1',
    [id]
  );
  return row ? mapAssessment(row) : null;
}

export async function createAssessment(data: {
  user_id: string;
  project_type: string;
  ai_tool: string;
  ai_use_cases: string[];
  data_types: string[];
  autonomy_level: string;
  impact_scope: string;
  transparency_level: string;
  risk_score: number;
  risk_level: string;
  measures: string[];
  status?: string;
}): Promise<Assessment> {
  const row = await queryOne<DbAssessment>(
    `INSERT INTO assessments (
      user_id, project_type, ai_tool, ai_use_cases, data_types,
      autonomy_level, impact_scope, transparency_level,
      risk_score, risk_level, measures, status, completed_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
    RETURNING *`,
    [
      data.user_id,
      data.project_type,
      data.ai_tool,
      data.ai_use_cases,
      data.data_types,
      data.autonomy_level,
      data.impact_scope,
      data.transparency_level,
      data.risk_score,
      data.risk_level,
      data.measures,
      data.status || 'completed',
    ]
  );

  if (!row) throw new Error('Failed to create assessment');
  return mapAssessment(row);
}

export async function updateAssessment(
  id: string,
  data: Partial<Assessment>
): Promise<Assessment | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramCount = 1;

  const fieldMap: Record<string, keyof typeof data> = {
    project_type: 'project_type',
    ai_tool: 'ai_tool',
    ai_use_cases: 'ai_use_cases',
    data_types: 'data_types',
    autonomy_level: 'autonomy_level',
    impact_scope: 'impact_scope',
    transparency_level: 'transparency_level',
    risk_score: 'risk_score',
    risk_level: 'risk_level',
    measures: 'measures',
    status: 'status',
  };

  for (const [dbField, dataField] of Object.entries(fieldMap)) {
    if (data[dataField] !== undefined) {
      fields.push(`${dbField} = $${paramCount++}`);
      values.push(data[dataField]);
    }
  }

  if (fields.length === 0) return getAssessment(id);

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const row = await queryOne<DbAssessment>(
    `UPDATE assessments SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  return row ? mapAssessment(row) : null;
}

export async function deleteAssessment(id: string): Promise<boolean> {
  const result = await query(
    'DELETE FROM assessments WHERE id = $1',
    [id]
  );
  return true;
}

// ============================================================================
// STATISTICS QUERIES
// ============================================================================

export async function getAssessmentStats(userId?: string) {
  const whereClause = userId ? 'WHERE user_id = $1' : '';
  const params = userId ? [userId] : [];

  const rows = await query<{ risk_level: string; status: string; created_at: Date }>(
    `SELECT risk_level, status, created_at FROM assessments ${whereClause}`,
    params
  );

  const stats = {
    total: rows.length,
    byRiskLevel: { minimal: 0, low: 0, medium: 0, high: 0, critical: 0 },
    byStatus: { draft: 0, completed: 0, archived: 0 },
    recentCount: 0,
  };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  rows.forEach((row) => {
    const riskLevel = row.risk_level as keyof typeof stats.byRiskLevel;
    if (stats.byRiskLevel[riskLevel] !== undefined) {
      stats.byRiskLevel[riskLevel]++;
    }

    const status = row.status as keyof typeof stats.byStatus;
    if (stats.byStatus[status] !== undefined) {
      stats.byStatus[status]++;
    }

    if (new Date(row.created_at) >= thirtyDaysAgo) {
      stats.recentCount++;
    }
  });

  return stats;
}

// ============================================================================
// AUDIT LOG QUERIES
// ============================================================================

export async function createAuditLog(data: {
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_data?: unknown;
  new_data?: unknown;
}): Promise<void> {
  await query(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_data, new_data)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      data.user_id || null,
      data.action,
      data.entity_type,
      data.entity_id || null,
      data.old_data ? JSON.stringify(data.old_data) : null,
      data.new_data ? JSON.stringify(data.new_data) : null,
    ]
  );
}

export async function getAuditLogs(options?: {
  userId?: string;
  entityType?: string;
  limit?: number;
}) {
  let whereClause = '';
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramCount = 1;

  if (options?.userId) {
    conditions.push(`user_id = $${paramCount++}`);
    params.push(options.userId);
  }
  if (options?.entityType) {
    conditions.push(`entity_type = $${paramCount++}`);
    params.push(options.entityType);
  }

  if (conditions.length > 0) {
    whereClause = `WHERE ${conditions.join(' AND ')}`;
  }

  const limitClause = options?.limit ? `LIMIT ${options.limit}` : '';

  return query<{
    id: string;
    user_id: string | null;
    action: string;
    entity_type: string;
    entity_id: string | null;
    old_data: unknown;
    new_data: unknown;
    created_at: Date;
  }>(
    `SELECT * FROM audit_logs ${whereClause} ORDER BY created_at DESC ${limitClause}`,
    params
  );
}
