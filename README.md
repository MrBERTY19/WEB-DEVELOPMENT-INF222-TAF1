List All Articles
Method: GET

URL: /api/articles

Optional Filters: /api/articles?categorie=Tech&auteur=John Doe

Get a Specific Article
Method: GET

URL: /api/articles/:id

Example: /api/articles/5

Search Articles
Method: GET

URL: /api/articles/search?query=keyword

Note: Searches within both the titre and contenu fields.

Update an Article
Method: PUT

URL: /api/articles/:id

Request Body (JSON): Provide the updated titre, contenu, categorie, or tags.

Delete an Article
Method: DELETE

URL: /api/articles/:id

3. Response Status Codes
201 Created: Article successfully saved.

200 OK: Request processed successfully.

400 Bad Request: Missing mandatory fields (titre, contenu, or auteur).

404 Not Found: The article with that ID does not exist.

500 Internal Server Error: Database connection or query error.
