export const enhancedPortNumbers = {
  id: 'port-numbers-multiplexing',
  title: 'Port Numbers and Multiplexing',
  subtitle: 'Application Identification and Network Multiplexing',
  summary: 'Port numbers enable multiple applications to use network simultaneously by providing unique endpoints for communication multiplexing.',
  analogy: 'Like apartment numbers in a building - the IP address is the building address, port numbers identify specific apartments (applications).',
  visualConcept: 'Picture a post office sorting mail: IP address gets mail to the right building, port number delivers to the correct apartment.',
  realWorldUse: 'Web servers (port 80/443), email (25/110/143), SSH (22), FTP (21), DNS (53), database connections, API endpoints.',
  explanation: `Port Numbers and Network Multiplexing:

Purpose and Function:
Port numbers are 16-bit identifiers (0-65535) that enable transport layer multiplexing, allowing multiple applications on the same host to communicate simultaneously over the network.

Port Number Categories:

1. Well-Known Ports (0-1023):
- Reserved for system services and standard protocols
- Require administrative privileges to bind
- Assigned by IANA (Internet Assigned Numbers Authority)
- Examples: HTTP (80), HTTPS (443), SSH (22), FTP (21), DNS (53)

2. Registered Ports (1024-49151):
- Assigned to specific applications by IANA
- Can be used by user applications
- Examples: MySQL (3306), PostgreSQL (5432), MongoDB (27017)

3. Dynamic/Private Ports (49152-65535):
- Available for dynamic allocation
- Used by client applications for outbound connections
- Also called ephemeral ports
- Automatically assigned by operating system

Multiplexing Process:
Transport layer uses combination of source IP, source port, destination IP, and destination port to create unique connection identifiers (socket pairs).

Socket Pairs:
- TCP: (src_ip:src_port, dst_ip:dst_port) uniquely identifies connection
- UDP: Each datagram identified by (src_ip:src_port, dst_ip:dst_port)

Port Binding:
- Servers bind to specific ports to listen for connections
- Clients typically use ephemeral ports for outbound connections
- Port conflicts occur when multiple applications try to bind same port

Security Implications:
- Open ports represent potential attack vectors
- Port scanning used for reconnaissance
- Firewalls filter traffic based on port numbers
- Port knocking provides additional security layer

Network Address Translation (NAT):
NAT devices modify port numbers to enable multiple private hosts to share single public IP address, creating port mapping tables.`,

  keyPoints: [
    'Port numbers enable application multiplexing on single host',
    'Well-known ports (0-1023) reserved for system services',
    'Registered ports (1024-49151) for specific applications',
    'Dynamic ports (49152-65535) for client connections',
    'Socket pairs uniquely identify network connections',
    'Servers bind to specific ports, clients use ephemeral ports',
    'Port conflicts prevent multiple bindings to same port',
    'Firewalls use port numbers for traffic filtering',
    'NAT modifies port numbers for address translation',
    'Port scanning used for network reconnaissance'
  ],

  codeExamples: [
    {
      title: "Port Management and Socket Programming",
      language: "python",
      code: `import socket
import threading
import time
import random
from collections import defaultdict

# Well-known port definitions
WELL_KNOWN_PORTS = {
    20: "FTP Data",
    21: "FTP Control", 
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    67: "DHCP Server",
    68: "DHCP Client", 
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    993: "IMAPS",
    995: "POP3S"
}

REGISTERED_PORTS = {
    1433: "Microsoft SQL Server",
    1521: "Oracle Database",
    3306: "MySQL",
    5432: "PostgreSQL", 
    6379: "Redis",
    27017: "MongoDB",
    8080: "HTTP Alternate",
    9200: "Elasticsearch"
}

class PortManager:
    def __init__(self):
        self.bound_ports = {}  # port -> (process_name, socket)
        self.ephemeral_range = (49152, 65535)
        self.next_ephemeral = self.ephemeral_range[0]
        self.lock = threading.Lock()
    
    def bind_port(self, port, process_name, socket_obj=None):
        """Bind a port to a process"""
        with self.lock:
            if port in self.bound_ports:
                return False, f"Port {port} already bound to {self.bound_ports[port][0]}"
            
            self.bound_ports[port] = (process_name, socket_obj)
            
            # Identify port type
            port_type = self.get_port_type(port)
            service_name = self.get_service_name(port)
            
            print(f"BIND: Port {port} ({port_type}) bound to {process_name}")
            if service_name:
                print(f"      Service: {service_name}")
            
            return True, "Port bound successfully"
    
    def release_port(self, port):
        """Release a bound port"""
        with self.lock:
            if port in self.bound_ports:
                process_name, socket_obj = self.bound_ports[port]
                del self.bound_ports[port]
                
                if socket_obj:
                    try:
                        socket_obj.close()
                    except:
                        pass
                
                print(f"RELEASE: Port {port} released from {process_name}")
                return True
            return False
    
    def allocate_ephemeral_port(self, process_name):
        """Allocate an ephemeral port for client connection"""
        with self.lock:
            # Find next available ephemeral port
            for _ in range(1000):  # Try up to 1000 ports
                port = self.next_ephemeral
                self.next_ephemeral += 1
                
                if self.next_ephemeral > self.ephemeral_range[1]:
                    self.next_ephemeral = self.ephemeral_range[0]
                
                if port not in self.bound_ports:
                    self.bound_ports[port] = (process_name, None)
                    print(f"EPHEMERAL: Port {port} allocated to {process_name}")
                    return port
            
            return None  # No available ports
    
    def get_port_type(self, port):
        """Determine port type based on number"""
        if 0 <= port <= 1023:
            return "Well-Known"
        elif 1024 <= port <= 49151:
            return "Registered"
        elif 49152 <= port <= 65535:
            return "Dynamic/Ephemeral"
        else:
            return "Invalid"
    
    def get_service_name(self, port):
        """Get service name for known ports"""
        return WELL_KNOWN_PORTS.get(port) or REGISTERED_PORTS.get(port)
    
    def list_bound_ports(self):
        """List all bound ports"""
        with self.lock:
            print("\\n=== Bound Ports ===")
            for port, (process, _) in sorted(self.bound_ports.items()):
                port_type = self.get_port_type(port)
                service = self.get_service_name(port)
                service_info = f" ({service})" if service else ""
                print(f"Port {port:5d} [{port_type:12}]: {process}{service_info}")
    
    def scan_ports(self, host, port_range):
        """Simple port scanner"""
        print(f"\\nScanning {host} ports {port_range[0]}-{port_range[1]}...")
        open_ports = []
        
        for port in range(port_range[0], port_range[1] + 1):
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(0.1)
                result = sock.connect_ex((host, port))
                
                if result == 0:
                    open_ports.append(port)
                    service = self.get_service_name(port)
                    service_info = f" ({service})" if service else ""
                    print(f"  Port {port}: OPEN{service_info}")
                
                sock.close()
                
            except Exception:
                pass
        
        return open_ports

class MultiServerDemo:
    def __init__(self):
        self.port_manager = PortManager()
        self.servers = {}
        self.running = True
    
    def create_server(self, port, service_name):
        """Create a server on specified port"""
        try:
            # Create socket
            server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            
            # Bind to port
            server_socket.bind(('localhost', port))
            
            # Register with port manager
            success, message = self.port_manager.bind_port(port, service_name, server_socket)
            
            if not success:
                server_socket.close()
                print(f"Failed to bind {service_name} to port {port}: {message}")
                return False
            
            # Start listening
            server_socket.listen(5)
            
            # Store server info
            self.servers[port] = {
                'socket': server_socket,
                'service': service_name,
                'connections': 0
            }
            
            # Start server thread
            server_thread = threading.Thread(
                target=self.run_server,
                args=(port, server_socket, service_name)
            )
            server_thread.daemon = True
            server_thread.start()
            
            return True
            
        except Exception as e:
            print(f"Error creating server {service_name} on port {port}: {e}")
            return False
    
    def run_server(self, port, server_socket, service_name):
        """Run server loop"""
        print(f"Server {service_name} listening on port {port}")
        
        while self.running:
            try:
                client_socket, address = server_socket.accept()
                
                # Update connection count
                self.servers[port]['connections'] += 1
                
                print(f"{service_name}: Connection from {address} "
                      f"(total: {self.servers[port]['connections']})")
                
                # Handle client in separate thread
                client_thread = threading.Thread(
                    target=self.handle_client,
                    args=(client_socket, address, service_name)
                )
                client_thread.daemon = True
                client_thread.start()
                
            except socket.error:
                if self.running:
                    print(f"Server {service_name} accept error")
                break
    
    def handle_client(self, client_socket, address, service_name):
        """Handle individual client connection"""
        try:
            # Send service identification
            welcome_msg = f"Welcome to {service_name} service\\n"
            client_socket.send(welcome_msg.encode())
            
            # Echo server behavior
            while True:
                data = client_socket.recv(1024)
                if not data:
                    break
                
                response = f"{service_name} Echo: {data.decode()}"
                client_socket.send(response.encode())
                
        except Exception as e:
            print(f"{service_name}: Client {address} error: {e}")
        finally:
            client_socket.close()
            print(f"{service_name}: Client {address} disconnected")
    
    def create_client_connection(self, host, port, message):
        """Create client connection to server"""
        try:
            # Allocate ephemeral port
            client_port = self.port_manager.allocate_ephemeral_port("Client")
            
            if not client_port:
                print("No ephemeral ports available")
                return
            
            # Create client socket
            client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            
            # Bind to ephemeral port (optional, usually automatic)
            client_socket.bind(('localhost', client_port))
            
            # Connect to server
            client_socket.connect((host, port))
            
            print(f"CLIENT: Connected from port {client_port} to {host}:{port}")
            
            # Send message
            client_socket.send(message.encode())
            
            # Receive response
            response = client_socket.recv(1024)
            print(f"CLIENT: Received: {response.decode().strip()}")
            
            # Close connection
            client_socket.close()
            self.port_manager.release_port(client_port)
            
        except Exception as e:
            print(f"Client connection error: {e}")
    
    def demonstrate_multiplexing(self):
        """Demonstrate port multiplexing"""
        print("=== Port Multiplexing Demonstration ===\\n")
        
        # Create multiple servers on different ports
        servers_to_create = [
            (8080, "HTTP Server"),
            (8443, "HTTPS Server"), 
            (2222, "SSH Server"),
            (3306, "MySQL Server"),
            (6379, "Redis Server")
        ]
        
        for port, service in servers_to_create:
            self.create_server(port, service)
            time.sleep(0.1)
        
        time.sleep(1)  # Let servers start
        
        # Show bound ports
        self.port_manager.list_bound_ports()
        
        # Create client connections
        print("\\n=== Client Connections ===")
        for port, service in servers_to_create[:3]:  # Connect to first 3 servers
            self.create_client_connection('localhost', port, f"Hello {service}!")
            time.sleep(0.5)
        
        # Demonstrate port scanning
        print("\\n=== Port Scanning ===")
        open_ports = self.port_manager.scan_ports('localhost', (8000, 8500))
        
        # Show final statistics
        print("\\n=== Server Statistics ===")
        for port, info in self.servers.items():
            print(f"{info['service']:15} (Port {port}): {info['connections']} connections")
    
    def cleanup(self):
        """Clean up servers and ports"""
        self.running = False
        
        for port, info in self.servers.items():
            try:
                info['socket'].close()
            except:
                pass
            self.port_manager.release_port(port)
        
        print("\\nCleanup completed")

# Network service simulation
class NetworkService:
    def __init__(self, name, default_port):
        self.name = name
        self.default_port = default_port
        self.active_connections = defaultdict(list)
    
    def start_service(self, port_manager):
        """Start network service"""
        success, message = port_manager.bind_port(self.default_port, self.name)
        
        if success:
            print(f"Service {self.name} started on port {self.default_port}")
            return True
        else:
            print(f"Failed to start {self.name}: {message}")
            return False
    
    def handle_connection(self, client_ip, client_port):
        """Handle incoming connection"""
        connection_id = f"{client_ip}:{client_port}"
        self.active_connections[self.default_port].append(connection_id)
        
        print(f"{self.name}: New connection from {connection_id}")
        return connection_id

if __name__ == "__main__":
    # Run demonstration
    demo = MultiServerDemo()
    
    try:
        demo.demonstrate_multiplexing()
        
        # Keep servers running for a bit
        time.sleep(3)
        
    except KeyboardInterrupt:
        print("\\nShutdown requested...")
    finally:
        demo.cleanup()`
    },
    {
      title: "Port Security and Firewall Rules",
      language: "python",
      code: `import socket
import ipaddress
import time
from enum import Enum
from collections import defaultdict, deque

class FirewallAction(Enum):
    ALLOW = "ALLOW"
    DENY = "DENY"
    LOG = "LOG"

class PortSecurityManager:
    def __init__(self):
        self.firewall_rules = []
        self.port_knocker = PortKnocker()
        self.intrusion_detector = IntrusionDetector()
        self.access_log = deque(maxlen=1000)
    
    def add_firewall_rule(self, rule):
        """Add firewall rule"""
        self.firewall_rules.append(rule)
        print(f"Added firewall rule: {rule}")
    
    def check_access(self, src_ip, dst_port, protocol="TCP"):
        """Check if access is allowed by firewall rules"""
        connection_info = {
            'src_ip': src_ip,
            'dst_port': dst_port,
            'protocol': protocol,
            'timestamp': time.time()
        }
        
        # Check intrusion detection
        if self.intrusion_detector.is_suspicious(src_ip, dst_port):
            self.log_access(connection_info, FirewallAction.DENY, "Intrusion detected")
            return False
        
        # Check firewall rules
        for rule in self.firewall_rules:
            if rule.matches(src_ip, dst_port, protocol):
                self.log_access(connection_info, rule.action, f"Rule: {rule.name}")
                
                if rule.action == FirewallAction.ALLOW:
                    return True
                elif rule.action == FirewallAction.DENY:
                    return False
        
        # Default deny
        self.log_access(connection_info, FirewallAction.DENY, "Default deny")
        return False
    
    def log_access(self, connection_info, action, reason):
        """Log access attempt"""
        log_entry = {
            **connection_info,
            'action': action.value,
            'reason': reason
        }
        self.access_log.append(log_entry)
        
        print(f"FIREWALL: {action.value} {connection_info['src_ip']}:"
              f"{connection_info['dst_port']} - {reason}")
    
    def get_access_statistics(self):
        """Get access statistics"""
        stats = defaultdict(int)
        
        for entry in self.access_log:
            stats[entry['action']] += 1
            stats[f"port_{entry['dst_port']}"] += 1
        
        return dict(stats)

class FirewallRule:
    def __init__(self, name, src_network, dst_ports, protocol, action):
        self.name = name
        self.src_network = ipaddress.ip_network(src_network)
        self.dst_ports = dst_ports if isinstance(dst_ports, list) else [dst_ports]
        self.protocol = protocol
        self.action = action
    
    def matches(self, src_ip, dst_port, protocol):
        """Check if rule matches connection"""
        try:
            src_addr = ipaddress.ip_address(src_ip)
            
            return (src_addr in self.src_network and
                    dst_port in self.dst_ports and
                    protocol.upper() == self.protocol.upper())
        except:
            return False
    
    def __str__(self):
        return (f"{self.name}: {self.action.value} {self.src_network} "
                f"-> ports {self.dst_ports} ({self.protocol})")

class PortKnocker:
    def __init__(self):
        self.knock_sequences = {}
        self.client_states = defaultdict(list)
        self.timeout = 30  # seconds
    
    def add_knock_sequence(self, service_port, sequence):
        """Add port knocking sequence"""
        self.knock_sequences[service_port] = sequence
        print(f"Port knocking enabled for port {service_port}: {sequence}")
    
    def process_knock(self, src_ip, dst_port):
        """Process port knock attempt"""
        current_time = time.time()
        
        # Clean old attempts
        self.client_states[src_ip] = [
            (port, timestamp) for port, timestamp in self.client_states[src_ip]
            if current_time - timestamp < self.timeout
        ]
        
        # Add current knock
        self.client_states[src_ip].append((dst_port, current_time))
        
        # Check for completed sequences
        for service_port, sequence in self.knock_sequences.items():
            if self.check_sequence(src_ip, sequence):
                print(f"PORT KNOCK: {src_ip} completed sequence for port {service_port}")
                self.client_states[src_ip] = []  # Reset sequence
                return service_port
        
        return None
    
    def check_sequence(self, src_ip, sequence):
        """Check if client completed knock sequence"""
        client_knocks = [port for port, _ in self.client_states[src_ip]]
        
        if len(client_knocks) < len(sequence):
            return False
        
        # Check last N knocks match sequence
        return client_knocks[-len(sequence):] == sequence

class IntrusionDetector:
    def __init__(self):
        self.scan_attempts = defaultdict(lambda: defaultdict(list))
        self.blocked_ips = set()
        self.scan_threshold = 10  # ports scanned in time window
        self.time_window = 60  # seconds
        self.block_duration = 300  # 5 minutes
    
    def is_suspicious(self, src_ip, dst_port):
        """Check if IP shows suspicious behavior"""
        current_time = time.time()
        
        # Check if IP is currently blocked
        if src_ip in self.blocked_ips:
            return True
        
        # Record port access
        self.scan_attempts[src_ip][dst_port].append(current_time)
        
        # Clean old attempts
        for ip in list(self.scan_attempts.keys()):
            for port in list(self.scan_attempts[ip].keys()):
                self.scan_attempts[ip][port] = [
                    timestamp for timestamp in self.scan_attempts[ip][port]
                    if current_time - timestamp < self.time_window
                ]
                
                if not self.scan_attempts[ip][port]:
                    del self.scan_attempts[ip][port]
            
            if not self.scan_attempts[ip]:
                del self.scan_attempts[ip]
        
        # Check for port scanning
        if src_ip in self.scan_attempts:
            unique_ports = len(self.scan_attempts[src_ip])
            
            if unique_ports >= self.scan_threshold:
                print(f"INTRUSION: Port scan detected from {src_ip} "
                      f"({unique_ports} ports in {self.time_window}s)")
                self.blocked_ips.add(src_ip)
                
                # Schedule unblock
                threading.Timer(self.block_duration, 
                              lambda: self.blocked_ips.discard(src_ip)).start()
                
                return True
        
        return False

class SecurePortDemo:
    def __init__(self):
        self.security_manager = PortSecurityManager()
        self.setup_security_rules()
    
    def setup_security_rules(self):
        """Setup firewall rules and security policies"""
        # Allow local connections
        self.security_manager.add_firewall_rule(
            FirewallRule("Allow Local", "127.0.0.0/8", [80, 443, 22, 3306], 
                        "TCP", FirewallAction.ALLOW)
        )
        
        # Allow HTTP/HTTPS from anywhere
        self.security_manager.add_firewall_rule(
            FirewallRule("Allow Web", "0.0.0.0/0", [80, 443], 
                        "TCP", FirewallAction.ALLOW)
        )
        
        # Deny SSH from external networks
        self.security_manager.add_firewall_rule(
            FirewallRule("Block External SSH", "0.0.0.0/0", [22], 
                        "TCP", FirewallAction.DENY)
        )
        
        # Setup port knocking for SSH
        self.security_manager.port_knocker.add_knock_sequence(22, [1234, 5678, 9012])
    
    def simulate_connections(self):
        """Simulate various connection attempts"""
        print("=== Port Security Demonstration ===\\n")
        
        test_connections = [
            ("127.0.0.1", 80, "Local HTTP"),
            ("192.168.1.100", 443, "External HTTPS"),
            ("10.0.0.50", 22, "External SSH"),
            ("127.0.0.1", 3306, "Local MySQL"),
            ("203.0.113.10", 22, "Internet SSH"),
        ]
        
        print("Testing firewall rules:")
        for src_ip, dst_port, description in test_connections:
            allowed = self.security_manager.check_access(src_ip, dst_port)
            status = "ALLOWED" if allowed else "BLOCKED"
            print(f"  {description:15} ({src_ip}:{dst_port}): {status}")
        
        print("\\nSimulating port scan:")
        scanner_ip = "203.0.113.20"
        
        # Simulate port scan
        for port in [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995]:
            self.security_manager.check_access(scanner_ip, port)
            time.sleep(0.1)
        
        print("\\nTesting port knocking:")
        knock_ip = "192.168.1.200"
        
        # Perform port knocking sequence
        knock_sequence = [1234, 5678, 9012]
        for knock_port in knock_sequence:
            unlocked_port = self.security_manager.port_knocker.process_knock(
                knock_ip, knock_port)
            if unlocked_port:
                print(f"Port {unlocked_port} unlocked for {knock_ip}")
        
        # Now try SSH after knocking
        print("\\nTrying SSH after port knocking:")
        allowed = self.security_manager.check_access(knock_ip, 22)
        print(f"SSH access: {'ALLOWED' if allowed else 'BLOCKED'}")
        
        # Show statistics
        print("\\n=== Security Statistics ===")
        stats = self.security_manager.get_access_statistics()
        for key, value in stats.items():
            print(f"{key}: {value}")

if __name__ == "__main__":
    import threading
    
    # Run security demonstration
    demo = SecurePortDemo()
    demo.simulate_connections()`
    }
  ],

  resources: [
    { type: 'article', title: 'Port Numbers - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/port-number-in-computer-network/', description: 'Complete guide to port numbers and their usage' },
    { type: 'video', title: 'TCP/UDP Port Numbers - YouTube', url: 'https://www.youtube.com/watch?v=RDotMcs0Erg', description: 'Visual explanation of port numbers and multiplexing' },
    { type: 'article', title: 'Well-Known Ports - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/well-known-port-numbers/', description: 'List of standard port numbers and services' },
    { type: 'article', title: 'IANA Port Registry', url: 'https://www.iana.org/assignments/service-names-port-numbers/', description: 'Official port number assignments' },
    { type: 'video', title: 'Network Multiplexing - YouTube', url: 'https://www.youtube.com/watch?v=HkpqysY5L8Y', description: 'How multiplexing works with port numbers' },
    { type: 'article', title: 'Socket Programming Ports', url: 'https://www.tutorialspoint.com/unix_sockets/socket_port_addresses.htm', description: 'Port usage in socket programming' },
    { type: 'tool', title: 'netstat Command', url: 'https://www.geeksforgeeks.org/netstat-command-linux/', description: 'Monitor active ports and connections' },
    { type: 'tool', title: 'nmap Port Scanner', url: 'https://nmap.org/book/man-port-scanning-basics.html', description: 'Network port scanning and discovery' },
    { type: 'article', title: 'Port Security Best Practices', url: 'https://www.sans.org/white-papers/1893/', description: 'Security considerations for port management' },
    { type: 'video', title: 'Firewall Port Configuration', url: 'https://www.youtube.com/watch?v=kDEX1HXybrU', description: 'Configuring firewall rules for ports' }
  ],

  questions: [
    {
      question: "What are port numbers and why are they necessary in networking?",
      answer: "Port numbers are 16-bit identifiers (0-65535) that enable multiplexing of network connections on a single IP address. They're necessary because: 1) Multiple applications can run simultaneously on one host, 2) Enable process-to-process communication, 3) Allow servers to handle multiple client connections, 4) Provide service identification and routing, 5) Enable network address translation and firewall filtering."
    },
    {
      question: "Explain the three categories of port numbers and their ranges.",
      answer: "Three categories: 1) Well-Known Ports (0-1023) - Reserved for system services like HTTP (80), HTTPS (443), SSH (22), require root privileges, 2) Registered Ports (1024-49151) - Assigned by IANA for specific applications like MySQL (3306), can be used by regular users, 3) Dynamic/Private Ports (49152-65535) - Available for temporary use by client applications, automatically assigned by OS."
    },
    {
      question: "How does port multiplexing work in TCP and UDP?",
      answer: "Port multiplexing allows multiple connections using the same IP address: 1) TCP - Creates unique connections using 4-tuple (source IP, source port, dest IP, dest port), enables multiple simultaneous connections to same server, 2) UDP - Uses 2-tuple (IP, port) for datagram delivery, stateless multiplexing, 3) OS maintains port tables to route data to correct applications, 4) Enables concurrent client-server communications."
    },
    {
      question: "What happens when two applications try to bind to the same port?",
      answer: "Port binding conflicts result in: 1) Second application receives 'Address already in use' error, 2) Only one application can bind to a specific port at a time (unless SO_REUSEADDR is used), 3) OS prevents conflicts through port allocation tables, 4) Solutions include: using different ports, SO_REUSEPORT option, graceful shutdown of first application, 5) Load balancers can share ports across multiple processes."
    },
    {
      question: "How do firewalls use port numbers for security?",
      answer: "Firewalls use ports for access control: 1) Port-based filtering - Allow/deny traffic based on destination ports, 2) Service identification - Block unnecessary services by closing their ports, 3) Ingress/egress rules - Control inbound and outbound connections, 4) Port scanning detection - Monitor for suspicious port access patterns, 5) Application-layer filtering - Deep packet inspection beyond port numbers, 6) Default deny policies with explicit allow rules."
    },
    {
      question: "What is the difference between source and destination ports?",
      answer: "Source Port: 1) Identifies sending application/process, 2) Usually dynamically assigned by client OS, 3) Used for return traffic routing, 4) Ephemeral ports for clients. Destination Port: 1) Identifies target service/application, 2) Well-known for servers (HTTP=80, SSH=22), 3) Determines which server process handles request, 4) Static for services. Together they enable bidirectional communication and proper packet routing."
    },
    {
      question: "How does NAT (Network Address Translation) handle port numbers?",
      answer: "NAT uses port translation for address mapping: 1) PAT (Port Address Translation) - Maps internal IP:port to external IP:port, 2) Port mapping table - Tracks active translations, 3) Dynamic port assignment - Assigns available external ports, 4) Port forwarding - Static mapping for servers, 5) Enables multiple internal hosts to share single external IP, 6) Maintains connection state for proper return traffic routing."
    },
    {
      question: "What are ephemeral ports and how are they managed?",
      answer: "Ephemeral ports are temporary ports used by clients: 1) Range varies by OS (Linux: 32768-65535, Windows: 1024-5000), 2) Automatically assigned by OS for outbound connections, 3) Released when connection closes, 4) Prevent port exhaustion through proper management, 5) Can be configured via system parameters, 6) Important for high-traffic servers to avoid port starvation."
    },
    {
      question: "How do load balancers distribute traffic across multiple servers using ports?",
      answer: "Load balancers use various port-based strategies: 1) Virtual IP - Single external port maps to multiple backend servers, 2) Port-based routing - Different ports route to different services, 3) Health checks - Monitor server availability on specific ports, 4) Session persistence - Maintain client connections to same backend port, 5) SSL termination - Handle encrypted traffic on standard ports, 6) Port translation between frontend and backend services."
    },
    {
      question: "What security vulnerabilities are associated with port management?",
      answer: "Port-related security risks include: 1) Open ports - Unnecessary services expose attack vectors, 2) Port scanning - Attackers discover available services, 3) Default credentials - Services running on standard ports with weak authentication, 4) Port hijacking - Malicious applications binding to privileged ports, 5) Backdoors - Unauthorized services on unusual ports, 6) DDoS attacks - Targeting specific service ports, 7) Mitigation: regular port audits, firewall rules, service hardening."
    }
  ]
};