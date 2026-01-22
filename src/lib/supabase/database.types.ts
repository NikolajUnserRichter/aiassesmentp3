export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          azure_id: string
          email: string
          name: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          azure_id: string
          email: string
          name: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          azure_id?: string
          email?: string
          name?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          project_type: string
          ai_tool: string
          ai_use_cases: string[]
          data_types: string[]
          autonomy_level: string
          impact_scope: string
          transparency_level: string
          risk_score: number
          risk_level: string
          measures: string[]
          status: string
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          project_type: string
          ai_tool: string
          ai_use_cases: string[]
          data_types: string[]
          autonomy_level: string
          impact_scope: string
          transparency_level: string
          risk_score: number
          risk_level: string
          measures: string[]
          status?: string
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          project_type?: string
          ai_tool?: string
          ai_use_cases?: string[]
          data_types?: string[]
          autonomy_level?: string
          impact_scope?: string
          transparency_level?: string
          risk_score?: number
          risk_level?: string
          measures?: string[]
          status?: string
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          id: string
          category: string
          question_key: string
          question_en: string
          question_de: string
          options: Json
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          question_key: string
          question_en: string
          question_de: string
          options: Json
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          question_key?: string
          question_en?: string
          question_de?: string
          options?: Json
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      dropdown_configs: {
        Row: {
          id: string
          config_key: string
          config_value: Json
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          config_key: string
          config_value: Json
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          config_key?: string
          config_value?: Json
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dropdown_configs_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'user' | 'admin'
      assessment_status: 'draft' | 'completed' | 'archived'
      risk_level: 'minimal' | 'low' | 'medium' | 'high' | 'critical'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
