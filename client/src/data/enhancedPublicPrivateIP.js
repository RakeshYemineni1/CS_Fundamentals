export const enhancedPublicPrivateIP = {
  id: 'public-private-ip',
  title: 'Public vs Private IP Addresses',
  subtitle: 'IP Address Classification and Network Design',
  summary: 'Public IP addresses are globally routable on the internet, while private IP addresses are used within local networks and require NAT for internet access.',
  analogy: 'Like home addresses - public IPs are street addresses visible to postal service, private IPs are room numbers inside buildings.',
  visualConcept: 'Picture public IPs as highway addresses everyone can find, private IPs as internal building directories only residents know.',
  realWorldUse: 'Home networks, corporate LANs, data centers, cloud networks, IoT devices, network security, address conservation.',
  explanation: `Public vs Private IP Address Classification:

Public IP Addresses:
- Globally unique and routable on the internet
- Assigned by Internet Assigned Numbers Authority (IANA)
- Distributed through Regional Internet Registries (RIRs)
- Required for direct internet communication
- Limited in number (IPv4 exhaustion issue)
- Costs associated with allocation and maintenance

Private IP Addresses:
- Reserved for use within private networks
- Not routable on the public internet
- Can be reused across different private networks
- Defined by RFC 1918 for IPv4, RFC 4193 for IPv6
- Free to use within organizations
- Require NAT/PAT for internet access

IPv4 Private Address Ranges (RFC 1918):
1. Class A: 10.0.0.0/8 (10.0.0.0 - 10.255.255.255)
   - 16,777,216 addresses
   - Large enterprise networks

2. Class B: 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
   - 1,048,576 addresses
   - Medium enterprise networks

3. Class C: 192.168.0.0/16 (192.168.0.0 - 192.168.255.255)
   - 65,536 addresses
   - Small networks, home networks

Special IPv4 Addresses:
- 127.0.0.0/8: Loopback addresses
- 169.254.0.0/16: Link-local addresses (APIPA)
- 224.0.0.0/4: Multicast addresses
- 0.0.0.0/8: Current network

IPv6 Address Classification:
- Global Unicast: 2000::/3 (public, routable)
- Unique Local: fc00::/7 (private, RFC 4193)
- Link-Local: fe80::/10 (local segment only)

Network Address Translation (NAT):
- Enables private networks to access internet
- Maps private IPs to public IPs
- Conserves public IP addresses
- Provides basic security through address hiding
- Types: Static NAT, Dynamic NAT, PAT (Port Address Translation)

Benefits of Private Addressing:
1. Address Conservation: Reduces public IP usage
2. Security: Internal network structure hidden
3. Flexibility: Easy network reconfiguration
4. Cost Savings: No fees for private addresses
5. Scalability: Large internal address spaces

Network Design Considerations:
- Use private addresses for internal networks
- Reserve public addresses for internet-facing services
- Implement proper NAT/firewall policies
- Plan address allocation for growth
- Consider IPv6 for future-proofing`,

  keyPoints: [
    'Public IPs are globally unique and internet-routable',
    'Private IPs are for internal networks, not internet-routable',
    'RFC 1918 defines IPv4 private ranges (10.x, 172.16-31.x, 192.168.x)',
    'Private networks use NAT to access the internet',
    'Public IPs are limited and costly, private IPs are free',
    'IPv6 has global unicast (public) and unique local (private)',
    'Private addressing provides security and flexibility',
    'APIPA (169.254.x.x) for automatic local addressing',
    'Loopback (127.x.x.x) for local host communication',
    'Proper planning essential for network scalability'
  ],

  codeExamples: [
    {
      title: "IP Address Classification and Validation",
      language: "python",
      code: `import ipaddress
import socket
import requests
import json
from typing import Dict, List, Optional

class IPAddressClassifier:
    def __init__(self):
        # RFC 1918 Private IPv4 ranges
        self.private_ipv4_ranges = [
            ipaddress.IPv4Network('10.0.0.0/8'),
            ipaddress.IPv4Network('172.16.0.0/12'),
            ipaddress.IPv4Network('192.168.0.0/16')
        ]
        
        # Special IPv4 ranges
        self.special_ipv4_ranges = {
            ipaddress.IPv4Network('127.0.0.0/8'): 'Loopback',
            ipaddress.IPv4Network('169.254.0.0/16'): 'Link-Local (APIPA)',
            ipaddress.IPv4Network('224.0.0.0/4'): 'Multicast',
            ipaddress.IPv4Network('240.0.0.0/4'): 'Reserved',
            ipaddress.IPv4Network('0.0.0.0/8'): 'Current Network'
        }
        
        # IPv6 ranges
        self.ipv6_ranges = {
            'global_unicast': ipaddress.IPv6Network('2000::/3'),
            'unique_local': ipaddress.IPv6Network('fc00::/7'),
            'link_local': ipaddress.IPv6Network('fe80::/10'),
            'multicast': ipaddress.IPv6Network('ff00::/8'),
            'loopback': ipaddress.IPv6Network('::1/128')
        }
    
    def classify_ipv4(self, ip_str: str) -> Dict:
        \"\"\"Classify IPv4 address type\"\"\"
        try:
            ip = ipaddress.IPv4Address(ip_str)
            
            classification = {
                'address': str(ip),
                'version': 4,
                'is_private': ip.is_private,
                'is_global': ip.is_global,
                'is_multicast': ip.is_multicast,
                'is_loopback': ip.is_loopback,
                'is_link_local': ip.is_link_local,
                'type': 'Unknown'
            }
            
            # Check private ranges
            if ip.is_private:
                for network in self.private_ipv4_ranges:
                    if ip in network:
                        if network.prefixlen == 8:  # 10.0.0.0/8
                            classification['type'] = 'Private Class A'
                            classification['range'] = '10.0.0.0/8'
                        elif network.prefixlen == 12:  # 172.16.0.0/12
                            classification['type'] = 'Private Class B'
                            classification['range'] = '172.16.0.0/12'
                        elif network.prefixlen == 16:  # 192.168.0.0/16
                            classification['type'] = 'Private Class C'
                            classification['range'] = '192.168.0.0/16'
                        break
            
            # Check special ranges
            for network, desc in self.special_ipv4_ranges.items():
                if ip in network:
                    classification['type'] = desc
                    classification['range'] = str(network)
                    break
            
            # If not private or special, it's public
            if classification['type'] == 'Unknown' and ip.is_global:
                classification['type'] = 'Public'
                classification['class'] = self.get_ipv4_class(ip)
            
            return classification
            
        except Exception as e:
            return {'error': str(e)}
    
    def classify_ipv6(self, ip_str: str) -> Dict:
        \"\"\"Classify IPv6 address type\"\"\"
        try:
            ip = ipaddress.IPv6Address(ip_str)
            
            classification = {
                'address': str(ip),
                'compressed': ip.compressed,
                'exploded': ip.exploded,
                'version': 6,
                'is_private': ip.is_private,
                'is_global': ip.is_global,
                'is_multicast': ip.is_multicast,
                'is_loopback': ip.is_loopback,
                'is_link_local': ip.is_link_local,
                'type': 'Unknown'
            }
            
            # Check IPv6 ranges
            for range_name, network in self.ipv6_ranges.items():
                if ip in network:
                    classification['type'] = range_name.replace('_', ' ').title()
                    classification['range'] = str(network)
                    break
            
            return classification
            
        except Exception as e:
            return {'error': str(e)}
    
    def get_ipv4_class(self, ip: ipaddress.IPv4Address) -> str:
        \"\"\"Determine IPv4 address class\"\"\"
        first_octet = int(str(ip).split('.')[0])
        
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
    
    def validate_private_network(self, network_str: str) -> Dict:
        \"\"\"Validate if network uses proper private addressing\"\"\"
        try:
            network = ipaddress.ip_network(network_str, strict=False)
            
            result = {
                'network': str(network),
                'is_private': network.is_private,
                'num_addresses': network.num_addresses,
                'recommendations': []
            }
            
            if network.version == 4:
                if network.is_private:
                    result['status'] = 'Valid private network'
                    
                    # Provide recommendations based on size
                    if network.num_addresses > 1000000:
                        result['recommendations'].append('Consider using 10.0.0.0/8 for large networks')
                    elif network.num_addresses > 50000:
                        result['recommendations'].append('Consider using 172.16.0.0/12 for medium networks')
                    else:
                        result['recommendations'].append('192.168.0.0/16 suitable for small networks')
                else:
                    result['status'] = 'Public network - ensure proper security'
                    result['recommendations'].append('Use private addressing for internal networks')
            
            return result
            
        except Exception as e:
            return {'error': str(e)}

class NetworkDiscovery:
    def __init__(self):
        self.classifier = IPAddressClassifier()
    
    def get_local_interfaces(self) -> List[Dict]:
        \"\"\"Get local network interfaces and their IP addresses\"\"\"
        interfaces = []
        
        try:
            import netifaces
            
            for interface in netifaces.interfaces():
                addrs = netifaces.ifaddresses(interface)
                
                interface_info = {
                    'interface': interface,
                    'ipv4_addresses': [],
                    'ipv6_addresses': []
                }
                
                # IPv4 addresses
                if netifaces.AF_INET in addrs:
                    for addr_info in addrs[netifaces.AF_INET]:
                        ip_info = self.classifier.classify_ipv4(addr_info['addr'])
                        ip_info['netmask'] = addr_info.get('netmask', '')
                        interface_info['ipv4_addresses'].append(ip_info)
                
                # IPv6 addresses
                if netifaces.AF_INET6 in addrs:
                    for addr_info in addrs[netifaces.AF_INET6]:
                        ip_str = addr_info['addr'].split('%')[0]  # Remove scope ID
                        ip_info = self.classifier.classify_ipv6(ip_str)
                        interface_info['ipv6_addresses'].append(ip_info)
                
                interfaces.append(interface_info)
            
        except ImportError:
            # Fallback method without netifaces
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            
            interfaces.append({
                'interface': 'default',
                'ipv4_addresses': [self.classifier.classify_ipv4(local_ip)],
                'ipv6_addresses': []
            })
        
        return interfaces
    
    def get_public_ip(self) -> Dict:
        \"\"\"Get public IP address using external service\"\"\"
        try:
            # Try multiple services for reliability
            services = [
                'https://api.ipify.org?format=json',
                'https://httpbin.org/ip',
                'https://api.myip.com'
            ]
            
            for service in services:
                try:
                    response = requests.get(service, timeout=5)
                    data = response.json()
                    
                    # Extract IP from different response formats
                    public_ip = None
                    if 'ip' in data:
                        public_ip = data['ip']
                    elif 'origin' in data:
                        public_ip = data['origin']
                    
                    if public_ip:
                        classification = self.classifier.classify_ipv4(public_ip)
                        classification['source'] = service
                        return classification
                        
                except Exception:
                    continue
            
            return {'error': 'Could not determine public IP'}
            
        except Exception as e:
            return {'error': str(e)}
    
    def analyze_network_setup(self) -> Dict:
        \"\"\"Analyze current network setup\"\"\"
        analysis = {
            'local_interfaces': self.get_local_interfaces(),
            'public_ip': self.get_public_ip(),
            'nat_detected': False,
            'recommendations': []
        }
        
        # Check for NAT
        public_ip_info = analysis['public_ip']
        if 'error' not in public_ip_info:
            public_ip = public_ip_info['address']
            
            # Check if any local interface has the same IP as public
            local_ips = []
            for interface in analysis['local_interfaces']:
                for ipv4_addr in interface['ipv4_addresses']:
                    if 'address' in ipv4_addr:
                        local_ips.append(ipv4_addr['address'])
            
            if public_ip not in local_ips:
                analysis['nat_detected'] = True
                analysis['recommendations'].append('NAT detected - private addresses mapped to public IP')
        
        # Analyze address usage
        private_count = 0
        public_count = 0
        
        for interface in analysis['local_interfaces']:
            for ipv4_addr in interface['ipv4_addresses']:
                if ipv4_addr.get('is_private'):
                    private_count += 1
                elif ipv4_addr.get('type') == 'Public':
                    public_count += 1
        
        if public_count > 0:
            analysis['recommendations'].append('Public IPs on local interfaces - ensure proper security')
        
        if private_count == 0:
            analysis['recommendations'].append('No private addresses found - consider using RFC 1918 ranges')
        
        return analysis

class IPAddressDemo:
    def __init__(self):
        self.classifier = IPAddressClassifier()
        self.discovery = NetworkDiscovery()
    
    def demonstrate_classification(self):
        \"\"\"Demonstrate IP address classification\"\"\"
        print("=== IP Address Classification Demo ===\\n")
        
        # Test addresses
        test_addresses = [
            '192.168.1.100',    # Private Class C
            '10.0.0.1',         # Private Class A
            '172.16.5.10',      # Private Class B
            '8.8.8.8',          # Public (Google DNS)
            '127.0.0.1',        # Loopback
            '169.254.1.1',      # Link-local
            '224.0.0.1',        # Multicast
            '2001:db8::1',      # IPv6 Documentation
            'fe80::1',          # IPv6 Link-local
            'fc00::1'           # IPv6 Unique local
        ]
        
        print("1. Address Classification:")
        for addr in test_addresses:
            if ':' in addr:
                result = self.classifier.classify_ipv6(addr)
            else:
                result = self.classifier.classify_ipv4(addr)
            
            if 'error' not in result:
                print(f"  {addr:15} -> {result['type']} (IPv{result['version']})")
        
        print("\\n2. Network Analysis:")
        network_analysis = self.discovery.analyze_network_setup()
        
        print(f"NAT Detected: {network_analysis['nat_detected']}")
        
        if network_analysis['public_ip'].get('address'):
            public_ip = network_analysis['public_ip']
            print(f"Public IP: {public_ip['address']} ({public_ip['type']})")
        
        print("\\nLocal Interfaces:")
        for interface in network_analysis['local_interfaces'][:2]:  # Show first 2
            print(f"  {interface['interface']}:")
            for ipv4 in interface['ipv4_addresses']:
                if 'address' in ipv4:
                    print(f"    IPv4: {ipv4['address']} ({ipv4['type']})")
        
        print("\\n3. Private Network Validation:")
        test_networks = ['192.168.1.0/24', '10.0.0.0/8', '8.8.8.0/24']
        
        for network in test_networks:
            result = self.classifier.validate_private_network(network)
            if 'error' not in result:
                print(f"  {network:15} -> {result['status']}")

if __name__ == "__main__":
    demo = IPAddressDemo()
    demo.demonstrate_classification()`
    }
  ],

  resources: [
    { type: 'article', title: 'Private IP Addresses - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/private-ip-addresses-in-networking/', description: 'Complete guide to private IP addressing' },
    { type: 'video', title: 'Public vs Private IP - YouTube', url: 'https://www.youtube.com/watch?v=92b-jjBURkw', description: 'Visual explanation of public and private IP addresses' },
    { type: 'article', title: 'RFC 1918 - Private Address Space', url: 'https://tools.ietf.org/html/rfc1918', description: 'Official specification for private IPv4 addresses' },
    { type: 'article', title: 'IP Address Classes - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/introduction-of-classful-ip-addressing/', description: 'IPv4 address classes and ranges' },
    { type: 'video', title: 'NAT Explained - YouTube', url: 'https://www.youtube.com/watch?v=FTUV0t6JaDA', description: 'How NAT enables private networks to access internet' },
    { type: 'article', title: 'IPv6 Unique Local Addresses', url: 'https://tools.ietf.org/html/rfc4193', description: 'IPv6 private addressing specification' },
    { type: 'tool', title: 'IP Address Lookup', url: 'https://whatismyipaddress.com/', description: 'Check your public IP address and location' },
    { type: 'article', title: 'APIPA Addressing', url: 'https://www.geeksforgeeks.org/apipa-automatic-private-ip-addressing/', description: 'Automatic Private IP Addressing explained' },
    { type: 'video', title: 'Network Address Planning', url: 'https://www.youtube.com/watch?v=BWZ-MHIhqjM', description: 'Best practices for IP address planning' },
    { type: 'tool', title: 'IP Calculator', url: 'https://www.calculator.net/ip-subnet-calculator.html', description: 'IP subnet and network calculator' }
  ],

  questions: [
    {
      question: "What is the difference between public and private IP addresses?",
      answer: "Public IP addresses: 1) Globally unique and routable on internet, 2) Assigned by IANA through RIRs, 3) Required for direct internet communication, 4) Limited in number and costly. Private IP addresses: 1) Reserved for internal networks (RFC 1918), 2) Not routable on internet, 3) Can be reused across different networks, 4) Free to use, require NAT for internet access. Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16."
    },
    {
      question: "What are the RFC 1918 private address ranges and their typical uses?",
      answer: "RFC 1918 private ranges: 1) 10.0.0.0/8 (Class A) - 16.7M addresses, large enterprise networks, 2) 172.16.0.0/12 (Class B) - 1M addresses, medium enterprise networks, 3) 192.168.0.0/16 (Class C) - 65K addresses, small networks and home use. These ranges are not routed on internet, allowing reuse across organizations. They provide address space for internal networks while conserving public IPv4 addresses."
    },
    {
      question: "How does NAT enable private networks to access the internet?",
      answer: "NAT (Network Address Translation) maps private IP addresses to public IP addresses: 1) Outbound traffic - replaces private source IP with public IP, 2) Maintains translation table mapping private IP:port to public IP:port, 3) Inbound responses - translates public destination back to private IP, 4) Enables multiple private hosts to share single public IP. Types: Static NAT (1:1 mapping), Dynamic NAT (pool of public IPs), PAT (Port Address Translation, many:1)."
    },
    {
      question: "What are special-use IPv4 addresses and their purposes?",
      answer: "Special IPv4 addresses: 1) 127.0.0.0/8 - Loopback (localhost communication), 2) 169.254.0.0/16 - Link-local/APIPA (automatic addressing when DHCP fails), 3) 224.0.0.0/4 - Multicast (group communication), 4) 240.0.0.0/4 - Reserved for future use, 5) 0.0.0.0/8 - Current network, 6) 255.255.255.255 - Limited broadcast. These addresses have specific functions and are not used for general host addressing."
    },
    {
      question: "How do IPv6 address types compare to IPv4 public/private classification?",
      answer: "IPv6 address types: 1) Global Unicast (2000::/3) - equivalent to IPv4 public addresses, globally routable, 2) Unique Local (fc00::/7) - equivalent to IPv4 private addresses, not globally routable, 3) Link-Local (fe80::/10) - similar to IPv4 APIPA, local segment only, 4) Multicast (ff00::/8) - group communication. IPv6 eliminates need for NAT due to abundant address space, but unique local addresses provide private networking capability."
    },
    {
      question: "What security implications exist with public vs private IP addressing?",
      answer: "Security implications: Public IPs: 1) Directly accessible from internet, 2) Require robust firewall protection, 3) Exposed to scanning and attacks, 4) Need careful service configuration. Private IPs: 1) Hidden behind NAT providing basic security, 2) Not directly accessible from internet, 3) Internal network structure concealed, 4) Still need internal security measures. Best practices: use private addressing internally, public only for internet-facing services, implement proper firewall rules, monitor for unauthorized public IP usage."
    },
    {
      question: "How should organizations plan their IP addressing strategy?",
      answer: "IP addressing strategy: 1) Use private addresses for internal networks, 2) Reserve public IPs for internet-facing services only, 3) Plan address allocation for growth and segmentation, 4) Implement hierarchical addressing for routing efficiency, 5) Document address assignments and policies, 6) Consider IPv6 for future expansion, 7) Use DHCP for dynamic assignment, 8) Implement proper network segmentation with VLANs, 9) Plan for disaster recovery and network changes."
    },
    {
      question: "What is APIPA and when is it used?",
      answer: "APIPA (Automatic Private IP Addressing): 1) Uses 169.254.0.0/16 range, 2) Automatically assigned when DHCP server unavailable, 3) Enables local communication without manual configuration, 4) Host selects random address and checks for conflicts, 5) Limited to local network segment (no routing), 6) Indicates DHCP configuration problem, 7) Common in Windows environments, 8) Should be temporary solution until proper DHCP restored."
    },
    {
      question: "How do cloud providers handle public and private IP addressing?",
      answer: "Cloud IP addressing: 1) Virtual Private Clouds (VPCs) use private addressing internally, 2) Elastic/floating IPs provide public connectivity, 3) NAT gateways enable private instances to access internet, 4) Load balancers use public IPs to distribute traffic to private instances, 5) Security groups control access based on IP ranges, 6) Private subnets for databases and internal services, 7) Public subnets for web servers and load balancers, 8) Cross-region connectivity through private networks."
    },
    {
      question: "What challenges arise from IPv4 address exhaustion and how are they addressed?",
      answer: "IPv4 exhaustion challenges: 1) No new public IPv4 addresses available from IANA, 2) Increased costs for existing IPv4 addresses, 3) More complex NAT configurations, 4) Carrier-grade NAT (CGN) implementation, 5) IPv6 migration pressure. Solutions: 1) IPv6 adoption for new deployments, 2) More efficient IPv4 usage, 3) Address sharing technologies, 4) Cloud migration reducing individual public IP needs, 5) NAT444 and dual-stack implementations, 6) IPv4 address trading markets."
    }
  ]
};