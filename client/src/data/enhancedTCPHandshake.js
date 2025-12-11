export const enhancedTCPHandshake = {
  id: 'tcp-three-way-handshake',
  title: 'TCP Three-Way Handshake',
  subtitle: 'Connection Establishment Process',
  summary: 'TCP three-way handshake establishes reliable connections through synchronized sequence number exchange: SYN, SYN-ACK, ACK.',
  analogy: 'Like introducing yourself at a party: "Hi, I\'m Alice" (SYN), "Hi Alice, I\'m Bob" (SYN-ACK), "Nice to meet you Bob" (ACK) - now conversation can begin.',
  visualConcept: 'Picture two people agreeing to start a phone conversation: both must confirm they can hear each other before beginning the actual call.',
  realWorldUse: 'Every TCP connection (web browsing, email, file downloads, database connections, SSH sessions) starts with this handshake process.',
  explanation: `TCP Three-Way Handshake Process:

Purpose and Importance:
The three-way handshake is TCP's connection establishment mechanism that synchronizes sequence numbers, establishes communication parameters, and ensures both endpoints are ready for data transfer.

Step-by-Step Process:

Step 1: SYN (Synchronize)
- Client sends SYN packet to server
- Contains client's initial sequence number (ISN)
- SYN flag set to 1, ACK flag set to 0
- Client enters SYN_SENT state
- No data payload in SYN packet

Step 2: SYN-ACK (Synchronize-Acknowledge)
- Server receives SYN and responds with SYN-ACK
- Acknowledges client's SYN (ACK = client_seq + 1)
- Sends server's own initial sequence number
- Both SYN and ACK flags set to 1
- Server enters SYN_RECEIVED state

Step 3: ACK (Acknowledge)
- Client receives SYN-ACK and sends final ACK
- Acknowledges server's SYN (ACK = server_seq + 1)
- Only ACK flag set to 1
- Both client and server enter ESTABLISHED state
- Connection ready for data transfer

Sequence Number Synchronization:
Each side chooses random initial sequence number (ISN) for security. Sequence numbers track bytes sent and enable ordered delivery, duplicate detection, and flow control.

Connection States:
- CLOSED → SYN_SENT → ESTABLISHED (client)
- CLOSED → LISTEN → SYN_RECEIVED → ESTABLISHED (server)

Handshake Failure Scenarios:
- SYN timeout: Client retransmits SYN packets
- Port unreachable: Server sends RST (reset)
- SYN flood attack: Server resources exhausted
- Network issues: Packets lost or delayed

Security Considerations:
Random sequence numbers prevent sequence prediction attacks. SYN cookies defend against SYN flood attacks by encoding connection info in sequence numbers.`,

  keyPoints: [
    'Three-way handshake establishes TCP connections reliably',
    'SYN packet initiates connection with client sequence number',
    'SYN-ACK acknowledges client and provides server sequence number',
    'Final ACK confirms server acknowledgment and completes handshake',
    'Sequence numbers synchronized for ordered data delivery',
    'Both endpoints must agree before data transfer begins',
    'Connection states track handshake progress',
    'Random sequence numbers provide security against attacks',
    'Handshake failure triggers retransmission or connection abort',
    'Process ensures both sides are ready for communication'
  ],

  codeExamples: [
    {
      title: "TCP Handshake Simulation",
      language: "python",
      code: `import random
import time
from enum import Enum

class TCPState(Enum):
    CLOSED = "CLOSED"
    LISTEN = "LISTEN"
    SYN_SENT = "SYN_SENT"
    SYN_RECEIVED = "SYN_RECEIVED"
    ESTABLISHED = "ESTABLISHED"

class TCPPacket:
    def __init__(self, seq_num=0, ack_num=0, syn=False, ack=False, data=""):
        self.seq_num = seq_num
        self.ack_num = ack_num
        self.syn = syn
        self.ack = ack
        self.data = data
        self.timestamp = time.time()
    
    def __str__(self):
        flags = []
        if self.syn: flags.append("SYN")
        if self.ack: flags.append("ACK")
        return f"[{','.join(flags)}] seq={self.seq_num}, ack={self.ack_num}"

class TCPEndpoint:
    def __init__(self, name, is_server=False):
        self.name = name
        self.state = TCPState.LISTEN if is_server else TCPState.CLOSED
        self.seq_num = random.randint(1000, 9999)  # Initial Sequence Number
        self.ack_num = 0
        self.is_server = is_server
        self.log = []
    
    def log_event(self, message):
        timestamp = time.strftime("%H:%M:%S.%f")[:-3]
        entry = f"[{timestamp}] {self.name} ({self.state.value}): {message}"
        self.log.append(entry)
        print(entry)
    
    def send_syn(self):
        """Step 1: Client sends SYN"""
        if self.state == TCPState.CLOSED:
            packet = TCPPacket(seq_num=self.seq_num, syn=True)
            self.state = TCPState.SYN_SENT
            self.log_event(f"SEND SYN -> {packet}")
            return packet
        return None
    
    def receive_syn(self, packet):
        """Step 2: Server receives SYN, sends SYN-ACK"""
        if self.state == TCPState.LISTEN and packet.syn and not packet.ack:
            self.ack_num = packet.seq_num + 1
            response = TCPPacket(
                seq_num=self.seq_num,
                ack_num=self.ack_num,
                syn=True,
                ack=True
            )
            self.state = TCPState.SYN_RECEIVED
            self.log_event(f"RECV SYN <- {packet}")
            self.log_event(f"SEND SYN-ACK -> {response}")
            return response
        return None
    
    def receive_syn_ack(self, packet):
        """Step 3: Client receives SYN-ACK, sends ACK"""
        if (self.state == TCPState.SYN_SENT and 
            packet.syn and packet.ack and 
            packet.ack_num == self.seq_num + 1):
            
            self.seq_num += 1
            self.ack_num = packet.seq_num + 1
            
            response = TCPPacket(
                seq_num=self.seq_num,
                ack_num=self.ack_num,
                ack=True
            )
            self.state = TCPState.ESTABLISHED
            self.log_event(f"RECV SYN-ACK <- {packet}")
            self.log_event(f"SEND ACK -> {response}")
            self.log_event("CONNECTION ESTABLISHED!")
            return response
        return None
    
    def receive_ack(self, packet):
        """Server receives final ACK"""
        if (self.state == TCPState.SYN_RECEIVED and 
            packet.ack and not packet.syn and
            packet.ack_num == self.seq_num + 1):
            
            self.seq_num += 1
            self.state = TCPState.ESTABLISHED
            self.log_event(f"RECV ACK <- {packet}")
            self.log_event("CONNECTION ESTABLISHED!")
            return True
        return False

def simulate_handshake():
    print("=== TCP Three-Way Handshake Simulation ===\\n")
    
    # Create client and server
    client = TCPEndpoint("CLIENT", is_server=False)
    server = TCPEndpoint("SERVER", is_server=True)
    
    print("Initial States:")
    print(f"Client: {client.state.value}")
    print(f"Server: {server.state.value}\\n")
    
    # Step 1: Client sends SYN
    syn_packet = client.send_syn()
    time.sleep(0.1)
    
    # Step 2: Server processes SYN and responds with SYN-ACK
    syn_ack_packet = server.receive_syn(syn_packet)
    time.sleep(0.1)
    
    # Step 3: Client processes SYN-ACK and responds with ACK
    ack_packet = client.receive_syn_ack(syn_ack_packet)
    time.sleep(0.1)
    
    # Server processes final ACK
    server.receive_ack(ack_packet)
    
    print(f"\\nFinal States:")
    print(f"Client: {client.state.value}")
    print(f"Server: {server.state.value}")
    
    return client, server

if __name__ == "__main__":
    simulate_handshake()`
    },
    {
      title: "Real TCP Handshake Analysis",
      language: "python",
      code: `import socket
import struct
import time

class TCPAnalyzer:
    def __init__(self):
        self.connections = {}
    
    def analyze_handshake(self, host, port):
        """Analyze real TCP handshake"""
        print(f"Analyzing TCP handshake to {host}:{port}")
        
        try:
            # Create socket and connect
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            
            # Get local port before connection
            sock.bind(('', 0))
            local_port = sock.getsockname()[1]
            
            print(f"Local port: {local_port}")
            print("Initiating connection...")
            
            start_time = time.time()
            
            # This triggers the three-way handshake
            sock.connect((host, port))
            
            handshake_time = time.time() - start_time
            
            print(f"Handshake completed in {handshake_time*1000:.2f}ms")
            
            # Get connection info
            local_addr = sock.getsockname()
            remote_addr = sock.getpeername()
            
            print(f"Connection established:")
            print(f"  Local:  {local_addr[0]}:{local_addr[1]}")
            print(f"  Remote: {remote_addr[0]}:{remote_addr[1]}")
            
            # Send test data
            test_message = "Hello TCP!"
            sock.send(test_message.encode())
            
            # Try to receive response
            sock.settimeout(5.0)
            try:
                response = sock.recv(1024)
                print(f"Received: {response.decode()}")
            except socket.timeout:
                print("No response received")
            
            sock.close()
            
        except Exception as e:
            print(f"Connection failed: {e}")

class HandshakeTimer:
    def __init__(self):
        self.measurements = []
    
    def measure_handshake_time(self, host, port, count=10):
        """Measure handshake time multiple times"""
        print(f"Measuring handshake time to {host}:{port} ({count} attempts)")
        
        for i in range(count):
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                
                start_time = time.time()
                sock.connect((host, port))
                handshake_time = time.time() - start_time
                
                self.measurements.append(handshake_time * 1000)  # Convert to ms
                sock.close()
                
                print(f"Attempt {i+1}: {handshake_time*1000:.2f}ms")
                time.sleep(0.1)  # Small delay between attempts
                
            except Exception as e:
                print(f"Attempt {i+1} failed: {e}")
        
        if self.measurements:
            avg_time = sum(self.measurements) / len(self.measurements)
            min_time = min(self.measurements)
            max_time = max(self.measurements)
            
            print(f"\\nHandshake Statistics:")
            print(f"  Average: {avg_time:.2f}ms")
            print(f"  Minimum: {min_time:.2f}ms")
            print(f"  Maximum: {max_time:.2f}ms")
            print(f"  Successful: {len(self.measurements)}/{count}")

# Handshake failure simulation
class HandshakeFailures:
    @staticmethod
    def simulate_syn_timeout():
        """Simulate SYN timeout scenario"""
        print("Simulating SYN timeout...")
        
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5.0)  # 5 second timeout
            
            # Try to connect to non-existent host
            start_time = time.time()
            sock.connect(('192.0.2.1', 80))  # RFC 5737 test address
            
        except socket.timeout:
            elapsed = time.time() - start_time
            print(f"SYN timeout after {elapsed:.2f} seconds")
        except Exception as e:
            print(f"Connection failed: {e}")
        finally:
            sock.close()
    
    @staticmethod
    def simulate_connection_refused():
        """Simulate connection refused (RST response)"""
        print("Simulating connection refused...")
        
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5.0)
            
            # Try to connect to closed port
            sock.connect(('127.0.0.1', 12345))  # Likely closed port
            
        except ConnectionRefusedError:
            print("Connection refused (RST received)")
        except Exception as e:
            print(f"Connection failed: {e}")
        finally:
            sock.close()

# Usage examples
if __name__ == "__main__":
    # Analyze handshake to a real server
    analyzer = TCPAnalyzer()
    analyzer.analyze_handshake('google.com', 80)
    
    print("\\n" + "="*50 + "\\n")
    
    # Measure handshake performance
    timer = HandshakeTimer()
    timer.measure_handshake_time('google.com', 80, 5)
    
    print("\\n" + "="*50 + "\\n")
    
    # Simulate failures
    failures = HandshakeFailures()
    failures.simulate_connection_refused()`
    }
  ],

  resources: [
    { type: 'video', title: 'TCP Handshake - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/tcp-3-way-handshake-process/', description: 'Complete TCP handshake explanation' },
    { type: 'video', title: 'TCP Connection Process - YouTube', url: 'https://www.youtube.com/watch?v=xMtP5ZB3wSk', description: 'Visual TCP handshake demonstration' },
    { type: 'article', title: 'TCP Connection States - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/tcp-connection-establishment/', description: 'TCP connection states explained' },
    { type: 'article', title: 'TCP Connection Establishment RFC', url: 'https://tools.ietf.org/html/rfc793#section-3.4', description: 'Official TCP handshake specification' },
    { type: 'video', title: 'Network Security - SYN Flood', url: 'https://www.youtube.com/watch?v=CfqUtaWJUUQ', description: 'SYN flood attacks explained' },
    { type: 'tool', title: 'Wireshark TCP Analysis', url: 'https://wiki.wireshark.org/TCP', description: 'Analyzing TCP handshakes with Wireshark' },
    { type: 'article', title: 'TCP State Machine', url: 'https://www.tutorialspoint.com/tcp-state-transition-diagram', description: 'TCP state transition diagram' },
    { type: 'video', title: 'TCP Sequence Numbers', url: 'https://www.youtube.com/watch?v=WseqJo_r-bQ', description: 'TCP sequence number explanation' },
    { type: 'article', title: 'SYN Flood Protection RFC', url: 'https://tools.ietf.org/html/rfc4987', description: 'SYN flooding attacks and defenses' },
    { type: 'tool', title: 'Netstat Command', url: 'https://www.geeksforgeeks.org/netstat-command-linux/', description: 'Monitor TCP connections and states' }
  ],

  questions: [
    {
      question: "Explain the TCP three-way handshake process step by step.",
      answer: "TCP handshake steps: 1) Client sends SYN packet with initial sequence number (ISN), enters SYN_SENT state, 2) Server receives SYN, responds with SYN-ACK (acknowledges client ISN, sends own ISN), enters SYN_RECEIVED state, 3) Client receives SYN-ACK, sends ACK to acknowledge server ISN, both enter ESTABLISHED state. Connection ready for data transfer."
    },
    {
      question: "Why does TCP use three-way handshake instead of two-way?",
      answer: "Three-way prevents old duplicate SYN packets from establishing unwanted connections. Two-way (SYN, SYN-ACK) insufficient because delayed SYN from previous connection could cause server to establish connection client doesn't want. Third ACK confirms client wants current connection. Also enables bidirectional sequence number synchronization for full-duplex communication."
    },
    {
      question: "What happens if the final ACK in handshake is lost?",
      answer: "Client thinks connection established (sent ACK), server remains in SYN_RECEIVED state. Server retransmits SYN-ACK, eventually times out. When client sends data, server responds with RST since connection not recognized. Client must restart handshake. Some implementations use SYN cookies to avoid maintaining half-open connection state."
    },
    {
      question: "How are TCP initial sequence numbers (ISN) chosen?",
      answer: "ISNs should be cryptographically random for security. Early implementations used time-based incrementing, enabling sequence prediction attacks. Modern systems use secure random number generators. Random ISNs prevent: 1) Connection hijacking, 2) Confusion with old duplicate packets, 3) Sequence prediction attacks. Each connection gets unique starting sequence number."
    },
    {
      question: "What is SYN flood attack and how to prevent it?",
      answer: "SYN flood: Attacker sends many SYN packets with spoofed addresses, exhausting server resources with half-open connections. Mitigations: 1) SYN cookies - encode connection info in sequence numbers, 2) Rate limiting SYN packets, 3) Reduce SYN_RECEIVED timeout, 4) Increase connection queue size, 5) Firewall filtering, 6) Load balancers with SYN proxy."
    },
    {
      question: "What are the different TCP connection states during handshake?",
      answer: "Client states: CLOSED → SYN_SENT → ESTABLISHED. Server states: CLOSED → LISTEN → SYN_RECEIVED → ESTABLISHED. LISTEN means server waiting for connections. SYN_SENT means client sent SYN, waiting for SYN-ACK. SYN_RECEIVED means server got SYN, sent SYN-ACK, waiting for ACK. ESTABLISHED means connection ready for data."
    },
    {
      question: "Can TCP handshake carry application data?",
      answer: "Traditional handshake cannot carry data in SYN packets (security risk). TCP Fast Open (TFO) allows data in SYN for repeat connections: 1) First connection uses normal handshake, server provides cookie, 2) Subsequent connections include data in SYN with valid cookie, 3) Reduces latency by one RTT, 4) Server validates cookie before processing data."
    },
    {
      question: "What happens during simultaneous TCP connection attempts?",
      answer: "When both sides send SYN simultaneously: 1) Both enter SYN_SENT state, 2) Each receives other's SYN, responds with SYN-ACK, 3) Both enter SYN_RECEIVED state, 4) Each receives SYN-ACK, sends ACK, 5) Both enter ESTABLISHED state. Results in single connection, not two separate connections. Rare but handled correctly by TCP state machine."
    },
    {
      question: "How does TCP handle connection timeouts during handshake?",
      answer: "TCP uses exponential backoff for retransmissions: 1) Initial SYN timeout ~3 seconds, 2) Retransmit with doubled timeout (6s, 12s, 24s), 3) Usually 3-6 retries before giving up, 4) Total timeout ~75 seconds, 5) SYN_RECEIVED state has shorter timeout to prevent resource exhaustion, 6) Different OS implementations vary timeout values."
    },
    {
      question: "What security vulnerabilities exist in TCP handshake?",
      answer: "TCP handshake vulnerabilities: 1) SYN flood DoS attacks, 2) Sequence number prediction for connection hijacking, 3) RST injection attacks, 4) Connection state exhaustion, 5) Amplification attacks using spoofed addresses. Mitigations: random ISNs, SYN cookies, rate limiting, firewalls, connection limits, proper timeout values."
    }
  ]
};