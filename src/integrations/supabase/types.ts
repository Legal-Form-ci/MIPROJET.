export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      access_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          message: string | null
          project_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          message?: string | null
          project_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          message?: string | null
          project_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      contributions: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          payment_id: string | null
          project_id: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          payment_id?: string | null
          project_id?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          payment_id?: string | null
          project_id?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contributions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      database_backups: {
        Row: {
          backup_name: string
          backup_type: string | null
          created_at: string
          created_by: string | null
          error_message: string | null
          file_size: string | null
          format: string | null
          id: string
          size_bytes: number | null
          status: string | null
          tables_included: string[] | null
        }
        Insert: {
          backup_name: string
          backup_type?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          file_size?: string | null
          format?: string | null
          id?: string
          size_bytes?: number | null
          status?: string | null
          tables_included?: string[] | null
        }
        Update: {
          backup_name?: string
          backup_type?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          file_size?: string | null
          format?: string | null
          id?: string
          size_bytes?: number | null
          status?: string | null
          tables_included?: string[] | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          is_active: boolean | null
          question: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          question: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          question?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      form_progress: {
        Row: {
          created_at: string
          current_step: number | null
          data: Json | null
          form_type: string
          id: string
          is_completed: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_step?: number | null
          data?: Json | null
          form_type: string
          id?: string
          is_completed?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_step?: number | null
          data?: Json | null
          form_type?: string
          id?: string
          is_completed?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string
          created_by: string | null
          currency: string | null
          due_date: string | null
          id: string
          invoice_number: string
          items: Json | null
          notes: string | null
          paid_at: string | null
          service_request_id: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          tax_rate: number | null
          total: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          items?: Json | null
          notes?: string | null
          paid_at?: string | null
          service_request_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          items?: Json | null
          notes?: string | null
          paid_at?: string | null
          service_request_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          additional_info: Json | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string
          difficulties: string | null
          email: string
          entity_type: string | null
          first_name: string
          id: string
          interested_sectors: string[] | null
          investment_capacity: string | null
          last_name: string
          lead_source: string
          needs: string | null
          phone: string | null
          risk_tolerance: string | null
          sector: string | null
          source_id: string | null
          user_id: string | null
          wants_foundation_participation: boolean | null
          wants_project_proposals: boolean | null
          whatsapp: string | null
        }
        Insert: {
          additional_info?: Json | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          difficulties?: string | null
          email: string
          entity_type?: string | null
          first_name: string
          id?: string
          interested_sectors?: string[] | null
          investment_capacity?: string | null
          last_name: string
          lead_source?: string
          needs?: string | null
          phone?: string | null
          risk_tolerance?: string | null
          sector?: string | null
          source_id?: string | null
          user_id?: string | null
          wants_foundation_participation?: boolean | null
          wants_project_proposals?: boolean | null
          whatsapp?: string | null
        }
        Update: {
          additional_info?: Json | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          difficulties?: string | null
          email?: string
          entity_type?: string | null
          first_name?: string
          id?: string
          interested_sectors?: string[] | null
          investment_capacity?: string | null
          last_name?: string
          lead_source?: string
          needs?: string | null
          phone?: string | null
          risk_tolerance?: string | null
          sector?: string | null
          source_id?: string | null
          user_id?: string | null
          wants_foundation_participation?: boolean | null
          wants_project_proposals?: boolean | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          project_id: string | null
          sender_email: string | null
          sender_id: string | null
          sender_name: string | null
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          project_id?: string | null
          sender_email?: string | null
          sender_id?: string | null
          sender_name?: string | null
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          project_id?: string | null
          sender_email?: string | null
          sender_id?: string | null
          sender_name?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          archived_at: string | null
          author_id: string | null
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          published_at: string | null
          status: string | null
          title: string
          updated_at: string
          video_url: string | null
          views_count: number | null
        }
        Insert: {
          archived_at?: string | null
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          published_at?: string | null
          status?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          views_count?: number | null
        }
        Update: {
          archived_at?: string | null
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          published_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          link: string | null
          message: string | null
          metadata: Json | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          metadata?: Json | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          metadata?: Json | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          amount_max: number | null
          amount_min: number | null
          author_id: string | null
          category: string | null
          contact_email: string | null
          contact_phone: string | null
          content: string
          created_at: string
          currency: string | null
          deadline: string | null
          description: string | null
          eligibility: string | null
          external_link: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          is_premium: boolean | null
          location: string | null
          opportunity_type: string | null
          published_at: string | null
          status: string | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          amount_max?: number | null
          amount_min?: number | null
          author_id?: string | null
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          content?: string
          created_at?: string
          currency?: string | null
          deadline?: string | null
          description?: string | null
          eligibility?: string | null
          external_link?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_premium?: boolean | null
          location?: string | null
          opportunity_type?: string | null
          published_at?: string | null
          status?: string | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          amount_max?: number | null
          amount_min?: number | null
          author_id?: string | null
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          content?: string
          created_at?: string
          currency?: string | null
          deadline?: string | null
          description?: string | null
          eligibility?: string | null
          external_link?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_premium?: boolean | null
          location?: string | null
          opportunity_type?: string | null
          published_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          payment_reference: string | null
          project_id: string | null
          service_request_id: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          project_id?: string | null
          service_request_id?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_reference?: string | null
          project_id?: string | null
          service_request_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_documents: {
        Row: {
          access_level: string | null
          associated_form: string | null
          category: string | null
          cover_path: string | null
          cover_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          download_count: number | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_active: boolean | null
          requires_login: boolean | null
          target_audience: string | null
          title: string
          updated_at: string
        }
        Insert: {
          access_level?: string | null
          associated_form?: string | null
          category?: string | null
          cover_path?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          download_count?: number | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          requires_login?: boolean | null
          target_audience?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          access_level?: string | null
          associated_form?: string | null
          category?: string | null
          cover_path?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          download_count?: number | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          requires_login?: boolean | null
          target_audience?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          category: string | null
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          is_verified: boolean | null
          last_name: string | null
          phone: string | null
          referral_code: string | null
          total_commissions: number | null
          total_referrals: number | null
          updated_at: string
          user_type: string | null
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          is_verified?: boolean | null
          last_name?: string | null
          phone?: string | null
          referral_code?: string | null
          total_commissions?: number | null
          total_referrals?: number | null
          updated_at?: string
          user_type?: string | null
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_verified?: boolean | null
          last_name?: string | null
          phone?: string | null
          referral_code?: string | null
          total_commissions?: number | null
          total_referrals?: number | null
          updated_at?: string
          user_type?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      project_evaluations: {
        Row: {
          actions_structuration: string[] | null
          certified_at: string | null
          created_at: string
          faiblesses: string[] | null
          forces: string[] | null
          id: string
          is_active: boolean | null
          is_certified: boolean | null
          messages_strategiques: string[] | null
          niveau: string | null
          project_id: string
          recommandations: string[] | null
          resume: string | null
          score_equipe: number | null
          score_financier: number | null
          score_global: number | null
          score_impact: number | null
          score_maturite: number | null
          score_porteur: number | null
          score_projet: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actions_structuration?: string[] | null
          certified_at?: string | null
          created_at?: string
          faiblesses?: string[] | null
          forces?: string[] | null
          id?: string
          is_active?: boolean | null
          is_certified?: boolean | null
          messages_strategiques?: string[] | null
          niveau?: string | null
          project_id: string
          recommandations?: string[] | null
          resume?: string | null
          score_equipe?: number | null
          score_financier?: number | null
          score_global?: number | null
          score_impact?: number | null
          score_maturite?: number | null
          score_porteur?: number | null
          score_projet?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actions_structuration?: string[] | null
          certified_at?: string | null
          created_at?: string
          faiblesses?: string[] | null
          forces?: string[] | null
          id?: string
          is_active?: boolean | null
          is_certified?: boolean | null
          messages_strategiques?: string[] | null
          niveau?: string | null
          project_id?: string
          recommandations?: string[] | null
          resume?: string | null
          score_equipe?: number | null
          score_financier?: number | null
          score_global?: number | null
          score_impact?: number | null
          score_maturite?: number | null
          score_porteur?: number | null
          score_projet?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_evaluations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_updates: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          project_id: string
          title: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          project_id: string
          title?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string | null
          city: string | null
          country: string | null
          created_at: string
          current_funding: number | null
          description: string | null
          documents: Json | null
          fonds_disponibles: string | null
          funding_goal: number | null
          funds_raised: number | null
          id: string
          image_url: string | null
          owner_id: string
          risk_score: string | null
          sector: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          current_funding?: number | null
          description?: string | null
          documents?: Json | null
          fonds_disponibles?: string | null
          funding_goal?: number | null
          funds_raised?: number | null
          id?: string
          image_url?: string | null
          owner_id: string
          risk_score?: string | null
          sector?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          current_funding?: number | null
          description?: string | null
          documents?: Json | null
          fonds_disponibles?: string | null
          funding_goal?: number | null
          funds_raised?: number | null
          id?: string
          image_url?: string | null
          owner_id?: string
          risk_score?: string | null
          sector?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          commission_amount: number | null
          commission_rate: number | null
          completed_at: string | null
          created_at: string
          id: string
          paid_at: string | null
          referee_id: string | null
          referral_code: string
          referral_link: string | null
          referrer_id: string
          status: string | null
        }
        Insert: {
          commission_amount?: number | null
          commission_rate?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          referee_id?: string | null
          referral_code: string
          referral_link?: string | null
          referrer_id: string
          status?: string | null
        }
        Update: {
          commission_amount?: number | null
          commission_rate?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          referee_id?: string | null
          referral_code?: string
          referral_link?: string | null
          referrer_id?: string
          status?: string | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          admin_notes: string | null
          company_name: string | null
          created_at: string
          description: string | null
          funding_needed: number | null
          has_business_plan: boolean | null
          id: string
          project_stage: string | null
          sector: string | null
          service_type: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          funding_needed?: number | null
          has_business_plan?: boolean | null
          id?: string
          project_stage?: string | null
          sector?: string | null
          service_type: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          funding_needed?: number | null
          has_business_plan?: boolean | null
          id?: string
          project_stage?: string | null
          sector?: string | null
          service_type?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          duration_days: number | null
          duration_type: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string | null
          duration_days?: number | null
          duration_type?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string | null
          duration_days?: number | null
          duration_type?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string
          expires_at: string | null
          id: string
          payment_id: string | null
          payment_method: string | null
          payment_reference: string | null
          plan_id: string
          started_at: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          plan_id: string
          started_at?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          plan_id?: string
          started_at?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
