export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          role: 'student' | 'company';
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          role: 'student' | 'company';
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: 'student' | 'company';
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      student_profiles: {
        Row: {
          user_id: string;
          full_name: string;
          education: string | null;
          bio: string | null;
          score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          full_name: string;
          education?: string | null;
          bio?: string | null;
          score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          full_name?: string;
          education?: string | null;
          bio?: string | null;
          score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_skills: {
        Row: {
          id: string;
          student_id: string;
          skill: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          skill: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          skill?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          student_id: string;
          title: string;
          description: string | null;
          link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          title: string;
          description?: string | null;
          link?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          title?: string;
          description?: string | null;
          link?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      jobs: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          description: string | null;
          required_skills: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          description?: string | null;
          required_skills?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          title?: string;
          description?: string | null;
          required_skills?: string[];
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      refresh_student_score: {
        Args: {
          p_student_id: string;
        };
        Returns: number;
      };
      calculate_student_score: {
        Args: {
          p_student_id: string;
        };
        Returns: number;
      };
      calculate_job_match_score: {
        Args: {
          p_job_id: string;
          p_student_id: string;
        };
        Returns: number;
      };
    };
    Enums: {
      app_role: 'student' | 'company';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
