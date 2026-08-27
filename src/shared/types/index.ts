export type { ApiResponse } from '@/shared/lib/http';

export interface Subject {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
}

export interface Test {
  id: string;
  name: string;
  subject: string;
  type?: string;
  topics?: string[];
  sub_topics?: string[];
  status?: 'draft' | 'live';
  correct_marks?: number;
  wrong_marks?: number;
  unattempt_marks?: number;
  difficulty?: string;
  total_time?: number;
  duration?: number;
  total_marks?: number;
  total_questions?: number;
  questions?: string[];
  created_at?: string;
}

export interface Question {
  id: string;
  type: 'mcq';
  question: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  correct_option?: string;
  explanation?: string;
  difficulty?: string;
  test_id?: string;
}

export interface AuthUser {
  id: string;
  userId: string;
  name: string;
  role: string;
  subrole: string | null;
  phone: string;
  joiningDate: string;
  endDate: string;
  lastActive: string;
  payment: boolean;
}
