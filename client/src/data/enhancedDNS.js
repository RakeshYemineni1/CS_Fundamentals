export const enhancedDNS = {
  id: 'dns-working',
  title: 'DNS and Its Working',
  subtitle: 'Domain Name System - Internet\'s Phone Book',
  summary: 'DNS translates human-readable domain names into IP addresses through a hierarchical distributed database system, enabling users to access websites using memorable names instead of numeric addresses.',
  analogy: 'Like a phone book that translates names to phone numbers, DNS translates domain names (google.com) to IP addresses (172.217.164.110) so computers can find each other on the internet.',
  visualConcept: 'Picture a tree-like hierarchy starting from root servers, branching to TLD servers (.com, .org), then to authoritative servers for specific domains, with caching at every level.',
  realWorldUse: 'Every internet activity - web browsing, email, file transfers, video streaming, mobile apps, IoT devices, and any network communication requiring domain resolution.',
  explanation: `DNS (Domain Name System) Working:

DNS is a hierarchical distributed database that translates human-readable domain names into machine-readable IP addresses. It operates through a tree-like structure with root servers at the top, followed by Top-Level Domain (TLD) servers, and authoritative name servers for specific domains.

The resolution process involves recursive queries from clients to resolvers, which then make iterative queries through the DNS hierarchy. Caching at multiple levels improves performance and reduces load on authoritative servers.

DNS uses UDP port 53 for queries and TCP port 53 for zone transfers. It supports various record types (A, AAAA, CNAME, MX, etc.) and includes security extensions (DNSSEC) to prevent spoofing and ensure data integrity.`,

  keyPoints: [
    'DNS translates domain names to IP addresses',
    'Hierarchical structure: Root → TLD → Authoritative servers',
    'Recursive and iterative query resolution methods',
    'Caching improves performance and reduces server load',
    'Multiple record types serve different purposes',
    'Uses UDP port 53 for queries, TCP for zone transfers',
    'DNSSEC provides security against spoofing attacks',
    'TTL (Time To Live) controls cache duration',
    'Load balancing possible through multiple A records',
    'Reverse DNS maps IP addresses back to domain names'
  ],

  codeExamples: [
    {
      title: "DNS Resolution Process",
      content: `
        <h3>Complete DNS Resolution Flow</h3>
        <p>Step-by-step process of how DNS resolves domain names to IP addresses.</p>
        
        <div class="code-block">
          <h4>DNS Resolution Steps</h4>
          <pre><code>User types: www.example.com in browser

Step 1: Browser Cache Check
- Browser checks its DNS cache
- If found and not expired, use cached IP
- If not found, proceed to Step 2

Step 2: Operating System Cache
- OS checks its DNS cache (/etc/hosts, system cache)
- If found and valid, return IP address
- If not found, proceed to Step 3

Step 3: Router Cache
- Router checks its DNS cache
- If found and valid, return IP address
- If not found, proceed to Step 4

Step 4: ISP DNS Resolver (Recursive Query)
- Query sent to ISP's DNS resolver (e.g., 8.8.8.8)
- Resolver checks its cache first
- If not cached, resolver starts iterative queries

Step 5: Root Name Server Query
Resolver → Root Server: "Where is .com?"
Root Server → Resolver: "Ask TLD server at 192.5.6.30"

Step 6: TLD Server Query  
Resolver → .com TLD Server: "Where is example.com?"
TLD Server → Resolver: "Ask authoritative server at 93.184.216.34"

Step 7: Authoritative Server Query
Resolver → example.com NS: "What is www.example.com?"
Authoritative → Resolver: "www.example.com is 93.184.216.34"

Step 8: Response Chain
Resolver → ISP Cache (stores for TTL period)
ISP → Router Cache (stores for TTL period)  
Router → OS Cache (stores for TTL period)
OS → Browser Cache (stores for TTL period)
Browser → User: Connects to 93.184.216.34</code></pre>
        </div>

        <h4>DNS Hierarchy Structure:</h4>
        
        <div class="code-block">
          <h4>DNS Tree Structure</h4>
          <pre><code>Root (.)
├── com.
│   ├── google.com.
│   │   ├── www.google.com.
│   │   ├── mail.google.com.
│   │   └── drive.google.com.
│   ├── example.com.
│   └── amazon.com.
├── org.
│   ├── wikipedia.org.
│   └── mozilla.org.
├── net.
├── edu.
└── country codes (ccTLD)
    ├── uk.
    ├── de.
    └── jp.

Root Servers (13 worldwide):
a.root-servers.net (198.41.0.4)
b.root-servers.net (199.9.14.201)
c.root-servers.net (192.33.4.12)
... (j through m)

Each level delegates authority to the next level down.</code></pre>
        </div>

        <h4>Query Types:</h4>
        <ul>
          <li><strong>Recursive Query:</strong> Client asks resolver to get complete answer</li>
          <li><strong>Iterative Query:</strong> Server provides best answer it knows or referral</li>
          <li><strong>Non-recursive Query:</strong> Query for cached data only</li>
        </ul>
      `
    },
    
    {
      title: "DNS Record Types",
      content: `
        <h3>Common DNS Record Types</h3>
        <p>Different types of DNS records serve various purposes in the domain name system.</p>
        
        <div class="code-block">
          <h4>Primary Record Types</h4>
          <pre><code>A Record (Address):
Maps domain name to IPv4 address
example.com.    3600    IN    A    93.184.216.34
www.example.com. 3600   IN    A    93.184.216.34

AAAA Record (IPv6 Address):
Maps domain name to IPv6 address  
example.com.    3600    IN    AAAA    2606:2800:220:1:248:1893:25c8:1946

CNAME Record (Canonical Name):
Creates alias pointing to another domain
www.example.com. 3600   IN    CNAME    example.com.
blog.example.com. 3600  IN    CNAME    example.com.

MX Record (Mail Exchange):
Specifies mail servers for domain
example.com.    3600    IN    MX    10 mail.example.com.
example.com.    3600    IN    MX    20 mail2.example.com.
(Lower priority number = higher priority)

NS Record (Name Server):
Delegates subdomain to other name servers
example.com.    3600    IN    NS    ns1.example.com.
example.com.    3600    IN    NS    ns2.example.com.

PTR Record (Pointer):
Reverse DNS - maps IP to domain name
34.216.184.93.in-addr.arpa. 3600 IN PTR example.com.

TXT Record (Text):
Stores arbitrary text data
example.com.    3600    IN    TXT    "v=spf1 include:_spf.google.com ~all"
_dmarc.example.com. 3600 IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com"</code></pre>
        </div>

        <div class="code-block">
          <h4>Advanced Record Types</h4>
          <pre><code>SRV Record (Service):
Specifies location of services
_http._tcp.example.com. 3600 IN SRV 10 60 80 server.example.com.
_sip._tcp.example.com.  3600 IN SRV 10 60 5060 sip.example.com.
Format: priority weight port target

SOA Record (Start of Authority):
Contains administrative information about zone
example.com. 3600 IN SOA ns1.example.com. admin.example.com. (
    2024011501  ; Serial number
    3600        ; Refresh interval
    1800        ; Retry interval  
    604800      ; Expire time
    86400       ; Minimum TTL
)

CAA Record (Certification Authority Authorization):
Specifies which CAs can issue certificates
example.com.    3600    IN    CAA    0 issue "letsencrypt.org"
example.com.    3600    IN    CAA    0 issuewild ";"

DNSKEY Record (DNS Key):
Contains public key for DNSSEC
example.com.    3600    IN    DNSKEY    256 3 8 AwEAAb...

DS Record (Delegation Signer):
Links parent zone to child zone in DNSSEC
example.com.    3600    IN    DS    12345 8 2 A1B2C3...</code></pre>
        </div>

        <h4>Record Format Components:</h4>
        <ul>
          <li><strong>Name:</strong> Domain name (FQDN)</li>
          <li><strong>TTL:</strong> Time To Live in seconds</li>
          <li><strong>Class:</strong> Usually IN (Internet)</li>
          <li><strong>Type:</strong> Record type (A, AAAA, CNAME, etc.)</li>
          <li><strong>Data:</strong> Record-specific data</li>
        </ul>
      `
    },
    
    {
      title: "DNS Caching and TTL",
      content: `
        <h3>DNS Caching Mechanism</h3>
        <p>Caching improves DNS performance by storing query results at multiple levels.</p>
        
        <div class="code-block">
          <h4>Caching Levels</h4>
          <pre><code>1. Browser Cache:
   - Stores DNS results for active tabs
   - Typical TTL: 60 seconds to 10 minutes
   - Cleared when browser restarts
   - chrome://net-internals/#dns to view

2. Operating System Cache:
   - System-level DNS cache
   - Windows: ipconfig /displaydns, /flushdns
   - Linux: systemd-resolved, nscd
   - macOS: dscacheutil -q host -a name example.com

3. Router Cache:
   - Home/office router caches DNS queries
   - Shared among all devices on network
   - Reduces queries to ISP DNS servers
   - TTL typically respects original record TTL

4. ISP DNS Resolver Cache:
   - Large-scale caching for all customers
   - Significant performance improvement
   - May cache for longer than TTL in some cases
   - Examples: 8.8.8.8 (Google), 1.1.1.1 (Cloudflare)

5. Authoritative Server Cache:
   - Caches zone data in memory
   - Fastest response for authoritative queries
   - Updated when zone files change</code></pre>
        </div>

        <div class="code-block">
          <h4>TTL (Time To Live) Examples</h4>
          <pre><code>Short TTL (60-300 seconds):
- Used for load balancing
- Frequent IP changes
- Maintenance windows
- A/B testing scenarios

example.com.    60    IN    A    192.168.1.10
example.com.    60    IN    A    192.168.1.11
example.com.    60    IN    A    192.168.1.12

Medium TTL (1800-3600 seconds):
- Standard web services
- Balance between performance and flexibility
- Most common configuration

www.example.com. 3600  IN    A    93.184.216.34

Long TTL (86400+ seconds):
- Stable infrastructure
- Rarely changing services
- Maximum caching benefit

ns1.example.com. 86400 IN    A    198.51.100.10

TTL Impact on Changes:
Old Record: example.com. 3600 IN A 1.2.3.4
New Record: example.com. 3600 IN A 5.6.7.8

Propagation time = TTL of old record
Users may see old IP for up to 3600 seconds (1 hour)</code></pre>
        </div>

        <h4>Cache Poisoning Prevention:</h4>
        <ul>
          <li>Query ID randomization</li>
          <li>Source port randomization</li>
          <li>DNSSEC validation</li>
          <li>Response validation checks</li>
        </ul>

        <div class="code-block">
          <h4>Cache Management Commands</h4>
          <pre><code>Windows:
ipconfig /displaydns          # View DNS cache
ipconfig /flushdns            # Clear DNS cache
nslookup example.com          # Query DNS

Linux:
systemctl flush-dns           # Flush systemd-resolved cache
sudo systemctl restart nscd   # Restart nscd cache
dig example.com               # Query DNS with details
host example.com              # Simple DNS lookup

macOS:
sudo dscacheutil -flushcache  # Flush DNS cache
dscacheutil -q host -a name example.com  # Query cache
dig example.com               # Detailed DNS query

Browser:
Chrome: chrome://net-internals/#dns → Clear host cache
Firefox: about:networking#dns → Clear DNS cache</code></pre>
        </div>
      `
    },
    
    {
      title: "DNS Security (DNSSEC)",
      content: `
        <h3>DNS Security Extensions (DNSSEC)</h3>
        <p>DNSSEC provides authentication and data integrity for DNS responses.</p>
        
        <div class="code-block">
          <h4>DNSSEC Overview</h4>
          <pre><code>Problems DNSSEC Solves:
1. DNS Spoofing/Cache Poisoning
   - Attacker injects false DNS records
   - Users redirected to malicious sites
   - Man-in-the-middle attacks

2. Data Integrity
   - Ensures DNS responses haven't been modified
   - Validates data comes from authoritative source
   - Prevents tampering during transmission

3. Authentication
   - Verifies identity of DNS servers
   - Establishes chain of trust from root
   - Prevents impersonation attacks

DNSSEC Components:
- Digital signatures for DNS records
- Public key cryptography
- Chain of trust from root to leaf
- New record types: DNSKEY, DS, RRSIG, NSEC</code></pre>
        </div>

        <div class="code-block">
          <h4>DNSSEC Record Types</h4>
          <pre><code>DNSKEY Record:
Contains public key for zone
example.com. 3600 IN DNSKEY 256 3 8 AwEAAcXYn9...
Flags: 256 (Zone Signing Key) or 257 (Key Signing Key)

DS Record (Delegation Signer):
Links parent zone to child zone
example.com. 3600 IN DS 12345 8 2 A1B2C3D4E5F6...
Format: Key Tag, Algorithm, Digest Type, Digest

RRSIG Record (Resource Record Signature):
Digital signature for DNS records
example.com. 3600 IN RRSIG A 8 2 3600 20240201000000 20240101000000 12345 example.com. signature...

NSEC Record (Next Secure):
Proves non-existence of records
example.com. 3600 IN NSEC mail.example.com. A NS SOA MX RRSIG NSEC DNSKEY

NSEC3 Record:
Hashed version of NSEC for privacy
example.com. 3600 IN NSEC3 1 0 10 AABBCCDD hash... A NS SOA RRSIG DNSKEY NSEC3PARAM</code></pre>
        </div>

        <div class="code-block">
          <h4>DNSSEC Validation Process</h4>
          <pre><code>1. Trust Anchor:
   - Root zone public key pre-configured in resolver
   - Starting point for chain of trust
   - Distributed through secure channels

2. Chain of Trust:
   Root Zone → .com Zone → example.com Zone

   Root DNSKEY validates .com DS record
   .com DNSKEY validates example.com DS record  
   example.com DNSKEY validates A record signature

3. Signature Validation:
   Query: www.example.com A
   
   Response includes:
   - A record: www.example.com. 3600 IN A 93.184.216.34
   - RRSIG: Digital signature of A record
   - DNSKEY: Public key to verify signature
   
   Resolver:
   - Verifies RRSIG using DNSKEY
   - Validates DNSKEY using parent DS record
   - Follows chain up to trusted root

4. Validation Results:
   - Secure: Valid signature chain
   - Insecure: No DNSSEC signatures (allowed)
   - Bogus: Invalid signatures (rejected)</code></pre>
        </div>

        <h4>DNSSEC Benefits:</h4>
        <ul>
          <li>Prevents DNS cache poisoning attacks</li>
          <li>Ensures data integrity and authenticity</li>
          <li>Protects against man-in-the-middle attacks</li>
          <li>Enables secure applications (DANE, SSHFP)</li>
        </ul>

        <h4>DNSSEC Limitations:</h4>
        <ul>
          <li>Doesn't provide confidentiality (encryption)</li>
          <li>Increases DNS response size</li>
          <li>Complex key management</li>
          <li>Not universally deployed</li>
        </ul>
      `
    },
    
    {
      title: "DNS Performance and Optimization",
      content: `
        <h3>DNS Performance Optimization</h3>
        <p>Techniques to improve DNS resolution speed and reliability.</p>
        
        <div class="code-block">
          <h4>DNS Performance Factors</h4>
          <pre><code>1. Resolver Selection:
   Public DNS Resolvers (Global):
   - Google: 8.8.8.8, 8.8.4.4
   - Cloudflare: 1.1.1.1, 1.0.0.1  
   - Quad9: 9.9.9.9, 149.112.112.112
   - OpenDNS: 208.67.222.222, 208.67.220.220

   Performance Comparison:
   Resolver      | Avg Response | Global Locations | Features
   --------------|--------------|------------------|----------
   Cloudflare    | 14ms        | 200+             | Privacy, DoH/DoT
   Google        | 16ms        | 100+             | Reliability, IPv6
   Quad9         | 18ms        | 50+              | Security filtering
   OpenDNS       | 20ms        | 25+              | Content filtering

2. Geographic Proximity:
   - Use resolvers with nearby servers
   - Anycast routing to closest server
   - Regional performance varies

3. Caching Strategy:
   - Longer TTL for stable records
   - Shorter TTL for load balancing
   - Pre-warming critical records</code></pre>
        </div>

        <div class="code-block">
          <h4>DNS Optimization Techniques</h4>
          <pre><code>1. DNS Prefetching:
   HTML: <link rel="dns-prefetch" href="//cdn.example.com">
   
   Preloads DNS resolution for external resources
   Reduces latency for subsequent requests
   
2. Connection Reuse:
   - HTTP/2 multiplexing reduces DNS lookups
   - Domain sharding vs connection reuse trade-off
   - Fewer domains = fewer DNS lookups

3. CDN Integration:
   - CDN handles DNS resolution
   - Geographic distribution
   - Automatic failover

4. Load Balancing with DNS:
   Multiple A records for same domain:
   example.com. 300 IN A 192.168.1.10
   example.com. 300 IN A 192.168.1.11  
   example.com. 300 IN A 192.168.1.12
   
   Round-robin distribution
   Health check integration
   Geographic routing

5. Monitoring and Alerting:
   - DNS resolution time monitoring
   - Availability checks from multiple locations
   - TTL and propagation monitoring
   - DNSSEC validation monitoring</code></pre>
        </div>

        <div class="code-block">
          <h4>DNS over HTTPS (DoH) and DNS over TLS (DoT)</h4>
          <pre><code>Traditional DNS (Port 53, Unencrypted):
Client → DNS Resolver: example.com A?
DNS Resolver → Client: example.com A 93.184.216.34

Problems:
- Queries visible to ISPs and network operators
- Susceptible to eavesdropping and manipulation
- No authentication of resolver

DNS over HTTPS (DoH):
- Encrypts DNS queries using HTTPS
- Uses port 443 (same as web traffic)
- Harder to block or monitor
- Supported by major browsers

DoH Query Example:
GET https://1.1.1.1/dns-query?name=example.com&type=A
Accept: application/dns-json

Response:
{
  "Status": 0,
  "TC": false,
  "RD": true,
  "RA": true,
  "AD": false,
  "CD": false,
  "Question": [{"name": "example.com", "type": 1}],
  "Answer": [{"name": "example.com", "type": 1, "TTL": 3600, "data": "93.184.216.34"}]
}

DNS over TLS (DoT):
- Encrypts DNS queries using TLS
- Uses port 853
- Dedicated port makes it easier to identify/block
- Lower overhead than DoH

Configuration Examples:
Cloudflare DoH: https://1.1.1.1/dns-query
Google DoH: https://8.8.8.8/dns-query
Quad9 DoT: 9.9.9.9:853</code></pre>
        </div>

        <h4>Performance Best Practices:</h4>
        <ul>
          <li>Use multiple DNS servers for redundancy</li>
          <li>Implement DNS health checks and failover</li>
          <li>Monitor DNS resolution times globally</li>
          <li>Use appropriate TTL values for different record types</li>
          <li>Consider DNS-based load balancing for high availability</li>
          <li>Implement DNSSEC for security without sacrificing performance</li>
        </ul>
      `
    }
  ],

  codeExamples: [
    {
      title: "DNS Resolver Implementation",
      language: "python",
      code: `import socket
import struct
import random
import time
from typing import List, Dict, Tuple, Optional

class DNSResolver:
    def __init__(self, dns_servers: List[str] = None):
        self.dns_servers = dns_servers or [
            '8.8.8.8',      # Google
            '1.1.1.1',      # Cloudflare
            '9.9.9.9',      # Quad9
        ]
        self.cache = {}
        self.timeout = 5
    
    def resolve(self, domain: str, record_type: str = 'A') -> Dict:
        """Resolve domain name to IP address"""
        
        # Check cache first
        cache_key = f"{domain}:{record_type}"
        if cache_key in self.cache:
            cached_result, timestamp, ttl = self.cache[cache_key]
            if time.time() - timestamp < ttl:
                print(f"Cache hit for {domain}")
                return cached_result
            else:
                del self.cache[cache_key]
        
        # Try each DNS server
        for dns_server in self.dns_servers:
            try:
                result = self._query_dns_server(domain, record_type, dns_server)
                
                # Cache the result
                if result and 'answers' in result:
                    ttl = result.get('ttl', 300)  # Default 5 minutes
                    self.cache[cache_key] = (result, time.time(), ttl)
                
                return result
                
            except Exception as e:
                print(f"DNS query failed for {dns_server}: {e}")
                continue
        
        raise Exception(f"All DNS servers failed for {domain}")
    
    def _query_dns_server(self, domain: str, record_type: str, dns_server: str) -> Dict:
        """Send DNS query to specific server"""
        
        # Create DNS query packet
        query_packet = self._build_dns_query(domain, record_type)
        
        # Send query via UDP
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.settimeout(self.timeout)
        
        try:
            sock.sendto(query_packet, (dns_server, 53))
            response_data, _ = sock.recvfrom(512)
            
            # Parse response
            result = self._parse_dns_response(response_data)
            result['server'] = dns_server
            
            return result
            
        finally:
            sock.close()
    
    def _build_dns_query(self, domain: str, record_type: str) -> bytes:
        """Build DNS query packet"""
        
        # DNS Header (12 bytes)
        query_id = random.randint(0, 65535)
        flags = 0x0100  # Standard query with recursion desired
        questions = 1
        answer_rrs = 0
        authority_rrs = 0
        additional_rrs = 0
        
        header = struct.pack('!HHHHHH', 
                           query_id, flags, questions, 
                           answer_rrs, authority_rrs, additional_rrs)
        
        # Question section
        question = self._encode_domain_name(domain)
        
        # Record type mapping
        type_map = {
            'A': 1, 'NS': 2, 'CNAME': 5, 'MX': 15, 
            'TXT': 16, 'AAAA': 28, 'SRV': 33
        }
        qtype = type_map.get(record_type.upper(), 1)
        qclass = 1  # IN (Internet)
        
        question += struct.pack('!HH', qtype, qclass)
        
        return header + question
    
    def _encode_domain_name(self, domain: str) -> bytes:
        """Encode domain name for DNS packet"""
        encoded = b''
        
        for part in domain.split('.'):
            if part:
                encoded += bytes([len(part)]) + part.encode('ascii')
        
        encoded += b'\\x00'  # Null terminator
        return encoded
    
    def _parse_dns_response(self, data: bytes) -> Dict:
        """Parse DNS response packet"""
        
        # Parse header
        header = struct.unpack('!HHHHHH', data[:12])
        query_id, flags, questions, answers, authority, additional = header
        
        # Check for errors
        rcode = flags & 0x000F
        if rcode != 0:
            error_codes = {
                1: 'Format error',
                2: 'Server failure', 
                3: 'Name error (domain not found)',
                4: 'Not implemented',
                5: 'Refused'
            }
            raise Exception(f"DNS error: {error_codes.get(rcode, f'Unknown error {rcode}')}")
        
        result = {
            'id': query_id,
            'flags': flags,
            'questions': questions,
            'answers': answers,
            'authority': authority,
            'additional': additional,
            'answer_records': []
        }
        
        # Skip question section (we know what we asked)
        offset = 12
        offset = self._skip_question_section(data, offset, questions)
        
        # Parse answer section
        for _ in range(answers):
            record, offset = self._parse_resource_record(data, offset)
            result['answer_records'].append(record)
            
            # Set TTL from first answer record
            if 'ttl' not in result:
                result['ttl'] = record.get('ttl', 300)
        
        return result
    
    def _skip_question_section(self, data: bytes, offset: int, count: int) -> int:
        """Skip question section in DNS response"""
        
        for _ in range(count):
            # Skip domain name
            while offset < len(data) and data[offset] != 0:
                if data[offset] & 0xC0 == 0xC0:  # Compression
                    offset += 2
                    break
                else:
                    offset += data[offset] + 1
            else:
                offset += 1  # Skip null terminator
            
            offset += 4  # Skip QTYPE and QCLASS
        
        return offset
    
    def _parse_resource_record(self, data: bytes, offset: int) -> Tuple[Dict, int]:
        """Parse a resource record from DNS response"""
        
        # Skip name (use compression if present)
        name_offset = offset
        while offset < len(data) and data[offset] != 0:
            if data[offset] & 0xC0 == 0xC0:  # Compression
                offset += 2
                break
            else:
                offset += data[offset] + 1
        else:
            offset += 1
        
        # Parse TYPE, CLASS, TTL, RDLENGTH
        rr_type, rr_class, ttl, rdlength = struct.unpack('!HHIH', data[offset:offset+10])
        offset += 10
        
        # Parse RDATA based on type
        rdata = data[offset:offset+rdlength]
        
        record = {
            'type': rr_type,
            'class': rr_class,
            'ttl': ttl,
            'rdlength': rdlength
        }
        
        # Parse specific record types
        if rr_type == 1:  # A record
            if rdlength == 4:
                ip = '.'.join(str(b) for b in rdata)
                record['data'] = ip
        elif rr_type == 28:  # AAAA record
            if rdlength == 16:
                # IPv6 address
                ipv6_parts = []
                for i in range(0, 16, 2):
                    part = struct.unpack('!H', rdata[i:i+2])[0]
                    ipv6_parts.append(f'{part:x}')
                record['data'] = ':'.join(ipv6_parts)
        elif rr_type == 5:  # CNAME record
            record['data'] = self._parse_domain_name(data, offset)
        else:
            record['data'] = rdata.hex()
        
        return record, offset + rdlength
    
    def _parse_domain_name(self, data: bytes, offset: int) -> str:
        """Parse domain name with compression support"""
        parts = []
        jumped = False
        original_offset = offset
        
        while True:
            if offset >= len(data):
                break
                
            length = data[offset]
            
            if length == 0:
                offset += 1
                break
            elif length & 0xC0 == 0xC0:  # Compression
                if not jumped:
                    original_offset = offset + 2
                pointer = ((length & 0x3F) << 8) | data[offset + 1]
                offset = pointer
                jumped = True
            else:
                offset += 1
                if offset + length <= len(data):
                    parts.append(data[offset:offset + length].decode('ascii'))
                    offset += length
                else:
                    break
        
        return '.'.join(parts)
    
    def bulk_resolve(self, domains: List[str]) -> Dict[str, Dict]:
        """Resolve multiple domains"""
        results = {}
        
        for domain in domains:
            try:
                result = self.resolve(domain)
                results[domain] = result
            except Exception as e:
                results[domain] = {'error': str(e)}
        
        return results
    
    def get_cache_stats(self) -> Dict:
        """Get cache statistics"""
        total_entries = len(self.cache)
        expired_entries = 0
        
        current_time = time.time()
        for _, (_, timestamp, ttl) in self.cache.items():
            if current_time - timestamp >= ttl:
                expired_entries += 1
        
        return {
            'total_entries': total_entries,
            'expired_entries': expired_entries,
            'active_entries': total_entries - expired_entries
        }
    
    def clear_cache(self):
        """Clear DNS cache"""
        self.cache.clear()

# Example usage and testing
if __name__ == "__main__":
    resolver = DNSResolver()
    
    print("DNS Resolver Demo\\n")
    
    # Test domains
    test_domains = [
        'google.com',
        'github.com',
        'stackoverflow.com',
        'nonexistent-domain-12345.com'
    ]
    
    # Single domain resolution
    print("1. Single Domain Resolution:")
    try:
        result = resolver.resolve('google.com', 'A')
        print(f"google.com resolved to:")
        for record in result['answer_records']:
            if record.get('data'):
                print(f"  {record['data']} (TTL: {record['ttl']})")
    except Exception as e:
        print(f"Resolution failed: {e}")
    
    print("\\n2. Bulk Domain Resolution:")
    results = resolver.bulk_resolve(test_domains)
    
    for domain, result in results.items():
        if 'error' in result:
            print(f"{domain}: ERROR - {result['error']}")
        else:
            ips = [r['data'] for r in result['answer_records'] if r.get('data')]
            print(f"{domain}: {', '.join(ips)}")
    
    print("\\n3. Cache Statistics:")
    cache_stats = resolver.get_cache_stats()
    print(f"Cache entries: {cache_stats['active_entries']} active, {cache_stats['expired_entries']} expired")
    
    print("\\n4. Testing Cache (resolve google.com again):")
    try:
        result = resolver.resolve('google.com', 'A')
        print("Second resolution completed (should be from cache)")
    except Exception as e:
        print(f"Cache test failed: {e}")`
    },
    
    {
      title: "DNS Zone File Manager",
      language: "java",
      code: `import java.io.*;
import java.util.*;
import java.util.regex.Pattern;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DNSZoneManager {
    
    private String zoneName;
    private Map<String, List<DNSRecord>> records;
    private SOARecord soaRecord;
    
    public DNSZoneManager(String zoneName) {
        this.zoneName = zoneName;
        this.records = new HashMap<>();
        initializeDefaultRecords();
    }
    
    // DNS Record classes
    public static class DNSRecord {
        protected String name;
        protected int ttl;
        protected String recordClass;
        protected String type;
        protected String data;
        
        public DNSRecord(String name, int ttl, String recordClass, String type, String data) {
            this.name = name;
            this.ttl = ttl;
            this.recordClass = recordClass;
            this.type = type;
            this.data = data;
        }
        
        public String toZoneFormat() {
            return String.format("%-30s %d\\t%s\\t%s\\t%s", 
                name, ttl, recordClass, type, data);
        }
        
        // Getters
        public String getName() { return name; }
        public int getTTL() { return ttl; }
        public String getType() { return type; }
        public String getData() { return data; }
    }
    
    public static class ARecord extends DNSRecord {
        public ARecord(String name, int ttl, String ipAddress) {
            super(name, ttl, "IN", "A", ipAddress);
            validateIPv4(ipAddress);
        }
        
        private void validateIPv4(String ip) {
            String ipPattern = "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$";
            if (!Pattern.matches(ipPattern, ip)) {
                throw new IllegalArgumentException("Invalid IPv4 address: " + ip);
            }
        }
    }
    
    public static class AAAARecord extends DNSRecord {
        public AAAARecord(String name, int ttl, String ipv6Address) {
            super(name, ttl, "IN", "AAAA", ipv6Address);
            validateIPv6(ipv6Address);
        }
        
        private void validateIPv6(String ipv6) {
            // Simplified IPv6 validation
            if (!ipv6.contains(":")) {
                throw new IllegalArgumentException("Invalid IPv6 address: " + ipv6);
            }
        }
    }
    
    public static class CNAMERecord extends DNSRecord {
        public CNAMERecord(String name, int ttl, String target) {
            super(name, ttl, "IN", "CNAME", target);
        }
    }
    
    public static class MXRecord extends DNSRecord {
        private int priority;
        
        public MXRecord(String name, int ttl, int priority, String mailServer) {
            super(name, ttl, "IN", "MX", priority + " " + mailServer);
            this.priority = priority;
        }
        
        public int getPriority() { return priority; }
    }
    
    public static class TXTRecord extends DNSRecord {
        public TXTRecord(String name, int ttl, String text) {
            super(name, ttl, "IN", "TXT", "\\"" + text + "\\"");
        }
    }
    
    public static class NSRecord extends DNSRecord {
        public NSRecord(String name, int ttl, String nameServer) {
            super(name, ttl, "IN", "NS", nameServer);
        }
    }
    
    public static class SOARecord extends DNSRecord {
        private String primaryNS;
        private String adminEmail;
        private long serial;
        private int refresh;
        private int retry;
        private int expire;
        private int minimum;
        
        public SOARecord(String name, int ttl, String primaryNS, String adminEmail,
                        long serial, int refresh, int retry, int expire, int minimum) {
            super(name, ttl, "IN", "SOA", "");
            this.primaryNS = primaryNS;
            this.adminEmail = adminEmail;
            this.serial = serial;
            this.refresh = refresh;
            this.retry = retry;
            this.expire = expire;
            this.minimum = minimum;
            
            this.data = String.format("%s %s (%n\\t\\t\\t\\t%d\\t; Serial%n\\t\\t\\t\\t%d\\t; Refresh%n\\t\\t\\t\\t%d\\t; Retry%n\\t\\t\\t\\t%d\\t; Expire%n\\t\\t\\t\\t%d )\\t; Minimum",
                primaryNS, adminEmail, serial, refresh, retry, expire, minimum);
        }
        
        @Override
        public String toZoneFormat() {
            return String.format("%-30s %d\\t%s\\t%s\\t%s %s (%n\\t\\t\\t\\t\\t\\t\\t%d\\t; Serial%n\\t\\t\\t\\t\\t\\t\\t%d\\t; Refresh%n\\t\\t\\t\\t\\t\\t\\t%d\\t; Retry%n\\t\\t\\t\\t\\t\\t\\t%d\\t; Expire%n\\t\\t\\t\\t\\t\\t\\t%d )\\t; Minimum",
                name, ttl, recordClass, type, primaryNS, adminEmail, serial, refresh, retry, expire, minimum);
        }
        
        public void incrementSerial() {
            this.serial++;
            updateData();
        }
        
        private void updateData() {
            this.data = String.format("%s %s (%n\\t\\t\\t\\t%d\\t; Serial%n\\t\\t\\t\\t%d\\t; Refresh%n\\t\\t\\t\\t%d\\t; Retry%n\\t\\t\\t\\t%d\\t; Expire%n\\t\\t\\t\\t%d )\\t; Minimum",
                primaryNS, adminEmail, serial, refresh, retry, expire, minimum);
        }
    }
    
    private void initializeDefaultRecords() {
        // Create default SOA record
        String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long serial = Long.parseLong(currentDate + "01");
        
        soaRecord = new SOARecord(
            zoneName + ".",
            86400,
            "ns1." + zoneName + ".",
            "admin." + zoneName + ".",
            serial,
            3600,    // Refresh
            1800,    // Retry
            604800,  // Expire
            86400    // Minimum
        );
        
        // Add default NS records
        addRecord(new NSRecord(zoneName + ".", 86400, "ns1." + zoneName + "."));
        addRecord(new NSRecord(zoneName + ".", 86400, "ns2." + zoneName + "."));
    }
    
    public void addRecord(DNSRecord record) {
        String key = record.getName() + ":" + record.getType();
        records.computeIfAbsent(key, k -> new ArrayList<>()).add(record);
        soaRecord.incrementSerial();
    }
    
    public void removeRecord(String name, String type) {
        String key = name + ":" + type;
        if (records.remove(key) != null) {
            soaRecord.incrementSerial();
        }
    }
    
    public List<DNSRecord> getRecords(String name, String type) {
        String key = name + ":" + type;
        return records.getOrDefault(key, new ArrayList<>());
    }
    
    public List<DNSRecord> getAllRecords() {
        List<DNSRecord> allRecords = new ArrayList<>();
        for (List<DNSRecord> recordList : records.values()) {
            allRecords.addAll(recordList);
        }
        return allRecords;
    }
    
    public void addARecord(String name, int ttl, String ipAddress) {
        addRecord(new ARecord(name, ttl, ipAddress));
    }
    
    public void addAAAARecord(String name, int ttl, String ipv6Address) {
        addRecord(new AAAARecord(name, ttl, ipv6Address));
    }
    
    public void addCNAMERecord(String name, int ttl, String target) {
        addRecord(new CNAMERecord(name, ttl, target));
    }
    
    public void addMXRecord(String name, int ttl, int priority, String mailServer) {
        addRecord(new MXRecord(name, ttl, priority, mailServer));
    }
    
    public void addTXTRecord(String name, int ttl, String text) {
        addRecord(new TXTRecord(name, ttl, text));
    }
    
    public String generateZoneFile() {
        StringBuilder zoneFile = new StringBuilder();
        
        // Zone file header
        zoneFile.append("; Zone file for ").append(zoneName).append("\\n");
        zoneFile.append("; Generated on ").append(LocalDateTime.now()).append("\\n");
        zoneFile.append("; \\n");
        zoneFile.append("$TTL 86400\\n");
        zoneFile.append("$ORIGIN ").append(zoneName).append(".\\n\\n");
        
        // SOA Record
        zoneFile.append("; Start of Authority\\n");
        zoneFile.append(soaRecord.toZoneFormat()).append("\\n\\n");
        
        // Group records by type
        Map<String, List<DNSRecord>> recordsByType = new HashMap<>();
        for (List<DNSRecord> recordList : records.values()) {
            for (DNSRecord record : recordList) {
                recordsByType.computeIfAbsent(record.getType(), k -> new ArrayList<>()).add(record);
            }
        }
        
        // Output records by type
        String[] typeOrder = {"NS", "A", "AAAA", "CNAME", "MX", "TXT"};
        
        for (String type : typeOrder) {
            List<DNSRecord> typeRecords = recordsByType.get(type);
            if (typeRecords != null && !typeRecords.isEmpty()) {
                zoneFile.append("; ").append(type).append(" Records\\n");
                for (DNSRecord record : typeRecords) {
                    zoneFile.append(record.toZoneFormat()).append("\\n");
                }
                zoneFile.append("\\n");
            }
        }
        
        return zoneFile.toString();
    }
    
    public void saveZoneFile(String filename) throws IOException {
        try (PrintWriter writer = new PrintWriter(new FileWriter(filename))) {
            writer.print(generateZoneFile());
        }
    }
    
    public void loadZoneFile(String filename) throws IOException {
        // Simplified zone file parser
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith(";") || line.startsWith("$")) {
                    continue;
                }
                
                // Parse DNS record (simplified)
                String[] parts = line.split("\\\\s+");
                if (parts.length >= 5) {
                    String name = parts[0];
                    int ttl = Integer.parseInt(parts[1]);
                    String type = parts[3];
                    String data = String.join(" ", Arrays.copyOfRange(parts, 4, parts.length));
                    
                    switch (type) {
                        case "A":
                            addRecord(new ARecord(name, ttl, data));
                            break;
                        case "AAAA":
                            addRecord(new AAAARecord(name, ttl, data));
                            break;
                        case "CNAME":
                            addRecord(new CNAMERecord(name, ttl, data));
                            break;
                        case "NS":
                            addRecord(new NSRecord(name, ttl, data));
                            break;
                        case "TXT":
                            addRecord(new TXTRecord(name, ttl, data.replaceAll("\\"", "")));
                            break;
                    }
                }
            }
        }
    }
    
    public void validateZone() {
        List<String> errors = new ArrayList<>();
        
        // Check for required records
        boolean hasNS = records.values().stream()
            .flatMap(List::stream)
            .anyMatch(r -> r.getType().equals("NS"));
        
        if (!hasNS) {
            errors.add("Zone must have at least one NS record");
        }
        
        // Check for CNAME conflicts
        Set<String> cnameNames = new HashSet<>();
        Set<String> otherNames = new HashSet<>();
        
        for (List<DNSRecord> recordList : records.values()) {
            for (DNSRecord record : recordList) {
                if (record.getType().equals("CNAME")) {
                    cnameNames.add(record.getName());
                } else {
                    otherNames.add(record.getName());
                }
            }
        }
        
        for (String cname : cnameNames) {
            if (otherNames.contains(cname)) {
                errors.add("CNAME record conflicts with other record type: " + cname);
            }
        }
        
        if (!errors.isEmpty()) {
            throw new RuntimeException("Zone validation failed: " + String.join(", ", errors));
        }
    }
    
    public static void main(String[] args) {
        System.out.println("DNS Zone Manager Demo\\n");
        
        // Create zone manager
        DNSZoneManager zoneManager = new DNSZoneManager("example.com");
        
        try {
            // Add various records
            zoneManager.addARecord("example.com.", 3600, "93.184.216.34");
            zoneManager.addARecord("www.example.com.", 3600, "93.184.216.34");
            zoneManager.addAAAARecord("example.com.", 3600, "2606:2800:220:1:248:1893:25c8:1946");
            zoneManager.addCNAMERecord("blog.example.com.", 3600, "example.com.");
            zoneManager.addMXRecord("example.com.", 3600, 10, "mail.example.com.");
            zoneManager.addMXRecord("example.com.", 3600, 20, "mail2.example.com.");
            zoneManager.addTXTRecord("example.com.", 3600, "v=spf1 include:_spf.google.com ~all");
            
            // Validate zone
            zoneManager.validateZone();
            System.out.println("Zone validation passed\\n");
            
            // Generate and display zone file
            String zoneFile = zoneManager.generateZoneFile();
            System.out.println("Generated Zone File:");
            System.out.println("===================");
            System.out.println(zoneFile);
            
            // Save zone file
            zoneManager.saveZoneFile("example.com.zone");
            System.out.println("Zone file saved to example.com.zone");
            
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}`
    }
  ],

  resources: [
    { type: 'video', title: 'How DNS Works', url: 'https://www.youtube.com/results?search_query=how+dns+works+explained', description: 'Video explanations of DNS resolution process' },
    { type: 'article', title: 'DNS Explained', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/', description: 'Comprehensive guide to DNS by Cloudflare' },
    { type: 'tool', title: 'DNS Lookup Tools', url: 'https://www.nslookup.io/', description: 'Online DNS lookup and testing tools' },
    { type: 'documentation', title: 'DNS RFCs', url: 'https://www.rfc-editor.org/rfc/rfc1035.html', description: 'Official DNS protocol specifications' },
    { type: 'article', title: 'DNSSEC Guide', url: 'https://www.icann.org/resources/pages/dnssec-what-is-it-why-important-2019-03-05-en', description: 'DNSSEC explanation by ICANN' }
  ],

  questions: [
    {
      question: "Explain the complete DNS resolution process step by step.",
      answer: "DNS resolution process: 1) Browser checks cache, 2) OS checks cache and /etc/hosts, 3) Router checks cache, 4) Query sent to ISP DNS resolver, 5) Resolver queries root servers for TLD info, 6) Resolver queries TLD servers for authoritative servers, 7) Resolver queries authoritative servers for actual record, 8) Response cached at each level with TTL, 9) IP address returned to browser. Each step involves caching to improve performance and reduce load on upstream servers."
    },
    
    {
      question: "What are the different types of DNS records and their purposes?",
      answer: "Common DNS record types: 1) A - maps domain to IPv4 address, 2) AAAA - maps domain to IPv6 address, 3) CNAME - creates alias pointing to another domain, 4) MX - specifies mail servers with priority, 5) NS - delegates subdomain to other name servers, 6) TXT - stores arbitrary text (SPF, DKIM, verification), 7) PTR - reverse DNS (IP to domain), 8) SRV - specifies service locations, 9) SOA - contains zone administrative info. Each serves specific networking and administrative purposes."
    },
    
    {
      question: "How does DNS caching work and what is TTL?",
      answer: "DNS caching stores query results at multiple levels: browser, OS, router, ISP resolver, and authoritative servers. TTL (Time To Live) specifies how long records can be cached in seconds. Short TTL (60-300s) allows quick changes but increases query load. Long TTL (3600s+) reduces queries but delays propagation. When TTL expires, cached records are discarded and fresh queries are made. Caching dramatically improves performance and reduces load on DNS infrastructure."
    },
    
    {
      question: "What is DNSSEC and how does it improve DNS security?",
      answer: "DNSSEC (DNS Security Extensions) adds digital signatures to DNS records to prevent spoofing and ensure data integrity. It creates a chain of trust from root servers to authoritative servers using public key cryptography. New record types: DNSKEY (public keys), DS (delegation signer), RRSIG (signatures), NSEC/NSEC3 (proof of non-existence). Benefits: prevents cache poisoning, ensures data authenticity, enables secure applications. Limitations: doesn't provide encryption, increases response size, complex key management."
    },
    
    {
      question: "What's the difference between recursive and iterative DNS queries?",
      answer: "Recursive query: Client asks resolver to get complete answer. Resolver does all the work, querying multiple servers if needed, and returns final result to client. Used between client and resolver. Iterative query: Server provides best answer it knows or referral to another server. Client must follow referrals. Used between resolver and authoritative servers. Example: Client makes recursive query to 8.8.8.8, which then makes iterative queries to root, TLD, and authoritative servers."
    },
    
    {
      question: "How does DNS load balancing work?",
      answer: "DNS load balancing uses multiple A records for same domain with different IP addresses. Methods: 1) Round-robin - DNS server rotates through IPs in responses, 2) Weighted - different probabilities for each IP, 3) Geographic - return closest server based on client location, 4) Health-based - remove failed servers from rotation. Example: google.com returns different IPs (172.217.164.110, 172.217.164.142) to distribute load. Short TTL (60-300s) enables quick failover but increases DNS queries."
    },
    
    {
      question: "What are DNS over HTTPS (DoH) and DNS over TLS (DoT)?",
      answer: "DoH and DoT encrypt DNS queries to prevent eavesdropping and manipulation. DoH uses HTTPS (port 443) making queries look like web traffic, harder to block but more overhead. DoT uses dedicated TLS connection (port 853), lower overhead but easier to identify/block. Benefits: privacy from ISPs, prevents DNS manipulation, bypasses censorship. Drawbacks: may bypass corporate filtering, can impact troubleshooting, potential performance overhead. Major browsers support DoH by default."
    },
    
    {
      question: "How do you troubleshoot DNS resolution problems?",
      answer: "DNS troubleshooting steps: 1) Check local connectivity (ping gateway), 2) Test with different DNS servers (8.8.8.8, 1.1.1.1), 3) Use nslookup/dig for detailed queries, 4) Check DNS cache (flush if needed), 5) Verify DNS server configuration, 6) Check firewall/proxy settings, 7) Test from different locations, 8) Verify zone file syntax and propagation. Tools: nslookup, dig, host, ping, traceroute. Common issues: cache poisoning, misconfigured records, network connectivity, firewall blocking."
    },
    
    {
      question: "What is reverse DNS and when is it used?",
      answer: "Reverse DNS (rDNS) maps IP addresses back to domain names using PTR records in special domains (in-addr.arpa for IPv4, ip6.arpa for IPv6). Example: 93.184.216.34 → 34.216.184.93.in-addr.arpa PTR example.com. Uses: 1) Email servers verify sender legitimacy, 2) Logging systems show hostnames instead of IPs, 3) Security analysis and forensics, 4) Network troubleshooting. Not all IPs have reverse DNS, and it's controlled by IP address owner (usually ISP)."
    },
    
    {
      question: "How does DNS propagation work and what affects it?",
      answer: "DNS propagation is the time it takes for DNS changes to spread globally. Factors affecting propagation: 1) TTL values - lower TTL = faster propagation but more queries, 2) Caching at multiple levels (ISP, resolver, browser), 3) Geographic distribution of DNS servers, 4) Resolver refresh policies. Typical propagation: 15 minutes to 48 hours. To speed up: lower TTL before changes, use multiple DNS providers, monitor from different locations. Tools: whatsmydns.net, dnschecker.org help verify global propagation status."
    }
  ]
};