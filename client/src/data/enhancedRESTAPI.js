export const enhancedRESTAPI = {
  id: 'rest-api-principles',
  title: 'REST API Principles',
  subtitle: 'Representational State Transfer Architecture',
  summary: 'REST is an architectural style for designing networked applications using stateless communication, resource-based URLs, standard HTTP methods, and uniform interfaces.',
  analogy: 'Like a well-organized library: resources (books) have unique addresses (URLs), standard operations (check out, return), and consistent rules for interaction.',
  visualConcept: 'Picture REST as a standardized way to interact with web resources using HTTP methods, where each resource has a unique URL and follows predictable patterns.',
  realWorldUse: 'Web APIs, microservices, mobile app backends, third-party integrations, and any system requiring standardized web service communication.',
  explanation: `REST API Theory and Architecture:

Historical Context and Foundation:
REST (Representational State Transfer) was introduced by Roy Fielding in his 2000 doctoral dissertation as an architectural style for distributed hypermedia systems. It emerged from the need to formalize the architectural principles that made the World Wide Web successful and scalable. REST is not a protocol or standard but an architectural style that defines constraints for creating web services.

The Six Architectural Constraints:

1. Client-Server Architecture: Separation of concerns between user interface (client) and data storage (server). This constraint enables independent evolution of client and server components, improves portability across platforms, and allows scaling of server components.

2. Stateless Communication: Each request from client to server must contain all information necessary to understand the request. The server cannot store client context between requests. Benefits include improved scalability, reliability, and visibility of interactions.

3. Cacheable: Responses must be implicitly or explicitly labeled as cacheable or non-cacheable. Caching can eliminate some client-server interactions, improving efficiency, scalability, and user-perceived performance.

4. Uniform Interface: The central feature that distinguishes REST from other network-based architectural styles. It consists of four interface constraints:
   - Resource Identification: Resources are identified by URIs
   - Resource Manipulation through Representations: Resources are manipulated through representations (JSON, XML)
   - Self-descriptive Messages: Each message includes enough information to describe how to process the message
   - Hypermedia as the Engine of Application State (HATEOAS): Client interactions are driven by hypermedia

5. Layered System: Architecture may be composed of hierarchical layers by constraining component behavior. Layers can be used to encapsulate legacy services, improve scalability through load balancing, and enforce security policies.

6. Code-on-Demand (Optional): Servers can temporarily extend or customize client functionality by transferring executable code (JavaScript, applets).

Resource-Centric Design Philosophy:
REST treats everything as a resource - any information that can be named can be a resource. Resources are identified by URIs and can have multiple representations (JSON, XML, HTML). The key insight is focusing on nouns (resources) rather than verbs (actions), creating intuitive and predictable APIs.

HTTP Method Semantics and Safety/Idempotency:
- Safe Methods: GET, HEAD, OPTIONS - do not modify server state
- Idempotent Methods: GET, PUT, DELETE, HEAD, OPTIONS - multiple identical requests have the same effect
- Non-idempotent Methods: POST, PATCH - multiple requests may have different effects

Richardson Maturity Model:
Leonard Richardson's model defines four levels of REST maturity:
- Level 0: The Swamp of POX (Plain Old XML) - Single URI, single HTTP method
- Level 1: Resources - Multiple URIs, single HTTP method
- Level 2: HTTP Verbs - Multiple URIs, multiple HTTP methods
- Level 3: Hypermedia Controls - HATEOAS implementation

Theoretical Benefits:
- Scalability: Stateless nature and caching support horizontal scaling
- Simplicity: Uniform interface reduces complexity
- Modifiability: Layered system and client-server separation enable independent evolution
- Visibility: Stateless communication improves monitoring and debugging
- Portability: Platform independence through standard protocols
- Reliability: Stateless nature improves fault tolerance

REST vs Other Architectural Styles:
- RPC (Remote Procedure Call): REST focuses on resources, RPC on actions
- SOAP: REST is simpler, uses standard HTTP, while SOAP has complex protocols
- GraphQL: REST has multiple endpoints, GraphQL has single endpoint with flexible queries

Constraints Trade-offs:
While REST constraints provide benefits, they also impose limitations:
- Stateless constraint may decrease network performance due to repetitive data
- Uniform interface may degrade efficiency since information is transferred in standardized form
- Layered system may add overhead and latency

Modern REST Considerations:
- API Versioning: Strategies for evolving APIs while maintaining backward compatibility
- Security: Authentication, authorization, and data protection in stateless environment
- Performance: Caching strategies, pagination, and efficient data transfer
- Documentation: OpenAPI specifications and interactive documentation
- Testing: Comprehensive testing strategies for distributed systems`,

  keyPoints: [
    'Stateless communication - no client context stored on server',
    'Resource-based URLs identify entities uniquely (/users/123)',
    'HTTP methods used semantically (GET, POST, PUT, DELETE)',
    'Uniform interface provides consistent interaction patterns',
    'Multiple representations support different clients (JSON, XML)',
    'Hierarchical URL structure reflects resource relationships',
    'Proper HTTP status codes indicate operation results clearly',
    'Caching improves performance and reduces server load',
    'Self-descriptive messages include all necessary information',
    'HATEOAS provides API navigation through hypermedia links',
    'Idempotent operations ensure safe retry mechanisms',
    'Content negotiation allows flexible response formats',
    'Layered architecture supports proxies and gateways',
    'Versioning strategies maintain backward compatibility',
    'Security through HTTPS, authentication, and authorization',
    'Rate limiting prevents abuse and ensures fair usage',
    'Pagination handles large datasets efficiently',
    'Error handling provides meaningful feedback to clients',
    'Documentation enables easy API adoption and integration',
    'Testing ensures reliability and correctness of endpoints'
  ],

  codeExamples: [
    {
      title: "Advanced REST API with Security",
      language: "javascript",
      code: `const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests' }
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      error: { code: 'NO_TOKEN', message: 'Access token required' }
    });
  }
  req.user = { id: 1, role: 'admin' };
  next();
};

// Validation middleware
const validateUser = (req, res, next) => {
  const { name, email } = req.body;
  const errors = {};
  
  if (!name || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Valid email is required';
  }
  
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', details: errors }
    });
  }
  next();
};

let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
];
let nextId = 3;

// Advanced filtering and HATEOAS
app.get('/api/users', (req, res) => {
  const { page = 1, limit = 10, sort = 'id', order = 'asc', search, role } = req.query;
  
  let result = [...users];
  
  if (search) {
    result = result.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (role) {
    result = result.filter(user => user.role === role);
  }
  
  // Sorting
  result.sort((a, b) => {
    const comparison = a[sort] < b[sort] ? -1 : a[sort] > b[sort] ? 1 : 0;
    return order === 'desc' ? -comparison : comparison;
  });
  
  // Pagination
  const total = result.length;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;
  const paginatedResult = result.slice(offset, offset + limitNum);
  
  // HATEOAS links
  const baseUrl = req.protocol + '://' + req.get('host');
  const links = {
    self: baseUrl + req.originalUrl,
    first: baseUrl + '/api/users?page=1&limit=' + limitNum,
    last: baseUrl + '/api/users?page=' + Math.ceil(total / limitNum) + '&limit=' + limitNum
  };
  
  res.set({
    'X-Total-Count': total,
    'Cache-Control': 'public, max-age=300'
  });
  
  res.json({
    data: paginatedResult.map(user => ({
      ...user,
      _links: {
        self: baseUrl + '/api/users/' + user.id,
        edit: baseUrl + '/api/users/' + user.id,
        delete: baseUrl + '/api/users/' + user.id
      }
    })),
    meta: { total, page: pageNum, limit: limitNum },
    links
  });
});

// Bulk operations
app.post('/api/users/bulk', authenticate, (req, res) => {
  const { users: newUsers } = req.body;
  
  if (!Array.isArray(newUsers)) {
    return res.status(400).json({
      error: { code: 'INVALID_BULK_DATA', message: 'Users array required' }
    });
  }
  
  const created = [];
  const errors = [];
  
  newUsers.forEach((userData, index) => {
    const { name, email, role = 'user' } = userData;
    
    if (!name || !email) {
      errors.push({ index, message: 'Name and email required' });
      return;
    }
    
    const newUser = {
      id: nextId++,
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    created.push(newUser);
  });
  
  res.status(created.length > 0 ? 201 : 400).json({
    data: { created, errors },
    meta: { totalProcessed: newUsers.length, successful: created.length }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(3000);`
    },
    {
      title: "Richardson Maturity Model Implementation",
      language: "javascript",
      code: `// Richardson Maturity Model - REST API Evolution

// Level 0: The Swamp of POX (Plain Old XML)
// Single URI, single HTTP method, all operations via POST
app.post('/api', (req, res) => {
  const { action, data } = req.body;
  
  switch(action) {
    case 'getUser':
      return res.json({ user: users.find(u => u.id === data.id) });
    case 'createUser':
      const newUser = { id: nextId++, ...data };
      users.push(newUser);
      return res.json({ user: newUser });
    case 'updateUser':
      // Update logic
      break;
    default:
      return res.status(400).json({ error: 'Unknown action' });
  }
});

// Level 1: Resources
// Multiple URIs, but still using single HTTP method (usually POST)
app.post('/api/users', (req, res) => {
  // All user operations
});

app.post('/api/users/:id', (req, res) => {
  // Single user operations
});

app.post('/api/orders', (req, res) => {
  // All order operations
});

// Level 2: HTTP Verbs
// Multiple URIs + Multiple HTTP methods
app.get('/api/users', (req, res) => {
  res.json({ users });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

app.post('/api/users', (req, res) => {
  const newUser = { id: nextId++, ...req.body };
  users.push(newUser);
  res.status(201).json({ user: newUser });
});

app.put('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
  
  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json({ user: users[userIndex] });
});

app.delete('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
  
  users.splice(userIndex, 1);
  res.status(204).send();
});

// Level 3: Hypermedia Controls (HATEOAS)
// Multiple URIs + Multiple HTTP methods + Hypermedia
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const baseUrl = req.protocol + '://' + req.get('host');
  
  res.json({
    data: user,
    _links: {
      self: { href: baseUrl + '/api/users/' + user.id },
      edit: { href: baseUrl + '/api/users/' + user.id, method: 'PUT' },
      delete: { href: baseUrl + '/api/users/' + user.id, method: 'DELETE' },
      orders: { href: baseUrl + '/api/users/' + user.id + '/orders' },
      collection: { href: baseUrl + '/api/users' }
    },
    _actions: {
      update: {
        href: baseUrl + '/api/users/' + user.id,
        method: 'PUT',
        fields: [
          { name: 'name', type: 'string', required: true },
          { name: 'email', type: 'email', required: true },
          { name: 'role', type: 'string', enum: ['user', 'admin'] }
        ]
      }
    }
  });
});

// HATEOAS Collection Response
app.get('/api/users', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  
  res.json({
    data: users.map(user => ({
      ...user,
      _links: {
        self: { href: baseUrl + '/api/users/' + user.id },
        edit: { href: baseUrl + '/api/users/' + user.id, method: 'PUT' },
        delete: { href: baseUrl + '/api/users/' + user.id, method: 'DELETE' }
      }
    })),
    _links: {
      self: { href: baseUrl + '/api/users' },
      create: { href: baseUrl + '/api/users', method: 'POST' }
    },
    _actions: {
      create: {
        href: baseUrl + '/api/users',
        method: 'POST',
        fields: [
          { name: 'name', type: 'string', required: true },
          { name: 'email', type: 'email', required: true },
          { name: 'role', type: 'string', enum: ['user', 'admin'], default: 'user' }
        ]
      },
      search: {
        href: baseUrl + '/api/users{?search,role,page,limit}',
        method: 'GET',
        templated: true
      }
    }
  });
});`
    },
    {
      title: "REST Constraints Implementation",
      language: "javascript",
      code: `// Implementing REST Architectural Constraints

// 1. Client-Server Constraint
// Separation of concerns - client handles UI, server handles data
class APIServer {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }
  
  setupMiddleware() {
    // Server-side concerns only
    this.app.use(express.json());
    this.app.use(helmet()); // Security
    this.app.use(cors()); // Cross-origin support
  }
}

// 2. Stateless Constraint
// No client context stored on server
app.use((req, res, next) => {
  // Each request must contain all necessary information
  const token = req.headers.authorization;
  
  if (token) {
    try {
      // Decode token to get user info (no server-side session)
      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
      req.user = decoded; // User info from token, not server storage
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
  
  next();
});

// 3. Cacheable Constraint
// Responses labeled as cacheable or non-cacheable
app.get('/api/users', (req, res) => {
  // Cacheable response
  res.set({
    'Cache-Control': 'public, max-age=300', // 5 minutes
    'ETag': generateETag(users),
    'Last-Modified': new Date(Math.max(...users.map(u => new Date(u.updatedAt)))).toUTCString()
  });
  
  // Handle conditional requests
  if (req.headers['if-none-match'] === res.get('ETag')) {
    return res.status(304).send(); // Not Modified
  }
  
  res.json({ data: users });
});

app.post('/api/users', (req, res) => {
  // Non-cacheable response
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  const newUser = createUser(req.body);
  res.status(201).json({ data: newUser });
});

// 4. Uniform Interface Constraint
// Consistent interaction patterns

// 4a. Resource Identification
const resourceRoutes = {
  users: '/api/users',
  user: '/api/users/:id',
  userOrders: '/api/users/:id/orders',
  orders: '/api/orders',
  order: '/api/orders/:id'
};

// 4b. Resource Manipulation through Representations
app.get('/api/users/:id', (req, res) => {
  const user = findUser(req.params.id);
  
  // Support multiple representations
  const acceptHeader = req.headers.accept;
  
  if (acceptHeader.includes('application/xml')) {
    res.set('Content-Type', 'application/xml');
    res.send(convertToXML(user));
  } else {
    res.set('Content-Type', 'application/json');
    res.json({ data: user });
  }
});

// 4c. Self-descriptive Messages
app.use((req, res, next) => {
  // Add metadata to responses
  res.locals.metadata = {
    timestamp: new Date().toISOString(),
    version: '1.0',
    method: req.method,
    url: req.originalUrl
  };
  next();
});

// 4d. HATEOAS Implementation
function addHATEOASLinks(resource, type, baseUrl) {
  const links = {
    self: { href: baseUrl + '/' + type + '/' + resource.id }
  };
  
  // Add available actions based on resource state
  if (type === 'users') {
    links.edit = { href: baseUrl + '/users/' + resource.id, method: 'PUT' };
    links.delete = { href: baseUrl + '/users/' + resource.id, method: 'DELETE' };
    links.orders = { href: baseUrl + '/users/' + resource.id + '/orders' };
  }
  
  return { ...resource, _links: links };
}

// 5. Layered System Constraint
// Support for intermediary layers
app.use('/api', (req, res, next) => {
  // Add layer information
  res.set('X-API-Layer', 'application');
  res.set('X-Served-By', process.env.SERVER_ID || 'server-1');
  next();
});

// Proxy/Gateway layer example
const proxy = createProxyMiddleware({
  target: 'http://backend-service:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1': '/api'
  },
  onProxyReq: (proxyReq, req, res) => {
    // Add layer-specific headers
    proxyReq.setHeader('X-Gateway-Layer', 'true');
  }
});

// 6. Code-on-Demand Constraint (Optional)
// Server can send executable code to client
app.get('/api/client-extensions', (req, res) => {
  const clientCode = \`
    // Client-side validation extension
    function validateEmail(email) {
      return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
    }
    
    // Client-side formatting extension
    function formatUserName(user) {
      return user.firstName + ' ' + user.lastName;
    }
  \`;
  
  res.set('Content-Type', 'application/javascript');
  res.send(clientCode);
});

// Utility functions
function generateETag(data) {
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
}

function convertToXML(data) {
  // Simple XML conversion
  return \`<?xml version="1.0"?>\n<user>\n  <id>\${data.id}</id>\n  <name>\${data.name}</name>\n</user>\`;
}`
    }
  ],

  resources: [
    { type: 'video', title: 'REST API Tutorial - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/rest-api-introduction/', description: 'Complete REST API tutorial with examples' },
    { type: 'video', title: 'REST API Explained - YouTube', url: 'https://www.youtube.com/watch?v=lsMQRaeKNDk', description: 'Visual explanation of REST API concepts' },
    { type: 'article', title: 'REST API Design Guide', url: 'https://restfulapi.net/', description: 'Comprehensive REST API design principles and best practices' },
    { type: 'article', title: 'GeeksforGeeks REST API', url: 'https://www.geeksforgeeks.org/rest-api-architectural-constraints/', description: 'REST architectural constraints explained' },
    { type: 'video', title: 'REST vs SOAP - YouTube', url: 'https://www.youtube.com/watch?v=bPNfu0IZhoE', description: 'Comparison between REST and SOAP' },
    { type: 'tool', title: 'Postman', url: 'https://www.postman.com/', description: 'API development, testing, and documentation platform' },
    { type: 'article', title: 'HTTP Status Codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status', description: 'Complete HTTP status code reference with examples' },
    { type: 'article', title: 'Richardson Maturity Model', url: 'https://martinfowler.com/articles/richardsonMaturityModel.html', description: 'REST API maturity levels and evolution' },
    { type: 'video', title: 'API Design Best Practices', url: 'https://www.youtube.com/watch?v=_gQaygjm_hg', description: 'Best practices for designing REST APIs' },
    { type: 'article', title: 'Roy Fielding Dissertation', url: 'https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm', description: 'Original REST architectural style definition' }
  ],

  questions: [
    {
      question: "What are the six architectural constraints of REST?",
      answer: "REST's six constraints: 1) Client-Server - separation of concerns, 2) Stateless - no client context on server, 3) Cacheable - responses must be cacheable or non-cacheable, 4) Uniform Interface - consistent interaction patterns, 5) Layered System - hierarchical layers allowed, 6) Code-on-Demand (optional) - server can send executable code. These constraints ensure scalability, simplicity, and reliability."
    },
    {
      question: "Explain the difference between REST and SOAP.",
      answer: "REST vs SOAP: REST is architectural style using HTTP methods, lightweight, supports multiple formats (JSON, XML), stateless, cacheable. SOAP is protocol with strict standards, XML-only, built-in security (WS-Security), supports transactions, heavier overhead. REST better for web APIs, mobile apps, microservices. SOAP better for enterprise applications requiring strict contracts and security."
    },
    {
      question: "How do you design RESTful URLs?",
      answer: "RESTful URL design: 1) Use nouns, not verbs (/users not /getUsers), 2) Plural nouns for collections (/users), 3) Hierarchical structure (/users/123/posts), 4) Use HTTP methods for actions, 5) Query parameters for filtering (?status=active), 6) Consistent naming (kebab-case), 7) Avoid deep nesting (max 2-3 levels). Example: GET /users/123/orders?status=pending"
    },
    {
      question: "What is HATEOAS and why is it important?",
      answer: "HATEOAS (Hypermedia as Engine of Application State) - Level 3 of Richardson Maturity Model. Responses include links to related actions/resources. Benefits: 1) Self-documenting API, 2) Loose coupling, 3) Dynamic navigation, 4) API evolution without breaking clients. Example: {id: 123, name: 'John', _links: {self: '/users/123', orders: '/users/123/orders', edit: '/users/123'}}."
    },
    {
      question: "Explain HTTP methods used in REST APIs.",
      answer: "REST HTTP methods: GET (retrieve, safe, idempotent), POST (create, not safe, not idempotent), PUT (replace entire resource, idempotent), PATCH (partial update, not necessarily idempotent), DELETE (remove, idempotent), HEAD (headers only), OPTIONS (allowed methods). Use semantically: GET for reading, POST for creation, PUT for full updates, PATCH for partial updates."
    },
    {
      question: "How do you handle versioning in REST APIs?",
      answer: "API versioning strategies: 1) URL versioning (/api/v1/users) - most common, clear, 2) Header versioning (Accept: application/vnd.api+json;version=1) - cleaner URLs, 3) Query parameter (?version=1) - simple but clutters URLs, 4) Content negotiation (Accept: application/json;v=1). Consider backward compatibility, deprecation timeline, documentation updates."
    },
    {
      question: "What are idempotent methods and why are they important?",
      answer: "Idempotent methods produce same result when called multiple times. Idempotent: GET, PUT, DELETE, HEAD, OPTIONS. Non-idempotent: POST, PATCH. Importance: 1) Safe retry logic, 2) Network reliability, 3) Caching strategies, 4) Load balancing. Example: DELETE /users/123 called twice has same effect (user deleted), POST /users creates new user each time."
    },
    {
      question: "How do you implement authentication in REST APIs?",
      answer: "REST authentication methods: 1) API Keys (simple, in headers), 2) Basic Auth (username:password in Authorization header), 3) Bearer tokens/JWT (stateless, scalable), 4) OAuth 2.0 (delegated authorization), 5) API signatures (HMAC). Best practices: use HTTPS, implement proper error responses (401/403), token expiration, refresh mechanisms."
    },
    {
      question: "Explain error handling best practices in REST APIs.",
      answer: "REST error handling: 1) Use appropriate HTTP status codes (4xx client errors, 5xx server errors), 2) Consistent error response format, 3) Detailed error messages with error codes, 4) Field-level validation errors, 5) Don't expose sensitive information, 6) Include error documentation. Example: {error: {code: 'VALIDATION_ERROR', message: 'Invalid input', details: {email: 'Invalid format'}}}."
    },
    {
      question: "How do you implement pagination in REST APIs?",
      answer: "Pagination strategies: 1) Offset-based (?limit=10&offset=20) - simple, good for static data, 2) Cursor-based (?limit=10&cursor=abc123) - better for real-time data, consistent results, 3) Page-based (?page=3&size=10) - user-friendly. Include metadata: total count, current page, has_next/previous. Headers: Link header for navigation URLs."
    }
  ]
};