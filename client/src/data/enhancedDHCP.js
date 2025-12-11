export const enhancedDHCP = {
  id: 'dhcp',
  title: 'DHCP (Dynamic Host Configuration Protocol)',
  subtitle: 'Automatic IP Address Assignment',
  summary: 'Protocol for automatically assigning IP addresses and network configuration to devices, including DHCP process, lease management, and configuration options.',
  
  analogy: "Think of DHCP like a hotel reception desk. When guests (devices) arrive, the receptionist (DHCP server) automatically assigns them room numbers (IP addresses) from available rooms, provides hotel information (network settings), and keeps track of check-in/check-out times (lease duration).",
  
  visualConcept: "Imagine DHCP as an automatic parking system that assigns parking spots to cars. When a car enters, the system finds an available spot, gives directions (IP configuration), sets a time limit (lease), and can extend or reassign spots as needed.",
  
  realWorldUse: "Home Wi-Fi networks, corporate LANs, public hotspots, mobile device connectivity, and any network where devices need automatic IP configuration.",

  explanation: `
DHCP (Dynamic Host Configuration Protocol) is a network service that automatically assigns IP addresses and other network configuration parameters to devices on a network.

DHCP Process (DORA):
1. Discover: Client broadcasts DHCP Discover message
2. Offer: Server responds with DHCP Offer containing available IP
3. Request: Client requests the offered IP address
4. Acknowledge: Server confirms assignment and provides configuration

Key Components:
- DHCP Server: Manages IP address pool and configuration
- DHCP Client: Requests network configuration
- IP Address Pool: Range of available IP addresses
- Lease Time: Duration for which IP is assigned
- Reservations: Fixed IP assignments for specific devices

Configuration Parameters:
- IP Address and Subnet Mask
- Default Gateway
- DNS Server addresses
- Domain name
- NTP servers
- TFTP server for network booting

DHCP Options:
Standard options provide additional network configuration like time servers, boot file names, vendor-specific information, and network settings.

Lease Management:
DHCP manages IP address leases with renewal, rebinding, and release processes to ensure efficient address utilization and prevent conflicts.
  `,

  keyPoints: [
    "DHCP automates IP address assignment and network configuration",
    "DORA process: Discover, Offer, Request, Acknowledge",
    "Lease time controls how long devices keep IP addresses",
    "DHCP reservations provide fixed IPs for specific devices",
    "Reduces network administration overhead significantly",
    "Prevents IP address conflicts through centralized management",
    "Supports various configuration options beyond IP addresses",
    "Works with DHCP relay agents for multiple subnets",
    "Provides fault tolerance through multiple DHCP servers",
    "Essential for mobile devices and dynamic networks"
  ],

  codeExamples: [
    {
      title: "DHCP Server Simulator",
      language: "python",
      code: `
import socket
import struct
import random
import time
from datetime import datetime, timedelta

class DHCPServer:
    def __init__(self, server_ip, start_ip, end_ip, subnet_mask, gateway, dns_servers):
        self.server_ip = server_ip
        self.subnet_mask = subnet_mask
        self.gateway = gateway
        self.dns_servers = dns_servers
        
        # Generate IP pool
        self.ip_pool = self.generate_ip_pool(start_ip, end_ip)
        self.leases = {}  # MAC -> {ip, lease_time, expires}
        self.reservations = {}  # MAC -> IP
        
        self.lease_duration = 3600  # 1 hour default
        
    def generate_ip_pool(self, start_ip, end_ip):
        """Generate pool of available IP addresses"""
        start = struct.unpack('!I', socket.inet_aton(start_ip))[0]
        end = struct.unpack('!I', socket.inet_aton(end_ip))[0]
        
        pool = []
        for ip_int in range(start, end + 1):
            ip = socket.inet_ntoa(struct.pack('!I', ip_int))
            pool.append(ip)
        
        return pool
    
    def get_available_ip(self, mac_address):
        """Get available IP address for client"""
        # Check for existing lease
        if mac_address in self.leases:
            lease = self.leases[mac_address]
            if datetime.now() < lease['expires']:
                return lease['ip']
            else:
                # Lease expired, remove it
                self.ip_pool.append(lease['ip'])
                del self.leases[mac_address]
        
        # Check for reservation
        if mac_address in self.reservations:
            reserved_ip = self.reservations[mac_address]
            if reserved_ip in self.ip_pool:
                self.ip_pool.remove(reserved_ip)
            return reserved_ip
        
        # Assign new IP from pool
        if self.ip_pool:
            return self.ip_pool.pop(0)
        
        return None
    
    def create_dhcp_offer(self, client_mac, transaction_id, requested_ip=None):
        """Create DHCP Offer packet"""
        offered_ip = self.get_available_ip(client_mac)
        if not offered_ip:
            return None
        
        # DHCP packet structure (simplified)
        packet = {
            'op': 2,  # Boot reply
            'htype': 1,  # Ethernet
            'hlen': 6,  # MAC address length
            'hops': 0,
            'xid': transaction_id,
            'secs': 0,
            'flags': 0,
            'ciaddr': '0.0.0.0',  # Client IP
            'yiaddr': offered_ip,  # Your IP
            'siaddr': self.server_ip,  # Server IP
            'giaddr': '0.0.0.0',  # Gateway IP
            'chaddr': client_mac,  # Client MAC
            'options': {
                53: 2,  # DHCP Message Type: Offer
                1: self.subnet_mask,  # Subnet Mask
                3: self.gateway,  # Router
                6: self.dns_servers,  # DNS Servers
                51: self.lease_duration,  # Lease Time
                54: self.server_ip  # DHCP Server Identifier
            }
        }
        
        return packet
    
    def create_dhcp_ack(self, client_mac, transaction_id, requested_ip):
        """Create DHCP ACK packet"""
        # Verify IP is available for this client
        available_ip = self.get_available_ip(client_mac)
        if available_ip != requested_ip:
            return self.create_dhcp_nak(transaction_id)
        
        # Create lease
        expires = datetime.now() + timedelta(seconds=self.lease_duration)
        self.leases[client_mac] = {
            'ip': requested_ip,
            'lease_time': self.lease_duration,
            'expires': expires
        }
        
        packet = {
            'op': 2,
            'htype': 1,
            'hlen': 6,
            'hops': 0,
            'xid': transaction_id,
            'secs': 0,
            'flags': 0,
            'ciaddr': '0.0.0.0',
            'yiaddr': requested_ip,
            'siaddr': self.server_ip,
            'giaddr': '0.0.0.0',
            'chaddr': client_mac,
            'options': {
                53: 5,  # DHCP Message Type: ACK
                1: self.subnet_mask,
                3: self.gateway,
                6: self.dns_servers,
                51: self.lease_duration,
                54: self.server_ip
            }
        }
        
        return packet
    
    def create_dhcp_nak(self, transaction_id):
        """Create DHCP NAK packet"""
        return {
            'op': 2,
            'xid': transaction_id,
            'options': {
                53: 6,  # DHCP Message Type: NAK
                54: self.server_ip
            }
        }
    
    def process_discover(self, packet):
        """Process DHCP Discover message"""
        client_mac = packet['chaddr']
        transaction_id = packet['xid']
        
        print(f"DHCP Discover from {client_mac}")
        
        offer = self.create_dhcp_offer(client_mac, transaction_id)
        if offer:
            print(f"Offering IP {offer['yiaddr']} to {client_mac}")
            return offer
        else:
            print(f"No available IP for {client_mac}")
            return None
    
    def process_request(self, packet):
        """Process DHCP Request message"""
        client_mac = packet['chaddr']
        transaction_id = packet['xid']
        requested_ip = packet['options'].get(50)  # Requested IP Address
        
        print(f"DHCP Request from {client_mac} for IP {requested_ip}")
        
        if requested_ip:
            ack = self.create_dhcp_ack(client_mac, transaction_id, requested_ip)
            if ack['options'][53] == 5:  # ACK
                print(f"ACK: Assigned IP {requested_ip} to {client_mac}")
            else:  # NAK
                print(f"NAK: Cannot assign IP {requested_ip} to {client_mac}")
            return ack
        
        return self.create_dhcp_nak(transaction_id)
    
    def add_reservation(self, mac_address, ip_address):
        """Add IP reservation for specific MAC address"""
        self.reservations[mac_address] = ip_address
        print(f"Added reservation: {mac_address} -> {ip_address}")
    
    def get_lease_info(self):
        """Get current lease information"""
        active_leases = []
        expired_leases = []
        
        for mac, lease in self.leases.items():
            if datetime.now() < lease['expires']:
                active_leases.append({
                    'mac': mac,
                    'ip': lease['ip'],
                    'expires': lease['expires'].strftime('%Y-%m-%d %H:%M:%S')
                })
            else:
                expired_leases.append(mac)
        
        # Clean up expired leases
        for mac in expired_leases:
            expired_lease = self.leases[mac]
            self.ip_pool.append(expired_lease['ip'])
            del self.leases[mac]
        
        return {
            'active_leases': active_leases,
            'available_ips': len(self.ip_pool),
            'total_pool': len(self.ip_pool) + len(active_leases)
        }

# DHCP Client Simulator
class DHCPClient:
    def __init__(self, mac_address):
        self.mac_address = mac_address
        self.ip_address = None
        self.lease_time = 0
        self.server_ip = None
        self.transaction_id = random.randint(1, 0xFFFFFFFF)
    
    def create_discover(self):
        """Create DHCP Discover packet"""
        return {
            'op': 1,  # Boot request
            'htype': 1,
            'hlen': 6,
            'hops': 0,
            'xid': self.transaction_id,
            'secs': 0,
            'flags': 0x8000,  # Broadcast flag
            'ciaddr': '0.0.0.0',
            'yiaddr': '0.0.0.0',
            'siaddr': '0.0.0.0',
            'giaddr': '0.0.0.0',
            'chaddr': self.mac_address,
            'options': {
                53: 1,  # DHCP Message Type: Discover
                55: [1, 3, 6, 15]  # Parameter Request List
            }
        }
    
    def create_request(self, offered_ip, server_ip):
        """Create DHCP Request packet"""
        return {
            'op': 1,
            'htype': 1,
            'hlen': 6,
            'hops': 0,
            'xid': self.transaction_id,
            'secs': 0,
            'flags': 0x8000,
            'ciaddr': '0.0.0.0',
            'yiaddr': '0.0.0.0',
            'siaddr': '0.0.0.0',
            'giaddr': '0.0.0.0',
            'chaddr': self.mac_address,
            'options': {
                53: 3,  # DHCP Message Type: Request
                50: offered_ip,  # Requested IP Address
                54: server_ip  # Server Identifier
            }
        }

# Usage example
if __name__ == "__main__":
    # Create DHCP server
    server = DHCPServer(
        server_ip="192.168.1.1",
        start_ip="192.168.1.100",
        end_ip="192.168.1.200",
        subnet_mask="255.255.255.0",
        gateway="192.168.1.1",
        dns_servers=["8.8.8.8", "8.8.4.4"]
    )
    
    # Add reservation
    server.add_reservation("aa:bb:cc:dd:ee:ff", "192.168.1.150")
    
    # Simulate DHCP process
    clients = [
        DHCPClient("11:22:33:44:55:66"),
        DHCPClient("aa:bb:cc:dd:ee:ff"),  # Has reservation
        DHCPClient("77:88:99:aa:bb:cc")
    ]
    
    for client in clients:
        print(f"\\n--- DHCP Process for {client.mac_address} ---")
        
        # Step 1: Discover
        discover = client.create_discover()
        offer = server.process_discover(discover)
        
        if offer:
            # Step 2: Request
            request = client.create_request(offer['yiaddr'], offer['siaddr'])
            ack = server.process_request(request)
            
            if ack['options'][53] == 5:  # ACK
                client.ip_address = ack['yiaddr']
                client.lease_time = ack['options'][51]
                client.server_ip = ack['siaddr']
                print(f"Client configured: IP={client.ip_address}, Lease={client.lease_time}s")
    
    # Show lease information
    print("\\n--- Current Lease Information ---")
    lease_info = server.get_lease_info()
    print(f"Active leases: {len(lease_info['active_leases'])}")
    print(f"Available IPs: {lease_info['available_ips']}")
    
    for lease in lease_info['active_leases']:
        print(f"  {lease['mac']} -> {lease['ip']} (expires: {lease['expires']})")
      `
    },
    {
      title: "DHCP Packet Analyzer",
      language: "java",
      code: `
import java.net.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class DHCPAnalyzer {
    
    public static class DHCPPacket {
        public enum MessageType {
            DISCOVER(1), OFFER(2), REQUEST(3), DECLINE(4), 
            ACK(5), NAK(6), RELEASE(7), INFORM(8);
            
            private final int value;
            MessageType(int value) { this.value = value; }
            public int getValue() { return value; }
            
            public static MessageType fromValue(int value) {
                for (MessageType type : values()) {
                    if (type.value == value) return type;
                }
                return null;
            }
        }
        
        private int op;
        private int htype;
        private int hlen;
        private int hops;
        private long xid;
        private int secs;
        private int flags;
        private InetAddress ciaddr, yiaddr, siaddr, giaddr;
        private byte[] chaddr;
        private Map<Integer, Object> options;
        
        public DHCPPacket() {
            this.options = new HashMap<>();
            this.chaddr = new byte[16];
        }
        
        // Getters and setters
        public MessageType getMessageType() {
            Object type = options.get(53);
            if (type instanceof Integer) {
                return MessageType.fromValue((Integer) type);
            }
            return null;
        }
        
        public void setMessageType(MessageType type) {
            options.put(53, type.getValue());
        }
        
        public String getClientMAC() {
            StringBuilder mac = new StringBuilder();
            for (int i = 0; i < 6; i++) {
                if (i > 0) mac.append(":");
                mac.append(String.format("%02x", chaddr[i] & 0xFF));
            }
            return mac.toString();
        }
        
        public void setClientMAC(String macAddress) {
            String[] parts = macAddress.split(":");
            for (int i = 0; i < Math.min(parts.length, 6); i++) {
                chaddr[i] = (byte) Integer.parseInt(parts[i], 16);
            }
        }
        
        // Additional getters/setters for other fields...
        public long getXid() { return xid; }
        public void setXid(long xid) { this.xid = xid; }
        
        public InetAddress getYourIP() { return yiaddr; }
        public void setYourIP(InetAddress yiaddr) { this.yiaddr = yiaddr; }
        
        public Map<Integer, Object> getOptions() { return options; }
        
        @Override
        public String toString() {
            return String.format("DHCP %s: XID=0x%x, Client=%s, YourIP=%s", 
                getMessageType(), xid, getClientMAC(), 
                yiaddr != null ? yiaddr.getHostAddress() : "0.0.0.0");
        }
    }
    
    public static class DHCPLeaseManager {
        private Map<String, LeaseInfo> activeLeases;
        private Map<String, String> reservations;
        private Set<String> ipPool;
        private long defaultLeaseTime;
        
        public static class LeaseInfo {
            public String ipAddress;
            public long leaseTime;
            public long startTime;
            public String clientMAC;
            
            public LeaseInfo(String ip, long leaseTime, String mac) {
                this.ipAddress = ip;
                this.leaseTime = leaseTime;
                this.clientMAC = mac;
                this.startTime = System.currentTimeMillis();
            }
            
            public boolean isExpired() {
                return System.currentTimeMillis() > (startTime + leaseTime * 1000);
            }
            
            public long getRemainingTime() {
                long remaining = (startTime + leaseTime * 1000) - System.currentTimeMillis();
                return Math.max(0, remaining / 1000);
            }
        }
        
        public DHCPLeaseManager(String startIP, String endIP, long defaultLeaseTime) {
            this.activeLeases = new ConcurrentHashMap<>();
            this.reservations = new ConcurrentHashMap<>();
            this.ipPool = ConcurrentHashMap.newKeySet();
            this.defaultLeaseTime = defaultLeaseTime;
            
            generateIPPool(startIP, endIP);
        }
        
        private void generateIPPool(String startIP, String endIP) {
            try {
                long start = ipToLong(InetAddress.getByName(startIP));
                long end = ipToLong(InetAddress.getByName(endIP));
                
                for (long ip = start; ip <= end; ip++) {
                    ipPool.add(longToIP(ip));
                }
            } catch (UnknownHostException e) {
                System.err.println("Invalid IP range: " + e.getMessage());
            }
        }
        
        private long ipToLong(InetAddress ip) {
            byte[] bytes = ip.getAddress();
            long result = 0;
            for (byte b : bytes) {
                result = (result << 8) | (b & 0xFF);
            }
            return result;
        }
        
        private String longToIP(long ip) {
            return String.format("%d.%d.%d.%d",
                (ip >> 24) & 0xFF, (ip >> 16) & 0xFF,
                (ip >> 8) & 0xFF, ip & 0xFF);
        }
        
        public synchronized String assignIP(String clientMAC) {
            // Clean expired leases first
            cleanExpiredLeases();
            
            // Check for existing lease
            LeaseInfo existing = activeLeases.get(clientMAC);
            if (existing != null && !existing.isExpired()) {
                return existing.ipAddress;
            }
            
            // Check for reservation
            String reservedIP = reservations.get(clientMAC);
            if (reservedIP != null) {
                if (ipPool.contains(reservedIP) || 
                    (existing != null && existing.ipAddress.equals(reservedIP))) {
                    ipPool.remove(reservedIP);
                    activeLeases.put(clientMAC, new LeaseInfo(reservedIP, defaultLeaseTime, clientMAC));
                    return reservedIP;
                }
            }
            
            // Assign from pool
            if (!ipPool.isEmpty()) {
                String assignedIP = ipPool.iterator().next();
                ipPool.remove(assignedIP);
                activeLeases.put(clientMAC, new LeaseInfo(assignedIP, defaultLeaseTime, clientMAC));
                return assignedIP;
            }
            
            return null; // No available IPs
        }
        
        public synchronized boolean releaseIP(String clientMAC) {
            LeaseInfo lease = activeLeases.remove(clientMAC);
            if (lease != null) {
                ipPool.add(lease.ipAddress);
                return true;
            }
            return false;
        }
        
        public void addReservation(String clientMAC, String ipAddress) {
            reservations.put(clientMAC, ipAddress);
        }
        
        private void cleanExpiredLeases() {
            Iterator<Map.Entry<String, LeaseInfo>> iterator = activeLeases.entrySet().iterator();
            while (iterator.hasNext()) {
                Map.Entry<String, LeaseInfo> entry = iterator.next();
                if (entry.getValue().isExpired()) {
                    ipPool.add(entry.getValue().ipAddress);
                    iterator.remove();
                }
            }
        }
        
        public Map<String, LeaseInfo> getActiveLeases() {
            cleanExpiredLeases();
            return new HashMap<>(activeLeases);
        }
        
        public int getAvailableIPCount() {
            cleanExpiredLeases();
            return ipPool.size();
        }
    }
    
    public static class DHCPStatistics {
        private Map<DHCPPacket.MessageType, Integer> messageCount;
        private Map<String, Integer> clientActivity;
        private long totalPackets;
        private long startTime;
        
        public DHCPStatistics() {
            this.messageCount = new EnumMap<>(DHCPPacket.MessageType.class);
            this.clientActivity = new ConcurrentHashMap<>();
            this.totalPackets = 0;
            this.startTime = System.currentTimeMillis();
        }
        
        public synchronized void recordPacket(DHCPPacket packet) {
            totalPackets++;
            
            DHCPPacket.MessageType type = packet.getMessageType();
            if (type != null) {
                messageCount.merge(type, 1, Integer::sum);
            }
            
            String clientMAC = packet.getClientMAC();
            clientActivity.merge(clientMAC, 1, Integer::sum);
        }
        
        public void printStatistics() {
            long uptime = (System.currentTimeMillis() - startTime) / 1000;
            
            System.out.println("=== DHCP Statistics ===");
            System.out.println("Uptime: " + uptime + " seconds");
            System.out.println("Total packets: " + totalPackets);
            System.out.println("Packets per second: " + (totalPackets / Math.max(1, uptime)));
            
            System.out.println("\\nMessage type distribution:");
            for (Map.Entry<DHCPPacket.MessageType, Integer> entry : messageCount.entrySet()) {
                double percentage = (entry.getValue() * 100.0) / totalPackets;
                System.out.printf("  %s: %d (%.1f%%)%n", 
                    entry.getKey(), entry.getValue(), percentage);
            }
            
            System.out.println("\\nTop 5 active clients:");
            clientActivity.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5)
                .forEach(entry -> System.out.printf("  %s: %d packets%n", 
                    entry.getKey(), entry.getValue()));
        }
    }
    
    public static void main(String[] args) {
        // Create lease manager
        DHCPLeaseManager leaseManager = new DHCPLeaseManager("192.168.1.100", "192.168.1.200", 3600);
        
        // Add some reservations
        leaseManager.addReservation("aa:bb:cc:dd:ee:ff", "192.168.1.150");
        
        // Create statistics tracker
        DHCPStatistics stats = new DHCPStatistics();
        
        // Simulate DHCP traffic
        String[] testMACs = {
            "11:22:33:44:55:66", "aa:bb:cc:dd:ee:ff", "77:88:99:aa:bb:cc",
            "12:34:56:78:9a:bc", "fe:dc:ba:98:76:54"
        };
        
        Random random = new Random();
        
        System.out.println("Simulating DHCP traffic...");
        
        for (int i = 0; i < 50; i++) {
            String clientMAC = testMACs[random.nextInt(testMACs.length)];
            
            // Create DHCP Discover
            DHCPPacket discover = new DHCPPacket();
            discover.setMessageType(DHCPPacket.MessageType.DISCOVER);
            discover.setClientMAC(clientMAC);
            discover.setXid(random.nextLong() & 0xFFFFFFFFL);
            
            stats.recordPacket(discover);
            System.out.println("Processed: " + discover);
            
            // Assign IP
            String assignedIP = leaseManager.assignIP(clientMAC);
            if (assignedIP != null) {
                // Create DHCP Offer
                DHCPPacket offer = new DHCPPacket();
                offer.setMessageType(DHCPPacket.MessageType.OFFER);
                offer.setClientMAC(clientMAC);
                offer.setXid(discover.getXid());
                try {
                    offer.setYourIP(InetAddress.getByName(assignedIP));
                } catch (UnknownHostException e) {
                    e.printStackTrace();
                }
                
                stats.recordPacket(offer);
                System.out.println("Processed: " + offer);
            }
            
            // Simulate some releases
            if (random.nextDouble() < 0.1) {
                leaseManager.releaseIP(clientMAC);
                
                DHCPPacket release = new DHCPPacket();
                release.setMessageType(DHCPPacket.MessageType.RELEASE);
                release.setClientMAC(clientMAC);
                
                stats.recordPacket(release);
                System.out.println("Processed: " + release);
            }
        }
        
        // Print statistics
        System.out.println("\\n" + "=".repeat(50));
        stats.printStatistics();
        
        System.out.println("\\n=== Lease Information ===");
        System.out.println("Available IPs: " + leaseManager.getAvailableIPCount());
        System.out.println("Active leases:");
        
        for (Map.Entry<String, DHCPLeaseManager.LeaseInfo> entry : leaseManager.getActiveLeases().entrySet()) {
            DHCPLeaseManager.LeaseInfo lease = entry.getValue();
            System.out.printf("  %s -> %s (expires in %d seconds)%n",
                entry.getKey(), lease.ipAddress, lease.getRemainingTime());
        }
    }
}
      `
    },
    {
      title: "DHCP Configuration Manager",
      language: "javascript",
      code: `
class DHCPConfigManager {
    constructor() {
        this.servers = new Map();
        this.globalOptions = new Map();
        this.scopes = new Map();
        
        this.initializeDefaultOptions();
    }
    
    initializeDefaultOptions() {
        // Standard DHCP options
        this.globalOptions.set(1, { name: 'Subnet Mask', type: 'ip' });
        this.globalOptions.set(3, { name: 'Router', type: 'ip_list' });
        this.globalOptions.set(6, { name: 'DNS Servers', type: 'ip_list' });
        this.globalOptions.set(15, { name: 'Domain Name', type: 'string' });
        this.globalOptions.set(42, { name: 'NTP Servers', type: 'ip_list' });
        this.globalOptions.set(51, { name: 'Lease Time', type: 'uint32' });
        this.globalOptions.set(53, { name: 'Message Type', type: 'uint8' });
        this.globalOptions.set(54, { name: 'Server Identifier', type: 'ip' });
        this.globalOptions.set(58, { name: 'Renewal Time', type: 'uint32' });
        this.globalOptions.set(59, { name: 'Rebinding Time', type: 'uint32' });
    }
    
    createServer(serverId, config) {
        const server = {
            id: serverId,
            ip: config.serverIP,
            port: config.port || 67,
            scopes: new Map(),
            reservations: new Map(),
            options: new Map(config.options || []),
            statistics: {
                discovers: 0,
                offers: 0,
                requests: 0,
                acks: 0,
                naks: 0,
                releases: 0,
                startTime: Date.now()
            }
        };
        
        this.servers.set(serverId, server);
        return server;
    }
    
    createScope(serverId, scopeConfig) {
        const server = this.servers.get(serverId);
        if (!server) {
            throw new Error(\`Server \${serverId} not found\`);
        }
        
        const scope = {
            id: scopeConfig.scopeId,
            network: scopeConfig.network,
            subnetMask: scopeConfig.subnetMask,
            startIP: scopeConfig.startIP,
            endIP: scopeConfig.endIP,
            excludedIPs: new Set(scopeConfig.excludedIPs || []),
            leaseTime: scopeConfig.leaseTime || 86400, // 24 hours default
            options: new Map(scopeConfig.options || []),
            activeLeases: new Map(),
            availableIPs: this.generateIPRange(scopeConfig.startIP, scopeConfig.endIP),
            enabled: true
        };
        
        // Remove excluded IPs
        scopeConfig.excludedIPs?.forEach(ip => {
            scope.availableIPs.delete(ip);
        });
        
        server.scopes.set(scopeConfig.scopeId, scope);
        return scope;
    }
    
    generateIPRange(startIP, endIP) {
        const ipSet = new Set();
        const start = this.ipToNumber(startIP);
        const end = this.ipToNumber(endIP);
        
        for (let ip = start; ip <= end; ip++) {
            ipSet.add(this.numberToIP(ip));
        }
        
        return ipSet;
    }
    
    ipToNumber(ip) {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
    }
    
    numberToIP(num) {
        return [
            (num >>> 24) & 255,
            (num >>> 16) & 255,
            (num >>> 8) & 255,
            num & 255
        ].join('.');
    }
    
    addReservation(serverId, scopeId, macAddress, ipAddress, description = '') {
        const server = this.servers.get(serverId);
        const scope = server?.scopes.get(scopeId);
        
        if (!scope) {
            throw new Error(\`Scope \${scopeId} not found in server \${serverId}\`);
        }
        
        // Validate IP is in scope range
        const ipNum = this.ipToNumber(ipAddress);
        const startNum = this.ipToNumber(scope.startIP);
        const endNum = this.ipToNumber(scope.endIP);
        
        if (ipNum < startNum || ipNum > endNum) {
            throw new Error(\`IP \${ipAddress} is outside scope range\`);
        }
        
        const reservation = {
            macAddress: macAddress.toLowerCase(),
            ipAddress,
            description,
            scopeId,
            created: new Date().toISOString()
        };
        
        server.reservations.set(macAddress.toLowerCase(), reservation);
        scope.availableIPs.delete(ipAddress);
        
        return reservation;
    }
    
    processDiscover(serverId, clientMAC, options = {}) {
        const server = this.servers.get(serverId);
        if (!server) return null;
        
        server.statistics.discovers++;
        
        // Check for existing lease
        for (const scope of server.scopes.values()) {
            const existingLease = scope.activeLeases.get(clientMAC);
            if (existingLease && !this.isLeaseExpired(existingLease)) {
                return this.createOffer(server, scope, clientMAC, existingLease.ipAddress);
            }
        }
        
        // Check for reservation
        const reservation = server.reservations.get(clientMAC.toLowerCase());
        if (reservation) {
            const scope = server.scopes.get(reservation.scopeId);
            if (scope && scope.enabled) {
                return this.createOffer(server, scope, clientMAC, reservation.ipAddress);
            }
        }
        
        // Find available IP in any enabled scope
        for (const scope of server.scopes.values()) {
            if (!scope.enabled || scope.availableIPs.size === 0) continue;
            
            const availableIP = scope.availableIPs.values().next().value;
            return this.createOffer(server, scope, clientMAC, availableIP);
        }
        
        return null; // No available IPs
    }
    
    createOffer(server, scope, clientMAC, offeredIP) {
        server.statistics.offers++;
        
        const offer = {
            messageType: 'OFFER',
            serverIP: server.ip,
            clientMAC,
            offeredIP,
            leaseTime: scope.leaseTime,
            options: this.buildOptions(server, scope),
            timestamp: Date.now()
        };
        
        return offer;
    }
    
    processRequest(serverId, clientMAC, requestedIP, serverIdentifier) {
        const server = this.servers.get(serverId);
        if (!server || serverIdentifier !== server.ip) {
            return this.createNAK(server);
        }
        
        server.statistics.requests++;
        
        // Find scope containing the requested IP
        let targetScope = null;
        for (const scope of server.scopes.values()) {
            const ipNum = this.ipToNumber(requestedIP);
            const startNum = this.ipToNumber(scope.startIP);
            const endNum = this.ipToNumber(scope.endIP);
            
            if (ipNum >= startNum && ipNum <= endNum) {
                targetScope = scope;
                break;
            }
        }
        
        if (!targetScope || !targetScope.enabled) {
            return this.createNAK(server);
        }
        
        // Check if IP is available or already leased to this client
        const existingLease = targetScope.activeLeases.get(clientMAC);
        const reservation = server.reservations.get(clientMAC.toLowerCase());
        
        const canAssign = 
            (existingLease && existingLease.ipAddress === requestedIP) ||
            (reservation && reservation.ipAddress === requestedIP) ||
            targetScope.availableIPs.has(requestedIP);
        
        if (!canAssign) {
            return this.createNAK(server);
        }
        
        // Create lease
        const lease = {
            clientMAC,
            ipAddress: requestedIP,
            leaseTime: targetScope.leaseTime,
            startTime: Date.now(),
            renewalTime: Date.now() + (targetScope.leaseTime * 500), // 50% of lease time
            rebindingTime: Date.now() + (targetScope.leaseTime * 875), // 87.5% of lease time
            scopeId: targetScope.id
        };
        
        targetScope.activeLeases.set(clientMAC, lease);
        targetScope.availableIPs.delete(requestedIP);
        
        server.statistics.acks++;
        
        return {
            messageType: 'ACK',
            serverIP: server.ip,
            clientMAC,
            assignedIP: requestedIP,
            leaseTime: targetScope.leaseTime,
            renewalTime: lease.renewalTime,
            rebindingTime: lease.rebindingTime,
            options: this.buildOptions(server, targetScope),
            timestamp: Date.now()
        };
    }
    
    createNAK(server) {
        if (server) server.statistics.naks++;
        
        return {
            messageType: 'NAK',
            serverIP: server?.ip,
            timestamp: Date.now()
        };
    }
    
    buildOptions(server, scope) {
        const options = new Map();
        
        // Server-level options
        for (const [code, value] of server.options) {
            options.set(code, value);
        }
        
        // Scope-level options (override server options)
        for (const [code, value] of scope.options) {
            options.set(code, value);
        }
        
        // Add default options if not specified
        if (!options.has(1)) options.set(1, scope.subnetMask);
        if (!options.has(51)) options.set(51, scope.leaseTime);
        if (!options.has(54)) options.set(54, server.ip);
        
        return options;
    }
    
    isLeaseExpired(lease) {
        return Date.now() > (lease.startTime + lease.leaseTime * 1000);
    }
    
    cleanExpiredLeases(serverId) {
        const server = this.servers.get(serverId);
        if (!server) return;
        
        for (const scope of server.scopes.values()) {
            const expiredLeases = [];
            
            for (const [mac, lease] of scope.activeLeases) {
                if (this.isLeaseExpired(lease)) {
                    expiredLeases.push(mac);
                    scope.availableIPs.add(lease.ipAddress);
                }
            }
            
            expiredLeases.forEach(mac => scope.activeLeases.delete(mac));
        }
    }
    
    getServerStatistics(serverId) {
        const server = this.servers.get(serverId);
        if (!server) return null;
        
        this.cleanExpiredLeases(serverId);
        
        const uptime = Date.now() - server.statistics.startTime;
        let totalLeases = 0;
        let totalAvailable = 0;
        
        for (const scope of server.scopes.values()) {
            totalLeases += scope.activeLeases.size;
            totalAvailable += scope.availableIPs.size;
        }
        
        return {
            serverId,
            uptime: Math.floor(uptime / 1000),
            statistics: { ...server.statistics },
            activeLeases: totalLeases,
            availableIPs: totalAvailable,
            utilizationRate: totalLeases / (totalLeases + totalAvailable) * 100
        };
    }
}

// Usage example
const dhcpManager = new DHCPConfigManager();

// Create DHCP server
const server = dhcpManager.createServer('server1', {
    serverIP: '192.168.1.1',
    options: [
        [3, '192.168.1.1'], // Default gateway
        [6, ['8.8.8.8', '8.8.4.4']], // DNS servers
        [15, 'example.com'] // Domain name
    ]
});

// Create scope
const scope = dhcpManager.createScope('server1', {
    scopeId: 'main',
    network: '192.168.1.0',
    subnetMask: '255.255.255.0',
    startIP: '192.168.1.100',
    endIP: '192.168.1.200',
    excludedIPs: ['192.168.1.150', '192.168.1.151'],
    leaseTime: 3600,
    options: [
        [42, ['pool.ntp.org']] // NTP server
    ]
});

// Add reservations
dhcpManager.addReservation('server1', 'main', 'aa:bb:cc:dd:ee:ff', '192.168.1.50', 'Server reservation');

// Simulate DHCP process
console.log('=== DHCP Simulation ===');

const testClients = [
    'aa:bb:cc:dd:ee:ff', // Has reservation
    '11:22:33:44:55:66',
    '77:88:99:aa:bb:cc'
];

testClients.forEach(mac => {
    console.log(\`\\nClient \${mac}:\`);
    
    // DHCP Discover
    const offer = dhcpManager.processDiscover('server1', mac);
    if (offer) {
        console.log(\`  Offered IP: \${offer.offeredIP}\`);
        
        // DHCP Request
        const ack = dhcpManager.processRequest('server1', mac, offer.offeredIP, offer.serverIP);
        if (ack.messageType === 'ACK') {
            console.log(\`  Assigned IP: \${ack.assignedIP}, Lease: \${ack.leaseTime}s\`);
        } else {
            console.log(\`  Request denied (NAK)\`);
        }
    } else {
        console.log(\`  No IP available\`);
    }
});

// Show statistics
console.log('\\n=== Server Statistics ===');
const stats = dhcpManager.getServerStatistics('server1');
console.log(\`Active leases: \${stats.activeLeases}\`);
console.log(\`Available IPs: \${stats.availableIPs}\`);
console.log(\`Utilization: \${stats.utilizationRate.toFixed(1)}%\`);
console.log(\`DHCP messages: Discovers=\${stats.statistics.discovers}, Offers=\${stats.statistics.offers}, Requests=\${stats.statistics.requests}, ACKs=\${stats.statistics.acks}\`);
      `
    }
  ],

  resources: [
    {
      title: "DHCP Protocol - GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/dynamic-host-configuration-protocol-dhcp/",
      description: "Comprehensive guide to DHCP protocol and configuration"
    },
    {
      title: "DHCP Explained - YouTube",
      url: "https://www.youtube.com/watch?v=e6-TaH5bkjo",
      description: "Visual explanation of DHCP process and configuration"
    },
    {
      title: "RFC 2131 - DHCP Protocol Specification",
      url: "https://tools.ietf.org/html/rfc2131",
      description: "Official DHCP protocol specification document"
    },
    {
      title: "DHCP Options and Parameters - IANA",
      url: "https://www.iana.org/assignments/bootp-dhcp-parameters/bootp-dhcp-parameters.xhtml",
      description: "Complete list of DHCP options and their meanings"
    },
    {
      title: "Windows DHCP Server Configuration",
      url: "https://docs.microsoft.com/en-us/windows-server/networking/technologies/dhcp/",
      description: "Microsoft's guide to DHCP server setup and management"
    }
  ],

  questions: [
    {
      question: "What is DHCP and why is it important in modern networks?",
      answer: "DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses and network configuration to devices. It's important because it eliminates manual IP configuration, prevents IP conflicts, reduces administrative overhead, supports mobile devices, and enables efficient IP address management in dynamic networks."
    },
    {
      question: "Explain the DHCP DORA process in detail.",
      answer: "DORA stands for Discover, Offer, Request, Acknowledge. 1) Discover: Client broadcasts request for IP configuration. 2) Offer: DHCP server responds with available IP and configuration. 3) Request: Client requests the offered IP address. 4) Acknowledge: Server confirms assignment and provides full configuration including lease time."
    },
    {
      question: "What is a DHCP lease and how does lease management work?",
      answer: "A DHCP lease is a temporary assignment of an IP address to a client for a specific duration. Lease management includes: lease time negotiation, renewal at 50% of lease time, rebinding at 87.5% of lease time, lease release when client disconnects, and automatic reclamation of expired leases for reuse."
    },
    {
      question: "What are DHCP reservations and when would you use them?",
      answer: "DHCP reservations assign specific IP addresses to particular MAC addresses, ensuring devices always get the same IP. Use reservations for: servers requiring consistent IPs, printers and network devices, devices referenced by IP in configurations, security cameras, and any device needing predictable network identity."
    },
    {
      question: "How does DHCP work across multiple subnets using DHCP relay agents?",
      answer: "DHCP relay agents (IP helpers) forward DHCP broadcasts between subnets since routers don't forward broadcasts by default. The relay agent receives client broadcasts, adds relay information, and unicasts to DHCP servers. Servers respond through the relay agent, which forwards responses back to clients."
    },
    {
      question: "What are the most important DHCP options and their purposes?",
      answer: "Key DHCP options include: Option 1 (Subnet Mask), Option 3 (Default Gateway), Option 6 (DNS Servers), Option 15 (Domain Name), Option 42 (NTP Servers), Option 51 (Lease Time), Option 66 (TFTP Server for network booting), and vendor-specific options for device configuration."
    },
    {
      question: "How do you troubleshoot common DHCP problems?",
      answer: "Common DHCP issues and solutions: 1) No IP assignment - check server availability, scope exhaustion, network connectivity. 2) Wrong IP range - verify scope configuration. 3) Lease conflicts - check for rogue DHCP servers, static IP conflicts. 4) Slow assignment - check server performance, network latency. Use tools like ipconfig, DHCP logs, and network analyzers."
    },
    {
      question: "What security considerations exist with DHCP?",
      answer: "DHCP security concerns include: rogue DHCP servers providing malicious configuration, DHCP starvation attacks exhausting IP pools, man-in-the-middle attacks through fake DHCP responses. Mitigations: DHCP snooping, port security, DHCP authentication, monitoring for multiple DHCP servers, and network access control."
    },
    {
      question: "How does DHCP failover and redundancy work?",
      answer: "DHCP redundancy methods include: 1) Split scope - divide IP range between servers. 2) DHCP failover clustering - active/passive or load balancing. 3) Standby servers with replicated configuration. 4) Load balancing with shared databases. Each method provides different levels of availability and complexity."
    },
    {
      question: "What is the difference between DHCP and static IP configuration?",
      answer: "Static IP: manually configured, permanent assignment, no lease management, suitable for servers/infrastructure. DHCP: automatic configuration, temporary leases, centralized management, suitable for client devices. Hybrid approach uses DHCP reservations for devices needing consistent IPs with automatic configuration benefits."
    }
  ]
};