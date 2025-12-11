const networkModels = {
  id: 'network-models',
  title: 'Network Models - OSI and TCP/IP',
  subtitle: 'OSI 7-Layer Model vs TCP/IP 4-Layer Model',
  summary: 'Network models provide standardized frameworks for network communication. OSI has 7 layers (Physical, Data Link, Network, Transport, Session, Presentation, Application), while TCP/IP has 4 layers (Network Access, Internet, Transport, Application).',
  analogy: 'Like postal system: Physical (roads), Data Link (local post office), Network (routing centers), Transport (delivery service), Session (conversation), Presentation (language translation), Application (letter content).',
  visualConcept: 'OSI: 7 Layers | TCP/IP: 4 Layers | Data flows down sender, up receiver',
  realWorldUse: 'Network troubleshooting, protocol design, network security, system administration, and understanding how internet communication works from hardware to applications.',
  
  explanation: `Network Models - OSI and TCP/IP:

What are Network Models:
- Conceptual frameworks for network communication
- Define how data moves between devices
- Standardize network protocols and functions
- Enable interoperability between different systems
- Provide troubleshooting methodology

OSI Model (Open Systems Interconnection):

7. Application Layer:
- User interface and network services
- Protocols: HTTP, HTTPS, FTP, SMTP, DNS
- Functions: File transfer, email, web browsing
- Examples: Web browsers, email clients

6. Presentation Layer:
- Data formatting, encryption, compression
- Character encoding (ASCII, Unicode)
- Data encryption/decryption
- Examples: SSL/TLS, JPEG, GIF

5. Session Layer:
- Establishes, manages, terminates sessions
- Dialog control (full-duplex, half-duplex)
- Session checkpointing and recovery
- Examples: NetBIOS, RPC, SQL sessions

4. Transport Layer:
- End-to-end communication
- Protocols: TCP (reliable), UDP (fast)
- Port numbers for application identification
- Flow control and error recovery

3. Network Layer:
- Routing between different networks
- Logical addressing (IP addresses)
- Path determination
- Protocols: IP, ICMP, OSPF, BGP

2. Data Link Layer:
- Node-to-node communication
- Physical addressing (MAC addresses)
- Error detection and correction
- Protocols: Ethernet, Wi-Fi, PPP

1. Physical Layer:
- Transmission of raw bits
- Hardware specifications
- Cables, connectors, voltages
- Examples: Ethernet cables, fiber optics

TCP/IP Model (Internet Protocol Suite):

4. Application Layer:
- Combines OSI layers 5, 6, 7
- End-user applications and services
- Protocols: HTTP, FTP, SMTP, DNS, DHCP
- Direct interaction with users

3. Transport Layer:
- Same as OSI Transport Layer
- TCP for reliability, UDP for speed
- Port-based communication
- End-to-end data delivery

2. Internet Layer:
- Same as OSI Network Layer
- IP addressing and routing
- Packet forwarding between networks
- Protocols: IPv4, IPv6, ICMP

1. Network Access Layer:
- Combines OSI layers 1 and 2
- Physical transmission and local delivery
- Hardware addressing and error detection
- Protocols: Ethernet, Wi-Fi, ARP

Key Differences:

Layers:
- OSI: 7 layers (more detailed)
- TCP/IP: 4 layers (more practical)

Development:
- OSI: Theoretical model (ISO standard)
- TCP/IP: Practical implementation (Internet standard)

Usage:
- OSI: Teaching and troubleshooting
- TCP/IP: Real-world implementation

Session/Presentation:
- OSI: Separate layers
- TCP/IP: Combined in Application layer

Data Encapsulation Process:

Sending Data (Down the stack):
Application → Data
Transport → Segments (TCP) / Datagrams (UDP)
Network → Packets
Data Link → Frames
Physical → Bits

Receiving Data (Up the stack):
Physical → Bits
Data Link → Frames
Network → Packets
Transport → Segments/Datagrams
Application → Data

Protocol Data Units (PDUs):
- Application: Data/Message
- Transport: Segment (TCP) / Datagram (UDP)
- Network: Packet
- Data Link: Frame
- Physical: Bits`,

  keyPoints: [
    'OSI has 7 layers, TCP/IP has 4 layers for network communication',
    'OSI is theoretical model, TCP/IP is practical implementation',
    'Each layer adds headers (encapsulation) when sending data',
    'Physical layer handles bits, Application layer handles user data',
    'Transport layer provides TCP (reliable) and UDP (fast) protocols',
    'Network layer handles routing with IP addresses',
    'Data Link layer uses MAC addresses for local communication',
    'Troubleshooting follows layer-by-layer approach',
    'TCP/IP Application layer combines OSI layers 5, 6, 7',
    'Understanding models helps in network design and problem solving'
  ],

  codeExamples: [
    {
      title: 'Network Layer Headers and Encapsulation',
      language: 'python',
      code: `# Network Packet Structure Simulation
import struct
import socket

class NetworkPacket:
    """Simulates network packet with different layer headers"""
    
    def __init__(self, data):
        self.original_data = data
        self.application_data = data
        self.transport_header = None
        self.network_header = None
        self.datalink_header = None
        
    def add_application_layer(self, protocol="HTTP"):
        """Application Layer - Add protocol-specific data"""
        if protocol == "HTTP":
            http_header = "GET / HTTP/1.1\\r\\nHost: example.com\\r\\n\\r\\n"
            self.application_data = http_header + self.original_data
        print(f"Application Layer: {protocol} protocol added")
        return self.application_data
    
    def add_transport_layer(self, protocol="TCP", src_port=12345, dst_port=80):
        """Transport Layer - Add TCP/UDP header"""
        if protocol == "TCP":
            # Simplified TCP header (normally 20 bytes)
            tcp_header = {
                'src_port': src_port,
                'dst_port': dst_port,
                'seq_num': 1000,
                'ack_num': 0,
                'flags': 'SYN',
                'window': 8192
            }
            self.transport_header = tcp_header
            print(f"Transport Layer: TCP header added (Port {src_port} → {dst_port})")
        elif protocol == "UDP":
            udp_header = {
                'src_port': src_port,
                'dst_port': dst_port,
                'length': len(self.application_data) + 8,
                'checksum': 0
            }
            self.transport_header = udp_header
            print(f"Transport Layer: UDP header added (Port {src_port} → {dst_port})")
        
        return self.transport_header
    
    def add_network_layer(self, src_ip="192.168.1.100", dst_ip="93.184.216.34"):
        """Network Layer - Add IP header"""
        ip_header = {
            'version': 4,
            'header_length': 20,
            'type_of_service': 0,
            'total_length': len(self.application_data) + 40,  # IP + TCP headers
            'identification': 12345,
            'flags': 0,
            'fragment_offset': 0,
            'ttl': 64,
            'protocol': 6,  # TCP
            'checksum': 0,
            'src_ip': src_ip,
            'dst_ip': dst_ip
        }
        self.network_header = ip_header
        print(f"Network Layer: IP header added ({src_ip} → {dst_ip})")
        return self.network_header
    
    def add_datalink_layer(self, src_mac="AA:BB:CC:DD:EE:FF", dst_mac="11:22:33:44:55:66"):
        """Data Link Layer - Add Ethernet header"""
        ethernet_header = {
            'dst_mac': dst_mac,
            'src_mac': src_mac,
            'ethertype': 0x0800,  # IPv4
            'fcs': 0  # Frame Check Sequence
        }
        self.datalink_header = ethernet_header
        print(f"Data Link Layer: Ethernet header added ({src_mac} → {dst_mac})")
        return self.datalink_header
    
    def display_packet_structure(self):
        """Display complete packet structure"""
        print("\\n" + "="*60)
        print("COMPLETE NETWORK PACKET STRUCTURE")
        print("="*60)
        
        print("\\n📱 APPLICATION LAYER:")
        print(f"   Data: {self.original_data[:50]}...")
        
        if self.transport_header:
            print("\\n🚚 TRANSPORT LAYER:")
            for key, value in self.transport_header.items():
                print(f"   {key}: {value}")
        
        if self.network_header:
            print("\\n🌐 NETWORK LAYER:")
            for key, value in self.network_header.items():
                print(f"   {key}: {value}")
        
        if self.datalink_header:
            print("\\n🔗 DATA LINK LAYER:")
            for key, value in self.datalink_header.items():
                print(f"   {key}: {value}")
        
        print("\\n⚡ PHYSICAL LAYER:")
        print("   Transmitted as electrical signals/light pulses")
        print("="*60)

# OSI Layer Functions Simulation
class OSILayers:
    """Demonstrates OSI layer functions"""
    
    @staticmethod
    def physical_layer(data):
        """Layer 1: Convert data to bits"""
        bits = ''.join(format(ord(char), '08b') for char in data)
        print(f"Physical Layer: {len(bits)} bits")
        return bits
    
    @staticmethod
    def datalink_layer(bits, src_mac, dst_mac):
        """Layer 2: Add MAC addresses and error detection"""
        frame = {
            'preamble': '10101010' * 7 + '10101011',
            'dst_mac': dst_mac,
            'src_mac': src_mac,
            'length': len(bits),
            'data': bits,
            'fcs': 'checksum_placeholder'
        }
        print(f"Data Link Layer: Frame created with MAC addresses")
        return frame
    
    @staticmethod
    def network_layer(frame, src_ip, dst_ip):
        """Layer 3: Add IP addresses for routing"""
        packet = {
            'version': 4,
            'src_ip': src_ip,
            'dst_ip': dst_ip,
            'ttl': 64,
            'protocol': 'TCP',
            'data': frame
        }
        print(f"Network Layer: Packet routed from {src_ip} to {dst_ip}")
        return packet
    
    @staticmethod
    def transport_layer(packet, src_port, dst_port):
        """Layer 4: Add port numbers and reliability"""
        segment = {
            'src_port': src_port,
            'dst_port': dst_port,
            'sequence': 1000,
            'acknowledgment': 0,
            'flags': ['SYN'],
            'data': packet
        }
        print(f"Transport Layer: Segment created (Port {src_port} → {dst_port})")
        return segment
    
    @staticmethod
    def session_layer(segment):
        """Layer 5: Manage communication sessions"""
        session = {
            'session_id': 'sess_12345',
            'state': 'established',
            'data': segment
        }
        print("Session Layer: Communication session established")
        return session
    
    @staticmethod
    def presentation_layer(session, encoding='utf-8'):
        """Layer 6: Handle data formatting and encryption"""
        presentation = {
            'encoding': encoding,
            'encryption': 'TLS',
            'compression': 'gzip',
            'data': session
        }
        print(f"Presentation Layer: Data formatted with {encoding} encoding")
        return presentation
    
    @staticmethod
    def application_layer(presentation, protocol='HTTP'):
        """Layer 7: Application-specific processing"""
        application = {
            'protocol': protocol,
            'service': 'web_browsing',
            'data': presentation
        }
        print(f"Application Layer: {protocol} protocol processing")
        return application

# Demo: Complete packet journey
def demonstrate_network_models():
    print("NETWORK MODELS DEMONSTRATION")
    print("="*50)
    
    # Create a simple message
    message = "Hello, World! This is a network packet."
    
    print("\\n1. TCP/IP MODEL ENCAPSULATION:")
    print("-" * 30)
    packet = NetworkPacket(message)
    packet.add_application_layer("HTTP")
    packet.add_transport_layer("TCP", 12345, 80)
    packet.add_network_layer("192.168.1.100", "93.184.216.34")
    packet.add_datalink_layer("AA:BB:CC:DD:EE:FF", "11:22:33:44:55:66")
    packet.display_packet_structure()
    
    print("\\n\\n2. OSI MODEL LAYER-BY-LAYER:")
    print("-" * 30)
    
    # Process through all OSI layers
    data = message
    bits = OSILayers.physical_layer(data)
    frame = OSILayers.datalink_layer(bits, "AA:BB:CC:DD:EE:FF", "11:22:33:44:55:66")
    packet = OSILayers.network_layer(frame, "192.168.1.100", "93.184.216.34")
    segment = OSILayers.transport_layer(packet, 12345, 80)
    session = OSILayers.session_layer(segment)
    presentation = OSILayers.presentation_layer(session)
    application = OSILayers.application_layer(presentation)
    
    print("\\n✅ Data successfully processed through all OSI layers!")

if __name__ == "__main__":
    demonstrate_network_models()`
    },
    {
      title: 'Protocol Stack Comparison',
      language: 'bash',
      code: `#!/bin/bash
# Network Models Comparison and Analysis

echo "NETWORK MODELS COMPARISON"
echo "========================="

# OSI Model Layers
echo -e "\\nOSI MODEL (7 LAYERS):"
echo "7. Application  | HTTP, HTTPS, FTP, SMTP, DNS"
echo "6. Presentation | SSL/TLS, JPEG, GIF, ASCII"
echo "5. Session      | NetBIOS, RPC, SQL Sessions"
echo "4. Transport    | TCP, UDP"
echo "3. Network      | IP, ICMP, OSPF, BGP"
echo "2. Data Link    | Ethernet, Wi-Fi, PPP"
echo "1. Physical     | Cables, Hubs, Repeaters"

# TCP/IP Model Layers
echo -e "\\nTCP/IP MODEL (4 LAYERS):"
echo "4. Application     | HTTP, FTP, SMTP, DNS (OSI 5+6+7)"
echo "3. Transport       | TCP, UDP (Same as OSI 4)"
echo "2. Internet        | IP, ICMP (Same as OSI 3)"
echo "1. Network Access  | Ethernet, Wi-Fi (OSI 1+2)"

# Layer Mapping
echo -e "\\nLAYER MAPPING:"
echo "OSI Layer 7 (Application)  ┐"
echo "OSI Layer 6 (Presentation) ├─→ TCP/IP Application Layer"
echo "OSI Layer 5 (Session)      ┘"
echo "OSI Layer 4 (Transport)    ──→ TCP/IP Transport Layer"
echo "OSI Layer 3 (Network)      ──→ TCP/IP Internet Layer"
echo "OSI Layer 2 (Data Link)    ┐"
echo "OSI Layer 1 (Physical)     ┘──→ TCP/IP Network Access Layer"

# Troubleshooting approach
echo -e "\\nTROUBLESHOoting APPROACH:"
echo "1. Physical    | Check cables, power, link lights"
echo "2. Data Link   | Check switch ports, MAC addresses"
echo "3. Network     | Check IP configuration, routing"
echo "4. Transport   | Check port connectivity, firewalls"
echo "5. Session     | Check application connections"
echo "6. Presentation| Check encryption, data format"
echo "7. Application | Check application-specific issues"

# Common protocols by layer
echo -e "\\nCOMMON PROTOCOLS BY LAYER:"
echo "Application Layer:"
echo "  - HTTP/HTTPS (Port 80/443) - Web browsing"
echo "  - FTP (Port 21) - File transfer"
echo "  - SMTP (Port 25) - Email sending"
echo "  - DNS (Port 53) - Domain name resolution"
echo "  - DHCP (Port 67/68) - IP address assignment"

echo -e "\\nTransport Layer:"
echo "  - TCP - Reliable, connection-oriented"
echo "  - UDP - Fast, connectionless"

echo -e "\\nNetwork Layer:"
echo "  - IPv4/IPv6 - Internet addressing"
echo "  - ICMP - Error reporting (ping, traceroute)"
echo "  - OSPF/BGP - Routing protocols"

echo -e "\\nData Link Layer:"
echo "  - Ethernet - Wired LAN"
echo "  - Wi-Fi (802.11) - Wireless LAN"
echo "  - ARP - MAC address resolution"

# Network commands for each layer
echo -e "\\nNETWORK COMMANDS BY LAYER:"
echo "Physical Layer:"
echo "  ethtool eth0                    # Check link status"
echo "  iwconfig                       # Wireless interface info"

echo -e "\\nData Link Layer:"
echo "  arp -a                         # View ARP table"
echo "  ip link show                   # Show network interfaces"
echo "  ifconfig                       # Interface configuration"

echo -e "\\nNetwork Layer:"
echo "  ping 8.8.8.8                   # Test connectivity"
echo "  traceroute google.com          # Trace packet path"
echo "  ip route show                  # View routing table"
echo "  netstat -rn                    # Routing table"

echo -e "\\nTransport Layer:"
echo "  netstat -tuln                  # Show listening ports"
echo "  ss -tuln                       # Socket statistics"
echo "  telnet google.com 80           # Test port connectivity"

echo -e "\\nApplication Layer:"
echo "  nslookup google.com            # DNS lookup"
echo "  curl -I http://google.com      # HTTP headers"
echo "  wget http://example.com        # Download file"

# Data flow example
echo -e "\\nDATA FLOW EXAMPLE (Sending Email):"
echo "┌─────────────────────────────────────────────────────────┐"
echo "│ SENDER SIDE (Encapsulation - Down the stack)           │"
echo "├─────────────────────────────────────────────────────────┤"
echo "│ 7. Application  │ Email client creates SMTP message    │"
echo "│ 6. Presentation │ Encrypt with TLS, encode text        │"
echo "│ 5. Session      │ Establish SMTP session               │"
echo "│ 4. Transport    │ Add TCP header (port 25)             │"
echo "│ 3. Network      │ Add IP header (source/dest IP)       │"
echo "│ 2. Data Link    │ Add Ethernet header (MAC addresses)  │"
echo "│ 1. Physical     │ Convert to electrical signals        │"
echo "└─────────────────────────────────────────────────────────┘"

echo -e "\\n┌─────────────────────────────────────────────────────────┐"
echo "│ RECEIVER SIDE (De-encapsulation - Up the stack)        │"
echo "├─────────────────────────────────────────────────────────┤"
echo "│ 1. Physical     │ Receive electrical signals           │"
echo "│ 2. Data Link    │ Process Ethernet frame               │"
echo "│ 3. Network      │ Process IP packet, check destination  │"
echo "│ 4. Transport    │ Process TCP segment, check port      │"
echo "│ 5. Session      │ Manage SMTP session                  │"
echo "│ 6. Presentation │ Decrypt TLS, decode text             │"
echo "│ 7. Application  │ Display email in mail client         │"
echo "└─────────────────────────────────────────────────────────┘"

echo -e "\\n✅ Network models provide structured approach to networking!"
echo "✅ Use OSI for learning and troubleshooting"
echo "✅ Use TCP/IP for practical implementation"`
    }
  ],

  resources: [
    { type: 'article', title: 'OSI Model - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/layers-of-osi-model/', description: 'Comprehensive guide to OSI 7-layer model' },
    { type: 'article', title: 'TCP/IP Model - Cisco', url: 'https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13769-5.html', description: 'TCP/IP protocol suite explanation' },
    { type: 'tutorial', title: 'Network Models - Khan Academy', url: 'https://www.khanacademy.org/computing/computers-and-internet', description: 'Interactive networking fundamentals' },
    { type: 'documentation', title: 'RFC 1122 - Internet Host Requirements', url: 'https://tools.ietf.org/html/rfc1122', description: 'Official TCP/IP specification' },
    { type: 'book', title: 'Computer Networks - Tanenbaum', url: 'https://www.pearson.com/store/p/computer-networks/P100000648863', description: 'Classic networking textbook' },
    { type: 'practice', title: 'Packet Tracer - Cisco', url: 'https://www.netacad.com/courses/packet-tracer', description: 'Network simulation software' },
    { type: 'video', title: 'OSI Model Explained', url: 'https://www.youtube.com/results?search_query=osi+model+explained', description: 'Visual explanation of network layers' },
    { type: 'tutorial', title: 'Wireshark Network Analysis', url: 'https://www.wireshark.org/docs/', description: 'Packet analysis and protocol inspection' }
  ],

  questions: [
    {
      question: 'What is the difference between OSI and TCP/IP models?',
      answer: 'Key differences: Layers - OSI has 7 layers, TCP/IP has 4 layers. Development - OSI is theoretical (ISO standard), TCP/IP is practical (Internet implementation). Usage - OSI for teaching/troubleshooting, TCP/IP for real networks. Layer mapping - TCP/IP Application combines OSI layers 5,6,7; TCP/IP Network Access combines OSI layers 1,2. Adoption - TCP/IP widely used in Internet, OSI mainly educational. Flexibility - OSI more detailed separation, TCP/IP more practical grouping. Both serve same purpose but different granularity and real-world application.'
    },
    {
      question: 'Explain the 7 layers of the OSI model with examples.',
      answer: 'OSI 7 layers from bottom up: (1) Physical - transmission of raw bits over physical medium (cables, wireless signals, voltage levels). (2) Data Link - node-to-node delivery using MAC addresses (Ethernet, Wi-Fi, switches). (3) Network - routing between networks using IP addresses (routers, IP, ICMP). (4) Transport - end-to-end communication with TCP/UDP (port numbers, reliability). (5) Session - establishes/manages/terminates sessions (NetBIOS, RPC). (6) Presentation - data formatting, encryption, compression (SSL/TLS, JPEG). (7) Application - network services to applications (HTTP, FTP, SMTP, DNS). Each layer adds specific functionality and headers.'
    },
    {
      question: 'How does data encapsulation work in network models?',
      answer: 'Data encapsulation adds headers at each layer when sending: Application creates Data → Transport adds TCP/UDP header (Segment) → Network adds IP header (Packet) → Data Link adds Ethernet header (Frame) → Physical converts to bits. Each layer adds control information for its functions. Receiving reverses process (de-encapsulation): Physical receives bits → Data Link processes Frame → Network processes Packet → Transport processes Segment → Application gets Data. Headers contain addressing, control, and error detection information. This layered approach enables modular network design and troubleshooting.'
    },
    {
      question: 'What are the functions of the Transport Layer?',
      answer: 'Transport Layer (Layer 4) functions: (1) End-to-end communication between applications. (2) Port numbers for application identification (HTTP=80, HTTPS=443, FTP=21). (3) Segmentation - breaks large data into smaller segments. (4) Flow control - manages data transmission rate. (5) Error detection and recovery. (6) Connection management (TCP 3-way handshake). Protocols: TCP (reliable, connection-oriented, slower) vs UDP (unreliable, connectionless, faster). TCP ensures delivery order and error correction, UDP prioritizes speed. Choice depends on application needs - web browsing uses TCP, video streaming often uses UDP.'
    },
    {
      question: 'Why do we need both MAC addresses and IP addresses?',
      answer: 'Different purposes and scopes: MAC addresses (Data Link Layer) - physical addressing for local network communication, 48-bit hardware identifier, burned into network card, used by switches for local delivery, never changes, scope limited to local network segment. IP addresses (Network Layer) - logical addressing for internetwork communication, 32-bit (IPv4) or 128-bit (IPv6), assigned by network configuration, used by routers for global routing, can change, scope covers entire Internet. Analogy: MAC address like apartment number (local), IP address like postal address (global). Both needed because local delivery requires hardware addressing, while global routing requires logical addressing.'
    },
    {
      question: 'How does the TCP/IP model map to the OSI model?',
      answer: 'TCP/IP to OSI mapping: TCP/IP Application Layer = OSI Application + Presentation + Session (layers 7,6,5) - combines all user-facing services. TCP/IP Transport Layer = OSI Transport Layer (layer 4) - same functionality for end-to-end communication. TCP/IP Internet Layer = OSI Network Layer (layer 3) - same IP routing functionality. TCP/IP Network Access Layer = OSI Data Link + Physical (layers 2,1) - combines local delivery and physical transmission. TCP/IP is more practical with fewer layers, while OSI provides more detailed theoretical framework. Real networks use TCP/IP implementation but OSI concepts for understanding and troubleshooting.'
    },
    {
      question: 'What happens at each layer when you browse a website?',
      answer: 'Website browsing through layers: (7) Application - browser creates HTTP GET request for webpage. (6) Presentation - encrypt with HTTPS/TLS if secure site. (5) Session - establish HTTP session with web server. (4) Transport - TCP adds port numbers (source random, destination 80/443), ensures reliable delivery. (3) Network - IP adds source/destination IP addresses, routers determine path. (2) Data Link - Ethernet adds MAC addresses for next hop, switches forward locally. (1) Physical - data transmitted as electrical/optical signals. Server reverses process, sends HTML response back up through layers. Browser receives and displays webpage.'
    },
    {
      question: 'How do you troubleshoot network issues using the OSI model?',
      answer: 'Layer-by-layer troubleshooting approach: (1) Physical - check cables, power, link lights, port status. Commands: ethtool, iwconfig. (2) Data Link - verify switch connectivity, MAC addresses, VLAN configuration. Commands: arp -a, ip link show. (3) Network - test IP connectivity, routing, DNS resolution. Commands: ping, traceroute, nslookup. (4) Transport - check port connectivity, firewall rules. Commands: telnet, netstat, ss. (5-7) Upper layers - test application-specific issues, authentication, data format. Start at Physical layer and work up, or use divide-and-conquer approach. Each layer has specific tools and symptoms.'
    },
    {
      question: 'What is the role of protocols in network models?',
      answer: 'Protocols define rules for communication at each layer: Physical Layer - electrical specifications (Ethernet standards). Data Link - frame format, error detection (Ethernet, Wi-Fi). Network - addressing, routing (IP, ICMP, OSPF). Transport - reliable delivery, port numbers (TCP, UDP). Session - connection management (NetBIOS, RPC). Presentation - data format, encryption (TLS, JPEG). Application - specific services (HTTP, FTP, SMTP). Protocols ensure interoperability between different vendors and systems. They specify message formats, timing, error handling, and procedures. Multiple protocols can exist at same layer for different purposes (TCP vs UDP at Transport layer).'
    },
    {
      question: 'Why is the layered approach important in networking?',
      answer: 'Layered approach benefits: (1) Modularity - each layer has specific function, can be developed independently. (2) Interoperability - standardized interfaces allow different implementations to work together. (3) Troubleshooting - systematic approach to isolate problems. (4) Scalability - changes in one layer don\'t affect others. (5) Reusability - same lower layers support multiple upper layer protocols. (6) Abstraction - each layer hides complexity from layers above. (7) Standardization - enables global Internet connectivity. Example: HTTP can run over TCP or UDP, TCP can run over IP or other network protocols. This flexibility enables innovation while maintaining compatibility.'
    }
  ]
};

export default networkModels;