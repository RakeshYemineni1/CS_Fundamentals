export const enhancedSubnettingCIDR = {
  id: 'subnetting-cidr',
  title: 'Subnetting and CIDR',
  subtitle: 'Network Subdivision and Classless Addressing',
  summary: 'Subnetting divides networks into smaller segments for efficient addressing, while CIDR provides flexible, classless network allocation.',
  analogy: 'Like dividing a large building into floors and rooms - subnetting creates organized sections with specific purposes and sizes.',
  visualConcept: 'Picture a city planning system where large districts are divided into neighborhoods, blocks, and individual lots for efficient organization.',
  realWorldUse: 'Network segmentation, VLAN design, routing optimization, security zones, address conservation, ISP allocation, data center networks.',
  explanation: `Subnetting and CIDR Fundamentals:

Subnetting Concept:
Subnetting is the process of dividing a larger network into smaller, more manageable subnetworks (subnets). This provides better network organization, security, and efficient use of IP addresses.

Benefits of Subnetting:
1. Improved network performance (reduced broadcast domains)
2. Enhanced security (network segmentation)
3. Better network management and troubleshooting
4. Efficient IP address utilization
5. Reduced network congestion
6. Hierarchical network design

Subnet Mask:
- Defines network and host portions of IP address
- Uses contiguous 1s for network bits, 0s for host bits
- Can be written in dotted decimal or CIDR notation
- Example: 255.255.255.0 = /24

CIDR (Classless Inter-Domain Routing):
- Introduced in 1993 to replace classful addressing
- Uses variable-length subnet masks (VLSM)
- More efficient address allocation
- Reduces routing table size through aggregation
- Notation: network/prefix_length (e.g., 192.168.1.0/24)

Subnetting Process:
1. Determine number of subnets needed
2. Determine number of hosts per subnet
3. Calculate subnet mask
4. Identify subnet boundaries
5. Assign subnet addresses

Subnet Calculations:
- Subnets = 2^(borrowed bits)
- Hosts per subnet = 2^(host bits) - 2
- Subnet increment = 256 - subnet mask octet

VLSM (Variable Length Subnet Masking):
- Different subnet sizes within same network
- Efficient address utilization
- Hierarchical addressing structure
- Requires classless routing protocols

Route Aggregation/Summarization:
- Combines multiple routes into single advertisement
- Reduces routing table size
- Improves routing efficiency
- Requires careful address planning

IPv6 Subnetting:
- Uses /64 for host networks (standard)
- Subnet on nibble boundaries (4-bit increments)
- Abundant address space simplifies planning
- Hierarchical allocation structure`,

  keyPoints: [
    'Subnetting divides networks into smaller, manageable segments',
    'CIDR provides classless, flexible network addressing',
    'Subnet masks define network and host portions',
    'VLSM allows different subnet sizes in same network',
    'Subnetting improves security and performance',
    'Route aggregation reduces routing table size',
    'Binary math essential for subnet calculations',
    'IPv6 uses /64 as standard host network size',
    'Proper planning prevents address waste',
    'Hierarchical design enables scalable networks'
  ],

  codeExamples: [
    {
      title: "Comprehensive Subnetting Calculator",
      language: "python",
      code: `import ipaddress
import math
from typing import List, Dict, Tuple

class SubnettingCalculator:
    def __init__(self):
        self.classful_masks = {
            'A': 8,
            'B': 16,
            'C': 24
        }
    
    def get_network_class(self, ip_str: str) -> str:
        \"\"\"Determine the class of an IPv4 address\"\"\"
        try:
            ip = ipaddress.IPv4Address(ip_str)
            first_octet = int(str(ip).split('.')[0])
            
            if 1 <= first_octet <= 126:
                return 'A'
            elif 128 <= first_octet <= 191:
                return 'B'
            elif 192 <= first_octet <= 223:
                return 'C'
            else:
                return 'Special'
        except:
            return 'Invalid'
    
    def calculate_subnet_info(self, network_str: str) -> Dict:
        \"\"\"Calculate comprehensive subnet information\"\"\"
        try:
            network = ipaddress.IPv4Network(network_str, strict=False)
            
            # Basic network information
            info = {
                'network_address': str(network.network_address),
                'broadcast_address': str(network.broadcast_address),
                'netmask': str(network.netmask),
                'prefix_length': network.prefixlen,
                'num_addresses': network.num_addresses,
                'num_hosts': network.num_addresses - 2 if network.num_addresses > 2 else 0,
                'first_host': str(network.network_address + 1) if network.num_addresses > 2 else 'N/A',
                'last_host': str(network.broadcast_address - 1) if network.num_addresses > 2 else 'N/A',
                'network_class': self.get_network_class(str(network.network_address)),
                'is_private': network.is_private
            }
            
            # Subnet mask in binary
            mask_int = int(network.netmask)
            info['netmask_binary'] = format(mask_int, '032b')
            info['netmask_hex'] = f"0x{mask_int:08X}"
            
            # Network address in binary
            net_int = int(network.network_address)
            info['network_binary'] = format(net_int, '032b')
            
            # Calculate wildcard mask
            wildcard_int = (2**32 - 1) ^ mask_int
            wildcard = ipaddress.IPv4Address(wildcard_int)
            info['wildcard_mask'] = str(wildcard)
            
            return info
            
        except Exception as e:
            return {'error': str(e)}
    
    def subnet_network(self, network_str: str, num_subnets: int) -> List[Dict]:
        \"\"\"Divide network into specified number of subnets\"\"\"
        try:
            network = ipaddress.IPv4Network(network_str, strict=False)
            
            # Calculate required subnet bits
            subnet_bits = math.ceil(math.log2(num_subnets))
            new_prefix = network.prefixlen + subnet_bits
            
            if new_prefix > 30:  # Leave at least 2 host bits
                return [{'error': 'Too many subnets requested'}]
            
            # Generate subnets
            subnets = list(network.subnets(new_prefix=new_prefix))
            
            result = []
            for i, subnet in enumerate(subnets[:num_subnets]):
                subnet_info = {
                    'subnet_number': i + 1,
                    'network': str(subnet.network_address),
                    'broadcast': str(subnet.broadcast_address),
                    'netmask': str(subnet.netmask),
                    'prefix': f"/{subnet.prefixlen}",
                    'num_hosts': subnet.num_addresses - 2,
                    'first_host': str(subnet.network_address + 1),
                    'last_host': str(subnet.broadcast_address - 1),
                    'cidr_notation': str(subnet)
                }
                result.append(subnet_info)
            
            return result
            
        except Exception as e:
            return [{'error': str(e)}]
    
    def vlsm_subnetting(self, network_str: str, host_requirements: List[int]) -> List[Dict]:
        \"\"\"Perform VLSM subnetting based on host requirements\"\"\"
        try:
            network = ipaddress.IPv4Network(network_str, strict=False)
            
            # Sort requirements in descending order for efficient allocation
            sorted_reqs = sorted(enumerate(host_requirements), key=lambda x: x[1], reverse=True)
            
            available_networks = [network]
            allocated_subnets = []
            
            for original_index, hosts_needed in sorted_reqs:
                # Find smallest network that can accommodate the requirement
                best_network = None
                best_network_index = -1
                
                for i, available_net in enumerate(available_networks):
                    max_hosts = available_net.num_addresses - 2
                    if max_hosts >= hosts_needed:
                        if best_network is None or available_net.num_addresses < best_network.num_addresses:
                            best_network = available_net
                            best_network_index = i
                
                if best_network is None:
                    allocated_subnets.append({
                        'original_index': original_index,
                        'hosts_required': hosts_needed,
                        'error': 'Insufficient address space'
                    })
                    continue
                
                # Calculate required prefix length
                host_bits = math.ceil(math.log2(hosts_needed + 2))
                required_prefix = 32 - host_bits
                
                # Create subnet with required size
                if required_prefix <= best_network.prefixlen:
                    # Use the entire available network
                    allocated_subnet = best_network
                else:
                    # Create appropriately sized subnet
                    allocated_subnet = list(best_network.subnets(new_prefix=required_prefix))[0]
                
                # Add to allocated subnets
                allocated_subnets.append({
                    'original_index': original_index,
                    'hosts_required': hosts_needed,
                    'hosts_available': allocated_subnet.num_addresses - 2,
                    'network': str(allocated_subnet.network_address),
                    'broadcast': str(allocated_subnet.broadcast_address),
                    'netmask': str(allocated_subnet.netmask),
                    'prefix': f"/{allocated_subnet.prefixlen}",
                    'cidr_notation': str(allocated_subnet),
                    'efficiency': f"{(hosts_needed / (allocated_subnet.num_addresses - 2)) * 100:.1f}%"
                })
                
                # Remove allocated network and add remaining networks
                available_networks.pop(best_network_index)
                
                # Add remaining subnets back to available pool
                remaining_networks = []
                for subnet in best_network.subnets(new_prefix=required_prefix):
                    if subnet != allocated_subnet:
                        remaining_networks.append(subnet)
                
                available_networks.extend(remaining_networks)
                available_networks.sort(key=lambda x: x.num_addresses)
            
            # Sort results by original index
            allocated_subnets.sort(key=lambda x: x['original_index'])
            
            return allocated_subnets
            
        except Exception as e:
            return [{'error': str(e)}]
    
    def supernet_calculation(self, networks: List[str]) -> Dict:
        \"\"\"Calculate supernet (route aggregation) for given networks\"\"\"
        try:
            network_objects = [ipaddress.IPv4Network(net, strict=False) for net in networks]
            
            # Find the supernet that contains all networks
            supernet = ipaddress.collapse_addresses(network_objects)
            supernet_list = list(supernet)
            
            if len(supernet_list) == 1:
                result_network = supernet_list[0]
                
                return {
                    'supernet': str(result_network),
                    'supernet_mask': str(result_network.netmask),
                    'supernet_prefix': f"/{result_network.prefixlen}",
                    'address_space': result_network.num_addresses,
                    'efficiency': f"{(sum(net.num_addresses for net in network_objects) / result_network.num_addresses) * 100:.1f}%",
                    'input_networks': networks,
                    'aggregated': True
                }
            else:
                return {
                    'supernet': 'Cannot aggregate into single network',
                    'separate_networks': [str(net) for net in supernet_list],
                    'input_networks': networks,
                    'aggregated': False
                }
                
        except Exception as e:
            return {'error': str(e)}

class CIDRAnalyzer:
    def __init__(self):
        self.calculator = SubnettingCalculator()
    
    def analyze_cidr_block(self, cidr_str: str) -> Dict:
        \"\"\"Comprehensive CIDR block analysis\"\"\"
        try:
            network = ipaddress.IPv4Network(cidr_str, strict=False)
            
            analysis = {
                'cidr_notation': str(network),
                'network_info': self.calculator.calculate_subnet_info(cidr_str),
                'subnetting_options': self.get_subnetting_options(network),
                'addressing_efficiency': self.calculate_efficiency(network)
            }
            
            return analysis
            
        except Exception as e:
            return {'error': str(e)}
    
    def get_subnetting_options(self, network: ipaddress.IPv4Network) -> List[Dict]:
        \"\"\"Get various subnetting options for a network\"\"\"
        options = []
        
        max_subnet_bits = min(30 - network.prefixlen, 8)  # Limit to reasonable options
        
        for subnet_bits in range(1, max_subnet_bits + 1):
            new_prefix = network.prefixlen + subnet_bits
            num_subnets = 2 ** subnet_bits
            hosts_per_subnet = (2 ** (32 - new_prefix)) - 2
            
            options.append({
                'subnet_bits': subnet_bits,
                'new_prefix': f"/{new_prefix}",
                'num_subnets': num_subnets,
                'hosts_per_subnet': hosts_per_subnet,
                'total_hosts': num_subnets * hosts_per_subnet,
                'subnet_mask': str(ipaddress.IPv4Network(f"0.0.0.0/{new_prefix}").netmask)
            })
        
        return options
    
    def calculate_efficiency(self, network: ipaddress.IPv4Network) -> Dict:
        \"\"\"Calculate addressing efficiency metrics\"\"\"
        total_addresses = network.num_addresses
        usable_hosts = total_addresses - 2 if total_addresses > 2 else 0
        
        return {
            'total_addresses': total_addresses,
            'usable_hosts': usable_hosts,
            'network_overhead': 1,  # Network address
            'broadcast_overhead': 1 if total_addresses > 1 else 0,
            'efficiency_percentage': (usable_hosts / total_addresses * 100) if total_addresses > 0 else 0,
            'waste_percentage': ((total_addresses - usable_hosts) / total_addresses * 100) if total_addresses > 0 else 0
        }

class SubnettingDemo:
    def __init__(self):
        self.calculator = SubnettingCalculator()
        self.analyzer = CIDRAnalyzer()
    
    def demonstrate_subnetting(self):
        \"\"\"Demonstrate various subnetting scenarios\"\"\"
        print("=== Subnetting and CIDR Demonstration ===\\n")
        
        # Basic subnet calculation
        print("1. Basic Subnet Information:")
        network_info = self.calculator.calculate_subnet_info('192.168.1.0/24')
        print(f"Network: {network_info['network_address']}/{network_info['prefix_length']}")
        print(f"Hosts: {network_info['num_hosts']}")
        print(f"Range: {network_info['first_host']} - {network_info['last_host']}")
        
        # Equal-size subnetting
        print("\\n2. Equal-Size Subnetting (192.168.1.0/24 into 4 subnets):")
        subnets = self.calculator.subnet_network('192.168.1.0/24', 4)
        for subnet in subnets[:3]:  # Show first 3
            print(f"  Subnet {subnet['subnet_number']}: {subnet['cidr_notation']} ({subnet['num_hosts']} hosts)")
        
        # VLSM example
        print("\\n3. VLSM Subnetting (192.168.0.0/24):")
        host_requirements = [50, 25, 10, 5]  # Different subnet sizes
        vlsm_subnets = self.calculator.vlsm_subnetting('192.168.0.0/24', host_requirements)
        
        for i, subnet in enumerate(vlsm_subnets):
            if 'error' not in subnet:
                print(f"  Requirement {i+1}: {subnet['hosts_required']} hosts -> {subnet['cidr_notation']} ({subnet['efficiency']} efficient)")
        
        # Route aggregation
        print("\\n4. Route Aggregation:")
        networks_to_aggregate = ['192.168.0.0/24', '192.168.1.0/24', '192.168.2.0/24', '192.168.3.0/24']
        supernet = self.calculator.supernet_calculation(networks_to_aggregate)
        
        if 'supernet' in supernet and supernet['aggregated']:
            print(f"  Individual networks: {len(networks_to_aggregate)} routes")
            print(f"  Aggregated to: {supernet['supernet']} (1 route)")
            print(f"  Efficiency: {supernet['efficiency']}")
        
        # CIDR analysis
        print("\\n5. CIDR Block Analysis (10.0.0.0/16):")
        analysis = self.analyzer.analyze_cidr_block('10.0.0.0/16')
        
        if 'error' not in analysis:
            efficiency = analysis['addressing_efficiency']
            print(f"  Total addresses: {efficiency['total_addresses']:,}")
            print(f"  Usable hosts: {efficiency['usable_hosts']:,}")
            print(f"  Efficiency: {efficiency['efficiency_percentage']:.1f}%")
            
            print("\\n  Subnetting options:")
            for option in analysis['subnetting_options'][:3]:  # Show first 3 options
                print(f"    {option['new_prefix']}: {option['num_subnets']} subnets, {option['hosts_per_subnet']} hosts each")

if __name__ == "__main__":
    demo = SubnettingDemo()
    demo.demonstrate_subnetting()`
    }
  ],

  resources: [
    { type: 'article', title: 'Subnetting Tutorial - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/subnetting-in-computer-network/', description: 'Complete subnetting guide with examples' },
    { type: 'video', title: 'Subnetting Made Easy - YouTube', url: 'https://www.youtube.com/watch?v=BWZ-MHIhqjM', description: 'Step-by-step subnetting tutorial' },
    { type: 'article', title: 'CIDR Notation - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/classless-inter-domain-routing-cidr/', description: 'CIDR concepts and notation explained' },
    { type: 'article', title: 'VLSM Tutorial - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/variable-length-subnet-mask-vlsm/', description: 'Variable Length Subnet Masking guide' },
    { type: 'video', title: 'VLSM Explained - YouTube', url: 'https://www.youtube.com/watch?v=--0UWJwyOzs', description: 'Variable Length Subnet Masking tutorial' },
    { type: 'tool', title: 'Subnet Calculator', url: 'https://www.calculator.net/ip-subnet-calculator.html', description: 'Online subnet calculator tool' },
    { type: 'article', title: 'Route Aggregation', url: 'https://www.cisco.com/c/en/us/support/docs/ip/border-gateway-protocol-bgp/5441-aggregation.html', description: 'Route summarization and aggregation' },
    { type: 'video', title: 'Binary Subnetting - YouTube', url: 'https://www.youtube.com/watch?v=tcae4TSSMz8', description: 'Binary method for subnetting' },
    { type: 'tool', title: 'VLSM Calculator', url: 'https://www.vlsm-calc.net/', description: 'Variable Length Subnet Mask calculator' },
    { type: 'article', title: 'IPv6 Subnetting', url: 'https://www.geeksforgeeks.org/ipv6-subnetting/', description: 'IPv6 subnetting concepts and practices' }
  ],

  questions: [
    {
      question: "What is subnetting and why is it important in network design?",
      answer: "Subnetting divides a large network into smaller subnetworks for better organization and efficiency. Benefits: 1) Improved performance - reduces broadcast domains, 2) Enhanced security - network segmentation, 3) Better management - organized address allocation, 4) Efficient addressing - reduces waste, 5) Scalability - hierarchical design, 6) Fault isolation - problems contained to segments. Essential for modern network design and management."
    },
    {
      question: "How do you calculate the number of subnets and hosts in subnetting?",
      answer: "Subnetting calculations: 1) Subnets = 2^(borrowed bits) - number of subnet bits taken from host portion, 2) Hosts per subnet = 2^(remaining host bits) - 2 (subtract network and broadcast), 3) Subnet increment = 256 - subnet mask value in relevant octet. Example: /26 from /24 borrows 2 bits: 2^2 = 4 subnets, 2^6 - 2 = 62 hosts per subnet. Binary understanding essential for accurate calculations."
    },
    {
      question: "What is CIDR and how does it improve upon classful addressing?",
      answer: "CIDR (Classless Inter-Domain Routing) replaces fixed class boundaries with variable-length subnet masks. Improvements: 1) Flexible allocation - any prefix length, not just /8, /16, /24, 2) Reduced waste - right-sized allocations, 3) Route aggregation - multiple networks summarized into single route, 4) Smaller routing tables - improved scalability, 5) Better address utilization - eliminates class restrictions. Uses /prefix notation (e.g., 192.168.1.0/24) instead of class-based allocation."
    },
    {
      question: "What is VLSM and when would you use it?",
      answer: "VLSM (Variable Length Subnet Masking) allows different subnet sizes within the same network. Use cases: 1) Efficient addressing - match subnet size to actual needs, 2) Point-to-point links - /30 subnets (2 hosts), 3) Different department sizes - large subnets for users, small for servers, 4) Hierarchical design - different levels need different capacities. Requires classless routing protocols (OSPF, EIGRP, BGP). Maximizes address efficiency and supports complex network topologies."
    },
    {
      question: "How does route aggregation (summarization) work and what are its benefits?",
      answer: "Route aggregation combines multiple network routes into single summary route. Process: 1) Find common network bits across routes, 2) Create summary with longest common prefix, 3) Advertise summary instead of individual routes. Benefits: 1) Smaller routing tables - improved performance, 2) Reduced bandwidth - fewer routing updates, 3) Faster convergence - less processing, 4) Stability - local changes don't affect summary. Requires careful address planning and hierarchical allocation."
    },
    {
      question: "What are the key differences between classful and classless addressing?",
      answer: "Classful vs Classless: Classful: 1) Fixed boundaries (/8, /16, /24), 2) Wasteful allocation, 3) Simple but inflexible, 4) Class-based routing protocols. Classless (CIDR): 1) Variable prefix lengths, 2) Efficient allocation, 3) Route aggregation support, 4) Requires subnet mask in routing. Classless addressing enables better address utilization, supports VLSM, allows supernetting, and provides foundation for modern internet routing."
    },
    {
      question: "How do you design a subnetting scheme for an organization?",
      answer: "Subnetting design process: 1) Assess requirements - number of locations, users per location, growth projections, 2) Choose address space - private ranges (10.x, 172.16-31.x, 192.168.x), 3) Plan hierarchy - geographic, departmental, functional, 4) Allocate addresses - largest subnets first (VLSM), 5) Document scheme - IP plan, naming conventions, 6) Consider future growth - leave room for expansion, 7) Implement security zones - separate user, server, management networks."
    },
    {
      question: "What tools and techniques help with subnet calculations?",
      answer: "Subnetting tools and techniques: 1) Binary method - convert to binary, identify network/host bits, 2) Subnet calculators - online tools for quick calculations, 3) Cheat sheets - common subnet masks and their properties, 4) Magic number method - 256 minus subnet mask octet, 5) Powers of 2 - memorize 2^n values, 6) Network simulation tools - test designs, 7) Spreadsheets - document and validate plans. Practice with different scenarios improves speed and accuracy."
    },
    {
      question: "How does IPv6 subnetting differ from IPv4?",
      answer: "IPv6 subnetting differences: 1) Standard /64 for host networks - abundant address space, 2) Nibble boundaries - subnet on 4-bit increments for readability, 3) No broadcast - uses multicast instead, 4) Hierarchical allocation - /48 sites, /64 subnets, 5) Simplified planning - address abundance reduces efficiency concerns, 6) EUI-64 addressing - automatic interface ID generation, 7) Multiple addresses per interface - link-local, global unicast, etc. Focus shifts from conservation to organization."
    },
    {
      question: "What are common subnetting mistakes and how to avoid them?",
      answer: "Common subnetting mistakes: 1) Overlapping subnets - careful planning and documentation, 2) Insufficient host addresses - plan for growth, 3) Inefficient allocation - use VLSM for right-sizing, 4) Poor documentation - maintain accurate IP plans, 5) Ignoring routing protocols - ensure protocol supports design, 6) Security oversight - separate sensitive networks, 7) No standardization - consistent naming and allocation schemes. Use tools, double-check calculations, and validate designs before implementation."
    }
  ]
};