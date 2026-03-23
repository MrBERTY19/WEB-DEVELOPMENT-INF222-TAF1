Blog API Documentation
Installation
Run the following command in the project directory:
npm install express mysql2 body-parser

Execution
To start the server:
node app.js

Priorities
Middleware: body-parser must be initialized before routes to process JSON.

Validation: The system verifies titre, auteur, and contenu before database insertion.

Security: All SQL queries use prepared statements (?) to prevent injections.

Database: A stable MySQL connection is required for all CRUD operations.

API Endpoints
Articles
POST /api/articles : Create an article (Requires: titre, contenu, auteur).

GET /api/articles : List all articles (Supports: ?categorie=, ?auteur=, ?date=).

GET /api/articles/:id : Get a single article by ID.

GET /api/articles/search?query=val : Search in title and content.

PUT /api/articles/:id : Update an existing article.

DELETE /api/articles/:id : Delete an article.

Status Codes
201: Success (Created)

200: Success (OK)

400: Client Error (Missing fields)

404: Client Error (ID not found)

500: Server Error (Database failure)
