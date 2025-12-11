export const enhancedSocketProgramming = {
  id: 'socket-programming-basics',
  title: 'Socket Programming Basics',
  subtitle: 'Network Programming Interface and Implementation',
  summary: 'Socket programming provides the interface for network communication, enabling applications to send and receive data over TCP and UDP connections.',
  analogy: 'Like telephone system programming - sockets are phone endpoints, you dial (connect), talk (send/receive), and hang up (close).',
  visualConcept: 'Picture sockets as electrical outlets - you plug in (bind), connect devices (accept/connect), transfer power (data), and unplug (close).',
  realWorldUse: 'Web servers, chat applications, file transfer, database connections, API clients, multiplayer games, IoT communication.',
  explanation: `Socket Programming Fundamentals:

Socket Concept:
A socket is an endpoint for network communication, providing a programming interface to the transport layer. Sockets abstract the complexity of network protocols and provide a consistent API across different platforms.

Socket Types:

1. Stream Sockets (TCP):
- Connection-oriented, reliable communication
- Uses SOCK_STREAM socket type
- Provides ordered, error-free data delivery
- Suitable for applications requiring data integrity

2. Datagram Sockets (UDP):
- Connectionless, unreliable communication  
- Uses SOCK_DGRAM socket type
- Fast, low-overhead transmission
- Suitable for real-time applications

Socket Programming Model:

TCP Server Process:
1. socket() - Create socket endpoint
2. bind() - Associate socket with local address/port
3. listen() - Mark socket as passive, ready to accept connections
4. accept() - Block waiting for incoming connections
5. recv()/send() - Exchange data with clients
6. close() - Terminate connection

TCP Client Process:
1. socket() - Create socket endpoint
2. connect() - Establish connection to server
3. send()/recv() - Exchange data with server
4. close() - Terminate connection

UDP Process (Client/Server):
1. socket() - Create socket endpoint
2. bind() - Associate with local address (server only)
3. sendto()/recvfrom() - Send/receive datagrams
4. close() - Close socket

Socket Address Structures:
Different address families (IPv4, IPv6, Unix domain) use different address structures to specify communication endpoints.

Socket Options:
Various socket options control behavior: SO_REUSEADDR (address reuse), SO_KEEPALIVE (connection keepalive), TCP_NODELAY (disable Nagle's algorithm), etc.

Error Handling:
Proper error handling essential for robust network applications. Common errors include connection refused, timeout, network unreachable, etc.

Advanced Concepts:
- Non-blocking sockets for asynchronous I/O
- Select/poll/epoll for handling multiple connections
- Socket multiplexing and event-driven programming
- Security considerations and best practices`,

  keyPoints: [
    'Sockets provide programming interface to network protocols',
    'Stream sockets (TCP) offer reliable, connection-oriented communication',
    'Datagram sockets (UDP) provide fast, connectionless communication',
    'Server sockets bind, listen, and accept incoming connections',
    'Client sockets connect to servers for communication',
    'Socket address structures specify communication endpoints',
    'Socket options control various aspects of socket behavior',
    'Error handling crucial for robust network applications',
    'Non-blocking sockets enable asynchronous I/O operations',
    'Socket multiplexing allows handling multiple connections efficiently'
  ],

  codeExamples: [
    {
      title: "Complete TCP Socket Implementation",
      language: "python",
      code: `import socket
import threading
import time
import json
import struct
from datetime import datetime

class TCPServer:
    def __init__(self, host='localhost', port=8080, max_connections=10):
        self.host = host
        self.port = port
        self.max_connections = max_connections
        self.clients = {}
        self.running = False
        
        # Create TCP socket
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        
        # Set socket options
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        # Enable keepalive
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
        
        print(f"TCP Server initialized on {host}:{port}")
    
    def start(self):
        """Start the TCP server"""
        try:
            # Bind socket to address
            self.server_socket.bind((self.host, self.port))
            print(f"Socket bound to {self.host}:{self.port}")
            
            # Listen for connections
            self.server_socket.listen(self.max_connections)
            print(f"Server listening (max connections: {self.max_connections})")
            
            self.running = True
            
            while self.running:
                try:
                    # Accept incoming connection
                    client_socket, client_address = self.server_socket.accept()
                    
                    print(f"New connection from {client_address}")
                    
                    # Configure client socket
                    client_socket.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
                    client_socket.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
                    
                    # Store client info
                    client_id = f"{client_address[0]}:{client_address[1]}"
                    self.clients[client_id] = {
                        'socket': client_socket,
                        'address': client_address,
                        'connected_at': datetime.now(),
                        'bytes_received': 0,
                        'bytes_sent': 0,
                        'messages_count': 0
                    }
                    
                    # Handle client in separate thread
                    client_thread = threading.Thread(
                        target=self.handle_client,
                        args=(client_socket, client_address, client_id)
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
    
    def handle_client(self, client_socket, client_address, client_id):
        """Handle individual client connection"""
        try:
            # Send welcome message
            welcome = {
                'type': 'welcome',
                'message': 'Connected to TCP Server',
                'server_time': datetime.now().isoformat(),
                'client_id': client_id
            }
            self.send_message(client_socket, welcome)
            
            while self.running:
                try:
                    # Set receive timeout
                    client_socket.settimeout(30.0)
                    
                    # Receive message
                    message = self.receive_message(client_socket)
                    if not message:
                        break
                    
                    # Update client statistics
                    if client_id in self.clients:
                        self.clients[client_id]['messages_count'] += 1
                    
                    # Process message
                    response = self.process_message(message, client_id)
                    
                    # Send response
                    if response:
                        self.send_message(client_socket, response)
                
                except socket.timeout:
                    print(f"Client {client_address} timed out")
                    break
                except socket.error as e:
                    print(f"Client {client_address} error: {e}")
                    break
                    
        except Exception as e:
            print(f"Client handler error: {e}")
        finally:
            self.disconnect_client(client_id)
    
    def send_message(self, client_socket, message):
        """Send JSON message with length prefix"""
        try:
            # Serialize message
            message_data = json.dumps(message).encode('utf-8')
            message_length = len(message_data)
            
            # Send length prefix (4 bytes, network byte order)
            length_prefix = struct.pack('!I', message_length)
            client_socket.send(length_prefix)
            
            # Send message data
            client_socket.send(message_data)
            
            # Update statistics
            for client_info in self.clients.values():
                if client_info['socket'] == client_socket:
                    client_info['bytes_sent'] += len(length_prefix) + len(message_data)
                    break
            
            return True
            
        except Exception as e:
            print(f"Send error: {e}")
            return False
    
    def receive_message(self, client_socket):
        """Receive JSON message with length prefix"""
        try:
            # Receive length prefix (4 bytes)
            length_data = self.receive_exact(client_socket, 4)
            if not length_data:
                return None
            
            # Unpack message length
            message_length = struct.unpack('!I', length_data)[0]
            
            # Receive message data
            message_data = self.receive_exact(client_socket, message_length)
            if not message_data:
                return None
            
            # Update statistics
            for client_info in self.clients.values():
                if client_info['socket'] == client_socket:
                    client_info['bytes_received'] += len(length_data) + len(message_data)
                    break
            
            # Deserialize message
            return json.loads(message_data.decode('utf-8'))
            
        except Exception as e:
            print(f"Receive error: {e}")
            return None
    
    def receive_exact(self, client_socket, length):
        """Receive exactly 'length' bytes"""
        data = b''
        while len(data) < length:
            chunk = client_socket.recv(length - len(data))
            if not chunk:
                return None
            data += chunk
        return data
    
    def process_message(self, message, client_id):
        """Process received message and generate response"""
        msg_type = message.get('type', 'unknown')
        
        if msg_type == 'echo':
            return {
                'type': 'echo_response',
                'original': message.get('data', ''),
                'timestamp': datetime.now().isoformat(),
                'client_id': client_id
            }
        
        elif msg_type == 'stats':
            client_info = self.clients.get(client_id, {})
            return {
                'type': 'stats_response',
                'client_stats': {
                    'connected_at': client_info.get('connected_at', '').isoformat() if client_info.get('connected_at') else '',
                    'bytes_received': client_info.get('bytes_received', 0),
                    'bytes_sent': client_info.get('bytes_sent', 0),
                    'messages_count': client_info.get('messages_count', 0)
                },
                'server_stats': {
                    'active_clients': len(self.clients),
                    'server_uptime': str(datetime.now() - getattr(self, 'start_time', datetime.now()))
                }
            }
        
        elif msg_type == 'broadcast':
            message_text = message.get('data', '')
            self.broadcast_message(message_text, exclude_client=client_id)
            return {
                'type': 'broadcast_response',
                'status': 'sent',
                'recipients': len(self.clients) - 1
            }
        
        else:
            return {
                'type': 'error',
                'message': f'Unknown message type: {msg_type}',
                'supported_types': ['echo', 'stats', 'broadcast']
            }
    
    def broadcast_message(self, message, exclude_client=None):
        """Broadcast message to all connected clients"""
        broadcast_msg = {
            'type': 'broadcast',
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'sender': exclude_client
        }
        
        for client_id, client_info in list(self.clients.items()):
            if client_id != exclude_client:
                if not self.send_message(client_info['socket'], broadcast_msg):
                    self.disconnect_client(client_id)
    
    def disconnect_client(self, client_id):
        """Disconnect and cleanup client"""
        if client_id in self.clients:
            try:
                self.clients[client_id]['socket'].close()
            except:
                pass
            
            print(f"Client {client_id} disconnected")
            del self.clients[client_id]
    
    def cleanup(self):
        """Cleanup server resources"""
        print("Cleaning up server...")
        self.running = False
        
        # Disconnect all clients
        for client_id in list(self.clients.keys()):
            self.disconnect_client(client_id)
        
        # Close server socket
        try:
            self.server_socket.close()
        except:
            pass
        
        print("Server cleanup completed")

class TCPClient:
    def __init__(self, host='localhost', port=8080):
        self.host = host
        self.port = port
        self.socket = None
        self.connected = False
        self.receive_thread = None
    
    def connect(self):
        """Connect to TCP server"""
        try:
            # Create TCP socket
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            
            # Set socket options
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
            self.socket.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
            
            # Set connection timeout
            self.socket.settimeout(10.0)
            
            # Connect to server
            self.socket.connect((self.host, self.port))
            self.connected = True
            
            print(f"Connected to {self.host}:{self.port}")
            
            # Start receive thread
            self.receive_thread = threading.Thread(target=self.receive_loop)
            self.receive_thread.daemon = True
            self.receive_thread.start()
            
            return True
            
        except Exception as e:
            print(f"Connection error: {e}")
            return False
    
    def send_message(self, message):
        """Send message to server"""
        if not self.connected:
            print("Not connected to server")
            return False
        
        try:
            # Serialize message
            message_data = json.dumps(message).encode('utf-8')
            message_length = len(message_data)
            
            # Send length prefix and message
            length_prefix = struct.pack('!I', message_length)
            self.socket.send(length_prefix + message_data)
            
            return True
            
        except Exception as e:
            print(f"Send error: {e}")
            self.connected = False
            return False
    
    def receive_message(self):
        """Receive message from server"""
        try:
            # Receive length prefix
            length_data = self.receive_exact(4)
            if not length_data:
                return None
            
            # Unpack message length
            message_length = struct.unpack('!I', length_data)[0]
            
            # Receive message data
            message_data = self.receive_exact(message_length)
            if not message_data:
                return None
            
            # Deserialize message
            return json.loads(message_data.decode('utf-8'))
            
        except Exception as e:
            print(f"Receive error: {e}")
            return None
    
    def receive_exact(self, length):
        """Receive exactly 'length' bytes"""
        data = b''
        while len(data) < length:
            chunk = self.socket.recv(length - len(data))
            if not chunk:
                return None
            data += chunk
        return data
    
    def receive_loop(self):
        """Continuous receive loop"""
        while self.connected:
            message = self.receive_message()
            if message:
                self.handle_message(message)
            else:
                self.connected = False
                break
        
        print("Receive loop ended")
    
    def handle_message(self, message):
        """Handle received message"""
        msg_type = message.get('type', 'unknown')
        
        if msg_type == 'welcome':
            print(f"Server: {message.get('message', '')}")
        elif msg_type == 'broadcast':
            print(f"[BROADCAST from {message.get('sender', 'unknown')}]: {message.get('message', '')}")
        elif msg_type in ['echo_response', 'stats_response', 'broadcast_response']:
            print(f"Response: {message}")
        elif msg_type == 'error':
            print(f"Error: {message.get('message', '')}")
        else:
            print(f"Unknown message: {message}")
    
    def disconnect(self):
        """Disconnect from server"""
        self.connected = False
        
        if self.socket:
            try:
                self.socket.close()
            except:
                pass
        
        if self.receive_thread:
            self.receive_thread.join(timeout=1)
        
        print("Disconnected from server")

# Demonstration
def demonstrate_tcp_sockets():
    print("=== TCP Socket Programming Demonstration ===\\n")
    
    # Start server in background thread
    server = TCPServer(port=8080)
    server_thread = threading.Thread(target=server.start)
    server_thread.daemon = True
    server_thread.start()
    
    # Wait for server to start
    time.sleep(1)
    
    # Create multiple clients
    clients = []
    for i in range(3):
        client = TCPClient(port=8080)
        if client.connect():
            clients.append(client)
            time.sleep(0.5)
    
    # Test various operations
    if clients:
        time.sleep(1)
        
        # Test echo
        clients[0].send_message({'type': 'echo', 'data': 'Hello from client 1!'})
        time.sleep(0.5)
        
        # Test stats
        clients[1].send_message({'type': 'stats'})
        time.sleep(0.5)
        
        # Test broadcast
        clients[2].send_message({'type': 'broadcast', 'data': 'Hello everyone!'})
        time.sleep(1)
        
        # Disconnect clients
        for client in clients:
            client.disconnect()
    
    # Cleanup server
    time.sleep(1)
    server.cleanup()

if __name__ == "__main__":
    demonstrate_tcp_sockets()`
    },
    {
      title: "UDP Socket and Advanced Socket Programming",
      language: "python",
      code: `import socket
import threading
import time
import select
import errno
from collections import defaultdict

class UDPServer:
    def __init__(self, host='localhost', port=8081):
        self.host = host
        self.port = port
        self.socket = None
        self.running = False
        self.clients = defaultdict(dict)  # Track client sessions
        
    def start(self):
        """Start UDP server"""
        try:
            # Create UDP socket
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            
            # Set socket options
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            
            # Bind to address
            self.socket.bind((self.host, self.port))
            print(f"UDP Server listening on {self.host}:{self.port}")
            
            self.running = True
            
            while self.running:
                try:
                    # Receive datagram
                    data, client_address = self.socket.recvfrom(1024)
                    
                    # Process message
                    self.handle_datagram(data, client_address)
                    
                except socket.error as e:
                    if self.running:
                        print(f"UDP receive error: {e}")
                    break
                    
        except Exception as e:
            print(f"UDP server error: {e}")
        finally:
            self.cleanup()
    
    def handle_datagram(self, data, client_address):
        """Handle received UDP datagram"""
        try:
            message = data.decode('utf-8')
            client_key = f"{client_address[0]}:{client_address[1]}"
            
            # Update client info
            if client_key not in self.clients:
                self.clients[client_key] = {
                    'first_seen': time.time(),
                    'packet_count': 0,
                    'bytes_received': 0
                }
            
            self.clients[client_key]['packet_count'] += 1
            self.clients[client_key]['bytes_received'] += len(data)
            self.clients[client_key]['last_seen'] = time.time()
            
            print(f"UDP received from {client_address}: {message}")
            
            # Send response
            response = f"UDP Echo: {message} (packet #{self.clients[client_key]['packet_count']})"
            self.socket.sendto(response.encode('utf-8'), client_address)
            
        except Exception as e:
            print(f"UDP handle error: {e}")
    
    def cleanup(self):
        """Cleanup UDP server"""
        self.running = False
        if self.socket:
            try:
                self.socket.close()
            except:
                pass
        print("UDP server cleaned up")

class NonBlockingTCPServer:
    def __init__(self, host='localhost', port=8082):
        self.host = host
        self.port = port
        self.server_socket = None
        self.client_sockets = {}
        self.running = False
    
    def start(self):
        """Start non-blocking TCP server using select()"""
        try:
            # Create server socket
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            
            # Set non-blocking
            self.server_socket.setblocking(False)
            
            # Bind and listen
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(5)
            
            print(f"Non-blocking TCP server listening on {self.host}:{self.port}")
            
            self.running = True
            
            # Socket lists for select()
            read_sockets = [self.server_socket]
            write_sockets = []
            
            while self.running:
                try:
                    # Use select() for I/O multiplexing
                    ready_read, ready_write, error_sockets = select.select(
                        read_sockets, write_sockets, read_sockets, 1.0
                    )
                    
                    # Handle readable sockets
                    for sock in ready_read:
                        if sock == self.server_socket:
                            # New connection
                            self.accept_connection(read_sockets)
                        else:
                            # Data from client
                            self.handle_client_data(sock, read_sockets)
                    
                    # Handle error sockets
                    for sock in error_sockets:
                        self.close_client_socket(sock, read_sockets)
                
                except select.error as e:
                    if self.running:
                        print(f"Select error: {e}")
                    break
                    
        except Exception as e:
            print(f"Non-blocking server error: {e}")
        finally:
            self.cleanup()
    
    def accept_connection(self, read_sockets):
        """Accept new client connection"""
        try:
            client_socket, client_address = self.server_socket.accept()
            client_socket.setblocking(False)
            
            read_sockets.append(client_socket)
            self.client_sockets[client_socket] = {
                'address': client_address,
                'connected_at': time.time(),
                'buffer': b''
            }
            
            print(f"Non-blocking: New client {client_address}")
            
        except socket.error as e:
            print(f"Accept error: {e}")
    
    def handle_client_data(self, client_socket, read_sockets):
        """Handle data from client"""
        try:
            data = client_socket.recv(1024)
            
            if data:
                # Process received data
                message = data.decode('utf-8').strip()
                client_info = self.client_sockets[client_socket]
                
                print(f"Non-blocking received from {client_info['address']}: {message}")
                
                # Send response
                response = f"Non-blocking echo: {message}\\n"
                client_socket.send(response.encode('utf-8'))
                
            else:
                # Client disconnected
                self.close_client_socket(client_socket, read_sockets)
                
        except socket.error as e:
            if e.errno != errno.EWOULDBLOCK:
                print(f"Client data error: {e}")
                self.close_client_socket(client_socket, read_sockets)
    
    def close_client_socket(self, client_socket, read_sockets):
        """Close client socket and cleanup"""
        if client_socket in self.client_sockets:
            client_info = self.client_sockets[client_socket]
            print(f"Non-blocking: Client {client_info['address']} disconnected")
            del self.client_sockets[client_socket]
        
        if client_socket in read_sockets:
            read_sockets.remove(client_socket)
        
        try:
            client_socket.close()
        except:
            pass
    
    def cleanup(self):
        """Cleanup server resources"""
        self.running = False
        
        # Close all client sockets
        for client_socket in list(self.client_sockets.keys()):
            try:
                client_socket.close()
            except:
                pass
        
        # Close server socket
        if self.server_socket:
            try:
                self.server_socket.close()
            except:
                pass
        
        print("Non-blocking server cleaned up")

class SocketUtilities:
    @staticmethod
    def get_socket_info(sock):
        """Get detailed socket information"""
        try:
            # Get socket options
            info = {
                'family': sock.family.name,
                'type': sock.type.name,
                'local_address': sock.getsockname(),
            }
            
            # Get peer address if connected
            try:
                info['peer_address'] = sock.getpeername()
            except:
                info['peer_address'] = None
            
            # Get socket options
            info['reuse_addr'] = sock.getsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR)
            info['keepalive'] = sock.getsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE)
            
            # TCP-specific options
            if sock.type == socket.SOCK_STREAM:
                try:
                    info['nodelay'] = sock.getsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY)
                except:
                    info['nodelay'] = None
            
            return info
            
        except Exception as e:
            return {'error': str(e)}
    
    @staticmethod
    def test_connection(host, port, timeout=5):
        """Test TCP connection to host:port"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(timeout)
            
            start_time = time.time()
            result = sock.connect_ex((host, port))
            connect_time = time.time() - start_time
            
            sock.close()
            
            return {
                'success': result == 0,
                'connect_time': connect_time,
                'error_code': result if result != 0 else None
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def port_scan(host, port_range, timeout=1):
        """Simple port scanner"""
        open_ports = []
        
        for port in range(port_range[0], port_range[1] + 1):
            result = SocketUtilities.test_connection(host, port, timeout)
            if result['success']:
                open_ports.append(port)
        
        return open_ports

class SocketDemo:
    def __init__(self):
        self.servers = []
    
    def demonstrate_socket_types(self):
        """Demonstrate different socket types and programming models"""
        print("=== Socket Programming Demonstration ===\\n")
        
        # Start UDP server
        udp_server = UDPServer(port=8081)
        udp_thread = threading.Thread(target=udp_server.start)
        udp_thread.daemon = True
        udp_thread.start()
        self.servers.append(udp_server)
        
        # Start non-blocking TCP server
        nb_server = NonBlockingTCPServer(port=8082)
        nb_thread = threading.Thread(target=nb_server.start)
        nb_thread.daemon = True
        nb_thread.start()
        self.servers.append(nb_server)
        
        time.sleep(1)  # Let servers start
        
        # Test UDP client
        print("Testing UDP communication:")
        self.test_udp_client()
        
        print("\\nTesting non-blocking TCP:")
        self.test_nonblocking_client()
        
        print("\\nSocket utilities demonstration:")
        self.demonstrate_utilities()
    
    def test_udp_client(self):
        """Test UDP client communication"""
        try:
            # Create UDP client socket
            client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            
            # Send multiple datagrams
            for i in range(3):
                message = f"UDP message {i+1}"
                client_socket.sendto(message.encode('utf-8'), ('localhost', 8081))
                
                # Receive response
                client_socket.settimeout(2.0)
                try:
                    response, server_addr = client_socket.recvfrom(1024)
                    print(f"  UDP Response: {response.decode('utf-8')}")
                except socket.timeout:
                    print(f"  UDP timeout for message {i+1}")
                
                time.sleep(0.5)
            
            client_socket.close()
            
        except Exception as e:
            print(f"UDP client error: {e}")
    
    def test_nonblocking_client(self):
        """Test non-blocking TCP client"""
        try:
            # Create TCP client
            client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            client_socket.connect(('localhost', 8082))
            
            # Send messages
            for i in range(3):
                message = f"Non-blocking message {i+1}\\n"
                client_socket.send(message.encode('utf-8'))
                
                # Receive response
                response = client_socket.recv(1024)
                print(f"  Response: {response.decode('utf-8').strip()}")
                
                time.sleep(0.5)
            
            client_socket.close()
            
        except Exception as e:
            print(f"Non-blocking client error: {e}")
    
    def demonstrate_utilities(self):
        """Demonstrate socket utilities"""
        # Test socket info
        test_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        test_socket.bind(('localhost', 0))  # Bind to any available port
        
        info = SocketUtilities.get_socket_info(test_socket)
        print(f"Socket info: {info}")
        
        test_socket.close()
        
        # Test connection
        result = SocketUtilities.test_connection('localhost', 8081)
        print(f"Connection test to UDP port: {result}")
        
        # Port scan
        print("Scanning local ports 8080-8085:")
        open_ports = SocketUtilities.port_scan('localhost', (8080, 8085), 0.5)
        print(f"Open ports: {open_ports}")
    
    def cleanup(self):
        """Cleanup all servers"""
        for server in self.servers:
            server.cleanup()

if __name__ == "__main__":
    demo = SocketDemo()
    
    try:
        demo.demonstrate_socket_types()
        time.sleep(2)  # Let everything run
    except KeyboardInterrupt:
        print("\\nShutdown requested...")
    finally:
        demo.cleanup()`
    }
  ],

  resources: [
    { type: 'article', title: 'Socket Programming - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/socket-programming-cc/', description: 'Complete socket programming tutorial with examples' },
    { type: 'video', title: 'Socket Programming Explained - YouTube', url: 'https://www.youtube.com/watch?v=LtXEMwSG5-8', description: 'Visual explanation of socket programming concepts' },
    { type: 'article', title: 'TCP Socket Programming - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/tcp-server-client-implementation-in-c/', description: 'TCP client-server implementation guide' },
    { type: 'article', title: 'UDP Socket Programming - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/udp-server-client-implementation-c/', description: 'UDP socket programming examples' },
    { type: 'video', title: 'Network Programming - YouTube', url: 'https://www.youtube.com/watch?v=eVYsIolL2gE', description: 'Network programming fundamentals and socket API' },
    { type: 'article', title: 'Berkeley Sockets API', url: 'https://man7.org/linux/man-pages/man7/socket.7.html', description: 'Official socket API documentation' },
    { type: 'article', title: 'Python Socket Programming', url: 'https://realpython.com/python-sockets/', description: 'Socket programming in Python with examples' },
    { type: 'tool', title: 'Wireshark', url: 'https://www.wireshark.org/docs/', description: 'Network protocol analyzer for debugging' },
    { type: 'tool', title: 'netcat (nc)', url: 'https://www.geeksforgeeks.org/netcat-command-in-linux/', description: 'Network utility for testing socket connections' },
    { type: 'article', title: 'Advanced Socket Programming', url: 'https://www.tutorialspoint.com/unix_sockets/', description: 'Advanced socket programming techniques' }
  ],

  questions: [
    {
      question: "What is socket programming and how does it enable network communication?",
      answer: "Socket programming is a method of network communication using socket APIs that provide endpoints for data exchange. It enables: 1) Process-to-process communication across networks, 2) Abstraction of network protocols (TCP/UDP), 3) Client-server architecture implementation, 4) Bidirectional data transfer, 5) Cross-platform network applications. Sockets act as communication endpoints identified by IP address and port number."
    },
    {
      question: "Explain the complete TCP socket programming workflow for both client and server.",
      answer: "TCP Server: 1) socket() - Create socket, 2) bind() - Bind to address/port, 3) listen() - Listen for connections, 4) accept() - Accept client connections, 5) send()/recv() - Data exchange, 6) close() - Close connection. TCP Client: 1) socket() - Create socket, 2) connect() - Connect to server, 3) send()/recv() - Data exchange, 4) close() - Close connection. Server typically loops to handle multiple clients."
    },
    {
      question: "What are the key differences between TCP and UDP socket programming?",
      answer: "TCP Sockets: 1) Connection-oriented (SOCK_STREAM), 2) Reliable delivery with error checking, 3) Ordered data transmission, 4) Flow and congestion control, 5) Higher overhead. UDP Sockets: 1) Connectionless (SOCK_DGRAM), 2) Unreliable, best-effort delivery, 3) No ordering guarantees, 4) Lower overhead, faster, 5) Suitable for real-time applications. TCP ensures reliability, UDP prioritizes speed."
    },
    {
      question: "How do you handle multiple clients concurrently in socket programming?",
      answer: "Concurrent client handling methods: 1) Multi-threading - Create thread per client connection, 2) Multi-processing - Fork process for each client, 3) Select/Poll - Monitor multiple sockets for I/O readiness, 4) Epoll/Kqueue - Event-driven I/O for high performance, 5) Asynchronous programming - Non-blocking I/O with callbacks/promises, 6) Thread pools - Reuse threads to reduce overhead. Choice depends on scalability and performance requirements."
    },
    {
      question: "What are socket options and why are they important?",
      answer: "Socket options configure socket behavior: 1) SO_REUSEADDR - Reuse address after connection close, 2) SO_KEEPALIVE - Enable keep-alive packets, 3) SO_RCVBUF/SO_SNDBUF - Set buffer sizes, 4) SO_TIMEOUT - Set operation timeouts, 5) TCP_NODELAY - Disable Nagle's algorithm, 6) SO_LINGER - Control close behavior. Important for: performance tuning, resource management, connection reliability, and application-specific requirements."
    },
    {
      question: "How do you handle errors and exceptions in socket programming?",
      answer: "Error handling strategies: 1) Check return values - All socket functions return error codes, 2) Handle specific errors - EADDRINUSE, ECONNREFUSED, ETIMEDOUT, EPIPE, 3) Use try-catch blocks - For exception-based languages, 4) Implement retry logic - For transient errors, 5) Graceful degradation - Handle partial failures, 6) Logging and monitoring - Track error patterns. Proper error handling ensures robust network applications."
    },
    {
      question: "What is the difference between blocking and non-blocking sockets?",
      answer: "Blocking Sockets: 1) Operations wait until completion, 2) Thread blocks during I/O operations, 3) Simpler programming model, 4) May cause application freezing. Non-blocking Sockets: 1) Operations return immediately, 2) Use EAGAIN/EWOULDBLOCK for incomplete operations, 3) Require polling or event notification, 4) Enable responsive applications. Non-blocking sockets are essential for high-performance servers and GUI applications."
    },
    {
      question: "How does socket programming work with firewalls and NAT?",
      answer: "Firewall/NAT considerations: 1) Firewalls filter based on ports and protocols, 2) NAT modifies IP addresses and ports, 3) Port forwarding required for servers behind NAT, 4) Connection tracking maintains state, 5) Some protocols require special handling (FTP, SIP), 6) Use techniques like UPnP, STUN, TURN for NAT traversal. Applications must handle these network infrastructure elements."
    },
    {
      question: "What are the security considerations in socket programming?",
      answer: "Security considerations: 1) Input validation - Prevent buffer overflows and injection attacks, 2) Authentication - Verify client/server identity, 3) Encryption - Use TLS/SSL for data protection, 4) Access control - Limit connections and permissions, 5) Rate limiting - Prevent DoS attacks, 6) Error handling - Don't leak sensitive information, 7) Secure coding - Follow security best practices. Network applications are exposed to various security threats."
    },
    {
      question: "How do you debug and troubleshoot socket programming issues?",
      answer: "Debugging techniques: 1) Network analyzers - Wireshark to capture packets, 2) System tools - netstat, ss, lsof to monitor connections, 3) Logging - Add detailed logging for socket operations, 4) Testing tools - netcat, telnet for connection testing, 5) Error codes - Check errno values for specific errors, 6) Timeouts - Use appropriate timeout values, 7) Incremental testing - Test components separately. Systematic approach helps identify network issues."
    }
  ]
};