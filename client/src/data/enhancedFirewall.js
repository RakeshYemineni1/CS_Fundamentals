export const enhancedFirewall = {
  id: 'firewall',
  title: 'Firewall',
  subtitle: 'Network Security and Traffic Control',
  summary: 'Network security system that monitors and controls incoming and outgoing traffic based on predetermined security rules, including types, architectures, and implementation strategies.',
  
  analogy: "Think of a firewall like a security checkpoint at an airport. It examines every person (data packet) trying to enter or leave, checks their credentials (packet headers) against security rules, and only allows authorized individuals through while blocking suspicious or unauthorized access.",
  
  visualConcept: "Imagine a firewall as a smart gate between your house (internal network) and the street (internet). It has a list of approved visitors and can recognize family members, while keeping out unwanted solicitors and potential threats.",
  
  realWorldUse: "Corporate network protection, home router security, cloud infrastructure defense, web application security, and protecting IoT devices from cyber threats.",

  explanation: `
A firewall is a network security system that monitors and controls network traffic based on predetermined security rules. It acts as a barrier between trusted internal networks and untrusted external networks.

Types of Firewalls:

1. Packet Filtering Firewall
Examines individual packets and makes decisions based on source/destination IP, ports, and protocols. Fast but limited in functionality.

2. Stateful Inspection Firewall
Tracks connection states and makes decisions based on connection context, not just individual packets. More secure than packet filtering.

3. Application Layer Firewall (Proxy)
Operates at the application layer, understanding specific protocols and can inspect application data. Provides deep packet inspection.

4. Next-Generation Firewall (NGFW)
Combines traditional firewall capabilities with advanced features like intrusion prevention, application awareness, and threat intelligence.

Firewall Architectures:

Network-based Firewalls
Hardware or software appliances protecting entire network segments. Deployed at network perimeters or between network zones.

Host-based Firewalls
Software running on individual devices, protecting that specific host. Examples include Windows Firewall and iptables on Linux.

Cloud Firewalls
Virtual firewalls deployed in cloud environments, providing security for cloud resources and services.

Rule Processing:
Firewalls process rules in order, typically from most specific to most general, with an implicit deny-all rule at the end.
  `,

  keyPoints: [
    "Firewalls control network traffic based on security rules",
    "Stateful firewalls track connection context for better security",
    "Application layer firewalls provide deep packet inspection",
    "Next-generation firewalls combine multiple security functions",
    "Network firewalls protect entire segments or perimeters",
    "Host-based firewalls protect individual devices",
    "Rules are processed in order with implicit deny-all",
    "Firewalls can operate in different network zones",
    "Modern firewalls include intrusion prevention capabilities",
    "Cloud firewalls provide security for virtual environments"
  ],

  codeExamples: [
    {
      title: "Simple Firewall Rule Engine",
      language: "python",
      code: `
import ipaddress
import socket
from enum import Enum
from dataclasses import dataclass
from typing import List, Optional, Union
import re

class Action(Enum):
    ALLOW = "ALLOW"
    DENY = "DENY"
    LOG = "LOG"

class Protocol(Enum):
    TCP = "TCP"
    UDP = "UDP"
    ICMP = "ICMP"
    ANY = "ANY"

@dataclass
class FirewallRule:
    id: int
    action: Action
    protocol: Protocol
    source_ip: str
    source_port: Union[int, str]
    dest_ip: str
    dest_port: Union[int, str]
    description: str = ""
    enabled: bool = True
    
    def matches_packet(self, packet):
        """Check if this rule matches the given packet"""
        if not self.enabled:
            return False
        
        # Check protocol
        if self.protocol != Protocol.ANY and self.protocol.value != packet.protocol:
            return False
        
        # Check source IP
        if not self._ip_matches(packet.source_ip, self.source_ip):
            return False
        
        # Check destination IP
        if not self._ip_matches(packet.dest_ip, self.dest_ip):
            return False
        
        # Check source port
        if not self._port_matches(packet.source_port, self.source_port):
            return False
        
        # Check destination port
        if not self._port_matches(packet.dest_port, self.dest_port):
            return False
        
        return True
    
    def _ip_matches(self, packet_ip, rule_ip):
        """Check if packet IP matches rule IP (supports CIDR and wildcards)"""
        if rule_ip == "any" or rule_ip == "*":
            return True
        
        try:
            # Handle CIDR notation
            if '/' in rule_ip:
                network = ipaddress.ip_network(rule_ip, strict=False)
                return ipaddress.ip_address(packet_ip) in network
            else:
                return packet_ip == rule_ip
        except:
            return False
    
    def _port_matches(self, packet_port, rule_port):
        """Check if packet port matches rule port (supports ranges and wildcards)"""
        if rule_port == "any" or rule_port == "*":
            return True
        
        if isinstance(rule_port, int):
            return packet_port == rule_port
        
        if isinstance(rule_port, str):
            # Handle port ranges (e.g., "80-90")
            if '-' in rule_port:
                start, end = map(int, rule_port.split('-'))
                return start <= packet_port <= end
            
            # Handle specific port
            try:
                return packet_port == int(rule_port)
            except:
                return rule_port == "any"
        
        return False

@dataclass
class NetworkPacket:
    source_ip: str
    dest_ip: str
    source_port: int
    dest_port: int
    protocol: str
    payload_size: int = 0
    timestamp: float = 0

class FirewallEngine:
    def __init__(self):
        self.rules: List[FirewallRule] = []
        self.connection_table = {}  # For stateful inspection
        self.blocked_packets = []
        self.allowed_packets = []
        self.default_action = Action.DENY
        
    def add_rule(self, rule: FirewallRule):
        """Add a firewall rule"""
        self.rules.append(rule)
        self.rules.sort(key=lambda r: r.id)  # Sort by rule ID for processing order
        
    def remove_rule(self, rule_id: int):
        """Remove a firewall rule by ID"""
        self.rules = [r for r in self.rules if r.id != rule_id]
        
    def process_packet(self, packet: NetworkPacket) -> Action:
        """Process a packet through the firewall rules"""
        # Check each rule in order
        for rule in self.rules:
            if rule.matches_packet(packet):
                self._log_packet_action(packet, rule.action, rule.id)
                
                if rule.action == Action.ALLOW:
                    self.allowed_packets.append(packet)
                    self._update_connection_table(packet)
                elif rule.action == Action.DENY:
                    self.blocked_packets.append(packet)
                
                return rule.action
        
        # No rule matched, apply default action
        self._log_packet_action(packet, self.default_action, -1)
        
        if self.default_action == Action.DENY:
            self.blocked_packets.append(packet)
        else:
            self.allowed_packets.append(packet)
            
        return self.default_action
    
    def _update_connection_table(self, packet):
        """Update connection table for stateful inspection"""
        if packet.protocol == "TCP":
            connection_key = f"{packet.source_ip}:{packet.source_port}->{packet.dest_ip}:{packet.dest_port}"
            self.connection_table[connection_key] = {
                'state': 'ESTABLISHED',
                'last_seen': packet.timestamp,
                'packets': self.connection_table.get(connection_key, {}).get('packets', 0) + 1
            }
    
    def _log_packet_action(self, packet, action, rule_id):
        """Log packet processing action"""
        rule_info = f"Rule {rule_id}" if rule_id != -1 else "Default"
        print(f"[{action.value}] {rule_info}: {packet.source_ip}:{packet.source_port} -> "
              f"{packet.dest_ip}:{packet.dest_port} ({packet.protocol})")
    
    def get_statistics(self):
        """Get firewall statistics"""
        total_packets = len(self.allowed_packets) + len(self.blocked_packets)
        
        return {
            'total_packets': total_packets,
            'allowed_packets': len(self.allowed_packets),
            'blocked_packets': len(self.blocked_packets),
            'allow_rate': len(self.allowed_packets) / max(1, total_packets) * 100,
            'block_rate': len(self.blocked_packets) / max(1, total_packets) * 100,
            'active_connections': len(self.connection_table),
            'total_rules': len(self.rules)
        }
    
    def export_rules(self) -> str:
        """Export rules in a readable format"""
        output = []
        output.append("# Firewall Rules Configuration")
        output.append(f"# Default Action: {self.default_action.value}")
        output.append("")
        
        for rule in self.rules:
            status = "ENABLED" if rule.enabled else "DISABLED"
            output.append(f"Rule {rule.id}: {rule.action.value} {rule.protocol.value} "
                         f"{rule.source_ip}:{rule.source_port} -> "
                         f"{rule.dest_ip}:{rule.dest_port} [{status}]")
            if rule.description:
                output.append(f"  Description: {rule.description}")
            output.append("")
        
        return "\\n".join(output)

# Usage example
if __name__ == "__main__":
    # Create firewall engine
    firewall = FirewallEngine()
    
    # Add some rules
    rules = [
        FirewallRule(1, Action.ALLOW, Protocol.TCP, "192.168.1.0/24", "any", "any", "80", "Allow HTTP from LAN"),
        FirewallRule(2, Action.ALLOW, Protocol.TCP, "192.168.1.0/24", "any", "any", "443", "Allow HTTPS from LAN"),
        FirewallRule(3, Action.DENY, Protocol.TCP, "any", "any", "192.168.1.100", "22", "Block SSH to server"),
        FirewallRule(4, Action.ALLOW, Protocol.UDP, "any", "any", "8.8.8.8", "53", "Allow DNS to Google"),
        FirewallRule(5, Action.DENY, Protocol.ANY, "10.0.0.0/8", "any", "any", "any", "Block private networks"),
        FirewallRule(6, Action.ALLOW, Protocol.ICMP, "192.168.1.0/24", "any", "any", "any", "Allow ping from LAN")
    ]
    
    for rule in rules:
        firewall.add_rule(rule)
    
    # Test packets
    test_packets = [
        NetworkPacket("192.168.1.50", "93.184.216.34", 12345, 80, "TCP"),  # HTTP - should allow
        NetworkPacket("192.168.1.50", "93.184.216.34", 12346, 443, "TCP"), # HTTPS - should allow
        NetworkPacket("203.0.113.1", "192.168.1.100", 54321, 22, "TCP"),   # SSH - should deny
        NetworkPacket("192.168.1.50", "8.8.8.8", 53000, 53, "UDP"),        # DNS - should allow
        NetworkPacket("10.0.0.5", "192.168.1.50", 12347, 80, "TCP"),       # Private network - should deny
        NetworkPacket("192.168.1.50", "8.8.8.8", 0, 0, "ICMP"),            # Ping - should allow
        NetworkPacket("203.0.113.1", "192.168.1.50", 12348, 8080, "TCP")   # No rule match - default deny
    ]
    
    print("=== Firewall Processing ===")
    for packet in test_packets:
        action = firewall.process_packet(packet)
    
    print("\\n=== Firewall Statistics ===")
    stats = firewall.get_statistics()
    for key, value in stats.items():
        if 'rate' in key:
            print(f"{key}: {value:.1f}%")
        else:
            print(f"{key}: {value}")
    
    print("\\n=== Firewall Rules ===")
    print(firewall.export_rules())
      `
    },
    {
      title: "Stateful Firewall Implementation",
      language: "java",
      code: `
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public class StatefulFirewall {
    
    public enum Protocol {
        TCP, UDP, ICMP, ANY
    }
    
    public enum Action {
        ALLOW, DENY, LOG
    }
    
    public enum ConnectionState {
        SYN_SENT, SYN_RECEIVED, ESTABLISHED, FIN_WAIT, CLOSE_WAIT, CLOSED
    }
    
    public static class FirewallRule {
        private int id;
        private Action action;
        private Protocol protocol;
        private String sourceIP;
        private String sourcePort;
        private String destIP;
        private String destPort;
        private boolean enabled;
        private String description;
        
        public FirewallRule(int id, Action action, Protocol protocol, 
                           String sourceIP, String sourcePort, 
                           String destIP, String destPort, String description) {
            this.id = id;
            this.action = action;
            this.protocol = protocol;
            this.sourceIP = sourceIP;
            this.sourcePort = sourcePort;
            this.destIP = destIP;
            this.destPort = destPort;
            this.enabled = true;
            this.description = description;
        }
        
        public boolean matches(NetworkPacket packet) {
            if (!enabled) return false;
            
            return matchesProtocol(packet.getProtocol()) &&
                   matchesIP(packet.getSourceIP(), sourceIP) &&
                   matchesIP(packet.getDestIP(), destIP) &&
                   matchesPort(packet.getSourcePort(), sourcePort) &&
                   matchesPort(packet.getDestPort(), destPort);
        }
        
        private boolean matchesProtocol(Protocol packetProtocol) {
            return protocol == Protocol.ANY || protocol == packetProtocol;
        }
        
        private boolean matchesIP(String packetIP, String ruleIP) {
            if ("any".equals(ruleIP) || "*".equals(ruleIP)) return true;
            
            // Simple IP matching (could be extended for CIDR)
            return packetIP.equals(ruleIP);
        }
        
        private boolean matchesPort(int packetPort, String rulePort) {
            if ("any".equals(rulePort) || "*".equals(rulePort)) return true;
            
            try {
                if (rulePort.contains("-")) {
                    String[] range = rulePort.split("-");
                    int start = Integer.parseInt(range[0]);
                    int end = Integer.parseInt(range[1]);
                    return packetPort >= start && packetPort <= end;
                }
                return packetPort == Integer.parseInt(rulePort);
            } catch (NumberFormatException e) {
                return false;
            }
        }
        
        // Getters
        public int getId() { return id; }
        public Action getAction() { return action; }
        public String getDescription() { return description; }
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }
    
    public static class NetworkPacket {
        private String sourceIP;
        private String destIP;
        private int sourcePort;
        private int destPort;
        private Protocol protocol;
        private boolean synFlag;
        private boolean ackFlag;
        private boolean finFlag;
        private boolean rstFlag;
        private LocalDateTime timestamp;
        
        public NetworkPacket(String sourceIP, String destIP, int sourcePort, 
                           int destPort, Protocol protocol) {
            this.sourceIP = sourceIP;
            this.destIP = destIP;
            this.sourcePort = sourcePort;
            this.destPort = destPort;
            this.protocol = protocol;
            this.timestamp = LocalDateTime.now();
        }
        
        public String getConnectionKey() {
            return sourceIP + ":" + sourcePort + "->" + destIP + ":" + destPort;
        }
        
        public String getReverseConnectionKey() {
            return destIP + ":" + destPort + "->" + sourceIP + ":" + sourcePort;
        }
        
        // Getters and setters
        public String getSourceIP() { return sourceIP; }
        public String getDestIP() { return destIP; }
        public int getSourcePort() { return sourcePort; }
        public int getDestPort() { return destPort; }
        public Protocol getProtocol() { return protocol; }
        public boolean isSynFlag() { return synFlag; }
        public void setSynFlag(boolean synFlag) { this.synFlag = synFlag; }
        public boolean isAckFlag() { return ackFlag; }
        public void setAckFlag(boolean ackFlag) { this.ackFlag = ackFlag; }
        public boolean isFinFlag() { return finFlag; }
        public void setFinFlag(boolean finFlag) { this.finFlag = finFlag; }
        public boolean isRstFlag() { return rstFlag; }
        public void setRstFlag(boolean rstFlag) { this.rstFlag = rstFlag; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
    
    public static class Connection {
        private String connectionKey;
        private ConnectionState state;
        private LocalDateTime established;
        private LocalDateTime lastActivity;
        private int packetCount;
        private long bytesTransferred;
        
        public Connection(String connectionKey) {
            this.connectionKey = connectionKey;
            this.state = ConnectionState.SYN_SENT;
            this.established = LocalDateTime.now();
            this.lastActivity = LocalDateTime.now();
            this.packetCount = 0;
            this.bytesTransferred = 0;
        }
        
        public void updateActivity(NetworkPacket packet) {
            this.lastActivity = LocalDateTime.now();
            this.packetCount++;
            // Simplified byte counting
            this.bytesTransferred += 1500; // Assume average packet size
        }
        
        public boolean isExpired(int timeoutMinutes) {
            return ChronoUnit.MINUTES.between(lastActivity, LocalDateTime.now()) > timeoutMinutes;
        }
        
        // Getters and setters
        public ConnectionState getState() { return state; }
        public void setState(ConnectionState state) { this.state = state; }
        public LocalDateTime getLastActivity() { return lastActivity; }
        public int getPacketCount() { return packetCount; }
        public long getBytesTransferred() { return bytesTransferred; }
    }
    
    private List<FirewallRule> rules;
    private Map<String, Connection> connectionTable;
    private Action defaultAction;
    private int connectionTimeout; // minutes
    private List<NetworkPacket> loggedPackets;
    private Map<String, Integer> threatCounter;
    
    public StatefulFirewall() {
        this.rules = new ArrayList<>();
        this.connectionTable = new ConcurrentHashMap<>();
        this.defaultAction = Action.DENY;
        this.connectionTimeout = 30; // 30 minutes default
        this.loggedPackets = new ArrayList<>();
        this.threatCounter = new ConcurrentHashMap<>();
    }
    
    public void addRule(FirewallRule rule) {
        rules.add(rule);
        rules.sort(Comparator.comparingInt(FirewallRule::getId));
    }
    
    public Action processPacket(NetworkPacket packet) {
        // Clean expired connections
        cleanExpiredConnections();
        
        // Check for stateful connection
        Action statefulAction = checkStatefulConnection(packet);
        if (statefulAction != null) {
            logPacketAction(packet, statefulAction, "Stateful");
            return statefulAction;
        }
        
        // Process through rules
        for (FirewallRule rule : rules) {
            if (rule.matches(packet)) {
                Action action = rule.getAction();
                
                if (action == Action.ALLOW) {
                    createOrUpdateConnection(packet);
                }
                
                logPacketAction(packet, action, "Rule " + rule.getId());
                return action;
            }
        }
        
        // No rule matched, apply default action
        if (defaultAction == Action.DENY) {
            incrementThreatCounter(packet.getSourceIP());
        }
        
        logPacketAction(packet, defaultAction, "Default");
        return defaultAction;
    }
    
    private Action checkStatefulConnection(NetworkPacket packet) {
        String connectionKey = packet.getConnectionKey();
        String reverseKey = packet.getReverseConnectionKey();
        
        Connection connection = connectionTable.get(connectionKey);
        Connection reverseConnection = connectionTable.get(reverseKey);
        
        if (connection != null) {
            connection.updateActivity(packet);
            updateConnectionState(connection, packet);
            return Action.ALLOW;
        }
        
        if (reverseConnection != null && 
            reverseConnection.getState() == ConnectionState.ESTABLISHED) {
            reverseConnection.updateActivity(packet);
            return Action.ALLOW;
        }
        
        return null; // No existing connection
    }
    
    private void createOrUpdateConnection(NetworkPacket packet) {
        if (packet.getProtocol() == Protocol.TCP) {
            String connectionKey = packet.getConnectionKey();
            Connection connection = connectionTable.get(connectionKey);
            
            if (connection == null) {
                connection = new Connection(connectionKey);
                connectionTable.put(connectionKey, connection);
            }
            
            connection.updateActivity(packet);
            updateConnectionState(connection, packet);
        }
    }
    
    private void updateConnectionState(Connection connection, NetworkPacket packet) {
        if (packet.getProtocol() != Protocol.TCP) return;
        
        ConnectionState currentState = connection.getState();
        
        if (packet.isSynFlag() && !packet.isAckFlag()) {
            connection.setState(ConnectionState.SYN_SENT);
        } else if (packet.isSynFlag() && packet.isAckFlag()) {
            connection.setState(ConnectionState.SYN_RECEIVED);
        } else if (packet.isAckFlag() && currentState == ConnectionState.SYN_RECEIVED) {
            connection.setState(ConnectionState.ESTABLISHED);
        } else if (packet.isFinFlag()) {
            connection.setState(ConnectionState.FIN_WAIT);
        } else if (packet.isRstFlag()) {
            connection.setState(ConnectionState.CLOSED);
        }
    }
    
    private void cleanExpiredConnections() {
        Iterator<Map.Entry<String, Connection>> iterator = 
            connectionTable.entrySet().iterator();
        
        while (iterator.hasNext()) {
            Map.Entry<String, Connection> entry = iterator.next();
            if (entry.getValue().isExpired(connectionTimeout)) {
                iterator.remove();
            }
        }
    }
    
    private void incrementThreatCounter(String sourceIP) {
        threatCounter.merge(sourceIP, 1, Integer::sum);
    }
    
    private void logPacketAction(NetworkPacket packet, Action action, String reason) {
        if (action == Action.LOG || action == Action.DENY) {
            loggedPackets.add(packet);
        }
        
        System.out.printf("[%s] %s: %s:%d -> %s:%d (%s) - %s%n",
            action, reason,
            packet.getSourceIP(), packet.getSourcePort(),
            packet.getDestIP(), packet.getDestPort(),
            packet.getProtocol(), packet.getTimestamp());
    }
    
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("activeConnections", connectionTable.size());
        stats.put("totalRules", rules.size());
        stats.put("loggedPackets", loggedPackets.size());
        
        // Connection state distribution
        Map<ConnectionState, Long> stateDistribution = connectionTable.values().stream()
            .collect(java.util.stream.Collectors.groupingBy(
                Connection::getState,
                java.util.stream.Collectors.counting()
            ));
        stats.put("connectionStates", stateDistribution);
        
        // Top threat sources
        List<Map.Entry<String, Integer>> topThreats = threatCounter.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(5)
            .collect(java.util.stream.Collectors.toList());
        stats.put("topThreatSources", topThreats);
        
        return stats;
    }
    
    public static void main(String[] args) {
        StatefulFirewall firewall = new StatefulFirewall();
        
        // Add rules
        firewall.addRule(new FirewallRule(1, Action.ALLOW, Protocol.TCP, 
            "192.168.1.0", "any", "any", "80", "Allow HTTP"));
        firewall.addRule(new FirewallRule(2, Action.ALLOW, Protocol.TCP, 
            "192.168.1.0", "any", "any", "443", "Allow HTTPS"));
        firewall.addRule(new FirewallRule(3, Action.DENY, Protocol.TCP, 
            "any", "any", "192.168.1.100", "22", "Block SSH"));
        
        // Simulate TCP connection
        System.out.println("=== Simulating TCP Connection ===");
        
        // SYN
        NetworkPacket syn = new NetworkPacket("192.168.1.50", "93.184.216.34", 12345, 80, Protocol.TCP);
        syn.setSynFlag(true);
        firewall.processPacket(syn);
        
        // SYN-ACK (reverse direction)
        NetworkPacket synAck = new NetworkPacket("93.184.216.34", "192.168.1.50", 80, 12345, Protocol.TCP);
        synAck.setSynFlag(true);
        synAck.setAckFlag(true);
        firewall.processPacket(synAck);
        
        // ACK
        NetworkPacket ack = new NetworkPacket("192.168.1.50", "93.184.216.34", 12345, 80, Protocol.TCP);
        ack.setAckFlag(true);
        firewall.processPacket(ack);
        
        // Data packets (should be allowed due to established connection)
        for (int i = 0; i < 5; i++) {
            NetworkPacket data = new NetworkPacket("192.168.1.50", "93.184.216.34", 12345, 80, Protocol.TCP);
            data.setAckFlag(true);
            firewall.processPacket(data);
        }
        
        System.out.println("\\n=== Statistics ===");
        Map<String, Object> stats = firewall.getStatistics();
        stats.forEach((key, value) -> System.out.println(key + ": " + value));
    }
}
      `
    },
    {
      title: "Web Application Firewall (WAF)",
      language: "javascript",
      code: `
class WebApplicationFirewall {
    constructor() {
        this.rules = new Map();
        this.ipWhitelist = new Set();
        this.ipBlacklist = new Set();
        this.rateLimits = new Map();
        this.requestLog = [];
        this.threats = new Map();
        
        this.initializeDefaultRules();
    }
    
    initializeDefaultRules() {
        // SQL Injection patterns
        this.addRule('sql_injection', {
            pattern: /(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript)/i,
            severity: 'HIGH',
            action: 'BLOCK',
            description: 'SQL Injection attempt detected'
        });
        
        // XSS patterns
        this.addRule('xss', {
            pattern: /(<script|javascript:|vbscript:|onload=|onerror=|onclick=)/i,
            severity: 'HIGH',
            action: 'BLOCK',
            description: 'Cross-Site Scripting attempt detected'
        });
        
        // Path traversal
        this.addRule('path_traversal', {
            pattern: /(\\.\\.|\\/\\.\\.|\\.\\.\\/|%2e%2e%2f|%2e%2e\\|%c0%ae%c0%ae)/i,
            severity: 'MEDIUM',
            action: 'BLOCK',
            description: 'Path traversal attempt detected'
        });
        
        // Command injection
        this.addRule('command_injection', {
            check: (req) => (req.url + req.queryString + req.body).includes(';') || (req.url + req.queryString + req.body).includes('&') || (req.url + req.queryString + req.body).includes('|') || (req.url + req.queryString + req.body).includes('"'),
            severity: 'HIGH',
            action: 'BLOCK',
            description: 'Command injection attempt detected'
        });
        
        // Large request body
        this.addRule('large_body', {
            check: (req) => req.bodySize > 1048576, // 1MB
            severity: 'MEDIUM',
            action: 'BLOCK',
            description: 'Request body too large'
        });
    }
    
    addRule(name, rule) {
        this.rules.set(name, {
            ...rule,
            enabled: true,
            hitCount: 0,
            lastTriggered: null
        });
    }
    
    removeRule(name) {
        return this.rules.delete(name);
    }
    
    addToWhitelist(ip) {
        this.ipWhitelist.add(ip);
        this.ipBlacklist.delete(ip); // Remove from blacklist if present
    }
    
    addToBlacklist(ip) {
        this.ipBlacklist.add(ip);
        this.ipWhitelist.delete(ip); // Remove from whitelist if present
    }
    
    setRateLimit(identifier, maxRequests, windowMs) {
        this.rateLimits.set(identifier, {
            maxRequests,
            windowMs,
            requests: [],
            blocked: 0
        });
    }
    
    processRequest(request) {
        const startTime = Date.now();
        const result = {
            allowed: false,
            action: 'ALLOW',
            triggeredRules: [],
            clientIP: request.clientIP,
            timestamp: new Date().toISOString(),
            processingTime: 0
        };
        
        try {
            // Check IP whitelist first
            if (this.ipWhitelist.has(request.clientIP)) {
                result.allowed = true;
                result.action = 'ALLOW';
                result.reason = 'IP whitelisted';
                return result;
            }
            
            // Check IP blacklist
            if (this.ipBlacklist.has(request.clientIP)) {
                result.action = 'BLOCK';
                result.reason = 'IP blacklisted';
                this.logThreat(request.clientIP, 'IP_BLACKLISTED');
                return result;
            }
            
            // Check rate limiting
            const rateLimitResult = this.checkRateLimit(request);
            if (!rateLimitResult.allowed) {
                result.action = 'BLOCK';
                result.reason = 'Rate limit exceeded';
                this.logThreat(request.clientIP, 'RATE_LIMIT_EXCEEDED');
                return result;
            }
            
            // Process WAF rules
            for (const [ruleName, rule] of this.rules.entries()) {
                if (!rule.enabled) continue;
                
                const ruleResult = this.evaluateRule(rule, request);
                if (ruleResult.triggered) {
                    rule.hitCount++;
                    rule.lastTriggered = new Date();
                    
                    result.triggeredRules.push({
                        name: ruleName,
                        severity: rule.severity,
                        description: rule.description,
                        matchedContent: ruleResult.matchedContent
                    });
                    
                    if (rule.action === 'BLOCK') {
                        result.action = 'BLOCK';
                        result.reason = rule.description;
                        this.logThreat(request.clientIP, ruleName.toUpperCase());
                        return result;
                    }
                }
            }
            
            // If we get here, request is allowed
            result.allowed = true;
            result.action = 'ALLOW';
            
        } finally {
            result.processingTime = Date.now() - startTime;
            this.logRequest(request, result);
        }
        
        return result;
    }
    
    evaluateRule(rule, request) {
        const result = { triggered: false, matchedContent: null };
        
        // Custom check function
        if (rule.check && typeof rule.check === 'function') {
            result.triggered = rule.check(request);
            return result;
        }
        
        // Pattern-based rules
        if (rule.pattern) {
            const searchText = [
                request.url,
                request.queryString,
                request.body,
                JSON.stringify(request.headers)
            ].join(' ');
            
            const match = searchText.match(rule.pattern);
            if (match) {
                result.triggered = true;
                result.matchedContent = match[0];
            }
        }
        
        return result;
    }
    
    checkRateLimit(request) {
        const identifier = request.clientIP;
        const rateLimit = this.rateLimits.get(identifier);
        
        if (!rateLimit) {
            return { allowed: true };
        }
        
        const now = Date.now();
        const windowStart = now - rateLimit.windowMs;
        
        // Clean old requests
        rateLimit.requests = rateLimit.requests.filter(time => time > windowStart);
        
        // Check if limit exceeded
        if (rateLimit.requests.length >= rateLimit.maxRequests) {
            rateLimit.blocked++;
            return { 
                allowed: false, 
                reason: \`Rate limit exceeded: \${rateLimit.requests.length}/\${rateLimit.maxRequests} requests in \${rateLimit.windowMs}ms\`
            };
        }
        
        // Add current request
        rateLimit.requests.push(now);
        return { allowed: true };
    }
    
    logThreat(clientIP, threatType) {
        const threat = this.threats.get(clientIP) || {
            ip: clientIP,
            threats: new Map(),
            firstSeen: new Date(),
            lastSeen: new Date(),
            totalAttempts: 0
        };
        
        threat.lastSeen = new Date();
        threat.totalAttempts++;
        
        const threatCount = threat.threats.get(threatType) || 0;
        threat.threats.set(threatType, threatCount + 1);
        
        this.threats.set(clientIP, threat);
        
        // Auto-blacklist after threshold
        if (threat.totalAttempts >= 10) {
            this.addToBlacklist(clientIP);
        }
    }
    
    logRequest(request, result) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            clientIP: request.clientIP,
            method: request.method,
            url: request.url,
            userAgent: request.headers['user-agent'] || 'Unknown',
            action: result.action,
            reason: result.reason || 'Normal request',
            triggeredRules: result.triggeredRules.map(r => r.name),
            processingTime: result.processingTime
        };
        
        this.requestLog.push(logEntry);
        
        // Keep only last 1000 entries
        if (this.requestLog.length > 1000) {
            this.requestLog = this.requestLog.slice(-1000);
        }
    }
    
    getStatistics() {
        const totalRequests = this.requestLog.length;
        const blockedRequests = this.requestLog.filter(r => r.action === 'BLOCK').length;
        const allowedRequests = totalRequests - blockedRequests;
        
        // Rule statistics
        const ruleStats = Array.from(this.rules.entries()).map(([name, rule]) => ({
            name,
            hitCount: rule.hitCount,
            severity: rule.severity,
            enabled: rule.enabled,
            lastTriggered: rule.lastTriggered
        }));
        
        // Top threat IPs
        const topThreats = Array.from(this.threats.entries())
            .sort(([,a], [,b]) => b.totalAttempts - a.totalAttempts)
            .slice(0, 10)
            .map(([ip, data]) => ({
                ip,
                attempts: data.totalAttempts,
                threatTypes: Array.from(data.threats.keys()),
                firstSeen: data.firstSeen,
                lastSeen: data.lastSeen
            }));
        
        return {
            totalRequests,
            allowedRequests,
            blockedRequests,
            blockRate: ((blockedRequests / Math.max(totalRequests, 1)) * 100).toFixed(2) + '%',
            activeRules: Array.from(this.rules.values()).filter(r => r.enabled).length,
            whitelistedIPs: this.ipWhitelist.size,
            blacklistedIPs: this.ipBlacklist.size,
            ruleStatistics: ruleStats,
            topThreats
        };
    }
    
    exportConfiguration() {
        return {
            rules: Object.fromEntries(this.rules),
            whitelist: Array.from(this.ipWhitelist),
            blacklist: Array.from(this.ipBlacklist),
            rateLimits: Object.fromEntries(this.rateLimits)
        };
    }
    
    importConfiguration(config) {
        if (config.rules) {
            this.rules = new Map(Object.entries(config.rules));
        }
        if (config.whitelist) {
            this.ipWhitelist = new Set(config.whitelist);
        }
        if (config.blacklist) {
            this.ipBlacklist = new Set(config.blacklist);
        }
        if (config.rateLimits) {
            this.rateLimits = new Map(Object.entries(config.rateLimits));
        }
    }
}

// Usage example
const waf = new WebApplicationFirewall();

// Configure rate limiting
waf.setRateLimit('default', 100, 60000); // 100 requests per minute

// Add some IPs to whitelist
waf.addToWhitelist('192.168.1.100');
waf.addToWhitelist('10.0.0.50');

// Simulate requests
const testRequests = [
    {
        clientIP: '203.0.113.1',
        method: 'GET',
        url: '/login',
        queryString: '',
        headers: { 'user-agent': 'Mozilla/5.0' },
        body: '',
        bodySize: 0
    },
    {
        clientIP: '203.0.113.2',
        method: 'POST',
        url: '/search',
        queryString: 'q=test',
        headers: { 'user-agent': 'AttackBot/1.0' },
        body: "query=' OR 1=1--",
        bodySize: 15
    },
    {
        clientIP: '203.0.113.3',
        method: 'GET',
        url: '/page',
        queryString: 'file=../../../etc/passwd',
        headers: { 'user-agent': 'Mozilla/5.0' },
        body: '',
        bodySize: 0
    },
    {
        clientIP: '192.168.1.100', // Whitelisted
        method: 'POST',
        url: '/admin',
        queryString: '',
        headers: { 'user-agent': 'AdminTool/1.0' },
        body: 'action=delete&table=users',
        bodySize: 25
    }
];

console.log('=== WAF Processing Results ===');
testRequests.forEach((request, index) => {
    const result = waf.processRequest(request);
    console.log(\`Request \${index + 1}: \${result.action} - \${result.reason || 'Clean request'}\`);
    if (result.triggeredRules.length > 0) {
        console.log(\`  Triggered rules: \${result.triggeredRules.map(r => r.name).join(', ')}\`);
    }
});

// Simulate rate limiting
console.log('\\n=== Rate Limiting Test ===');
for (let i = 0; i < 105; i++) {
    const result = waf.processRequest({
        clientIP: '203.0.113.4',
        method: 'GET',
        url: '/api/data',
        queryString: '',
        headers: {},
        body: '',
        bodySize: 0
    });
    
    if (result.action === 'BLOCK') {
        console.log(\`Request \${i + 1}: BLOCKED - Rate limit exceeded\`);
        break;
    }
}

console.log('\\n=== WAF Statistics ===');
const stats = waf.getStatistics();
console.log(\`Total requests: \${stats.totalRequests}\`);
console.log(\`Blocked requests: \${stats.blockedRequests}\`);
console.log(\`Block rate: \${stats.blockRate}\`);
console.log(\`Active rules: \${stats.activeRules}\`);

if (stats.topThreats.length > 0) {
    console.log('\\nTop threat sources:');
    stats.topThreats.forEach(threat => {
        console.log(\`  \${threat.ip}: \${threat.attempts} attempts (\${threat.threatTypes.join(', ')})\`);
    });
}
      `
    }
  ],

  resources: [
    {
      title: "Firewall Fundamentals - GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/introduction-of-firewall-in-computer-network/",
      description: "Comprehensive introduction to firewall concepts and types"
    },
    {
      title: "Firewall Configuration - YouTube",
      url: "https://www.youtube.com/watch?v=kDEX1HXybrU",
      description: "Practical guide to configuring and managing firewalls"
    },
    {
      title: "iptables Tutorial - Linux Firewall",
      url: "https://www.netfilter.org/documentation/HOWTO/packet-filtering-HOWTO.html",
      description: "Complete guide to Linux iptables firewall configuration"
    },
    {
      title: "Next-Generation Firewalls - Palo Alto",
      url: "https://www.paloaltonetworks.com/cyberpedia/what-is-a-next-generation-firewall",
      description: "Understanding modern NGFW capabilities and features"
    },
    {
      title: "Web Application Firewall (WAF) Guide",
      url: "https://owasp.org/www-community/Web_Application_Firewall",
      description: "OWASP guide to web application firewall implementation"
    }
  ],

  questions: [
    {
      question: "What is a firewall and what are its main functions?",
      answer: "A firewall is a network security system that monitors and controls network traffic based on predetermined security rules. Main functions include: packet filtering, access control, network segmentation, logging and monitoring, intrusion prevention, and creating security boundaries between trusted and untrusted networks."
    },
    {
      question: "What are the different types of firewalls and their characteristics?",
      answer: "Types include: 1) Packet filtering - examines individual packets, fast but limited. 2) Stateful inspection - tracks connection states, more secure. 3) Application layer/Proxy - deep packet inspection, highest security. 4) Next-generation (NGFW) - combines multiple security functions. 5) Network-based vs host-based deployment options."
    },
    {
      question: "How does stateful inspection work in firewalls?",
      answer: "Stateful inspection tracks the state of network connections by maintaining a connection table. It monitors TCP handshakes, tracks sequence numbers, validates connection states, and allows return traffic for established connections. This provides better security than simple packet filtering by understanding connection context."
    },
    {
      question: "What is the difference between network-based and host-based firewalls?",
      answer: "Network-based firewalls protect entire network segments, deployed at network perimeters or between zones, handle high traffic volumes, and provide centralized management. Host-based firewalls protect individual devices, run as software on each host, provide granular application control, and offer protection for mobile devices."
    },
    {
      question: "How do firewall rules work and what is rule processing order?",
      answer: "Firewall rules define traffic filtering criteria including source/destination IPs, ports, protocols, and actions (allow/deny). Rules are processed sequentially from top to bottom, with first match determining action. Most specific rules should be placed first, followed by more general rules, with an implicit deny-all rule at the end."
    },
    {
      question: "What are the key considerations for firewall rule design?",
      answer: "Key considerations include: principle of least privilege (deny by default), specific rules before general ones, regular rule review and cleanup, documentation of rule purposes, performance impact of complex rules, logging requirements, and testing rule changes in non-production environments first."
    },
    {
      question: "How do Next-Generation Firewalls (NGFW) differ from traditional firewalls?",
      answer: "NGFWs combine traditional firewall capabilities with: application awareness and control, intrusion prevention systems (IPS), threat intelligence integration, user identity awareness, SSL/TLS inspection, advanced malware protection, and centralized management. They provide deeper inspection and more sophisticated threat detection."
    },
    {
      question: "What is a Web Application Firewall (WAF) and how does it work?",
      answer: "A WAF protects web applications by filtering HTTP/HTTPS traffic between applications and the internet. It detects and blocks attacks like SQL injection, XSS, CSRF, and DDoS. WAFs use signature-based detection, behavioral analysis, rate limiting, and can operate in different modes (monitor, block, or challenge)."
    },
    {
      question: "How do you troubleshoot firewall connectivity issues?",
      answer: "Troubleshooting steps include: checking firewall logs for blocked connections, verifying rule order and syntax, testing with firewall temporarily disabled, using network tools (ping, telnet, traceroute), checking for NAT issues, verifying application-specific requirements, and monitoring connection states in stateful firewalls."
    },
    {
      question: "What are common firewall deployment architectures?",
      answer: "Common architectures include: 1) Perimeter firewall - single firewall at network edge. 2) DMZ (screened subnet) - firewall protecting internal network with public services in DMZ. 3) Multi-tier - multiple firewalls creating security zones. 4) Distributed - firewalls throughout network infrastructure. 5) Cloud-native - virtual firewalls in cloud environments."
    }
  ]
};