export const enhancedICMP = {
  id: 'icmp-protocol',
  title: 'ICMP Protocol',
  subtitle: 'Internet Control Message Protocol and Network Diagnostics',
  summary: 'ICMP provides error reporting and diagnostic capabilities for IP networks, enabling network troubleshooting and management through messages like ping and traceroute.',
  analogy: 'Like postal service notifications - when mail cannot be delivered, ICMP sends back error messages explaining what went wrong.',
  visualConcept: 'Picture ICMP as network traffic police - monitors network conditions and reports problems, congestion, and route information back to senders.',
  realWorldUse: 'Network troubleshooting, ping utility, traceroute, path MTU discovery, network monitoring, error reporting, router communication.',
  explanation: `ICMP (Internet Control Message Protocol) Fundamentals:

ICMP Purpose and Function:
ICMP is a network layer protocol that provides error reporting and diagnostic capabilities for IP networks. It operates alongside IP to report delivery problems and provide network diagnostic information.

ICMP Message Structure:
- Type (8 bits): Message category
- Code (8 bits): Specific message within type
- Checksum (16 bits): Error detection
- Message-specific data (variable): Additional information

Common ICMP Message Types:

Error Messages:
1. Destination Unreachable (Type 3):
   - Network unreachable (Code 0)
   - Host unreachable (Code 1)
   - Protocol unreachable (Code 2)
   - Port unreachable (Code 3)
   - Fragmentation needed (Code 4)

2. Time Exceeded (Type 11):
   - TTL expired in transit (Code 0)
   - Fragment reassembly timeout (Code 1)

3. Parameter Problem (Type 12):
   - Pointer indicates error (Code 0)
   - Missing required option (Code 1)

4. Source Quench (Type 4):
   - Congestion control (deprecated)

Informational Messages:
1. Echo Request/Reply (Type 8/0):
   - Used by ping utility
   - Connectivity testing

2. Timestamp Request/Reply (Type 13/14):
   - Clock synchronization
   - Round-trip time measurement

3. Router Advertisement/Solicitation (Type 9/10):
   - Router discovery
   - Default gateway information

ICMP Applications:

Ping Utility:
- Sends Echo Request messages
- Measures round-trip time
- Tests connectivity and reachability
- Detects packet loss

Traceroute/Tracert:
- Uses TTL manipulation
- Discovers network path
- Identifies routing hops
- Measures hop-by-hop delays

Path MTU Discovery:
- Uses fragmentation needed messages
- Determines maximum transmission unit
- Optimizes packet sizes
- Reduces fragmentation

Network Monitoring:
- Error rate analysis
- Performance measurement
- Fault detection
- Quality assessment

ICMP Security Considerations:
- Information disclosure risks
- Denial of service potential
- Firewall filtering requirements
- Rate limiting necessity

ICMPv6 Enhancements:
- Neighbor Discovery Protocol
- Multicast Listener Discovery
- Path MTU Discovery improvements
- Error message improvements`,

  keyPoints: [
    'ICMP provides error reporting and diagnostic capabilities',
    'Works alongside IP to report delivery problems',
    'Echo Request/Reply used by ping utility',
    'Time Exceeded messages enable traceroute functionality',
    'Destination Unreachable indicates routing problems',
    'Path MTU Discovery optimizes packet transmission',
    'Security considerations require careful filtering',
    'ICMPv6 includes enhanced features like Neighbor Discovery',
    'Essential for network troubleshooting and monitoring',
    'Rate limiting prevents ICMP-based attacks'
  ],

  codeExamples: [
    {
      title: "ICMP Implementation and Network Diagnostics",
      language: "python",
      code: `import socket
import struct
import time
import threading
import random
import os
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

class ICMPType(Enum):
    ECHO_REPLY = 0
    DEST_UNREACHABLE = 3
    SOURCE_QUENCH = 4
    REDIRECT = 5
    ECHO_REQUEST = 8
    ROUTER_ADVERTISEMENT = 9
    ROUTER_SOLICITATION = 10
    TIME_EXCEEDED = 11
    PARAMETER_PROBLEM = 12
    TIMESTAMP_REQUEST = 13
    TIMESTAMP_REPLY = 14

class ICMPCode(Enum):
    # Destination Unreachable codes
    NET_UNREACHABLE = 0
    HOST_UNREACHABLE = 1
    PROTOCOL_UNREACHABLE = 2
    PORT_UNREACHABLE = 3
    FRAGMENTATION_NEEDED = 4
    SOURCE_ROUTE_FAILED = 5
    
    # Time Exceeded codes
    TTL_EXPIRED = 0
    FRAGMENT_TIMEOUT = 1

@dataclass
class ICMPPacket:
    type: int
    code: int
    checksum: int
    identifier: int
    sequence: int
    data: bytes
    timestamp: float

class ICMPSocket:
    def __init__(self):
        try:
            # Create raw socket (requires root/admin privileges)
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_ICMP)
        except PermissionError:
            print("Warning: Raw socket requires root privileges. Using alternative method.")
            self.socket = None
    
    def calculate_checksum(self, data: bytes) -> int:
        \"\"\"Calculate ICMP checksum\"\"\"
        # Add padding if odd length
        if len(data) % 2:
            data += b'\\x00'
        
        checksum = 0
        for i in range(0, len(data), 2):
            word = (data[i] << 8) + data[i + 1]
            checksum += word
            checksum = (checksum & 0xFFFF) + (checksum >> 16)
        
        return (~checksum) & 0xFFFF
    
    def create_icmp_packet(self, icmp_type: int, code: int, identifier: int, 
                          sequence: int, data: bytes = b'') -> bytes:
        \"\"\"Create ICMP packet\"\"\"
        # Create header with checksum = 0
        header = struct.pack('!BBHHH', icmp_type, code, 0, identifier, sequence)
        
        # Calculate checksum
        packet = header + data
        checksum = self.calculate_checksum(packet)
        
        # Recreate header with correct checksum
        header = struct.pack('!BBHHH', icmp_type, code, checksum, identifier, sequence)
        
        return header + data
    
    def parse_icmp_packet(self, packet: bytes) -> ICMPPacket:
        \"\"\"Parse received ICMP packet\"\"\"
        if len(packet) < 8:
            raise ValueError("Packet too short")
        
        icmp_type, code, checksum, identifier, sequence = struct.unpack('!BBHHH', packet[:8])
        data = packet[8:]
        
        return ICMPPacket(
            type=icmp_type,
            code=code,
            checksum=checksum,
            identifier=identifier,
            sequence=sequence,
            data=data,
            timestamp=time.time()
        )

class PingUtility:
    def __init__(self):
        self.icmp_socket = ICMPSocket()
        self.identifier = os.getpid() & 0xFFFF
        self.sequence = 0
    
    def ping(self, host: str, count: int = 4, timeout: float = 3.0) -> Dict:
        \"\"\"Ping a host and return statistics\"\"\"
        try:
            # Resolve hostname
            target_ip = socket.gethostbyname(host)
            print(f"PING {host} ({target_ip})")
            
            results = []
            packets_sent = 0
            packets_received = 0
            
            for i in range(count):
                self.sequence += 1
                packets_sent += 1
                
                # Send ping
                start_time = time.time()
                success, rtt = self.send_ping(target_ip, timeout)
                
                if success:
                    packets_received += 1
                    results.append(rtt)
                    print(f"Reply from {target_ip}: time={rtt:.1f}ms")
                else:
                    print(f"Request timeout for {target_ip}")
                
                if i < count - 1:
                    time.sleep(1)
            
            # Calculate statistics
            packet_loss = ((packets_sent - packets_received) / packets_sent) * 100
            
            stats = {
                'host': host,
                'target_ip': target_ip,
                'packets_sent': packets_sent,
                'packets_received': packets_received,
                'packet_loss': packet_loss,
                'min_rtt': min(results) if results else 0,
                'max_rtt': max(results) if results else 0,
                'avg_rtt': sum(results) / len(results) if results else 0
            }
            
            print(f"\\nPing statistics for {target_ip}:")
            print(f"Packets: Sent = {packets_sent}, Received = {packets_received}, Lost = {packets_sent - packets_received} ({packet_loss:.1f}% loss)")
            
            if results:
                print(f"Round-trip times: min = {stats['min_rtt']:.1f}ms, max = {stats['max_rtt']:.1f}ms, avg = {stats['avg_rtt']:.1f}ms")
            
            return stats
            
        except Exception as e:
            return {'error': str(e)}
    
    def send_ping(self, target_ip: str, timeout: float) -> Tuple[bool, float]:
        \"\"\"Send single ping packet\"\"\"
        if not self.icmp_socket.socket:
            # Fallback: use system ping command
            return self.system_ping(target_ip, timeout)
        
        try:
            # Create ICMP Echo Request
            data = b'Hello, ICMP!'
            packet = self.icmp_socket.create_icmp_packet(
                ICMPType.ECHO_REQUEST.value, 0, self.identifier, self.sequence, data
            )
            
            # Send packet
            start_time = time.time()
            self.icmp_socket.socket.sendto(packet, (target_ip, 0))
            
            # Wait for reply
            self.icmp_socket.socket.settimeout(timeout)
            
            while True:
                try:
                    reply_packet, addr = self.icmp_socket.socket.recvfrom(1024)
                    end_time = time.time()
                    
                    # Skip IP header (typically 20 bytes)
                    icmp_packet = self.icmp_socket.parse_icmp_packet(reply_packet[20:])
                    
                    # Check if it's our reply
                    if (icmp_packet.type == ICMPType.ECHO_REPLY.value and
                        icmp_packet.identifier == self.identifier and
                        icmp_packet.sequence == self.sequence):
                        
                        rtt = (end_time - start_time) * 1000  # Convert to milliseconds
                        return True, rtt
                        
                except socket.timeout:
                    return False, 0
                    
        except Exception as e:
            print(f"Ping error: {e}")
            return False, 0
    
    def system_ping(self, target_ip: str, timeout: float) -> Tuple[bool, float]:
        \"\"\"Fallback to system ping command\"\"\"
        import subprocess
        
        try:
            # Use system ping command
            if os.name == 'nt':  # Windows
                cmd = ['ping', '-n', '1', '-w', str(int(timeout * 1000)), target_ip]
            else:  # Unix-like
                cmd = ['ping', '-c', '1', '-W', str(int(timeout)), target_ip]
            
            start_time = time.time()
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout + 1)
            end_time = time.time()
            
            if result.returncode == 0:
                rtt = (end_time - start_time) * 1000
                return True, rtt
            else:
                return False, 0
                
        except Exception:
            return False, 0

class TracerouteUtility:
    def __init__(self):
        self.icmp_socket = ICMPSocket()
        self.identifier = os.getpid() & 0xFFFF
    
    def traceroute(self, host: str, max_hops: int = 30) -> List[Dict]:
        \"\"\"Perform traceroute to destination\"\"\"
        try:
            target_ip = socket.gethostbyname(host)
            print(f"Traceroute to {host} ({target_ip}), {max_hops} hops max")
            
            hops = []
            
            for ttl in range(1, max_hops + 1):
                hop_info = self.trace_hop(target_ip, ttl)
                hops.append(hop_info)
                
                print(f"{ttl:2d}  {hop_info['ip']:15s}  {hop_info['rtt']:.1f} ms  {hop_info['hostname']}")
                
                # Stop if we reached the destination
                if hop_info['ip'] == target_ip:
                    break
                
                # Stop if no response after several hops
                if hop_info['ip'] == '*' and ttl > 10:
                    consecutive_timeouts = sum(1 for h in hops[-5:] if h['ip'] == '*')
                    if consecutive_timeouts >= 3:
                        print("Too many consecutive timeouts, stopping")
                        break
            
            return hops
            
        except Exception as e:
            return [{'error': str(e)}]
    
    def trace_hop(self, target_ip: str, ttl: int) -> Dict:
        \"\"\"Trace single hop with specified TTL\"\"\"
        if not self.icmp_socket.socket:
            return self.system_traceroute_hop(target_ip, ttl)
        
        try:
            # Create UDP socket with specific TTL
            udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            udp_socket.setsockopt(socket.IPPROTO_IP, socket.IP_TTL, ttl)
            
            # Send UDP packet to high port (likely closed)
            port = 33434 + ttl
            start_time = time.time()
            udp_socket.sendto(b'traceroute', (target_ip, port))
            udp_socket.close()
            
            # Listen for ICMP Time Exceeded response
            self.icmp_socket.socket.settimeout(3.0)
            
            try:
                reply_packet, addr = self.icmp_socket.socket.recvfrom(1024)
                end_time = time.time()
                
                # Parse ICMP response
                icmp_packet = self.icmp_socket.parse_icmp_packet(reply_packet[20:])
                
                rtt = (end_time - start_time) * 1000
                router_ip = addr[0]
                
                # Try to resolve hostname
                try:
                    hostname = socket.gethostbyaddr(router_ip)[0]
                except:
                    hostname = router_ip
                
                return {
                    'hop': ttl,
                    'ip': router_ip,
                    'hostname': hostname,
                    'rtt': rtt,
                    'icmp_type': icmp_packet.type
                }
                
            except socket.timeout:
                return {
                    'hop': ttl,
                    'ip': '*',
                    'hostname': 'Request timed out',
                    'rtt': 0,
                    'icmp_type': None
                }
                
        except Exception as e:
            return {
                'hop': ttl,
                'ip': '*',
                'hostname': f'Error: {str(e)}',
                'rtt': 0,
                'icmp_type': None
            }
    
    def system_traceroute_hop(self, target_ip: str, ttl: int) -> Dict:
        \"\"\"Fallback to system traceroute\"\"\"
        import subprocess
        
        try:
            if os.name == 'nt':  # Windows
                cmd = ['tracert', '-h', str(ttl), '-w', '3000', target_ip]
            else:  # Unix-like
                cmd = ['traceroute', '-m', str(ttl), '-w', '3', target_ip]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
            
            # Parse output (simplified)
            if result.returncode == 0 and result.stdout:
                lines = result.stdout.strip().split('\\n')
                if len(lines) > ttl:
                    line = lines[ttl]
                    # Extract IP and timing info (simplified parsing)
                    parts = line.split()
                    if len(parts) > 2:
                        return {
                            'hop': ttl,
                            'ip': parts[1] if '(' in parts[1] else parts[0],
                            'hostname': parts[0],
                            'rtt': float(parts[2]) if parts[2].replace('.', '').isdigit() else 0,
                            'icmp_type': None
                        }
            
            return {
                'hop': ttl,
                'ip': '*',
                'hostname': 'Request timed out',
                'rtt': 0,
                'icmp_type': None
            }
            
        except Exception:
            return {
                'hop': ttl,
                'ip': '*',
                'hostname': 'Error',
                'rtt': 0,
                'icmp_type': None
            }

class ICMPMonitor:
    def __init__(self):
        self.icmp_socket = ICMPSocket()
        self.statistics = {
            'echo_requests': 0,
            'echo_replies': 0,
            'dest_unreachable': 0,
            'time_exceeded': 0,
            'other_messages': 0
        }
    
    def monitor_icmp_traffic(self, duration: int = 30):
        \"\"\"Monitor ICMP traffic for specified duration\"\"\"
        if not self.icmp_socket.socket:
            print("ICMP monitoring requires raw socket privileges")
            return
        
        print(f"Monitoring ICMP traffic for {duration} seconds...")
        start_time = time.time()
        
        self.icmp_socket.socket.settimeout(1.0)
        
        while time.time() - start_time < duration:
            try:
                packet, addr = self.icmp_socket.socket.recvfrom(1024)
                
                # Skip IP header
                icmp_packet = self.icmp_socket.parse_icmp_packet(packet[20:])
                
                # Update statistics
                self.update_statistics(icmp_packet)
                
                # Print interesting packets
                self.print_packet_info(icmp_packet, addr[0])
                
            except socket.timeout:
                continue
            except Exception as e:
                print(f"Monitor error: {e}")
                break
        
        self.print_statistics()
    
    def update_statistics(self, packet: ICMPPacket):
        \"\"\"Update ICMP statistics\"\"\"
        if packet.type == ICMPType.ECHO_REQUEST.value:
            self.statistics['echo_requests'] += 1
        elif packet.type == ICMPType.ECHO_REPLY.value:
            self.statistics['echo_replies'] += 1
        elif packet.type == ICMPType.DEST_UNREACHABLE.value:
            self.statistics['dest_unreachable'] += 1
        elif packet.type == ICMPType.TIME_EXCEEDED.value:
            self.statistics['time_exceeded'] += 1
        else:
            self.statistics['other_messages'] += 1
    
    def print_packet_info(self, packet: ICMPPacket, source_ip: str):
        \"\"\"Print interesting packet information\"\"\"
        type_name = self.get_icmp_type_name(packet.type)
        
        if packet.type in [ICMPType.DEST_UNREACHABLE.value, ICMPType.TIME_EXCEEDED.value]:
            print(f"ICMP {type_name} from {source_ip} (Code: {packet.code})")
    
    def get_icmp_type_name(self, icmp_type: int) -> str:
        \"\"\"Get human-readable ICMP type name\"\"\"
        type_names = {
            0: "Echo Reply",
            3: "Destination Unreachable",
            4: "Source Quench",
            5: "Redirect",
            8: "Echo Request",
            11: "Time Exceeded",
            12: "Parameter Problem"
        }
        return type_names.get(icmp_type, f"Type {icmp_type}")
    
    def print_statistics(self):
        \"\"\"Print ICMP statistics\"\"\"
        print("\\nICMP Traffic Statistics:")
        for msg_type, count in self.statistics.items():
            print(f"  {msg_type.replace('_', ' ').title()}: {count}")

class ICMPDemo:
    def __init__(self):
        self.ping = PingUtility()
        self.traceroute = TracerouteUtility()
        self.monitor = ICMPMonitor()
    
    def demonstrate_icmp(self):
        \"\"\"Demonstrate ICMP functionality\"\"\"
        print("=== ICMP Protocol Demonstration ===\\n")
        
        # Ping demonstration
        print("1. Ping Utility:")
        ping_result = self.ping.ping('8.8.8.8', count=3)
        
        if 'error' not in ping_result:
            print(f"Average RTT: {ping_result['avg_rtt']:.1f}ms")
            print(f"Packet Loss: {ping_result['packet_loss']:.1f}%")
        
        print("\\n" + "="*50 + "\\n")
        
        # Traceroute demonstration
        print("2. Traceroute Utility:")
        trace_result = self.traceroute.traceroute('8.8.8.8', max_hops=10)
        
        if trace_result and 'error' not in trace_result[0]:
            print(f"Path discovered with {len(trace_result)} hops")
        
        print("\\n" + "="*50 + "\\n")
        
        # ICMP monitoring (if privileges available)
        print("3. ICMP Traffic Monitoring:")
        try:
            self.monitor.monitor_icmp_traffic(duration=10)
        except Exception as e:
            print(f"Monitoring not available: {e}")

if __name__ == "__main__":
    demo = ICMPDemo()
    demo.demonstrate_icmp()`
    }
  ],

  resources: [
    { type: 'article', title: 'ICMP Protocol - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/internet-control-message-protocol-icmp/', description: 'Complete ICMP protocol explanation' },
    { type: 'video', title: 'ICMP Explained - YouTube', url: 'https://www.youtube.com/watch?v=1BF3HDljGZo', description: 'Visual explanation of ICMP messages and functions' },
    { type: 'article', title: 'ICMP Message Types - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/icmp-message-types/', description: 'Detailed ICMP message types and codes' },
    { type: 'article', title: 'ICMP RFC 792', url: 'https://tools.ietf.org/html/rfc792', description: 'Original ICMP specification' },
    { type: 'video', title: 'Ping and Traceroute - YouTube', url: 'https://www.youtube.com/watch?v=vJV-GBZ6PeM', description: 'How ping and traceroute use ICMP' },
    { type: 'article', title: 'Path MTU Discovery', url: 'https://tools.ietf.org/html/rfc1191', description: 'ICMP-based path MTU discovery' },
    { type: 'tool', title: 'Online Ping Tool', url: 'https://www.ping.eu/', description: 'Web-based ping and traceroute tools' },
    { type: 'article', title: 'ICMPv6 Protocol', url: 'https://tools.ietf.org/html/rfc4443', description: 'ICMP for IPv6 specification' },
    { type: 'video', title: 'Network Troubleshooting with ICMP', url: 'https://www.youtube.com/watch?v=G05y9UKT69s', description: 'Using ICMP for network diagnostics' },
    { type: 'tool', title: 'Wireshark ICMP Analysis', url: 'https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowStreamSection.html', description: 'Analyzing ICMP traffic with Wireshark' }
  ],

  questions: [
    {
      question: "What is ICMP and what role does it play in IP networks?",
      answer: "ICMP (Internet Control Message Protocol) is a network layer protocol that provides error reporting and diagnostic capabilities for IP networks. Functions: 1) Error reporting - notifies about delivery problems, 2) Network diagnostics - enables ping and traceroute, 3) Path MTU discovery - optimizes packet sizes, 4) Router communication - advertisements and redirects. Essential for network troubleshooting, monitoring, and optimization. Works alongside IP to ensure reliable network operation."
    },
    {
      question: "What are the main types of ICMP messages and their purposes?",
      answer: "ICMP message types: Error messages: 1) Destination Unreachable (Type 3) - network/host/port unreachable, 2) Time Exceeded (Type 11) - TTL expired, fragmentation timeout, 3) Parameter Problem (Type 12) - header errors. Informational messages: 1) Echo Request/Reply (Type 8/0) - ping utility, 2) Router Advertisement/Solicitation (Type 9/10) - router discovery, 3) Timestamp Request/Reply (Type 13/14) - time synchronization. Each type has specific codes for detailed error information."
    },
    {
      question: "How do ping and traceroute utilities use ICMP?",
      answer: "Ping uses ICMP Echo Request/Reply: 1) Sends Echo Request (Type 8) to target, 2) Target responds with Echo Reply (Type 0), 3) Measures round-trip time and packet loss. Traceroute uses TTL manipulation: 1) Sends packets with incrementing TTL values, 2) Routers send Time Exceeded (Type 11) when TTL expires, 3) Reveals path and hop-by-hop delays, 4) Continues until reaching destination. Both essential for network connectivity testing and path discovery."
    },
    {
      question: "What is Path MTU Discovery and how does ICMP enable it?",
      answer: "Path MTU Discovery determines maximum packet size for a path without fragmentation. Process: 1) Send packets with Don't Fragment (DF) bit set, 2) If packet too large, router sends ICMP Destination Unreachable with 'Fragmentation Needed' code (Type 3, Code 4), 3) Message includes MTU of next hop, 4) Sender reduces packet size and retries. Benefits: optimized transmission, reduced fragmentation overhead, improved performance. Critical for efficient data transfer across diverse network paths."
    },
    {
      question: "What security concerns are associated with ICMP?",
      answer: "ICMP security issues: 1) Information disclosure - reveals network topology and host information, 2) DoS attacks - ICMP flooding, ping of death, 3) Reconnaissance - network mapping and host discovery, 4) Covert channels - data exfiltration through ICMP payloads, 5) Amplification attacks - using ICMP for traffic amplification. Mitigations: rate limiting, filtering unnecessary ICMP types, monitoring for anomalous traffic, blocking ICMP at network borders where appropriate."
    },
    {
      question: "How does ICMPv6 differ from ICMPv4?",
      answer: "ICMPv6 enhancements: 1) Neighbor Discovery Protocol - replaces ARP functionality, 2) Multicast Listener Discovery - group membership management, 3) Path MTU Discovery improvements - better error handling, 4) New message types - packet too big, parameter problem enhancements, 5) Mandatory implementation - required for IPv6 operation, 6) Enhanced error messages - more detailed problem reporting. ICMPv6 is more integral to IPv6 operation than ICMP is to IPv4."
    },
    {
      question: "What information can network administrators gather from ICMP messages?",
      answer: "ICMP provides valuable diagnostic information: 1) Connectivity status - reachability testing, 2) Network performance - RTT measurements, packet loss, 3) Path discovery - routing paths and hop delays, 4) MTU information - optimal packet sizes, 5) Error conditions - routing problems, congestion, 6) Network topology - router locations and capabilities. Essential for troubleshooting, capacity planning, performance optimization, and network monitoring."
    },
    {
      question: "How should ICMP be configured in firewalls and security devices?",
      answer: "ICMP firewall configuration: Allow: 1) Echo Reply (outbound) - for ping responses, 2) Destination Unreachable - for proper error handling, 3) Time Exceeded - for traceroute functionality, 4) Fragmentation Needed - for Path MTU Discovery. Block/Limit: 1) Echo Request (inbound) - prevent reconnaissance, 2) Router advertisements - unless needed, 3) Rate limit all ICMP - prevent flooding. Balance security with functionality - some ICMP essential for proper network operation."
    },
    {
      question: "What are common ICMP-based network troubleshooting techniques?",
      answer: "ICMP troubleshooting techniques: 1) Ping testing - verify connectivity and measure performance, 2) Traceroute analysis - identify routing problems and bottlenecks, 3) MTU testing - find optimal packet sizes, 4) Error message analysis - diagnose specific network problems, 5) Continuous monitoring - detect intermittent issues, 6) Baseline comparison - identify performance changes. Systematic approach: start with basic connectivity, then analyze path and performance characteristics."
    },
    {
      question: "How do NAT and firewalls affect ICMP operation?",
      answer: "NAT/Firewall ICMP impacts: NAT issues: 1) ICMP error messages may not be properly translated, 2) Embedded IP addresses in ICMP payload need translation, 3) Traceroute may show NAT device instead of internal path. Firewall considerations: 1) Stateful inspection needed for ICMP sessions, 2) Some ICMP types blocked for security, 3) Rate limiting to prevent abuse. Solutions: ICMP ALGs (Application Layer Gateways), proper stateful ICMP handling, selective ICMP filtering policies."
    }
  ]
};