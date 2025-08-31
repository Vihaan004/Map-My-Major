# Map My Major

A web app to identify, plan, visualize, and track progress for college programs powered with agentic AI to efficiently assist students with accurate data extracted from their universities. 

## Description

A user should be able to log in to an account with their saved data. Each user can have multiple 'plans' or 'maps' that they can create. 





### Sign up/Sign in
- basic user auth page
- option to login with google account
- password requirements

### Home page
- primary app page for the user
- account/profile settings
- grid view of cards representing major maps
- ability to create/edit/delete major maps
- button to navigate to course bank page

### Map Page
- all major maps use this page
- address structured as /map/{major map name}
- Subcomponents for map page:
1. Tracker sidebar 
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

### Course Bank Page
- custom user created database 
- view list of all added courses
- filters, sorting, searching courses
- (Idea) ability to fetch verified univeristy courses

---
## Database schema

### User
- **id**: Integer (Primary Key, Auto-increment)
- **username**: String (Required, Unique)
- **email**: String (Required, Unique)
- **password**: String (Required, Hashed)
- **googleId**: String (Unique, Optional)
- **profilePicture**: String (Optional)
- **createdAt**: Date
- **updatedAt**: Date
- **Relationships**: 
    - Has many Maps
    - Has one Coure Bank (idea, not integrated yet)

### Map
- **id**: Integer (Primary Key, Auto-increment)
- **name**: String (Required)
- **userId**: Integer (Foreign Key)
- **createdAt**: Date
- **updatedAt**: Date
- **Relationships**:
  - Belongs to one User
  - Has many Semesters
  - Has many Requirements

### Semester
- **id**: Integer (Primary Key, Auto-increment)
- **index**: Integer (Required, For ordering)
- **name**: String (Required, Default: 'New Sem')
- **mapId**: Integer (Foreign Key)
- **createdAt**: Date
- **updatedAt**: Date
- **Relationships**:
  - Belongs to one Map
  - Has many Classes

### Class
- **id**: Integer (Primary Key, Auto-increment)
- **name**: String (Required)
- **creditHours**: Integer (Required, Default: 3)
- **requirementTags**: JSON Array (Optional, Default: [])
- **prerequisites**: Text (Optional)
- **corequisites**: Text (Optional)
- **status**: String (Required, Default: 'planned', Options: ['planned', 'in-progress', 'complete'])
- **semesterId**: Integer (Foreign Key)
- **createdAt**: Date
- **updatedAt**: Date
- **Relationships**: 
    - Belongs to one Semester
    - Belongs to one Course Bank (idea, not integrated yet)

### Requirement
- **id**: Integer (Primary Key, Auto-increment)
- **name**: String (Required)
- **tag**: String (Required)
- **type**: String (Required, Options: ['credits', 'classes'])
- **goal**: Integer (Required)
- **current**: Integer (Required, Default: 0)
- **color**: String (Optional, Default: '#007bff')
- **mapId**: Integer (Foreign Key)
- **createdAt**: Date
- **updatedAt**: Date
- **Relationships**: Belongs to one Map
