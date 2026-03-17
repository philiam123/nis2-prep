-- NIS2 Utbildning Database Schema
-- Run against PostgreSQL to create all required tables

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  has_paid BOOLEAN NOT NULL DEFAULT false,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  chapter_id TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  domains JSONB NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  certificate_id TEXT NOT NULL UNIQUE,
  exam_score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  track INTEGER NOT NULL DEFAULT 1,
  issued_at TIMESTAMP DEFAULT NOW()
);

-- Migration: add track column if table already exists
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS track INTEGER NOT NULL DEFAULT 1;
