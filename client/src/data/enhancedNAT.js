export const enhancedNAT = {
  id: 'nat-network-address-translation',
  title: 'NAT (Network Address Translation)',
  subtitle: 'Address Translation and Private Network Connectivity',
  summary: 'NAT translates private IP addresses to public IP addresses, enabling multiple devices to share internet connectivity through a single public IP.',
  analogy: 'Like a hotel reception desk - guests (private IPs) use room numbers internally, but mail (internet traffic) uses the hotel address (public IP).',
  visualConcept: 'Picture NAT as a translator at international conference - converts between local language (private IPs) and common language (public IPs).',
  realWorldUse: 'Home routers, corporate firewalls, ISP networks, cloud gateways, mobile networks, IPv4 conservation, network security.',
  explanation: `Network Address Translation (NAT) Fundamentals:

NAT Purpose and Function:
NAT enables devices with private IP addresses to communicate with the internet by translating between private and public IP addresses. It was developed to address IPv4 address exhaustion and provide basic security through address hiding.

Types of NAT:

1. Static NAT (One-to-One):
- Maps one private IP to one public IP permanently
- Bidirectional translation
- Used for servers requiring consistent external access
- Simple but requires multiple public IPs

2. Dynamic NAT (Many-to-Many):
- Maps private IPs to pool of public IPs dynamically
- First-come, first-served allocation
- Releases public IP when session ends
- More efficient than static NAT

3. PAT (Port Address Translation/NAT Overload):
- Maps multiple private IPs to single public IP using ports
- Most common NAT implementation
- Tracks connections using port numbers
- Maximum efficiency for public IP usage

NAT Operation Process:
1. Outbound traffic: Replace private source IP with public IP
2. Maintain translation table (IP:port mappings)
3. Inbound traffic: Translate public destination back to private IP
4. Forward packet to internal host
5. Clean up expired translations

NAT Translation Table:
- Inside Local: Private IP address of internal host
- Inside Global: Public IP address representing internal host
- Outside Local: IP address of external host as seen internally
- Outside Global: Actual IP address of external host

Benefits of NAT:
1. IPv4 address conservation
2. Basic security (address hiding)
3. Network flexibility and mobility
4. Cost reduction (fewer public IPs needed)
5. Simplified internal addressing

Limitations of NAT:
1. Breaks end-to-end connectivity principle
2. Complicates peer-to-peer applications
3. Performance overhead (translation processing)
4. Troubleshooting complexity
5. Protocol compatibility issues
6. Scalability limitations

NAT Traversal Techniques:
- UPnP (Universal Plug and Play)
- STUN (Session Traversal Utilities for NAT)
- TURN (Traversal Using Relays around NAT)
- ICE (Interactive Connectivity Establishment)
- Application Layer Gateways (ALGs)

Advanced NAT Implementations:
- Carrier-Grade NAT (CGN/LSN)
- NAT64 (IPv6 to IPv4 translation)
- DS-Lite (Dual-Stack Lite)
- 464XLAT (IPv4/IPv6 translation)`,

  keyPoints: [
    'NAT translates between private and public IP addresses',
    'PAT (NAT overload) uses ports for multiple connections',
    'Static NAT provides one-to-one permanent mapping',
    'Dynamic NAT uses pool of public IPs temporarily',
    'NAT conserves IPv4 addresses and provides basic security',
    'Translation table tracks active connections',
    'NAT can complicate peer-to-peer applications',
    'Traversal techniques help applications work through NAT',
    'Carrier-Grade NAT used by ISPs for address sharing',
    'IPv6 reduces need for NAT with abundant addresses'
  ],

  codeExamples: [
    {
      title: "NAT Implementation and Simulation",
      language: "python",
      code: `import random
import time
import threading
from collections import defaultdict
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple
from enum import Enum

class NATType(Enum):
    STATIC = "Static NAT"
    DYNAMIC = "Dynamic NAT"
    PAT = "PAT (NAT Overload)"

@dataclass
class NATEntry:
    inside_local: str      # Private IP:port
    inside_global: str     # Public IP:port
    outside_local: str     # External IP:port (as seen internally)
    outside_global: str    # Actual external IP:port
    protocol: str          # TCP/UDP
    created_time: float
    last_used: float
    timeout: int = 300     # 5 minutes default

class NATDevice:
    def __init__(self, public_ip: str, private_network: str = "192.168.1.0/24"):
        self.public_ip = public_ip
        self.private_network = private_network
        self.translation_table: Dict[str, NATEntry] = {}
        self.port_pool = set(range(1024, 65536))  # Available ports
        self.used_ports = set()
        self.lock = threading.Lock()
        
        # Statistics
        self.stats = {
            'translations_created': 0,
            'translations_expired': 0,
            'packets_translated': 0,
            'translation_failures': 0
        }
    
    def create_static_nat(self, private_ip: str, public_ip: str) -> bool:
        \"\"\"Create static NAT mapping\"\"\"
        with self.lock:
            key = f"{private_ip}:*"  # Static mapping for all ports
            
            if key in self.translation_table:
                return False  # Already exists
            
            entry = NATEntry(
                inside_local=f"{private_ip}:*",
                inside_global=f"{public_ip}:*",
                outside_local="*:*",
                outside_global="*:*",
                protocol="*",
                created_time=time.time(),
                last_used=time.time(),
                timeout=0  # Static entries don't expire
            )
            
            self.translation_table[key] = entry
            self.stats['translations_created'] += 1
            
            print(f"Static NAT: {private_ip} <-> {public_ip}")
            return True
    
    def create_dynamic_nat(self, private_ip: str, private_port: int, 
                          external_ip: str, external_port: int, protocol: str) -> Optional[str]:
        \"\"\"Create dynamic NAT translation\"\"\"
        with self.lock:
            # Find available public port
            available_port = self.allocate_port()
            if not available_port:
                self.stats['translation_failures'] += 1
                return None
            
            inside_local = f"{private_ip}:{private_port}"
            inside_global = f"{self.public_ip}:{available_port}"
            outside_global = f"{external_ip}:{external_port}"
            
            entry = NATEntry(
                inside_local=inside_local,
                inside_global=inside_global,
                outside_local=outside_global,
                outside_global=outside_global,
                protocol=protocol,
                created_time=time.time(),
                last_used=time.time()
            )
            
            key = f"{inside_local}:{outside_global}:{protocol}"
            self.translation_table[key] = entry
            self.stats['translations_created'] += 1
            
            print(f"Dynamic NAT: {inside_local} -> {inside_global} (to {outside_global})\")\n            return inside_global
    
    def translate_outbound(self, src_ip: str, src_port: int, dst_ip: str, 
                          dst_port: int, protocol: str) -> Optional[Tuple[str, int]]:
        \"\"\"Translate outbound packet\"\"\"
        with self.lock:
            # Check for existing translation
            inside_local = f"{src_ip}:{src_port}"
            outside_global = f"{dst_ip}:{dst_port}"
            key = f"{inside_local}:{outside_global}:{protocol}"
            
            if key in self.translation_table:
                entry = self.translation_table[key]
                entry.last_used = time.time()
                
                # Extract public IP and port
                public_ip, public_port = entry.inside_global.split(':')
                self.stats['packets_translated'] += 1
                
                return (public_ip, int(public_port))
            
            # Create new PAT translation
            return self.create_pat_translation(src_ip, src_port, dst_ip, dst_port, protocol)
    
    def translate_inbound(self, dst_ip: str, dst_port: int, src_ip: str, 
                         src_port: int, protocol: str) -> Optional[Tuple[str, int]]:
        \"\"\"Translate inbound packet\"\"\"
        with self.lock:
            # Find matching translation
            for key, entry in self.translation_table.items():
                if (entry.inside_global == f"{dst_ip}:{dst_port}" and 
                    entry.outside_global == f"{src_ip}:{src_port}" and
                    entry.protocol == protocol):
                    
                    entry.last_used = time.time()
                    
                    # Extract private IP and port
                    private_ip, private_port = entry.inside_local.split(':')
                    self.stats['packets_translated'] += 1
                    
                    return (private_ip, int(private_port))
            
            return None  # No translation found
    
    def create_pat_translation(self, private_ip: str, private_port: int,
                              external_ip: str, external_port: int, protocol: str) -> Optional[Tuple[str, int]]:
        \"\"\"Create PAT (Port Address Translation) entry\"\"\"
        available_port = self.allocate_port()
        if not available_port:
            self.stats['translation_failures'] += 1
            return None
        
        inside_local = f"{private_ip}:{private_port}"
        inside_global = f"{self.public_ip}:{available_port}"
        outside_global = f"{external_ip}:{external_port}"
        
        entry = NATEntry(
            inside_local=inside_local,
            inside_global=inside_global,
            outside_local=outside_global,
            outside_global=outside_global,
            protocol=protocol,
            created_time=time.time(),
            last_used=time.time()
        )
        
        key = f"{inside_local}:{outside_global}:{protocol}"
        self.translation_table[key] = entry
        self.stats['translations_created'] += 1
        
        print(f"PAT: {inside_local} -> {inside_global} (to {outside_global})")
        return (self.public_ip, available_port)
    
    def allocate_port(self) -> Optional[int]:
        \"\"\"Allocate available port from pool\"\"\"
        if not self.port_pool:
            return None
        
        port = self.port_pool.pop()
        self.used_ports.add(port)
        return port
    
    def release_port(self, port: int):
        \"\"\"Release port back to pool\"\"\"
        if port in self.used_ports:
            self.used_ports.remove(port)
            self.port_pool.add(port)
    
    def cleanup_expired_translations(self):
        \"\"\"Remove expired NAT translations\"\"\"
        current_time = time.time()
        expired_keys = []
        
        with self.lock:
            for key, entry in self.translation_table.items():
                if (entry.timeout > 0 and 
                    current_time - entry.last_used > entry.timeout):
                    expired_keys.append(key)
            
            for key in expired_keys:
                entry = self.translation_table[key]
                
                # Release port if it's a PAT entry
                if ':' in entry.inside_global:
                    _, port_str = entry.inside_global.split(':')
                    if port_str.isdigit():
                        self.release_port(int(port_str))
                
                del self.translation_table[key]
                self.stats['translations_expired'] += 1
        
        if expired_keys:
            print(f"Cleaned up {len(expired_keys)} expired translations")
    
    def get_translation_table(self) -> List[Dict]:
        \"\"\"Get current translation table\"\"\"
        with self.lock:
            table = []
            for key, entry in self.translation_table.items():
                table.append({
                    'inside_local': entry.inside_local,
                    'inside_global': entry.inside_global,
                    'outside_global': entry.outside_global,
                    'protocol': entry.protocol,
                    'age': int(time.time() - entry.created_time),
                    'idle': int(time.time() - entry.last_used)
                })
            return table
    
    def get_statistics(self) -> Dict:
        \"\"\"Get NAT statistics\"\"\"
        with self.lock:
            return {
                **self.stats,
                'active_translations': len(self.translation_table),
                'available_ports': len(self.port_pool),
                'used_ports': len(self.used_ports)
            }

class NATTraversalHelper:
    \"\"\"Helper class for NAT traversal techniques\"\"\"
    
    @staticmethod
    def simulate_upnp_port_mapping(nat_device: NATDevice, private_ip: str, 
                                  private_port: int, public_port: int, protocol: str) -> bool:
        \"\"\"Simulate UPnP automatic port mapping\"\"\"
        print(f"UPnP: Requesting port mapping {private_ip}:{private_port} -> *:{public_port}")
        
        # Check if public port is available
        if public_port in nat_device.used_ports:
            print(f"UPnP: Port {public_port} already in use")
            return False
        
        # Create static-like mapping
        inside_local = f"{private_ip}:{private_port}"
        inside_global = f"{nat_device.public_ip}:{public_port}"
        
        entry = NATEntry(
            inside_local=inside_local,
            inside_global=inside_global,
            outside_local="*:*",
            outside_global="*:*",
            protocol=protocol,
            created_time=time.time(),
            last_used=time.time(),
            timeout=3600  # 1 hour
        )
        
        key = f"upnp_{inside_local}_{protocol}"
        nat_device.translation_table[key] = entry
        nat_device.used_ports.add(public_port)
        
        print(f"UPnP: Port mapping created successfully")
        return True
    
    @staticmethod
    def simulate_stun_discovery(nat_device: NATDevice, private_ip: str) -> Dict:
        \"\"\"Simulate STUN server discovery of NAT type\"\"\"
        print(f"STUN: Discovering NAT type for {private_ip}")
        
        # Simulate STUN binding request
        stun_server = "64.233.165.127"  # Example STUN server
        local_port = random.randint(10000, 20000)
        
        # Create temporary translation
        public_addr = nat_device.translate_outbound(
            private_ip, local_port, stun_server, 3478, "UDP"
        )
        
        if public_addr:
            nat_type = "Symmetric NAT" if len(nat_device.translation_table) > 1 else "Cone NAT"
            
            return {
                'nat_type': nat_type,
                'public_ip': public_addr[0],
                'public_port': public_addr[1],
                'private_ip': private_ip,
                'private_port': local_port
            }
        
        return {'error': 'STUN discovery failed'}

class NATDemo:
    def __init__(self):
        self.nat_device = NATDevice("203.0.113.10")  # Example public IP
        self.traversal_helper = NATTraversalHelper()
    
    def demonstrate_nat_types(self):
        \"\"\"Demonstrate different NAT types\"\"\"
        print("=== NAT (Network Address Translation) Demo ===\\n")
        
        # Static NAT
        print("1. Static NAT Configuration:")
        self.nat_device.create_static_nat("192.168.1.100", "203.0.113.11")
        
        # Dynamic NAT (PAT)
        print("\\n2. Dynamic NAT (PAT) Translations:")
        
        # Simulate outbound connections
        connections = [
            ("192.168.1.10", 12345, "8.8.8.8", 53, "UDP"),      # DNS query
            ("192.168.1.20", 54321, "93.184.216.34", 80, "TCP"), # HTTP request
            ("192.168.1.30", 65432, "172.217.164.110", 443, "TCP") # HTTPS request
        ]
        
        for src_ip, src_port, dst_ip, dst_port, protocol in connections:
            result = self.nat_device.translate_outbound(src_ip, src_port, dst_ip, dst_port, protocol)
            if result:
                print(f"  {src_ip}:{src_port} -> {result[0]}:{result[1]} (to {dst_ip}:{dst_port})")
        
        # Show translation table
        print("\\n3. Current Translation Table:")
        table = self.nat_device.get_translation_table()
        for entry in table[:3]:  # Show first 3 entries
            print(f"  {entry['inside_local']} <-> {entry['inside_global']} "
                  f"({entry['protocol']}, age: {entry['age']}s)")
        
        # NAT Traversal
        print("\\n4. NAT Traversal Techniques:")
        
        # UPnP simulation
        upnp_success = self.traversal_helper.simulate_upnp_port_mapping(
            self.nat_device, "192.168.1.50", 8080, 8080, "TCP"
        )
        
        # STUN simulation
        stun_result = self.traversal_helper.simulate_stun_discovery(
            self.nat_device, "192.168.1.60"
        )
        
        if 'nat_type' in stun_result:
            print(f"STUN: Detected {stun_result['nat_type']}")
            print(f"STUN: Public endpoint {stun_result['public_ip']}:{stun_result['public_port']}")
        
        # Statistics
        print("\\n5. NAT Statistics:")
        stats = self.nat_device.get_statistics()
        print(f"  Active translations: {stats['active_translations']}")
        print(f"  Translations created: {stats['translations_created']}")
        print(f"  Available ports: {stats['available_ports']}")
        print(f"  Packets translated: {stats['packets_translated']}")
        
        # Cleanup demonstration
        print("\\n6. Translation Cleanup:")
        time.sleep(1)  # Wait a bit
        self.nat_device.cleanup_expired_translations()

if __name__ == "__main__":
    demo = NATDemo()
    demo.demonstrate_nat_types()`
    }
  ],

  resources: [
    { type: 'article', title: 'NAT Explained - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/network-address-translation-nat/', description: 'Complete NAT concepts and types' },
    { type: 'video', title: 'NAT Tutorial - YouTube', url: 'https://www.youtube.com/watch?v=FTUV0t6JaDA', description: 'Visual explanation of NAT operation' },
    { type: 'article', title: 'PAT vs NAT - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/difference-between-nat-and-pat/', description: 'Port Address Translation explained' },
    { type: 'article', title: 'NAT Types and Traversal', url: 'https://www.rfc-editor.org/rfc/rfc3489.html', description: 'STUN RFC for NAT traversal' },
    { type: 'video', title: 'Static vs Dynamic NAT - YouTube', url: 'https://www.youtube.com/watch?v=wg8Hosr20yw', description: 'Different NAT implementation types' },
    { type: 'article', title: 'Carrier Grade NAT', url: 'https://www.rfc-editor.org/rfc/rfc6888.html', description: 'CGN requirements and implementation' },
    { type: 'tool', title: 'NAT Traversal Test', url: 'https://www.stunprotocol.org/', description: 'Test NAT traversal capabilities' },
    { type: 'article', title: 'UPnP Port Mapping', url: 'https://tools.ietf.org/html/rfc6970', description: 'Universal Plug and Play for NAT' },
    { type: 'video', title: 'NAT Troubleshooting - YouTube', url: 'https://www.youtube.com/watch?v=92b-jjBURkw', description: 'Common NAT issues and solutions' },
    { type: 'article', title: 'IPv6 and NAT', url: 'https://www.geeksforgeeks.org/ipv6-vs-nat/', description: 'How IPv6 addresses NAT limitations' }
  ],

  questions: [
    {
      question: "What is NAT and why was it developed?",
      answer: "NAT (Network Address Translation) translates private IP addresses to public IP addresses, enabling multiple devices to share internet connectivity. Developed to address: 1) IPv4 address exhaustion - conserves public IPs, 2) Cost reduction - fewer public IPs needed, 3) Basic security - hides internal network structure, 4) Network flexibility - allows private addressing schemes. Essential technology that enabled internet growth despite IPv4 limitations."
    },
    {
      question: "What are the different types of NAT and their use cases?",
      answer: "NAT types: 1) Static NAT - one-to-one permanent mapping, used for servers needing consistent external access, 2) Dynamic NAT - many-to-many using IP pool, temporary mappings for outbound connections, 3) PAT (NAT Overload) - many-to-one using ports, most common for home/office networks. PAT most efficient for public IP conservation, static NAT for servers, dynamic NAT for medium networks with multiple public IPs."
    },
    {
      question: "How does PAT (Port Address Translation) work?",
      answer: "PAT maps multiple private IPs to single public IP using port numbers: 1) Outbound - replaces private IP:port with public IP:new_port, 2) Translation table tracks mappings (private IP:port ↔ public IP:port ↔ destination), 3) Inbound - uses destination port to find correct internal host, 4) Timeout - removes inactive translations. Enables thousands of internal hosts to share one public IP by multiplexing connections through port numbers."
    },
    {
      question: "What are the limitations and problems caused by NAT?",
      answer: "NAT limitations: 1) Breaks end-to-end connectivity - violates internet architecture principles, 2) Peer-to-peer issues - incoming connections blocked, 3) Protocol problems - some protocols embed IP addresses in payload, 4) Performance overhead - translation processing, 5) Troubleshooting complexity - hidden internal structure, 6) Application compatibility - FTP, SIP, gaming protocols affected, 7) Scalability limits - port exhaustion, translation table size."
    },
    {
      question: "What is NAT traversal and what techniques are used?",
      answer: "NAT traversal enables applications to work through NAT by establishing connectivity for incoming connections. Techniques: 1) UPnP - automatic port mapping requests, 2) STUN - discovers public IP and NAT type, 3) TURN - relay server for symmetric NATs, 4) ICE - combines multiple techniques, 5) Port forwarding - manual static mappings, 6) ALGs - application-specific NAT helpers. Essential for VoIP, gaming, P2P applications, and video conferencing."
    },
    {
      question: "How does Carrier-Grade NAT (CGN) work and why is it used?",
      answer: "CGN provides additional NAT layer at ISP level: Customer -> CGN -> Internet. Used because: 1) IPv4 exhaustion - ISPs can't get enough public IPs, 2) Cost reduction - share public IPs across many customers, 3) Transition technology - delays IPv6 migration need. Challenges: 1) Double NAT issues - breaks many applications, 2) Logging requirements - legal compliance, 3) Performance impact - additional translation layer, 4) Port limitations - fewer ports per customer."
    },
    {
      question: "What is the NAT translation table and how is it managed?",
      answer: "NAT translation table maps internal addresses to external addresses: Fields include inside local/global, outside local/global, protocol, ports, timestamps. Management: 1) Dynamic creation - new entries for outbound connections, 2) Timeout handling - remove inactive entries (typically 5 minutes), 3) Port allocation - assign available ports from pool, 4) Collision handling - ensure unique mappings, 5) Table size limits - prevent memory exhaustion. Proper management essential for performance and reliability."
    },
    {
      question: "How do applications like FTP work through NAT?",
      answer: "FTP challenges with NAT: 1) Active mode - server initiates data connection to client (blocked by NAT), 2) Passive mode - client initiates both connections (works better), 3) Port numbers in payload - FTP commands contain IP addresses/ports. Solutions: 1) ALG (Application Layer Gateway) - NAT device understands FTP and modifies payload, 2) Passive mode preference - most modern FTP clients, 3) PASV command translation - ALG modifies port numbers in FTP responses."
    },
    {
      question: "What security implications does NAT have?",
      answer: "NAT security aspects: Benefits: 1) Address hiding - internal structure concealed, 2) Implicit firewall - blocks unsolicited inbound connections, 3) Network isolation - separates internal from external. Limitations: 1) Not true security - obscurity vs real protection, 2) Outbound traffic allowed - malware can still communicate, 3) Application vulnerabilities - NAT doesn't inspect content, 4) Configuration errors - improper port forwarding. NAT provides basic protection but requires proper firewall and security measures."
    },
    {
      question: "How does IPv6 address the problems that NAT was designed to solve?",
      answer: "IPv6 eliminates NAT need: 1) Abundant addresses - 340 undecillion addresses vs 4.3 billion IPv4, 2) End-to-end connectivity - restores internet architecture principles, 3) No translation overhead - direct routing, 4) Simplified protocols - no NAT traversal needed, 5) Better security - IPSec built-in, proper firewalls instead of NAT. However: 1) Transition period - dual-stack still uses NAT for IPv4, 2) Privacy concerns - global addresses vs NAT hiding, 3) Security mindset - must implement proper firewalls."
    }
  ]
};