# Instructions for developing MapMyMajor

### Key information files for this project:
Read the following files to get accurate context and instructions for any task you are performing for MapMyMajor. 
- `AGENTS.md` - Development instructions for agents (this file)
- `README.md` - Primary project description, features, and deliverables
- `WORKFLOW.md` - Application workflow and data structure
- `MEMORY.md` - Record important changes in project structure and workflow

### Memory Management Instructions:
The purpose of the memory file is to keep track of important decisions, changes, and context that needs to be preserved across development sessions especially as context for other AI agents.  
**When/How to add to memory:**
- You are explicitly asked to document something in project memory
- You are asked to "remember" or "log" something for future reference
- Critical decisions that need to be preserved across development sessions
- Breaking changes or important architectural modifications
- Keep logs minimal and concise to reduce clutter (use bullet points)

### Development Principles:
Guiding principles:
- Think deeply for complex tasks, then implement minimally. No speculative abstractions.
- Ship in small, validated steps; harden functionality before starting the next phase.
- Use Playwright MCP to accelerate UI layout/design feedback and enforce UI quality.
- Ask for more context if anything is unclear or you need additional information for a task


### Collaboration and Workflow
- Work in small, independently shippable slices with clear acceptance criteria.
- Follow this implementation plan before coding:
  - Problem statement
  - User story and acceptance criteria
  - Data model changes (if any)
  - API changes (if any)
  - UI changes (screens, components)

