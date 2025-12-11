export const enhancedEthernet = {
  id: 'ethernet-protocol',
  title: 'Ethernet',
  subtitle: 'IEEE 802.3 Standard and Local Area Network Technology',
  summary: 'Ethernet is the dominant LAN technology using CSMA/CD for media access, frame-based communication, and various physical implementations.',
  analogy: 'Like a polite conversation system - everyone listens before speaking (carrier sense), stops if collision detected, and waits random time before retrying.',
  visualConcept: 'Picture Ethernet as a conference room where participants check if someone is speaking before talking, and pause if multiple people speak simultaneously.',
  realWorldUse: 'Local area networks, enterprise networking, data centers, home networks, industrial automation, IoT connectivity, backbone infrastructure.',
  explanation: `Ethernet Technology and Standards:

Ethernet Overview:
Ethernet is a family of wired computer networking technologies commonly used in local area networks (LANs). Defined by IEEE 802.3 standards, it has evolved from 10 Mbps shared media to 400+ Gbps switched networks.

Historical Evolution:
- 1973: Original Ethernet concept by Bob Metcalfe at Xerox
- 1980: DIX Ethernet (Digital, Intel, Xerox) standard
- 1985: IEEE 802.3 standardization
- 1990s: Fast Ethernet (100 Mbps)
- 2000s: Gigabit Ethernet and beyond

CSMA/CD (Carrier Sense Multiple Access with Collision Detection):

Original Ethernet Media Access Method:
1. Carrier Sense: Listen before transmitting
2. Multiple Access: Shared medium among multiple stations
3. Collision Detection: Detect simultaneous transmissions
4. Backoff Algorithm: Wait random time after collision

CSMA/CD Process:
1. Station wants to transmit
2. Listens to medium (carrier sense)
3. If idle, begins transmission
4. Monitors for collisions during transmission
5. If collision detected, sends jam signal
6. Waits random backoff time (exponential backoff)
7. Retries transmission

Ethernet Frame Structure (IEEE 802.3):

Frame Fields:
- Preamble (7 bytes): Synchronization pattern (10101010...)
- Start Frame Delimiter (1 byte): 10101011 (marks frame start)
- Destination MAC Address (6 bytes): Target device address
- Source MAC Address (6 bytes): Sending device address
- Length/Type (2 bytes): Frame length or EtherType
- Data/Payload (46-1500 bytes): Upper layer data
- Frame Check Sequence (4 bytes): CRC error detection

Minimum Frame Size: 64 bytes (for collision detection)
Maximum Frame Size: 1518 bytes (standard), 9000+ bytes (jumbo frames)

Ethernet Standards and Speeds:

10BASE-T (10 Mbps):
- Twisted pair copper
- 100-meter maximum distance
- Hub-based shared collision domain

100BASE-TX (Fast Ethernet):
- 100 Mbps over Category 5 cable
- Full-duplex eliminates collisions
- Switch-based networks

1000BASE-T (Gigabit Ethernet):
- 1 Gbps over Category 5e/6 cable
- 4-pair transmission
- Auto-negotiation capabilities

10GBASE-T and Beyond:
- 10 Gbps, 25 Gbps, 40 Gbps, 100 Gbps, 400 Gbps
- Fiber optic and high-grade copper
- Data center and backbone applications

Modern Ethernet Features:

Full-Duplex Operation:
- Simultaneous send and receive
- Eliminates collision domain concept
- Doubles effective bandwidth

Auto-Negotiation:
- Automatic speed and duplex detection
- Backward compatibility
- Optimal configuration selection

Power over Ethernet (PoE):
- Power delivery over data cables
- PoE (15.4W), PoE+ (25.5W), PoE++ (60-100W)
- Powers IP phones, cameras, access points

Quality of Service (QoS):
- IEEE 802.1p priority tagging
- Traffic classification and prioritization
- Bandwidth management

VLAN Support:
- IEEE 802.1Q VLAN tagging
- Logical network segmentation
- Broadcast domain isolation

Link Aggregation:
- IEEE 802.3ad (LACP)
- Multiple links as single logical connection
- Increased bandwidth and redundancy

Energy Efficient Ethernet:
- IEEE 802.3az standard
- Power saving during low utilization
- Green networking initiatives

Ethernet in Modern Networks:
- Switched infrastructure (no collisions)
- Full-duplex operation standard
- Hierarchical network design
- Integration with wireless (WiFi bridging)
- Software-defined networking compatibility`,

  keyPoints: [
    'Ethernet uses CSMA/CD for media access in shared networks',
    'Frame structure includes MAC addresses and error detection',
    'Evolved from 10 Mbps shared to multi-gigabit switched networks',
    'Full-duplex operation eliminates collision domains',
    'Auto-negotiation enables automatic speed/duplex configuration',
    'Power over Ethernet delivers power through data cables',
    'VLANs provide logical network segmentation',
    'Modern Ethernet supports QoS and traffic prioritization',
    'Link aggregation combines multiple connections',
    'Dominant LAN technology with continuous evolution'
  ],

  codeExamples: [
    {
      title: "Ethernet Frame Processing and Network Simulation",
      language: "python",
      code: `import struct
import random
import time
import threading
from collections import defaultdict, deque
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum
import binascii

class EthernetStandard(Enum):
    ETH_10BASE_T = "10BASE-T"
    ETH_100BASE_TX = "100BASE-TX"
    ETH_1000BASE_T = "1000BASE-T"
    ETH_10GBASE_T = "10GBASE-T"

class DuplexMode(Enum):
    HALF = "Half-Duplex"
    FULL = "Full-Duplex"

@dataclass
class EthernetFrame:
    destination_mac: str
    source_mac: str
    ethertype: int = 0x0800  # IPv4 by default
    payload: bytes = b''
    frame_check_sequence: int = 0
    timestamp: float = field(default_factory=time.time)
    
    def __post_init__(self):
        if not self.frame_check_sequence:
            self.frame_check_sequence = self.calculate_fcs()
    
    def to_bytes(self) -> bytes:
        \"\"\"Convert frame to bytes\"\"\"
        # Convert MAC addresses to bytes
        dst_mac = bytes.fromhex(self.destination_mac.replace(':', ''))
        src_mac = bytes.fromhex(self.source_mac.replace(':', ''))
        
        # Build frame
        frame = bytearray()
        
        # Preamble and SFD (normally added by physical layer)
        preamble = b'\\xAA' * 7 + b'\\xAB'  # 7 bytes preamble + 1 byte SFD
        
        # Ethernet header
        frame.extend(dst_mac)  # 6 bytes
        frame.extend(src_mac)  # 6 bytes
        frame.extend(struct.pack('!H', self.ethertype))  # 2 bytes
        
        # Payload (pad if necessary)
        payload = self.payload
        if len(payload) < 46:  # Minimum payload size
            payload += b'\\x00' * (46 - len(payload))
        
        frame.extend(payload)
        
        # Frame Check Sequence
        frame.extend(struct.pack('!I', self.frame_check_sequence))
        
        return preamble + bytes(frame)
    
    def calculate_fcs(self) -> int:
        \"\"\"Calculate Frame Check Sequence (CRC-32)\"\"\"
        # Simplified CRC calculation (in practice, use proper CRC-32)
        data = (self.destination_mac + self.source_mac + 
                str(self.ethertype) + str(len(self.payload))).encode()
        return binascii.crc32(data) & 0xFFFFFFFF
    
    def is_valid(self) -> bool:
        \"\"\"Validate frame integrity\"\"\"
        calculated_fcs = self.calculate_fcs()
        return calculated_fcs == self.frame_check_sequence
    
    @property
    def frame_size(self) -> int:
        \"\"\"Get total frame size in bytes\"\"\"
        return len(self.to_bytes())
    
    @property
    def is_broadcast(self) -> bool:
        \"\"\"Check if frame is broadcast\"\"\"
        return self.destination_mac.upper() == 'FF:FF:FF:FF:FF:FF'
    
    @property
    def is_multicast(self) -> bool:
        \"\"\"Check if frame is multicast\"\"\"
        first_byte = int(self.destination_mac.split(':')[0], 16)
        return bool(first_byte & 0x01) and not self.is_broadcast

class CSMAController:
    \"\"\"CSMA/CD Controller for shared Ethernet\"\"\"
    
    def __init__(self, station_id: str):
        self.station_id = station_id
        self.collision_count = 0
        self.max_retries = 16
        self.slot_time = 0.000512  # 512 bit times for 10 Mbps
        
        # Statistics
        self.stats = {
            'frames_sent': 0,
            'collisions_detected': 0,
            'successful_transmissions': 0,
            'backoff_events': 0,
            'carrier_sense_busy': 0
        }
    
    def transmit_frame(self, frame: EthernetFrame, medium_busy_callback) -> bool:
        \"\"\"Attempt to transmit frame using CSMA/CD\"\"\"
        self.collision_count = 0
        
        while self.collision_count < self.max_retries:
            # Carrier Sense
            if medium_busy_callback():
                self.stats['carrier_sense_busy'] += 1
                self.wait_for_idle(medium_busy_callback)
            
            # Attempt transmission
            if self.attempt_transmission(frame):
                self.stats['successful_transmissions'] += 1
                self.stats['frames_sent'] += 1
                return True
            else:
                # Collision detected
                self.stats['collisions_detected'] += 1
                self.collision_count += 1
                
                if self.collision_count < self.max_retries:
                    self.exponential_backoff()
                    self.stats['backoff_events'] += 1
        
        # Max retries exceeded
        print(f"Station {self.station_id}: Frame transmission failed after {self.max_retries} attempts")
        return False
    
    def wait_for_idle(self, medium_busy_callback):
        \"\"\"Wait for medium to become idle\"\"\"
        while medium_busy_callback():
            time.sleep(self.slot_time / 10)  # Check frequently
    
    def attempt_transmission(self, frame: EthernetFrame) -> bool:
        \"\"\"Attempt frame transmission with collision detection\"\"\"
        print(f"Station {self.station_id}: Transmitting frame to {frame.destination_mac}")
        
        # Simulate transmission time
        transmission_time = frame.frame_size * 8 / 10_000_000  # 10 Mbps
        
        # Check for collision during transmission (simplified)
        collision_probability = 0.1 if self.collision_count == 0 else 0.05
        
        time.sleep(transmission_time / 2)  # Transmit first half
        
        if random.random() < collision_probability:
            print(f"Station {self.station_id}: COLLISION detected!")
            self.send_jam_signal()
            return False
        
        time.sleep(transmission_time / 2)  # Transmit second half
        print(f"Station {self.station_id}: Frame transmitted successfully")
        return True
    
    def send_jam_signal(self):
        \"\"\"Send jam signal to notify other stations of collision\"\"\"
        print(f"Station {self.station_id}: Sending jam signal")
        time.sleep(32 * 8 / 10_000_000)  # 32-byte jam signal at 10 Mbps
    
    def exponential_backoff(self):
        \"\"\"Implement exponential backoff algorithm\"\"\"
        # Calculate backoff window (2^collision_count - 1)
        max_slots = min(2 ** self.collision_count, 1024) - 1
        backoff_slots = random.randint(0, max_slots)
        backoff_time = backoff_slots * self.slot_time
        
        print(f"Station {self.station_id}: Backing off for {backoff_slots} slots ({backoff_time:.6f}s)")
        time.sleep(backoff_time)
    
    def print_statistics(self):
        \"\"\"Print CSMA/CD statistics\"\"\"
        print(f"\\nCSMA/CD Statistics for Station {self.station_id}:")
        for key, value in self.stats.items():
            print(f"  {key.replace('_', ' ').title()}: {value}")

class EthernetInterface:
    \"\"\"Ethernet Network Interface\"\"\"
    
    def __init__(self, mac_address: str, standard: EthernetStandard = EthernetStandard.ETH_100BASE_TX):
        self.mac_address = mac_address
        self.standard = standard
        self.duplex_mode = DuplexMode.FULL if standard != EthernetStandard.ETH_10BASE_T else DuplexMode.HALF
        self.link_speed = self.get_link_speed()
        self.auto_negotiation = True
        self.link_status = True
        
        # Buffers
        self.tx_buffer = deque(maxlen=1000)
        self.rx_buffer = deque(maxlen=1000)
        
        # Statistics
        self.stats = {
            'frames_transmitted': 0,
            'frames_received': 0,
            'bytes_transmitted': 0,
            'bytes_received': 0,
            'transmission_errors': 0,
            'reception_errors': 0,
            'collisions': 0,
            'late_collisions': 0,
            'crc_errors': 0,
            'alignment_errors': 0
        }
        
        # CSMA/CD controller for half-duplex
        if self.duplex_mode == DuplexMode.HALF:
            self.csma_controller = CSMAController(mac_address)
    
    def get_link_speed(self) -> int:
        \"\"\"Get link speed in Mbps\"\"\"
        speed_map = {
            EthernetStandard.ETH_10BASE_T: 10,
            EthernetStandard.ETH_100BASE_TX: 100,
            EthernetStandard.ETH_1000BASE_T: 1000,
            EthernetStandard.ETH_10GBASE_T: 10000
        }
        return speed_map[self.standard]
    
    def auto_negotiate(self, peer_capabilities: Dict) -> Dict:
        \"\"\"Perform auto-negotiation with peer\"\"\"
        if not self.auto_negotiation:
            return {
                'speed': self.link_speed,
                'duplex': self.duplex_mode.value,
                'flow_control': False
            }
        
        # Negotiate highest common speed and full-duplex if possible
        our_speeds = [self.link_speed]
        peer_speeds = peer_capabilities.get('speeds', [100])
        
        common_speed = max(set(our_speeds) & set(peer_speeds))
        negotiated_duplex = DuplexMode.FULL if common_speed >= 100 else DuplexMode.HALF
        
        result = {
            'speed': common_speed,
            'duplex': negotiated_duplex.value,
            'flow_control': peer_capabilities.get('flow_control', False)
        }
        
        print(f"Interface {self.mac_address}: Auto-negotiated {common_speed} Mbps {negotiated_duplex.value}")
        return result
    
    def transmit_frame(self, frame: EthernetFrame) -> bool:
        \"\"\"Transmit Ethernet frame\"\"\"
        if not self.link_status:
            print(f"Interface {self.mac_address}: Link down, cannot transmit")
            return False
        
        # Validate frame
        if not frame.is_valid():
            self.stats['transmission_errors'] += 1
            return False
        
        # Set source MAC if not set
        if not frame.source_mac:
            frame.source_mac = self.mac_address
        
        # Add to transmit buffer
        self.tx_buffer.append(frame)
        
        # Process transmission
        return self.process_transmission(frame)
    
    def process_transmission(self, frame: EthernetFrame) -> bool:
        \"\"\"Process frame transmission\"\"\"
        if self.duplex_mode == DuplexMode.HALF:
            # Use CSMA/CD for half-duplex
            success = self.csma_controller.transmit_frame(frame, self.is_medium_busy)
        else:
            # Full-duplex transmission (no collisions)
            success = self.full_duplex_transmit(frame)
        
        if success:
            self.stats['frames_transmitted'] += 1
            self.stats['bytes_transmitted'] += frame.frame_size
        else:
            self.stats['transmission_errors'] += 1
        
        return success
    
    def full_duplex_transmit(self, frame: EthernetFrame) -> bool:
        \"\"\"Full-duplex transmission (no collision detection needed)\"\"\"
        print(f"Interface {self.mac_address}: Transmitting frame (full-duplex)")
        
        # Simulate transmission delay
        transmission_time = frame.frame_size * 8 / (self.link_speed * 1_000_000)
        time.sleep(transmission_time)
        
        return True
    
    def is_medium_busy(self) -> bool:
        \"\"\"Check if medium is busy (for CSMA/CD)\"\"\"
        # Simplified: random chance of medium being busy
        return random.random() < 0.2
    
    def receive_frame(self, frame: EthernetFrame) -> bool:
        \"\"\"Receive Ethernet frame\"\"\"
        if not self.link_status:
            return False
        
        # Check if frame is for this interface
        if (frame.destination_mac.upper() != self.mac_address.upper() and
            not frame.is_broadcast and not frame.is_multicast):
            return False  # Not for us
        
        # Validate frame
        if not frame.is_valid():
            self.stats['crc_errors'] += 1
            self.stats['reception_errors'] += 1
            return False
        
        # Add to receive buffer
        self.rx_buffer.append(frame)
        
        self.stats['frames_received'] += 1
        self.stats['bytes_received'] += frame.frame_size
        
        print(f"Interface {self.mac_address}: Received frame from {frame.source_mac}")
        return True
    
    def get_interface_statistics(self) -> Dict:
        \"\"\"Get interface statistics\"\"\"
        stats = self.stats.copy()
        stats.update({
            'mac_address': self.mac_address,
            'standard': self.standard.value,
            'link_speed_mbps': self.link_speed,
            'duplex_mode': self.duplex_mode.value,
            'link_status': 'Up' if self.link_status else 'Down',
            'tx_buffer_size': len(self.tx_buffer),
            'rx_buffer_size': len(self.rx_buffer)
        })
        return stats
    
    def print_statistics(self):
        \"\"\"Print interface statistics\"\"\"
        print(f"\\nEthernet Interface {self.mac_address} Statistics:")
        stats = self.get_interface_statistics()
        
        print(f"  Standard: {stats['standard']}")
        print(f"  Speed: {stats['link_speed_mbps']} Mbps")
        print(f"  Duplex: {stats['duplex_mode']}")
        print(f"  Link Status: {stats['link_status']}")
        print(f"  Frames TX: {stats['frames_transmitted']}")
        print(f"  Frames RX: {stats['frames_received']}")
        print(f"  Bytes TX: {stats['bytes_transmitted']}")
        print(f"  Bytes RX: {stats['bytes_received']}")
        print(f"  TX Errors: {stats['transmission_errors']}")
        print(f"  RX Errors: {stats['reception_errors']}")
        print(f"  CRC Errors: {stats['crc_errors']}")

class EthernetSwitch:
    \"\"\"Simple Ethernet Switch\"\"\"
    
    def __init__(self, switch_id: str, num_ports: int = 24):
        self.switch_id = switch_id
        self.ports: Dict[int, EthernetInterface] = {}
        self.mac_table: Dict[str, int] = {}  # MAC -> port
        self.vlan_table: Dict[int, Set[int]] = defaultdict(set)  # VLAN -> ports
        
        # Create ports
        for port_num in range(1, num_ports + 1):
            mac_addr = f"00:50:56:00:{port_num:02X}:00"
            self.ports[port_num] = EthernetInterface(mac_addr, EthernetStandard.ETH_1000BASE_T)
            self.vlan_table[1].add(port_num)  # Default VLAN
    
    def connect_device(self, port: int, device_mac: str):
        \"\"\"Connect device to switch port\"\"\"
        if port in self.ports:
            print(f"Switch {self.switch_id}: Device {device_mac} connected to port {port}")
            return True
        return False
    
    def learn_mac(self, mac_address: str, port: int):
        \"\"\"Learn MAC address on port\"\"\"
        if mac_address in self.mac_table and self.mac_table[mac_address] != port:
            print(f"Switch {self.switch_id}: MAC {mac_address} moved from port {self.mac_table[mac_address]} to {port}")
        
        self.mac_table[mac_address] = port
    
    def forward_frame(self, frame: EthernetFrame, input_port: int):
        \"\"\"Forward frame based on destination MAC\"\"\"
        # Learn source MAC
        self.learn_mac(frame.source_mac, input_port)
        
        # Determine output port(s)
        if frame.is_broadcast or frame.destination_mac not in self.mac_table:
            # Flood to all ports except input port
            self.flood_frame(frame, input_port)
        else:
            # Forward to specific port
            output_port = self.mac_table[frame.destination_mac]
            if output_port != input_port:
                self.send_frame_to_port(frame, output_port)
    
    def flood_frame(self, frame: EthernetFrame, input_port: int):
        \"\"\"Flood frame to all ports except input port\"\"\"
        for port_num in self.ports:
            if port_num != input_port:
                self.send_frame_to_port(frame, port_num)
    
    def send_frame_to_port(self, frame: EthernetFrame, port: int):
        \"\"\"Send frame to specific port\"\"\"
        if port in self.ports:
            interface = self.ports[port]
            interface.receive_frame(frame)
    
    def print_mac_table(self):
        \"\"\"Print MAC address table\"\"\"
        print(f"\\nSwitch {self.switch_id} MAC Address Table:")
        print("MAC Address       | Port")
        print("-" * 25)
        
        for mac in sorted(self.mac_table.keys()):
            port = self.mac_table[mac]
            print(f"{mac:17} | {port:4}")

class EthernetDemo:
    def __init__(self):
        self.interfaces: List[EthernetInterface] = []
        self.switch = EthernetSwitch("SW1", 8)
    
    def demonstrate_ethernet(self):
        \"\"\"Demonstrate Ethernet functionality\"\"\"
        print("=== Ethernet Protocol Demonstration ===\\n")
        
        # Create network interfaces
        print("1. Creating Ethernet Interfaces:")
        
        # Different Ethernet standards
        interfaces_config = [
            ("00:1A:2B:3C:4D:01", EthernetStandard.ETH_100BASE_TX),
            ("00:1A:2B:3C:4D:02", EthernetStandard.ETH_1000BASE_T),
            ("00:1A:2B:3C:4D:03", EthernetStandard.ETH_10GBASE_T)
        ]
        
        for mac, standard in interfaces_config:
            interface = EthernetInterface(mac, standard)
            self.interfaces.append(interface)
            print(f"  Created {standard.value} interface: {mac}")
        
        # Auto-negotiation demonstration
        print("\\n2. Auto-Negotiation:")
        peer_caps = {'speeds': [100, 1000], 'flow_control': True}
        result = self.interfaces[0].auto_negotiate(peer_caps)
        print(f"  Negotiation result: {result}")
        
        # Frame creation and transmission
        print("\\n3. Frame Transmission:")
        
        # Create test frame
        test_frame = EthernetFrame(
            destination_mac="00:1A:2B:3C:4D:02",
            source_mac="00:1A:2B:3C:4D:01",
            ethertype=0x0800,  # IPv4
            payload=b"Hello Ethernet World!" + b"\\x00" * 25  # Pad to minimum size
        )
        
        print(f"  Frame size: {test_frame.frame_size} bytes")
        print(f"  Frame valid: {test_frame.is_valid()}")
        
        # Transmit frame
        success = self.interfaces[0].transmit_frame(test_frame)
        print(f"  Transmission successful: {success}")
        
        # Receive frame on destination interface
        self.interfaces[1].receive_frame(test_frame)
        
        # Switch demonstration
        print("\\n4. Switch Operation:")
        
        # Connect devices to switch
        for i, interface in enumerate(self.interfaces[:3]):
            port = i + 1
            self.switch.connect_device(port, interface.mac_address)
        
        # Simulate frame forwarding through switch
        switch_frame = EthernetFrame(
            destination_mac="00:1A:2B:3C:4D:03",
            source_mac="00:1A:2B:3C:4D:01",
            payload=b"Switch forwarding test" + b"\\x00" * 24
        )
        
        self.switch.forward_frame(switch_frame, 1)
        self.switch.print_mac_table()
        
        # CSMA/CD demonstration (half-duplex)
        print("\\n5. CSMA/CD Demonstration:")
        
        # Create half-duplex interface
        half_duplex_if = EthernetInterface("00:AA:BB:CC:DD:EE", EthernetStandard.ETH_10BASE_T)
        half_duplex_if.duplex_mode = DuplexMode.HALF
        half_duplex_if.csma_controller = CSMAController("00:AA:BB:CC:DD:EE")
        
        # Simulate multiple transmission attempts
        for i in range(3):
            csma_frame = EthernetFrame(
                destination_mac="FF:FF:FF:FF:FF:FF",  # Broadcast
                source_mac="00:AA:BB:CC:DD:EE",
                payload=f"CSMA/CD test {i}".encode() + b"\\x00" * 30
            )
            
            half_duplex_if.transmit_frame(csma_frame)
            time.sleep(0.1)
        
        # Print statistics
        print("\\n6. Interface Statistics:")
        for i, interface in enumerate(self.interfaces):
            print(f"\\nInterface {i+1}:")
            interface.print_statistics()
        
        if hasattr(half_duplex_if, 'csma_controller'):
            half_duplex_if.csma_controller.print_statistics()

if __name__ == "__main__":
    demo = EthernetDemo()
    demo.demonstrate_ethernet()`
    }
  ],

  resources: [
    { type: 'article', title: 'Ethernet Protocol - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/ethernet-frame-format/', description: 'Ethernet frame format and protocol details' },
    { type: 'video', title: 'Ethernet Explained - YouTube', url: 'https://www.youtube.com/watch?v=5u52wbqBgEY', description: 'Visual explanation of Ethernet technology' },
    { type: 'article', title: 'CSMA/CD Protocol - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/collision-detection-csmacd/', description: 'CSMA/CD collision detection mechanism' },
    { type: 'article', title: 'IEEE 802.3 Standard', url: 'https://standards.ieee.org/standard/802_3-2018.html', description: 'Official Ethernet standard specification' },
    { type: 'video', title: 'Ethernet Evolution - YouTube', url: 'https://www.youtube.com/watch?v=HLziLmaYsO0', description: 'Evolution of Ethernet from 10 Mbps to multi-gigabit' },
    { type: 'article', title: 'Power over Ethernet - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/power-over-ethernet-poe/', description: 'PoE technology and applications' },
    { type: 'article', title: 'Ethernet Auto-Negotiation', url: 'https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-83.html', description: 'Auto-negotiation process and troubleshooting' },
    { type: 'video', title: 'VLAN Configuration - YouTube', url: 'https://www.youtube.com/watch?v=jC6MJTh9fRE', description: 'Virtual LAN configuration on Ethernet switches' },
    { type: 'tool', title: 'Wireshark Ethernet Analysis', url: 'https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowStreamSection.html', description: 'Analyzing Ethernet frames with Wireshark' },
    { type: 'article', title: 'Ethernet Troubleshooting', url: 'https://www.geeksforgeeks.org/network-troubleshooting-tools/', description: 'Tools and techniques for Ethernet troubleshooting' }
  ],

  questions: [
    {
      question: "What is Ethernet and how has it evolved over time?",
      answer: "Ethernet is a family of wired LAN technologies defined by IEEE 802.3 standards. Evolution: 1) 1973 - Original concept by Bob Metcalfe, 2) 1980s - 10 Mbps shared coaxial cable, 3) 1990s - Fast Ethernet (100 Mbps) with twisted pair, 4) 2000s - Gigabit Ethernet and beyond, 5) Modern - Multi-gigabit speeds with advanced features. Key changes: shared to switched media, half to full-duplex, copper to fiber options, addition of PoE and QoS capabilities."
    },
    {
      question: "Explain the CSMA/CD protocol and why it's no longer commonly used.",
      answer: "CSMA/CD (Carrier Sense Multiple Access with Collision Detection): 1) Carrier Sense - listen before transmitting, 2) Multiple Access - shared medium, 3) Collision Detection - detect simultaneous transmissions, 4) Exponential backoff after collisions. No longer common because: 1) Full-duplex eliminates collisions, 2) Switched networks replace shared hubs, 3) Better performance with dedicated bandwidth per port, 4) Modern Ethernet operates collision-free. Still relevant for understanding Ethernet fundamentals."
    },
    {
      question: "Describe the structure of an Ethernet frame.",
      answer: "Ethernet frame structure (IEEE 802.3): 1) Preamble (7 bytes) - synchronization pattern, 2) Start Frame Delimiter (1 byte) - frame boundary, 3) Destination MAC (6 bytes) - target address, 4) Source MAC (6 bytes) - sender address, 5) Length/Type (2 bytes) - payload length or EtherType, 6) Data (46-1500 bytes) - payload with padding if needed, 7) Frame Check Sequence (4 bytes) - CRC error detection. Total: 64-1518 bytes standard, up to 9000+ for jumbo frames."
    },
    {
      question: "What are the different Ethernet standards and their characteristics?",
      answer: "Major Ethernet standards: 1) 10BASE-T (10 Mbps) - twisted pair, 100m reach, legacy, 2) 100BASE-TX (100 Mbps) - Fast Ethernet, Cat5 cable, 3) 1000BASE-T (1 Gbps) - Gigabit Ethernet, Cat5e/6, 4) 10GBASE-T (10 Gbps) - Cat6a/7 cable, 5) 25/40/100/400 Gbps - data center applications. Characteristics vary by speed, cable type, distance, power consumption. Modern standards support full-duplex, auto-negotiation, and advanced features like PoE."
    },
    {
      question: "How does auto-negotiation work in Ethernet?",
      answer: "Auto-negotiation automatically configures optimal link parameters: Process: 1) Devices exchange capability advertisements, 2) Negotiate highest common speed and duplex mode, 3) Configure flow control and other features, 4) Establish link with agreed parameters. Benefits: 1) Automatic configuration, 2) Backward compatibility, 3) Optimal performance selection, 4) Reduced configuration errors. Priority: higher speeds preferred, full-duplex over half-duplex, flow control if supported by both ends."
    },
    {
      question: "What is Power over Ethernet (PoE) and how does it work?",
      answer: "PoE delivers electrical power over Ethernet cables: Standards: 1) PoE (802.3af) - 15.4W, 2) PoE+ (802.3at) - 25.5W, 3) PoE++ (802.3bt) - 60-100W. Power delivery methods: 1) Alternative A - uses data pairs, 2) Alternative B - uses spare pairs, 3) 4-pair PoE for higher power. Applications: IP phones, wireless access points, security cameras, IoT devices. Benefits: simplified installation, centralized power management, UPS backup capability, reduced cabling costs."
    },
    {
      question: "How do VLANs work with Ethernet?",
      answer: "VLANs (Virtual LANs) create logical network segments on Ethernet switches: IEEE 802.1Q standard adds 4-byte VLAN tag to Ethernet frames. Tag contains: 1) TPID (Tag Protocol Identifier), 2) Priority bits for QoS, 3) CFI (Canonical Format Indicator), 4) VLAN ID (12 bits, 4094 VLANs). Benefits: 1) Broadcast domain separation, 2) Security isolation, 3) Traffic management, 4) Flexible network design. Requires VLAN-aware switches and proper configuration for inter-VLAN routing."
    },
    {
      question: "What is the difference between half-duplex and full-duplex Ethernet?",
      answer: "Duplex mode differences: Half-Duplex: 1) Cannot send and receive simultaneously, 2) Shared collision domain, 3) CSMA/CD required, 4) Lower effective bandwidth, 5) Legacy hubs and 10BASE-T. Full-Duplex: 1) Simultaneous send and receive, 2) No collisions possible, 3) No CSMA/CD needed, 4) Doubles effective bandwidth, 5) Modern switched networks. Full-duplex standard in modern Ethernet, enabling higher performance and eliminating collision-related delays and retransmissions."
    },
    {
      question: "How does Ethernet handle error detection and what are common error types?",
      answer: "Ethernet error detection uses Frame Check Sequence (FCS) with CRC-32 algorithm. Common errors: 1) CRC errors - corrupted frames detected by FCS mismatch, 2) Alignment errors - frames not ending on byte boundary, 3) Collisions - multiple transmissions in half-duplex, 4) Late collisions - collisions after minimum frame time, 5) Jabber - oversized frames, 6) Runts - undersized frames. Error handling: drop corrupted frames, maintain statistics, trigger retransmission at higher layers. Modern full-duplex Ethernet significantly reduces error rates."
    },
    {
      question: "What role does Ethernet play in modern network architectures?",
      answer: "Ethernet's role in modern networks: 1) Dominant LAN technology - ubiquitous in enterprise and home networks, 2) Data center backbone - high-speed interconnects, 3) Carrier networks - Metro Ethernet services, 4) IoT connectivity - PoE-enabled device connections, 5) Cloud infrastructure - server and storage networking, 6) Integration platform - bridges wireless, storage, and compute networks. Evolution continues with software-defined networking, network function virtualization, and increasing speeds to meet growing bandwidth demands."
    }
  ]
};