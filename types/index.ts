// Type definitions for MapMyMajor application
// These complement the Prisma-generated types

export type Term = 'FALL' | 'SPRING' | 'SUMMER';
export type MapStatus = 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';
export type ClassStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED';
export type RequirementType = 'CREDIT_HOURS' | 'CLASS_COUNT';

// Requirement structure stored in Map.mapRequirements JSON field
export interface MapRequirement {
  id: string;
  name: string;
  tag: string;
  category?: string;
  type: RequirementType;
  currentValue: number;
  targetValue: number;
  description?: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Map with related data
export interface MapWithRelations {
  id: string;
  userId: string;
  mapName: string;
  mapUniversity?: string | null;
  mapDegree?: string | null;
  mapRequirements?: MapRequirement[] | null;
  trackTotalCredits: number;
  startTerm: Term;
  startYear: number;
  status: MapStatus;
  createdAt: Date;
  updatedAt: Date;
  semesters: SemesterWithClasses[];
}

export interface SemesterWithClasses {
  id: string;
  mapId: string;
  term: Term;
  year: number;
  index: number;
  classes: ClassWithCourse[];
}

export interface ClassWithCourse {
  id: string;
  mapId: string;
  semesterId: string;
  index: number;
  courseId?: string | null;
  classCode: string;
  classSubject: string;
  classNumber: string;
  className: string;
  classCredits: number;
  classPrerequisites?: string[] | null;
  classCorequisites?: string[] | null;
  classRequirementTags?: string[] | null;
  status: ClassStatus;
  grade?: string | null;
  createdAt: Date;
  updatedAt: Date;
  course?: {
    id: string;
    courseCode: string;
    name: string;
    description?: string | null;
  } | null;
}

// Create/Update request types
export interface CreateMapRequest {
  mapName: string;
  mapUniversity?: string;
  mapDegree?: string;
  startTerm: Term;
  startYear: number;
}

export interface UpdateMapRequest {
  mapName?: string;
  mapUniversity?: string;
  mapDegree?: string;
  mapRequirements?: MapRequirement[];
  status?: MapStatus;
}

export interface CreateCourseRequest {
  courseCode: string;
  subject: string;
  number: string;
  name: string;
  description?: string;
  creditHours: number;
  prerequisites?: string[];
  corequisites?: string[];
  requirementTags?: string[];
}

export interface CreateClassRequest {
  mapId: string;
  semesterId: string;
  index: number;
  courseId?: string; // If adding from course bank
  classCode: string;
  classSubject: string;
  classNumber: string;
  className: string;
  classCredits: number;
  classPrerequisites?: string[];
  classCorequisites?: string[];
  classRequirementTags?: string[];
}

export interface UpdateClassRequest {
  index?: number;
  semesterId?: string;
  classCode?: string;
  className?: string;
  classCredits?: number;
  classPrerequisites?: string[];
  classCorequisites?: string[];
  classRequirementTags?: string[];
  status?: ClassStatus;
  grade?: string;
}

export interface CreateSemesterRequest {
  mapId: string;
  term: Term;
  year: number;
  index: number;
}

export interface CreateRequirementRequest {
  name: string;
  tag: string;
  category?: string;
  type: RequirementType;
  description?: string;
  isCustom?: boolean;
}
