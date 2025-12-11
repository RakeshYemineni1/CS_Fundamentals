export const enhancedHTTPvsHTTPS = {
  id: 'http-vs-https',
  title: 'HTTP vs HTTPS',
  subtitle: 'Secure Web Communication Protocols',
  summary: 'HTTP is the foundation of web communication, while HTTPS adds SSL/TLS encryption for secure data transmission, authentication, and data integrity.',
  analogy: 'Like sending a postcard (HTTP) vs sending a sealed, encrypted letter (HTTPS) - anyone can read the postcard, but only the intended recipient can decrypt the letter.',
  visualConcept: 'Picture HTTP as plain text flowing over the network, while HTTPS wraps that data in an encrypted tunnel that only the sender and receiver can access.',
  realWorldUse: 'All web browsing, e-commerce transactions, online banking, social media, API communications, and any web-based application requiring security.',
  explanation: `HTTP vs HTTPS Comparison:

HTTP (Hypertext Transfer Protocol) is the foundation protocol for web communication, operating on port 80. It's a stateless, request-response protocol that transfers data in plain text, making it fast but insecure.

HTTPS (HTTP Secure) adds SSL/TLS encryption to HTTP, operating on port 443. It provides three key security features: encryption (data confidentiality), authentication (server identity verification), and integrity (data tampering detection).

The SSL/TLS handshake establishes secure communication through certificate exchange, cipher negotiation, and key generation. Modern browsers mark HTTP sites as "Not Secure" and favor HTTPS for SEO rankings.`,

  keyPoints: [
    'HTTP transmits data in plain text, HTTPS encrypts all communication',
    'HTTP uses port 80, HTTPS uses port 443',
    'HTTPS provides encryption, authentication, and data integrity',
    'SSL/TLS handshake establishes secure connection',
    'HTTPS has minimal performance overhead with modern hardware',
    'Search engines favor HTTPS sites for SEO rankings',
    'Modern browsers mark HTTP sites as "Not Secure"',
    'HTTPS prevents man-in-the-middle attacks',
    'Certificate authorities validate server identity',
    'HTTP/2 requires HTTPS for most implementations'
  ],

  codeExamples: [
    {
      title: "HTTP vs HTTPS Client Implementation",
      content: `
        <h3>HTTP vs HTTPS Request Comparison</h3>
        <p>Understanding the differences in implementation and security between HTTP and HTTPS requests.</p>
        
        <h4>Key Differences:</h4>
        <ul>
          <li><strong>Protocol:</strong> HTTP uses plain text, HTTPS uses SSL/TLS encryption</li>
          <li><strong>Ports:</strong> HTTP (80), HTTPS (443)</li>
          <li><strong>Security:</strong> HTTP vulnerable to eavesdropping, HTTPS encrypted</li>
          <li><strong>Certificates:</strong> HTTPS requires SSL certificates</li>
        </ul>

        <div class="code-block">
          <h4>HTTP Request Flow</h4>
          <pre><code>Client Request (Plain Text):
GET /api/users HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer token123

Server Response (Plain Text):
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 156

{"users": [{"id": 1, "name": "John", "email": "john@example.com"}]}

Security Issues:
- All data visible to network sniffers
- Credentials transmitted in plain text
- No server authentication
- Data can be modified in transit</code></pre>
        </div>

        <div class="code-block">
          <h4>HTTPS Request Flow</h4>
          <pre><code>1. SSL/TLS Handshake:
   Client Hello → Server Hello
   Certificate Exchange → Key Exchange
   Cipher Negotiation → Session Keys

2. Encrypted Request:
GET /api/users HTTP/1.1
Host: example.com
[All headers and data encrypted]

3. Encrypted Response:
HTTP/1.1 200 OK
[All response data encrypted]

Security Benefits:
- All data encrypted with AES-256
- Server identity verified via certificate
- Data integrity protected with HMAC
- Perfect Forward Secrecy (PFS)</code></pre>
        </div>

        <h4>Performance Comparison:</h4>
        <ul>
          <li>HTTP: Faster initial connection, no encryption overhead</li>
          <li>HTTPS: SSL handshake adds ~100-200ms, minimal ongoing overhead</li>
          <li>Modern hardware makes HTTPS performance impact negligible</li>
          <li>HTTP/2 over HTTPS often faster than HTTP/1.1</li>
        </ul>
      `
    },
    
    {
      title: "SSL/TLS Handshake Process",
      content: `
        <h3>SSL/TLS Handshake Detailed Process</h3>
        <p>The SSL/TLS handshake establishes secure communication between client and server.</p>
        
        <div class="code-block">
          <h4>Complete Handshake Flow</h4>
          <pre><code>Step 1: Client Hello
- Supported SSL/TLS versions
- Supported cipher suites
- Random number (Client Random)
- Session ID (if resuming)

Client → Server:
TLS Version: 1.3
Cipher Suites: TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256
Client Random: 28 bytes of random data
Extensions: SNI, ALPN, supported_groups

Step 2: Server Hello
- Selected TLS version
- Selected cipher suite  
- Random number (Server Random)
- Session ID

Server → Client:
TLS Version: 1.3
Cipher Suite: TLS_AES_256_GCM_SHA384
Server Random: 28 bytes of random data
Session ID: 32 bytes

Step 3: Certificate Exchange
- Server sends SSL certificate
- Certificate chain validation
- Public key extraction

Server → Client:
Certificate: X.509 certificate
Subject: CN=example.com
Issuer: Let's Encrypt Authority X3
Valid: 2024-01-01 to 2024-12-31
Public Key: RSA 2048-bit

Step 4: Key Exchange
- Client generates pre-master secret
- Encrypts with server's public key
- Server decrypts with private key

Client → Server:
Encrypted Pre-Master Secret (256 bytes)

Step 5: Session Key Generation
Both parties generate session keys:
Master Secret = PRF(Pre-Master Secret, "master secret", 
                   Client Random + Server Random)

Session Keys derived from Master Secret:
- Client Write Key (encryption)
- Server Write Key (encryption)  
- Client MAC Key (integrity)
- Server MAC Key (integrity)

Step 6: Handshake Completion
Client → Server: "Finished" message (encrypted)
Server → Client: "Finished" message (encrypted)

Result: Secure channel established!</code></pre>
        </div>

        <h4>TLS 1.3 Improvements:</h4>
        <ul>
          <li>Reduced handshake round trips (1-RTT vs 2-RTT)</li>
          <li>0-RTT resumption for returning clients</li>
          <li>Stronger cipher suites only</li>
          <li>Perfect Forward Secrecy mandatory</li>
        </ul>
      `
    },
    
    {
      title: "Certificate Validation Process",
      content: `
        <h3>SSL Certificate Validation</h3>
        <p>How browsers and clients validate SSL certificates to ensure secure connections.</p>
        
        <div class="code-block">
          <h4>Certificate Validation Steps</h4>
          <pre><code>1. Certificate Chain Validation:
   Root CA (Certificate Authority)
   ↓ signs
   Intermediate CA
   ↓ signs  
   Server Certificate (example.com)

2. Certificate Checks:
   ✓ Domain Name Match (CN or SAN)
   ✓ Expiration Date (Not Before/Not After)
   ✓ Certificate Authority Trust
   ✓ Certificate Revocation Status (CRL/OCSP)
   ✓ Signature Verification

3. Example Certificate:
Subject: CN=example.com, O=Example Corp, C=US
Issuer: CN=DigiCert SHA2 Secure Server CA
Serial Number: 0x1234567890ABCDEF
Valid From: 2024-01-01 00:00:00 UTC
Valid To: 2024-12-31 23:59:59 UTC
Public Key: RSA 2048 bits
Signature Algorithm: SHA256withRSA
Subject Alternative Names: 
  - example.com
  - www.example.com
  - api.example.com

4. Trust Chain Verification:
Root CA Certificate (in browser trust store)
→ Intermediate CA Certificate (from server)
→ Server Certificate (from server)

Each certificate signed by the one above it.</code></pre>
        </div>

        <h4>Certificate Types:</h4>
        <ul>
          <li><strong>Domain Validated (DV):</strong> Basic domain ownership verification</li>
          <li><strong>Organization Validated (OV):</strong> Domain + organization verification</li>
          <li><strong>Extended Validation (EV):</strong> Highest level, shows organization name</li>
          <li><strong>Wildcard:</strong> Covers all subdomains (*.example.com)</li>
          <li><strong>Multi-Domain (SAN):</strong> Covers multiple domains</li>
        </ul>

        <div class="code-block">
          <h4>Certificate Errors</h4>
          <pre><code>Common SSL Certificate Errors:

1. Name Mismatch:
   Certificate: issued for "example.com"
   Accessing: "subdomain.example.com"
   Error: ERR_CERT_COMMON_NAME_INVALID

2. Expired Certificate:
   Valid Until: 2023-12-31
   Current Date: 2024-01-15
   Error: ERR_CERT_DATE_INVALID

3. Self-Signed Certificate:
   Issuer: Same as Subject
   Error: ERR_CERT_AUTHORITY_INVALID

4. Revoked Certificate:
   Status: Revoked by CA
   Error: ERR_CERT_REVOKED

5. Weak Signature:
   Algorithm: SHA1withRSA (deprecated)
   Error: ERR_CERT_WEAK_SIGNATURE_ALGORITHM</code></pre>
        </div>
      `
    },
    
    {
      title: "HTTPS Implementation Best Practices",
      content: `
        <h3>HTTPS Security Best Practices</h3>
        <p>Essential security configurations for implementing HTTPS properly.</p>
        
        <div class="code-block">
          <h4>Security Headers Configuration</h4>
          <pre><code>Essential HTTPS Security Headers:

1. Strict-Transport-Security (HSTS):
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
- Forces HTTPS for all future requests
- Prevents protocol downgrade attacks
- includeSubDomains: applies to all subdomains
- preload: submit to browser preload lists

2. Content-Security-Policy (CSP):
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; 
                        style-src 'self' 'unsafe-inline'; img-src 'self' data:
- Prevents XSS attacks
- Controls resource loading sources
- Blocks unauthorized script execution

3. X-Frame-Options:
X-Frame-Options: DENY
- Prevents clickjacking attacks
- DENY: no framing allowed
- SAMEORIGIN: only same-origin framing

4. X-Content-Type-Options:
X-Content-Type-Options: nosniff
- Prevents MIME type sniffing
- Forces browsers to respect Content-Type

5. Referrer-Policy:
Referrer-Policy: strict-origin-when-cross-origin
- Controls referrer information leakage
- Protects user privacy</code></pre>
        </div>

        <h4>TLS Configuration Best Practices:</h4>
        
        <div class="code-block">
          <h4>Secure TLS Configuration</h4>
          <pre><code>Recommended TLS Settings:

1. TLS Versions:
   ✓ TLS 1.3 (preferred)
   ✓ TLS 1.2 (minimum)
   ✗ TLS 1.1 (deprecated)
   ✗ TLS 1.0 (deprecated)
   ✗ SSL 3.0 (vulnerable)

2. Cipher Suites (TLS 1.3):
   - TLS_AES_256_GCM_SHA384
   - TLS_CHACHA20_POLY1305_SHA256
   - TLS_AES_128_GCM_SHA256

3. Cipher Suites (TLS 1.2):
   - ECDHE-RSA-AES256-GCM-SHA384
   - ECDHE-RSA-CHACHA20-POLY1305
   - ECDHE-RSA-AES128-GCM-SHA256

4. Key Exchange:
   ✓ ECDHE (Elliptic Curve Diffie-Hellman Ephemeral)
   ✓ DHE (Diffie-Hellman Ephemeral)
   ✗ RSA key exchange (no forward secrecy)

5. Certificate Configuration:
   - RSA 2048-bit minimum (4096-bit recommended)
   - ECDSA P-256 or P-384
   - SHA-256 signature algorithm minimum</code></pre>
        </div>

        <h4>Performance Optimization:</h4>
        <ul>
          <li><strong>HTTP/2:</strong> Multiplexing, server push, header compression</li>
          <li><strong>Session Resumption:</strong> TLS session tickets, session cache</li>
          <li><strong>OCSP Stapling:</strong> Faster certificate validation</li>
          <li><strong>Certificate Pinning:</strong> Enhanced security for mobile apps</li>
        </ul>
      `
    }
  ],

  codeExamples: [
    {
      title: "HTTP vs HTTPS Client Implementation",
      language: "java",
      code: `import java.io.*;
import java.net.*;
import javax.net.ssl.*;
import java.security.cert.X509Certificate;

public class HTTPvsHTTPSClient {
    
    // HTTP Client - Plain text communication
    public static String makeHTTPRequest(String urlString) {
        StringBuilder response = new StringBuilder();
        
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            // HTTP configuration
            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", "Java HTTP Client");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);
            
            System.out.println("Making HTTP request to: " + urlString);
            System.out.println("Protocol: " + connection.getURL().getProtocol());
            System.out.println("Port: " + connection.getURL().getPort());
            
            // Read response
            int responseCode = connection.getResponseCode();
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(connection.getInputStream()));
            
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line).append("\\n");
            }
            
            reader.close();
            connection.disconnect();
            
            System.out.println("HTTP Response Code: " + responseCode);
            
        } catch (IOException e) {
            System.err.println("HTTP Request failed: " + e.getMessage());
        }
        
        return response.toString();
    }
    
    // HTTPS Client - Encrypted communication
    public static String makeHTTPSRequest(String urlString) {
        StringBuilder response = new StringBuilder();
        
        try {
            URL url = new URL(urlString);
            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
            
            // HTTPS configuration
            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", "Java HTTPS Client");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);
            
            System.out.println("Making HTTPS request to: " + urlString);
            System.out.println("Protocol: " + connection.getURL().getProtocol());
            System.out.println("Port: " + connection.getURL().getPort());
            
            // Display SSL certificate information
            displayCertificateInfo(connection);
            
            // Read response
            int responseCode = connection.getResponseCode();
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(connection.getInputStream()));
            
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line).append("\\n");
            }
            
            reader.close();
            connection.disconnect();
            
            System.out.println("HTTPS Response Code: " + responseCode);
            
        } catch (IOException e) {
            System.err.println("HTTPS Request failed: " + e.getMessage());
        }
        
        return response.toString();
    }
    
    // Display SSL certificate information
    private static void displayCertificateInfo(HttpsURLConnection connection) {
        try {
            // Get SSL session
            SSLSession session = connection.getSSLSession();
            
            System.out.println("\\n=== SSL Certificate Information ===");
            System.out.println("Cipher Suite: " + session.getCipherSuite());
            System.out.println("Protocol: " + session.getProtocol());
            
            // Get certificate chain
            X509Certificate[] certificates = (X509Certificate[]) session.getPeerCertificates();
            
            for (int i = 0; i < certificates.length; i++) {
                X509Certificate cert = certificates[i];
                System.out.println("\\nCertificate " + (i + 1) + ":");
                System.out.println("  Subject: " + cert.getSubjectDN());
                System.out.println("  Issuer: " + cert.getIssuerDN());
                System.out.println("  Serial: " + cert.getSerialNumber());
                System.out.println("  Valid From: " + cert.getNotBefore());
                System.out.println("  Valid To: " + cert.getNotAfter());
                System.out.println("  Algorithm: " + cert.getSigAlgName());
            }
            
        } catch (Exception e) {
            System.err.println("Error getting certificate info: " + e.getMessage());
        }
    }
    
    // Custom SSL context for testing
    public static void setupCustomSSLContext() {
        try {
            // Create trust manager that accepts all certificates (for testing only!)
            TrustManager[] trustAllCerts = new TrustManager[] {
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() { return null; }
                    public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                    public void checkServerTrusted(X509Certificate[] certs, String authType) {}
                }
            };
            
            // Install the all-trusting trust manager
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            
            // Create hostname verifier that accepts all hostnames (for testing only!)
            HostnameVerifier allHostsValid = new HostnameVerifier() {
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            };
            HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
            
            System.out.println("Custom SSL context configured (TESTING ONLY!)");
            
        } catch (Exception e) {
            System.err.println("SSL context setup failed: " + e.getMessage());
        }
    }
    
    // Compare HTTP vs HTTPS performance
    public static void performanceComparison(String httpUrl, String httpsUrl) {
        System.out.println("\\n=== Performance Comparison ===");
        
        // HTTP performance test
        long startTime = System.currentTimeMillis();
        makeHTTPRequest(httpUrl);
        long httpTime = System.currentTimeMillis() - startTime;
        
        // HTTPS performance test
        startTime = System.currentTimeMillis();
        makeHTTPSRequest(httpsUrl);
        long httpsTime = System.currentTimeMillis() - startTime;
        
        System.out.println("\\nPerformance Results:");
        System.out.println("HTTP Time: " + httpTime + "ms");
        System.out.println("HTTPS Time: " + httpsTime + "ms");
        System.out.println("Overhead: " + (httpsTime - httpTime) + "ms");
        System.out.println("Percentage: " + String.format("%.2f", 
            ((double)(httpsTime - httpTime) / httpTime) * 100) + "%");
    }
    
    public static void main(String[] args) {
        System.out.println("HTTP vs HTTPS Client Demo\\n");
        
        // Example URLs
        String httpUrl = "http://httpbin.org/get";
        String httpsUrl = "https://httpbin.org/get";
        
        try {
            // 1. HTTP Request
            System.out.println("1. Making HTTP Request...");
            String httpResponse = makeHTTPRequest(httpUrl);
            System.out.println("HTTP Response length: " + httpResponse.length());
            
            // 2. HTTPS Request
            System.out.println("\\n2. Making HTTPS Request...");
            String httpsResponse = makeHTTPSRequest(httpsUrl);
            System.out.println("HTTPS Response length: " + httpsResponse.length());
            
            // 3. Performance comparison
            performanceComparison(httpUrl, httpsUrl);
            
            // 4. Security demonstration
            System.out.println("\\n=== Security Comparison ===");
            System.out.println("HTTP: Data transmitted in plain text");
            System.out.println("HTTPS: Data encrypted with TLS");
            System.out.println("HTTP: Vulnerable to man-in-the-middle attacks");
            System.out.println("HTTPS: Protected by certificate validation");
            
        } catch (Exception e) {
            System.err.println("Demo failed: " + e.getMessage());
        }
    }
}`
    },
    
    {
      title: "SSL Certificate Validator",
      language: "python",
      code: `import ssl
import socket
import datetime
from urllib.parse import urlparse
import requests
from cryptography import x509
from cryptography.hazmat.backends import default_backend

class SSLCertificateValidator:
    
    def __init__(self):
        self.results = {}
    
    def validate_certificate(self, hostname, port=443):
        """Validate SSL certificate for a given hostname"""
        
        print(f"\\n=== Validating SSL Certificate for {hostname}:{port} ===")
        
        try:
            # Create SSL context
            context = ssl.create_default_context()
            
            # Connect and get certificate
            with socket.create_connection((hostname, port), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    # Get certificate in DER format
                    cert_der = ssock.getpeercert(binary_form=True)
                    cert_info = ssock.getpeercert()
                    
                    # Parse certificate with cryptography library
                    cert = x509.load_der_x509_certificate(cert_der, default_backend())
                    
                    # Perform validation checks
                    validation_results = {
                        'hostname': hostname,
                        'port': port,
                        'valid': True,
                        'errors': [],
                        'warnings': [],
                        'certificate_info': {}
                    }
                    
                    # Check 1: Certificate expiration
                    self._check_expiration(cert, validation_results)
                    
                    # Check 2: Hostname verification
                    self._check_hostname(cert, hostname, validation_results)
                    
                    # Check 3: Certificate chain
                    self._check_certificate_chain(ssock, validation_results)
                    
                    # Check 4: Signature algorithm
                    self._check_signature_algorithm(cert, validation_results)
                    
                    # Check 5: Key strength
                    self._check_key_strength(cert, validation_results)
                    
                    # Extract certificate information
                    self._extract_certificate_info(cert, cert_info, validation_results)
                    
                    # Display results
                    self._display_results(validation_results)
                    
                    return validation_results
                    
        except Exception as e:
            print(f"Certificate validation failed: {e}")
            return {'valid': False, 'error': str(e)}
    
    def _check_expiration(self, cert, results):
        """Check certificate expiration"""
        
        now = datetime.datetime.now()
        not_before = cert.not_valid_before
        not_after = cert.not_valid_after
        
        if now < not_before:
            results['valid'] = False
            results['errors'].append(f"Certificate not yet valid (valid from {not_before})")
        
        if now > not_after:
            results['valid'] = False
            results['errors'].append(f"Certificate expired on {not_after}")
        
        # Warning for certificates expiring soon (30 days)
        days_until_expiry = (not_after - now).days
        if days_until_expiry <= 30:
            results['warnings'].append(f"Certificate expires in {days_until_expiry} days")
        
        results['certificate_info']['not_before'] = not_before.isoformat()
        results['certificate_info']['not_after'] = not_after.isoformat()
        results['certificate_info']['days_until_expiry'] = days_until_expiry
    
    def _check_hostname(self, cert, hostname, results):
        """Check hostname verification"""
        
        try:
            # Get Subject Alternative Names (SAN)
            san_extension = cert.extensions.get_extension_for_oid(
                x509.oid.ExtensionOID.SUBJECT_ALTERNATIVE_NAME
            )
            san_names = [name.value for name in san_extension.value]
        except x509.ExtensionNotFound:
            san_names = []
        
        # Get Common Name from subject
        try:
            common_name = cert.subject.get_attributes_for_oid(
                x509.oid.NameOID.COMMON_NAME
            )[0].value
        except IndexError:
            common_name = None
        
        # Check if hostname matches
        hostname_match = False
        
        if hostname in san_names or hostname == common_name:
            hostname_match = True
        
        # Check wildcard matches
        for name in san_names + ([common_name] if common_name else []):
            if name and name.startswith('*.'):
                wildcard_domain = name[2:]  # Remove '*.'
                if hostname.endswith('.' + wildcard_domain) or hostname == wildcard_domain:
                    hostname_match = True
                    break
        
        if not hostname_match:
            results['valid'] = False
            results['errors'].append(f"Hostname {hostname} does not match certificate")
        
        results['certificate_info']['common_name'] = common_name
        results['certificate_info']['san_names'] = san_names
    
    def _check_certificate_chain(self, ssock, results):
        """Check certificate chain validation"""
        
        try:
            # Get peer certificate chain
            cert_chain = ssock.getpeercert_chain()
            
            if cert_chain:
                results['certificate_info']['chain_length'] = len(cert_chain)
                
                # Check if chain is complete (more than just server cert)
                if len(cert_chain) == 1:
                    results['warnings'].append("Certificate chain may be incomplete")
            else:
                results['warnings'].append("Could not retrieve certificate chain")
                
        except Exception as e:
            results['warnings'].append(f"Chain validation error: {e}")
    
    def _check_signature_algorithm(self, cert, results):
        """Check signature algorithm strength"""
        
        sig_algorithm = cert.signature_algorithm_oid._name
        
        # Check for weak algorithms
        weak_algorithms = ['sha1', 'md5', 'md2']
        
        if any(weak in sig_algorithm.lower() for weak in weak_algorithms):
            results['valid'] = False
            results['errors'].append(f"Weak signature algorithm: {sig_algorithm}")
        
        results['certificate_info']['signature_algorithm'] = sig_algorithm
    
    def _check_key_strength(self, cert, results):
        """Check public key strength"""
        
        public_key = cert.public_key()
        
        if hasattr(public_key, 'key_size'):
            key_size = public_key.key_size
            
            # RSA key size recommendations
            if key_size < 2048:
                results['valid'] = False
                results['errors'].append(f"Weak RSA key size: {key_size} bits")
            elif key_size < 4096:
                results['warnings'].append(f"RSA key size {key_size} bits is acceptable but 4096+ recommended")
            
            results['certificate_info']['key_size'] = key_size
            results['certificate_info']['key_type'] = type(public_key).__name__
    
    def _extract_certificate_info(self, cert, cert_info, results):
        """Extract detailed certificate information"""
        
        # Subject information
        subject_info = {}
        for attribute in cert.subject:
            subject_info[attribute.oid._name] = attribute.value
        
        # Issuer information
        issuer_info = {}
        for attribute in cert.issuer:
            issuer_info[attribute.oid._name] = attribute.value
        
        results['certificate_info'].update({
            'subject': subject_info,
            'issuer': issuer_info,
            'serial_number': str(cert.serial_number),
            'version': cert.version.name,
            'fingerprint_sha256': cert.fingerprint(x509.hashes.SHA256()).hex()
        })
    
    def _display_results(self, results):
        """Display validation results"""
        
        print(f"\\nValidation Results for {results['hostname']}:")
        print(f"Overall Status: {'✓ VALID' if results['valid'] else '✗ INVALID'}")
        
        if results['errors']:
            print("\\nErrors:")
            for error in results['errors']:
                print(f"  ✗ {error}")
        
        if results['warnings']:
            print("\\nWarnings:")
            for warning in results['warnings']:
                print(f"  ⚠ {warning}")
        
        cert_info = results['certificate_info']
        print(f"\\nCertificate Details:")
        print(f"  Subject: {cert_info.get('subject', {}).get('commonName', 'N/A')}")
        print(f"  Issuer: {cert_info.get('issuer', {}).get('commonName', 'N/A')}")
        print(f"  Valid From: {cert_info.get('not_before', 'N/A')}")
        print(f"  Valid To: {cert_info.get('not_after', 'N/A')}")
        print(f"  Days Until Expiry: {cert_info.get('days_until_expiry', 'N/A')}")
        print(f"  Key Type: {cert_info.get('key_type', 'N/A')}")
        print(f"  Key Size: {cert_info.get('key_size', 'N/A')} bits")
        print(f"  Signature Algorithm: {cert_info.get('signature_algorithm', 'N/A')}")
    
    def batch_validate(self, hostnames):
        """Validate multiple hostnames"""
        
        print("\\n=== Batch SSL Certificate Validation ===")
        
        results = {}
        
        for hostname in hostnames:
            try:
                results[hostname] = self.validate_certificate(hostname)
            except Exception as e:
                results[hostname] = {'valid': False, 'error': str(e)}
        
        # Summary
        print("\\n=== Validation Summary ===")
        valid_count = sum(1 for r in results.values() if r.get('valid', False))
        total_count = len(results)
        
        print(f"Valid Certificates: {valid_count}/{total_count}")
        
        for hostname, result in results.items():
            status = "✓" if result.get('valid', False) else "✗"
            print(f"  {status} {hostname}")
        
        return results

# Example usage
if __name__ == "__main__":
    validator = SSLCertificateValidator()
    
    # Test individual certificate
    validator.validate_certificate("www.google.com")
    
    # Test multiple certificates
    test_sites = [
        "www.github.com",
        "www.stackoverflow.com", 
        "www.mozilla.org",
        "expired.badssl.com",  # Intentionally expired
        "self-signed.badssl.com"  # Self-signed
    ]
    
    validator.batch_validate(test_sites)`
    }
  ],

  resources: [
    { type: 'video', title: 'HTTP vs HTTPS Explained', url: 'https://www.youtube.com/results?search_query=http+vs+https+explained', description: 'Video explanations of HTTP and HTTPS differences' },
    { type: 'article', title: 'SSL/TLS Handshake Process', url: 'https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/', description: 'Detailed explanation of TLS handshake process' },
    { type: 'documentation', title: 'Mozilla SSL Configuration Generator', url: 'https://ssl-config.mozilla.org/', description: 'Generate secure SSL configurations for web servers' },
    { type: 'tool', title: 'SSL Labs Server Test', url: 'https://www.ssllabs.com/ssltest/', description: 'Test SSL configuration of any website' },
    { type: 'article', title: 'HTTPS Best Practices', url: 'https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https', description: 'Google\'s guide to HTTPS implementation' }
  ],

  questions: [
    {
      question: "What are the main differences between HTTP and HTTPS?",
      answer: "Key differences: 1) Security - HTTP transmits data in plain text, HTTPS encrypts all communication using SSL/TLS, 2) Ports - HTTP uses port 80, HTTPS uses port 443, 3) Performance - HTTP is faster initially, HTTPS has SSL handshake overhead but minimal ongoing impact, 4) SEO - Search engines favor HTTPS sites, 5) Browser behavior - Modern browsers mark HTTP sites as 'Not Secure', 6) Authentication - HTTPS verifies server identity through certificates."
    },
    
    {
      question: "Explain the SSL/TLS handshake process step by step.",
      answer: "SSL/TLS Handshake steps: 1) Client Hello - client sends supported TLS versions and cipher suites, 2) Server Hello - server selects TLS version and cipher suite, 3) Certificate - server sends SSL certificate for authentication, 4) Key Exchange - client generates pre-master secret, encrypts with server's public key, 5) Session Keys - both parties derive session keys from pre-master secret, 6) Finished - both send encrypted 'finished' messages to confirm handshake completion. Result: secure encrypted channel established."
    },
    
    {
      question: "How does certificate validation work in HTTPS?",
      answer: "Certificate validation process: 1) Domain verification - certificate CN or SAN must match requested domain, 2) Expiration check - current date must be within certificate validity period, 3) Chain validation - certificate must be signed by trusted CA, verify chain to root CA, 4) Revocation check - verify certificate hasn't been revoked (CRL/OCSP), 5) Signature verification - validate certificate signatures using CA public keys. Browsers maintain trusted root CA stores for validation."
    },
    
    {
      question: "What is Perfect Forward Secrecy and why is it important?",
      answer: "Perfect Forward Secrecy (PFS) ensures that session keys cannot be compromised even if the server's private key is later compromised. Achieved through ephemeral key exchange (ECDHE/DHE) where temporary keys are generated for each session and discarded afterward. Benefits: 1) Past communications remain secure, 2) Each session has unique encryption keys, 3) Prevents retroactive decryption of captured traffic. Essential for long-term security as it protects historical communications."
    },
    
    {
      question: "What are the performance implications of HTTPS vs HTTP?",
      answer: "HTTPS performance considerations: 1) Initial overhead - SSL handshake adds 1-2 round trips (~100-200ms), 2) Encryption overhead - minimal CPU impact with modern hardware/algorithms, 3) Certificate validation - OCSP stapling reduces lookup time, 4) Session resumption - TLS session tickets eliminate handshake for returning clients, 5) HTTP/2 benefits - multiplexing and compression often make HTTPS faster than HTTP/1.1, 6) CDN optimization - edge termination reduces latency. Modern HTTPS performance impact is typically <5%."
    },
    
    {
      question: "What are the different types of SSL certificates?",
      answer: "SSL Certificate types: 1) Domain Validated (DV) - basic domain ownership verification, cheapest option, 2) Organization Validated (OV) - domain + organization verification, shows company name, 3) Extended Validation (EV) - highest validation level, green address bar (deprecated in modern browsers), 4) Wildcard - covers all subdomains (*.example.com), 5) Multi-Domain (SAN) - covers multiple different domains in one certificate, 6) Self-signed - not trusted by browsers, used for testing/internal systems."
    },
    
    {
      question: "How do you implement HTTPS security headers?",
      answer: "Essential HTTPS security headers: 1) Strict-Transport-Security (HSTS) - forces HTTPS for future requests, prevents downgrade attacks, 2) Content-Security-Policy - prevents XSS by controlling resource sources, 3) X-Frame-Options - prevents clickjacking attacks, 4) X-Content-Type-Options - prevents MIME sniffing, 5) Referrer-Policy - controls referrer information leakage. Implementation: configure web server (Apache/Nginx) or application code to send these headers with every HTTPS response."
    },
    
    {
      question: "What is HSTS and how does it improve security?",
      answer: "HTTP Strict Transport Security (HSTS) forces browsers to use HTTPS for all future requests to a domain. Header: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'. Benefits: 1) Prevents protocol downgrade attacks, 2) Eliminates mixed content issues, 3) Protects against SSL stripping attacks, 4) Improves performance by skipping HTTP redirects. Preload list allows browsers to enforce HSTS even on first visit. Max-age defines how long browsers remember the policy."
    },
    
    {
      question: "How does HTTP/2 relate to HTTPS?",
      answer: "HTTP/2 and HTTPS relationship: 1) Most browsers require HTTPS for HTTP/2, 2) HTTP/2 provides multiplexing - multiple requests over single connection, 3) Server push - server can send resources before client requests, 4) Header compression - reduces overhead, 5) Binary protocol - more efficient than HTTP/1.1 text, 6) Performance benefits often make HTTPS with HTTP/2 faster than plain HTTP/1.1. HTTPS is essentially mandatory for modern web performance optimization."
    },
    
    {
      question: "What are common SSL/TLS vulnerabilities and how to prevent them?",
      answer: "Common SSL/TLS vulnerabilities: 1) Weak ciphers - disable RC4, DES, export ciphers, 2) Protocol downgrade - disable SSLv3, TLS 1.0/1.1, 3) Certificate validation bypass - implement proper hostname verification, 4) Mixed content - ensure all resources load over HTTPS, 5) Weak key exchange - use ECDHE/DHE for forward secrecy, 6) Certificate pinning bypass - implement certificate/public key pinning for mobile apps. Prevention: use modern TLS 1.2/1.3, strong cipher suites, regular security audits."
    }
  ]
};