PROJECT: Personal Expense Tracker (Flask + SQLite)
DATE: [Generated]

1) Initial Planning Prompts (exact prompts used)
- "I want to build a simple Personal Expense Tracker web app. Requirements: add expenses (amount, category, description, date), view expenses in a table, calculate totals by category, responsive design. Suggest a minimal tech stack and file structure."
- "Recommend backend options that avoid Node/npm on a Windows machine where user doesn't have npm available. Suggest a Python + Flask approach with SQLite."
- "Provide routes and API contract for a Flask backend to support add/get/delete expenses and summary totals by category."
- "Suggest frontend structure with vanilla HTML/CSS/JS that consumes the Flask API."

2) Technology Stack Selection Prompts (exact)
- "Which database is simplest for local dev with Flask? Use SQLite and explain migrations or simple init."
- "Generate a requirements.txt and list minimal packages."

3) UI/UX Design Prompts (exact)
- "Design a simple responsive UI for adding an expense and viewing expenses with a summary by category. Use a dark theme and hide description column on mobile. Provide HTML/CSS code for it."

4) Code Generation Prompts (exact)
- "Generate Flask app.py implementing the following endpoints: GET /api/expenses, POST /api/expenses, DELETE /api/expenses/<id>, GET /api/summary. Use SQLite for storage and include DB init code."
- "Generate templates/index.html that includes forms and tables for expenses and summary. Link to static files."
- "Generate static CSS and JS. JS should call the Flask API, render expenses table, handle add and delete, and compute totals display."

5) Refinement / Debugging Prompts (exact examples)
- "Fix: When adding expense, date parsing fails for 'YYYY-MM-DD' format in Python; ensure code accepts ISO date and stores YYYY-MM-DD."
- "Fix: Ensure SQLite connection uses row_factory to return dict-like rows for jsonify."
- "Refine: Sort expenses by date descending in SQL query."

6) Problem-Solving Process
- Challenge: User couldn't use npm on Windows. Decision: Move to Flask + SQLite to avoid Node/npm. Prompt: "User cannot run npm. Recommend alternate backend stack requiring only Python."
- Challenge: Date validation — initial code failed to accept some date strings. Approach: prompt to accept ISO date and use datetime.fromisoformat; normalize to date().isoformat().
- Challenge: CORS while developing — included Flask-Cors to allow cross-origin during dev.
- Iteration: Adjusted API error responses to return JSON with 'errors' array for validation failures to allow frontend to show messages.
- Debugging examples: When initial frontend fetch got non-OK responses, added code to parse response body and show errors.
- Notes about DB initialization: Ensure instance folder exists and DB created at startup.

7) Screenshots / Error descriptions
- User reported: "npm not recognized" — resolved by switching stack to Flask/SQLite.
- When date parsing failed in Python, error message was: "ValueError: Invalid isoformat string" — solution: use try/except and return validation error message.

8) Final decisions
- Use SQLite in instance/expenses.db created automatically.
- Frontend-only fallback not required since no npm needed.

9) How to extend
- Add user authentication
- Add edit expense
- Add export to CSV
- Add charts (Chart.js) — needs npm if using bundlers, or include CDN script.

END OF DEVELOPMENT LOG