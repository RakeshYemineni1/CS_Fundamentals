export const enhancedMACAddress = {
  id: 'mac-address',
  title: 'MAC Address',
  subtitle: 'Media Access Control Address and Layer 2 Identification',
  summary: 'MAC addresses provide unique hardware identification for network interfaces at the Data Link Layer, enabling local network communication.',
  analogy: 'Like a car license plate - uniquely identifies each vehicle (network interface) for local traffic management and identification.',
  visualConcept: 'Picture MAC addresses as name tags at a conference - everyone has a unique identifier for direct person-to-person communication.',
  realWorldUse: 'Ethernet switching, WiFi authentication, Wake-on-LAN, network security, device tracking, DHCP reservations, network forensics.',
  explanation: `MAC Address Fundamentals:

MAC Address Structure:
A MAC (Media Access Control) address is a 48-bit (6-byte) unique identifier assigned to network interface controllers (NICs). It operates at Layer 2 (Data Link Layer) of the OSI model.

Format and Representation:
- 48 bits = 6 bytes = 12 hexadecimal digits
- Common formats: 00:1A:2B:3C:4D:5E, 00-1A-2B-3C-4D-5E, 001A.2B3C.4D5E
- First 3 bytes: Organizationally Unique Identifier (OUI)
- Last 3 bytes: Network Interface Controller (NIC) specific

OUI (Organizationally Unique Identifier):
- First 24 bits assigned by IEEE Registration Authority
- Identifies manufacturer/vendor
- Examples: 00:50:56 (VMware), 08:00:27 (VirtualBox), 00:0C:29 (VMware)

Address Types:
1. Unicast: Individual device address (LSB of first byte = 0)
2. Multicast: Group address (LSB of first byte = 1)
3. Broadcast: All devices (FF:FF:FF:FF:FF:FF)

Local vs Universal Administration:
- Universal (U): Globally unique, assigned by manufacturer
- Local (L): Locally administered, can be changed by software
- Second LSB of first byte indicates U/L (0=Universal, 1=Local)

MAC Address Functions:
1. Frame addressing at Layer 2
2. Switch learning and forwarding decisions
3. Network access control and security
4. Device identification and tracking
5. Wake-on-LAN functionality

Address Resolution:
- ARP (Address Resolution Protocol) maps IP to MAC addresses
- Neighbor Discovery Protocol for IPv6
- Switch MAC address tables for forwarding decisions

Security Implications:
- MAC address filtering for access control
- Privacy concerns with device tracking
- MAC address randomization in modern devices
- Spoofing and security bypass techniques

Modern Considerations:
- Virtual MAC addresses in virtualization
- MAC address randomization for privacy
- Software-defined networking implications
- Cloud and container networking challenges`,

  keyPoints: [
    'MAC addresses are 48-bit unique identifiers for network interfaces',
    'First 24 bits (OUI) identify manufacturer, last 24 bits identify device',
    'Operates at Layer 2 (Data Link Layer) for local network communication',
    'Three types: unicast, multicast, and broadcast addresses',
    'Used by switches for frame forwarding decisions',
    'ARP protocol maps IP addresses to MAC addresses',
    'Can be universally or locally administered',
    'Essential for Ethernet and WiFi communication',
    'Security applications include access control and device tracking',
    'Modern privacy features include MAC address randomization'
  ],

  codeExamples: [
    {
      title: "MAC Address Processing and Analysis",
      language: "python",
      code: `import re
import random
import struct
import socket
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

class MACAddressType(Enum):
    UNICAST = "Unicast"
    MULTICAST = "Multicast"
    BROADCAST = "Broadcast"

class AddressScope(Enum):
    UNIVERSAL = "Universal"
    LOCAL = "Local"

@dataclass
class OUIInfo:
    oui: str
    organization: str
    address: str

class MACAddress:
    def __init__(self, mac_string: str):
        self.raw_address = self.normalize_mac(mac_string)
        self.validate_mac()
    
    def normalize_mac(self, mac_string: str) -> str:
        \"\"\"Normalize MAC address to standard format\"\"\"
        # Remove all separators and convert to uppercase
        mac_clean = re.sub(r'[^0-9A-Fa-f]', '', mac_string.upper())
        
        if len(mac_clean) != 12:
            raise ValueError(f"Invalid MAC address length: {mac_string}")
        
        return mac_clean
    
    def validate_mac(self):
        \"\"\"Validate MAC address format\"\"\"
        if not re.match(r'^[0-9A-F]{12}$', self.raw_address):
            raise ValueError(f"Invalid MAC address format: {self.raw_address}")
    
    @property
    def formatted(self) -> str:
        \"\"\"Return MAC address in colon-separated format\"\"\"
        return ':'.join(self.raw_address[i:i+2] for i in range(0, 12, 2))
    
    @property
    def dash_format(self) -> str:
        \"\"\"Return MAC address in dash-separated format\"\"\"
        return '-'.join(self.raw_address[i:i+2] for i in range(0, 12, 2))
    
    @property
    def dot_format(self) -> str:
        \"\"\"Return MAC address in Cisco dot format\"\"\"
        return '.'.join(self.raw_address[i:i+4] for i in range(0, 12, 4))
    
    @property
    def oui(self) -> str:
        \"\"\"Get Organizationally Unique Identifier\"\"\"
        return self.raw_address[:6]
    
    @property
    def nic_specific(self) -> str:
        \"\"\"Get NIC-specific portion\"\"\"
        return self.raw_address[6:]
    
    @property
    def address_type(self) -> MACAddressType:
        \"\"\"Determine address type (unicast/multicast/broadcast)\"\"\"
        if self.raw_address == 'FFFFFFFFFFFF':
            return MACAddressType.BROADCAST
        
        # Check LSB of first byte
        first_byte = int(self.raw_address[0:2], 16)
        if first_byte & 0x01:
            return MACAddressType.MULTICAST
        else:
            return MACAddressType.UNICAST
    
    @property
    def address_scope(self) -> AddressScope:
        \"\"\"Determine if address is universally or locally administered\"\"\"
        # Check second LSB of first byte
        first_byte = int(self.raw_address[0:2], 16)
        if first_byte & 0x02:
            return AddressScope.LOCAL
        else:
            return AddressScope.UNIVERSAL
    
    def to_bytes(self) -> bytes:
        \"\"\"Convert MAC address to bytes\"\"\"
        return bytes.fromhex(self.raw_address)
    
    @classmethod
    def from_bytes(cls, mac_bytes: bytes) -> 'MACAddress':
        \"\"\"Create MAC address from bytes\"\"\"
        if len(mac_bytes) != 6:
            raise ValueError("MAC address must be 6 bytes")
        
        mac_string = mac_bytes.hex().upper()
        return cls(mac_string)
    
    @classmethod
    def generate_random(cls, local_admin: bool = True) -> 'MACAddress':
        \"\"\"Generate random MAC address\"\"\"
        # Generate 6 random bytes
        mac_bytes = bytearray(random.getrandbits(8) for _ in range(6))
        
        if local_admin:
            # Set locally administered bit (bit 1 of first byte)
            mac_bytes[0] |= 0x02
        
        # Ensure unicast (clear bit 0 of first byte)
        mac_bytes[0] &= 0xFE
        
        return cls.from_bytes(bytes(mac_bytes))
    
    def __str__(self) -> str:
        return self.formatted
    
    def __eq__(self, other) -> bool:
        if isinstance(other, MACAddress):
            return self.raw_address == other.raw_address
        return False
    
    def __hash__(self) -> int:
        return hash(self.raw_address)

class OUIDatabase:
    def __init__(self):
        # Sample OUI database (in practice, load from IEEE database)
        self.oui_db = {
            '000C29': OUIInfo('00:0C:29', 'VMware, Inc.', 'Palo Alto, CA'),
            '005056': OUIInfo('00:50:56', 'VMware, Inc.', 'Palo Alto, CA'),
            '080027': OUIInfo('08:00:27', 'Oracle VirtualBox', 'Redwood City, CA'),
            '001B21': OUIInfo('00:1B:21', 'Intel Corporation', 'Santa Clara, CA'),
            '00E04C': OUIInfo('00:E0:4C', 'Realtek Semiconductor', 'Hsinchu, Taiwan'),
            '001A2B': OUIInfo('00:1A:2B', 'Cisco Systems', 'San Jose, CA'),
            '00D0C9': OUIInfo('00:D0:C9', 'Intel Corporation', 'Santa Clara, CA'),
            '0050DA': OUIInfo('00:50:DA', 'Realtek Semiconductor', 'Hsinchu, Taiwan'),
            '001E58': OUIInfo('00:1E:58', 'WistronNeweb Corporation', 'Taipei, Taiwan'),
            '00A0C9': OUIInfo('00:A0:C9', 'Intel Corporation', 'Santa Clara, CA')
        }
    
    def lookup_oui(self, mac_address: MACAddress) -> Optional[OUIInfo]:
        \"\"\"Look up OUI information for MAC address\"\"\"
        oui = mac_address.oui
        return self.oui_db.get(oui)
    
    def add_oui(self, oui: str, organization: str, address: str):
        \"\"\"Add OUI to database\"\"\"
        oui_clean = oui.replace(':', '').replace('-', '').upper()
        self.oui_db[oui_clean] = OUIInfo(oui, organization, address)

class MACAddressTable:
    \"\"\"Simulate switch MAC address table\"\"\"
    
    def __init__(self):
        self.table: Dict[MACAddress, Dict] = {}
        self.aging_time = 300  # 5 minutes default
    
    def learn_mac(self, mac_address: MACAddress, port: int, vlan: int = 1):
        \"\"\"Learn MAC address on specific port\"\"\"
        import time
        
        self.table[mac_address] = {
            'port': port,
            'vlan': vlan,
            'timestamp': time.time(),
            'type': 'dynamic'
        }
        
        print(f"Learned MAC {mac_address} on port {port} (VLAN {vlan})")
    
    def lookup_mac(self, mac_address: MACAddress) -> Optional[Dict]:
        \"\"\"Look up MAC address in table\"\"\"
        return self.table.get(mac_address)
    
    def age_out_entries(self):
        \"\"\"Remove aged out MAC entries\"\"\"
        import time
        current_time = time.time()
        aged_out = []
        
        for mac_addr, entry in self.table.items():
            if (entry['type'] == 'dynamic' and 
                current_time - entry['timestamp'] > self.aging_time):
                aged_out.append(mac_addr)
        
        for mac_addr in aged_out:
            del self.table[mac_addr]
            print(f"Aged out MAC {mac_addr}")
        
        return len(aged_out)
    
    def add_static_entry(self, mac_address: MACAddress, port: int, vlan: int = 1):
        \"\"\"Add static MAC entry\"\"\"
        import time
        
        self.table[mac_address] = {
            'port': port,
            'vlan': vlan,
            'timestamp': time.time(),
            'type': 'static'
        }
        
        print(f"Added static MAC {mac_address} on port {port}")
    
    def print_table(self):
        \"\"\"Print MAC address table\"\"\"
        print("\\nMAC Address Table:")
        print("MAC Address       | Port | VLAN | Type    | Age")
        print("-" * 50)
        
        import time
        current_time = time.time()
        
        for mac_addr, entry in sorted(self.table.items(), key=lambda x: x[1]['port']):
            age = int(current_time - entry['timestamp'])
            print(f"{str(mac_addr):17} | {entry['port']:4} | {entry['vlan']:4} | "
                  f"{entry['type']:7} | {age}s")

class ARPTable:
    \"\"\"Simulate ARP table for IP-to-MAC mapping\"\"\"
    
    def __init__(self):
        self.table: Dict[str, Tuple[MACAddress, float]] = {}
        self.timeout = 1200  # 20 minutes
    
    def add_entry(self, ip_address: str, mac_address: MACAddress):
        \"\"\"Add ARP entry\"\"\"
        import time
        self.table[ip_address] = (mac_address, time.time())
        print(f"ARP: {ip_address} -> {mac_address}")
    
    def lookup_mac(self, ip_address: str) -> Optional[MACAddress]:
        \"\"\"Look up MAC address for IP\"\"\"
        entry = self.table.get(ip_address)
        if entry:
            mac_addr, timestamp = entry
            import time
            if time.time() - timestamp < self.timeout:
                return mac_addr
            else:
                # Entry expired
                del self.table[ip_address]
        return None
    
    def print_table(self):
        \"\"\"Print ARP table\"\"\"
        print("\\nARP Table:")
        print("IP Address      | MAC Address       | Age")
        print("-" * 45)
        
        import time
        current_time = time.time()
        
        for ip, (mac, timestamp) in sorted(self.table.items()):
            age = int(current_time - timestamp)
            print(f"{ip:15} | {str(mac):17} | {age}s")

class MACAddressAnalyzer:
    def __init__(self):
        self.oui_db = OUIDatabase()
        self.mac_table = MACAddressTable()
        self.arp_table = ARPTable()
    
    def analyze_mac(self, mac_string: str) -> Dict:
        \"\"\"Comprehensive MAC address analysis\"\"\"
        try:
            mac = MACAddress(mac_string)
            
            analysis = {
                'original': mac_string,
                'normalized': str(mac),
                'formats': {
                    'colon': mac.formatted,
                    'dash': mac.dash_format,
                    'dot': mac.dot_format,
                    'raw': mac.raw_address
                },
                'components': {
                    'oui': mac.oui,
                    'nic_specific': mac.nic_specific
                },
                'properties': {
                    'type': mac.address_type.value,
                    'scope': mac.address_scope.value,
                    'is_broadcast': mac.address_type == MACAddressType.BROADCAST,
                    'is_multicast': mac.address_type == MACAddressType.MULTICAST,
                    'is_unicast': mac.address_type == MACAddressType.UNICAST,
                    'is_local_admin': mac.address_scope == AddressScope.LOCAL
                }
            }
            
            # OUI lookup
            oui_info = self.oui_db.lookup_oui(mac)
            if oui_info:
                analysis['vendor'] = {
                    'organization': oui_info.organization,
                    'address': oui_info.address
                }
            else:
                analysis['vendor'] = {'organization': 'Unknown', 'address': 'Unknown'}
            
            return analysis
            
        except Exception as e:
            return {'error': str(e)}
    
    def demonstrate_mac_operations(self):
        \"\"\"Demonstrate MAC address operations\"\"\"
        print("=== MAC Address Demonstration ===\\n")
        
        # Analyze various MAC addresses
        test_macs = [
            '00:0C:29:12:34:56',  # VMware
            '08:00:27:AB:CD:EF',  # VirtualBox
            'FF:FF:FF:FF:FF:FF',  # Broadcast
            '01:00:5E:00:00:01',  # Multicast
            '02:00:00:00:00:01'   # Local admin
        ]
        
        print("1. MAC Address Analysis:")
        for mac_str in test_macs:
            analysis = self.analyze_mac(mac_str)
            if 'error' not in analysis:
                print(f"\\n{mac_str}:")
                print(f"  Type: {analysis['properties']['type']}")
                print(f"  Scope: {analysis['properties']['scope']}")
                print(f"  Vendor: {analysis['vendor']['organization']}")
        
        # Generate random MAC addresses
        print("\\n2. Random MAC Generation:")
        for i in range(3):
            random_mac = MACAddress.generate_random()
            analysis = self.analyze_mac(str(random_mac))
            print(f"Generated: {random_mac} ({analysis['properties']['scope']})")
        
        # Simulate switch operations
        print("\\n3. Switch MAC Table Simulation:")
        
        # Learn some MAC addresses
        mac1 = MACAddress('00:1A:2B:3C:4D:5E')
        mac2 = MACAddress('00:50:56:12:34:56')
        mac3 = MACAddress('08:00:27:AB:CD:EF')
        
        self.mac_table.learn_mac(mac1, 1, 10)
        self.mac_table.learn_mac(mac2, 2, 10)
        self.mac_table.add_static_entry(mac3, 3, 20)
        
        self.mac_table.print_table()
        
        # Simulate ARP table
        print("\\n4. ARP Table Simulation:")
        self.arp_table.add_entry('192.168.1.10', mac1)
        self.arp_table.add_entry('192.168.1.20', mac2)
        self.arp_table.add_entry('192.168.2.30', mac3)
        
        self.arp_table.print_table()
        
        # Lookup operations
        print("\\n5. Lookup Operations:")
        lookup_mac = self.arp_table.lookup_mac('192.168.1.10')
        if lookup_mac:
            print(f"ARP lookup 192.168.1.10: {lookup_mac}")
        
        switch_entry = self.mac_table.lookup_mac(mac2)
        if switch_entry:
            print(f"Switch lookup {mac2}: Port {switch_entry['port']}, VLAN {switch_entry['vlan']}")

if __name__ == "__main__":
    analyzer = MACAddressAnalyzer()
    analyzer.demonstrate_mac_operations()`
    }
  ],

  resources: [
    { type: 'article', title: 'MAC Address - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/introduction-of-mac-address-in-computer-network/', description: 'Complete MAC address concepts and structure' },
    { type: 'video', title: 'MAC Address Explained - YouTube', url: 'https://www.youtube.com/watch?v=UrG7RTWIJak', description: 'Visual explanation of MAC addresses and their role' },
    { type: 'article', title: 'OUI Database - IEEE', url: 'https://standards-oui.ieee.org/', description: 'Official IEEE OUI registry and lookup' },
    { type: 'article', title: 'MAC Address Types - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/types-of-mac-address/', description: 'Unicast, multicast, and broadcast MAC addresses' },
    { type: 'video', title: 'Switch MAC Table - YouTube', url: 'https://www.youtube.com/watch?v=BWZ-MHIhqjM', description: 'How switches learn and use MAC addresses' },
    { type: 'tool', title: 'MAC Address Lookup', url: 'https://www.macvendorlookup.com/', description: 'Online MAC address vendor lookup tool' },
    { type: 'article', title: 'MAC Address Security', url: 'https://www.geeksforgeeks.org/mac-address-spoofing/', description: 'MAC address spoofing and security implications' },
    { type: 'video', title: 'ARP Protocol - YouTube', url: 'https://www.youtube.com/watch?v=cn8Zxh9bPio', description: 'Address Resolution Protocol and MAC addresses' },
    { type: 'article', title: 'MAC Address Privacy', url: 'https://www.eff.org/deeplinks/2014/07/your-android-device-telling-world-where-youve-been', description: 'Privacy implications of MAC address tracking' },
    { type: 'tool', title: 'Wireshark MAC Analysis', url: 'https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowStreamSection.html', description: 'Analyzing MAC addresses in network traffic' }
  ],

  questions: [
    {
      question: "What is a MAC address and what is its purpose in networking?",
      answer: "MAC (Media Access Control) address is a 48-bit unique identifier assigned to network interface controllers at Layer 2 (Data Link Layer). Purpose: 1) Unique identification of network interfaces, 2) Frame addressing in local networks, 3) Switch forwarding decisions, 4) Network access control, 5) Device tracking and management. Essential for Ethernet and WiFi communication within broadcast domains."
    },
    {
      question: "Explain the structure and format of a MAC address.",
      answer: "MAC address structure: 1) 48 bits (6 bytes) total length, 2) First 24 bits: OUI (Organizationally Unique Identifier) - identifies manufacturer, 3) Last 24 bits: NIC-specific identifier - unique per device, 4) Common formats: 00:1A:2B:3C:4D:5E (colon), 00-1A-2B-3C-4D-5E (dash), 001A.2B3C.4D5E (dot). First byte bits indicate unicast/multicast and universal/local administration."
    },
    {
      question: "What are the different types of MAC addresses?",
      answer: "MAC address types: 1) Unicast - individual device address (LSB of first byte = 0), 2) Multicast - group address (LSB of first byte = 1), 3) Broadcast - all devices (FF:FF:FF:FF:FF:FF). Administration types: 1) Universal - globally unique, manufacturer assigned (bit 1 of first byte = 0), 2) Local - locally administered, software changeable (bit 1 of first byte = 1). Each serves different communication patterns."
    },
    {
      question: "How do switches use MAC addresses for frame forwarding?",
      answer: "Switch MAC address learning and forwarding: 1) Learning - examines source MAC of incoming frames, builds MAC address table with port mappings, 2) Forwarding - looks up destination MAC in table, forwards to specific port if known, 3) Flooding - broadcasts frame if destination MAC unknown, 4) Aging - removes old entries after timeout. This creates efficient Layer 2 switching without loops or unnecessary broadcasts."
    },
    {
      question: "What is the relationship between MAC addresses and ARP?",
      answer: "ARP (Address Resolution Protocol) maps IP addresses to MAC addresses: 1) ARP request broadcasts 'Who has IP X?', 2) Target device responds with its MAC address, 3) Requesting device caches IP-to-MAC mapping, 4) Enables Layer 3 to Layer 2 address resolution. Essential for IP communication over Ethernet, as frames need destination MAC addresses for local delivery."
    },
    {
      question: "What are the security implications of MAC addresses?",
      answer: "MAC address security aspects: Vulnerabilities: 1) MAC spoofing - changing MAC address to bypass access controls, 2) Device tracking - unique identifiers enable location tracking, 3) Network reconnaissance - reveals device manufacturers and types. Protections: 1) MAC address filtering (limited effectiveness), 2) Port security on switches, 3) MAC address randomization for privacy, 4) 802.1X authentication beyond MAC filtering."
    },
    {
      question: "How has MAC address usage evolved with modern networking?",
      answer: "Modern MAC address evolution: 1) Virtualization - virtual MAC addresses for VMs, 2) Privacy - MAC randomization in mobile devices, 3) Cloud networking - overlay networks abstract MAC addresses, 4) SDN - software-defined forwarding beyond MAC tables, 5) Containers - ephemeral MAC addresses, 6) WiFi - random MAC addresses for probe requests. Traditional Layer 2 concepts adapting to new architectures."
    },
    {
      question: "What is MAC address randomization and why is it important?",
      answer: "MAC address randomization changes device MAC addresses periodically: Purpose: 1) Privacy protection - prevents device tracking across networks, 2) Location privacy - stops correlation of device presence, 3) Behavioral tracking prevention - limits profiling capabilities. Implementation: 1) Random MAC for WiFi probe requests, 2) Per-network randomization, 3) Time-based rotation. Balances privacy with network functionality like DHCP reservations."
    },
    {
      question: "How do MAC addresses work in different network technologies?",
      answer: "MAC addresses across technologies: Ethernet: 1) 48-bit IEEE 802.3 standard, 2) CSMA/CD collision detection, 3) Switch learning and forwarding. WiFi: 1) Same 48-bit format as Ethernet, 2) 802.11 frame addressing, 3) Access point bridging to Ethernet. Token Ring: 1) 48-bit addresses, 2) Different frame format, 3) Source routing. Modern: 1) Virtual networks may use different addressing, 2) Overlay protocols abstract MAC addresses."
    },
    {
      question: "What tools and techniques are used for MAC address analysis?",
      answer: "MAC address analysis tools: 1) OUI lookup databases - identify manufacturers from MAC prefixes, 2) Network scanners - discover devices and their MAC addresses, 3) Wireshark - analyze MAC addresses in packet captures, 4) Switch management - view MAC address tables, 5) ARP tables - see IP-to-MAC mappings, 6) Wake-on-LAN tools - use MAC for remote wake-up. Essential for network troubleshooting, security analysis, and device management."
    }
  ]
};