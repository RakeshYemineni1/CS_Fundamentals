export const enhancedURLWorkflow = {
  id: 'url-workflow',
  title: 'How does a URL work? (End-to-end flow)',
  subtitle: 'Complete Web Request Journey',
  summary: 'Step-by-step process of what happens when you enter a URL in a browser, from DNS resolution to page rendering, including all network protocols and components involved.',
  
  analogy: "Think of entering a URL like sending a letter. You write an address (URL), the postal system looks up the exact location (DNS), finds the best route (routing), delivers the letter (HTTP request), the recipient processes it (web server), and sends a response back (HTTP response) through the same system.",
  
  visualConcept: "Imagine URL processing as a restaurant order: you tell the waiter what you want (URL), they check the menu and find the kitchen (DNS), place the order (HTTP request), the kitchen prepares the food (server processing), and delivers it back to your table (browser rendering).",
  
  realWorldUse: "Every web page visit, API call, image loading, form submission, and web application interaction follows this fundamental process.",

  explanation: `
When you enter a URL in a browser, a complex series of steps occurs involving multiple protocols, servers, and network components.

Complete URL Workflow:

1. URL Parsing
Browser parses the URL to extract protocol (HTTP/HTTPS), domain name, port, path, and query parameters.

2. DNS Resolution
- Check browser cache for IP address
- Check OS cache and hosts file
- Query DNS resolver (ISP or configured DNS)
- Recursive DNS queries through root, TLD, and authoritative servers
- Return IP address to browser

3. TCP Connection Establishment
- Browser initiates TCP connection to server IP
- Three-way handshake (SYN, SYN-ACK, ACK)
- For HTTPS, additional TLS handshake for encryption

4. HTTP Request
- Browser sends HTTP request with headers
- Includes method (GET, POST), path, headers, and body
- Request travels through network infrastructure

5. Server Processing
- Web server receives and processes request
- May involve load balancers, reverse proxies
- Application server processes business logic
- Database queries if needed
- Generate response content

6. HTTP Response
- Server sends HTTP response with status code
- Includes headers and response body (HTML, JSON, etc.)
- Response travels back through network

7. Content Processing
- Browser receives and parses response
- Processes HTML, CSS, JavaScript
- Makes additional requests for resources
- Renders page progressively

8. Page Rendering
- DOM construction and CSS parsing
- JavaScript execution
- Layout calculation and painting
- Display final page to user

Network Components Involved:
- DNS servers, routers, switches, firewalls, load balancers, CDNs, web servers, application servers, databases
  `,

  keyPoints: [
    "URL workflow involves multiple network protocols and components",
    "DNS resolution translates domain names to IP addresses",
    "TCP connection establishment ensures reliable communication",
    "HTTPS adds TLS encryption for security",
    "HTTP request/response carries application data",
    "Server processing may involve multiple backend systems",
    "Browser rendering transforms response into visual page",
    "Caching at multiple levels improves performance",
    "Load balancers and CDNs optimize delivery",
    "Each step can be optimized for better performance"
  ],

  codeExamples: [
    {
      title: "URL Workflow Simulator",
      language: "python",
      code: `
import time
import socket
import ssl
import urllib.parse
import json
from datetime import datetime
from dataclasses import dataclass
from typing import Dict, List, Optional

@dataclass
class RequestStep:
    step_name: str
    start_time: float
    end_time: float
    duration: float
    details: Dict
    success: bool

class URLWorkflowSimulator:
    def __init__(self):
        self.steps: List[RequestStep] = []
        self.dns_cache = {}
        self.connection_pool = {}
        
    def simulate_url_request(self, url: str) -> Dict:
        """Simulate complete URL request workflow"""
        print(f"Simulating request to: {url}")
        self.steps = []
        
        start_time = time.time()
        
        try:
            # Step 1: URL Parsing
            parsed_url = self._parse_url(url)
            
            # Step 2: DNS Resolution
            ip_address = self._resolve_dns(parsed_url['hostname'])
            
            # Step 3: TCP Connection
            connection = self._establish_connection(ip_address, parsed_url['port'], parsed_url['scheme'] == 'https')
            
            # Step 4: HTTP Request
            response = self._send_http_request(connection, parsed_url)
            
            # Step 5: Process Response
            processed_response = self._process_response(response)
            
            # Step 6: Render Content (simulated)
            render_info = self._simulate_rendering(processed_response)
            
            total_time = time.time() - start_time
            
            return {
                'url': url,
                'success': True,
                'total_time': total_time,
                'steps': self.steps,
                'final_response': processed_response,
                'render_info': render_info
            }
            
        except Exception as e:
            return {
                'url': url,
                'success': False,
                'error': str(e),
                'total_time': time.time() - start_time,
                'steps': self.steps
            }
    
    def _parse_url(self, url: str) -> Dict:
        """Step 1: Parse URL components"""
        step_start = time.time()
        
        parsed = urllib.parse.urlparse(url)
        
        # Default ports
        default_ports = {'http': 80, 'https': 443}
        port = parsed.port or default_ports.get(parsed.scheme, 80)
        
        result = {
            'scheme': parsed.scheme,
            'hostname': parsed.hostname,
            'port': port,
            'path': parsed.path or '/',
            'query': parsed.query,
            'fragment': parsed.fragment
        }
        
        step_end = time.time()
        
        self.steps.append(RequestStep(
            step_name="URL Parsing",
            start_time=step_start,
            end_time=step_end,
            duration=(step_end - step_start) * 1000,
            details=result,
            success=True
        ))
        
        return result
    
    def _resolve_dns(self, hostname: str) -> str:
        """Step 2: DNS Resolution simulation"""
        step_start = time.time()
        
        # Check cache first
        if hostname in self.dns_cache:
            ip_address = self.dns_cache[hostname]
            cache_hit = True
            # Simulate cache lookup time
            time.sleep(0.001)
        else:
            # Simulate DNS resolution
            try:
                ip_address = socket.gethostbyname(hostname)
                self.dns_cache[hostname] = ip_address
                cache_hit = False
                # Simulate DNS lookup time
                time.sleep(0.05)  # 50ms average DNS lookup
            except socket.gaierror:
                raise Exception(f"DNS resolution failed for {hostname}")
        
        step_end = time.time()
        
        self.steps.append(RequestStep(
            step_name="DNS Resolution",
            start_time=step_start,
            end_time=step_end,
            duration=(step_end - step_start) * 1000,
            details={
                'hostname': hostname,
                'ip_address': ip_address,
                'cache_hit': cache_hit,
                'dns_servers_queried': [] if cache_hit else ['8.8.8.8', '1.1.1.1']
            },
            success=True
        ))
        
        return ip_address
    
    def _establish_connection(self, ip_address: str, port: int, use_ssl: bool) -> Dict:
        """Step 3: TCP Connection establishment"""
        step_start = time.time()
        
        connection_key = f"{ip_address}:{port}"
        
        # Check connection pool
        if connection_key in self.connection_pool:
            connection = self.connection_pool[connection_key]
            connection_reused = True
            # Simulate connection reuse time
            time.sleep(0.001)
        else:
            # Simulate TCP handshake
            time.sleep(0.02)  # 20ms for TCP handshake
            
            connection = {
                'ip': ip_address,
                'port': port,
                'ssl': use_ssl,
                'established_at': time.time()
            }
            
            # Simulate SSL/TLS handshake if HTTPS
            if use_ssl:
                time.sleep(0.03)  # Additional 30ms for TLS handshake
                connection['tls_version'] = 'TLS 1.3'
                connection['cipher_suite'] = 'TLS_AES_256_GCM_SHA384'
            
            self.connection_pool[connection_key] = connection
            connection_reused = False
        
        step_end = time.time()
        
        self.steps.append(RequestStep(
            step_name="TCP Connection",
            start_time=step_start,
            end_time=step_end,
            duration=(step_end - step_start) * 1000,
            details={
                'ip_address': ip_address,
                'port': port,
                'ssl_enabled': use_ssl,
                'connection_reused': connection_reused,
                'tls_version': connection.get('tls_version'),
                'cipher_suite': connection.get('cipher_suite')
            },
            success=True
        ))
        
        return connection
    
    def _send_http_request(self, connection: Dict, parsed_url: Dict) -> Dict:
        """Step 4: Send HTTP request"""
        step_start = time.time()
        
        # Construct HTTP request
        request_headers = {
            'Host': parsed_url['hostname'],
            'User-Agent': 'URLWorkflowSimulator/1.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        request_line = f"GET {parsed_url['path']}"
        if parsed_url['query']:
            request_line += f"?{parsed_url['query']}"
        request_line += " HTTP/1.1"
        
        # Simulate network transmission time
        time.sleep(0.01)  # 10ms network latency
        
        # Simulate server processing time
        time.sleep(0.1)   # 100ms server processing
        
        # Simulate response
        response = {
            'status_code': 200,
            'status_text': 'OK',
            'headers': {
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Length': '15420',
                'Server': 'nginx/1.18.0',
                'Date': datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT'),
                'Cache-Control': 'max-age=3600',
                'ETag': '"abc123def456"',
                'Content-Encoding': 'gzip'
            },
            'body': self._generate_sample_html(),
            'compressed': True
        }
        
        step_end = time.time()
        
        self.steps.append(RequestStep(
            step_name="HTTP Request/Response",
            start_time=step_start,
            end_time=step_end,
            duration=(step_end - step_start) * 1000,
            details={
                'request_method': 'GET',
                'request_path': parsed_url['path'],
                'request_headers': request_headers,
                'response_status': response['status_code'],
                'response_headers': response['headers'],
                'response_size': len(response['body']),
                'compression_used': response['compressed']
            },
            success=True
        ))
        
        return response
    
    def _process_response(self, response: Dict) -> Dict:
        """Step 5: Process HTTP response"""
        step_start = time.time()
        
        # Simulate decompression if needed
        if response.get('compressed'):
            time.sleep(0.005)  # 5ms decompression time
        
        # Parse content type
        content_type = response['headers'].get('Content-Type', '')
        
        # Simulate HTML parsing
        if 'text/html' in content_type:
            time.sleep(0.02)  # 20ms HTML parsing
            
            # Extract resources from HTML (simulated)
            resources = self._extract_resources(response['body'])
        else:
            resources = []
        
        processed = {
            'content_type': content_type,
            'content_length': len(response['body']),
            'resources_found': resources,
            'cacheable': 'Cache-Control' in response['headers'],
            'etag': response['headers'].get('ETag')
        }
        
        step_end = time.time()
        
        self.steps.append(RequestStep(
            step_name="Response Processing",
            start_time=step_start,
            end_time=step_end,
            duration=(step_end - step_start) * 1000,
            details=processed,
            success=True
        ))
        
        return processed
    
    def _simulate_rendering(self, processed_response: Dict) -> Dict:
        """Step 6: Simulate browser rendering"""
        step_start = time.time()
        
        # Simulate DOM construction
        time.sleep(0.01)  # 10ms DOM construction
        
        # Simulate CSS parsing
        time.sleep(0.005)  # 5ms CSS parsing
        
        # Simulate layout calculation
        time.sleep(0.015)  # 15ms layout
        
        # Simulate painting
        time.sleep(0.01)  # 10ms painting
        
        # Simulate JavaScript execution
        time.sleep(0.02)  # 20ms JavaScript
        
        render_info = {
            'dom_nodes': 150,
            'css_rules': 45,
            'javascript_files': 3,
            'images': 8,
            'total_resources': len(processed_response.get('resources_found', [])),
            'render_blocking_resources': 2,
            'first_paint_time': 0.025,  # 25ms
            'first_contentful_paint': 0.040,  # 40ms
            'largest_contentful_paint': 0.080   # 80ms
        }
        
        step_end = time.time()
        
        self.steps.append(RequestStep(
            step_name="Page Rendering",
            start_time=step_start,
            end_time=step_end,
            duration=(step_end - step_start) * 1000,
            details=render_info,
            success=True
        ))
        
        return render_info
    
    def _generate_sample_html(self) -> str:
        """Generate sample HTML content"""
        return '''<!DOCTYPE html>
<html>
<head>
    <title>Sample Page</title>
    <link rel="stylesheet" href="/css/style.css">
    <script src="/js/app.js"></script>
</head>
<body>
    <h1>Welcome to Sample Page</h1>
    <img src="/images/logo.png" alt="Logo">
    <p>This is a sample page for URL workflow simulation.</p>
</body>
</html>'''
    
    def _extract_resources(self, html: str) -> List[Dict]:
        """Extract resources from HTML (simplified)"""
        resources = []
        
        # Simulate resource extraction
        if 'style.css' in html:
            resources.append({'type': 'css', 'url': '/css/style.css'})
        if 'app.js' in html:
            resources.append({'type': 'javascript', 'url': '/js/app.js'})
        if 'logo.png' in html:
            resources.append({'type': 'image', 'url': '/images/logo.png'})
        
        return resources
    
    def get_performance_summary(self, result: Dict) -> Dict:
        """Generate performance summary"""
        if not result['success']:
            return {'error': result.get('error')}
        
        steps_by_name = {step.step_name: step for step in result['steps']}
        
        return {
            'total_time': result['total_time'] * 1000,  # Convert to ms
            'dns_time': steps_by_name.get('DNS Resolution', RequestStep('', 0, 0, 0, {}, False)).duration,
            'connection_time': steps_by_name.get('TCP Connection', RequestStep('', 0, 0, 0, {}, False)).duration,
            'request_time': steps_by_name.get('HTTP Request/Response', RequestStep('', 0, 0, 0, {}, False)).duration,
            'processing_time': steps_by_name.get('Response Processing', RequestStep('', 0, 0, 0, {}, False)).duration,
            'rendering_time': steps_by_name.get('Page Rendering', RequestStep('', 0, 0, 0, {}, False)).duration,
            'cache_hits': {
                'dns': steps_by_name.get('DNS Resolution', RequestStep('', 0, 0, 0, {}, False)).details.get('cache_hit', False),
                'connection': steps_by_name.get('TCP Connection', RequestStep('', 0, 0, 0, {}, False)).details.get('connection_reused', False)
            }
        }

# Usage example
if __name__ == "__main__":
    simulator = URLWorkflowSimulator()
    
    # Test URLs
    test_urls = [
        "https://www.google.com",
        "http://example.com",
        "https://github.com/user/repo"
    ]
    
    print("=== URL Workflow Simulation ===")
    
    for url in test_urls:
        print(f"\\n--- Testing {url} ---")
        
        result = simulator.simulate_url_request(url)
        
        if result['success']:
            print("✓ Request completed successfully")
            
            # Show step-by-step breakdown
            print("\\nStep-by-step breakdown:")
            for step in result['steps']:
                print(f"  {step.step_name}: {step.duration:.2f}ms")
            
            # Performance summary
            perf = simulator.get_performance_summary(result)
            print(f"\\nPerformance Summary:")
            print(f"  Total Time: {perf['total_time']:.2f}ms")
            print(f"  DNS Resolution: {perf['dns_time']:.2f}ms")
            print(f"  Connection: {perf['connection_time']:.2f}ms")
            print(f"  Request/Response: {perf['request_time']:.2f}ms")
            print(f"  Processing: {perf['processing_time']:.2f}ms")
            print(f"  Rendering: {perf['rendering_time']:.2f}ms")
            
            # Cache information
            cache_info = perf['cache_hits']
            print(f"\\nCache Performance:")
            print(f"  DNS Cache Hit: {'Yes' if cache_info['dns'] else 'No'}")
            print(f"  Connection Reused: {'Yes' if cache_info['connection'] else 'No'}")
            
        else:
            print(f"✗ Request failed: {result['error']}")
    
    print("\\n=== Optimization Recommendations ===")
    print("1. Enable DNS caching to reduce resolution time")
    print("2. Use HTTP/2 for connection multiplexing")
    print("3. Implement CDN for geographic distribution")
    print("4. Enable compression to reduce transfer time")
    print("5. Optimize images and resources for faster loading")
      `
    },
    {
      title: "Network Trace Analyzer",
      language: "javascript",
      code: `
class NetworkTraceAnalyzer {
    constructor() {
        this.traces = [];
        this.performanceMetrics = new Map();
    }
    
    async analyzeURLRequest(url) {
        console.log(\`Analyzing request to: \${url}\`);
        
        const trace = {
            url,
            timestamp: new Date().toISOString(),
            steps: [],
            performance: {},
            resources: []
        };
        
        try {
            // Step 1: URL Parsing
            const parsedURL = this.parseURL(url);
            trace.steps.push(this.createStep('URL Parsing', parsedURL));
            
            // Step 2: DNS Resolution
            const dnsResult = await this.simulateDNSResolution(parsedURL.hostname);
            trace.steps.push(this.createStep('DNS Resolution', dnsResult));
            
            // Step 3: TCP Connection
            const connectionResult = await this.simulateConnection(dnsResult.ipAddress, parsedURL.port, parsedURL.protocol === 'https');
            trace.steps.push(this.createStep('TCP Connection', connectionResult));
            
            // Step 4: HTTP Request/Response
            const httpResult = await this.simulateHTTPExchange(parsedURL);
            trace.steps.push(this.createStep('HTTP Exchange', httpResult));
            
            // Step 5: Content Processing
            const processingResult = this.processContent(httpResult.response);
            trace.steps.push(this.createStep('Content Processing', processingResult));
            
            // Step 6: Resource Loading
            const resourceResult = await this.loadAdditionalResources(processingResult.resources);
            trace.steps.push(this.createStep('Resource Loading', resourceResult));
            
            // Step 7: Rendering
            const renderResult = this.simulateRendering(processingResult, resourceResult);
            trace.steps.push(this.createStep('Page Rendering', renderResult));
            
            // Calculate performance metrics
            trace.performance = this.calculatePerformanceMetrics(trace.steps);
            
            this.traces.push(trace);
            return trace;
            
        } catch (error) {
            trace.error = error.message;
            trace.success = false;
            return trace;
        }
    }
    
    parseURL(url) {
        const startTime = performance.now();
        
        try {
            const urlObj = new URL(url);
            
            const result = {
                protocol: urlObj.protocol.slice(0, -1), // Remove trailing ':'
                hostname: urlObj.hostname,
                port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
                pathname: urlObj.pathname,
                search: urlObj.search,
                hash: urlObj.hash,
                origin: urlObj.origin
            };
            
            return {
                ...result,
                duration: performance.now() - startTime,
                success: true
            };
            
        } catch (error) {
            return {
                error: error.message,
                duration: performance.now() - startTime,
                success: false
            };
        }
    }
    
    async simulateDNSResolution(hostname) {
        const startTime = performance.now();
        
        // Simulate DNS cache check
        const cacheKey = \`dns_\${hostname}\`;
        const cached = this.getFromCache(cacheKey);
        
        if (cached) {
            return {
                hostname,
                ipAddress: cached.ipAddress,
                ttl: cached.ttl,
                cacheHit: true,
                duration: performance.now() - startTime,
                success: true
            };
        }
        
        // Simulate DNS resolution delay
        await this.delay(20 + Math.random() * 30); // 20-50ms
        
        // Generate simulated IP address
        const ipAddress = this.generateSimulatedIP(hostname);
        
        // Cache the result
        this.setCache(cacheKey, { ipAddress, ttl: 300 }, 300000); // 5 minutes
        
        return {
            hostname,
            ipAddress,
            ttl: 300,
            cacheHit: false,
            dnsServers: ['8.8.8.8', '1.1.1.1'],
            queryType: 'A',
            duration: performance.now() - startTime,
            success: true
        };
    }
    
    async simulateConnection(ipAddress, port, isHTTPS) {
        const startTime = performance.now();
        
        // Check connection pool
        const connectionKey = \`\${ipAddress}:\${port}\`;
        const existingConnection = this.getFromCache(\`conn_\${connectionKey}\`);
        
        if (existingConnection) {
            return {
                ipAddress,
                port,
                isHTTPS,
                connectionReused: true,
                duration: performance.now() - startTime,
                success: true
            };
        }
        
        // Simulate TCP handshake
        await this.delay(10 + Math.random() * 20); // 10-30ms
        
        const connectionResult = {
            ipAddress,
            port,
            isHTTPS,
            connectionReused: false,
            tcpHandshakeTime: 15 + Math.random() * 10,
            success: true
        };
        
        // Simulate TLS handshake for HTTPS
        if (isHTTPS) {
            await this.delay(20 + Math.random() * 30); // 20-50ms additional for TLS
            connectionResult.tlsHandshakeTime = 25 + Math.random() * 15;
            connectionResult.tlsVersion = 'TLS 1.3';
            connectionResult.cipherSuite = 'TLS_AES_256_GCM_SHA384';
        }
        
        connectionResult.duration = performance.now() - startTime;
        
        // Cache connection for reuse
        this.setCache(\`conn_\${connectionKey}\`, connectionResult, 60000); // 1 minute
        
        return connectionResult;
    }
    
    async simulateHTTPExchange(parsedURL) {
        const startTime = performance.now();
        
        // Simulate request transmission
        await this.delay(5 + Math.random() * 10); // 5-15ms
        
        // Simulate server processing
        await this.delay(50 + Math.random() * 100); // 50-150ms
        
        // Simulate response transmission
        await this.delay(10 + Math.random() * 20); // 10-30ms
        
        const response = {
            status: 200,
            statusText: 'OK',
            headers: {
                'content-type': 'text/html; charset=utf-8',
                'content-length': '25600',
                'server': 'nginx/1.18.0',
                'cache-control': 'max-age=3600',
                'etag': '"abc123"',
                'last-modified': new Date(Date.now() - 86400000).toUTCString()
            },
            body: this.generateSampleHTML(),
            compressed: true,
            fromCache: false
        };
        
        return {
            method: 'GET',
            url: parsedURL.origin + parsedURL.pathname + parsedURL.search,
            requestHeaders: {
                'User-Agent': 'NetworkTraceAnalyzer/1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br'
            },
            response,
            duration: performance.now() - startTime,
            success: true
        };
    }
    
    processContent(httpResponse) {
        const startTime = performance.now();
        
        const contentType = httpResponse.headers['content-type'] || '';
        const isHTML = contentType.includes('text/html');
        
        let resources = [];
        
        if (isHTML) {
            // Extract resources from HTML
            resources = this.extractResourcesFromHTML(httpResponse.body);
        }
        
        return {
            contentType,
            contentLength: parseInt(httpResponse.headers['content-length'] || '0'),
            isHTML,
            resources,
            cacheable: !!httpResponse.headers['cache-control'],
            etag: httpResponse.headers['etag'],
            duration: performance.now() - startTime,
            success: true
        };
    }
    
    async loadAdditionalResources(resources) {
        const startTime = performance.now();
        
        if (!resources || resources.length === 0) {
            return {
                totalResources: 0,
                loadedResources: 0,
                failedResources: 0,
                duration: performance.now() - startTime,
                success: true
            };
        }
        
        const loadPromises = resources.map(async (resource) => {
            const loadStart = performance.now();
            
            // Simulate resource loading time based on type
            const loadTime = this.getResourceLoadTime(resource.type);
            await this.delay(loadTime);
            
            return {
                url: resource.url,
                type: resource.type,
                size: resource.estimatedSize || 0,
                loadTime: performance.now() - loadStart,
                success: Math.random() > 0.05 // 95% success rate
            };
        });
        
        const results = await Promise.all(loadPromises);
        
        return {
            totalResources: resources.length,
            loadedResources: results.filter(r => r.success).length,
            failedResources: results.filter(r => !r.success).length,
            resourceDetails: results,
            duration: performance.now() - startTime,
            success: true
        };
    }
    
    simulateRendering(processingResult, resourceResult) {
        const startTime = performance.now();
        
        // Simulate DOM construction
        const domConstructionTime = 10 + Math.random() * 20;
        
        // Simulate CSS parsing and application
        const cssParsingTime = 5 + Math.random() * 15;
        
        // Simulate layout calculation
        const layoutTime = 8 + Math.random() * 12;
        
        // Simulate painting
        const paintTime = 6 + Math.random() * 14;
        
        // Simulate JavaScript execution
        const jsExecutionTime = 15 + Math.random() * 25;
        
        const renderingMetrics = {
            domConstructionTime,
            cssParsingTime,
            layoutTime,
            paintTime,
            jsExecutionTime,
            firstPaint: domConstructionTime + cssParsingTime,
            firstContentfulPaint: domConstructionTime + cssParsingTime + layoutTime,
            largestContentfulPaint: domConstructionTime + cssParsingTime + layoutTime + paintTime,
            timeToInteractive: domConstructionTime + cssParsingTime + layoutTime + paintTime + jsExecutionTime
        };
        
        return {
            ...renderingMetrics,
            duration: performance.now() - startTime,
            success: true
        };
    }
    
    createStep(name, data) {
        return {
            name,
            timestamp: new Date().toISOString(),
            ...data
        };
    }
    
    calculatePerformanceMetrics(steps) {
        const totalTime = steps.reduce((sum, step) => sum + (step.duration || 0), 0);
        
        const stepTimes = {};
        steps.forEach(step => {
            stepTimes[step.name.toLowerCase().replace(/\\s+/g, '_')] = step.duration || 0;
        });
        
        return {
            totalTime,
            stepTimes,
            dnsTime: stepTimes.dns_resolution || 0,
            connectionTime: stepTimes.tcp_connection || 0,
            requestTime: stepTimes.http_exchange || 0,
            processingTime: stepTimes.content_processing || 0,
            resourceLoadTime: stepTimes.resource_loading || 0,
            renderTime: stepTimes.page_rendering || 0,
            
            // Performance scores (0-100)
            dnsScore: this.calculateScore(stepTimes.dns_resolution, 50, 200),
            connectionScore: this.calculateScore(stepTimes.tcp_connection, 100, 500),
            responseScore: this.calculateScore(stepTimes.http_exchange, 200, 1000),
            renderScore: this.calculateScore(stepTimes.page_rendering, 100, 500)
        };
    }
    
    calculateScore(actualTime, goodThreshold, poorThreshold) {
        if (actualTime <= goodThreshold) return 100;
        if (actualTime >= poorThreshold) return 0;
        
        const range = poorThreshold - goodThreshold;
        const position = actualTime - goodThreshold;
        return Math.round(100 - (position / range) * 100);
    }
    
    // Helper methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    getFromCache(key) {
        const item = localStorage.getItem(key);
        if (item) {
            const parsed = JSON.parse(item);
            if (parsed.expires > Date.now()) {
                return parsed.data;
            }
            localStorage.removeItem(key);
        }
        return null;
    }
    
    setCache(key, data, ttlMs) {
        const item = {
            data,
            expires: Date.now() + ttlMs
        };
        localStorage.setItem(key, JSON.stringify(item));
    }
    
    generateSimulatedIP(hostname) {
        // Generate a realistic IP based on hostname
        const hash = this.simpleHash(hostname);
        return \`\${(hash % 223) + 1}.\${(hash >> 8) % 256}.\${(hash >> 16) % 256}.\${(hash >> 24) % 256}\`;
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    
    generateSampleHTML() {
        return \`<!DOCTYPE html>
<html>
<head>
    <title>Sample Page</title>
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/theme.css">
    <script src="/js/jquery.min.js"></script>
</head>
<body>
    <header>
        <img src="/images/logo.png" alt="Logo">
        <nav>
            <a href="/home">Home</a>
            <a href="/about">About</a>
        </nav>
    </header>
    <main>
        <h1>Welcome</h1>
        <img src="/images/hero.jpg" alt="Hero Image">
        <p>This is a sample page.</p>
    </main>
    <script src="/js/app.js"></script>
</body>
</html>\`;
    }
    
    extractResourcesFromHTML(html) {
        const resources = [];
        
        // Extract CSS files
        const cssMatches = html.match(/href="([^"]*\\.css[^"]*)"/g) || [];
        cssMatches.forEach(match => {
            const url = match.match(/href="([^"]*)"/)[1];
            resources.push({ type: 'css', url, estimatedSize: 15000 });
        });
        
        // Extract JavaScript files
        const jsMatches = html.match(/src="([^"]*\\.js[^"]*)"/g) || [];
        jsMatches.forEach(match => {
            const url = match.match(/src="([^"]*)"/)[1];
            resources.push({ type: 'javascript', url, estimatedSize: 25000 });
        });
        
        // Extract images
        const imgMatches = html.match(/<img[^>]+src="([^"]*)"[^>]*>/g) || [];
        imgMatches.forEach(match => {
            const url = match.match(/src="([^"]*)"/)[1];
            resources.push({ type: 'image', url, estimatedSize: 50000 });
        });
        
        return resources;
    }
    
    getResourceLoadTime(type) {
        const baseTimes = {
            'css': 20,
            'javascript': 30,
            'image': 40,
            'font': 25
        };
        
        const baseTime = baseTimes[type] || 20;
        return baseTime + Math.random() * baseTime;
    }
    
    generateReport(trace) {
        if (!trace.success) {
            return \`Request failed: \${trace.error}\`;
        }
        
        let report = \`=== URL Request Analysis Report ===\\n\`;
        report += \`URL: \${trace.url}\\n\`;
        report += \`Timestamp: \${trace.timestamp}\\n\`;
        report += \`Total Time: \${trace.performance.totalTime.toFixed(2)}ms\\n\\n\`;
        
        report += \`Step-by-Step Breakdown:\\n\`;
        trace.steps.forEach(step => {
            report += \`  \${step.name}: \${(step.duration || 0).toFixed(2)}ms\\n\`;
        });
        
        report += \`\\nPerformance Scores:\\n\`;
        report += \`  DNS Resolution: \${trace.performance.dnsScore}/100\\n\`;
        report += \`  Connection: \${trace.performance.connectionScore}/100\\n\`;
        report += \`  Response: \${trace.performance.responseScore}/100\\n\`;
        report += \`  Rendering: \${trace.performance.renderScore}/100\\n\`;
        
        return report;
    }
}

// Usage example
async function demonstrateURLWorkflow() {
    const analyzer = new NetworkTraceAnalyzer();
    
    const testURLs = [
        'https://www.google.com',
        'https://github.com',
        'https://stackoverflow.com'
    ];
    
    console.log('=== URL Workflow Analysis ===');
    
    for (const url of testURLs) {
        console.log(\`\\nAnalyzing: \${url}\`);
        
        try {
            const trace = await analyzer.analyzeURLRequest(url);
            
            if (trace.success !== false) {
                console.log(\`✓ Analysis completed in \${trace.performance.totalTime.toFixed(2)}ms\`);
                
                // Show key metrics
                console.log('Key Metrics:');
                console.log(\`  DNS: \${trace.performance.dnsTime.toFixed(2)}ms\`);
                console.log(\`  Connection: \${trace.performance.connectionTime.toFixed(2)}ms\`);
                console.log(\`  Response: \${trace.performance.requestTime.toFixed(2)}ms\`);
                console.log(\`  Rendering: \${trace.performance.renderTime.toFixed(2)}ms\`);
                
                // Show performance scores
                const avgScore = (trace.performance.dnsScore + trace.performance.connectionScore + 
                                trace.performance.responseScore + trace.performance.renderScore) / 4;
                console.log(\`  Overall Score: \${avgScore.toFixed(1)}/100\`);
                
            } else {
                console.log(\`✗ Analysis failed: \${trace.error}\`);
            }
            
        } catch (error) {
            console.log(\`✗ Error: \${error.message}\`);
        }
    }
}

// Run the demonstration
demonstrateURLWorkflow();
      `
    }
  ],

  resources: [
    {
      title: "How the Web Works - MDN",
      url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works",
      description: "Comprehensive guide to web request lifecycle and components"
    },
    {
      title: "What happens when you type a URL - GitHub",
      url: "https://github.com/alex/what-happens-when",
      description: "Detailed technical explanation of the complete URL request process"
    },
    {
      title: "DNS Resolution Process - YouTube",
      url: "https://www.youtube.com/watch?v=mpQZVYPuDGU",
      description: "Visual explanation of DNS resolution and caching mechanisms"
    },
    {
      title: "HTTP Protocol Deep Dive",
      url: "https://tools.ietf.org/html/rfc7231",
      description: "Official HTTP/1.1 specification and protocol details"
    },
    {
      title: "Browser Rendering Process",
      url: "https://developers.google.com/web/fundamentals/performance/critical-rendering-path",
      description: "Google's guide to browser rendering and performance optimization"
    }
  ],

  questions: [
    {
      question: "What happens when you type a URL in the browser address bar?",
      answer: "The browser parses the URL, performs DNS resolution to get the IP address, establishes a TCP connection (with TLS for HTTPS), sends an HTTP request, receives the response, processes the content, loads additional resources, and renders the page. Each step involves multiple network protocols and components."
    },
    {
      question: "Explain the DNS resolution process in detail.",
      answer: "DNS resolution involves: 1) Browser cache check, 2) OS cache and hosts file check, 3) DNS resolver query (ISP or configured), 4) Recursive queries through root servers, TLD servers, and authoritative servers, 5) Response cached at multiple levels, 6) IP address returned to browser for connection establishment."
    },
    {
      question: "What is the difference between HTTP and HTTPS in the URL workflow?",
      answer: "HTTPS adds a TLS handshake after TCP connection establishment, involving certificate verification, cipher negotiation, and key exchange. This adds latency but provides encryption, authentication, and data integrity. The rest of the workflow remains similar but all data is encrypted during transmission."
    },
    {
      question: "How do browsers handle multiple resources on a web page?",
      answer: "Browsers parse HTML to discover resources (CSS, JavaScript, images), prioritize critical resources, make parallel requests (limited by connection limits), handle dependencies (CSS blocks rendering, JavaScript can block parsing), and progressively render content as resources load."
    },
    {
      question: "What role do caches play in the URL workflow?",
      answer: "Caches exist at multiple levels: DNS cache (reduces resolution time), browser cache (avoids re-downloading resources), CDN cache (serves content from edge locations), and proxy caches. They improve performance by reducing latency and bandwidth usage but require proper cache management and invalidation strategies."
    },
    {
      question: "How does the TCP three-way handshake work?",
      answer: "TCP handshake involves: 1) Client sends SYN packet with initial sequence number, 2) Server responds with SYN-ACK (acknowledges client's SYN and sends its own), 3) Client sends ACK to acknowledge server's SYN. This establishes reliable connection with agreed sequence numbers for data transmission."
    },
    {
      question: "What happens during the browser rendering process?",
      answer: "Rendering involves: 1) HTML parsing to build DOM tree, 2) CSS parsing to build CSSOM, 3) Combining DOM and CSSOM into render tree, 4) Layout calculation (positioning and sizing), 5) Painting (filling pixels), 6) Compositing (layering). JavaScript can modify DOM/CSSOM and trigger re-rendering."
    },
    {
      question: "How do load balancers and CDNs affect the URL workflow?",
      answer: "Load balancers distribute requests across multiple servers, appearing transparent to clients but improving availability and performance. CDNs cache content at edge locations, potentially serving responses from geographically closer servers, reducing latency and origin server load while maintaining the same workflow structure."
    },
    {
      question: "What are the performance bottlenecks in the URL workflow?",
      answer: "Common bottlenecks include: DNS resolution delays, network latency, server processing time, large resource sizes, render-blocking resources, JavaScript execution time, and sequential resource loading. Optimization involves caching, compression, CDNs, resource optimization, and parallel loading strategies."
    },
    {
      question: "How do modern protocols like HTTP/2 and HTTP/3 improve the workflow?",
      answer: "HTTP/2 adds multiplexing (multiple requests per connection), server push, and header compression, reducing connection overhead and latency. HTTP/3 uses QUIC over UDP, providing faster connection establishment, better loss recovery, and connection migration. Both maintain the same high-level workflow while improving efficiency."
    }
  ]
};