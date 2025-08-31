-- MapMyMajor Database Schema for Supabase
-- Run this in your Supabase SQL editor

-- Enable RLS (Row Level Security)
-- Note: We'll set up policies later

-- Users table
CREATE TABLE "Users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(255) NOT NULL UNIQUE,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "googleId" VARCHAR(255) UNIQUE,
  "profilePicture" VARCHAR(255),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Maps table
CREATE TABLE "Maps" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "userId" INTEGER NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Semesters table
CREATE TABLE "Semesters" (
  "id" SERIAL PRIMARY KEY,
  "index" INTEGER NOT NULL,
  "name" VARCHAR(255) NOT NULL DEFAULT 'New Sem',
  "mapId" INTEGER NOT NULL REFERENCES "Maps"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
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
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
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
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
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

-- RLS Policies (Users can only access their own data)
-- Users can see their own profile
CREATE POLICY "Users can view own profile" ON "Users"
  FOR ALL USING (id = auth.uid()::integer);

-- Maps policies
CREATE POLICY "Users can manage own maps" ON "Maps"
  FOR ALL USING ("userId" = auth.uid()::integer);

-- Semesters policies
CREATE POLICY "Users can manage semesters in own maps" ON "Semesters"
  FOR ALL USING (EXISTS (
    SELECT 1 FROM "Maps" WHERE "Maps"."id" = "Semesters"."mapId" AND "Maps"."userId" = auth.uid()::integer
  ));

-- Classes policies
CREATE POLICY "Users can manage classes in own semesters" ON "Classes"
  FOR ALL USING (EXISTS (
    SELECT 1 FROM "Semesters" 
    JOIN "Maps" ON "Maps"."id" = "Semesters"."mapId"
    WHERE "Semesters"."id" = "Classes"."semesterId" AND "Maps"."userId" = auth.uid()::integer
  ));

-- Requirements policies
CREATE POLICY "Users can manage requirements in own maps" ON "Requirements"
  FOR ALL USING (EXISTS (
    SELECT 1 FROM "Maps" WHERE "Maps"."id" = "Requirements"."mapId" AND "Maps"."userId" = auth.uid()::integer
  ));
