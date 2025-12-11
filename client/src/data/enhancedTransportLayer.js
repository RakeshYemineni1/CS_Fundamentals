export const enhancedTransportLayer = {
  id: 'transport-layer-protocols',
  title: 'Transport Layer Protocols',
  subtitle: 'TCP, UDP, and Network Communication Fundamentals',
  summary: 'Transport layer provides end-to-end communication services, with TCP offering reliable connection-oriented delivery and UDP providing fast connectionless communication.',
  analogy: 'Like postal services: TCP is registered mail with delivery confirmation and tracking, while UDP is regular mail - faster but no delivery guarantee.',
  visualConcept: 'Picture TCP as a phone call with handshakes and confirmations, while UDP is like shouting across a room - immediate but no guarantee of reception.',
  realWorldUse: 'Web browsing (HTTP/HTTPS over TCP), video streaming (UDP), file transfers (TCP), online gaming (UDP), email (TCP), DNS queries (UDP).',
  explanation: `Transport Layer Theory and Protocols:

**Transport Layer Overview:**
The Transport Layer (Layer 4 in OSI model) provides end-to-end communication services between applications running on different hosts. It abstracts the complexity of network communication and provides reliable or unreliable data delivery services based on application requirements.

**Key Responsibilities:**
1. **Segmentation and Reassembly**: Breaking large messages into smaller segments and reconstructing them at destination
2. **Connection Management**: Establishing, maintaining, and terminating connections (TCP)
3. **Flow Control**: Managing data transmission rate to prevent overwhelming receiver
4. **Error Detection and Recovery**: Ensuring data integrity and handling transmission errors
5. **Multiplexing**: Allowing multiple applications to use network simultaneously via port numbers

**TCP (Transmission Control Protocol) - Reliable Transport:**
TCP provides connection-oriented, reliable, ordered delivery of data streams. It guarantees that data sent by sender will be received correctly by receiver, making it suitable for applications requiring data integrity.

**TCP Characteristics:**
- Connection-oriented (requires handshake)
- Reliable delivery with acknowledgments
- Ordered data delivery
- Flow control via sliding window
- Congestion control algorithms
- Full-duplex communication
- Stream-oriented (byte stream)

**UDP (User Datagram Protocol) - Fast Transport:**
UDP provides connectionless, unreliable datagram delivery. It offers minimal transport services with low overhead, making it suitable for applications prioritizing speed over reliability.

**UDP Characteristics:**
- Connectionless (no handshake required)
- Unreliable delivery (best-effort)
- No ordering guarantees
- No flow control
- No congestion control
- Message-oriented (datagrams)
- Lower overhead and latency

**TCP Three-Way Handshake Process:**
Connection establishment involves synchronized sequence numbers and acknowledgments:
1. **SYN**: Client sends SYN packet with initial sequence number
2. **SYN-ACK**: Server responds with SYN-ACK, acknowledging client's SYN and sending own SYN
3. **ACK**: Client acknowledges server's SYN, connection established

**TCP Four-Way Termination Process:**
Connection termination requires both sides to close their data streams:
1. **FIN**: Initiator sends FIN packet
2. **ACK**: Receiver acknowledges FIN
3. **FIN**: Receiver sends its own FIN
4. **ACK**: Initiator acknowledges final FIN

**Flow Control - Sliding Window Protocol:**
TCP uses sliding window mechanism to control data flow rate, preventing fast sender from overwhelming slow receiver. Window size indicates how much unacknowledged data sender can transmit.

**Congestion Control Algorithms:**
TCP implements multiple algorithms to detect and respond to network congestion:
- **Slow Start**: Exponential increase in congestion window
- **Congestion Avoidance**: Linear increase after threshold
- **Fast Retransmit**: Immediate retransmission on duplicate ACKs
- **Fast Recovery**: Modified congestion window after fast retransmit

**Port Numbers and Multiplexing:**
Port numbers enable multiple applications to use network simultaneously. Well-known ports (0-1023) are reserved for system services, registered ports (1024-49151) for applications, and dynamic ports (49152-65535) for client connections.

**Socket Programming Fundamentals:**
Sockets provide programming interface for network communication. TCP sockets use connection-oriented model with listen/accept/connect operations, while UDP sockets use connectionless send/receive operations.`,

  keyPoints: [
    'TCP provides reliable, ordered, connection-oriented communication',
    'UDP offers fast, connectionless, best-effort delivery',
    'Three-way handshake establishes TCP connections (SYN, SYN-ACK, ACK)',
    'Four-way termination closes TCP connections gracefully',
    'Sliding window protocol provides flow control in TCP',
    'Congestion control prevents network overload and packet loss',
    'Port numbers enable application multiplexing (0-65535 range)',
    'Well-known ports (0-1023) reserved for system services',
    'Socket programming provides network communication interface',
    'TCP suitable for web, email, file transfer applications',
    'UDP ideal for streaming, gaming, DNS, real-time applications',
    'Transport layer abstracts network complexity from applications',
    'Sequence numbers ensure ordered delivery in TCP',
    'Checksums provide error detection in both TCP and UDP',
    'TCP overhead higher but provides reliability guarantees',
    'UDP minimal overhead but no delivery guarantees',
    'Full-duplex communication allows simultaneous bidirectional data flow',
    'Connection state management critical for TCP reliability',
    'Timeout and retransmission mechanisms handle packet loss',
    'Transport protocols bridge application and network layers'
  ],

  codeExamples: [
    {
      title: "TCP vs UDP Comparison Implementation",
      language: "python",
      code: `# TCP vs UDP Socket Programming Comparison

import socket
import threading
import time

# TCP Server Implementation
class TCPServer:
    def __init__(self, host='localhost', port=8080):
        self.host = host
        self.port = port
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    def start(self):
        self.socket.bind((self.host, self.port))
        self.socket.listen(5)  # Connection queue
        print(f"TCP Server listening on {self.host}:{self.port}")
        
        while True:
            try:
                client_socket, address = self.socket.accept()
                print(f"TCP Connection from {address}")
                
                # Handle client in separate thread
                client_thread = threading.Thread(
                    target=self.handle_client, 
                    args=(client_socket, address)
                )
                client_thread.start()
                
            except Exception as e:
                print(f"TCP Server error: {e}")
                break
    
    def handle_client(self, client_socket, address):
        try:
            while True:
                # Reliable, ordered data reception
                data = client_socket.recv(1024)
                if not data:
                    break
                
                message = data.decode('utf-8')
                print(f"TCP Received from {address}: {message}")
                
                # Echo back with confirmation
                response = f"TCP Echo: {message}"
                client_socket.send(response.encode('utf-8'))
                
        except Exception as e:
            print(f"TCP Client error: {e}")
        finally:
            client_socket.close()
            print(f"TCP Connection closed: {address}")

# UDP Server Implementation
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
                # Connectionless, unreliable reception
                data, address = self.socket.recvfrom(1024)
                message = data.decode('utf-8')
                print(f"UDP Received from {address}: {message}")
                
                # Send response (no connection state)
                response = f"UDP Echo: {message}"
                self.socket.sendto(response.encode('utf-8'), address)
                
            except Exception as e:
                print(f"UDP Server error: {e}")
                break

# TCP Client Implementation
class TCPClient:
    def __init__(self, host='localhost', port=8080):
        self.host = host
        self.port = port
    
    def connect_and_send(self, message):
        try:
            # Create connection-oriented socket
            client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            
            # Three-way handshake occurs here
            client_socket.connect((self.host, self.port))
            print(f"TCP Connected to {self.host}:{self.port}")
            
            # Send data reliably
            client_socket.send(message.encode('utf-8'))
            
            # Receive response
            response = client_socket.recv(1024)
            print(f"TCP Response: {response.decode('utf-8')}")
            
        except Exception as e:
            print(f"TCP Client error: {e}")
        finally:
            client_socket.close()

# UDP Client Implementation
class UDPClient:
    def __init__(self, host='localhost', port=8081):
        self.host = host
        self.port = port
    
    def send_message(self, message):
        try:
            # Create connectionless socket
            client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            
            # No handshake - direct send
            client_socket.sendto(message.encode('utf-8'), (self.host, self.port))
            print(f"UDP Sent to {self.host}:{self.port}: {message}")
            
            # Receive response (if any)
            client_socket.settimeout(2.0)  # Timeout for unreliable delivery
            try:
                response, server = client_socket.recvfrom(1024)
                print(f"UDP Response: {response.decode('utf-8')}")
            except socket.timeout:
                print("UDP No response received (timeout)")
                
        except Exception as e:
            print(f"UDP Client error: {e}")
        finally:
            client_socket.close()

# Performance Comparison
def performance_test():
    import time
    
    # TCP Performance Test
    tcp_client = TCPClient()
    start_time = time.time()
    
    for i in range(100):
        tcp_client.connect_and_send(f"TCP Message {i}")
    
    tcp_time = time.time() - start_time
    print(f"TCP 100 messages time: {tcp_time:.3f} seconds")
    
    # UDP Performance Test
    udp_client = UDPClient()
    start_time = time.time()
    
    for i in range(100):
        udp_client.send_message(f"UDP Message {i}")
    
    udp_time = time.time() - start_time
    print(f"UDP 100 messages time: {udp_time:.3f} seconds")
    
    print(f"UDP is {tcp_time/udp_time:.2f}x faster")

# Usage Example
if __name__ == "__main__":
    # Start servers in separate threads
    tcp_server = TCPServer()
    udp_server = UDPServer()
    
    tcp_thread = threading.Thread(target=tcp_server.start)
    udp_thread = threading.Thread(target=udp_server.start)
    
    tcp_thread.daemon = True
    udp_thread.daemon = True
    
    tcp_thread.start()
    udp_thread.start()
    
    # Wait for servers to start
    time.sleep(1)
    
    # Test clients
    tcp_client = TCPClient()
    udp_client = UDPClient()
    
    tcp_client.connect_and_send("Hello TCP!")
    udp_client.send_message("Hello UDP!")
    
    # Performance comparison
    performance_test()`
    },
    {
      title: "TCP Three-Way Handshake Simulation",
      language: "python",
      code: `# TCP Three-Way Handshake Detailed Implementation

import random
import time
from enum import Enum

class TCPState(Enum):
    CLOSED = "CLOSED"
    LISTEN = "LISTEN"
    SYN_SENT = "SYN_SENT"
    SYN_RECEIVED = "SYN_RECEIVED"
    ESTABLISHED = "ESTABLISHED"
    FIN_WAIT_1 = "FIN_WAIT_1"
    FIN_WAIT_2 = "FIN_WAIT_2"
    CLOSE_WAIT = "CLOSE_WAIT"
    CLOSING = "CLOSING"
    LAST_ACK = "LAST_ACK"
    TIME_WAIT = "TIME_WAIT"

class TCPPacket:
    def __init__(self, seq_num=0, ack_num=0, syn=False, ack=False, fin=False, data=""):
        self.seq_num = seq_num
        self.ack_num = ack_num
        self.syn = syn
        self.ack = ack
        self.fin = fin
        self.data = data
        self.timestamp = time.time()
    
    def __str__(self):
        flags = []
        if self.syn: flags.append("SYN")
        if self.ack: flags.append("ACK")
        if self.fin: flags.append("FIN")
        
        return f"Packet(seq={self.seq_num}, ack={self.ack_num}, flags={','.join(flags)}, data='{self.data}')"

class TCPConnection:
    def __init__(self, name, is_server=False):
        self.name = name
        self.state = TCPState.CLOSED
        self.seq_num = random.randint(1000, 9999)  # Initial sequence number
        self.ack_num = 0
        self.is_server = is_server
        self.connection_log = []
    
    def log(self, message):
        timestamp = time.strftime("%H:%M:%S", time.localtime())
        log_entry = f"[{timestamp}] {self.name} ({self.state.value}): {message}"
        self.connection_log.append(log_entry)
        print(log_entry)
    
    def send_packet(self, packet):
        self.log(f"SEND -> {packet}")
        return packet
    
    def receive_packet(self, packet):
        self.log(f"RECV <- {packet}")
        return self.process_packet(packet)
    
    def process_packet(self, packet):
        response = None
        
        if self.state == TCPState.CLOSED and self.is_server:
            # Server starts in LISTEN state
            self.state = TCPState.LISTEN
            self.log("Server ready to accept connections")
        
        if self.state == TCPState.LISTEN and packet.syn and not packet.ack:
            # Step 2: Server receives SYN, sends SYN-ACK
            self.ack_num = packet.seq_num + 1
            response = TCPPacket(
                seq_num=self.seq_num,
                ack_num=self.ack_num,
                syn=True,
                ack=True
            )
            self.state = TCPState.SYN_RECEIVED
            self.log("Received SYN, sending SYN-ACK")
            
        elif self.state == TCPState.SYN_RECEIVED and packet.ack and not packet.syn:
            # Step 3: Server receives ACK, connection established
            if packet.ack_num == self.seq_num + 1:
                self.seq_num += 1
                self.state = TCPState.ESTABLISHED
                self.log("Received ACK, connection ESTABLISHED")
            else:
                self.log("Invalid ACK number, connection failed")
        
        elif self.state == TCPState.SYN_SENT and packet.syn and packet.ack:
            # Step 3: Client receives SYN-ACK, sends ACK
            if packet.ack_num == self.seq_num + 1:
                self.seq_num += 1
                self.ack_num = packet.seq_num + 1
                response = TCPPacket(
                    seq_num=self.seq_num,
                    ack_num=self.ack_num,
                    ack=True
                )
                self.state = TCPState.ESTABLISHED
                self.log("Received SYN-ACK, sending ACK, connection ESTABLISHED")
            else:
                self.log("Invalid SYN-ACK, connection failed")
        
        elif self.state == TCPState.ESTABLISHED:
            if packet.data:
                # Data transfer
                self.ack_num = packet.seq_num + len(packet.data)
                response = TCPPacket(
                    seq_num=self.seq_num,
                    ack_num=self.ack_num,
                    ack=True
                )
                self.log(f"Received data: '{packet.data}', sending ACK")
            
            elif packet.fin:
                # Start connection termination
                self.ack_num = packet.seq_num + 1
                response = TCPPacket(
                    seq_num=self.seq_num,
                    ack_num=self.ack_num,
                    ack=True
                )
                self.state = TCPState.CLOSE_WAIT
                self.log("Received FIN, sending ACK, entering CLOSE_WAIT")
        
        return response
    
    def initiate_connection(self):
        # Step 1: Client sends SYN
        if not self.is_server and self.state == TCPState.CLOSED:
            packet = TCPPacket(seq_num=self.seq_num, syn=True)
            self.state = TCPState.SYN_SENT
            self.log("Initiating connection, sending SYN")
            return packet
        return None
    
    def send_data(self, data):
        if self.state == TCPState.ESTABLISHED:
            packet = TCPPacket(
                seq_num=self.seq_num,
                ack_num=self.ack_num,
                data=data
            )
            self.seq_num += len(data)
            self.log(f"Sending data: '{data}'")
            return packet
        else:
            self.log("Cannot send data: connection not established")
            return None
    
    def initiate_close(self):
        if self.state == TCPState.ESTABLISHED:
            packet = TCPPacket(
                seq_num=self.seq_num,
                ack_num=self.ack_num,
                fin=True
            )
            self.state = TCPState.FIN_WAIT_1
            self.log("Initiating close, sending FIN")
            return packet
        return None

# Simulation of TCP Three-Way Handshake
def simulate_tcp_handshake():
    print("=== TCP Three-Way Handshake Simulation ===\\n")
    
    # Create client and server
    client = TCPConnection("CLIENT", is_server=False)
    server = TCPConnection("SERVER", is_server=True)
    
    # Step 1: Client initiates connection
    syn_packet = client.initiate_connection()
    
    # Step 2: Server processes SYN and responds with SYN-ACK
    syn_ack_packet = server.receive_packet(syn_packet)
    
    # Step 3: Client processes SYN-ACK and responds with ACK
    ack_packet = client.receive_packet(syn_ack_packet)
    
    # Server processes final ACK
    server.receive_packet(ack_packet)
    
    print(f"\\nHandshake Complete!")
    print(f"Client State: {client.state.value}")
    print(f"Server State: {server.state.value}")
    
    # Data transfer example
    print("\\n=== Data Transfer ===")
    data_packet = client.send_data("Hello, Server!")
    ack_response = server.receive_packet(data_packet)
    client.receive_packet(ack_response)
    
    # Connection termination example
    print("\\n=== Connection Termination ===")
    fin_packet = client.initiate_close()
    server.receive_packet(fin_packet)
    
    return client, server

# Advanced TCP State Machine
class TCPStateMachine:
    def __init__(self):
        self.transitions = {
            (TCPState.CLOSED, "passive_open"): TCPState.LISTEN,
            (TCPState.CLOSED, "active_open"): TCPState.SYN_SENT,
            (TCPState.LISTEN, "syn_received"): TCPState.SYN_RECEIVED,
            (TCPState.SYN_SENT, "syn_ack_received"): TCPState.ESTABLISHED,
            (TCPState.SYN_RECEIVED, "ack_received"): TCPState.ESTABLISHED,
            (TCPState.ESTABLISHED, "fin_received"): TCPState.CLOSE_WAIT,
            (TCPState.ESTABLISHED, "close"): TCPState.FIN_WAIT_1,
            (TCPState.FIN_WAIT_1, "ack_received"): TCPState.FIN_WAIT_2,
            (TCPState.FIN_WAIT_2, "fin_received"): TCPState.TIME_WAIT,
            (TCPState.CLOSE_WAIT, "close"): TCPState.LAST_ACK,
            (TCPState.LAST_ACK, "ack_received"): TCPState.CLOSED,
            (TCPState.TIME_WAIT, "timeout"): TCPState.CLOSED
        }
    
    def transition(self, current_state, event):
        return self.transitions.get((current_state, event), current_state)

if __name__ == "__main__":
    client, server = simulate_tcp_handshake()
    
    print("\\n=== Connection Log Summary ===")
    print("\\nClient Log:")
    for entry in client.connection_log:
        print(entry)
    
    print("\\nServer Log:")
    for entry in server.connection_log:
        print(entry)`
    },
    {
      title: "Flow Control and Congestion Control",
      language: "python",
      code: `# TCP Flow Control (Sliding Window) and Congestion Control Implementation

import time
import threading
import queue
from collections import deque

class SlidingWindow:
    def __init__(self, window_size=4):
        self.window_size = window_size
        self.base = 0  # Oldest unacknowledged packet
        self.next_seq_num = 0  # Next packet to send
        self.buffer = {}  # Sent but unacknowledged packets
        self.ack_received = {}  # Acknowledgment tracking
        self.lock = threading.Lock()
    
    def can_send(self):
        """Check if we can send more packets within window"""
        with self.lock:
            return self.next_seq_num < self.base + self.window_size
    
    def send_packet(self, data):
        """Send packet if window allows"""
        with self.lock:
            if self.can_send():
                seq_num = self.next_seq_num
                self.buffer[seq_num] = {
                    'data': data,
                    'timestamp': time.time(),
                    'retransmitted': False
                }
                self.next_seq_num += 1
                print(f"SEND: Packet {seq_num} (data: {data}) [Window: {self.base}-{self.base + self.window_size - 1}]")
                return seq_num
            else:
                print(f"BLOCKED: Window full [Window: {self.base}-{self.base + self.window_size - 1}]")
                return None
    
    def receive_ack(self, ack_num):
        """Process acknowledgment and slide window"""
        with self.lock:
            if ack_num >= self.base:
                # Cumulative acknowledgment - all packets up to ack_num are acknowledged
                for seq in range(self.base, ack_num + 1):
                    if seq in self.buffer:
                        del self.buffer[seq]
                        self.ack_received[seq] = time.time()
                
                old_base = self.base
                self.base = ack_num + 1
                print(f"ACK: Received ACK {ack_num}, window slides from {old_base} to {self.base}")
                return True
            else:
                print(f"ACK: Duplicate/old ACK {ack_num} (base: {self.base})")
                return False
    
    def get_unacked_packets(self):
        """Get packets that need retransmission"""
        with self.lock:
            current_time = time.time()
            timeout_packets = []
            
            for seq_num, packet_info in self.buffer.items():
                if current_time - packet_info['timestamp'] > 1.0:  # 1 second timeout
                    timeout_packets.append((seq_num, packet_info['data']))
            
            return timeout_packets

class CongestionControl:
    def __init__(self):
        self.cwnd = 1  # Congestion window (in packets)
        self.ssthresh = 64  # Slow start threshold
        self.state = "slow_start"  # slow_start, congestion_avoidance, fast_recovery
        self.duplicate_acks = 0
        self.last_ack = -1
        self.rtt_samples = deque(maxlen=10)
        self.rto = 1.0  # Retransmission timeout
    
    def on_ack_received(self, ack_num, rtt=None):
        """Update congestion window on ACK reception"""
        if rtt:
            self.rtt_samples.append(rtt)
            self.update_rto()
        
        if ack_num > self.last_ack:
            # New ACK received
            self.duplicate_acks = 0
            self.last_ack = ack_num
            
            if self.state == "slow_start":
                # Exponential increase
                self.cwnd += 1
                print(f"SLOW START: cwnd increased to {self.cwnd}")
                
                if self.cwnd >= self.ssthresh:
                    self.state = "congestion_avoidance"
                    print(f"Entering CONGESTION AVOIDANCE (ssthresh: {self.ssthresh})")
            
            elif self.state == "congestion_avoidance":
                # Linear increase: cwnd += 1/cwnd per ACK
                self.cwnd += 1.0 / self.cwnd
                print(f"CONGESTION AVOIDANCE: cwnd = {self.cwnd:.2f}")
            
            elif self.state == "fast_recovery":
                # Exit fast recovery
                self.cwnd = self.ssthresh
                self.state = "congestion_avoidance"
                print(f"EXIT FAST RECOVERY: cwnd = {self.cwnd}")
        
        elif ack_num == self.last_ack:
            # Duplicate ACK
            self.duplicate_acks += 1
            print(f"DUPLICATE ACK #{self.duplicate_acks} for packet {ack_num}")
            
            if self.duplicate_acks == 3:
                # Fast retransmit trigger
                self.fast_retransmit()
    
    def fast_retransmit(self):
        """Handle fast retransmit and fast recovery"""
        print("FAST RETRANSMIT triggered!")
        
        # Set ssthresh to half of current cwnd
        self.ssthresh = max(self.cwnd / 2, 2)
        self.cwnd = self.ssthresh + 3  # Fast recovery
        self.state = "fast_recovery"
        
        print(f"FAST RECOVERY: ssthresh = {self.ssthresh}, cwnd = {self.cwnd}")
    
    def on_timeout(self):
        """Handle retransmission timeout"""
        print("TIMEOUT occurred!")
        
        # Multiplicative decrease
        self.ssthresh = max(self.cwnd / 2, 2)
        self.cwnd = 1
        self.state = "slow_start"
        self.duplicate_acks = 0
        
        print(f"TIMEOUT RECOVERY: ssthresh = {self.ssthresh}, cwnd = {self.cwnd}")
    
    def update_rto(self):
        """Update retransmission timeout based on RTT samples"""
        if self.rtt_samples:
            srtt = sum(self.rtt_samples) / len(self.rtt_samples)
            rttvar = sum(abs(rtt - srtt) for rtt in self.rtt_samples) / len(self.rtt_samples)
            self.rto = srtt + 4 * rttvar
            self.rto = max(0.2, min(self.rto, 2.0))  # Clamp between 200ms and 2s
    
    def get_send_window(self):
        """Get effective sending window (min of congestion and flow control)"""
        return int(self.cwnd)

class TCPSender:
    def __init__(self, receiver_window_size=8):
        self.sliding_window = SlidingWindow(receiver_window_size)
        self.congestion_control = CongestionControl()
        self.data_queue = queue.Queue()
        self.running = True
        self.stats = {
            'packets_sent': 0,
            'packets_retransmitted': 0,
            'acks_received': 0,
            'timeouts': 0
        }
    
    def send_data(self, data_list):
        """Add data to send queue"""
        for data in data_list:
            self.data_queue.put(data)
    
    def sender_loop(self):
        """Main sender loop with flow and congestion control"""
        while self.running:
            try:
                # Check effective window size
                flow_window = self.sliding_window.window_size - (
                    self.sliding_window.next_seq_num - self.sliding_window.base
                )
                congestion_window = self.congestion_control.get_send_window()
                effective_window = min(flow_window, congestion_window)
                
                # Send packets within window
                if effective_window > 0 and not self.data_queue.empty():
                    try:
                        data = self.data_queue.get_nowait()
                        seq_num = self.sliding_window.send_packet(data)
                        if seq_num is not None:
                            self.stats['packets_sent'] += 1
                            print(f"Effective window: {effective_window} (flow: {flow_window}, congestion: {congestion_window:.1f})")
                    except queue.Empty:
                        pass
                
                # Check for timeouts and retransmit
                timeout_packets = self.sliding_window.get_unacked_packets()
                for seq_num, data in timeout_packets:
                    print(f"RETRANSMIT: Packet {seq_num} (data: {data})")
                    self.stats['packets_retransmitted'] += 1
                    self.stats['timeouts'] += 1
                    self.congestion_control.on_timeout()
                    # Update timestamp for retransmitted packet
                    self.sliding_window.buffer[seq_num]['timestamp'] = time.time()
                    self.sliding_window.buffer[seq_num]['retransmitted'] = True
                
                time.sleep(0.1)  # Simulation delay
                
            except Exception as e:
                print(f"Sender error: {e}")
                break
    
    def receive_ack(self, ack_num, rtt=None):
        """Process received acknowledgment"""
        if self.sliding_window.receive_ack(ack_num):
            self.stats['acks_received'] += 1
            self.congestion_control.on_ack_received(ack_num, rtt)
    
    def print_stats(self):
        """Print transmission statistics"""
        print("\\n=== Transmission Statistics ===")
        for key, value in self.stats.items():
            print(f"{key.replace('_', ' ').title()}: {value}")
        print(f"Final cwnd: {self.congestion_control.cwnd:.2f}")
        print(f"Final ssthresh: {self.congestion_control.ssthresh}")
        print(f"Final state: {self.congestion_control.state}")

# Simulation
def simulate_tcp_flow_control():
    print("=== TCP Flow Control and Congestion Control Simulation ===\\n")
    
    sender = TCPSender(receiver_window_size=6)
    
    # Start sender thread
    sender_thread = threading.Thread(target=sender.sender_loop)
    sender_thread.daemon = True
    sender_thread.start()
    
    # Send data
    data_to_send = [f"Data_{i}" for i in range(20)]
    sender.send_data(data_to_send)
    
    # Simulate ACK reception with varying patterns
    time.sleep(0.5)
    
    # Normal ACKs
    for i in range(5):
        sender.receive_ack(i, rtt=0.1)
        time.sleep(0.2)
    
    # Simulate packet loss (duplicate ACKs)
    print("\\n--- Simulating packet loss ---")
    for _ in range(3):
        sender.receive_ack(4, rtt=0.1)  # Duplicate ACK
        time.sleep(0.1)
    
    # Resume normal ACKs
    for i in range(5, 15):
        sender.receive_ack(i, rtt=0.15)
        time.sleep(0.1)
    
    time.sleep(2)
    sender.running = False
    sender.print_stats()

if __name__ == "__main__":
    simulate_tcp_flow_control()`
    },
    {
      title: "Socket Programming Examples",
      language: "python",
      code: `# Comprehensive Socket Programming Examples

import socket
import threading
import select
import struct
import json
import time

# Well-known port numbers
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

class AdvancedTCPServer:
    def __init__(self, host='localhost', port=8080, max_connections=5):
        self.host = host
        self.port = port
        self.max_connections = max_connections
        self.clients = {}
        self.running = False
        
        # Create socket with options
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        # Enable keep-alive
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
        
        # Set TCP_NODELAY (disable Nagle's algorithm)
        self.socket.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
    
    def start(self):
        """Start the TCP server with advanced features"""
        try:
            self.socket.bind((self.host, self.port))
            self.socket.listen(self.max_connections)
            self.running = True
            
            print(f"Advanced TCP Server started on {self.host}:{self.port}")
            print(f"Max connections: {self.max_connections}")
            
            while self.running:
                try:
                    # Accept new connection
                    client_socket, address = self.socket.accept()
                    
                    # Configure client socket
                    client_socket.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
                    client_socket.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
                    
                    print(f"New connection from {address}")
                    
                    # Store client info
                    client_id = f"{address[0]}:{address[1]}"
                    self.clients[client_id] = {
                        'socket': client_socket,
                        'address': address,
                        'connected_at': time.time(),
                        'bytes_received': 0,
                        'bytes_sent': 0
                    }
                    
                    # Handle client in separate thread
                    client_thread = threading.Thread(
                        target=self.handle_client,
                        args=(client_socket, address, client_id)
                    )
                    client_thread.daemon = True
                    client_thread.start()
                    
                except socket.error as e:
                    if self.running:
                        print(f"Accept error: {e}")
                    break
                    
        except Exception as e:
            print(f"Server error: {e}")
        finally:
            self.cleanup()
    
    def handle_client(self, client_socket, address, client_id):
        """Handle individual client connection"""
        try:
            while self.running:
                # Receive data with timeout
                client_socket.settimeout(30.0)  # 30 second timeout
                
                try:
                    # Receive message length first (4 bytes)
                    length_data = self.recv_all(client_socket, 4)
                    if not length_data:
                        break
                    
                    message_length = struct.unpack('!I', length_data)[0]
                    
                    # Receive actual message
                    message_data = self.recv_all(client_socket, message_length)
                    if not message_data:
                        break
                    
                    # Update statistics
                    self.clients[client_id]['bytes_received'] += len(length_data) + len(message_data)
                    
                    # Process message
                    try:
                        message = json.loads(message_data.decode('utf-8'))
                        response = self.process_message(message, client_id)
                        
                        # Send response
                        response_data = json.dumps(response).encode('utf-8')
                        response_length = struct.pack('!I', len(response_data))
                        
                        client_socket.send(response_length + response_data)
                        self.clients[client_id]['bytes_sent'] += len(response_length) + len(response_data)
                        
                    except json.JSONDecodeError:
                        error_response = {"error": "Invalid JSON format"}
                        self.send_response(client_socket, error_response)
                
                except socket.timeout:
                    print(f"Client {address} timed out")
                    break
                except socket.error as e:
                    print(f"Client {address} error: {e}")
                    break
                    
        except Exception as e:
            print(f"Client handler error: {e}")
        finally:
            self.disconnect_client(client_id)
    
    def recv_all(self, sock, length):
        """Receive exactly 'length' bytes"""
        data = b''
        while len(data) < length:
            chunk = sock.recv(length - len(data))
            if not chunk:
                return None
            data += chunk
        return data
    
    def process_message(self, message, client_id):
        """Process received message and generate response"""
        command = message.get('command', '')
        
        if command == 'echo':
            return {
                'status': 'success',
                'response': message.get('data', ''),
                'timestamp': time.time()
            }
        elif command == 'stats':
            client_info = self.clients.get(client_id, {})
            return {
                'status': 'success',
                'client_stats': {
                    'bytes_received': client_info.get('bytes_received', 0),
                    'bytes_sent': client_info.get('bytes_sent', 0),
                    'connected_duration': time.time() - client_info.get('connected_at', 0)
                },
                'server_stats': {
                    'active_connections': len(self.clients),
                    'total_clients': len(self.clients)
                }
            }
        elif command == 'broadcast':
            message_text = message.get('data', '')
            self.broadcast_message(message_text, exclude_client=client_id)
            return {'status': 'success', 'message': 'Broadcast sent'}
        else:
            return {'status': 'error', 'message': 'Unknown command'}
    
    def broadcast_message(self, message, exclude_client=None):
        """Broadcast message to all connected clients"""
        broadcast_data = {
            'type': 'broadcast',
            'message': message,
            'timestamp': time.time()
        }
        
        for client_id, client_info in list(self.clients.items()):
            if client_id != exclude_client:
                try:
                    self.send_response(client_info['socket'], broadcast_data)
                except:
                    self.disconnect_client(client_id)
    
    def send_response(self, client_socket, response):
        """Send response to client"""
        response_data = json.dumps(response).encode('utf-8')
        response_length = struct.pack('!I', len(response_data))
        client_socket.send(response_length + response_data)
    
    def disconnect_client(self, client_id):
        """Disconnect and cleanup client"""
        if client_id in self.clients:
            try:
                self.clients[client_id]['socket'].close()
            except:
                pass
            del self.clients[client_id]
            print(f"Client {client_id} disconnected")
    
    def cleanup(self):
        """Cleanup server resources"""
        self.running = False
        for client_id in list(self.clients.keys()):
            self.disconnect_client(client_id)
        try:
            self.socket.close()
        except:
            pass
        print("Server cleaned up")

class AdvancedTCPClient:
    def __init__(self, host='localhost', port=8080):
        self.host = host
        self.port = port
        self.socket = None
        self.connected = False
    
    def connect(self):
        """Connect to server with advanced options"""
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            
            # Set socket options
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
            self.socket.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
            
            # Connect with timeout
            self.socket.settimeout(10.0)
            self.socket.connect((self.host, self.port))
            self.connected = True
            
            print(f"Connected to {self.host}:{self.port}")
            
            # Start receiver thread
            receiver_thread = threading.Thread(target=self.receive_messages)
            receiver_thread.daemon = True
            receiver_thread.start()
            
            return True
            
        except Exception as e:
            print(f"Connection error: {e}")
            return False
    
    def send_message(self, command, data=None):
        """Send message to server"""
        if not self.connected:
            print("Not connected to server")
            return False
        
        try:
            message = {'command': command}
            if data is not None:
                message['data'] = data
            
            message_data = json.dumps(message).encode('utf-8')
            message_length = struct.pack('!I', len(message_data))
            
            self.socket.send(message_length + message_data)
            return True
            
        except Exception as e:
            print(f"Send error: {e}")
            self.connected = False
            return False
    
    def receive_messages(self):
        """Receive messages from server"""
        while self.connected:
            try:
                # Receive message length
                length_data = self.recv_all(4)
                if not length_data:
                    break
                
                message_length = struct.unpack('!I', length_data)[0]
                
                # Receive message
                message_data = self.recv_all(message_length)
                if not message_data:
                    break
                
                message = json.loads(message_data.decode('utf-8'))
                self.handle_message(message)
                
            except Exception as e:
                print(f"Receive error: {e}")
                break
        
        self.connected = False
    
    def recv_all(self, length):
        """Receive exactly 'length' bytes"""
        data = b''
        while len(data) < length:
            chunk = self.socket.recv(length - len(data))
            if not chunk:
                return None
            data += chunk
        return data
    
    def handle_message(self, message):
        """Handle received message"""
        msg_type = message.get('type', 'response')
        
        if msg_type == 'broadcast':
            print(f"[BROADCAST] {message.get('message', '')}")
        else:
            print(f"[RESPONSE] {message}")
    
    def disconnect(self):
        """Disconnect from server"""
        self.connected = False
        if self.socket:
            try:
                self.socket.close()
            except:
                pass
        print("Disconnected from server")

# UDP Socket Example with Port Scanning
class UDPPortScanner:
    def __init__(self):
        self.open_ports = []
        self.closed_ports = []
    
    def scan_port(self, host, port, timeout=1):
        """Scan single UDP port"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.settimeout(timeout)
            
            # Send empty datagram
            sock.sendto(b'', (host, port))
            
            try:
                # Try to receive response
                data, addr = sock.recvfrom(1024)
                self.open_ports.append(port)
                return True
            except socket.timeout:
                # No response - port might be open but service doesn't respond
                # or port is filtered
                return None
            
        except Exception as e:
            self.closed_ports.append(port)
            return False
        finally:
            sock.close()
    
    def scan_common_ports(self, host):
        """Scan common UDP ports"""
        common_udp_ports = [53, 67, 68, 69, 123, 161, 162, 514, 1194, 5353]
        
        print(f"Scanning common UDP ports on {host}...")
        
        for port in common_udp_ports:
            result = self.scan_port(host, port)
            service = WELL_KNOWN_PORTS.get(port, "Unknown")
            
            if result is True:
                print(f"Port {port} ({service}): OPEN")
            elif result is False:
                print(f"Port {port} ({service}): CLOSED")
            else:
                print(f"Port {port} ({service}): FILTERED/NO_RESPONSE")

# Example usage and testing
def demonstrate_socket_programming():
    print("=== Socket Programming Demonstration ===\\n")
    
    # Start server in background
    server = AdvancedTCPServer(port=8080)
    server_thread = threading.Thread(target=server.start)
    server_thread.daemon = True
    server_thread.start()
    
    time.sleep(1)  # Wait for server to start
    
    # Create clients
    client1 = AdvancedTCPClient(port=8080)
    client2 = AdvancedTCPClient(port=8080)
    
    if client1.connect() and client2.connect():
        time.sleep(0.5)
        
        # Test various commands
        client1.send_message('echo', 'Hello from client 1!')
        time.sleep(0.2)
        
        client2.send_message('echo', 'Hello from client 2!')
        time.sleep(0.2)
        
        client1.send_message('stats')
        time.sleep(0.2)
        
        client1.send_message('broadcast', 'This is a broadcast message!')
        time.sleep(0.5)
        
        # Cleanup
        client1.disconnect()
        client2.disconnect()
    
    # UDP port scanning example
    print("\\n=== UDP Port Scanning ===")
    scanner = UDPPortScanner()
    scanner.scan_common_ports('127.0.0.1')
    
    server.cleanup()

if __name__ == "__main__":
    demonstrate_socket_programming()`
    }
  ],

  resources: [
    { type: 'article', title: 'TCP/IP Protocol Suite', url: 'https://www.ietf.org/rfc/rfc793.txt', description: 'Original TCP specification RFC 793' },
    { type: 'article', title: 'UDP Protocol Specification', url: 'https://www.ietf.org/rfc/rfc768.txt', description: 'UDP specification RFC 768' },
    { type: 'book', title: 'TCP/IP Illustrated', url: 'https://www.pearson.com/store/p/tcp-ip-illustrated-volume-1-the-protocols/P100000148832', description: 'Comprehensive TCP/IP protocol analysis' },
    { type: 'article', title: 'Socket Programming Guide', url: 'https://beej.us/guide/bgnet/', description: 'Beej\'s Guide to Network Programming' },
    { type: 'tool', title: 'Wireshark', url: 'https://www.wireshark.org/', description: 'Network protocol analyzer for packet inspection' },
    { type: 'article', title: 'TCP Congestion Control', url: 'https://tools.ietf.org/html/rfc5681', description: 'TCP congestion control algorithms RFC' },
    { type: 'article', title: 'Well-Known Port Numbers', url: 'https://www.iana.org/assignments/service-names-port-numbers/', description: 'IANA port number assignments' },
    { type: 'tool', title: 'netstat', url: 'https://linux.die.net/man/8/netstat', description: 'Network statistics and connection monitoring tool' }
  ],

  questions: [
    {
      question: "What are the main differences between TCP and UDP?",
      answer: "TCP vs UDP: TCP is connection-oriented, reliable, ordered delivery with flow/congestion control, error recovery, and higher overhead. UDP is connectionless, unreliable, no ordering guarantees, no flow control, minimal overhead, faster transmission. TCP suitable for web browsing, email, file transfer. UDP ideal for streaming, gaming, DNS, real-time applications where speed matters more than reliability."
    },
    {
      question: "Explain the TCP three-way handshake process in detail.",
      answer: "TCP three-way handshake: 1) Client sends SYN packet with initial sequence number to server, 2) Server responds with SYN-ACK packet, acknowledging client's SYN and sending own SYN with server's sequence number, 3) Client sends ACK packet acknowledging server's SYN. After handshake, connection is established and both sides can send data. This process synchronizes sequence numbers and establishes reliable communication channel."
    },
    {
      question: "How does TCP flow control work with sliding window protocol?",
      answer: "TCP flow control uses sliding window protocol: Receiver advertises window size indicating buffer space available. Sender can transmit up to window size bytes without acknowledgment. As ACKs arrive, window slides forward allowing more data transmission. If receiver buffer fills, window size becomes zero, stopping sender. This prevents fast sender from overwhelming slow receiver, ensuring reliable data delivery."
    },
    {
      question: "What is TCP congestion control and what algorithms are used?",
      answer: "TCP congestion control prevents network overload: 1) Slow Start - exponentially increase congestion window until threshold, 2) Congestion Avoidance - linear increase after threshold, 3) Fast Retransmit - immediate retransmission on 3 duplicate ACKs, 4) Fast Recovery - modified window after fast retransmit. Algorithms: Tahoe, Reno, New Reno, CUBIC. Goal is maximizing throughput while avoiding network collapse."
    },
    {
      question: "Explain the TCP four-way termination process.",
      answer: "TCP four-way termination (graceful close): 1) Initiator sends FIN packet indicating no more data to send, 2) Receiver sends ACK acknowledging FIN, 3) Receiver sends its own FIN when ready to close, 4) Initiator sends final ACK. Both directions must be closed independently since TCP is full-duplex. TIME_WAIT state ensures all packets are received before connection fully closes."
    },
    {
      question: "What are port numbers and how are they categorized?",
      answer: "Port numbers enable application multiplexing (0-65535): 1) Well-known ports (0-1023) - reserved for system services (HTTP:80, HTTPS:443, SSH:22, DNS:53), 2) Registered ports (1024-49151) - assigned to applications by IANA, 3) Dynamic/Private ports (49152-65535) - used for client connections. Ports allow multiple applications to use network simultaneously by providing unique endpoints."
    },
    {
      question: "How does socket programming work for TCP and UDP?",
      answer: "Socket programming provides network communication interface: TCP sockets use connection-oriented model (socket, bind, listen, accept for server; socket, connect for client). UDP sockets use connectionless model (socket, bind, sendto/recvfrom). TCP provides stream interface with reliable delivery, UDP provides datagram interface with message boundaries. Sockets abstract network complexity and provide standard API across platforms."
    },
    {
      question: "What happens when TCP packets are lost or corrupted?",
      answer: "TCP handles packet loss/corruption: 1) Sequence numbers detect missing packets, 2) Checksums detect corruption, 3) Acknowledgments confirm receipt, 4) Retransmission timer triggers resend if ACK not received, 5) Duplicate ACKs indicate packet loss, 6) Fast retransmit resends after 3 duplicate ACKs, 7) Congestion control adjusts sending rate. TCP guarantees reliable delivery through these mechanisms."
    },
    {
      question: "How does TCP handle out-of-order packet delivery?",
      answer: "TCP handles out-of-order packets using sequence numbers: Each byte has sequence number, receiver buffers out-of-order segments, sends duplicate ACKs for expected sequence number, reassembles data in correct order before delivering to application. Receiver advertises highest in-order sequence number received. This ensures application receives data in original order despite network reordering."
    },
    {
      question: "What is the purpose of TCP keepalive mechanism?",
      answer: "TCP keepalive detects dead connections: Sends periodic probe packets when connection idle for specified time, if no response received after retries, connection declared dead and closed. Prevents resource waste from zombie connections, detects network failures, maintains connection state. Configurable parameters: keepalive time, interval, and probe count. Not part of TCP specification but widely implemented."
    },
    {
      question: "How do firewalls and NAT affect TCP and UDP connections?",
      answer: "Firewalls/NAT impact transport protocols: Firewalls filter based on ports/protocols, may block UDP traffic more aggressively than TCP. NAT translates private to public addresses, maintains connection state for TCP, uses timeout for UDP mappings. TCP connection tracking easier due to clear connection state. UDP requires application-level keepalives. Port forwarding needed for inbound connections through NAT."
    },
    {
      question: "What is TCP Nagle's algorithm and when should it be disabled?",
      answer: "Nagle's algorithm reduces small packet transmission: Delays sending small segments until ACK received or enough data accumulated, improves network efficiency by reducing packet count. Disable (TCP_NODELAY) for: interactive applications requiring low latency, real-time games, terminal applications. Trade-off between bandwidth efficiency and latency. Modern networks often disable due to increased bandwidth availability."
    },
    {
      question: "How does UDP handle reliability when needed by applications?",
      answer: "UDP applications implement custom reliability: 1) Application-level acknowledgments and retransmission, 2) Sequence numbers for ordering, 3) Checksums for error detection, 4) Timeout and retry mechanisms, 5) Flow control at application layer. Examples: QUIC protocol, DNS with retry, TFTP with ACKs. Allows customized reliability mechanisms optimized for specific use cases."
    },
    {
      question: "What are the security implications of TCP and UDP?",
      answer: "Transport layer security considerations: TCP vulnerable to SYN flood attacks, connection hijacking, sequence number prediction. UDP vulnerable to amplification attacks, spoofing. Mitigations: SYN cookies, random sequence numbers, rate limiting, source validation. Use TLS/DTLS for encryption. Firewalls filter malicious traffic. Both protocols lack built-in authentication/encryption, requiring higher-layer security."
    },
    {
      question: "How do modern TCP variants improve performance?",
      answer: "Modern TCP improvements: 1) CUBIC congestion control for high-bandwidth networks, 2) TCP BBR for better bandwidth utilization, 3) TCP Fast Open reduces handshake overhead, 4) Selective ACK (SACK) for efficient retransmission, 5) Window scaling for large windows, 6) Timestamp option for RTT measurement. These optimize TCP for modern high-speed, high-latency networks while maintaining compatibility."
    }
  ]
};