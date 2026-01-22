import { supabase } from './client';
import type { Assessment, User, DropdownConfig } from '@/types';

// User queries
export async function getUserByAzureId(azureId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('azure_id', azureId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    throw error;
  }

  return data;
}

export async function createUser(userData: {
  azure_id: string;
  email: string;
  name: string;
  role?: string;
}) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      azure_id: userData.azure_id,
      email: userData.email,
      name: userData.name,
      role: userData.role || 'user',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(id: string, userData: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update({
      ...userData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Assessment queries
export async function getAssessments(userId: string) {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAssessment(id: string) {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createAssessment(assessmentData: {
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
}) {
  const { data, error } = await supabase
    .from('assessments')
    .insert({
      ...assessmentData,
      status: assessmentData.status || 'completed',
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAssessment(
  id: string,
  assessmentData: Partial<Assessment>
) {
  const { data, error } = await supabase
    .from('assessments')
    .update({
      ...assessmentData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAssessment(id: string) {
  const { error } = await supabase
    .from('assessments')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function archiveAssessment(id: string) {
  return updateAssessment(id, { status: 'archived' });
}

// Dropdown config queries
export async function getDropdownConfig(configKey: string) {
  const { data, error } = await supabase
    .from('dropdown_configs')
    .select('*')
    .eq('config_key', configKey)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

export async function getAllDropdownConfigs() {
  const { data, error } = await supabase
    .from('dropdown_configs')
    .select('*');

  if (error) throw error;

  // Transform to a key-value object
  const configs: Record<string, unknown> = {};
  data?.forEach((item) => {
    configs[item.config_key] = item.config_value;
  });

  return configs;
}

export async function updateDropdownConfig(
  configKey: string,
  configValue: unknown,
  updatedBy: string
) {
  const { data, error } = await supabase
    .from('dropdown_configs')
    .upsert({
      config_key: configKey,
      config_value: configValue as Record<string, unknown>,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Analytics queries
export async function getAssessmentStats(userId?: string) {
  let query = supabase
    .from('assessments')
    .select('risk_level, status, created_at');

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Calculate stats
  const stats = {
    total: data?.length || 0,
    byRiskLevel: {
      minimal: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    },
    byStatus: {
      draft: 0,
      completed: 0,
      archived: 0,
    },
    recentCount: 0,
  };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  data?.forEach((assessment) => {
    // Count by risk level
    const riskLevel = assessment.risk_level as keyof typeof stats.byRiskLevel;
    if (stats.byRiskLevel[riskLevel] !== undefined) {
      stats.byRiskLevel[riskLevel]++;
    }

    // Count by status
    const status = assessment.status as keyof typeof stats.byStatus;
    if (stats.byStatus[status] !== undefined) {
      stats.byStatus[status]++;
    }

    // Count recent
    if (new Date(assessment.created_at) >= thirtyDaysAgo) {
      stats.recentCount++;
    }
  });

  return stats;
}

// Audit log queries
export async function createAuditLog(logData: {
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_data?: unknown;
  new_data?: unknown;
  ip_address?: string;
  user_agent?: string;
}) {
  const { error } = await supabase
    .from('audit_logs')
    .insert({
      user_id: logData.user_id,
      action: logData.action,
      entity_type: logData.entity_type,
      entity_id: logData.entity_id,
      old_data: logData.old_data as Record<string, unknown>,
      new_data: logData.new_data as Record<string, unknown>,
      ip_address: logData.ip_address,
      user_agent: logData.user_agent,
    });

  if (error) throw error;
}

export async function getAuditLogs(options?: {
  userId?: string;
  entityType?: string;
  limit?: number;
}) {
  let query = supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.userId) {
    query = query.eq('user_id', options.userId);
  }

  if (options?.entityType) {
    query = query.eq('entity_type', options.entityType);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}
