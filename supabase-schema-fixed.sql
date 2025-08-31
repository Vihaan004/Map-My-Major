-- MapMyMajor Database Schema for Supabase (Fixed Version)
-- Run this in your Supabase SQL editor

-- First, drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS "Requirements" CASCADE;
DROP TABLE IF EXISTS "Classes" CASCADE;
DROP TABLE IF EXISTS "Semesters" CASCADE;
DROP TABLE IF EXISTS "Maps" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;

-- Users table (simplified for Supabase auth)
CREATE TABLE "Users" (
  "id" UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  "username" VARCHAR(255) UNIQUE,
  "email" VARCHAR(255),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maps table
CREATE TABLE "Maps" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "userId" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Semesters table
CREATE TABLE "Semesters" (
  "id" SERIAL PRIMARY KEY,
  "index" INTEGER NOT NULL,
  "name" VARCHAR(255) NOT NULL DEFAULT 'New Sem',
  "mapId" INTEGER NOT NULL REFERENCES "Maps"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes table
CREATE TABLE "Classes" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "creditHours" INTEGER NOT NULL DEFAULT 3,
  "requirementTags" JSONB DEFAULT '[]'::jsonb,
  "prerequisites" TEXT,
  "corequisites" TEXT,
  "status" VARCHAR(50) NOT NULL DEFAULT 'planned' CHECK ("status" IN ('planned', 'in-progress', 'complete')),
  "semesterId" INTEGER NOT NULL REFERENCES "Semesters"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requirements table
CREATE TABLE "Requirements" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "tag" VARCHAR(255) NOT NULL,
  "type" VARCHAR(50) NOT NULL CHECK ("type" IN ('credits', 'classes')),
  "goal" INTEGER NOT NULL,
  "current" INTEGER NOT NULL DEFAULT 0,
  "color" VARCHAR(7) DEFAULT '#007bff',
  "mapId" INTEGER NOT NULL REFERENCES "Maps"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX "idx_maps_userId" ON "Maps"("userId");
CREATE INDEX "idx_semesters_mapId" ON "Semesters"("mapId");
CREATE INDEX "idx_classes_semesterId" ON "Classes"("semesterId");
CREATE INDEX "idx_requirements_mapId" ON "Requirements"("mapId");

-- Enable RLS on all tables
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Maps" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Semesters" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Classes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Requirements" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can manage their own profile
CREATE POLICY "Users can manage own profile" ON "Users"
  FOR ALL USING (auth.uid() = id);

-- Users can manage their own maps
CREATE POLICY "Users can manage own maps" ON "Maps"
  FOR ALL USING (auth.uid() = "userId");

-- Users can manage semesters in their own maps
CREATE POLICY "Users can manage own semesters" ON "Semesters"
  FOR ALL USING (EXISTS (
    SELECT 1 FROM "Maps" WHERE "Maps"."id" = "Semesters"."mapId" AND "Maps"."userId" = auth.uid()
  ));

-- Users can manage classes in their own semesters
CREATE POLICY "Users can manage own classes" ON "Classes"
  FOR ALL USING (EXISTS (
    SELECT 1 FROM "Semesters" 
    JOIN "Maps" ON "Maps"."id" = "Semesters"."mapId"
    WHERE "Semesters"."id" = "Classes"."semesterId" AND "Maps"."userId" = auth.uid()
  ));

-- Users can manage requirements in their own maps
CREATE POLICY "Users can manage own requirements" ON "Requirements"
  FOR ALL USING (EXISTS (
    SELECT 1 FROM "Maps" WHERE "Maps"."id" = "Requirements"."mapId" AND "Maps"."userId" = auth.uid()
  ));

-- Create a trigger to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."Users" (id, email, username)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
