export const enhancedFlowControl = {
  id: 'tcp-flow-control',
  title: 'TCP Flow Control',
  subtitle: 'Sliding Window Protocol',
  summary: 'TCP flow control uses sliding window protocol to prevent fast senders from overwhelming slow receivers by controlling data transmission rate.',
  analogy: 'Like water flowing through pipes - you need a valve to control flow rate so the receiving container doesn\'t overflow.',
  visualConcept: 'Picture a sliding window that moves forward as data is acknowledged, controlling how much unacknowledged data can be in transit.',
  realWorldUse: 'File downloads, video streaming, database transfers - any scenario where sender and receiver have different processing speeds.',
  explanation: `TCP Flow Control and Sliding Window Protocol:

Purpose of Flow Control:
Flow control prevents a fast sender from overwhelming a slow receiver by regulating the rate of data transmission. Without flow control, the receiver's buffer could overflow, causing data loss and performance degradation.

Sliding Window Mechanism:
The sliding window protocol allows multiple packets to be in transit simultaneously while maintaining reliable delivery. The window size determines how much unacknowledged data the sender can transmit.

Key Components:

1. Receive Window (rwnd):
- Advertised by receiver in TCP header
- Indicates available buffer space at receiver
- Dynamically adjusted based on application consumption rate
- Prevents buffer overflow at receiver

2. Send Window:
- Maximum amount of unacknowledged data sender can transmit
- Determined by minimum of receiver window and congestion window
- Slides forward as acknowledgments arrive

3. Window Management:
- Left Edge: Oldest unacknowledged byte
- Right Edge: Left edge + window size
- Usable Window: Right edge - next sequence number to send

Window Operations:

Window Sliding:
As acknowledgments arrive, the window slides forward, allowing transmission of new data. The window size can increase (receiver has more buffer space) or decrease (receiver buffer filling up).

Zero Window:
When receiver buffer is full, it advertises window size 0, stopping sender transmission. Sender periodically probes with zero window probes to detect when receiver is ready.

Window Scaling:
For high-bandwidth networks, standard 16-bit window field limits throughput. Window scaling option (RFC 1323) allows larger effective windows by using a scaling factor.

Flow Control vs Congestion Control:
- Flow Control: End-to-end, prevents receiver overflow
- Congestion Control: Network-wide, prevents network congestion
- Effective window = min(receiver window, congestion window)

Performance Implications:
Proper window sizing is crucial for performance. Too small windows limit throughput, while too large windows may cause buffer bloat and increased latency.`,

  keyPoints: [
    'Flow control prevents receiver buffer overflow',
    'Sliding window allows multiple unacknowledged packets',
    'Receiver advertises available buffer space (rwnd)',
    'Window slides forward as acknowledgments arrive',
    'Zero window stops transmission until buffer space available',
    'Window scaling enables high-bandwidth performance',
    'Effective window is minimum of flow and congestion control',
    'Dynamic window adjustment based on receiver capacity',
    'Window probes detect when zero window condition clears',
    'Proper window sizing critical for optimal performance'
  ],

  codeExamples: [
    {
      title: "Sliding Window Implementation",
      language: "python",
      code: `import threading
import time
import queue
from collections import deque

class SlidingWindow:
    def __init__(self, window_size=8):
        self.window_size = window_size
        self.base = 0  # Oldest unacknowledged sequence number
        self.next_seq_num = 0  # Next sequence number to send
        self.buffer = {}  # Sent but unacknowledged packets
        self.lock = threading.Lock()
        self.window_not_full = threading.Condition(self.lock)
    
    def send_packet(self, data, timeout=None):
        """Send packet if window allows"""
        with self.window_not_full:
            # Wait if window is full
            while not self.can_send():
                if not self.window_not_full.wait(timeout):
                    return None  # Timeout
            
            seq_num = self.next_seq_num
            packet = {
                'seq_num': seq_num,
                'data': data,
                'timestamp': time.time(),
                'retransmitted': False
            }
            
            self.buffer[seq_num] = packet
            self.next_seq_num += 1
            
            print(f"SEND: Packet {seq_num} (data: {data}) "
                  f"[Window: {self.base}-{self.base + self.window_size - 1}]")
            
            return seq_num
    
    def receive_ack(self, ack_num):
        """Process acknowledgment and slide window"""
        with self.window_not_full:
            if ack_num >= self.base:
                # Cumulative acknowledgment
                old_base = self.base
                
                # Remove acknowledged packets
                for seq in range(self.base, ack_num + 1):
                    if seq in self.buffer:
                        del self.buffer[seq]
                
                self.base = ack_num + 1
                
                print(f"ACK: Received ACK {ack_num}, window slides "
                      f"from {old_base} to {self.base}")
                
                # Notify waiting senders
                self.window_not_full.notify_all()
                return True
            else:
                print(f"ACK: Duplicate/old ACK {ack_num} (base: {self.base})")
                return False
    
    def can_send(self):
        """Check if we can send more packets"""
        return self.next_seq_num < self.base + self.window_size
    
    def get_window_info(self):
        """Get current window information"""
        with self.lock:
            return {
                'base': self.base,
                'next_seq_num': self.next_seq_num,
                'window_size': self.window_size,
                'unacked_packets': len(self.buffer),
                'usable_window': self.window_size - (self.next_seq_num - self.base)
            }
    
    def update_window_size(self, new_size):
        """Update receiver window size"""
        with self.window_not_full:
            old_size = self.window_size
            self.window_size = max(1, new_size)  # Minimum window size of 1
            
            print(f"WINDOW: Size updated from {old_size} to {self.window_size}")
            
            if new_size > old_size:
                # Window opened, notify waiting senders
                self.window_not_full.notify_all()
    
    def get_timeout_packets(self, timeout_duration=1.0):
        """Get packets that need retransmission"""
        with self.lock:
            current_time = time.time()
            timeout_packets = []
            
            for seq_num, packet in self.buffer.items():
                if current_time - packet['timestamp'] > timeout_duration:
                    timeout_packets.append((seq_num, packet['data']))
            
            return timeout_packets

class FlowControlReceiver:
    def __init__(self, buffer_size=10):
        self.buffer_size = buffer_size
        self.buffer = deque(maxlen=buffer_size)
        self.expected_seq = 0
        self.lock = threading.Lock()
    
    def receive_packet(self, seq_num, data):
        """Receive packet and return ACK"""
        with self.lock:
            if seq_num == self.expected_seq:
                # In-order packet
                if len(self.buffer) < self.buffer_size:
                    self.buffer.append((seq_num, data))
                    self.expected_seq += 1
                    
                    # Calculate available window
                    available_space = self.buffer_size - len(self.buffer)
                    
                    print(f"RECV: Packet {seq_num} (data: {data}) "
                          f"[Buffer: {len(self.buffer)}/{self.buffer_size}]")
                    
                    return {
                        'ack_num': seq_num,
                        'window_size': available_space
                    }
                else:
                    # Buffer full - advertise zero window
                    print(f"RECV: Buffer full, dropping packet {seq_num}")
                    return {
                        'ack_num': self.expected_seq - 1,
                        'window_size': 0
                    }
            else:
                # Out-of-order or duplicate packet
                print(f"RECV: Out-of-order packet {seq_num} "
                      f"(expected: {self.expected_seq})")
                return {
                    'ack_num': self.expected_seq - 1,
                    'window_size': self.buffer_size - len(self.buffer)
                }
    
    def consume_data(self, count=1):
        """Simulate application consuming data"""
        with self.lock:
            consumed = []
            for _ in range(min(count, len(self.buffer))):
                if self.buffer:
                    consumed.append(self.buffer.popleft())
            
            if consumed:
                print(f"APP: Consumed {len(consumed)} packets, "
                      f"buffer now {len(self.buffer)}/{self.buffer_size}")
            
            return len(consumed)

class FlowControlDemo:
    def __init__(self):
        self.sender = SlidingWindow(window_size=4)
        self.receiver = FlowControlReceiver(buffer_size=6)
        self.running = True
    
    def sender_thread(self):
        """Sender thread with flow control"""
        data_to_send = [f"Data_{i}" for i in range(15)]
        
        for data in data_to_send:
            if not self.running:
                break
            
            # Send packet (may block if window full)
            seq_num = self.sender.send_packet(data, timeout=2.0)
            
            if seq_num is None:
                print("SEND: Timeout waiting for window space")
                break
            
            time.sleep(0.1)  # Simulate transmission delay
    
    def receiver_thread(self):
        """Receiver thread processing packets"""
        received_packets = 0
        
        while self.running and received_packets < 15:
            # Simulate packet arrival
            if received_packets < 15:
                seq_num = received_packets
                data = f"Data_{received_packets}"
                
                # Receive packet
                ack_info = self.receiver.receive_packet(seq_num, data)
                
                # Send ACK back to sender
                self.sender.receive_ack(ack_info['ack_num'])
                
                # Update sender's view of receiver window
                self.sender.update_window_size(ack_info['window_size'])
                
                received_packets += 1
            
            time.sleep(0.15)  # Simulate processing delay
    
    def consumer_thread(self):
        """Application thread consuming data"""
        while self.running:
            # Randomly consume data
            consumed = self.receiver.consume_data(count=2)
            
            if consumed > 0:
                # Update window size after consumption
                available_space = (self.receiver.buffer_size - 
                                 len(self.receiver.buffer))
                self.sender.update_window_size(available_space)
            
            time.sleep(0.3)  # Simulate application processing
    
    def run_demo(self):
        """Run flow control demonstration"""
        print("=== TCP Flow Control Demonstration ===\\n")
        
        # Start threads
        threads = [
            threading.Thread(target=self.sender_thread),
            threading.Thread(target=self.receiver_thread),
            threading.Thread(target=self.consumer_thread)
        ]
        
        for thread in threads:
            thread.daemon = True
            thread.start()
        
        # Run for demonstration period
        time.sleep(5)
        self.running = False
        
        # Wait for threads to complete
        for thread in threads:
            thread.join(timeout=1)
        
        # Print final statistics
        print("\\n=== Final Window State ===")
        window_info = self.sender.get_window_info()
        for key, value in window_info.items():
            print(f"{key.replace('_', ' ').title()}: {value}")

if __name__ == "__main__":
    demo = FlowControlDemo()
    demo.run_demo()`
    },
    {
      title: "Window Scaling and Performance",
      language: "python",
      code: `import socket
import struct
import time
import threading

class WindowScaling:
    def __init__(self):
        self.scale_factor = 0  # Window scaling factor (0-14)
        self.max_window = 65535  # Standard 16-bit window
    
    def calculate_scaled_window(self, advertised_window):
        """Calculate actual window size with scaling"""
        return advertised_window << self.scale_factor
    
    def calculate_advertised_window(self, actual_window):
        """Calculate window to advertise with scaling"""
        return min(actual_window >> self.scale_factor, 65535)
    
    def set_scale_factor(self, bandwidth_mbps, rtt_ms):
        """Calculate optimal scale factor based on BDP"""
        # Bandwidth-Delay Product
        bdp_bytes = (bandwidth_mbps * 1000000 / 8) * (rtt_ms / 1000)
        
        # Find scale factor needed
        scale_factor = 0
        while (65535 << scale_factor) < bdp_bytes and scale_factor < 14:
            scale_factor += 1
        
        self.scale_factor = scale_factor
        print(f"Optimal scale factor: {scale_factor} "
              f"(BDP: {bdp_bytes:.0f} bytes)")
        
        return scale_factor

class PerformanceAnalyzer:
    def __init__(self):
        self.measurements = []
    
    def measure_throughput(self, host, port, window_sizes):
        """Measure throughput with different window sizes"""
        print(f"Measuring throughput to {host}:{port}")
        
        for window_size in window_sizes:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                
                # Set receive buffer size (affects window size)
                sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, window_size)
                sock.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, window_size)
                
                # Connect and measure
                start_time = time.time()
                sock.connect((host, port))
                connect_time = time.time() - start_time
                
                # Send test data
                test_data = b'X' * 1024  # 1KB test packet
                packets_sent = 0
                
                start_time = time.time()
                duration = 2.0  # Test for 2 seconds
                
                while time.time() - start_time < duration:
                    try:
                        sock.send(test_data)
                        packets_sent += 1
                    except socket.error:
                        break
                
                actual_duration = time.time() - start_time
                throughput = (packets_sent * len(test_data)) / actual_duration
                
                self.measurements.append({
                    'window_size': window_size,
                    'throughput_bps': throughput,
                    'packets_sent': packets_sent,
                    'connect_time': connect_time
                })
                
                print(f"Window: {window_size:6d} bytes, "
                      f"Throughput: {throughput/1024:.1f} KB/s, "
                      f"Packets: {packets_sent}")
                
                sock.close()
                time.sleep(0.1)
                
            except Exception as e:
                print(f"Error with window size {window_size}: {e}")
    
    def analyze_results(self):
        """Analyze throughput measurements"""
        if not self.measurements:
            return
        
        print("\\n=== Throughput Analysis ===")
        
        best = max(self.measurements, key=lambda x: x['throughput_bps'])
        worst = min(self.measurements, key=lambda x: x['throughput_bps'])
        
        print(f"Best performance:")
        print(f"  Window size: {best['window_size']} bytes")
        print(f"  Throughput: {best['throughput_bps']/1024:.1f} KB/s")
        
        print(f"Worst performance:")
        print(f"  Window size: {worst['window_size']} bytes")
        print(f"  Throughput: {worst['throughput_bps']/1024:.1f} KB/s")
        
        improvement = best['throughput_bps'] / worst['throughput_bps']
        print(f"Performance improvement: {improvement:.1f}x")

class ZeroWindowSimulation:
    def __init__(self):
        self.receiver_buffer = []
        self.buffer_size = 5
        self.window_probes = 0
    
    def simulate_zero_window(self):
        """Simulate zero window condition"""
        print("=== Zero Window Simulation ===\\n")
        
        # Fill receiver buffer
        for i in range(self.buffer_size):
            self.receiver_buffer.append(f"Data_{i}")
        
        print(f"Receiver buffer full: {len(self.receiver_buffer)}/{self.buffer_size}")
        print("Advertising zero window to sender")
        
        # Simulate sender probing
        for probe in range(5):
            self.window_probes += 1
            print(f"Sender probe #{probe + 1}: Window still zero")
            
            # Simulate application consuming some data
            if probe == 2:  # After 3rd probe, consume data
                consumed = self.receiver_buffer.pop(0)
                print(f"Application consumed: {consumed}")
                print(f"Buffer space available: {self.buffer_size - len(self.receiver_buffer)}")
                print("Advertising non-zero window")
                break
            
            time.sleep(0.5)
        
        print(f"Total window probes sent: {self.window_probes}")

class AdaptiveWindowManager:
    def __init__(self, initial_window=4):
        self.current_window = initial_window
        self.min_window = 1
        self.max_window = 64
        self.rtt_samples = []
        self.throughput_samples = []
    
    def update_window(self, rtt, throughput, packet_loss=False):
        """Adaptively adjust window size"""
        self.rtt_samples.append(rtt)
        self.throughput_samples.append(throughput)
        
        # Keep only recent samples
        if len(self.rtt_samples) > 10:
            self.rtt_samples.pop(0)
            self.throughput_samples.pop(0)
        
        if packet_loss:
            # Reduce window on packet loss
            self.current_window = max(self.min_window, 
                                    self.current_window // 2)
            print(f"Packet loss detected, reducing window to {self.current_window}")
        
        elif len(self.throughput_samples) >= 2:
            # Increase window if throughput improving
            recent_throughput = sum(self.throughput_samples[-2:]) / 2
            older_throughput = sum(self.throughput_samples[:-2]) / max(1, len(self.throughput_samples) - 2)
            
            if recent_throughput > older_throughput * 1.1:  # 10% improvement
                self.current_window = min(self.max_window, 
                                        self.current_window + 1)
                print(f"Throughput improving, increasing window to {self.current_window}")
            elif recent_throughput < older_throughput * 0.9:  # 10% degradation
                self.current_window = max(self.min_window, 
                                        self.current_window - 1)
                print(f"Throughput degrading, decreasing window to {self.current_window}")
        
        return self.current_window

# Usage examples
if __name__ == "__main__":
    # Window scaling example
    scaling = WindowScaling()
    scaling.set_scale_factor(bandwidth_mbps=100, rtt_ms=50)
    
    print(f"Scaled window for 32KB: {scaling.calculate_scaled_window(32768)}")
    print(f"Advertised window for 1MB: {scaling.calculate_advertised_window(1048576)}")
    
    print("\\n" + "="*50 + "\\n")
    
    # Zero window simulation
    zero_window = ZeroWindowSimulation()
    zero_window.simulate_zero_window()
    
    print("\\n" + "="*50 + "\\n")
    
    # Adaptive window management
    adaptive = AdaptiveWindowManager()
    
    # Simulate network conditions
    for i in range(10):
        rtt = 0.1 + (i * 0.01)  # Increasing RTT
        throughput = 1000 - (i * 50)  # Decreasing throughput
        packet_loss = (i == 7)  # Packet loss at iteration 7
        
        window = adaptive.update_window(rtt, throughput, packet_loss)
        print(f"Iteration {i+1}: RTT={rtt:.3f}s, "
              f"Throughput={throughput}, Window={window}")`
    }
  ],

  resources: [
    { type: 'video', title: 'TCP Flow Control - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/tcp-flow-control/', description: 'TCP flow control mechanisms explained' },
    { type: 'video', title: 'Sliding Window Protocol - YouTube', url: 'https://www.youtube.com/watch?v=LnbvhoxHn7M', description: 'Visual sliding window protocol explanation' },
    { type: 'article', title: 'TCP Window Scaling - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/tcp-window-scaling/', description: 'TCP window scaling for high bandwidth networks' },
    { type: 'article', title: 'TCP Flow Control RFC', url: 'https://tools.ietf.org/html/rfc793#section-3.7', description: 'Original TCP flow control specification' },
    { type: 'video', title: 'Network Performance Tuning', url: 'https://www.youtube.com/watch?v=6Fl1rsxk4JQ', description: 'TCP performance optimization techniques' },
    { type: 'article', title: 'Window Scaling RFC 1323', url: 'https://tools.ietf.org/html/rfc1323', description: 'TCP extensions for high performance' },
    { type: 'tool', title: 'iperf3', url: 'https://iperf.fr/', description: 'Network bandwidth measurement tool' },
    { type: 'video', title: 'TCP Receive Window', url: 'https://www.youtube.com/watch?v=tOQOIrUU5pE', description: 'TCP receive window management' },
    { type: 'article', title: 'TCP Performance Tuning', url: 'https://www.tutorialspoint.com/tcp-performance-tuning', description: 'TCP performance optimization guide' },
    { type: 'tool', title: 'netstat', url: 'https://www.geeksforgeeks.org/netstat-command-linux/', description: 'Monitor TCP window sizes and statistics' }
  ],

  questions: [
    {
      question: "Explain TCP sliding window protocol and its purpose.",
      answer: "Sliding window allows multiple unacknowledged packets in transit, improving throughput. Window size = maximum unacknowledged data allowed. As ACKs arrive, window slides forward enabling new transmissions. Receiver advertises available buffer space (rwnd). Sender cannot exceed advertised window, preventing receiver buffer overflow. Balances throughput with flow control."
    },
    {
      question: "What happens when TCP advertises zero window?",
      answer: "Zero window means receiver buffer full, sender must stop data transmission. Sender enters persist mode: 1) Periodically sends zero window probes (1 byte), 2) Receiver responds with current window size, 3) When non-zero window advertised, sender resumes transmission. Prevents deadlock and ensures connection doesn't stall permanently."
    },
    {
      question: "How does TCP window scaling work and why is it needed?",
      answer: "Standard TCP window field is 16 bits (max 65KB), limiting high-bandwidth performance. Window scaling (RFC 1323): 1) Uses scaling factor (0-14) negotiated during handshake, 2) Effective window = advertised_window << scale_factor, 3) Enables windows up to 1GB, 4) Essential for high-speed, long-distance connections where BDP > 64KB."
    },
    {
      question: "What is the relationship between flow control and congestion control?",
      answer: "Flow control: End-to-end, prevents receiver buffer overflow, uses receiver window (rwnd). Congestion control: Network-wide, prevents network congestion, uses congestion window (cwnd). Effective sending window = min(rwnd, cwnd). Both work together: flow control protects receiver, congestion control protects network."
    },
    {
      question: "How do you calculate optimal TCP window size?",
      answer: "Optimal window ≥ Bandwidth-Delay Product (BDP). BDP = Bandwidth × RTT. Example: 100Mbps × 50ms = 625KB window needed. Window should accommodate data in transit during one RTT. Too small limits throughput, too large causes buffer bloat. Consider: receiver buffer capacity, network conditions, application requirements."
    },
    {
      question: "What are TCP window probes and when are they used?",
      answer: "Window probes sent when receiver advertises zero window: 1) Sender periodically sends 1-byte probe packets, 2) Receiver responds with current window advertisement, 3) Prevents connection deadlock, 4) Exponential backoff for probe intervals, 5) Continues until non-zero window or connection timeout. Essential for flow control reliability."
    },
    {
      question: "How does TCP handle window updates?",
      answer: "Window updates occur: 1) With every ACK packet (piggybacked), 2) Standalone window updates when buffer space increases, 3) Receiver tracks application data consumption, 4) Updates advertised window based on available buffer space, 5) Sender adjusts transmission rate accordingly. Dynamic adjustment optimizes throughput while preventing overflow."
    },
    {
      question: "What is silly window syndrome and how is it prevented?",
      answer: "Silly window syndrome: Small window advertisements lead to inefficient small packet transmissions. Prevention: 1) Receiver delays window updates until significant space available, 2) Sender delays transmission until reasonable amount of data ready, 3) Nagle's algorithm coalesces small writes, 4) Clark's solution for receiver-side prevention. Improves network efficiency."
    },
    {
      question: "How does TCP flow control affect network performance?",
      answer: "Flow control impacts: 1) Throughput - small windows limit data rate, 2) Latency - window exhaustion causes transmission delays, 3) Efficiency - proper sizing prevents retransmissions, 4) Fairness - multiple connections share bandwidth, 5) Buffer utilization - prevents overflow/underflow. Proper tuning critical for optimal performance."
    },
    {
      question: "What factors determine TCP receive window size?",
      answer: "Receive window factors: 1) Available buffer space at receiver, 2) Application consumption rate, 3) Memory constraints, 4) Network bandwidth-delay product, 5) Operating system settings, 6) Socket buffer sizes. Dynamic adjustment based on: buffer occupancy, application behavior, network conditions. Balances memory usage with performance."
    }
  ]
};