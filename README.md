# Map My Major

A web app to identify, plan, visualize, and track progress for college programs powered with agentic AI to efficiently assist students with accurate data extracted from their universities. 

## Description

A user should be able to log in to an account (sign it with google available) with their saved data. Each user can have multiple 'plans' or 'maps' that they can create. A map allows a user to plan out their college program by organizing classes/courses within semesters. Since programs have specific requirements like credits hours, necessary classes, general requirements, upper division credits, etc., the purpose of a map is to help the user plan, visualize and track the progress of completing those requirements. We will only be working with undergraduate degree programs (majors) from Arizona State University (ASU) to build an MVP. 

We will extract data including a list of undergraduate degree programs available at ASU, their specific requirements for the program (including required classes, total credit hours, etc.), and a general list of all classes available at ASU (including their course code (subject+number), name, credit hours, requirement categories it satisfies, and its pre/co-requisites). More properties of this data may be added later as we develop the app. We will create a database for this locally stored data, but it may be replaced by a direct live connection with the university database in the future. 

When creating a map, the user should be able to select a program from our program database. We will load a preset of the requirements and classes listed in the programs database for that program into the map. We can then allow the user to work with the map there on with a foundation. Also when creating a map, we need to ask the user for the start semester+year as well, which will be the first column of the map (eg Fall 2022). (semesters can be either fall, spring, or summer, and the start date can be changed later as well)

As for the UI of the map page, there should be two sections, one section containing the requirements trackers and the other (taking more space) containing a single row of semesters as columns. Each semester able to contain multiple classes as a single vertical list. Each semester has an add button on the top which allows the user to add classes to that semester. add buttons open up a pop-up which allows the user to add a class. User should be able to search for a class by either the class code or class name and add a pre-existing class from our database. However, the classes in our database are only blueprints, after the user adds the class, it should be saved in that semester of the map for that user, so that they can set properties like status and grade of that specific class to track their major. Thus, the class database is like a set of bank of blueprints.  

The tracker section should contain a list of all requirement categoies that are being tracked from the classes added in the map. Examples of requirement categories: Humanites, arts and design (HUAD), Social and Behavioral studies (SOBE), Scientific Thinking in Natural Sciences (SCIT), Quantitative reasoning (QTRS), etc. Each class in the database will have a property called requirements that will contain all the tags of the requirements that it satisfies. The trackers should access the classes added to the map to tally the how many credits or classes each requirement has accumulated. (A requirment either needs a specific amount of credits with that tag or a number of classes with that tag). 

## Database structure 
Note: For phase 1 we will have less data in the database but our goal is to establish the schema. 
We will start with only a BS in computer science in programs and the courses required for that program.  

### Program Database:
Each data element has the following properties:
1. PROGRAM
2. DEGREE
3. LOCATION
4. CATALOG_YEAR
5. COLLEGE
6. TOTAL_CREDITS_REQUIRED
7. UD_CREDITS_REQUIRED
8. MINIMUM_GPA
9. REQUIRED_COURSES
10. ELECTIVES

Example

### Cousre Database:
Each data element has the following properties:
1. SUBJECT
2. CODE
3. NAME
4. CREDITS
5. GENERAL_STUDIES_TAG
6. PRE-REQUISITE_COURSES
7. CO-REQUISITE_COURSES
8. OFFERING_COLLEGES
9. YEAR_REQUIREMENT


## Framework

### Tech Stack

**Frontend:**
- **Next.js 14** (App Router) - React framework optimized for Vercel deployment
- **TypeScript** - Type safety for complex course and requirement data structures
- **Tailwind CSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Accessible, customizable component library built on Radix UI
- **TanStack Query** - Powerful data fetching and caching for course/program data
- **@dnd-kit** - Modern drag-and-drop library for course management between semesters
- **Zustand** - Lightweight state management for map and semester data

**Backend & Database:**
- **Supabase** - PostgreSQL database with real-time capabilities
- **Supabase Auth** - Authentication with Google OAuth support
- **Supabase Edge Functions** - Serverless functions for complex business logic

**Additional Tools:**
- **Zod** - Schema validation for forms and API data
- **React Hook Form** - Performant form handling with validation
- **Lucide React** - Beautiful, customizable icons

**Deployment:**
- **Vercel** - Frontend deployment with automatic GitHub integration
- **Supabase** - Backend and database hosting (free tier)


