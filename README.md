# MapMyMajor by Vihaan Patel
A Web App to plan, visualize, and track educational programs by creating interactive and customizable program maps.  

## Deliverables
  - Identify degree/program requirements
  - Track completed courses and credits
  - Add specific courses to semester of choice
  - Create savable custom maps
  - Map comparison tool
  - Include user defined degree/credit requirements
  - General studies requirement tracker
  - Add/remove/move semesters

Potential features : 
  - Connect to university database
  - Retrieve user's completed/enrolled courses
  - Retrieve program/degree info and requirements
  - Retrieve available course list from university
  - AI assisted map maker based on user preferences
  - Notify on course/class availibility

## Pages and Interaction Flow

### 1. Product Landing Page (App Info Page at root)
- mapmymajor.com
- minimalistic app overview
- button to navigate to /home (or sign in/sign up when not logged in)

### 2. Sign up/Sign in
- basic user auth page
- option to login with google account
- password requirements

### 3. Home page
- primary app page for the user
- account/profile settings
- grid view of cards representing major maps
- ability to create/edit/delete major maps
- button to navigate to course bank page

### 4. Map Page
- all major maps use this page
- address structured as /map/{major map name}
- Subcomponents for map page:
  1. Tracker sidebar 
    - map name
    - tracker cards including: total credits tracker (fixed) + user added tracker cards
    - utility buttons: return home, app settings 
  2. Map section
    - horizontal list of semesters (1 row only)
    - semester: semester name, semester options dropdown, vertical list of class cards, semester credit count
    - class card: class name, requirement tags, class credits, class options dropdown
    - IMPORTANT: Drag and drop class cards throughout map. (structure similar to multi-list to-do list with drag-n-drop)
  3. AI Assistant sidebar (Idea) (FUTURE ITERATION ONLY)
    - chatbot fed map context and user profile
    - ability to edit map elements

### 5. Course Bank Page
- custom user created database 
- view list of all added courses
- filters, sorting, searching courses
- (Idea) ability to fetch verified univeristy courses

## Data Architecture

###




# Setup for development :

1. After forking/downloading the repo to your system, make sure you have installed Node, Java, and PostgreSQL (+ pgAdmin for convenience).
2. The "v1" directory contains the first UI prototype of the app. Run this by making v1/map-my-major as the current directory and running 'npm run dev'.
3. The "vercel" directory contains the foundational app with the backend as the primary development focus.
4. To start the app :
   - start the backend server by making vercel/backend the CD and run 'node src/index.js'.
   - In another terminal window, start the frontend by making vercel/frontend as the CD and run 'npm start'.
   - App should pop up in your browser, if not, go to "http://localhost:3000/auth".
