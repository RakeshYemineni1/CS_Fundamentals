export const enhancedTCPTermination = {
  id: 'tcp-four-way-termination',
  title: 'TCP Four-Way Termination',
  subtitle: 'Connection Termination Process',
  summary: 'TCP four-way termination gracefully closes connections through FIN-ACK exchanges, ensuring both directions are properly closed.',
  analogy: 'Like ending a phone conversation: "I\'m done talking" (FIN), "OK, I heard you" (ACK), "I\'m done too" (FIN), "OK, goodbye" (ACK).',
  visualConcept: 'Picture two people politely ending a conversation - each person must say goodbye and acknowledge the other\'s goodbye.',
  realWorldUse: 'Every TCP connection closure (closing web pages, ending file downloads, database disconnections, SSH logout) uses this process.',
  explanation: `TCP Four-Way Termination Process:

Purpose and Design:
TCP termination requires four packets because TCP is full-duplex - each direction must be closed independently. Unlike connection establishment, termination is asymmetric since either side can initiate closure.

Step-by-Step Process:

Step 1: FIN (Finish)
- Initiating side sends FIN packet
- Indicates "I have no more data to send"
- FIN flag set, sequence number included
- Sender enters FIN_WAIT_1 state
- Can still receive data from other side

Step 2: ACK (Acknowledge)
- Receiving side acknowledges FIN
- ACK number = FIN sequence + 1
- Receiver enters CLOSE_WAIT state
- Can still send remaining data
- Half-close state: one direction closed

Step 3: FIN (Finish)
- Receiver sends its own FIN when ready
- Indicates "I'm also done sending data"
- Receiver enters LAST_ACK state
- Waits for final acknowledgment

Step 4: ACK (Acknowledge)
- Original initiator acknowledges final FIN
- Enters TIME_WAIT state (2MSL wait)
- Receiver enters CLOSED state
- Connection fully terminated

Connection States During Termination:
- ESTABLISHED → FIN_WAIT_1 → FIN_WAIT_2 → TIME_WAIT → CLOSED (initiator)
- ESTABLISHED → CLOSE_WAIT → LAST_ACK → CLOSED (receiver)

TIME_WAIT State:
Initiator waits 2×MSL (Maximum Segment Lifetime) before final closure. Ensures:
- All packets from connection are expired
- Remote side received final ACK
- Prevents confusion with new connections using same port pair

Simultaneous Close:
Both sides can send FIN simultaneously, resulting in different state transitions but same end result.

Abortive Close (RST):
Immediate termination using RST packet, discards any pending data, no graceful closure.`,

  keyPoints: [
    'Four-way termination closes TCP connections gracefully',
    'Each direction must be closed independently (full-duplex)',
    'FIN indicates no more data to send from that direction',
    'ACK acknowledges receipt of FIN packet',
    'Half-close state allows continued data flow in one direction',
    'TIME_WAIT state prevents connection confusion',
    'Either side can initiate connection termination',
    'Simultaneous close is possible but rare',
    'RST provides immediate abortive termination',
    'Proper termination prevents resource leaks'
  ],

  codeExamples: [
    {
      title: "TCP Termination Simulation",
      language: "python",
      code: `import time
from enum import Enum

class TCPState(Enum):
    ESTABLISHED = "ESTABLISHED"
    FIN_WAIT_1 = "FIN_WAIT_1"
    FIN_WAIT_2 = "FIN_WAIT_2"
    TIME_WAIT = "TIME_WAIT"
    CLOSE_WAIT = "CLOSE_WAIT"
    LAST_ACK = "LAST_ACK"
    CLOSED = "CLOSED"

class TCPPacket:
    def __init__(self, seq_num=0, ack_num=0, fin=False, ack=False, rst=False):
        self.seq_num = seq_num
        self.ack_num = ack_num
        self.fin = fin
        self.ack = ack
        self.rst = rst
        self.timestamp = time.time()
    
    def __str__(self):
        flags = []
        if self.fin: flags.append("FIN")
        if self.ack: flags.append("ACK")
        if self.rst: flags.append("RST")
        return f"[{','.join(flags)}] seq={self.seq_num}, ack={self.ack_num}"

class TCPConnection:
    def __init__(self, name):
        self.name = name
        self.state = TCPState.ESTABLISHED
        self.seq_num = 1000
        self.ack_num = 2000
        self.log = []
        self.time_wait_start = None
    
    def log_event(self, message):
        timestamp = time.strftime("%H:%M:%S")
        entry = f"[{timestamp}] {self.name} ({self.state.value}): {message}"
        self.log.append(entry)
        print(entry)
    
    def initiate_close(self):
        """Step 1: Send FIN to close connection"""
        if self.state == TCPState.ESTABLISHED:
            packet = TCPPacket(seq_num=self.seq_num, fin=True)
            self.state = TCPState.FIN_WAIT_1
            self.log_event(f"SEND FIN -> {packet}")
            self.log_event("Initiated connection close")
            return packet
        return None
    
    def receive_fin(self, packet):
        """Receive FIN from other side"""
        if self.state == TCPState.ESTABLISHED and packet.fin:
            # Step 2: Send ACK for received FIN
            self.ack_num = packet.seq_num + 1
            ack_packet = TCPPacket(
                seq_num=self.seq_num,
                ack_num=self.ack_num,
                ack=True
            )
            self.state = TCPState.CLOSE_WAIT
            self.log_event(f"RECV FIN <- {packet}")
            self.log_event(f"SEND ACK -> {ack_packet}")
            self.log_event("Entered half-close state (can still send data)")
            return ack_packet
        
        elif self.state == TCPState.FIN_WAIT_2 and packet.fin:
            # Simultaneous close or final FIN
            self.ack_num = packet.seq_num + 1
            ack_packet = TCPPacket(
                seq_num=self.seq_num,
                ack_num=self.ack_num,
                ack=True
            )
            self.state = TCPState.TIME_WAIT
            self.time_wait_start = time.time()
            self.log_event(f"RECV FIN <- {packet}")
            self.log_event(f"SEND ACK -> {ack_packet}")
            self.log_event("Entered TIME_WAIT state (2MSL wait)")
            return ack_packet
        
        return None
    
    def receive_ack(self, packet):
        """Receive ACK packet"""
        if self.state == TCPState.FIN_WAIT_1 and packet.ack:
            if packet.ack_num == self.seq_num + 1:
                self.state = TCPState.FIN_WAIT_2
                self.log_event(f"RECV ACK <- {packet}")
                self.log_event("FIN acknowledged, waiting for peer's FIN")
                return True
        
        elif self.state == TCPState.LAST_ACK and packet.ack:
            if packet.ack_num == self.seq_num + 1:
                self.state = TCPState.CLOSED
                self.log_event(f"RECV ACK <- {packet}")
                self.log_event("Connection CLOSED")
                return True
        
        return False
    
    def send_final_fin(self):
        """Step 3: Send own FIN after receiving peer's FIN"""
        if self.state == TCPState.CLOSE_WAIT:
            packet = TCPPacket(seq_num=self.seq_num, fin=True)
            self.state = TCPState.LAST_ACK
            self.log_event(f"SEND FIN -> {packet}")
            self.log_event("Sent final FIN, waiting for ACK")
            return packet
        return None
    
    def check_time_wait(self):
        """Check if TIME_WAIT period has expired"""
        if self.state == TCPState.TIME_WAIT and self.time_wait_start:
            # Simulate 2MSL (normally 2 minutes, using 2 seconds for demo)
            if time.time() - self.time_wait_start > 2.0:
                self.state = TCPState.CLOSED
                self.log_event("TIME_WAIT expired, connection CLOSED")
                return True
        return False
    
    def send_rst(self):
        """Send RST for abortive close"""
        packet = TCPPacket(seq_num=self.seq_num, rst=True)
        self.state = TCPState.CLOSED
        self.log_event(f"SEND RST -> {packet}")
        self.log_event("Abortive close - connection RESET")
        return packet

def simulate_graceful_termination():
    print("=== TCP Four-Way Termination Simulation ===\\n")
    
    # Create two connected endpoints
    client = TCPConnection("CLIENT")
    server = TCPConnection("SERVER")
    
    print("Initial State: Both in ESTABLISHED\\n")
    
    # Step 1: Client initiates close
    fin1 = client.initiate_close()
    time.sleep(0.1)
    
    # Step 2: Server receives FIN and sends ACK
    ack1 = server.receive_fin(fin1)
    time.sleep(0.1)
    
    # Client receives ACK
    client.receive_ack(ack1)
    time.sleep(0.1)
    
    # Step 3: Server sends its FIN
    fin2 = server.send_final_fin()
    time.sleep(0.1)
    
    # Step 4: Client receives FIN and sends final ACK
    ack2 = client.receive_fin(fin2)
    time.sleep(0.1)
    
    # Server receives final ACK
    server.receive_ack(ack2)
    
    print(f"\\nFinal States:")
    print(f"Client: {client.state.value}")
    print(f"Server: {server.state.value}")
    
    # Simulate TIME_WAIT expiration
    print(f"\\nWaiting for TIME_WAIT to expire...")
    time.sleep(2.1)
    client.check_time_wait()
    
    return client, server

def simulate_simultaneous_close():
    print("\\n=== Simultaneous Close Simulation ===\\n")
    
    client = TCPConnection("CLIENT")
    server = TCPConnection("SERVER")
    
    # Both sides send FIN simultaneously
    fin_client = client.initiate_close()
    fin_server = server.initiate_close()
    
    time.sleep(0.1)
    
    # Each receives the other's FIN
    ack_from_server = server.receive_fin(fin_client)
    ack_from_client = client.receive_fin(fin_server)
    
    time.sleep(0.1)
    
    # Each receives the ACK
    client.receive_ack(ack_from_server)
    server.receive_ack(ack_from_client)
    
    print(f"\\nSimultaneous Close States:")
    print(f"Client: {client.state.value}")
    print(f"Server: {server.state.value}")

def simulate_abortive_close():
    print("\\n=== Abortive Close (RST) Simulation ===\\n")
    
    client = TCPConnection("CLIENT")
    
    # Send RST for immediate termination
    rst_packet = client.send_rst()
    
    print(f"Abortive close completed")
    print(f"Client state: {client.state.value}")

if __name__ == "__main__":
    # Run all simulations
    simulate_graceful_termination()
    simulate_simultaneous_close()
    simulate_abortive_close()`
    },
    {
      title: "Connection Lifecycle Management",
      language: "python",
      code: `import socket
import threading
import time
import signal
import sys

class ConnectionManager:
    def __init__(self):
        self.active_connections = {}
        self.connection_stats = {
            'total_connections': 0,
            'graceful_closes': 0,
            'abortive_closes': 0,
            'timeouts': 0
        }
    
    def track_connection(self, conn_id, socket_obj):
        """Track a new connection"""
        self.active_connections[conn_id] = {
            'socket': socket_obj,
            'start_time': time.time(),
            'bytes_sent': 0,
            'bytes_received': 0,
            'state': 'ESTABLISHED'
        }
        self.connection_stats['total_connections'] += 1
        print(f"Tracking connection {conn_id}")
    
    def graceful_close(self, conn_id):
        """Perform graceful connection close"""
        if conn_id in self.active_connections:
            conn_info = self.active_connections[conn_id]
            sock = conn_info['socket']
            
            try:
                print(f"Initiating graceful close for {conn_id}")
                
                # Shutdown sending side (sends FIN)
                sock.shutdown(socket.SHUT_WR)
                conn_info['state'] = 'FIN_WAIT'
                
                # Try to receive any remaining data
                sock.settimeout(5.0)
                while True:
                    try:
                        data = sock.recv(1024)
                        if not data:
                            break
                        conn_info['bytes_received'] += len(data)
                    except socket.timeout:
                        print(f"Timeout waiting for data from {conn_id}")
                        break
                
                # Close socket (completes four-way handshake)
                sock.close()
                conn_info['state'] = 'CLOSED'
                
                duration = time.time() - conn_info['start_time']
                print(f"Connection {conn_id} closed gracefully after {duration:.2f}s")
                
                self.connection_stats['graceful_closes'] += 1
                
            except Exception as e:
                print(f"Error during graceful close of {conn_id}: {e}")
                self.abortive_close(conn_id)
            
            finally:
                del self.active_connections[conn_id]
    
    def abortive_close(self, conn_id):
        """Perform abortive connection close (RST)"""
        if conn_id in self.active_connections:
            conn_info = self.active_connections[conn_id]
            sock = conn_info['socket']
            
            try:
                print(f"Performing abortive close for {conn_id}")
                
                # Set SO_LINGER to 0 for immediate RST
                sock.setsockopt(socket.SOL_SOCKET, socket.SO_LINGER, 
                               struct.pack('ii', 1, 0))
                
                sock.close()
                conn_info['state'] = 'RESET'
                
                print(f"Connection {conn_id} reset (RST sent)")
                self.connection_stats['abortive_closes'] += 1
                
            except Exception as e:
                print(f"Error during abortive close of {conn_id}: {e}")
            
            finally:
                del self.active_connections[conn_id]
    
    def close_all_connections(self, graceful=True):
        """Close all active connections"""
        print(f"Closing {len(self.active_connections)} active connections...")
        
        conn_ids = list(self.active_connections.keys())
        for conn_id in conn_ids:
            if graceful:
                self.graceful_close(conn_id)
            else:
                self.abortive_close(conn_id)
    
    def print_stats(self):
        """Print connection statistics"""
        print("\\n=== Connection Statistics ===")
        for key, value in self.connection_stats.items():
            print(f"{key.replace('_', ' ').title()}: {value}")
        print(f"Active Connections: {len(self.active_connections)}")

class TCPServer:
    def __init__(self, host='localhost', port=8080):
        self.host = host
        self.port = port
        self.manager = ConnectionManager()
        self.running = False
        self.server_socket = None
    
    def start(self):
        """Start server with proper connection management"""
        try:
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(5)
            self.running = True
            
            print(f"Server started on {self.host}:{self.port}")
            
            # Set up signal handler for graceful shutdown
            signal.signal(signal.SIGINT, self.signal_handler)
            
            while self.running:
                try:
                    client_socket, address = self.server_socket.accept()
                    
                    conn_id = f"{address[0]}:{address[1]}"
                    self.manager.track_connection(conn_id, client_socket)
                    
                    # Handle client in separate thread
                    client_thread = threading.Thread(
                        target=self.handle_client,
                        args=(client_socket, conn_id)
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
    
    def handle_client(self, client_socket, conn_id):
        """Handle individual client with proper termination"""
        try:
            while self.running:
                client_socket.settimeout(30.0)  # 30 second timeout
                
                try:
                    data = client_socket.recv(1024)
                    if not data:
                        # Client closed connection
                        print(f"Client {conn_id} closed connection")
                        break
                    
                    # Update stats
                    if conn_id in self.manager.active_connections:
                        self.manager.active_connections[conn_id]['bytes_received'] += len(data)
                    
                    # Echo response
                    response = f"Echo: {data.decode()}"
                    client_socket.send(response.encode())
                    
                    # Update stats
                    if conn_id in self.manager.active_connections:
                        self.manager.active_connections[conn_id]['bytes_sent'] += len(response)
                
                except socket.timeout:
                    print(f"Client {conn_id} timed out")
                    self.manager.connection_stats['timeouts'] += 1
                    break
                except socket.error as e:
                    print(f"Client {conn_id} error: {e}")
                    break
        
        except Exception as e:
            print(f"Handler error for {conn_id}: {e}")
        finally:
            # Graceful close
            self.manager.graceful_close(conn_id)
    
    def signal_handler(self, signum, frame):
        """Handle shutdown signal"""
        print("\\nReceived shutdown signal, closing connections...")
        self.running = False
        self.cleanup()
        sys.exit(0)
    
    def cleanup(self):
        """Clean up server resources"""
        print("Cleaning up server...")
        
        # Close all client connections gracefully
        self.manager.close_all_connections(graceful=True)
        
        # Close server socket
        if self.server_socket:
            try:
                self.server_socket.close()
            except:
                pass
        
        # Print final statistics
        self.manager.print_stats()
        print("Server cleanup completed")

# Usage example
if __name__ == "__main__":
    import struct
    
    server = TCPServer()
    
    try:
        server.start()
    except KeyboardInterrupt:
        print("\\nShutdown requested...")
        server.cleanup()`
    }
  ],

  resources: [
    { type: 'video', title: 'TCP Connection Termination - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/tcp-connection-termination/', description: 'TCP four-way termination process' },
    { type: 'video', title: 'TCP Connection Lifecycle - YouTube', url: 'https://www.youtube.com/watch?v=F27PLin3TV0', description: 'Complete TCP connection lifecycle' },
    { type: 'article', title: 'TCP Termination States - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/tcp-finite-state-machine/', description: 'TCP finite state machine explained' },
    { type: 'article', title: 'TIME_WAIT State Explanation', url: 'https://vincent.bernat.ch/en/blog/2014-tcp-time-wait-state-linux', description: 'Detailed TIME_WAIT state analysis' },
    { type: 'video', title: 'TCP RST Packets - YouTube', url: 'https://www.youtube.com/watch?v=928XjKfJOfc', description: 'TCP reset packets explained' },
    { type: 'article', title: 'TCP Connection Termination RFC', url: 'https://tools.ietf.org/html/rfc793#section-3.5', description: 'Official TCP termination specification' },
    { type: 'tool', title: 'netstat Command', url: 'https://linux.die.net/man/8/netstat', description: 'Monitor TCP connection states' },
    { type: 'article', title: 'TCP Socket States', url: 'https://www.tutorialspoint.com/tcp-socket-states', description: 'TCP socket state transitions' },
    { type: 'video', title: 'Network Troubleshooting', url: 'https://www.youtube.com/watch?v=tOQOIrUU5pE', description: 'TCP connection troubleshooting' },
    { type: 'tool', title: 'ss Command', url: 'https://www.geeksforgeeks.org/ss-command-in-linux/', description: 'Modern tool to monitor socket statistics' }
  ],

  questions: [
    {
      question: "Explain TCP four-way termination process step by step.",
      answer: "TCP termination: 1) Client sends FIN (finish), enters FIN_WAIT_1, 2) Server sends ACK, enters CLOSE_WAIT (half-close state), 3) Server sends FIN when ready, enters LAST_ACK, 4) Client sends ACK, enters TIME_WAIT, server goes to CLOSED. Four packets needed because TCP is full-duplex - each direction closed independently."
    },
    {
      question: "Why does TCP termination require four packets instead of two?",
      answer: "TCP is full-duplex, each direction must be closed independently. Two packets only close one direction. Four-way ensures: 1) Both sides finish sending data, 2) All data delivered before closing, 3) Graceful shutdown without data loss, 4) Proper resource cleanup. Half-close state allows one side to continue sending while other finished."
    },
    {
      question: "What is TIME_WAIT state and why is it important?",
      answer: "TIME_WAIT ensures reliable connection termination: 1) Lasts 2×MSL (Maximum Segment Lifetime), typically 2 minutes, 2) Ensures final ACK reaches peer, 3) Prevents old packets from interfering with new connections on same port pair, 4) Allows all connection packets to expire from network. Critical for connection reliability and preventing data corruption."
    },
    {
      question: "What happens during TCP half-close state?",
      answer: "Half-close (CLOSE_WAIT state): One side sent FIN (finished sending), other side can still send data. Allows graceful completion of data transfer. Example: HTTP client sends FIN after request, server continues sending response, then sends FIN. Prevents premature connection closure and data loss."
    },
    {
      question: "When would you use TCP RST instead of graceful termination?",
      answer: "Use RST (reset) for: 1) Immediate connection abort, 2) Error conditions (invalid packets), 3) Security threats (attack detection), 4) Resource exhaustion, 5) Application crashes, 6) Connection to closed port. RST discards pending data, immediately closes connection, no graceful handshake. Use when speed more important than data preservation."
    },
    {
      question: "How does simultaneous TCP close work?",
      answer: "Simultaneous close: Both sides send FIN simultaneously. States: ESTABLISHED → FIN_WAIT_1 → CLOSING → TIME_WAIT → CLOSED. Each side receives peer's FIN while in FIN_WAIT_1, sends ACK, enters CLOSING. After receiving ACK for own FIN, enters TIME_WAIT. Results in single closed connection, handled correctly by TCP state machine."
    },
    {
      question: "What are the different TCP connection termination states?",
      answer: "Termination states: FIN_WAIT_1 (sent FIN, waiting for ACK), FIN_WAIT_2 (got ACK, waiting for peer FIN), CLOSE_WAIT (received FIN, can still send), LAST_ACK (sent FIN, waiting for ACK), CLOSING (simultaneous close), TIME_WAIT (final state before CLOSED), CLOSED (connection terminated)."
    },
    {
      question: "How do you handle TCP connection timeouts during termination?",
      answer: "TCP termination timeouts: 1) FIN retransmission if no ACK received, 2) CLOSE_WAIT can persist indefinitely until application closes, 3) LAST_ACK times out and retransmits FIN, 4) TIME_WAIT has fixed 2×MSL duration, 5) Use SO_LINGER socket option to control close behavior, 6) Monitor with netstat/ss for stuck connections."
    },
    {
      question: "What problems can occur with improper TCP connection termination?",
      answer: "Termination problems: 1) Resource leaks from unclosed sockets, 2) Port exhaustion from too many TIME_WAIT connections, 3) Application hangs waiting for data, 4) Memory leaks from unreleased buffers, 5) File descriptor exhaustion, 6) Zombie connections consuming resources. Proper application-level close() calls essential."
    },
    {
      question: "How do firewalls and NAT affect TCP connection termination?",
      answer: "Firewall/NAT effects: 1) Connection tracking tables maintain state, 2) Premature timeout can cause RST injection, 3) Asymmetric routing may break termination, 4) Stateful firewalls may block FIN/ACK packets, 5) NAT translation tables need proper cleanup, 6) Connection state synchronization required for failover scenarios."
    }
  ]
};