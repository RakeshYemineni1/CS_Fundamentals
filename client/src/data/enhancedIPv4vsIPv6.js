export const enhancedIPv4vsIPv6 = {
  id: 'ipv4-vs-ipv6',
  title: 'IPv4 vs IPv6',
  subtitle: 'Internet Protocol Version Comparison and Migration',
  summary: 'IPv4 and IPv6 are different versions of Internet Protocol with IPv6 designed to address IPv4 limitations including address exhaustion and security.',
  analogy: 'Like postal addresses - IPv4 uses shorter addresses (running out of space), IPv6 uses longer addresses (virtually unlimited space) with better features.',
  visualConcept: 'Picture IPv4 as a small city with limited house numbers, IPv6 as a vast metropolis with unlimited addressing and modern infrastructure.',
  realWorldUse: 'Internet addressing, device connectivity, IoT networks, mobile networks, enterprise networks, cloud services, modern web applications.',
  explanation: `IPv4 vs IPv6 Comparison:

IPv4 (Internet Protocol version 4):
- 32-bit addressing scheme providing ~4.3 billion addresses
- Dotted decimal notation (192.168.1.1)
- Developed in 1981, widely deployed since 1980s
- Address exhaustion problem leading to NAT usage
- Limited built-in security features
- Manual or DHCP configuration required
- Fragmentation handled by routers and hosts

IPv6 (Internet Protocol version 6):
- 128-bit addressing scheme providing 340 undecillion addresses
- Hexadecimal colon notation (2001:db8::1)
- Developed in 1990s, standardized in 1998
- Virtually unlimited address space
- Built-in IPSec security features
- Stateless address autoconfiguration
- Fragmentation only at source hosts

Key Differences:

Address Space:
- IPv4: 2^32 = ~4.3 billion addresses
- IPv6: 2^128 = ~340 undecillion addresses

Header Structure:
- IPv4: Variable length header (20-60 bytes)
- IPv6: Fixed length header (40 bytes)

Security:
- IPv4: Security through additional protocols
- IPv6: Built-in IPSec support

Configuration:
- IPv4: Manual or DHCP required
- IPv6: Stateless autoconfiguration available

Quality of Service:
- IPv4: Limited QoS support
- IPv6: Enhanced QoS with flow labels

Migration Strategies:
1. Dual Stack - Run both protocols simultaneously
2. Tunneling - Encapsulate IPv6 in IPv4 packets
3. Translation - Convert between protocols (NAT64)

Challenges:
- IPv4: Address exhaustion, NAT complexity, security
- IPv6: Adoption rate, complexity, learning curve`,

  keyPoints: [
    'IPv4 uses 32-bit addresses, IPv6 uses 128-bit addresses',
    'IPv4 has ~4.3 billion addresses, IPv6 has virtually unlimited',
    'IPv6 includes built-in security features (IPSec)',
    'IPv6 supports stateless address autoconfiguration',
    'IPv4 requires NAT for address conservation',
    'IPv6 has simplified, fixed-length headers',
    'Migration strategies include dual stack and tunneling',
    'IPv6 provides better QoS and mobility support',
    'IPv4 fragmentation vs IPv6 path MTU discovery',
    'IPv6 adoption growing but IPv4 still dominant'
  ],

  codeExamples: [
    {
      title: "IPv4 vs IPv6 Address Handling",
      language: "python",
      code: `import ipaddress
import socket
import struct
import random

class IPv4Handler:
    def __init__(self):
        self.private_ranges = [
            ipaddress.IPv4Network('10.0.0.0/8'),
            ipaddress.IPv4Network('172.16.0.0/12'),
            ipaddress.IPv4Network('192.168.0.0/16')
        ]
    
    def parse_address(self, addr_str):
        """Parse IPv4 address string"""
        try:
            addr = ipaddress.IPv4Address(addr_str)
            return {
                'address': str(addr),
                'packed': addr.packed,
                'is_private': addr.is_private,
                'is_multicast': addr.is_multicast,
                'is_loopback': addr.is_loopback,
                'class': self.get_address_class(addr)
            }
        except Exception as e:
            return {'error': str(e)}
    
    def get_address_class(self, addr):
        """Determine IPv4 address class"""
        first_octet = int(str(addr).split('.')[0])
        if 1 <= first_octet <= 126:
            return 'A'
        elif 128 <= first_octet <= 191:
            return 'B'
        elif 192 <= first_octet <= 223:
            return 'C'
        elif 224 <= first_octet <= 239:
            return 'D (Multicast)'
        else:
            return 'E (Reserved)'
    
    def subnet_info(self, network_str):
        """Get subnet information"""
        try:
            network = ipaddress.IPv4Network(network_str, strict=False)
            return {
                'network': str(network.network_address),
                'netmask': str(network.netmask),
                'broadcast': str(network.broadcast_address),
                'num_hosts': network.num_addresses - 2,
                'first_host': str(network.network_address + 1),
                'last_host': str(network.broadcast_address - 1),
                'prefix_length': network.prefixlen
            }
        except Exception as e:
            return {'error': str(e)}

class IPv6Handler:
    def __init__(self):
        self.special_ranges = {
            '::1/128': 'Loopback',
            '::/128': 'Unspecified',
            'fe80::/10': 'Link-local',
            'fc00::/7': 'Unique local',
            'ff00::/8': 'Multicast',
            '2001:db8::/32': 'Documentation'
        }
    
    def parse_address(self, addr_str):
        """Parse IPv6 address string"""
        try:
            addr = ipaddress.IPv6Address(addr_str)
            return {
                'address': str(addr),
                'compressed': addr.compressed,
                'exploded': addr.exploded,
                'packed': addr.packed,
                'is_private': addr.is_private,
                'is_multicast': addr.is_multicast,
                'is_loopback': addr.is_loopback,
                'is_link_local': addr.is_link_local,
                'scope': self.get_address_scope(addr)
            }
        except Exception as e:
            return {'error': str(e)}
    
    def get_address_scope(self, addr):
        """Determine IPv6 address scope"""
        if addr.is_loopback:
            return 'Loopback'
        elif addr.is_link_local:
            return 'Link-local'
        elif addr.is_private:
            return 'Unique local'
        elif addr.is_multicast:
            return 'Multicast'
        elif str(addr).startswith('2001:db8'):
            return 'Documentation'
        elif str(addr).startswith('2'):
            return 'Global unicast'
        else:
            return 'Other'
    
    def generate_eui64(self, mac_address, prefix):
        """Generate EUI-64 interface identifier"""
        try:
            # Remove separators and convert to uppercase
            mac = mac_address.replace(':', '').replace('-', '').upper()
            
            # Insert FFFE in the middle
            eui64 = mac[:6] + 'FFFE' + mac[6:]
            
            # Flip the universal/local bit (7th bit of first byte)
            first_byte = int(eui64[:2], 16)
            first_byte ^= 0x02
            eui64 = f"{first_byte:02X}" + eui64[2:]
            
            # Format as IPv6 interface ID
            interface_id = ':'.join([eui64[i:i+4] for i in range(0, 16, 4)])
            
            # Combine with prefix
            full_address = f"{prefix}:{interface_id}"
            
            return {
                'mac_address': mac_address,
                'eui64': eui64,
                'interface_id': interface_id,
                'full_address': full_address
            }
        except Exception as e:
            return {'error': str(e)}

class IPProtocolComparison:
    def __init__(self):
        self.ipv4_handler = IPv4Handler()
        self.ipv6_handler = IPv6Handler()
    
    def compare_addresses(self, ipv4_addr, ipv6_addr):
        """Compare IPv4 and IPv6 addresses"""
        ipv4_info = self.ipv4_handler.parse_address(ipv4_addr)
        ipv6_info = self.ipv6_handler.parse_address(ipv6_addr)
        
        return {
            'ipv4': ipv4_info,
            'ipv6': ipv6_info,
            'comparison': {
                'address_length': {
                    'ipv4': '32 bits',
                    'ipv6': '128 bits'
                },
                'representation': {
                    'ipv4': 'Dotted decimal',
                    'ipv6': 'Hexadecimal colon'
                },
                'total_addresses': {
                    'ipv4': '4,294,967,296',
                    'ipv6': '340,282,366,920,938,463,463,374,607,431,768,211,456'
                }
            }
        }
    
    def demonstrate_header_differences(self):
        """Show IPv4 vs IPv6 header differences"""
        return {
            'ipv4_header': {
                'size': '20-60 bytes (variable)',
                'fields': [
                    'Version (4 bits)',
                    'IHL (4 bits)',
                    'Type of Service (8 bits)',
                    'Total Length (16 bits)',
                    'Identification (16 bits)',
                    'Flags (3 bits)',
                    'Fragment Offset (13 bits)',
                    'TTL (8 bits)',
                    'Protocol (8 bits)',
                    'Header Checksum (16 bits)',
                    'Source Address (32 bits)',
                    'Destination Address (32 bits)',
                    'Options (0-40 bytes)'
                ]
            },
            'ipv6_header': {
                'size': '40 bytes (fixed)',
                'fields': [
                    'Version (4 bits)',
                    'Traffic Class (8 bits)',
                    'Flow Label (20 bits)',
                    'Payload Length (16 bits)',
                    'Next Header (8 bits)',
                    'Hop Limit (8 bits)',
                    'Source Address (128 bits)',
                    'Destination Address (128 bits)'
                ]
            },
            'key_differences': [
                'IPv6 header is fixed length, IPv4 is variable',
                'IPv6 removes header checksum for performance',
                'IPv6 uses flow labels for QoS',
                'IPv6 fragmentation only at source',
                'IPv6 extension headers for additional features'
            ]
        }
    
    def migration_strategies(self):
        """Demonstrate IPv6 migration strategies"""
        return {
            'dual_stack': {
                'description': 'Run both IPv4 and IPv6 simultaneously',
                'advantages': ['Gradual migration', 'Backward compatibility'],
                'disadvantages': ['Resource overhead', 'Complex management']
            },
            'tunneling': {
                'description': 'Encapsulate IPv6 in IPv4 packets',
                'types': ['6to4', '6in4', 'Teredo', 'ISATAP'],
                'advantages': ['Works over IPv4 infrastructure'],
                'disadvantages': ['Performance overhead', 'MTU issues']
            },
            'translation': {
                'description': 'Convert between IPv4 and IPv6',
                'types': ['NAT64', 'DNS64', 'SIIT'],
                'advantages': ['IPv6-only networks can reach IPv4'],
                'disadvantages': ['Protocol complexity', 'Feature limitations']
            }
        }

class NetworkingDemo:
    def __init__(self):
        self.comparison = IPProtocolComparison()
    
    def demonstrate_protocols(self):
        """Demonstrate IPv4 vs IPv6 features"""
        print("=== IPv4 vs IPv6 Demonstration ===\\n")
        
        # Address comparison
        print("1. Address Comparison:")
        result = self.comparison.compare_addresses('192.168.1.100', '2001:db8::1')
        
        print(f"IPv4: {result['ipv4']['address']} (Class {result['ipv4']['class']})")
        print(f"IPv6: {result['ipv6']['compressed']}")
        print(f"IPv6 Exploded: {result['ipv6']['exploded']}\\n")
        
        # Header differences
        print("2. Header Structure Differences:")
        headers = self.comparison.demonstrate_header_differences()
        print(f"IPv4 Header: {headers['ipv4_header']['size']}")
        print(f"IPv6 Header: {headers['ipv6_header']['size']}")
        
        for diff in headers['key_differences'][:3]:
            print(f"  - {diff}")
        print()
        
        # Migration strategies
        print("3. Migration Strategies:")
        strategies = self.comparison.migration_strategies()
        for name, info in strategies.items():
            print(f"{name.replace('_', ' ').title()}: {info['description']}")
        print()
        
        # EUI-64 demonstration
        print("4. IPv6 EUI-64 Address Generation:")
        eui64_result = self.comparison.ipv6_handler.generate_eui64(
            '00:1B:44:11:3A:B7', '2001:db8:1234:5678'
        )
        if 'error' not in eui64_result:
            print(f"MAC: {eui64_result['mac_address']}")
            print(f"IPv6: {eui64_result['full_address']}")
        
        # Subnet comparison
        print("\\n5. Subnetting Comparison:")
        ipv4_subnet = self.comparison.ipv4_handler.subnet_info('192.168.1.0/24')
        print(f"IPv4 /24: {ipv4_subnet['num_hosts']} hosts")
        print(f"IPv6 /64: 18,446,744,073,709,551,616 hosts")

if __name__ == "__main__":
    demo = NetworkingDemo()
    demo.demonstrate_protocols()`
    }
  ],

  resources: [
    { type: 'article', title: 'IPv4 vs IPv6 - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/differences-between-ipv4-and-ipv6/', description: 'Comprehensive comparison of IPv4 and IPv6' },
    { type: 'video', title: 'IPv6 Explained - YouTube', url: 'https://www.youtube.com/watch?v=ThdO9beHhpA', description: 'Visual explanation of IPv6 features and benefits' },
    { type: 'article', title: 'IPv6 Address Types - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/ipv6-addressing/', description: 'IPv6 addressing schemes and types' },
    { type: 'article', title: 'IPv6 RFC 8200', url: 'https://tools.ietf.org/html/rfc8200', description: 'Official IPv6 specification' },
    { type: 'video', title: 'IPv4 Address Classes - YouTube', url: 'https://www.youtube.com/watch?v=4xlzlgYGqW8', description: 'IPv4 addressing and classes explained' },
    { type: 'article', title: 'IPv6 Migration Strategies', url: 'https://www.cisco.com/c/en/us/solutions/ipv6/overview.html', description: 'IPv6 deployment and migration guide' },
    { type: 'tool', title: 'IPv6 Test', url: 'https://test-ipv6.com/', description: 'Test your IPv6 connectivity' },
    { type: 'article', title: 'IPv4 Exhaustion - IANA', url: 'https://www.iana.org/numbers/', description: 'IPv4 address space allocation status' },
    { type: 'video', title: 'Dual Stack Configuration', url: 'https://www.youtube.com/watch?v=99pTt5leozU', description: 'IPv4/IPv6 dual stack setup' },
    { type: 'tool', title: 'IPv6 Calculator', url: 'https://www.subnetonline.com/pages/ipv6-network-calculator.php', description: 'IPv6 subnet calculator tool' }
  ],

  questions: [
    {
      question: "What are the main differences between IPv4 and IPv6?",
      answer: "Key differences: 1) Address length - IPv4 uses 32-bit (4.3B addresses), IPv6 uses 128-bit (340 undecillion), 2) Header - IPv4 variable length (20-60 bytes), IPv6 fixed (40 bytes), 3) Security - IPv4 optional, IPv6 built-in IPSec, 4) Configuration - IPv4 manual/DHCP, IPv6 stateless autoconfiguration, 5) QoS - IPv4 limited, IPv6 enhanced with flow labels, 6) Fragmentation - IPv4 at routers, IPv6 only at source."
    },
    {
      question: "Why was IPv6 developed and what problems does it solve?",
      answer: "IPv6 was developed to address: 1) IPv4 address exhaustion - only 4.3 billion addresses insufficient for growing internet, 2) NAT complexity - eliminates need for NAT with abundant addresses, 3) Security - built-in IPSec encryption and authentication, 4) QoS - better traffic prioritization with flow labels, 5) Mobility - improved mobile device support, 6) Autoconfiguration - simplified network setup, 7) Performance - streamlined header processing."
    },
    {
      question: "How does IPv6 addressing work and what are the different address types?",
      answer: "IPv6 uses 128-bit addresses in hexadecimal colon notation. Types: 1) Unicast - single interface (global, link-local, unique local), 2) Multicast - group communication (ff00::/8), 3) Anycast - nearest of multiple interfaces. No broadcast in IPv6. Address structure: network prefix + interface identifier. EUI-64 can generate interface ID from MAC address. Compression rules allow :: for consecutive zeros."
    },
    {
      question: "What are the IPv6 migration strategies and their trade-offs?",
      answer: "Migration strategies: 1) Dual Stack - run both protocols simultaneously, pros: gradual migration, cons: resource overhead, 2) Tunneling (6to4, Teredo) - encapsulate IPv6 in IPv4, pros: works over IPv4 infrastructure, cons: performance overhead, 3) Translation (NAT64/DNS64) - convert between protocols, pros: IPv6-only to IPv4 connectivity, cons: complexity and limitations. Most networks use dual stack initially."
    },
    {
      question: "How do IPv4 and IPv6 headers differ in structure and functionality?",
      answer: "Header differences: IPv4 - variable length (20-60 bytes), includes checksum, fragmentation fields, options. IPv6 - fixed 40 bytes, no checksum (performance), no fragmentation (path MTU discovery), extension headers for options. IPv6 improvements: simplified processing, better QoS with traffic class and flow label, hop limit vs TTL, next header field for protocol chaining. IPv6 design prioritizes performance and extensibility."
    },
    {
      question: "What is IPv6 stateless address autoconfiguration (SLAAC)?",
      answer: "SLAAC allows devices to automatically configure IPv6 addresses without DHCP: 1) Router advertisements provide network prefix, 2) Device generates interface identifier (EUI-64 or random), 3) Combines prefix + interface ID for full address, 4) Duplicate Address Detection (DAD) ensures uniqueness, 5) Default gateway learned from router advertisements. Benefits: simplified network management, plug-and-play connectivity, reduced DHCP dependency."
    },
    {
      question: "How does IPv6 handle security compared to IPv4?",
      answer: "IPv6 security improvements: 1) Built-in IPSec - mandatory implementation (though not always enabled), 2) Authentication Header (AH) - packet integrity and authentication, 3) Encapsulating Security Payload (ESP) - encryption and authentication, 4) Neighbor Discovery Security (SEND) - cryptographic protection, 5) Privacy extensions - temporary addresses for privacy. However, IPv6 also introduces new challenges: larger attack surface, transition vulnerabilities, complexity."
    },
    {
      question: "What are the challenges in IPv6 adoption and deployment?",
      answer: "IPv6 adoption challenges: 1) Legacy systems - older hardware/software lack support, 2) Training - network administrators need IPv6 knowledge, 3) Dual stack complexity - managing both protocols, 4) Application compatibility - some applications IPv4-only, 5) ISP support - not all providers offer IPv6, 6) Cost - infrastructure upgrades required, 7) Transition period - long coexistence with IPv4, 8) Security tools - many designed for IPv4."
    },
    {
      question: "How does IPv6 improve Quality of Service (QoS) compared to IPv4?",
      answer: "IPv6 QoS improvements: 1) Traffic Class field - 8-bit DSCP marking like IPv4 ToS, 2) Flow Label - 20-bit field for flow identification, enables per-flow processing, 3) Simplified header - faster processing allows more QoS features, 4) Extension headers - flexible QoS options, 5) Better multicast - efficient group communication, 6) Jumbograms - packets larger than 65535 bytes for high-performance applications. Flow labels particularly useful for real-time applications."
    },
    {
      question: "What is the current state of IPv6 deployment globally?",
      answer: "IPv6 deployment status: 1) Global adoption ~35-40% (varies by region), 2) Major content providers (Google, Facebook, Netflix) support IPv6, 3) Mobile networks leading adoption (LTE requires IPv6), 4) Enterprise adoption slower than consumer, 5) Regional differences - Asia-Pacific leads, North America growing, 6) Dual stack most common deployment, 7) IPv4 addresses exhausted in most regions, driving IPv6 adoption, 8) Government mandates accelerating deployment in some countries."
    }
  ]
};