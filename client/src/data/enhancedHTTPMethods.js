export const enhancedHTTPMethods = {
  id: 'http-methods',
  title: 'HTTP Methods (GET, POST, PUT, DELETE, PATCH)',
  subtitle: 'RESTful API Request Methods and Their Usage',
  summary: 'HTTP methods define the type of action to be performed on a resource, with GET for retrieval, POST for creation, PUT for updates, DELETE for removal, and PATCH for partial updates.',
  analogy: 'Like different actions in a library: GET (read a book), POST (add new book), PUT (replace entire book), DELETE (remove book), PATCH (update book details).',
  visualConcept: 'Picture HTTP methods as different tools in a toolbox, each designed for specific operations on web resources with distinct behaviors and purposes.',
  realWorldUse: 'RESTful APIs, web applications, CRUD operations, microservices, mobile app backends, and any system requiring standardized resource manipulation.',
  explanation: `HTTP Methods Overview:

HTTP methods (also called verbs) specify the desired action to be performed on a resource. Each method has specific semantics, idempotency properties, and safety characteristics that determine how they should be used in RESTful APIs.

GET retrieves data and should be safe (no side effects) and idempotent (multiple calls produce same result). POST creates new resources and is neither safe nor idempotent. PUT replaces entire resources and is idempotent but not safe. DELETE removes resources and is idempotent but not safe. PATCH performs partial updates and may or may not be idempotent depending on implementation.

Understanding these methods is crucial for designing proper RESTful APIs that follow HTTP semantics and provide predictable behavior for clients.`,

  keyPoints: [
    'GET retrieves data and should be safe and idempotent',
    'POST creates new resources and is neither safe nor idempotent',
    'PUT replaces entire resources and is idempotent but not safe',
    'DELETE removes resources and is idempotent but not safe',
    'PATCH performs partial updates with flexible idempotency',
    'HEAD gets headers only, similar to GET but no body',
    'OPTIONS returns allowed methods for a resource',
    'Safe methods have no side effects on the server',
    'Idempotent methods produce same result when repeated',
    'Proper method usage is essential for RESTful API design'
  ],

  codeExamples: [
    {
      title: "HTTP Methods Overview and Characteristics",
      content: `
        <h3>HTTP Methods Classification</h3>
        <p>Understanding the properties and appropriate usage of each HTTP method.</p>
        
        <div class="code-block">
          <h4>Method Properties Matrix</h4>
          <pre><code>Method  | Safe | Idempotent | Cacheable | Request Body | Response Body
--------|------|------------|-----------|--------------|---------------
GET     | Yes  | Yes        | Yes       | No*          | Yes
HEAD    | Yes  | Yes        | Yes       | No           | No
POST    | No   | No         | No**      | Yes          | Yes
PUT     | No   | Yes        | No        | Yes          | Yes
DELETE  | No   | Yes        | No        | No*          | Yes
PATCH   | No   | No***      | No        | Yes          | Yes
OPTIONS | Yes  | Yes        | No        | No           | Yes
TRACE   | Yes  | Yes        | No        | No           | Yes
CONNECT | No   | No         | No        | No           | Yes

* Generally no body, but technically allowed
** POST responses can be cached with proper headers
*** PATCH can be idempotent depending on implementation</code></pre>
        </div>

        <h4>Safe Methods:</h4>
        <ul>
          <li>Do not modify server state</li>
          <li>Can be called without side effects</li>
          <li>Examples: GET, HEAD, OPTIONS, TRACE</li>
          <li>Should not change data on server</li>
        </ul>

        <h4>Idempotent Methods:</h4>
        <ul>
          <li>Multiple identical requests have same effect as single request</li>
          <li>Examples: GET, HEAD, PUT, DELETE, OPTIONS, TRACE</li>
          <li>Important for retry logic and network reliability</li>
          <li>POST and PATCH are generally not idempotent</li>
        </ul>

        <div class="code-block">
          <h4>RESTful Resource Operations</h4>
          <pre><code>Resource: /api/users

Collection Operations:
GET    /api/users           → List all users
POST   /api/users           → Create new user

Individual Resource Operations:
GET    /api/users/123       → Get user 123
PUT    /api/users/123       → Replace user 123 entirely
PATCH  /api/users/123       → Update specific fields of user 123
DELETE /api/users/123       → Delete user 123

Nested Resources:
GET    /api/users/123/posts → Get posts by user 123
POST   /api/users/123/posts → Create post for user 123

Query Operations:
GET    /api/users?role=admin&active=true → Filter users
GET    /api/users?page=2&limit=10       → Paginated results</code></pre>
        </div>
      `
    },
    
    {
      title: "GET Method - Data Retrieval",
      content: `
        <h3>GET Method Usage and Best Practices</h3>
        <p>GET is used to retrieve data from the server and should be safe and idempotent.</p>
        
        <div class="code-block">
          <h4>GET Request Examples</h4>
          <pre><code>Basic GET Requests:

1. Get All Resources:
GET /api/users HTTP/1.1
Host: api.example.com
Accept: application/json

Response:
HTTP/1.1 200 OK
Content-Type: application/json
[
  {"id": 1, "name": "John", "email": "john@example.com"},
  {"id": 2, "name": "Jane", "email": "jane@example.com"}
]

2. Get Specific Resource:
GET /api/users/123 HTTP/1.1
Host: api.example.com
Accept: application/json

Response:
HTTP/1.1 200 OK
Content-Type: application/json
{"id": 123, "name": "John", "email": "john@example.com", "created": "2024-01-01"}

3. Resource Not Found:
GET /api/users/999 HTTP/1.1

Response:
HTTP/1.1 404 Not Found
Content-Type: application/json
{"error": "User not found", "code": "USER_NOT_FOUND"}</code></pre>
        </div>

        <h4>Query Parameters:</h4>
        
        <div class="code-block">
          <h4>GET with Query Parameters</h4>
          <pre><code>Filtering and Searching:

1. Filter by Attributes:
GET /api/users?role=admin&status=active HTTP/1.1

2. Search with Keywords:
GET /api/users?search=john&fields=name,email HTTP/1.1

3. Pagination:
GET /api/users?page=2&limit=10&sort=name:asc HTTP/1.1

4. Date Ranges:
GET /api/orders?start_date=2024-01-01&end_date=2024-01-31 HTTP/1.1

5. Complex Queries:
GET /api/products?category=electronics&price_min=100&price_max=500&in_stock=true HTTP/1.1

Response Headers for Pagination:
HTTP/1.1 200 OK
X-Total-Count: 150
X-Page: 2
X-Per-Page: 10
Link: </api/users?page=1>; rel="first",
      </api/users?page=3>; rel="next",
      </api/users?page=15>; rel="last"</code></pre>
        </div>

        <h4>GET Best Practices:</h4>
        <ul>
          <li>Use query parameters for filtering, not path parameters</li>
          <li>Implement proper caching headers (ETag, Last-Modified)</li>
          <li>Support pagination for large datasets</li>
          <li>Provide consistent error responses</li>
          <li>Use appropriate HTTP status codes</li>
        </ul>

        <div class="code-block">
          <h4>Caching Headers</h4>
          <pre><code>GET Response with Caching:

HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: public, max-age=3600
ETag: "abc123def456"
Last-Modified: Wed, 01 Jan 2024 12:00:00 GMT

Conditional GET Request:
GET /api/users/123 HTTP/1.1
If-None-Match: "abc123def456"
If-Modified-Since: Wed, 01 Jan 2024 12:00:00 GMT

Response (Not Modified):
HTTP/1.1 304 Not Modified
ETag: "abc123def456"</code></pre>
        </div>
      `
    },
    
    {
      title: "POST Method - Resource Creation",
      content: `
        <h3>POST Method for Creating Resources</h3>
        <p>POST is used to create new resources and submit data to the server.</p>
        
        <div class="code-block">
          <h4>POST Request Examples</h4>
          <pre><code>1. Create New User:
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 85

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "role": "user"
}

Success Response:
HTTP/1.1 201 Created
Location: /api/users/124
Content-Type: application/json

{
  "id": 124,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "role": "user",
  "created": "2024-01-15T10:30:00Z"
}

2. Validation Error:
POST /api/users HTTP/1.1
Content-Type: application/json

{
  "name": "",
  "email": "invalid-email"
}

Error Response:
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Validation failed",
  "details": [
    {"field": "name", "message": "Name is required"},
    {"field": "email", "message": "Invalid email format"}
  ]
}</code></pre>
        </div>

        <h4>POST Use Cases:</h4>
        
        <div class="code-block">
          <h4>Different POST Scenarios</h4>
          <pre><code>1. File Upload:
POST /api/users/123/avatar HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="avatar"; filename="profile.jpg"
Content-Type: image/jpeg

[binary image data]
------WebKitFormBoundary--

2. Form Submission:
POST /api/contact HTTP/1.1
Content-Type: application/x-www-form-urlencoded

name=John+Doe&email=john%40example.com&message=Hello+World

3. Bulk Operations:
POST /api/users/bulk HTTP/1.1
Content-Type: application/json

{
  "users": [
    {"name": "User 1", "email": "user1@example.com"},
    {"name": "User 2", "email": "user2@example.com"}
  ]
}

4. Action Endpoints:
POST /api/users/123/activate HTTP/1.1
Content-Type: application/json

{"reason": "Account verification completed"}

5. Search with Complex Criteria:
POST /api/users/search HTTP/1.1
Content-Type: application/json

{
  "filters": {
    "age": {"min": 18, "max": 65},
    "location": {"city": "New York", "radius": 50},
    "skills": ["JavaScript", "Python"]
  },
  "sort": [{"field": "name", "order": "asc"}]
}</code></pre>
        </div>

        <h4>POST Response Codes:</h4>
        <ul>
          <li><strong>201 Created:</strong> Resource successfully created</li>
          <li><strong>200 OK:</strong> Action completed, but no new resource</li>
          <li><strong>202 Accepted:</strong> Request accepted for async processing</li>
          <li><strong>400 Bad Request:</strong> Invalid request data</li>
          <li><strong>409 Conflict:</strong> Resource already exists</li>
          <li><strong>422 Unprocessable Entity:</strong> Validation errors</li>
        </ul>
      `
    },
    
    {
      title: "PUT vs PATCH - Update Operations",
      content: `
        <h3>PUT vs PATCH for Resource Updates</h3>
        <p>PUT replaces entire resources while PATCH performs partial updates.</p>
        
        <div class="code-block">
          <h4>PUT - Complete Replacement</h4>
          <pre><code>Original Resource:
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "active": true,
  "created": "2024-01-01T00:00:00Z"
}

PUT Request (Replace Entire Resource):
PUT /api/users/123 HTTP/1.1
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "admin",
  "active": true
}

Response:
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "admin",
  "active": true,
  "created": "2024-01-01T00:00:00Z",
  "updated": "2024-01-15T10:30:00Z"
}

Note: All fields must be provided in PUT request</code></pre>
        </div>

        <div class="code-block">
          <h4>PATCH - Partial Updates</h4>
          <pre><code>PATCH Request (Update Specific Fields):
PATCH /api/users/123 HTTP/1.1
Content-Type: application/json

{
  "email": "newemail@example.com",
  "role": "admin"
}

Response:
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "John Doe",           ← Unchanged
  "email": "newemail@example.com", ← Updated
  "role": "admin",              ← Updated
  "active": true,               ← Unchanged
  "created": "2024-01-01T00:00:00Z",
  "updated": "2024-01-15T10:30:00Z"
}

JSON Patch Format (RFC 6902):
PATCH /api/users/123 HTTP/1.1
Content-Type: application/json-patch+json

[
  {"op": "replace", "path": "/email", "value": "newemail@example.com"},
  {"op": "replace", "path": "/role", "value": "admin"},
  {"op": "add", "path": "/tags", "value": ["premium"]},
  {"op": "remove", "path": "/temporary_field"}
]</code></pre>
        </div>

        <h4>PUT vs PATCH Comparison:</h4>
        
        <div class="code-block">
          <h4>Key Differences</h4>
          <pre><code>Aspect          | PUT                    | PATCH
----------------|------------------------|------------------------
Purpose         | Replace entire resource| Update specific fields
Idempotency     | Yes                   | Depends on implementation
Request Body    | Complete resource     | Partial data
Missing Fields  | Set to default/null   | Left unchanged
Use Case        | Full updates          | Partial updates
Bandwidth       | Higher (full data)    | Lower (only changes)
Complexity      | Simple                | More complex logic

Example Scenarios:

PUT - When to use:
- Updating user profile with all fields
- Replacing configuration settings
- Overwriting document content
- Client has complete resource state

PATCH - When to use:
- Changing user password only
- Updating specific product attributes
- Toggling feature flags
- Mobile apps with limited bandwidth</code></pre>
        </div>

        <h4>Error Handling:</h4>
        
        <div class="code-block">
          <h4>Update Error Responses</h4>
          <pre><code>Resource Not Found:
PUT /api/users/999 HTTP/1.1

Response:
HTTP/1.1 404 Not Found
{"error": "User not found"}

Validation Error:
PATCH /api/users/123 HTTP/1.1
{"email": "invalid-email"}

Response:
HTTP/1.1 400 Bad Request
{
  "error": "Validation failed",
  "details": [
    {"field": "email", "message": "Invalid email format"}
  ]
}

Conflict Error:
PATCH /api/users/123 HTTP/1.1
{"email": "existing@example.com"}

Response:
HTTP/1.1 409 Conflict
{"error": "Email already exists"}</code></pre>
        </div>
      `
    },
    
    {
      title: "DELETE Method - Resource Removal",
      content: `
        <h3>DELETE Method for Resource Removal</h3>
        <p>DELETE removes resources from the server and should be idempotent.</p>
        
        <div class="code-block">
          <h4>DELETE Request Examples</h4>
          <pre><code>1. Delete Specific Resource:
DELETE /api/users/123 HTTP/1.1
Host: api.example.com

Success Response:
HTTP/1.1 204 No Content

Alternative Success Response:
HTTP/1.1 200 OK
Content-Type: application/json
{
  "message": "User deleted successfully",
  "deleted_id": 123
}

2. Resource Not Found:
DELETE /api/users/999 HTTP/1.1

Response:
HTTP/1.1 404 Not Found
Content-Type: application/json
{"error": "User not found"}

3. Delete with Confirmation:
DELETE /api/users/123?confirm=true HTTP/1.1

4. Soft Delete (Mark as Deleted):
DELETE /api/users/123 HTTP/1.1

Response:
HTTP/1.1 200 OK
{
  "id": 123,
  "name": "John Doe",
  "deleted": true,
  "deleted_at": "2024-01-15T10:30:00Z"
}</code></pre>
        </div>

        <h4>DELETE Patterns:</h4>
        
        <div class="code-block">
          <h4>Different DELETE Scenarios</h4>
          <pre><code>1. Bulk Delete:
DELETE /api/users HTTP/1.1
Content-Type: application/json

{
  "ids": [123, 124, 125]
}

Response:
HTTP/1.1 200 OK
{
  "deleted_count": 3,
  "failed": []
}

2. Conditional Delete:
DELETE /api/users/123 HTTP/1.1
If-Match: "etag-value"

Response (if ETag matches):
HTTP/1.1 204 No Content

Response (if ETag doesn't match):
HTTP/1.1 412 Precondition Failed

3. Delete with Dependencies:
DELETE /api/users/123 HTTP/1.1

Response (has dependencies):
HTTP/1.1 409 Conflict
{
  "error": "Cannot delete user with active orders",
  "dependencies": {
    "orders": 5,
    "comments": 12
  }
}

4. Cascade Delete:
DELETE /api/users/123?cascade=true HTTP/1.1

Response:
HTTP/1.1 200 OK
{
  "deleted": {
    "user": 1,
    "orders": 5,
    "comments": 12
  }
}</code></pre>
        </div>

        <h4>DELETE Best Practices:</h4>
        <ul>
          <li>Use 204 No Content for successful deletions without response body</li>
          <li>Use 200 OK when returning information about the deletion</li>
          <li>Implement soft deletes for important data</li>
          <li>Handle cascade deletions carefully</li>
          <li>Provide confirmation mechanisms for destructive operations</li>
          <li>Log all delete operations for audit trails</li>
        </ul>

        <div class="code-block">
          <h4>Idempotency in DELETE</h4>
          <pre><code>DELETE Idempotency Example:

First DELETE request:
DELETE /api/users/123 HTTP/1.1

Response:
HTTP/1.1 204 No Content

Second DELETE request (same resource):
DELETE /api/users/123 HTTP/1.1

Response (idempotent - same result):
HTTP/1.1 404 Not Found
{"error": "User not found"}

OR (alternative idempotent approach):
HTTP/1.1 204 No Content

The key is that multiple DELETE requests should have the same end result:
the resource should not exist after the operation.</code></pre>
        </div>
      `
    },
    
    {
      title: "Advanced HTTP Methods",
      content: `
        <h3>HEAD, OPTIONS, and Other HTTP Methods</h3>
        <p>Less common but important HTTP methods for specific use cases.</p>
        
        <div class="code-block">
          <h4>HEAD Method</h4>
          <pre><code>HEAD - Get Headers Only (no response body):

HEAD /api/users/123 HTTP/1.1
Host: api.example.com

Response:
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 156
Last-Modified: Wed, 01 Jan 2024 12:00:00 GMT
ETag: "abc123def456"

Use Cases:
- Check if resource exists without downloading content
- Get metadata (size, modification date)
- Validate cache without full download
- Check resource availability before GET request</code></pre>
        </div>

        <div class="code-block">
          <h4>OPTIONS Method</h4>
          <pre><code>OPTIONS - Discover Allowed Methods:

OPTIONS /api/users/123 HTTP/1.1
Host: api.example.com

Response:
HTTP/1.1 200 OK
Allow: GET, PUT, PATCH, DELETE, HEAD, OPTIONS
Access-Control-Allow-Methods: GET, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400

CORS Preflight Request:
OPTIONS /api/users HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

Response:
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 3600</code></pre>
        </div>

        <div class="code-block">
          <h4>Method Override</h4>
          <pre><code>Method Override for Limited Clients:

Some clients (HTML forms, older browsers) only support GET/POST.
Use method override headers:

POST /api/users/123 HTTP/1.1
X-HTTP-Method-Override: PUT
Content-Type: application/json

{
  "name": "Updated Name"
}

Alternative with form parameter:
POST /api/users/123 HTTP/1.1
Content-Type: application/x-www-form-urlencoded

_method=PUT&name=Updated+Name

Server treats this as PUT request.</code></pre>
        </div>

        <h4>Method Selection Guidelines:</h4>
        
        <div class="code-block">
          <h4>Choosing the Right Method</h4>
          <pre><code>Operation Type          | Method | Example
------------------------|--------|---------------------------
Retrieve data          | GET    | GET /api/users
Create new resource    | POST   | POST /api/users
Replace entire resource| PUT    | PUT /api/users/123
Update partial resource| PATCH  | PATCH /api/users/123
Remove resource        | DELETE | DELETE /api/users/123
Get metadata only      | HEAD   | HEAD /api/users/123
Check allowed methods  | OPTIONS| OPTIONS /api/users
Execute action         | POST   | POST /api/users/123/activate
Search with complex    | POST   | POST /api/users/search
  criteria             |        |

RESTful Resource Design:
Collection: /api/users
- GET: List users
- POST: Create user

Individual: /api/users/{id}
- GET: Get specific user
- PUT: Replace user
- PATCH: Update user
- DELETE: Remove user
- HEAD: Check user exists
- OPTIONS: Get allowed operations</code></pre>
        </div>
      `
    }
  ],

  codeExamples: [
    {
      title: "Complete HTTP Methods Client",
      language: "java",
      code: `import java.io.*;
import java.net.*;
import java.util.*;

public class HTTPMethodsClient {
    
    private String baseUrl;
    
    public HTTPMethodsClient(String baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    // GET Request - Retrieve data
    public String get(String endpoint, Map<String, String> headers) {
        return makeRequest("GET", endpoint, null, headers);
    }
    
    // POST Request - Create resource
    public String post(String endpoint, String requestBody, Map<String, String> headers) {
        return makeRequest("POST", endpoint, requestBody, headers);
    }
    
    // PUT Request - Replace resource
    public String put(String endpoint, String requestBody, Map<String, String> headers) {
        return makeRequest("PUT", endpoint, requestBody, headers);
    }
    
    // PATCH Request - Partial update
    public String patch(String endpoint, String requestBody, Map<String, String> headers) {
        return makeRequest("PATCH", endpoint, requestBody, headers);
    }
    
    // DELETE Request - Remove resource
    public String delete(String endpoint, Map<String, String> headers) {
        return makeRequest("DELETE", endpoint, null, headers);
    }
    
    // HEAD Request - Get headers only
    public Map<String, List<String>> head(String endpoint, Map<String, String> headers) {
        try {
            URL url = new URL(baseUrl + endpoint);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            connection.setRequestMethod("HEAD");
            setHeaders(connection, headers);
            
            int responseCode = connection.getResponseCode();
            Map<String, List<String>> responseHeaders = connection.getHeaderFields();
            
            System.out.println("HEAD " + endpoint + " - Response: " + responseCode);
            
            connection.disconnect();
            return responseHeaders;
            
        } catch (IOException e) {
            System.err.println("HEAD request failed: " + e.getMessage());
            return new HashMap<>();
        }
    }
    
    // OPTIONS Request - Get allowed methods
    public String options(String endpoint, Map<String, String> headers) {
        try {
            URL url = new URL(baseUrl + endpoint);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            connection.setRequestMethod("OPTIONS");
            setHeaders(connection, headers);
            
            int responseCode = connection.getResponseCode();
            
            // Get Allow header
            String allowedMethods = connection.getHeaderField("Allow");
            
            System.out.println("OPTIONS " + endpoint + " - Response: " + responseCode);
            System.out.println("Allowed Methods: " + allowedMethods);
            
            // Read response body if present
            StringBuilder response = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(connection.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line).append("\\n");
                }
            } catch (IOException e) {
                // OPTIONS might not have response body
            }
            
            connection.disconnect();
            return response.toString();
            
        } catch (IOException e) {
            System.err.println("OPTIONS request failed: " + e.getMessage());
            return "";
        }
    }
    
    // Generic request method
    private String makeRequest(String method, String endpoint, String requestBody, 
                              Map<String, String> headers) {
        StringBuilder response = new StringBuilder();
        
        try {
            URL url = new URL(baseUrl + endpoint);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            // Set request method
            connection.setRequestMethod(method);
            
            // Set headers
            setHeaders(connection, headers);
            
            // Set request body for POST, PUT, PATCH
            if (requestBody != null && (method.equals("POST") || method.equals("PUT") || method.equals("PATCH"))) {
                connection.setDoOutput(true);
                connection.setRequestProperty("Content-Type", "application/json");
                
                try (OutputStream os = connection.getOutputStream()) {
                    byte[] input = requestBody.getBytes("utf-8");
                    os.write(input, 0, input.length);
                }
            }
            
            // Get response
            int responseCode = connection.getResponseCode();
            System.out.println(method + " " + endpoint + " - Response: " + responseCode);
            
            // Read response body
            InputStream inputStream;
            if (responseCode >= 200 && responseCode < 300) {
                inputStream = connection.getInputStream();
            } else {
                inputStream = connection.getErrorStream();
            }
            
            if (inputStream != null) {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(inputStream))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line).append("\\n");
                    }
                }
            }
            
            connection.disconnect();
            
        } catch (IOException e) {
            System.err.println(method + " request failed: " + e.getMessage());
            return "Error: " + e.getMessage();
        }
        
        return response.toString();
    }
    
    // Set request headers
    private void setHeaders(HttpURLConnection connection, Map<String, String> headers) {
        if (headers != null) {
            for (Map.Entry<String, String> header : headers.entrySet()) {
                connection.setRequestProperty(header.getKey(), header.getValue());
            }
        }
        
        // Set default headers
        connection.setRequestProperty("User-Agent", "Java HTTP Client");
        connection.setRequestProperty("Accept", "application/json");
    }
    
    // Demonstrate all HTTP methods
    public void demonstrateAllMethods() {
        System.out.println("=== HTTP Methods Demonstration ===\\n");
        
        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer token123");
        
        // 1. GET - Retrieve users
        System.out.println("1. GET Request:");
        String users = get("/users", headers);
        System.out.println("Response: " + users.substring(0, Math.min(100, users.length())) + "...\\n");
        
        // 2. POST - Create new user
        System.out.println("2. POST Request:");
        String newUser = "{\\"name\\": \\"John Doe\\", \\"email\\": \\"john@example.com\\"}";
        String createResponse = post("/users", newUser, headers);
        System.out.println("Response: " + createResponse + "\\n");
        
        // 3. PUT - Replace user
        System.out.println("3. PUT Request:");
        String updatedUser = "{\\"name\\": \\"John Smith\\", \\"email\\": \\"johnsmith@example.com\\", \\"role\\": \\"admin\\"}";
        String putResponse = put("/users/1", updatedUser, headers);
        System.out.println("Response: " + putResponse + "\\n");
        
        // 4. PATCH - Partial update
        System.out.println("4. PATCH Request:");
        String patchData = "{\\"email\\": \\"newemail@example.com\\"}";
        String patchResponse = patch("/users/1", patchData, headers);
        System.out.println("Response: " + patchResponse + "\\n");
        
        // 5. HEAD - Get headers only
        System.out.println("5. HEAD Request:");
        Map<String, List<String>> headResponse = head("/users/1", headers);
        System.out.println("Headers received: " + headResponse.size() + "\\n");
        
        // 6. OPTIONS - Get allowed methods
        System.out.println("6. OPTIONS Request:");
        String optionsResponse = options("/users/1", headers);
        System.out.println("Response: " + optionsResponse + "\\n");
        
        // 7. DELETE - Remove user
        System.out.println("7. DELETE Request:");
        String deleteResponse = delete("/users/1", headers);
        System.out.println("Response: " + deleteResponse + "\\n");
    }
    
    public static void main(String[] args) {
        // Using JSONPlaceholder API for demonstration
        HTTPMethodsClient client = new HTTPMethodsClient("https://jsonplaceholder.typicode.com");
        
        client.demonstrateAllMethods();
        
        // Additional examples
        System.out.println("=== Additional Examples ===\\n");
        
        // Query parameters with GET
        System.out.println("GET with query parameters:");
        String filteredUsers = client.get("/users?_limit=3", null);
        System.out.println("Limited users: " + filteredUsers.length() + " characters\\n");
        
        // Error handling
        System.out.println("Error handling example:");
        String notFound = client.get("/users/999", null);
        System.out.println("Not found response: " + notFound + "\\n");
    }
}`
    },
    
    {
      title: "RESTful API Server Implementation",
      language: "python",
      code: `from flask import Flask, request, jsonify, make_response
from datetime import datetime
import json

app = Flask(__name__)

# In-memory data store (use database in production)
users = {
    1: {"id": 1, "name": "John Doe", "email": "john@example.com", "role": "user", "active": True},
    2: {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "admin", "active": True}
}
next_id = 3

# GET - Retrieve all users or specific user
@app.route('/api/users', methods=['GET'])
def get_users():
    # Query parameters
    role = request.args.get('role')
    active = request.args.get('active')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    
    # Filter users
    filtered_users = list(users.values())
    
    if role:
        filtered_users = [u for u in filtered_users if u.get('role') == role]
    
    if active is not None:
        active_bool = active.lower() == 'true'
        filtered_users = [u for u in filtered_users if u.get('active') == active_bool]
    
    # Pagination
    start = (page - 1) * limit
    end = start + limit
    paginated_users = filtered_users[start:end]
    
    # Response with pagination headers
    response = make_response(jsonify(paginated_users))
    response.headers['X-Total-Count'] = len(filtered_users)
    response.headers['X-Page'] = page
    response.headers['X-Per-Page'] = limit
    
    return response

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = users.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Add caching headers
    response = make_response(jsonify(user))
    response.headers['ETag'] = f'"{user_id}-{hash(str(user))}"'
    response.headers['Cache-Control'] = 'public, max-age=300'
    
    return response

# POST - Create new user
@app.route('/api/users', methods=['POST'])
def create_user():
    global next_id
    
    data = request.get_json()
    
    # Validation
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    errors = []
    if not data.get('name'):
        errors.append({"field": "name", "message": "Name is required"})
    if not data.get('email'):
        errors.append({"field": "email", "message": "Email is required"})
    elif '@' not in data['email']:
        errors.append({"field": "email", "message": "Invalid email format"})
    
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400
    
    # Check for duplicate email
    for user in users.values():
        if user['email'] == data['email']:
            return jsonify({"error": "Email already exists"}), 409
    
    # Create new user
    new_user = {
        "id": next_id,
        "name": data['name'],
        "email": data['email'],
        "role": data.get('role', 'user'),
        "active": data.get('active', True),
        "created": datetime.now().isoformat()
    }
    
    users[next_id] = new_user
    user_id = next_id
    next_id += 1
    
    # Return created resource with Location header
    response = make_response(jsonify(new_user), 201)
    response.headers['Location'] = f'/api/users/{user_id}'
    
    return response

# PUT - Replace entire user
@app.route('/api/users/<int:user_id>', methods=['PUT'])
def replace_user(user_id):
    if user_id not in users:
        return jsonify({"error": "User not found"}), 404
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Validation (all fields required for PUT)
    required_fields = ['name', 'email', 'role', 'active']
    errors = []
    
    for field in required_fields:
        if field not in data:
            errors.append({"field": field, "message": f"{field} is required"})
    
    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400
    
    # Check for duplicate email (excluding current user)
    for uid, user in users.items():
        if uid != user_id and user['email'] == data['email']:
            return jsonify({"error": "Email already exists"}), 409
    
    # Replace entire user (keep id and created date)
    original_user = users[user_id]
    users[user_id] = {
        "id": user_id,
        "name": data['name'],
        "email": data['email'],
        "role": data['role'],
        "active": data['active'],
        "created": original_user.get('created'),
        "updated": datetime.now().isoformat()
    }
    
    return jsonify(users[user_id])

# PATCH - Partial update
@app.route('/api/users/<int:user_id>', methods=['PATCH'])
def update_user(user_id):
    if user_id not in users:
        return jsonify({"error": "User not found"}), 404
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    user = users[user_id]
    
    # Validate provided fields
    if 'email' in data:
        if '@' not in data['email']:
            return jsonify({"error": "Invalid email format"}), 400
        
        # Check for duplicate email
        for uid, u in users.items():
            if uid != user_id and u['email'] == data['email']:
                return jsonify({"error": "Email already exists"}), 409
    
    # Update only provided fields
    updatable_fields = ['name', 'email', 'role', 'active']
    for field in updatable_fields:
        if field in data:
            user[field] = data[field]
    
    user['updated'] = datetime.now().isoformat()
    
    return jsonify(user)

# DELETE - Remove user
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    if user_id not in users:
        return jsonify({"error": "User not found"}), 404
    
    # Check for dependencies (example)
    # In real app, check for related records
    
    deleted_user = users.pop(user_id)
    
    # Return 204 No Content for successful deletion
    return '', 204
    
    # Alternative: Return information about deletion
    # return jsonify({"message": "User deleted successfully", "deleted_id": user_id})

# HEAD - Get user metadata
@app.route('/api/users/<int:user_id>', methods=['HEAD'])
def head_user(user_id):
    user = users.get(user_id)
    if not user:
        return '', 404
    
    response = make_response('', 200)
    response.headers['Content-Type'] = 'application/json'
    response.headers['Content-Length'] = len(json.dumps(user))
    response.headers['ETag'] = f'"{user_id}-{hash(str(user))}"'
    
    return response

# OPTIONS - Get allowed methods
@app.route('/api/users', methods=['OPTIONS'])
@app.route('/api/users/<int:user_id>', methods=['OPTIONS'])
def options_users(user_id=None):
    if user_id:
        # Individual resource
        allowed_methods = ['GET', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
    else:
        # Collection
        allowed_methods = ['GET', 'POST', 'OPTIONS']
    
    response = make_response('', 200)
    response.headers['Allow'] = ', '.join(allowed_methods)
    response.headers['Access-Control-Allow-Methods'] = ', '.join(allowed_methods)
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Max-Age'] = '3600'
    
    return response

# Error handlers
@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"error": "Method not allowed"}), 405

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# CORS support
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
    return response

if __name__ == '__main__':
    print("Starting RESTful API server...")
    print("Available endpoints:")
    print("GET    /api/users          - List users")
    print("POST   /api/users          - Create user")
    print("GET    /api/users/<id>     - Get specific user")
    print("PUT    /api/users/<id>     - Replace user")
    print("PATCH  /api/users/<id>     - Update user")
    print("DELETE /api/users/<id>     - Delete user")
    print("HEAD   /api/users/<id>     - Get user metadata")
    print("OPTIONS /api/users[/<id>]  - Get allowed methods")
    
    app.run(debug=True, port=5000)`
    }
  ],

  resources: [
    { type: 'video', title: 'HTTP Methods Explained', url: 'https://www.youtube.com/results?search_query=http+methods+get+post+put+delete', description: 'Video tutorials on HTTP methods and their usage' },
    { type: 'article', title: 'RESTful API Design Guide', url: 'https://restfulapi.net/http-methods/', description: 'Comprehensive guide to HTTP methods in REST APIs' },
    { type: 'documentation', title: 'HTTP Method Definitions (RFC 7231)', url: 'https://tools.ietf.org/html/rfc7231#section-4', description: 'Official HTTP method specifications' },
    { type: 'article', title: 'PUT vs PATCH in REST APIs', url: 'https://stackoverflow.com/questions/28459418/rest-api-put-vs-patch-with-real-life-examples', description: 'Detailed comparison of PUT and PATCH methods' },
    { type: 'tool', title: 'Postman API Testing', url: 'https://www.postman.com/', description: 'Tool for testing HTTP methods and APIs' }
  ],

  questions: [
    {
      question: "What are the key differences between GET and POST methods?",
      answer: "Key differences: 1) Purpose - GET retrieves data, POST submits data, 2) Safety - GET is safe (no side effects), POST is not safe, 3) Idempotency - GET is idempotent, POST is not, 4) Caching - GET responses can be cached, POST typically cannot, 5) Data location - GET uses query parameters, POST uses request body, 6) Data size - GET has URL length limits, POST can handle large data, 7) Visibility - GET parameters visible in URL/logs, POST body is hidden."
    },
    
    {
      question: "When should you use PUT vs PATCH for updates?",
      answer: "Use PUT when: 1) Replacing entire resource, 2) Client has complete resource state, 3) All fields must be provided, 4) Idempotency is required. Use PATCH when: 1) Updating specific fields only, 2) Partial updates needed, 3) Bandwidth optimization important, 4) Client doesn't have full resource state. Example: PUT for profile update with all fields, PATCH for changing just password or email."
    },
    
    {
      question: "What makes HTTP methods idempotent and why is it important?",
      answer: "Idempotent methods produce the same result when called multiple times. Idempotent methods: GET, PUT, DELETE, HEAD, OPTIONS. Non-idempotent: POST, PATCH (usually). Importance: 1) Safe retry logic - clients can retry failed requests, 2) Network reliability - handles duplicate requests gracefully, 3) Caching - enables better caching strategies, 4) Load balancing - allows request duplication across servers. Example: DELETE /users/123 called twice should have same end result (user deleted)."
    },
    
    {
      question: "How do you handle errors with different HTTP methods?",
      answer: "Error handling by method: GET - 404 (not found), 400 (bad query params), POST - 400 (validation errors), 409 (conflicts), 422 (unprocessable entity), PUT - 404 (resource not found), 400 (validation), 409 (conflicts), PATCH - 404 (not found), 400 (validation), 409 (conflicts), DELETE - 404 (not found), 409 (dependencies exist). Always return appropriate status codes with descriptive error messages in response body."
    },
    
    {
      question: "What is the purpose of HEAD and OPTIONS methods?",
      answer: "HEAD method: 1) Gets response headers without body, 2) Checks resource existence, 3) Validates cache without downloading, 4) Gets metadata (size, modification date). OPTIONS method: 1) Discovers allowed methods for resource, 2) CORS preflight requests, 3) API capability discovery, 4) Returns Allow header with supported methods. Both are safe methods used for metadata and capability discovery rather than data manipulation."
    },
    
    {
      question: "How do you implement proper RESTful endpoints using HTTP methods?",
      answer: "RESTful endpoint design: Collection endpoints - GET /users (list), POST /users (create). Individual endpoints - GET /users/123 (retrieve), PUT /users/123 (replace), PATCH /users/123 (update), DELETE /users/123 (remove). Nested resources - GET /users/123/orders (user's orders), POST /users/123/orders (create order for user). Actions - POST /users/123/activate (non-CRUD operations). Use appropriate status codes: 200 (OK), 201 (Created), 204 (No Content), 404 (Not Found)."
    },
    
    {
      question: "What are safe HTTP methods and why are they important?",
      answer: "Safe methods don't modify server state: GET, HEAD, OPTIONS, TRACE. Importance: 1) Caching - safe methods can be cached aggressively, 2) Prefetching - browsers can prefetch safe resources, 3) Crawling - search engines can safely crawl, 4) Retry logic - safe to retry without side effects, 5) User expectations - users expect safe methods won't change data. Violation example: using GET for logout (unsafe operation) breaks user expectations and caching assumptions."
    },
    
    {
      question: "How do you handle bulk operations with HTTP methods?",
      answer: "Bulk operations approaches: 1) POST to collection with array - POST /users (create multiple), 2) PATCH to collection - PATCH /users (update multiple), 3) DELETE with query params - DELETE /users?ids=1,2,3, 4) Dedicated bulk endpoints - POST /users/bulk-create, 5) Batch API - POST /batch with multiple operations. Response should indicate success/failure for each item. Consider transaction boundaries and partial failure handling. Use appropriate status codes: 207 (Multi-Status) for mixed results."
    },
    
    {
      question: "What is method override and when is it needed?",
      answer: "Method override allows clients that only support GET/POST (HTML forms, some proxies) to use other HTTP methods. Implementation: 1) X-HTTP-Method-Override header, 2) _method form parameter, 3) Query parameter override. Example: POST /users/123 with X-HTTP-Method-Override: PUT treated as PUT request. Needed for: 1) HTML forms (only support GET/POST), 2) Legacy clients, 3) Proxy restrictions, 4) Firewall limitations. Server must explicitly support and process override headers."
    },
    
    {
      question: "How do you implement conditional requests with HTTP methods?",
      answer: "Conditional requests use headers to control method execution: 1) If-Match with ETag - only proceed if resource unchanged, 2) If-None-Match - only proceed if resource changed, 3) If-Modified-Since - only if modified after date, 4) If-Unmodified-Since - only if not modified since date. Examples: PUT /users/123 with If-Match: 'etag123' (optimistic locking), GET /users/123 with If-None-Match: 'etag123' (cache validation). Responses: 304 Not Modified, 412 Precondition Failed. Enables efficient caching and prevents lost updates."
    }
  ]
};