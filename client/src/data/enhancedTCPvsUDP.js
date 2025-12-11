export const enhancedTCPvsUDP = {
  id: 'tcp-vs-udp',
  title: 'TCP vs UDP',
  subtitle: 'Transmission Control Protocol vs User Datagram Protocol',
  summary: 'TCP provides reliable, connection-oriented communication with error recovery and flow control, while UDP offers fast, connectionless delivery with minimal overhead.',
  analogy: 'TCP is like registered mail with delivery confirmation and tracking, while UDP is like shouting across a room - immediate but no delivery guarantee.',
  visualConcept: 'Picture TCP as a phone call requiring connection setup and acknowledgments, while UDP is like broadcasting on radio - send and hope someone receives.',
  realWorldUse: 'TCP: Web browsing, email, file transfers, banking. UDP: Video streaming, online gaming, DNS queries, live broadcasts, VoIP.',
  explanation: `TCP vs UDP Detailed Comparison:

TCP (Transmission Control Protocol):
TCP is a connection-oriented, reliable transport protocol that guarantees ordered delivery of data between applications. It establishes a virtual connection before data transfer and maintains connection state throughout communication.

Key TCP Features:
- Connection-oriented (requires handshake)
- Reliable delivery with acknowledgments
- Ordered data delivery using sequence numbers
- Flow control via sliding window protocol
- Congestion control to prevent network overload
- Error detection and automatic retransmission
- Full-duplex communication
- Stream-oriented (continuous byte stream)

UDP (User Datagram Protocol):
UDP is a connectionless, unreliable transport protocol that provides minimal services with low overhead. It sends datagrams without establishing connections or guaranteeing delivery.

Key UDP Features:
- Connectionless (no handshake required)
- Unreliable delivery (best-effort)
- No ordering guarantees
- No flow control mechanisms
- No congestion control
- Minimal error detection (checksum only)
- Message-oriented (discrete datagrams)
- Lower latency and overhead

When to Use TCP:
- Data integrity is critical (file transfers, web pages, emails)
- Ordered delivery required (streaming media with buffering)
- Network reliability varies (mobile networks, internet)
- Application cannot handle data loss (databases, financial transactions)

When to Use UDP:
- Speed is more important than reliability (real-time gaming)
- Small, frequent messages (DNS queries, DHCP)
- Broadcast/multicast communication
- Application implements custom reliability (QUIC, custom protocols)
- Live streaming where old data becomes irrelevant`,

  keyPoints: [
    'TCP is connection-oriented, UDP is connectionless',
    'TCP guarantees reliable delivery, UDP provides best-effort delivery',
    'TCP maintains ordered delivery, UDP has no ordering guarantees',
    'TCP has higher overhead, UDP has minimal overhead',
    'TCP includes flow control, UDP has no flow control',
    'TCP implements congestion control, UDP does not',
    'TCP is stream-oriented, UDP is message-oriented',
    'TCP suitable for reliability-critical applications',
    'UDP ideal for real-time, speed-critical applications',
    'TCP uses acknowledgments, UDP is fire-and-forget'
  ],

  codeExamples: [
    {
      title: "TCP Socket Implementation",
      language: "python",
      code: `import socket
import threading
import time

class TCPServer:
    def __init__(self, host='localhost', port=8080):
        self.host = host
        self.port = port
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    def start(self):
        self.socket.bind((self.host, self.port))
        self.socket.listen(5)
        print(f"TCP Server listening on {self.host}:{self.port}")
        
        while True:
            client_socket, address = self.socket.accept()
            print(f"TCP Connection established with {address}")
            
            client_thread = threading.Thread(
                target=self.handle_client, 
                args=(client_socket, address)
            )
            client_thread.start()
    
    def handle_client(self, client_socket, address):
        try:
            while True:
                # Reliable data reception
                data = client_socket.recv(1024)
                if not data:
                    break
                
                message = data.decode('utf-8')
                print(f"TCP Received: {message}")
                
                # Guaranteed delivery response
                response = f"TCP Echo: {message}"
                client_socket.send(response.encode('utf-8'))
                
        except Exception as e:
            print(f"TCP Error: {e}")
        finally:
            client_socket.close()
            print(f"TCP Connection closed with {address}")

class TCPClient:
    def __init__(self, host='localhost', port=8080):
        self.host = host
        self.port = port
    
    def send_message(self, message):
        try:
            # Establish connection (3-way handshake)
            client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            client_socket.connect((self.host, self.port))
            
            # Send data reliably
            client_socket.send(message.encode('utf-8'))
            
            # Receive guaranteed response
            response = client_socket.recv(1024)
            print(f"TCP Response: {response.decode('utf-8')}")
            
        except Exception as e:
            print(f"TCP Client Error: {e}")
        finally:
            client_socket.close()

# TCP Usage Example
tcp_server = TCPServer()
server_thread = threading.Thread(target=tcp_server.start)
server_thread.daemon = True
server_thread.start()

time.sleep(1)
tcp_client = TCPClient()
tcp_client.send_message("Hello TCP!")`
    },
    {
      title: "UDP Socket Implementation",
      language: "python",
      code: `import socket
import threading
import time

class UDPServer:
    def __init__(self, host='localhost', port=8081):
        self.host = host
        self.port = port
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    def start(self):
        self.socket.bind((self.host, self.port))
        print(f"UDP Server listening on {self.host}:{self.port}")
        
        while True:
            try:
                # Connectionless reception
                data, client_address = self.socket.recvfrom(1024)
                message = data.decode('utf-8')
                print(f"UDP Received from {client_address}: {message}")
                
                # Best-effort response (no guarantee)
                response = f"UDP Echo: {message}"
                self.socket.sendto(response.encode('utf-8'), client_address)
                
            except Exception as e:
                print(f"UDP Server Error: {e}")

class UDPClient:
    def __init__(self, host='localhost', port=8081):
        self.host = host
        self.port = port
    
    def send_message(self, message):
        try:
            # No connection establishment
            client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            
            # Fire-and-forget sending
            client_socket.sendto(message.encode('utf-8'), (self.host, self.port))
            
            # Try to receive (may timeout)
            client_socket.settimeout(2.0)
            try:
                response, server = client_socket.recvfrom(1024)
                print(f"UDP Response: {response.decode('utf-8')}")
            except socket.timeout:
                print("UDP: No response (timeout)")
                
        except Exception as e:
            print(f"UDP Client Error: {e}")
        finally:
            client_socket.close()

# UDP Usage Example
udp_server = UDPServer()
server_thread = threading.Thread(target=udp_server.start)
server_thread.daemon = True
server_thread.start()

time.sleep(1)
udp_client = UDPClient()
udp_client.send_message("Hello UDP!")`
    }
  ],

  resources: [
    { type: 'video', title: 'TCP vs UDP - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/differences-between-tcp-and-udp/', description: 'Comprehensive TCP vs UDP comparison' },
    { type: 'video', title: 'TCP vs UDP Explained - YouTube', url: 'https://www.youtube.com/watch?v=uwoD5YsGACg', description: 'Visual explanation of TCP vs UDP differences' },
    { type: 'article', title: 'TCP Protocol - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/tcp-protocol/', description: 'Detailed TCP protocol explanation' },
    { type: 'article', title: 'UDP Protocol - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/user-datagram-protocol-udp/', description: 'Complete UDP protocol guide' },
    { type: 'video', title: 'Transport Layer Protocols - YouTube', url: 'https://www.youtube.com/watch?v=37AFBZv4_6Y', description: 'Transport layer protocols explained' },
    { type: 'article', title: 'TCP Specification RFC 793', url: 'https://tools.ietf.org/html/rfc793', description: 'Original TCP protocol specification' },
    { type: 'article', title: 'UDP Specification RFC 768', url: 'https://tools.ietf.org/html/rfc768', description: 'UDP protocol specification' },
    { type: 'tool', title: 'Wireshark', url: 'https://www.wireshark.org/', description: 'Network analyzer to observe TCP/UDP packets' },
    { type: 'video', title: 'Socket Programming - YouTube', url: 'https://www.youtube.com/watch?v=LtXEMwSG5-8', description: 'TCP and UDP socket programming tutorial' },
    { type: 'article', title: 'Network Programming Tutorial', url: 'https://www.tutorialspoint.com/unix_sockets/what_is_socket.htm', description: 'Socket programming with TCP and UDP' }
  ],

  questions: [
    {
      question: "What are the main differences between TCP and UDP?",
      answer: "TCP: Connection-oriented, reliable delivery, ordered data, flow/congestion control, 20-byte header, higher overhead. UDP: Connectionless, unreliable delivery, no ordering guarantees, 8-byte header, lower overhead. TCP ensures data integrity, UDP prioritizes speed. TCP for web browsing, email; UDP for gaming, streaming, DNS."
    },
    {
      question: "When would you choose UDP over TCP?",
      answer: "Choose UDP for: 1) Real-time applications (gaming, VoIP) where speed > reliability, 2) Simple request-response (DNS queries), 3) Broadcast/multicast communication, 4) Live streaming where old data becomes irrelevant, 5) High-frequency applications, 6) IoT sensors with frequent small updates, 7) Applications implementing custom reliability mechanisms."
    },
    {
      question: "How does TCP ensure reliable delivery?",
      answer: "TCP reliability mechanisms: 1) Sequence numbers for ordering and duplicate detection, 2) Acknowledgments confirm packet receipt, 3) Retransmission timers for lost packets, 4) Checksums detect data corruption, 5) Flow control prevents receiver overflow, 6) Congestion control prevents network overload. Automatic retransmission until acknowledgment or timeout."
    },
    {
      question: "Explain TCP three-way handshake process.",
      answer: "TCP handshake: 1) Client sends SYN with initial sequence number, 2) Server responds with SYN-ACK (acknowledges client SYN + sends own SYN), 3) Client sends ACK to acknowledge server SYN. Establishes connection, synchronizes sequence numbers, negotiates parameters. Required before data transmission begins."
    },
    {
      question: "What is the header size difference between TCP and UDP?",
      answer: "TCP header: 20 bytes minimum (can be up to 60 bytes with options). UDP header: 8 bytes fixed. TCP header includes sequence numbers, acknowledgment numbers, window size, flags, checksum. UDP header only has source port, destination port, length, checksum. TCP overhead is 2.5x larger minimum."
    },
    {
      question: "How do applications handle reliability with UDP?",
      answer: "UDP reliability strategies: 1) Application-level acknowledgments and retransmission, 2) Sequence numbers for ordering, 3) Timeout and retry mechanisms, 4) Forward Error Correction (FEC), 5) Custom congestion control, 6) Checksums for error detection. Examples: QUIC protocol, DNS with retry logic, TFTP with stop-and-wait ARQ."
    },
    {
      question: "What are the performance implications of TCP vs UDP?",
      answer: "TCP: Higher latency due to handshake, acknowledgments, retransmissions. Better for bulk data transfer. UDP: Lower latency, no connection setup, minimal processing overhead. Better for real-time applications. TCP throughput higher for large transfers, UDP better for small frequent messages. Choose based on application requirements."
    },
    {
      question: "Explain TCP flow control mechanism.",
      answer: "TCP flow control uses sliding window protocol: 1) Receiver advertises window size (available buffer space), 2) Sender cannot send more data than window allows, 3) Window slides as data is acknowledged, 4) Zero window stops transmission until space available, 5) Prevents fast sender from overwhelming slow receiver."
    },
    {
      question: "What is TCP congestion control and why is it needed?",
      answer: "TCP congestion control prevents network overload: 1) Slow start - exponentially increase sending rate, 2) Congestion avoidance - linear increase after threshold, 3) Fast retransmit/recovery for packet loss, 4) Reduces sending rate when congestion detected. Prevents network collapse, ensures fair bandwidth sharing among connections."
    },
    {
      question: "How do TCP and UDP handle error detection and correction?",
      answer: "Both use checksums for error detection. TCP: Detects errors and automatically retransmits corrupted/lost packets, maintains sequence numbers for ordering, provides reliable delivery. UDP: Only detects errors via checksum, discards corrupted packets, no automatic retransmission. Application must handle error recovery if needed."
    }
  ]
};