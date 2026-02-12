export interface ResumeExtracted {
  id?: string;
  job_id?: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  headline: string | null;
  bio: string | null;
  summary: string | null;
  skills: string | null;
  experience_summary: string | null;
  education_summary: string | null;
  linkedin_url: string | null;
  website: string | null;
  current_job_title: string | null;
  years_of_experience: string | null;
  uploaded_at?: string;
}
