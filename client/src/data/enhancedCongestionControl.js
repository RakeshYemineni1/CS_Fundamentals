export const enhancedCongestionControl = {
  id: 'tcp-congestion-control',
  title: 'TCP Congestion Control',
  subtitle: 'Network Congestion Prevention and Management',
  summary: 'TCP congestion control prevents network overload through algorithms like Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery.',
  analogy: 'Like traffic management on highways - start slow, gradually increase speed, but slow down when detecting congestion to prevent traffic jams.',
  visualConcept: 'Picture a smart driver who accelerates gradually, watches for traffic signs, and immediately slows down when seeing brake lights ahead.',
  realWorldUse: 'Internet traffic management, video streaming quality adaptation, file transfer optimization, preventing network collapse during high usage.',
  explanation: `TCP Congestion Control Mechanisms:

Purpose and Importance:
Congestion control prevents network collapse by detecting and responding to network congestion. Without it, increased load would cause more packet loss, leading to more retransmissions and complete network breakdown.

Key Algorithms:

1. Slow Start:
- Begins with congestion window (cwnd) = 1 MSS (Maximum Segment Size)
- Exponentially increases cwnd for each ACK received
- cwnd doubles every RTT until reaching ssthresh (slow start threshold)
- Rapid initial growth to find available bandwidth

2. Congestion Avoidance:
- Activated when cwnd reaches ssthresh
- Linear increase: cwnd += 1/cwnd for each ACK
- Additive increase prevents aggressive growth
- Continues until packet loss detected

3. Fast Retransmit:
- Triggered by 3 duplicate ACKs
- Immediately retransmits lost packet without waiting for timeout
- Indicates single packet loss, not severe congestion
- Faster recovery than timeout-based retransmission

4. Fast Recovery:
- Follows fast retransmit
- Sets ssthresh = cwnd/2, cwnd = ssthresh + 3
- Inflates cwnd for each additional duplicate ACK
- Deflates cwnd to ssthresh when new ACK arrives
- Avoids slow start after single packet loss

Congestion Detection:
- Timeout: Severe congestion, triggers slow start
- Duplicate ACKs: Mild congestion, triggers fast retransmit/recovery
- ECN (Explicit Congestion Notification): Router marks packets instead of dropping

Modern Algorithms:
- TCP Reno: Basic implementation with fast retransmit/recovery
- TCP NewReno: Improved recovery for multiple losses
- TCP CUBIC: Default in Linux, optimized for high-bandwidth networks
- TCP BBR: Google's algorithm focusing on bottleneck bandwidth and RTT`,

  keyPoints: [
    'Congestion control prevents network collapse and packet loss',
    'Slow Start exponentially increases sending rate initially',
    'Congestion Avoidance linearly increases after threshold',
    'Fast Retransmit responds to 3 duplicate ACKs immediately',
    'Fast Recovery avoids slow start after single packet loss',
    'Timeout indicates severe congestion, triggers slow start',
    'Congestion window (cwnd) controls sending rate',
    'Algorithms balance throughput and network stability',
    'Modern variants optimize for different network conditions',
    'ECN provides early congestion notification without drops'
  ],

  codeExamples: [
    {
      title: "TCP Congestion Control Implementation",
      language: "python",
      code: `import time
import random
from enum import Enum

class CongestionState(Enum):
    SLOW_START = "SLOW_START"
    CONGESTION_AVOIDANCE = "CONGESTION_AVOIDANCE"
    FAST_RECOVERY = "FAST_RECOVERY"

class TCPCongestionControl:
    def __init__(self, mss=1460):  # Maximum Segment Size
        self.mss = mss
        self.cwnd = 1.0  # Congestion window (in MSS units)
        self.ssthresh = 64.0  # Slow start threshold
        self.state = CongestionState.SLOW_START
        
        # Duplicate ACK tracking
        self.duplicate_acks = 0
        self.last_ack = 0
        
        # RTT estimation
        self.rtt_samples = []
        self.srtt = 0.1  # Smoothed RTT
        self.rttvar = 0.05  # RTT variation
        self.rto = 1.0  # Retransmission timeout
        
        # Statistics
        self.stats = {
            'packets_sent': 0,
            'packets_lost': 0,
            'timeouts': 0,
            'fast_retransmits': 0,
            'cwnd_history': []
        }
    
    def on_ack_received(self, ack_num, rtt=None):
        """Process received ACK and update congestion window"""
        if rtt:
            self.update_rtt(rtt)
        
        if ack_num > self.last_ack:
            # New ACK received
            self.duplicate_acks = 0
            self.last_ack = ack_num
            
            if self.state == CongestionState.SLOW_START:
                self.slow_start_ack()
            elif self.state == CongestionState.CONGESTION_AVOIDANCE:
                self.congestion_avoidance_ack()
            elif self.state == CongestionState.FAST_RECOVERY:
                self.fast_recovery_new_ack()
        
        elif ack_num == self.last_ack:
            # Duplicate ACK
            self.duplicate_acks += 1
            
            if self.duplicate_acks == 3:
                self.fast_retransmit()
            elif self.state == CongestionState.FAST_RECOVERY:
                self.fast_recovery_duplicate_ack()
        
        self.stats['cwnd_history'].append(self.cwnd)
        self.log_state()
    
    def slow_start_ack(self):
        """Handle ACK in slow start phase"""
        # Exponential increase: cwnd += 1 for each ACK
        self.cwnd += 1.0
        
        print(f"SLOW START: cwnd increased to {self.cwnd:.1f}")
        
        # Check if we should enter congestion avoidance
        if self.cwnd >= self.ssthresh:
            self.state = CongestionState.CONGESTION_AVOIDANCE
            print(f"Entering CONGESTION AVOIDANCE (ssthresh: {self.ssthresh})")
    
    def congestion_avoidance_ack(self):
        """Handle ACK in congestion avoidance phase"""
        # Linear increase: cwnd += 1/cwnd for each ACK
        self.cwnd += 1.0 / self.cwnd
        
        print(f"CONGESTION AVOIDANCE: cwnd = {self.cwnd:.2f}")
    
    def fast_retransmit(self):
        """Handle fast retransmit trigger"""
        print(f"FAST RETRANSMIT triggered! (3 duplicate ACKs)")
        
        # Set ssthresh to half of current cwnd
        self.ssthresh = max(self.cwnd / 2.0, 2.0)
        
        # Enter fast recovery
        self.cwnd = self.ssthresh + 3.0  # Inflate by 3 for the 3 dupacks
        self.state = CongestionState.FAST_RECOVERY
        
        self.stats['fast_retransmits'] += 1
        
        print(f"FAST RECOVERY: ssthresh = {self.ssthresh:.1f}, cwnd = {self.cwnd:.1f}")
    
    def fast_recovery_duplicate_ack(self):
        """Handle duplicate ACK in fast recovery"""
        # Inflate cwnd for each additional duplicate ACK
        self.cwnd += 1.0
        print(f"FAST RECOVERY: cwnd inflated to {self.cwnd:.1f}")
    
    def fast_recovery_new_ack(self):
        """Handle new ACK in fast recovery (exit fast recovery)"""
        # Deflate cwnd to ssthresh
        self.cwnd = self.ssthresh
        self.state = CongestionState.CONGESTION_AVOIDANCE
        
        print(f"EXIT FAST RECOVERY: cwnd = {self.cwnd:.1f}")
    
    def on_timeout(self):
        """Handle retransmission timeout"""
        print("TIMEOUT occurred!")
        
        # Multiplicative decrease
        self.ssthresh = max(self.cwnd / 2.0, 2.0)
        self.cwnd = 1.0
        self.state = CongestionState.SLOW_START
        self.duplicate_acks = 0
        
        # Double RTO (exponential backoff)
        self.rto = min(self.rto * 2, 64.0)
        
        self.stats['timeouts'] += 1
        
        print(f"TIMEOUT RECOVERY: ssthresh = {self.ssthresh:.1f}, cwnd = {self.cwnd:.1f}")
    
    def update_rtt(self, rtt_sample):
        """Update RTT estimation using Jacobson's algorithm"""
        if not self.rtt_samples:
            # First sample
            self.srtt = rtt_sample
            self.rttvar = rtt_sample / 2
        else:
            # RFC 6298 algorithm
            alpha = 0.125
            beta = 0.25
            
            self.rttvar = (1 - beta) * self.rttvar + beta * abs(self.srtt - rtt_sample)
            self.srtt = (1 - alpha) * self.srtt + alpha * rtt_sample
        
        # Calculate RTO
        self.rto = self.srtt + max(0.1, 4 * self.rttvar)
        self.rto = max(0.2, min(self.rto, 60.0))  # Clamp between 200ms and 60s
        
        self.rtt_samples.append(rtt_sample)
        if len(self.rtt_samples) > 100:
            self.rtt_samples.pop(0)
    
    def get_send_window(self):
        """Get current sending window size"""
        return int(self.cwnd)
    
    def log_state(self):
        """Log current congestion control state"""
        window_bytes = int(self.cwnd * self.mss)
        print(f"State: {self.state.value}, cwnd: {self.cwnd:.2f} MSS ({window_bytes} bytes)")
    
    def get_statistics(self):
        """Get congestion control statistics"""
        return {
            **self.stats,
            'current_cwnd': self.cwnd,
            'current_ssthresh': self.ssthresh,
            'current_state': self.state.value,
            'current_rto': self.rto,
            'avg_cwnd': sum(self.stats['cwnd_history']) / len(self.stats['cwnd_history']) if self.stats['cwnd_history'] else 0
        }

class NetworkSimulator:
    def __init__(self, loss_rate=0.01, delay_ms=50):
        self.loss_rate = loss_rate
        self.delay_ms = delay_ms
        self.congestion_level = 0.0  # 0.0 = no congestion, 1.0 = severe
    
    def transmit_packet(self, packet_id):
        """Simulate packet transmission through network"""
        # Simulate network delay
        time.sleep(self.delay_ms / 1000.0)
        
        # Simulate packet loss based on congestion
        effective_loss_rate = self.loss_rate * (1 + self.congestion_level * 10)
        
        if random.random() < effective_loss_rate:
            print(f"NETWORK: Packet {packet_id} LOST")
            return False
        else:
            print(f"NETWORK: Packet {packet_id} delivered")
            return True
    
    def set_congestion_level(self, level):
        """Set network congestion level (0.0 to 1.0)"""
        self.congestion_level = max(0.0, min(1.0, level))
        print(f"NETWORK: Congestion level set to {self.congestion_level:.1f}")

class CongestionControlDemo:
    def __init__(self):
        self.cc = TCPCongestionControl()
        self.network = NetworkSimulator(loss_rate=0.02)
        self.packet_id = 0
        self.ack_id = 0
    
    def simulate_transmission(self, num_packets=50):
        """Simulate packet transmission with congestion control"""
        print("=== TCP Congestion Control Simulation ===\\n")
        
        for i in range(num_packets):
            # Get current window size
            window_size = self.cc.get_send_window()
            
            # Send packets within window
            for _ in range(window_size):
                self.packet_id += 1
                
                # Simulate transmission
                start_time = time.time()
                delivered = self.network.transmit_packet(self.packet_id)
                rtt = time.time() - start_time
                
                if delivered:
                    # Simulate ACK reception
                    self.ack_id = self.packet_id
                    self.cc.on_ack_received(self.ack_id, rtt)
                else:
                    # Simulate packet loss detection
                    if random.random() < 0.3:  # 30% chance of timeout
                        self.cc.on_timeout()
                    else:
                        # Simulate duplicate ACKs
                        for _ in range(3):
                            self.cc.on_ack_received(self.ack_id)
                
                time.sleep(0.01)  # Small delay between packets
            
            # Vary network conditions
            if i == 20:
                print("\\n--- Increasing network congestion ---")
                self.network.set_congestion_level(0.5)
            elif i == 35:
                print("\\n--- Network congestion cleared ---")
                self.network.set_congestion_level(0.0)
            
            time.sleep(0.1)
        
        # Print final statistics
        stats = self.cc.get_statistics()
        print("\\n=== Final Statistics ===")
        for key, value in stats.items():
            if key != 'cwnd_history':
                print(f"{key.replace('_', ' ').title()}: {value}")

if __name__ == "__main__":
    demo = CongestionControlDemo()
    demo.simulate_transmission(30)`
    },
    {
      title: "Modern Congestion Control Algorithms",
      language: "python",
      code: `import math
import time
from collections import deque

class TCPCubic:
    """TCP CUBIC congestion control algorithm"""
    
    def __init__(self):
        self.cwnd = 1.0
        self.ssthresh = 64.0
        
        # CUBIC parameters
        self.beta = 0.7  # Multiplicative decrease factor
        self.C = 0.4     # CUBIC parameter
        self.W_max = 0   # Window size before last reduction
        self.K = 0       # Time to reach W_max
        self.epoch_start = 0  # Start of current epoch
        
        self.tcp_friendliness = True
        self.fast_convergence = True
    
    def on_ack(self, rtt):
        """Handle ACK reception"""
        if self.cwnd < self.ssthresh:
            # Slow start
            self.cwnd += 1.0
        else:
            # CUBIC increase
            self.cubic_update(rtt)
    
    def cubic_update(self, rtt):
        """CUBIC window update"""
        if self.epoch_start == 0:
            self.epoch_start = time.time()
            
            if self.cwnd < self.W_max:
                self.K = math.pow((self.W_max - self.cwnd) / self.C, 1/3)
            else:
                self.K = 0
        
        t = time.time() - self.epoch_start - self.K
        
        # CUBIC function: W_cubic(t) = C * (t - K)^3 + W_max
        target = self.C * (t ** 3) + self.W_max
        
        if target > self.cwnd:
            cnt = self.cwnd / (target - self.cwnd)
        else:
            cnt = 100 * self.cwnd
        
        # TCP-friendly region
        if self.tcp_friendliness:
            tcp_cwnd = self.W_max * self.beta + (3 * (1 - self.beta) / (1 + self.beta)) * t / rtt
            if tcp_cwnd > target:
                target = tcp_cwnd
        
        if target > self.cwnd:
            self.cwnd += 1.0 / cnt
        
        print(f"CUBIC: cwnd = {self.cwnd:.2f}, target = {target:.2f}")
    
    def on_loss(self):
        """Handle packet loss"""
        if self.fast_convergence and self.cwnd < self.W_max:
            self.W_max = self.cwnd * (2 - self.beta) / 2
        else:
            self.W_max = self.cwnd
        
        self.cwnd *= self.beta
        self.ssthresh = self.cwnd
        self.epoch_start = 0
        
        print(f"CUBIC LOSS: cwnd = {self.cwnd:.2f}, W_max = {self.W_max:.2f}")

class TCPBBR:
    """TCP BBR (Bottleneck Bandwidth and RTT) algorithm"""
    
    def __init__(self):
        self.cwnd = 1.0
        
        # BBR state
        self.mode = "STARTUP"  # STARTUP, DRAIN, PROBE_BW, PROBE_RTT
        self.pacing_gain = 2.77  # High gain for startup
        self.cwnd_gain = 2.0
        
        # Measurements
        self.bw_samples = deque(maxlen=10)
        self.rtt_samples = deque(maxlen=10)
        self.min_rtt = float('inf')
        self.max_bw = 0
        
        # Cycle for PROBE_BW
        self.cycle_index = 0
        self.probe_bw_gains = [1.25, 0.75, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
        
        self.packets_delivered = 0
        self.round_start = True
    
    def on_ack(self, bytes_acked, rtt, delivered):
        """Handle ACK with delivery information"""
        self.update_model(bytes_acked, rtt, delivered)
        self.update_control_parameters()
        self.update_cwnd()
        
        print(f"BBR {self.mode}: cwnd = {self.cwnd:.1f}, "
              f"BW = {self.max_bw:.0f} bps, RTT = {self.min_rtt*1000:.1f}ms")
    
    def update_model(self, bytes_acked, rtt, delivered):
        """Update bandwidth and RTT measurements"""
        # Update RTT
        self.rtt_samples.append(rtt)
        self.min_rtt = min(self.min_rtt, rtt)
        
        # Update bandwidth
        if delivered > 0:
            bw_sample = bytes_acked / rtt
            self.bw_samples.append(bw_sample)
            self.max_bw = max(self.bw_samples) if self.bw_samples else 0
    
    def update_control_parameters(self):
        """Update BBR control parameters based on mode"""
        if self.mode == "STARTUP":
            if len(self.bw_samples) >= 3:
                # Check if bandwidth growth has plateaued
                recent_bw = max(list(self.bw_samples)[-3:])
                if recent_bw < self.max_bw * 1.25:
                    self.mode = "DRAIN"
                    self.pacing_gain = 1.0 / 2.77  # Drain excess queue
                    print("BBR: Entering DRAIN mode")
        
        elif self.mode == "DRAIN":
            # Drain until cwnd <= BDP
            bdp = self.max_bw * self.min_rtt
            if self.cwnd <= bdp:
                self.mode = "PROBE_BW"
                self.pacing_gain = 1.0
                print("BBR: Entering PROBE_BW mode")
        
        elif self.mode == "PROBE_BW":
            # Cycle through different pacing gains
            self.pacing_gain = self.probe_bw_gains[self.cycle_index]
            if self.round_start:
                self.cycle_index = (self.cycle_index + 1) % len(self.probe_bw_gains)
    
    def update_cwnd(self):
        """Update congestion window"""
        if self.mode == "STARTUP":
            self.cwnd = max(self.cwnd + 1, self.max_bw * self.min_rtt * self.cwnd_gain)
        else:
            # Target cwnd based on BDP
            target_cwnd = self.max_bw * self.min_rtt
            
            if self.mode == "PROBE_RTT":
                target_cwnd *= 0.75  # Reduce cwnd to probe for lower RTT
            
            self.cwnd = max(target_cwnd, 4.0)  # Minimum cwnd

class AlgorithmComparison:
    """Compare different congestion control algorithms"""
    
    def __init__(self):
        self.algorithms = {
            'Reno': TCPCongestionControl(),
            'CUBIC': TCPCubic(),
            'BBR': TCPBBR()
        }
        self.results = {}
    
    def simulate_scenario(self, scenario_name, duration=10):
        """Simulate network scenario for all algorithms"""
        print(f"\\n=== Simulating {scenario_name} ===")
        
        for name, algo in self.algorithms.items():
            print(f"\\nTesting {name}:")
            
            # Reset algorithm state
            if hasattr(algo, 'cwnd'):
                algo.cwnd = 1.0
            
            throughput = 0
            packets_sent = 0
            
            for i in range(duration * 10):  # 10 iterations per second
                # Simulate different network conditions
                if scenario_name == "High Bandwidth":
                    rtt = 0.1
                    loss_rate = 0.001
                elif scenario_name == "High Latency":
                    rtt = 0.5
                    loss_rate = 0.01
                elif scenario_name == "Lossy Network":
                    rtt = 0.1
                    loss_rate = 0.05
                else:
                    rtt = 0.1
                    loss_rate = 0.01
                
                # Simulate packet transmission
                if hasattr(algo, 'get_send_window'):
                    window = algo.get_send_window()
                else:
                    window = int(algo.cwnd)
                
                packets_sent += window
                
                # Simulate ACKs and losses
                if random.random() > loss_rate:
                    if isinstance(algo, TCPBBR):
                        algo.on_ack(1460, rtt, packets_sent)
                    else:
                        algo.on_ack(i, rtt)
                    throughput += window
                else:
                    if hasattr(algo, 'on_loss'):
                        algo.on_loss()
                    elif hasattr(algo, 'on_timeout'):
                        algo.on_timeout()
                
                time.sleep(0.01)
            
            self.results[f"{name}_{scenario_name}"] = {
                'throughput': throughput,
                'packets_sent': packets_sent,
                'efficiency': throughput / packets_sent if packets_sent > 0 else 0
            }
    
    def print_comparison(self):
        """Print algorithm comparison results"""
        print("\\n=== Algorithm Comparison Results ===")
        
        scenarios = set(key.split('_', 1)[1] for key in self.results.keys())
        
        for scenario in scenarios:
            print(f"\\n{scenario}:")
            scenario_results = {k.split('_')[0]: v for k, v in self.results.items() 
                              if scenario in k}
            
            for algo, results in scenario_results.items():
                print(f"  {algo:6}: Throughput = {results['throughput']:6.0f}, "
                      f"Efficiency = {results['efficiency']:.3f}")

# Usage example
if __name__ == "__main__":
    import random
    
    # Test individual algorithms
    print("=== TCP CUBIC Test ===")
    cubic = TCPCubic()
    for i in range(20):
        if random.random() > 0.9:  # 10% loss rate
            cubic.on_loss()
        else:
            cubic.on_ack(0.1)
        time.sleep(0.05)
    
    print("\\n=== TCP BBR Test ===")
    bbr = TCPBBR()
    for i in range(20):
        bbr.on_ack(1460, 0.1 + random.random() * 0.05, i * 1460)
        time.sleep(0.05)
    
    # Compare algorithms
    comparison = AlgorithmComparison()
    comparison.simulate_scenario("High Bandwidth", 5)
    comparison.simulate_scenario("High Latency", 5)
    comparison.simulate_scenario("Lossy Network", 5)
    comparison.print_comparison()`
    }
  ],

  resources: [
    { type: 'video', title: 'TCP Congestion Control - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/tcp-congestion-control/', description: 'Complete TCP congestion control explanation' },
    { type: 'video', title: 'TCP Congestion Control - YouTube', url: 'https://www.youtube.com/watch?v=gLlJiFo_-RA', description: 'Visual explanation of congestion control algorithms' },
    { type: 'article', title: 'TCP Slow Start - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/tcp-slow-start/', description: 'TCP slow start algorithm explained' },
    { type: 'article', title: 'TCP Congestion Control RFC 5681', url: 'https://tools.ietf.org/html/rfc5681', description: 'Standard TCP congestion control specification' },
    { type: 'video', title: 'Network Congestion - YouTube', url: 'https://www.youtube.com/watch?v=7Uiap4G4vQs', description: 'Network congestion and control mechanisms' },
    { type: 'article', title: 'TCP CUBIC Algorithm RFC', url: 'https://tools.ietf.org/html/rfc8312', description: 'CUBIC congestion control specification' },
    { type: 'article', title: 'BBR Congestion Control', url: 'https://queue.acm.org/detail.cfm?id=3022184', description: 'Google BBR algorithm research paper' },
    { type: 'video', title: 'TCP Fast Recovery', url: 'https://www.youtube.com/watch?v=F27PLin3TV0', description: 'TCP fast retransmit and recovery' },
    { type: 'tool', title: 'ss Command', url: 'https://man7.org/linux/man-pages/man8/ss.8.html', description: 'Monitor TCP congestion control state' },
    { type: 'article', title: 'Modern TCP Algorithms', url: 'https://www.tutorialspoint.com/tcp-congestion-control-algorithms', description: 'Comparison of TCP congestion control algorithms' }
  ],

  questions: [
    {
      question: "What is TCP congestion control and why is it necessary?",
      answer: "TCP congestion control is a mechanism to prevent network congestion by controlling the rate at which data is sent. It's necessary because: 1) Prevents network collapse when too many sources send data simultaneously, 2) Ensures fair bandwidth sharing among competing flows, 3) Adapts to changing network conditions, 4) Prevents buffer overflow at intermediate routers, 5) Maintains network stability and performance."
    },
    {
      question: "Explain the four phases of TCP congestion control algorithms.",
      answer: "The four phases are: 1) Slow Start - Exponentially increases congestion window (cwnd) until reaching ssthresh, 2) Congestion Avoidance - Linearly increases cwnd after ssthresh, 3) Fast Retransmit - Detects packet loss through duplicate ACKs without waiting for timeout, 4) Fast Recovery - Reduces cwnd and continues transmission without going back to slow start, maintaining higher throughput."
    },
    {
      question: "What is the difference between slow start and congestion avoidance phases?",
      answer: "Slow Start: 1) Exponential growth (cwnd doubles each RTT), 2) Used initially and after timeouts, 3) Rapid probing of available bandwidth, 4) Continues until cwnd reaches ssthresh. Congestion Avoidance: 1) Linear growth (cwnd increases by 1 MSS per RTT), 2) Used after slow start threshold, 3) Conservative bandwidth probing, 4) Prevents aggressive increases that could cause congestion."
    },
    {
      question: "How does TCP detect network congestion?",
      answer: "TCP detects congestion through: 1) Packet Loss - Indicated by timeouts or duplicate ACKs, 2) Timeout Events - RTO expiration suggests severe congestion, 3) Duplicate ACKs - Three duplicate ACKs indicate packet loss, 4) RTT Variations - Increasing round-trip times may indicate congestion, 5) Explicit Congestion Notification (ECN) - Router marks packets to signal congestion without dropping them."
    },
    {
      question: "What is the congestion window (cwnd) and how does it differ from the receive window?",
      answer: "Congestion Window (cwnd): 1) Sender-side limit based on network capacity, 2) Dynamically adjusted based on congestion signals, 3) Prevents network congestion, 4) Managed by congestion control algorithms. Receive Window (rwnd): 1) Receiver-side limit based on buffer space, 2) Advertised by receiver in TCP headers, 3) Prevents receiver buffer overflow, 4) Flow control mechanism. Effective window = min(cwnd, rwnd)."
    },
    {
      question: "Explain the TCP Reno algorithm and its improvements over Tahoe.",
      answer: "TCP Reno improvements over Tahoe: 1) Fast Recovery - Doesn't reset cwnd to 1 after fast retransmit, instead sets cwnd = ssthresh + 3*MSS, 2) Maintains higher throughput during packet loss, 3) Continues in congestion avoidance rather than slow start, 4) Better performance in networks with occasional packet loss, 5) Faster recovery from single packet losses while maintaining congestion control principles."
    },
    {
      question: "What are the limitations of traditional TCP congestion control in modern networks?",
      answer: "Limitations include: 1) High-bandwidth, high-latency networks - Slow convergence to optimal rate, 2) Wireless networks - Misinterprets wireless losses as congestion, 3) Datacenter networks - Too conservative for low-latency, high-bandwidth links, 4) Fairness issues - RTT bias and aggressive flows, 5) Buffer bloat - Doesn't account for excessive buffering, 6) Lack of explicit feedback - Relies on implicit loss signals."
    },
    {
      question: "How do modern congestion control algorithms like BBR differ from loss-based algorithms?",
      answer: "BBR (Bottleneck Bandwidth and RTT) differences: 1) Model-based - Uses bandwidth and RTT measurements instead of loss signals, 2) Proactive - Operates at optimal point rather than reacting to congestion, 3) Better performance - Higher throughput and lower latency, 4) Fairness - More equitable bandwidth sharing, 5) Robust - Works well in various network conditions, 6) Explicit measurement - Actively measures network capacity rather than inferring from loss."
    },
    {
      question: "What is the role of the slow start threshold (ssthresh) in congestion control?",
      answer: "Slow start threshold (ssthresh) role: 1) Transition point - Switches from exponential to linear growth, 2) Memory of congestion - Set to cwnd/2 when congestion detected, 3) Performance optimization - Balances fast startup with congestion avoidance, 4) Adaptive behavior - Adjusts based on network conditions, 5) Prevents oscillation - Helps stabilize the congestion window around optimal value."
    },
    {
      question: "How does TCP handle multiple packet losses in a single window?",
      answer: "TCP handles multiple losses through: 1) Fast Retransmit - Detects first loss via duplicate ACKs, 2) Fast Recovery - Maintains cwnd during recovery, 3) Selective ACK (SACK) - Identifies specific missing segments, 4) NewReno - Handles multiple losses without SACK by staying in fast recovery, 5) Timeout fallback - Uses RTO for unrecoverable situations, 6) Partial ACKs - Indicates ongoing losses during recovery phase."
    }
  ]
};