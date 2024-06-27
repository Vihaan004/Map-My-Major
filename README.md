# MapMyMajor by Vihaan Patel
Web based application : Create and visualize a fully customizable major map for educational programs and degrees.  

User Requirements and app goals : 
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

# Setup for development :

1. After forking/downloading the repo to your system, make sure you have installed Node, Java, and PostgreSQL (+ pgAdmin for convenience).
2. The "v1" directory contains the first UI prototype of the app. Run this by making v1/map-my-major as the current directory and running 'npm run dev'.
3. The "vercel" directory contains the foundational app with the backend as the primary development focus.
4. To start the app :
   - start the backend server by making vercel/backend the CD and run 'node src/index.js'.
   - start the frontend by making vercel/frontend as the CD and run 'npm start'.
   - App should pop up in your browser, if not, go to "http://localhost:3000/auth".
