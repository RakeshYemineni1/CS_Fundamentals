export const enhancedCookiesSessions = {
  id: 'cookies-vs-sessions',
  title: 'Cookies vs Sessions',
  subtitle: 'Web State Management and User Authentication',
  summary: 'Cookies store data on client-side for persistence across requests, while sessions store data server-side with client holding only session ID, each serving different purposes in web applications.',
  analogy: 'Like a restaurant: cookies are loyalty cards you carry (client stores info), sessions are table reservations where restaurant keeps your info and gives you a number (server stores data).',
  visualConcept: 'Picture cookies as small data packets traveling with each request, while sessions are server-side storage boxes accessed by unique keys sent from the client.',
  realWorldUse: 'User authentication, shopping carts, preferences, tracking, personalization, and maintaining state in stateless HTTP protocol across web applications.',
  explanation: `Cookies vs Sessions in Web Development:

Cookies are small pieces of data stored on the client-side (browser) and sent with every HTTP request to the server. They persist across browser sessions and can store user preferences, authentication tokens, and tracking information.

Sessions store data on the server-side with only a session ID (usually in a cookie) sent to the client. The server maintains session data in memory, database, or files, providing better security for sensitive information.

Both mechanisms solve HTTP's stateless nature but with different trade-offs: cookies offer persistence and reduce server load but have size limits and security concerns, while sessions provide better security and unlimited storage but require server resources and don't persist across server restarts without additional storage.`,

  keyPoints: [
    'Cookies store data client-side, sessions store server-side',
    'Cookies persist across browser sessions, sessions are temporary',
    'Cookies have 4KB size limit, sessions have no practical limit',
    'Sessions are more secure for sensitive data',
    'Cookies reduce server load, sessions increase server memory usage',
    'Session ID typically stored in cookies for identification',
    'Cookies can be disabled by users, affecting functionality',
    'Sessions require server-side storage and management',
    'Both solve HTTP stateless protocol limitations',
    'Security considerations differ significantly between approaches'
  ],

  codeExamples: [
    {
      title: "Cookie Management",
      language: "javascript",
      code: `// Cookie Management Functions

// Set cookie with options
function setCookie(name, value, options = {}) {
  const defaults = {
    path: '/',
    secure: true,
    sameSite: 'strict',
    maxAge: null
  };
  
  const config = { ...defaults, ...options };
  let cookieString = name + '=' + encodeURIComponent(value);
  
  if (config.path) cookieString += '; path=' + config.path;
  if (config.maxAge) cookieString += '; max-age=' + config.maxAge;
  if (config.secure) cookieString += '; secure';
  if (config.httpOnly) cookieString += '; httponly';
  if (config.sameSite) cookieString += '; samesite=' + config.sameSite;
  
  document.cookie = cookieString;
}

// Get cookie value
function getCookie(name) {
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

// Delete cookie
function deleteCookie(name, path = '/') {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=' + path;
}

// Examples
setCookie('theme', 'dark', { maxAge: 86400 }); // 1 day
setCookie('auth_token', 'abc123', { secure: true, httpOnly: true });

const theme = getCookie('theme');
console.log('Current theme:', theme);

deleteCookie('old_cookie');`
    },
    {
      title: "Session Management",
      language: "javascript",
      code: `// Express.js Session Management
const express = require('express');
const session = require('express-session');
const app = express();

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validate credentials
  if (username === 'admin' && password === 'password') {
    // Regenerate session ID for security
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session error' });
      }
      
      // Store user info in session
      req.session.userId = 1;
      req.session.username = username;
      req.session.loginTime = new Date();
      
      res.json({ success: true, message: 'Logged in successfully' });
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Protected route
app.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  res.json({
    message: 'Welcome to dashboard',
    user: {
      id: req.session.userId,
      username: req.session.username,
      loginTime: req.session.loginTime
    }
  });
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout error' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`
    }
  ],

  resources: [
    { type: 'video', title: 'Cookies vs Sessions Explained', url: 'https://www.youtube.com/results?search_query=cookies+vs+sessions+web+development', description: 'Video explanations of cookies and sessions' },
    { type: 'article', title: 'HTTP Cookies Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies', description: 'MDN comprehensive guide to HTTP cookies' },
    { type: 'article', title: 'Session Management Best Practices', url: 'https://owasp.org/www-project-cheat-sheets/cheatsheets/Session_Management_Cheat_Sheet.html', description: 'OWASP session security guidelines' },
    { type: 'tool', title: 'Cookie Inspector', url: 'https://chrome.google.com/webstore/detail/cookie-inspector/jgbbilmfbammlbbhmmgaagdkbkepnijn', description: 'Browser extension for cookie analysis' },
    { type: 'article', title: 'JWT vs Sessions', url: 'https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/', description: 'Comparison of JWT and session-based authentication' },
    { type: 'article', title: 'Express Session', url: 'https://github.com/expressjs/session', description: 'Express.js session middleware documentation' }
  ],

  questions: [
    {
      question: "What are the main differences between cookies and sessions?",
      answer: "Key differences: 1) Storage location - cookies on client, sessions on server, 2) Size limits - cookies 4KB max, sessions unlimited, 3) Security - sessions more secure for sensitive data, 4) Persistence - cookies can persist across browser sessions, sessions typically temporary, 5) Server load - cookies reduce server memory, sessions increase it, 6) Network overhead - cookies sent with every request, sessions only send ID. Choose based on data sensitivity, size requirements, and scalability needs."
    },
    
    {
      question: "How do you implement secure cookie handling?",
      answer: "Secure cookie practices: 1) Use 'secure' flag for HTTPS-only transmission, 2) Set 'httpOnly' to prevent JavaScript access (XSS protection), 3) Use 'sameSite=strict' for CSRF protection, 4) Set appropriate expiration with 'max-age' or 'expires', 5) Limit scope with 'domain' and 'path', 6) Sign or encrypt sensitive cookie data, 7) Use HTTPS in production, 8) Validate cookie data on server, 9) Implement proper session management, 10) Regular security audits."
    },
    
    {
      question: "What are the security vulnerabilities associated with sessions?",
      answer: "Session vulnerabilities: 1) Session fixation - attacker sets session ID before login, 2) Session hijacking - stealing session ID via XSS/network sniffing, 3) CSRF attacks - unauthorized requests with valid session, 4) Session timeout issues - too long/short expiration, 5) Insecure session storage - unencrypted or accessible storage, 6) Predictable session IDs - weak random generation, 7) Session data exposure - sensitive info in session. Mitigate with secure ID generation, HTTPS, proper timeouts, and regeneration after login."
    },
    
    {
      question: "How do you handle sessions in a distributed/load-balanced environment?",
      answer: "Distributed session strategies: 1) Sticky sessions - route users to same server (simple but limits scalability), 2) Shared session store - Redis/database accessible by all servers (recommended), 3) Stateless tokens - JWT with all data encoded (no server storage needed), 4) Database sessions - store in shared database (persistent but slower), 5) Hybrid approach - session ID in cookie, data in shared store. Consider consistency, performance, failover, and scalability requirements when choosing."
    },
    
    {
      question: "What is the difference between session cookies and persistent cookies?",
      answer: "Session cookies: 1) No expiration date set, 2) Deleted when browser closes, 3) Stored in memory only, 4) Used for temporary data like session IDs. Persistent cookies: 1) Have expiration date/max-age, 2) Survive browser restarts, 3) Stored on disk, 4) Used for preferences, 'remember me' functionality. Example: Set-Cookie: sessionid=abc123 (session) vs Set-Cookie: theme=dark; max-age=31536000 (persistent). Choose based on data persistence requirements."
    },
    {
      question: "How do you implement secure session management?",
      answer: "Secure session management: 1) Use HTTPS in production, 2) Set httpOnly flag on session cookies, 3) Regenerate session ID after login, 4) Implement session timeout, 5) Use secure session storage (Redis/database), 6) Validate session on each request, 7) Clear sessions on logout, 8) Use strong session ID generation, 9) Implement CSRF protection, 10) Monitor for session hijacking attempts."
    },
    {
      question: "When should you use cookies vs sessions?",
      answer: "Use cookies for: 1) User preferences (theme, language), 2) Remember me functionality, 3) Tracking and analytics, 4) Small, non-sensitive data, 5) Client-side state. Use sessions for: 1) Authentication state, 2) Shopping cart contents, 3) Sensitive user data, 4) Large amounts of data, 5) Server-side state management. Consider hybrid approach: session ID in cookie, sensitive data in server session."
    }
  ]
};