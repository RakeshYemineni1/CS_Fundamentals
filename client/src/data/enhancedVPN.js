export const enhancedVPN = {
  id: 'vpn',
  title: 'VPN (Virtual Private Network)',
  subtitle: 'Secure Remote Network Access',
  summary: 'Technology that creates secure, encrypted connections over public networks, enabling remote access to private networks and protecting data transmission from eavesdropping.',
  
  analogy: "Think of VPN like a secure tunnel through a busy highway. Your data travels through this encrypted tunnel, invisible to other traffic on the highway (internet), ensuring privacy and security while reaching your destination (private network).",
  
  visualConcept: "Imagine VPN as a private courier service that picks up your mail (data) from your house, puts it in a locked box (encryption), delivers it through various routes (internet), and unlocks it only when it reaches the intended recipient (destination network).",
  
  realWorldUse: "Remote work access to company networks, bypassing geo-restrictions for streaming, protecting privacy on public Wi-Fi, secure site-to-site connections between offices, and accessing region-locked content.",

  explanation: `
A Virtual Private Network (VPN) creates a secure, encrypted connection between a device and a network over the internet. It extends a private network across a public network, enabling secure remote access.

VPN Types:

1. Remote Access VPN
Allows individual users to connect to a private network from remote locations. Common for telecommuting and mobile workers.

2. Site-to-Site VPN
Connects entire networks to each other, typically used to link branch offices to headquarters or connect partner organizations.

3. Client-to-Site VPN
Similar to remote access but specifically designed for connecting client devices to a central site.

VPN Protocols:

OpenVPN
Open-source protocol using SSL/TLS for encryption. Highly secure, configurable, and works on most platforms.

IPSec (Internet Protocol Security)
Suite of protocols for securing IP communications. Often used for site-to-site VPNs with strong encryption.

WireGuard
Modern, lightweight protocol designed for simplicity and performance while maintaining strong security.

L2TP/IPSec
Layer 2 Tunneling Protocol combined with IPSec for encryption. Good compatibility but slower performance.

PPTP (Point-to-Point Tunneling Protocol)
Older protocol with weaker security. Fast but not recommended for sensitive data.

VPN Components:
- VPN Client: Software on user device
- VPN Server: Endpoint that accepts connections
- Tunnel: Encrypted pathway for data
- Authentication: User/device verification
- Encryption: Data protection mechanism
  `,

  keyPoints: [
    "VPN creates secure tunnels over public networks",
    "Encrypts all data transmission for privacy protection",
    "Enables remote access to private network resources",
    "Masks user's real IP address and location",
    "Different protocols offer varying security and performance",
    "Site-to-site VPNs connect entire networks securely",
    "Remote access VPNs serve individual users",
    "Authentication ensures only authorized access",
    "Can bypass geographical content restrictions",
    "Essential for secure remote work and public Wi-Fi use"
  ],

  codeExamples: [
    {
      title: "VPN Connection Manager",
      language: "python",
      code: `
import socket
import ssl
import threading
import time
import hashlib
import hmac
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import json
from datetime import datetime, timedelta

class VPNConnection:
    def __init__(self, server_host, server_port, username, password):
        self.server_host = server_host
        self.server_port = server_port
        self.username = username
        self.password = password
        self.socket = None
        self.ssl_socket = None
        self.encryption_key = None
        self.is_connected = False
        self.session_id = None
        self.tunnel_stats = {
            'bytes_sent': 0,
            'bytes_received': 0,
            'packets_sent': 0,
            'packets_received': 0,
            'connection_time': None,
            'last_activity': None
        }
        
    def generate_encryption_key(self, password, salt):
        """Generate encryption key from password"""
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
        return Fernet(key)
    
    def authenticate(self):
        """Perform authentication with VPN server"""
        try:
            # Create socket connection
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.connect((self.server_host, self.server_port))
            
            # Wrap with SSL/TLS
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE  # For demo purposes
            self.ssl_socket = context.wrap_socket(self.socket, server_hostname=self.server_host)
            
            # Send authentication request
            auth_data = {
                'username': self.username,
                'password': hashlib.sha256(self.password.encode()).hexdigest(),
                'client_version': '1.0',
                'timestamp': datetime.now().isoformat()
            }
            
            self.ssl_socket.send(json.dumps(auth_data).encode() + b'\\n')
            
            # Receive authentication response
            response = self.ssl_socket.recv(1024).decode().strip()
            auth_response = json.loads(response)
            
            if auth_response['status'] == 'success':
                self.session_id = auth_response['session_id']
                salt = base64.b64decode(auth_response['salt'])
                self.encryption_key = self.generate_encryption_key(self.password, salt)
                self.is_connected = True
                self.tunnel_stats['connection_time'] = datetime.now()
                return True
            else:
                print(f"Authentication failed: {auth_response['message']}")
                return False
                
        except Exception as e:
            print(f"Authentication error: {e}")
            return False
    
    def send_data(self, data):
        """Send encrypted data through VPN tunnel"""
        if not self.is_connected:
            raise Exception("VPN not connected")
        
        try:
            # Encrypt data
            encrypted_data = self.encryption_key.encrypt(data.encode())
            
            # Create packet with metadata
            packet = {
                'session_id': self.session_id,
                'data': base64.b64encode(encrypted_data).decode(),
                'timestamp': datetime.now().isoformat(),
                'size': len(data)
            }
            
            packet_json = json.dumps(packet).encode() + b'\\n'
            self.ssl_socket.send(packet_json)
            
            # Update statistics
            self.tunnel_stats['bytes_sent'] += len(packet_json)
            self.tunnel_stats['packets_sent'] += 1
            self.tunnel_stats['last_activity'] = datetime.now()
            
            return True
            
        except Exception as e:
            print(f"Send error: {e}")
            return False
    
    def receive_data(self):
        """Receive and decrypt data from VPN tunnel"""
        if not self.is_connected:
            raise Exception("VPN not connected")
        
        try:
            # Receive packet
            response = self.ssl_socket.recv(4096).decode().strip()
            if not response:
                return None
            
            packet = json.loads(response)
            
            # Decrypt data
            encrypted_data = base64.b64decode(packet['data'])
            decrypted_data = self.encryption_key.decrypt(encrypted_data).decode()
            
            # Update statistics
            self.tunnel_stats['bytes_received'] += len(response)
            self.tunnel_stats['packets_received'] += 1
            self.tunnel_stats['last_activity'] = datetime.now()
            
            return decrypted_data
            
        except Exception as e:
            print(f"Receive error: {e}")
            return None
    
    def keep_alive(self):
        """Send keep-alive packets to maintain connection"""
        while self.is_connected:
            try:
                keep_alive_packet = {
                    'type': 'keep_alive',
                    'session_id': self.session_id,
                    'timestamp': datetime.now().isoformat()
                }
                
                self.ssl_socket.send(json.dumps(keep_alive_packet).encode() + b'\\n')
                time.sleep(30)  # Send keep-alive every 30 seconds
                
            except Exception as e:
                print(f"Keep-alive error: {e}")
                self.is_connected = False
                break
    
    def disconnect(self):
        """Disconnect from VPN server"""
        if self.is_connected:
            try:
                disconnect_packet = {
                    'type': 'disconnect',
                    'session_id': self.session_id,
                    'timestamp': datetime.now().isoformat()
                }
                
                self.ssl_socket.send(json.dumps(disconnect_packet).encode() + b'\\n')
                
            except:
                pass  # Ignore errors during disconnect
            
            finally:
                self.is_connected = False
                if self.ssl_socket:
                    self.ssl_socket.close()
                if self.socket:
                    self.socket.close()
                
                print("VPN disconnected")
    
    def get_connection_stats(self):
        """Get connection statistics"""
        if self.tunnel_stats['connection_time']:
            uptime = datetime.now() - self.tunnel_stats['connection_time']
            uptime_seconds = uptime.total_seconds()
        else:
            uptime_seconds = 0
        
        return {
            'connected': self.is_connected,
            'session_id': self.session_id,
            'uptime_seconds': uptime_seconds,
            'bytes_sent': self.tunnel_stats['bytes_sent'],
            'bytes_received': self.tunnel_stats['bytes_received'],
            'packets_sent': self.tunnel_stats['packets_sent'],
            'packets_received': self.tunnel_stats['packets_received'],
            'last_activity': self.tunnel_stats['last_activity'].isoformat() if self.tunnel_stats['last_activity'] else None
        }

class VPNServer:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.clients = {}
        self.server_socket = None
        self.running = False
        self.user_database = {
            'user1': 'password123',
            'user2': 'securepass456',
            'admin': 'adminpass789'
        }
        
    def start_server(self):
        """Start VPN server"""
        try:
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(5)
            
            # Wrap with SSL
            context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
            context.load_cert_chain('server.crt', 'server.key')  # Would need actual certificates
            
            self.running = True
            print(f"VPN Server started on {self.host}:{self.port}")
            
            while self.running:
                try:
                    client_socket, address = self.server_socket.accept()
                    ssl_client = context.wrap_socket(client_socket, server_side=True)
                    
                    # Handle client in separate thread
                    client_thread = threading.Thread(
                        target=self.handle_client,
                        args=(ssl_client, address)
                    )
                    client_thread.daemon = True
                    client_thread.start()
                    
                except Exception as e:
                    if self.running:
                        print(f"Server error: {e}")
                        
        except Exception as e:
            print(f"Failed to start server: {e}")
    
    def handle_client(self, ssl_socket, address):
        """Handle individual client connection"""
        session_id = None
        try:
            # Receive authentication
            auth_data = ssl_socket.recv(1024).decode().strip()
            auth_request = json.loads(auth_data)
            
            username = auth_request['username']
            password_hash = auth_request['password']
            
            # Verify credentials
            if username in self.user_database:
                expected_hash = hashlib.sha256(self.user_database[username].encode()).hexdigest()
                if password_hash == expected_hash:
                    # Authentication successful
                    session_id = hashlib.md5(f"{username}{time.time()}".encode()).hexdigest()
                    salt = base64.b64encode(b'salt_for_demo').decode()  # Use random salt in production
                    
                    response = {
                        'status': 'success',
                        'session_id': session_id,
                        'salt': salt,
                        'server_time': datetime.now().isoformat()
                    }
                    
                    self.clients[session_id] = {
                        'username': username,
                        'address': address,
                        'connected_at': datetime.now(),
                        'ssl_socket': ssl_socket
                    }
                    
                else:
                    response = {'status': 'error', 'message': 'Invalid credentials'}
            else:
                response = {'status': 'error', 'message': 'User not found'}
            
            ssl_socket.send(json.dumps(response).encode() + b'\\n')
            
            if response['status'] == 'success':
                self.handle_tunnel_traffic(ssl_socket, session_id)
                
        except Exception as e:
            print(f"Client handling error: {e}")
        finally:
            if session_id and session_id in self.clients:
                del self.clients[session_id]
            ssl_socket.close()
    
    def handle_tunnel_traffic(self, ssl_socket, session_id):
        """Handle VPN tunnel traffic for authenticated client"""
        while session_id in self.clients:
            try:
                data = ssl_socket.recv(4096).decode().strip()
                if not data:
                    break
                
                packet = json.loads(data)
                
                if packet.get('type') == 'keep_alive':
                    # Respond to keep-alive
                    response = {
                        'type': 'keep_alive_ack',
                        'timestamp': datetime.now().isoformat()
                    }
                    ssl_socket.send(json.dumps(response).encode() + b'\\n')
                    
                elif packet.get('type') == 'disconnect':
                    print(f"Client {session_id} requested disconnect")
                    break
                    
                else:
                    # Handle regular data packet
                    # In a real VPN, this would route the packet to its destination
                    print(f"Received data packet from {session_id}: {len(data)} bytes")
                    
                    # Echo back for demo
                    echo_response = {
                        'type': 'data_ack',
                        'original_size': packet.get('size', 0),
                        'timestamp': datetime.now().isoformat()
                    }
                    ssl_socket.send(json.dumps(echo_response).encode() + b'\\n')
                    
            except Exception as e:
                print(f"Tunnel traffic error: {e}")
                break
    
    def get_server_stats(self):
        """Get server statistics"""
        return {
            'running': self.running,
            'connected_clients': len(self.clients),
            'client_list': [
                {
                    'session_id': sid,
                    'username': client['username'],
                    'address': client['address'],
                    'connected_at': client['connected_at'].isoformat()
                }
                for sid, client in self.clients.items()
            ]
        }
    
    def stop_server(self):
        """Stop VPN server"""
        self.running = False
        if self.server_socket:
            self.server_socket.close()

# Usage example (Note: This is a simplified demo)
if __name__ == "__main__":
    print("VPN Demo - Note: This requires SSL certificates for full functionality")
    
    # Simulate VPN connection (without actual server)
    vpn = VPNConnection("vpn.example.com", 1194, "user1", "password123")
    
    print("VPN Connection Configuration:")
    print(f"Server: {vpn.server_host}:{vpn.server_port}")
    print(f"Username: {vpn.username}")
    print(f"Protocol: SSL/TLS with AES encryption")
    
    # Simulate connection stats
    vpn.tunnel_stats['connection_time'] = datetime.now() - timedelta(hours=2)
    vpn.tunnel_stats['bytes_sent'] = 1024000
    vpn.tunnel_stats['bytes_received'] = 2048000
    vpn.tunnel_stats['packets_sent'] = 1500
    vpn.tunnel_stats['packets_received'] = 2200
    vpn.tunnel_stats['last_activity'] = datetime.now()
    vpn.is_connected = True
    vpn.session_id = "demo_session_123"
    
    stats = vpn.get_connection_stats()
    print("\\nConnection Statistics:")
    for key, value in stats.items():
        print(f"  {key}: {value}")
      `
    },
    {
      title: "VPN Protocol Implementation",
      language: "java",
      code: `
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.spec.IvParameterSpec;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.time.LocalDateTime;
import java.time.Duration;
import java.net.*;
import java.io.*;

public class VPNProtocol {
    
    public enum VPNProtocolType {
        OPENVPN("OpenVPN", 1194, "UDP"),
        IPSEC("IPSec", 500, "UDP"),
        WIREGUARD("WireGuard", 51820, "UDP"),
        L2TP("L2TP/IPSec", 1701, "UDP"),
        PPTP("PPTP", 1723, "TCP");
        
        private final String name;
        private final int defaultPort;
        private final String transport;
        
        VPNProtocolType(String name, int defaultPort, String transport) {
            this.name = name;
            this.defaultPort = defaultPort;
            this.transport = transport;
        }
        
        public String getName() { return name; }
        public int getDefaultPort() { return defaultPort; }
        public String getTransport() { return transport; }
    }
    
    public static class VPNTunnel {
        private String tunnelId;
        private InetAddress localEndpoint;
        private InetAddress remoteEndpoint;
        private SecretKey encryptionKey;
        private Cipher encryptCipher;
        private Cipher decryptCipher;
        private LocalDateTime establishedAt;
        private long bytesIn;
        private long bytesOut;
        private int packetsIn;
        private int packetsOut;
        private boolean active;
        
        public VPNTunnel(String tunnelId, InetAddress local, InetAddress remote) throws Exception {
            this.tunnelId = tunnelId;
            this.localEndpoint = local;
            this.remoteEndpoint = remote;
            this.establishedAt = LocalDateTime.now();
            this.active = false;
            
            initializeEncryption();
        }
        
        private void initializeEncryption() throws Exception {
            // Generate AES key for tunnel encryption
            KeyGenerator keyGen = KeyGenerator.getInstance("AES");
            keyGen.init(256);
            this.encryptionKey = keyGen.generateKey();
            
            // Initialize ciphers
            this.encryptCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            this.decryptCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            
            // Generate random IV
            byte[] iv = new byte[16];
            new SecureRandom().nextBytes(iv);
            IvParameterSpec ivSpec = new IvParameterSpec(iv);
            
            this.encryptCipher.init(Cipher.ENCRYPT_MODE, encryptionKey, ivSpec);
            this.decryptCipher.init(Cipher.DECRYPT_MODE, encryptionKey, ivSpec);
        }
        
        public byte[] encryptPacket(byte[] data) throws Exception {
            if (!active) {
                throw new IllegalStateException("Tunnel not active");
            }
            
            byte[] encrypted = encryptCipher.doFinal(data);
            bytesOut += encrypted.length;
            packetsOut++;
            
            return encrypted;
        }
        
        public byte[] decryptPacket(byte[] encryptedData) throws Exception {
            if (!active) {
                throw new IllegalStateException("Tunnel not active");
            }
            
            byte[] decrypted = decryptCipher.doFinal(encryptedData);
            bytesIn += encryptedData.length;
            packetsIn++;
            
            return decrypted;
        }
        
        public void activate() {
            this.active = true;
        }
        
        public void deactivate() {
            this.active = false;
        }
        
        public Map<String, Object> getStatistics() {
            Map<String, Object> stats = new HashMap<>();
            stats.put("tunnelId", tunnelId);
            stats.put("localEndpoint", localEndpoint.getHostAddress());
            stats.put("remoteEndpoint", remoteEndpoint.getHostAddress());
            stats.put("active", active);
            stats.put("establishedAt", establishedAt.toString());
            stats.put("uptime", Duration.between(establishedAt, LocalDateTime.now()).toMinutes() + " minutes");
            stats.put("bytesIn", bytesIn);
            stats.put("bytesOut", bytesOut);
            stats.put("packetsIn", packetsIn);
            stats.put("packetsOut", packetsOut);
            
            return stats;
        }
        
        // Getters
        public String getTunnelId() { return tunnelId; }
        public boolean isActive() { return active; }
        public InetAddress getLocalEndpoint() { return localEndpoint; }
        public InetAddress getRemoteEndpoint() { return remoteEndpoint; }
    }
    
    public static class VPNServer {
        private VPNProtocolType protocol;
        private int port;
        private Map<String, VPNTunnel> activeTunnels;
        private Map<String, ClientSession> clientSessions;
        private KeyPair serverKeyPair;
        private boolean running;
        
        public static class ClientSession {
            public String sessionId;
            public String username;
            public InetAddress clientIP;
            public LocalDateTime connectedAt;
            public VPNTunnel tunnel;
            public long lastActivity;
            
            public ClientSession(String sessionId, String username, InetAddress clientIP) {
                this.sessionId = sessionId;
                this.username = username;
                this.clientIP = clientIP;
                this.connectedAt = LocalDateTime.now();
                this.lastActivity = System.currentTimeMillis();
            }
            
            public void updateActivity() {
                this.lastActivity = System.currentTimeMillis();
            }
            
            public boolean isExpired(long timeoutMs) {
                return System.currentTimeMillis() - lastActivity > timeoutMs;
            }
        }
        
        public VPNServer(VPNProtocolType protocol, int port) throws Exception {
            this.protocol = protocol;
            this.port = port;
            this.activeTunnels = new ConcurrentHashMap<>();
            this.clientSessions = new ConcurrentHashMap<>();
            this.running = false;
            
            generateServerKeys();
        }
        
        private void generateServerKeys() throws Exception {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
            keyGen.initialize(2048);
            this.serverKeyPair = keyGen.generateKeyPair();
        }
        
        public String authenticateClient(String username, String password, InetAddress clientIP) {
            // Simplified authentication - in production, use proper user database
            Map<String, String> users = Map.of(
                "alice", "password123",
                "bob", "securepass456",
                "admin", "adminpass789"
            );
            
            if (users.containsKey(username) && users.get(username).equals(password)) {
                String sessionId = generateSessionId(username, clientIP);
                ClientSession session = new ClientSession(sessionId, username, clientIP);
                clientSessions.put(sessionId, session);
                
                return sessionId;
            }
            
            return null; // Authentication failed
        }
        
        private String generateSessionId(String username, InetAddress clientIP) {
            String data = username + clientIP.getHostAddress() + System.currentTimeMillis();
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                byte[] hash = md.digest(data.getBytes());
                return Base64.getEncoder().encodeToString(hash).substring(0, 16);
            } catch (Exception e) {
                return UUID.randomUUID().toString().substring(0, 16);
            }
        }
        
        public VPNTunnel establishTunnel(String sessionId, InetAddress remoteEndpoint) throws Exception {
            ClientSession session = clientSessions.get(sessionId);
            if (session == null) {
                throw new SecurityException("Invalid session");
            }
            
            String tunnelId = "tunnel_" + sessionId;
            VPNTunnel tunnel = new VPNTunnel(tunnelId, getServerIP(), remoteEndpoint);
            tunnel.activate();
            
            activeTunnels.put(tunnelId, tunnel);
            session.tunnel = tunnel;
            session.updateActivity();
            
            return tunnel;
        }
        
        private InetAddress getServerIP() throws Exception {
            return InetAddress.getLocalHost();
        }
        
        public void processPacket(String sessionId, byte[] encryptedData) throws Exception {
            ClientSession session = clientSessions.get(sessionId);
            if (session == null || session.tunnel == null) {
                throw new SecurityException("No active tunnel for session");
            }
            
            session.updateActivity();
            
            // Decrypt packet
            byte[] decryptedData = session.tunnel.decryptPacket(encryptedData);
            
            // Process packet (route to destination, apply policies, etc.)
            processDecryptedPacket(decryptedData, session);
        }
        
        private void processDecryptedPacket(byte[] data, ClientSession session) {
            // In a real VPN server, this would:
            // 1. Parse the IP packet
            // 2. Apply routing rules
            // 3. Forward to destination network
            // 4. Handle return traffic
            
            System.out.println("Processing packet from " + session.username + 
                             ": " + data.length + " bytes");
        }
        
        public void disconnectClient(String sessionId) {
            ClientSession session = clientSessions.remove(sessionId);
            if (session != null && session.tunnel != null) {
                session.tunnel.deactivate();
                activeTunnels.remove(session.tunnel.getTunnelId());
            }
        }
        
        public void cleanupExpiredSessions() {
            long timeoutMs = 30 * 60 * 1000; // 30 minutes
            
            Iterator<Map.Entry<String, ClientSession>> iterator = 
                clientSessions.entrySet().iterator();
            
            while (iterator.hasNext()) {
                Map.Entry<String, ClientSession> entry = iterator.next();
                ClientSession session = entry.getValue();
                
                if (session.isExpired(timeoutMs)) {
                    if (session.tunnel != null) {
                        session.tunnel.deactivate();
                        activeTunnels.remove(session.tunnel.getTunnelId());
                    }
                    iterator.remove();
                }
            }
        }
        
        public Map<String, Object> getServerStatistics() {
            Map<String, Object> stats = new HashMap<>();
            
            stats.put("protocol", protocol.getName());
            stats.put("port", port);
            stats.put("running", running);
            stats.put("activeTunnels", activeTunnels.size());
            stats.put("connectedClients", clientSessions.size());
            
            // Tunnel statistics
            long totalBytesIn = activeTunnels.values().stream()
                .mapToLong(t -> (Long) t.getStatistics().get("bytesIn"))
                .sum();
            long totalBytesOut = activeTunnels.values().stream()
                .mapToLong(t -> (Long) t.getStatistics().get("bytesOut"))
                .sum();
            
            stats.put("totalBytesIn", totalBytesIn);
            stats.put("totalBytesOut", totalBytesOut);
            
            // Client information
            List<Map<String, Object>> clients = new ArrayList<>();
            for (ClientSession session : clientSessions.values()) {
                Map<String, Object> clientInfo = new HashMap<>();
                clientInfo.put("sessionId", session.sessionId);
                clientInfo.put("username", session.username);
                clientInfo.put("clientIP", session.clientIP.getHostAddress());
                clientInfo.put("connectedAt", session.connectedAt.toString());
                clientInfo.put("hasTunnel", session.tunnel != null);
                clients.add(clientInfo);
            }
            stats.put("clients", clients);
            
            return stats;
        }
        
        public void start() {
            this.running = true;
            System.out.println("VPN Server started - Protocol: " + protocol.getName() + 
                             ", Port: " + port);
        }
        
        public void stop() {
            this.running = false;
            
            // Disconnect all clients
            for (String sessionId : new ArrayList<>(clientSessions.keySet())) {
                disconnectClient(sessionId);
            }
            
            System.out.println("VPN Server stopped");
        }
    }
    
    public static void main(String[] args) throws Exception {
        // Create VPN server
        VPNServer server = new VPNServer(VPNProtocolType.OPENVPN, 1194);
        server.start();
        
        // Simulate client connections
        InetAddress clientIP1 = InetAddress.getByName("192.168.1.100");
        InetAddress clientIP2 = InetAddress.getByName("192.168.1.101");
        
        // Authenticate clients
        String session1 = server.authenticateClient("alice", "password123", clientIP1);
        String session2 = server.authenticateClient("bob", "securepass456", clientIP2);
        
        if (session1 != null && session2 != null) {
            System.out.println("Clients authenticated successfully");
            
            // Establish tunnels
            VPNTunnel tunnel1 = server.establishTunnel(session1, clientIP1);
            VPNTunnel tunnel2 = server.establishTunnel(session2, clientIP2);
            
            System.out.println("Tunnels established");
            
            // Simulate some traffic
            byte[] testData = "Hello VPN World!".getBytes();
            
            for (int i = 0; i < 10; i++) {
                byte[] encrypted1 = tunnel1.encryptPacket(testData);
                byte[] encrypted2 = tunnel2.encryptPacket(testData);
                
                server.processPacket(session1, encrypted1);
                server.processPacket(session2, encrypted2);
            }
            
            // Show statistics
            System.out.println("\\n=== Server Statistics ===");
            Map<String, Object> stats = server.getServerStatistics();
            stats.forEach((key, value) -> {
                if (!key.equals("clients")) {
                    System.out.println(key + ": " + value);
                }
            });
            
            System.out.println("\\n=== Tunnel Statistics ===");
            System.out.println("Tunnel 1: " + tunnel1.getStatistics());
            System.out.println("Tunnel 2: " + tunnel2.getStatistics());
            
            // Cleanup
            server.disconnectClient(session1);
            server.disconnectClient(session2);
        }
        
        server.stop();
    }
}
      `
    }
  ],

  resources: [
    {
      title: "VPN Fundamentals - GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/virtual-private-network-vpn-introduction/",
      description: "Comprehensive introduction to VPN concepts and technologies"
    },
    {
      title: "VPN Protocols Explained - YouTube",
      url: "https://www.youtube.com/watch?v=_wQTRMBAvzg",
      description: "Detailed comparison of different VPN protocols and their uses"
    },
    {
      title: "OpenVPN Documentation",
      url: "https://openvpn.net/community-resources/",
      description: "Official documentation for OpenVPN protocol and implementation"
    },
    {
      title: "WireGuard Protocol Specification",
      url: "https://www.wireguard.com/protocol/",
      description: "Technical specification of the modern WireGuard VPN protocol"
    },
    {
      title: "IPSec VPN Configuration Guide",
      url: "https://www.cisco.com/c/en/us/support/docs/security-vpn/ipsec-negotiation-ike-protocols/14106-how-ipsec-works.html",
      description: "Cisco's comprehensive guide to IPSec VPN configuration"
    }
  ],

  questions: [
    {
      question: "What is a VPN and how does it work?",
      answer: "A VPN (Virtual Private Network) creates a secure, encrypted tunnel between a device and a network over the internet. It works by encrypting all data transmission, routing traffic through VPN servers, masking the user's IP address, and providing secure access to private network resources as if the user were directly connected to that network."
    },
    {
      question: "What are the main types of VPN and their use cases?",
      answer: "Main types include: 1) Remote Access VPN - for individual users connecting from remote locations (telecommuting). 2) Site-to-Site VPN - connecting entire networks (branch offices to headquarters). 3) Client-to-Site VPN - specific client devices to central sites. Each serves different organizational and security needs."
    },
    {
      question: "What are the differences between VPN protocols?",
      answer: "OpenVPN: Open-source, highly secure, configurable. IPSec: Industry standard, strong encryption, complex setup. WireGuard: Modern, fast, simple configuration. L2TP/IPSec: Good compatibility, moderate security. PPTP: Fast but weak security (deprecated). Each offers different balances of security, speed, and compatibility."
    },
    {
      question: "How does VPN encryption protect data transmission?",
      answer: "VPN encryption uses protocols like AES-256 to encrypt all data before transmission. The encrypted data travels through the internet tunnel, making it unreadable to interceptors. Only the VPN endpoints with the correct decryption keys can read the data, protecting against eavesdropping, man-in-the-middle attacks, and data theft."
    },
    {
      question: "What are the security benefits and limitations of VPNs?",
      answer: "Benefits: encrypted data transmission, IP address masking, secure remote access, bypass geo-restrictions, protection on public Wi-Fi. Limitations: potential speed reduction, dependence on VPN provider security, possible DNS leaks, not protection against malware, and legal/policy restrictions in some regions."
    },
    {
      question: "How do you choose the right VPN protocol for different scenarios?",
      answer: "Consider: Security requirements (OpenVPN/WireGuard for high security), Performance needs (WireGuard for speed), Compatibility (L2TP for older systems), Ease of setup (WireGuard for simplicity), Network environment (IPSec for enterprise), and specific features needed (OpenVPN for flexibility)."
    },
    {
      question: "What is split tunneling in VPN and when is it useful?",
      answer: "Split tunneling allows some traffic to go through the VPN while other traffic uses the regular internet connection. Useful for: accessing local network resources while connected to VPN, reducing VPN server load, improving performance for non-sensitive traffic, and maintaining access to local services."
    },
    {
      question: "How do site-to-site VPNs work and what are their benefits?",
      answer: "Site-to-site VPNs connect entire networks by establishing encrypted tunnels between VPN gateways at each location. Benefits include: seamless connectivity between offices, centralized resource access, cost-effective alternative to dedicated lines, scalable network expansion, and secure inter-office communication."
    },
    {
      question: "What are common VPN implementation challenges and solutions?",
      answer: "Challenges: NAT traversal issues (use NAT-T), firewall blocking (configure proper ports), performance degradation (optimize encryption/compression), authentication complexity (implement proper PKI), and client configuration (use auto-configuration tools). Solutions involve proper planning, testing, and gradual deployment."
    },
    {
      question: "How do you troubleshoot VPN connectivity issues?",
      answer: "Troubleshooting steps: 1) Check internet connectivity, 2) Verify VPN server status, 3) Test firewall/port configurations, 4) Validate authentication credentials, 5) Check routing tables, 6) Test different protocols, 7) Examine logs for errors, 8) Verify DNS settings, 9) Test from different locations, 10) Check for software conflicts."
    }
  ]
};