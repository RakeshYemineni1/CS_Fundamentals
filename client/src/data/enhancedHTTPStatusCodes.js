export const enhancedHTTPStatusCodes = {
  id: 'http-status-codes',
  title: 'HTTP Status Codes (2xx, 3xx, 4xx, 5xx)',
  subtitle: 'Understanding HTTP Response Status Codes',
  summary: 'HTTP status codes indicate the result of HTTP requests, categorized into 2xx (success), 3xx (redirection), 4xx (client errors), and 5xx (server errors), each providing specific information about request processing.',
  analogy: 'Like traffic signals: green (2xx - success, proceed), yellow (3xx - redirect, go elsewhere), red (4xx - stop, you made an error), flashing red (5xx - system problem, try again later).',
  visualConcept: 'Picture status codes as a communication system between client and server, with each number range conveying different types of outcomes and required actions.',
  realWorldUse: 'Web applications, REST APIs, error handling, debugging, monitoring systems, and any HTTP-based communication requiring proper status indication.',
  explanation: `HTTP Status Codes Classification:

HTTP status codes are three-digit numbers that indicate the outcome of HTTP requests. They are grouped into five classes based on the first digit, each representing a different category of response.

2xx Success codes indicate the request was received, understood, and processed successfully. 3xx Redirection codes indicate the client must take additional action to complete the request. 4xx Client Error codes indicate the request contains bad syntax or cannot be fulfilled due to client error. 5xx Server Error codes indicate the server failed to fulfill a valid request.

Understanding status codes is crucial for proper error handling, debugging, API design, and creating robust web applications that provide meaningful feedback to users and developers.`,

  keyPoints: [
    '2xx codes indicate successful request processing',
    '3xx codes require client redirection or additional action',
    '4xx codes indicate client-side errors in the request',
    '5xx codes indicate server-side processing failures',
    'Status codes provide standardized communication between client and server',
    'Proper status codes are essential for REST API design',
    'Different codes within each class have specific meanings',
    'Status codes help with debugging and error handling',
    'Search engines and browsers interpret status codes differently',
    'Custom status codes should follow HTTP specifications'
  ],

  codeExamples: [
    {
      title: "HTTP Status Codes Overview",
      content: `
        <h3>Complete HTTP Status Code Reference</h3>
        <p>Comprehensive guide to HTTP status codes organized by category.</p>
        
        <div class="code-block">
          <h4>2xx Success Codes</h4>
          <pre><code>200 OK - Request successful, response contains data
Example: GET /api/users → Returns user list

201 Created - Resource successfully created
Example: POST /api/users → New user created
Response includes Location header: /api/users/123

202 Accepted - Request accepted for processing (async)
Example: POST /api/reports/generate → Report generation started
Response: {"message": "Report generation started", "job_id": "abc123"}

204 No Content - Success but no response body
Example: DELETE /api/users/123 → User deleted successfully

206 Partial Content - Partial resource delivered
Example: GET /api/files/video.mp4 with Range header
Response includes Content-Range header</code></pre>
        </div>

        <div class="code-block">
          <h4>3xx Redirection Codes</h4>
          <pre><code>301 Moved Permanently - Resource permanently moved
Example: GET /old-api/users → Redirect to /api/v2/users
Response includes Location header for SEO transfer

302 Found - Temporary redirect
Example: GET /dashboard → Redirect to /login (if not authenticated)

304 Not Modified - Resource unchanged (cache validation)
Example: GET /api/users/123 with If-None-Match: "etag123"
Client can use cached version

307 Temporary Redirect - Same as 302 but preserves method
Example: POST /api/submit → Redirect to /api/v2/submit (keeps POST)

308 Permanent Redirect - Same as 301 but preserves method
Example: PUT /old-api/users/123 → Redirect to /api/v2/users/123 (keeps PUT)</code></pre>
        </div>

        <div class="code-block">
          <h4>4xx Client Error Codes</h4>
          <pre><code>400 Bad Request - Invalid request syntax or data
Example: POST /api/users with malformed JSON
Response: {"error": "Invalid JSON format"}

401 Unauthorized - Authentication required
Example: GET /api/protected without Authorization header
Response: {"error": "Authentication required"}

403 Forbidden - Access denied (authenticated but not authorized)
Example: DELETE /api/users/123 (user lacks admin privileges)
Response: {"error": "Insufficient permissions"}

404 Not Found - Resource doesn't exist
Example: GET /api/users/999 (user doesn't exist)
Response: {"error": "User not found"}

405 Method Not Allowed - HTTP method not supported
Example: DELETE /api/users (collection doesn't support DELETE)
Response includes Allow header: "GET, POST"

409 Conflict - Request conflicts with current state
Example: POST /api/users with existing email
Response: {"error": "Email already exists"}

422 Unprocessable Entity - Valid syntax but semantic errors
Example: POST /api/users with invalid email format
Response: {"errors": [{"field": "email", "message": "Invalid format"}]}

429 Too Many Requests - Rate limit exceeded
Example: Multiple rapid API calls
Response: {"error": "Rate limit exceeded", "retry_after": 60}</code></pre>
        </div>

        <div class="code-block">
          <h4>5xx Server Error Codes</h4>
          <pre><code>500 Internal Server Error - Generic server error
Example: Database connection failure
Response: {"error": "Internal server error", "request_id": "abc123"}

502 Bad Gateway - Invalid response from upstream server
Example: API gateway receives invalid response from backend
Response: {"error": "Service temporarily unavailable"}

503 Service Unavailable - Server temporarily overloaded
Example: Maintenance mode or high load
Response includes Retry-After header: 3600 (seconds)

504 Gateway Timeout - Upstream server timeout
Example: Database query takes too long
Response: {"error": "Request timeout", "timeout": 30}

507 Insufficient Storage - Server out of storage space
Example: File upload when disk full
Response: {"error": "Storage quota exceeded"}</code></pre>
        </div>
      `
    },
    
    {
      title: "Status Code Usage in REST APIs",
      content: `
        <h3>RESTful API Status Code Patterns</h3>
        <p>Best practices for using status codes in REST API design.</p>
        
        <div class="code-block">
          <h4>CRUD Operations Status Codes</h4>
          <pre><code>CREATE (POST) Operations:
POST /api/users
Success: 201 Created + Location header
Validation Error: 400 Bad Request
Conflict: 409 Conflict (duplicate email)
Server Error: 500 Internal Server Error

READ (GET) Operations:
GET /api/users/123
Success: 200 OK
Not Found: 404 Not Found
Conditional: 304 Not Modified (with ETag)
Server Error: 500 Internal Server Error

UPDATE (PUT/PATCH) Operations:
PUT /api/users/123
Success: 200 OK (with response body) or 204 No Content
Not Found: 404 Not Found
Validation Error: 400 Bad Request
Conflict: 409 Conflict
Precondition Failed: 412 (with If-Match)

DELETE Operations:
DELETE /api/users/123
Success: 204 No Content or 200 OK (with info)
Not Found: 404 Not Found
Conflict: 409 Conflict (has dependencies)
Forbidden: 403 Forbidden (cannot delete)</code></pre>
        </div>

        <div class="code-block">
          <h4>Authentication and Authorization</h4>
          <pre><code>Authentication Flow:
POST /api/auth/login
Success: 200 OK + JWT token
Invalid Credentials: 401 Unauthorized
Account Locked: 423 Locked
Too Many Attempts: 429 Too Many Requests

Protected Resource Access:
GET /api/admin/users
No Token: 401 Unauthorized
Invalid Token: 401 Unauthorized
Expired Token: 401 Unauthorized
Valid Token, No Permission: 403 Forbidden
Success: 200 OK

Token Refresh:
POST /api/auth/refresh
Success: 200 OK + new token
Invalid Refresh Token: 401 Unauthorized
Expired Refresh Token: 401 Unauthorized</code></pre>
        </div>

        <div class="code-block">
          <h4>Error Response Format</h4>
          <pre><code>Standardized Error Response Structure:

400 Bad Request:
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "value": "invalid-email"
      },
      {
        "field": "age",
        "message": "Must be between 18 and 120",
        "value": 15
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/users",
  "request_id": "req-123456"
}

404 Not Found:
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "User not found",
    "resource": "user",
    "identifier": "123"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/users/123",
  "request_id": "req-123457"
}

500 Internal Server Error:
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "request_id": "req-123458"
  },
  "timestamp": "2024-01-15T10:30:00Z"
  // Don't expose internal details in production
}</code></pre>
        </div>

        <h4>Status Code Selection Guidelines:</h4>
        <ul>
          <li>Use 200 for successful GET requests with data</li>
          <li>Use 201 for successful resource creation</li>
          <li>Use 204 for successful operations without response data</li>
          <li>Use 400 for client-side validation errors</li>
          <li>Use 401 for authentication issues</li>
          <li>Use 403 for authorization issues</li>
          <li>Use 404 for missing resources</li>
          <li>Use 409 for business logic conflicts</li>
          <li>Use 422 for semantic validation errors</li>
          <li>Use 500 for unexpected server errors</li>
        </ul>
      `
    },
    
    {
      title: "Advanced Status Code Scenarios",
      content: `
        <h3>Complex Status Code Usage</h3>
        <p>Advanced scenarios and less common but important status codes.</p>
        
        <div class="code-block">
          <h4>Conditional Requests</h4>
          <pre><code>ETag-based Conditional Requests:

GET /api/users/123
Response:
HTTP/1.1 200 OK
ETag: "abc123"
{"id": 123, "name": "John", "email": "john@example.com"}

Subsequent request with condition:
GET /api/users/123
If-None-Match: "abc123"

Response (if unchanged):
HTTP/1.1 304 Not Modified
ETag: "abc123"
(no body - client uses cached version)

Conditional Updates:
PUT /api/users/123
If-Match: "abc123"
{"name": "John Smith", "email": "johnsmith@example.com"}

Response (if ETag matches):
HTTP/1.1 200 OK
ETag: "def456"
{"id": 123, "name": "John Smith", "email": "johnsmith@example.com"}

Response (if ETag doesn't match):
HTTP/1.1 412 Precondition Failed
{"error": "Resource has been modified by another client"}</code></pre>
        </div>

        <div class="code-block">
          <h4>Rate Limiting and Throttling</h4>
          <pre><code>Rate Limit Responses:

Normal Request:
GET /api/users
Response:
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642694400
[user data]

Rate Limit Exceeded:
GET /api/users
Response:
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1642694400
Retry-After: 3600

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "API rate limit exceeded",
    "limit": 1000,
    "window": "1 hour",
    "retry_after": 3600
  }
}</code></pre>
        </div>

        <div class="code-block">
          <h4>Partial Content and Range Requests</h4>
          <pre><code>Range Request for Large Files:

GET /api/files/video.mp4
Range: bytes=0-1023

Response:
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-1023/2048000
Content-Length: 1024
Content-Type: video/mp4

[first 1024 bytes of video]

Multiple Ranges:
GET /api/files/document.pdf
Range: bytes=0-499, 1000-1499

Response:
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=boundary123

--boundary123
Content-Type: application/pdf
Content-Range: bytes 0-499/2000

[bytes 0-499]
--boundary123
Content-Type: application/pdf
Content-Range: bytes 1000-1499/2000

[bytes 1000-1499]
--boundary123--</code></pre>
        </div>

        <div class="code-block">
          <h4>Async Operations</h4>
          <pre><code>Long-Running Operations:

POST /api/reports/generate
{
  "type": "annual_sales",
  "year": 2024,
  "format": "pdf"
}

Response:
HTTP/1.1 202 Accepted
Location: /api/jobs/job-123
{
  "job_id": "job-123",
  "status": "processing",
  "message": "Report generation started",
  "estimated_completion": "2024-01-15T11:00:00Z"
}

Check Job Status:
GET /api/jobs/job-123

Response (still processing):
HTTP/1.1 200 OK
{
  "job_id": "job-123",
  "status": "processing",
  "progress": 45,
  "message": "Generating charts..."
}

Response (completed):
HTTP/1.1 200 OK
{
  "job_id": "job-123",
  "status": "completed",
  "result_url": "/api/reports/annual_sales_2024.pdf",
  "completed_at": "2024-01-15T10:45:00Z"
}

Response (failed):
HTTP/1.1 200 OK
{
  "job_id": "job-123",
  "status": "failed",
  "error": "Insufficient data for report generation",
  "failed_at": "2024-01-15T10:35:00Z"
}</code></pre>
        </div>

        <h4>Less Common but Important Status Codes:</h4>
        <ul>
          <li><strong>410 Gone:</strong> Resource permanently deleted (vs 404 never existed)</li>
          <li><strong>413 Payload Too Large:</strong> Request body exceeds server limits</li>
          <li><strong>415 Unsupported Media Type:</strong> Content-Type not supported</li>
          <li><strong>418 I'm a teapot:</strong> April Fools' joke, sometimes used for rate limiting</li>
          <li><strong>423 Locked:</strong> Resource is locked (WebDAV)</li>
          <li><strong>426 Upgrade Required:</strong> Client must upgrade protocol</li>
          <li><strong>451 Unavailable For Legal Reasons:</strong> Censorship/legal restrictions</li>
        </ul>
      `
    }
  ],

  codeExamples: [
    {
      title: "Status Code Handler Implementation",
      language: "java",
      code: `import java.util.*;

public class HTTPStatusCodeHandler {
    
    // Status code constants
    public static class StatusCode {
        // 2xx Success
        public static final int OK = 200;
        public static final int CREATED = 201;
        public static final int ACCEPTED = 202;
        public static final int NO_CONTENT = 204;
        public static final int PARTIAL_CONTENT = 206;
        
        // 3xx Redirection
        public static final int MOVED_PERMANENTLY = 301;
        public static final int FOUND = 302;
        public static final int NOT_MODIFIED = 304;
        public static final int TEMPORARY_REDIRECT = 307;
        public static final int PERMANENT_REDIRECT = 308;
        
        // 4xx Client Error
        public static final int BAD_REQUEST = 400;
        public static final int UNAUTHORIZED = 401;
        public static final int FORBIDDEN = 403;
        public static final int NOT_FOUND = 404;
        public static final int METHOD_NOT_ALLOWED = 405;
        public static final int CONFLICT = 409;
        public static final int PRECONDITION_FAILED = 412;
        public static final int PAYLOAD_TOO_LARGE = 413;
        public static final int UNPROCESSABLE_ENTITY = 422;
        public static final int TOO_MANY_REQUESTS = 429;
        
        // 5xx Server Error
        public static final int INTERNAL_SERVER_ERROR = 500;
        public static final int BAD_GATEWAY = 502;
        public static final int SERVICE_UNAVAILABLE = 503;
        public static final int GATEWAY_TIMEOUT = 504;
    }
    
    // Status code information
    public static class StatusInfo {
        private int code;
        private String message;
        private String category;
        private boolean isError;
        private boolean isRedirect;
        private boolean isSuccess;
        
        public StatusInfo(int code, String message, String category) {
            this.code = code;
            this.message = message;
            this.category = category;
            this.isSuccess = (code >= 200 && code < 300);
            this.isRedirect = (code >= 300 && code < 400);
            this.isError = (code >= 400);
        }
        
        // Getters
        public int getCode() { return code; }
        public String getMessage() { return message; }
        public String getCategory() { return category; }
        public boolean isError() { return isError; }
        public boolean isRedirect() { return isRedirect; }
        public boolean isSuccess() { return isSuccess; }
    }
    
    // Status code registry
    private static final Map<Integer, StatusInfo> STATUS_CODES = new HashMap<>();
    
    static {
        // Initialize status codes
        registerStatusCode(200, "OK", "Success");
        registerStatusCode(201, "Created", "Success");
        registerStatusCode(202, "Accepted", "Success");
        registerStatusCode(204, "No Content", "Success");
        registerStatusCode(206, "Partial Content", "Success");
        
        registerStatusCode(301, "Moved Permanently", "Redirection");
        registerStatusCode(302, "Found", "Redirection");
        registerStatusCode(304, "Not Modified", "Redirection");
        registerStatusCode(307, "Temporary Redirect", "Redirection");
        registerStatusCode(308, "Permanent Redirect", "Redirection");
        
        registerStatusCode(400, "Bad Request", "Client Error");
        registerStatusCode(401, "Unauthorized", "Client Error");
        registerStatusCode(403, "Forbidden", "Client Error");
        registerStatusCode(404, "Not Found", "Client Error");
        registerStatusCode(405, "Method Not Allowed", "Client Error");
        registerStatusCode(409, "Conflict", "Client Error");
        registerStatusCode(412, "Precondition Failed", "Client Error");
        registerStatusCode(413, "Payload Too Large", "Client Error");
        registerStatusCode(422, "Unprocessable Entity", "Client Error");
        registerStatusCode(429, "Too Many Requests", "Client Error");
        
        registerStatusCode(500, "Internal Server Error", "Server Error");
        registerStatusCode(502, "Bad Gateway", "Server Error");
        registerStatusCode(503, "Service Unavailable", "Server Error");
        registerStatusCode(504, "Gateway Timeout", "Server Error");
    }
    
    private static void registerStatusCode(int code, String message, String category) {
        STATUS_CODES.put(code, new StatusInfo(code, message, category));
    }
    
    // Get status information
    public static StatusInfo getStatusInfo(int code) {
        return STATUS_CODES.getOrDefault(code, 
            new StatusInfo(code, "Unknown Status", "Unknown"));
    }
    
    // Check status code categories
    public static boolean isSuccess(int code) {
        return code >= 200 && code < 300;
    }
    
    public static boolean isRedirection(int code) {
        return code >= 300 && code < 400;
    }
    
    public static boolean isClientError(int code) {
        return code >= 400 && code < 500;
    }
    
    public static boolean isServerError(int code) {
        return code >= 500 && code < 600;
    }
    
    public static boolean isError(int code) {
        return code >= 400;
    }
    
    // HTTP Response class
    public static class HTTPResponse {
        private int statusCode;
        private String body;
        private Map<String, String> headers;
        
        public HTTPResponse(int statusCode, String body) {
            this.statusCode = statusCode;
            this.body = body;
            this.headers = new HashMap<>();
        }
        
        public HTTPResponse addHeader(String name, String value) {
            headers.put(name, value);
            return this;
        }
        
        public void displayResponse() {
            StatusInfo info = getStatusInfo(statusCode);
            
            System.out.println("HTTP/1.1 " + statusCode + " " + info.getMessage());
            
            // Display headers
            for (Map.Entry<String, String> header : headers.entrySet()) {
                System.out.println(header.getKey() + ": " + header.getValue());
            }
            
            System.out.println(); // Empty line
            
            // Display body
            if (body != null && !body.isEmpty()) {
                System.out.println(body);
            }
            
            System.out.println("\\n--- Response Analysis ---");
            System.out.println("Category: " + info.getCategory());
            System.out.println("Is Success: " + info.isSuccess());
            System.out.println("Is Error: " + info.isError());
            System.out.println("Is Redirect: " + info.isRedirect());
        }
    }
    
    // Error response builder
    public static HTTPResponse buildErrorResponse(int statusCode, String errorMessage, 
                                                String errorCode, String requestId) {
        String errorBody = String.format(
            "{\\"error\\": {\\"code\\": \\"%s\\", \\"message\\": \\"%s\\", \\"request_id\\": \\"%s\\"}}",
            errorCode, errorMessage, requestId
        );
        
        return new HTTPResponse(statusCode, errorBody)
            .addHeader("Content-Type", "application/json")
            .addHeader("X-Request-ID", requestId);
    }
    
    // Success response builder
    public static HTTPResponse buildSuccessResponse(int statusCode, String data) {
        HTTPResponse response = new HTTPResponse(statusCode, data)
            .addHeader("Content-Type", "application/json");
        
        if (statusCode == StatusCode.CREATED) {
            response.addHeader("Location", "/api/resource/123");
        }
        
        return response;
    }
    
    // Redirect response builder
    public static HTTPResponse buildRedirectResponse(int statusCode, String location) {
        return new HTTPResponse(statusCode, "")
            .addHeader("Location", location);
    }
    
    // Demonstrate different status codes
    public static void demonstrateStatusCodes() {
        System.out.println("=== HTTP Status Code Demonstrations ===\\n");
        
        // Success responses
        System.out.println("1. Success Response (200 OK):");
        HTTPResponse success = buildSuccessResponse(StatusCode.OK, 
            "{\\"id\\": 123, \\"name\\": \\"John Doe\\"}");
        success.displayResponse();
        
        System.out.println("\\n2. Created Response (201 Created):");
        HTTPResponse created = buildSuccessResponse(StatusCode.CREATED,
            "{\\"id\\": 124, \\"name\\": \\"Jane Smith\\", \\"created\\": \\"2024-01-15T10:30:00Z\\"}");
        created.displayResponse();
        
        System.out.println("\\n3. No Content Response (204 No Content):");
        HTTPResponse noContent = new HTTPResponse(StatusCode.NO_CONTENT, "");
        noContent.displayResponse();
        
        // Redirection responses
        System.out.println("\\n4. Permanent Redirect (301 Moved Permanently):");
        HTTPResponse redirect = buildRedirectResponse(StatusCode.MOVED_PERMANENTLY, 
            "https://api.example.com/v2/users");
        redirect.displayResponse();
        
        // Client error responses
        System.out.println("\\n5. Bad Request (400 Bad Request):");
        HTTPResponse badRequest = buildErrorResponse(StatusCode.BAD_REQUEST,
            "Invalid JSON format", "INVALID_JSON", "req-123");
        badRequest.displayResponse();
        
        System.out.println("\\n6. Not Found (404 Not Found):");
        HTTPResponse notFound = buildErrorResponse(StatusCode.NOT_FOUND,
            "User not found", "USER_NOT_FOUND", "req-124");
        notFound.displayResponse();
        
        System.out.println("\\n7. Conflict (409 Conflict):");
        HTTPResponse conflict = buildErrorResponse(StatusCode.CONFLICT,
            "Email already exists", "EMAIL_EXISTS", "req-125");
        conflict.displayResponse();
        
        // Server error responses
        System.out.println("\\n8. Internal Server Error (500 Internal Server Error):");
        HTTPResponse serverError = buildErrorResponse(StatusCode.INTERNAL_SERVER_ERROR,
            "An unexpected error occurred", "INTERNAL_ERROR", "req-126");
        serverError.displayResponse();
    }
    
    public static void main(String[] args) {
        demonstrateStatusCodes();
        
        // Status code analysis
        System.out.println("\\n=== Status Code Analysis ===");
        
        int[] testCodes = {200, 201, 301, 400, 404, 500};
        
        for (int code : testCodes) {
            StatusInfo info = getStatusInfo(code);
            System.out.printf("%d %s - Category: %s, Success: %b, Error: %b%n",
                code, info.getMessage(), info.getCategory(), 
                info.isSuccess(), info.isError());
        }
    }
}`
    },
    
    {
      title: "Status Code Middleware",
      language: "python",
      code: `from flask import Flask, request, jsonify, make_response
from datetime import datetime
import uuid
import time

app = Flask(__name__)

class StatusCodeMiddleware:
    def __init__(self, app):
        self.app = app
        self.setup_error_handlers()
    
    def setup_error_handlers(self):
        """Setup global error handlers for different status codes"""
        
        @self.app.errorhandler(400)
        def bad_request(error):
            return self.create_error_response(
                400, "BAD_REQUEST", "Invalid request format or parameters"
            )
        
        @self.app.errorhandler(401)
        def unauthorized(error):
            return self.create_error_response(
                401, "UNAUTHORIZED", "Authentication required"
            )
        
        @self.app.errorhandler(403)
        def forbidden(error):
            return self.create_error_response(
                403, "FORBIDDEN", "Access denied"
            )
        
        @self.app.errorhandler(404)
        def not_found(error):
            return self.create_error_response(
                404, "NOT_FOUND", "Resource not found"
            )
        
        @self.app.errorhandler(405)
        def method_not_allowed(error):
            return self.create_error_response(
                405, "METHOD_NOT_ALLOWED", "HTTP method not allowed for this resource"
            )
        
        @self.app.errorhandler(409)
        def conflict(error):
            return self.create_error_response(
                409, "CONFLICT", "Request conflicts with current resource state"
            )
        
        @self.app.errorhandler(422)
        def unprocessable_entity(error):
            return self.create_error_response(
                422, "UNPROCESSABLE_ENTITY", "Request validation failed"
            )
        
        @self.app.errorhandler(429)
        def too_many_requests(error):
            response = self.create_error_response(
                429, "RATE_LIMIT_EXCEEDED", "Too many requests"
            )
            response.headers['Retry-After'] = '60'
            return response
        
        @self.app.errorhandler(500)
        def internal_server_error(error):
            return self.create_error_response(
                500, "INTERNAL_ERROR", "An unexpected error occurred"
            )
        
        @self.app.errorhandler(502)
        def bad_gateway(error):
            return self.create_error_response(
                502, "BAD_GATEWAY", "Invalid response from upstream server"
            )
        
        @self.app.errorhandler(503)
        def service_unavailable(error):
            response = self.create_error_response(
                503, "SERVICE_UNAVAILABLE", "Service temporarily unavailable"
            )
            response.headers['Retry-After'] = '300'
            return response
    
    def create_error_response(self, status_code, error_code, message, details=None):
        """Create standardized error response"""
        
        request_id = getattr(request, 'request_id', str(uuid.uuid4()))
        
        error_data = {
            "error": {
                "code": error_code,
                "message": message,
                "request_id": request_id
            },
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "path": request.path
        }
        
        if details:
            error_data["error"]["details"] = details
        
        response = make_response(jsonify(error_data), status_code)
        response.headers['Content-Type'] = 'application/json'
        response.headers['X-Request-ID'] = request_id
        
        return response

# Initialize middleware
middleware = StatusCodeMiddleware(app)

# Sample data
users = {
    1: {"id": 1, "name": "John Doe", "email": "john@example.com"},
    2: {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}
}
next_id = 3

# Rate limiting (simple in-memory implementation)
request_counts = {}
RATE_LIMIT = 10  # requests per minute

def check_rate_limit():
    """Simple rate limiting check"""
    client_ip = request.remote_addr
    current_time = int(time.time() / 60)  # Current minute
    
    if client_ip not in request_counts:
        request_counts[client_ip] = {}
    
    if current_time not in request_counts[client_ip]:
        request_counts[client_ip][current_time] = 0
    
    request_counts[client_ip][current_time] += 1
    
    if request_counts[client_ip][current_time] > RATE_LIMIT:
        return False
    
    return True

@app.before_request
def before_request():
    """Add request ID and check rate limits"""
    request.request_id = str(uuid.uuid4())
    
    if not check_rate_limit():
        return middleware.create_error_response(
            429, "RATE_LIMIT_EXCEEDED", 
            f"Rate limit of {RATE_LIMIT} requests per minute exceeded"
        )

# API Endpoints demonstrating different status codes

@app.route('/api/users', methods=['GET'])
def get_users():
    """200 OK - Success with data"""
    return jsonify(list(users.values())), 200

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """200 OK or 404 Not Found"""
    user = users.get(user_id)
    if not user:
        return middleware.create_error_response(
            404, "USER_NOT_FOUND", f"User with ID {user_id} not found"
        )
    
    # Add ETag for caching
    response = make_response(jsonify(user))
    response.headers['ETag'] = f'"{user_id}-{hash(str(user))}"'
    response.headers['Cache-Control'] = 'public, max-age=300'
    
    return response

@app.route('/api/users', methods=['POST'])
def create_user():
    """201 Created, 400 Bad Request, or 409 Conflict"""
    global next_id
    
    data = request.get_json()
    if not data:
        return middleware.create_error_response(
            400, "INVALID_JSON", "Request body must contain valid JSON"
        )
    
    # Validation
    errors = []
    if not data.get('name'):
        errors.append({"field": "name", "message": "Name is required"})
    if not data.get('email'):
        errors.append({"field": "email", "message": "Email is required"})
    elif '@' not in data['email']:
        errors.append({"field": "email", "message": "Invalid email format"})
    
    if errors:
        return middleware.create_error_response(
            422, "VALIDATION_ERROR", "Request validation failed", errors
        )
    
    # Check for duplicate email
    for user in users.values():
        if user['email'] == data['email']:
            return middleware.create_error_response(
                409, "EMAIL_EXISTS", "User with this email already exists"
            )
    
    # Create user
    new_user = {
        "id": next_id,
        "name": data['name'],
        "email": data['email'],
        "created": datetime.utcnow().isoformat() + "Z"
    }
    
    users[next_id] = new_user
    user_id = next_id
    next_id += 1
    
    # 201 Created with Location header
    response = make_response(jsonify(new_user), 201)
    response.headers['Location'] = f'/api/users/{user_id}'
    
    return response

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """200 OK, 404 Not Found, or 412 Precondition Failed"""
    if user_id not in users:
        return middleware.create_error_response(
            404, "USER_NOT_FOUND", f"User with ID {user_id} not found"
        )
    
    # Check If-Match header for optimistic locking
    if_match = request.headers.get('If-Match')
    if if_match:
        current_etag = f'"{user_id}-{hash(str(users[user_id]))}"'
        if if_match != current_etag:
            return middleware.create_error_response(
                412, "PRECONDITION_FAILED", 
                "Resource has been modified by another client"
            )
    
    data = request.get_json()
    if not data:
        return middleware.create_error_response(
            400, "INVALID_JSON", "Request body must contain valid JSON"
        )
    
    # Update user
    users[user_id].update(data)
    users[user_id]['updated'] = datetime.utcnow().isoformat() + "Z"
    
    return jsonify(users[user_id]), 200

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """204 No Content or 404 Not Found"""
    if user_id not in users:
        return middleware.create_error_response(
            404, "USER_NOT_FOUND", f"User with ID {user_id} not found"
        )
    
    del users[user_id]
    return '', 204

@app.route('/api/users/<int:user_id>/avatar', methods=['POST'])
def upload_avatar(user_id):
    """413 Payload Too Large demonstration"""
    if user_id not in users:
        return middleware.create_error_response(
            404, "USER_NOT_FOUND", f"User with ID {user_id} not found"
        )
    
    # Check content length (simulate 1MB limit)
    content_length = request.content_length
    if content_length and content_length > 1024 * 1024:  # 1MB
        return middleware.create_error_response(
            413, "PAYLOAD_TOO_LARGE", 
            "File size exceeds maximum limit of 1MB"
        )
    
    return jsonify({"message": "Avatar uploaded successfully"}), 200

@app.route('/api/admin/users', methods=['GET'])
def admin_get_users():
    """403 Forbidden demonstration"""
    # Simulate admin check
    auth_header = request.headers.get('Authorization')
    if not auth_header or 'admin' not in auth_header:
        return middleware.create_error_response(
            403, "INSUFFICIENT_PRIVILEGES", 
            "Admin access required for this resource"
        )
    
    return jsonify(list(users.values())), 200

@app.route('/api/redirect-example')
def redirect_example():
    """301 Moved Permanently demonstration"""
    response = make_response('', 301)
    response.headers['Location'] = '/api/users'
    return response

@app.route('/api/not-modified-example/<int:user_id>')
def not_modified_example(user_id):
    """304 Not Modified demonstration"""
    user = users.get(user_id)
    if not user:
        return middleware.create_error_response(
            404, "USER_NOT_FOUND", f"User with ID {user_id} not found"
        )
    
    # Check If-None-Match header
    if_none_match = request.headers.get('If-None-Match')
    current_etag = f'"{user_id}-{hash(str(user))}"'
    
    if if_none_match == current_etag:
        return '', 304
    
    response = make_response(jsonify(user))
    response.headers['ETag'] = current_etag
    return response

@app.route('/api/simulate-error')
def simulate_error():
    """500 Internal Server Error demonstration"""
    # Simulate an unexpected error
    raise Exception("Simulated server error")

if __name__ == '__main__':
    print("Status Code Demo Server Starting...")
    print("Available endpoints:")
    print("GET    /api/users              - List users (200)")
    print("POST   /api/users              - Create user (201/400/409/422)")
    print("GET    /api/users/<id>         - Get user (200/404)")
    print("PUT    /api/users/<id>         - Update user (200/404/412)")
    print("DELETE /api/users/<id>         - Delete user (204/404)")
    print("POST   /api/users/<id>/avatar  - Upload avatar (200/413)")
    print("GET    /api/admin/users        - Admin only (200/403)")
    print("GET    /api/redirect-example   - Redirect demo (301)")
    print("GET    /api/not-modified-example/<id> - Cache demo (200/304)")
    print("GET    /api/simulate-error     - Error demo (500)")
    
    app.run(debug=True, port=5001)`
    }
  ],

  resources: [
    { type: 'video', title: 'HTTP Status Codes Explained', url: 'https://www.youtube.com/results?search_query=http+status+codes+explained', description: 'Video tutorials on HTTP status codes' },
    { type: 'article', title: 'HTTP Status Code Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status', description: 'Complete MDN reference for HTTP status codes' },
    { type: 'tool', title: 'HTTP Status Code Checker', url: 'https://httpstatus.io/', description: 'Tool to check HTTP status codes for any URL' },
    { type: 'article', title: 'REST API Status Code Guide', url: 'https://restfulapi.net/http-status-codes/', description: 'Best practices for status codes in REST APIs' },
    { type: 'documentation', title: 'HTTP Status Code Registry', url: 'https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml', description: 'Official IANA HTTP status code registry' }
  ],

  questions: [
    {
      question: "What's the difference between 401 Unauthorized and 403 Forbidden?",
      answer: "401 Unauthorized means authentication is required or has failed - the client needs to provide valid credentials. 403 Forbidden means the client is authenticated but lacks permission to access the resource - credentials won't help. Example: 401 for missing/invalid JWT token, 403 for regular user trying to access admin endpoint. 401 suggests 'log in', 403 suggests 'you don't have permission'."
    },
    
    {
      question: "When should you use 422 Unprocessable Entity vs 400 Bad Request?",
      answer: "400 Bad Request for syntax errors, malformed requests, or invalid HTTP structure (malformed JSON, missing required headers). 422 Unprocessable Entity for semantic validation errors where syntax is correct but business rules fail (valid JSON but invalid email format, missing required fields). Example: 400 for broken JSON syntax, 422 for email field containing 'invalid-email-format'."
    },
    
    {
      question: "What's the difference between 301 and 302 redirects?",
      answer: "301 Moved Permanently indicates the resource has permanently moved - search engines transfer SEO value to new URL, browsers may cache redirect. 302 Found (temporary redirect) indicates temporary move - search engines keep original URL indexed, no caching. Use 301 for permanent URL changes, domain moves, or canonical URLs. Use 302 for temporary maintenance pages, A/B testing, or conditional redirects."
    },
    
    {
      question: "How do you handle 5xx server errors properly?",
      answer: "5xx error handling: 1) Log detailed error information server-side, 2) Return generic error message to client (don't expose internals), 3) Include request ID for tracking, 4) Use appropriate specific codes (502 for upstream failures, 503 for overload, 504 for timeouts), 5) Add Retry-After header for 503, 6) Implement circuit breakers and graceful degradation, 7) Monitor error rates and alert on spikes, 8) Provide status pages for service availability."
    },
    
    {
      question: "What is the purpose of 304 Not Modified and how is it used?",
      answer: "304 Not Modified indicates the resource hasn't changed since the client's cached version, allowing efficient cache validation. Used with conditional requests: client sends If-None-Match (ETag) or If-Modified-Since headers, server compares with current resource state. If unchanged, returns 304 with no body - client uses cached version. Benefits: reduces bandwidth, improves performance, enables efficient caching. Essential for web performance optimization and CDN efficiency."
    },
    
    {
      question: "How do you implement proper error responses for REST APIs?",
      answer: "REST API error responses should: 1) Use appropriate HTTP status codes, 2) Include structured error format with code, message, details, 3) Add request ID for tracking, 4) Provide timestamp and path, 5) Include validation details for 422 errors, 6) Don't expose internal system details in production, 7) Use consistent error format across API, 8) Add correlation IDs for distributed systems, 9) Include helpful error codes for client handling, 10) Document all possible error responses."
    },
    
    {
      question: "What's the difference between 204 No Content and 200 OK for successful operations?",
      answer: "204 No Content indicates successful operation with no response body needed - typically used for DELETE operations or updates where no data needs to be returned. 200 OK indicates success with response body containing data. Use 204 for: DELETE operations, PUT updates without returning updated resource, successful actions without data response. Use 200 for: GET requests, POST/PUT operations returning created/updated resource, operations with meaningful response data."
    },
    
    {
      question: "How do you handle rate limiting with HTTP status codes?",
      answer: "Rate limiting uses 429 Too Many Requests status code with additional headers: 1) Retry-After header indicating when to retry, 2) X-RateLimit-Limit for total allowed requests, 3) X-RateLimit-Remaining for remaining requests, 4) X-RateLimit-Reset for reset timestamp. Implementation: track requests per client/IP, return 429 when limit exceeded, include informative error message with limit details, implement exponential backoff, consider different limits for different endpoints/users."
    },
    
    {
      question: "What are some lesser-known but useful HTTP status codes?",
      answer: "Useful lesser-known codes: 1) 410 Gone - resource permanently deleted (vs 404 never existed), 2) 412 Precondition Failed - conditional request failed (ETag mismatch), 3) 413 Payload Too Large - request body exceeds limits, 4) 415 Unsupported Media Type - Content-Type not accepted, 5) 423 Locked - resource is locked, 6) 426 Upgrade Required - client must upgrade protocol, 7) 451 Unavailable For Legal Reasons - censorship/legal blocks, 8) 206 Partial Content - range requests for large files."
    },
    
    {
      question: "How do you implement conditional requests using status codes?",
      answer: "Conditional requests use headers with specific status codes: 1) If-Match with ETag - 412 if resource changed, 200 if unchanged, 2) If-None-Match - 304 if resource unchanged, 200 if changed, 3) If-Modified-Since - 304 if not modified, 200 if modified, 4) If-Unmodified-Since - 412 if modified, 200 if not modified. Benefits: optimistic locking, efficient caching, bandwidth reduction. Implementation: generate ETags for resources, compare with request headers, return appropriate status codes."
    }
  ]
};