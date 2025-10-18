# App Architecture
This document outlines the architecture of the MapMyMajor application, detailing the technology stack, data structures, and key components that make up the system.

## Key Pages (routes)
1. **Landing Page** (`/`): Introduction to the app, features overview, and call-to-action for sign-up/login.
2. **Dashboard** (`/dashboard`): User's main hub to view and manage their maps and profile.
3. **Map Page** (`/maps/[mapId]`): Interactive page for creating and editing academic maps.
4. **Profile Page** (`/account`): User account management, including information, settings, and preferences.
5. **Course Bank** (`/courses`): Repository of all courses available for users to add to their maps.
6. **Authentication Pages** (`/login`, `/signup`): User authentication and account creation.

## Data Structures
1. **User**
    - `id` (UUID, primary key)
    - `email` (string, unique)
    - `name` (string)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)
    - Google OAuth for authentication

2. **Program** (items in program bank - sample data: BS Computer Science from Arizona State University)
    - `id` (UUID, primary key)
    - `name` (string) - e.g., "BS, Computer Science"
    - `university` (string) - "ASU"
    - `college` (string) - "School of Computing, Informatics, and Decision Systems Engineering"
    - `catalog_year` (string) - e.g., "2022-2023"
    - `degree` (string) - "Bachelor of Science"
    - `requirements` (JSON) - structured requirement definitions (list of Requirement data type structures with pre-filled values) (tag, category, type, target_value, description) 
    - `core_courses` (JSON array of course_codes) - list of required courses
    - `elective_courses` (JSON array of course_codes) - list of elective courses
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

3. **Map**
    - `id` (UUID, primary key)
    - `user_id` (UUID, foreign key → User)
    - `program_id` (UUID, nullable, foreign key → Program) - reference to a program if selected
    - `map_name` (string) - e.g., "BS Computer Science Fall 2022" - fetch from Program.name if program selected, else user-defined
    - `map_university` (string) - "ASU" - fetch from Program.university if program selected
    - `map_degree` (string) - "Undergraduate" - fetch from Program.degree if program selected
    - `map_requirements` (JSON) - structured requirement definitions (tag, category, type, current_value, target_value, description) - fetched from Program.requirements, user-defined requriements can be appended to the same list
    - `track_total_credits` (decimal) - e.g., 120 (tallied credits from classes on map)
    - `start_term` (enum: Fall, Spring, Summer)
    - `start_year` (integer)
    - `status` (enum: active, archived, completed)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

4. **Semester**
    - `id` (UUID, primary key)
    - `map_id` (UUID, foreign key → Map)
    - `term` (enum: Fall, Spring, Summer)
    - `year` (integer)
    - `index` (integer) - order within the map (0, 1, 2...)

5. **Course** (items in the course bank, blueprint for classes)
    - `id` (UUID, primary key)
    - `course_code` (string) - e.g., "CSE110"
    - `subject` (string) - e.g., "CSE"
    - `number` (string) - e.g., "110"
    - `name` (string) - e.g., "Principles of Programming"
    - `description` (text, nullable)
    - `credit_hours` (decimal) - typically 3.0
    <!-- - `university` (string) - e.g., "ASU" (for future multi-university support) -->
    - `prerequisites` (JSON array of course_codes)
    - `corequisites` (JSON array of course_codes)
    - `requirement_tags` (JSON array of strings) - e.g., ["QTRS", "CS-CORE"]
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

6. **Class** (instance of a course when added to a map)
    - `id` (UUID, primary key)
    - `map_id` (UUID, foreign key → Map)
    - `semester_id` (UUID, foreign key → Semester)
    - `index` (integer) - order within semester
    - `course_id` (UUID, foreign key → Course) - reference to a Course blueprint
    - `class_code` (string) - fetched from Course.course_code but can be customized by user
    - `class_subject` (string) - fetched from Course.subject but can be customized by user
    - `class_number` (string) - fetched from Course.number but can be customized by user
    - `class_name` (string) - fetched from Course.name but can be customized by user
    - `class_credits` (decimal) - fetched from Course.credit_hours but can be customized by user
    - `class_prerequisites` (JSON array of course_codes) - fetched from Course.prerequisites but can be customized
    - `class_corequisites` (JSON array of course_codes) - fetched from Course.corequisites but can be customized
    - `class_requirement_tags` (JSON array of strings) - e.g., ["QTRS", "CS-CORE"] - fetched from Course.requirement_tags but can be customized
    - `status` (enum: planned, in_progress, completed, dropped)
    - `grade` (string, nullable) - e.g., "A", "B+", "Pass"
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

7. **Requirement**
    - `id` (UUID, primary key)
    <!-- - `map_id` (UUID, foreign key → Map) -->
    - `name` (string) - e.g., "Humanities and Arts"
    - `tag` (string) - e.g., "HUAD" (matches Course requirement_tags)
    - `category` (string) - e.g., "General Studies", "Major Core"
    - `type` (enum: credit_hours, class_count)
    <!-- - `target_value` (decimal) - e.g., 6 credits or 2 courses -->
    - `description` (text, nullable)
    - `category` (string, nullable) - e.g., "General Studies", "Major Core"
    - `is_custom` (boolean) - true if user-created
    - `created_at` (timestamp)
    - `updated_at` (timestamp)



## Workflow

### Map Creation Workflow
1. User navigates to Dashboard and clicks "Create New Map"
<!-- 2. User can optionally select a program from Program database (eg. BS Computer Science at ASU) -->
3. User specifies start term (Fall/Spring/Summer) and year
4. System creates Map with:
   - Auto-generated name (editable)
   - First Semester based on start term/year
   <!-- - Loads preset courses and requirements from selected Program -->
   - If no preset Program selected, adds an empty first Semester
5. User lands on Map Page to begin editing

### Adding Courses to Map Workflow
1. User clicks "Add Course" button within a Semester column
2. Modal opens showing Course Bank search interface
3. User searches by course code (e.g., "CSE110") or name or tag
4. User selects a Course from results
5. System creates a Class instance:
   - Created Class inherits values from the selected Course
   - Sets Status to "planned" by default
   - Places in target Semester at next position
6. Class appears as card in Semester column

### Requirement Tracking Workflow
<!-- 1. Map loads with preset Requirements from Program (or user can add custom) -->
1. User can add custom requirements specifying title, tag, type, and target value (added in map_requirements JSON)
2. For each Requirement:
   - System queries all Class instances in the Map
   - For each Class, checks class_requirement_tags
   - If Class satisfies Requirement (tag match):
     - Adds Class credits to running total (if type is credit_hours)
     - Increments course count (if type is class_count)
3. Requirement tracker UI displays:
   - Progress bar or fraction (e.g., "6 / 9 credits" or "2 / 3 courses")
   - Visual indicator (complete/incomplete)
4. Updates in real-time as user adds/removes/modifies courses

### Custom Requirement Management Workflow
1. User clicks "Add Requirement" in Requirements section
2. User specifies:
   - Title and tag (e.g., "Upper Division CS", "CS-UPPER")
   - Type (credit hours or course count)
   - Target value
3. System creates Requirement with `is_custom = true`
4. User can either add new requirements to courses in the course bank or the classes (course instances with edit class modal) in their map
   - Requirements added to Course Bank affect all Class (instances) created from that Course (update the classes inside all maps where that Course is used)
   - Requirements added to a Class (instances) affect only that Map's Class  
5. Tracker recalculates and reflects custom requirement progress

### Drag-and-Drop Course Management
1. User clicks and holds Class card
2. Drag preview follows cursor
3. Drop zones highlight in valid Semesters (can be a simple line between classes to indicate drop position without moving other cards)
4. On drop:
   - System updates Class.semester_id and position
   - Prerequisite warnings appear if dependencies violated (future enhancement)
   - Requirement trackers recalculate
5. Changes save automatically

### Class Editing Workflow
1. User clicks on Class card in Map
2. Modal opens with editable fields:
   - Status (planned → in_progress → completed/dropped)
   - Grade (if completed)
   - Custom title override
   - Custom credit override
   - Custom requirement tags (creates/updates CourseRequirementMapping)
   (These details are pre-filled from the Course blueprint but can be customized per Class instance)
3. User saves changes
4. Requirement trackers recalculate with new values
5. GPA calculations update (future enhancement)

### Semester Management Workflow
1. User clicks "Add Semester" button at end of row
2. System creates new Semester:
   - Increments index
   - Auto-calculates term/year based on previous Semester
3. New empty Semester column appears
4. User can rename, add, or delete Semesters but cannot reorder them (for now)
5. Deleting Semester alerts user that classes in the semester will be deleted

### Data Flow Summary
- **Course Bank (blueprints)** → **Class (instances)** → **Requirement Tracking (aggregation)**
- Class inherits from Course but can be customized per map
- Changes in Courses reflect all Classes in all Maps but changes in Classes only affect that specific Class instance
- Requirements track across all Classes in a Map 
- Requirements need to saved globally so they can be reused everywhere. (database of requirements accessible when adding/editing requirements in courses in course bank or classes in map or when adding custom requirements)
- Future: Class scheduling layer will reference Class instance but add time/instructor details
