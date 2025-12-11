export const enhancedBandwidthThroughput = {
  id: 'bandwidth-throughput',
  title: 'Bandwidth and Throughput',
  subtitle: 'Network Performance Metrics',
  summary: 'Understanding the difference between bandwidth (theoretical capacity) and throughput (actual data transfer rate), including factors affecting network performance and measurement techniques.',
  
  analogy: "Think of bandwidth as the width of a highway - it determines how many cars can potentially travel side by side. Throughput is like the actual number of cars that successfully reach their destination per hour, which depends on traffic conditions, road quality, and driver behavior.",
  
  visualConcept: "Imagine a water pipe system where bandwidth is the pipe diameter (maximum flow capacity) and throughput is the actual water flow rate, which can be reduced by pipe bends, blockages, pressure variations, and valve restrictions.",
  
  realWorldUse: "Internet speed tests measuring download/upload rates, network capacity planning for organizations, video streaming quality optimization, and cloud service performance monitoring.",

  explanation: `
Bandwidth is the theoretical maximum data transfer capacity of a network medium, measured in bits per second (bps). It represents the range of frequencies available for signal transmission.

Throughput is the actual amount of data successfully transmitted over a network in a given time period. It's always less than or equal to bandwidth due to various limiting factors.

Key Differences:
- Bandwidth: Theoretical maximum capacity
- Throughput: Actual achieved performance
- Goodput: Useful data rate (excluding protocol overhead)

Factors Affecting Throughput:
1. Network Congestion: Multiple users sharing bandwidth
2. Protocol Overhead: Headers, acknowledgments, retransmissions
3. Latency: Round-trip time affecting protocol efficiency
4. Error Rates: Packet loss requiring retransmission
5. Hardware Limitations: Router/switch processing capacity
6. Software Bottlenecks: Application and OS limitations

Measurement Units:
- bps: bits per second (base unit)
- Kbps: Kilobits per second (1,000 bps)
- Mbps: Megabits per second (1,000,000 bps)
- Gbps: Gigabits per second (1,000,000,000 bps)

Performance Optimization:
- Quality of Service (QoS) implementation
- Traffic shaping and bandwidth allocation
- Protocol optimization
- Network infrastructure upgrades
  `,

  keyPoints: [
    "Bandwidth is theoretical maximum capacity, throughput is actual performance",
    "Throughput is always less than or equal to bandwidth",
    "Network congestion reduces available throughput per user",
    "Protocol overhead consumes bandwidth without carrying user data",
    "Latency affects throughput in interactive protocols like TCP",
    "Error rates cause retransmissions, reducing effective throughput",
    "Goodput measures useful data rate excluding protocol overhead",
    "Bandwidth is shared among all users on the same network segment",
    "Quality of Service (QoS) can prioritize critical traffic",
    "Proper network design maximizes throughput utilization"
  ],

  codeExamples: [
    {
      title: "Network Performance Calculator",
      language: "python",
      code: `
import time
import math

class NetworkPerformance:
    def __init__(self):
        self.protocols = {
            'tcp': {'overhead': 0.05, 'efficiency': 0.95},
            'udp': {'overhead': 0.02, 'efficiency': 0.98},
            'http': {'overhead': 0.15, 'efficiency': 0.85},
            'ftp': {'overhead': 0.08, 'efficiency': 0.92}
        }
    
    def calculate_throughput(self, bandwidth_mbps, utilization=1.0, 
                           protocol='tcp', error_rate=0.001):
        """Calculate actual throughput considering various factors"""
        bandwidth_bps = bandwidth_mbps * 1_000_000
        
        # Apply utilization factor
        available_bandwidth = bandwidth_bps * utilization
        
        # Apply protocol efficiency
        protocol_efficiency = self.protocols.get(protocol, {'efficiency': 0.9})['efficiency']
        
        # Calculate error impact (simplified model)
        error_impact = 1 - (error_rate * 10)  # 1% error = 10% throughput loss
        error_impact = max(0.1, error_impact)  # Minimum 10% efficiency
        
        throughput = available_bandwidth * protocol_efficiency * error_impact
        return throughput / 1_000_000  # Convert back to Mbps
    
    def calculate_goodput(self, throughput_mbps, protocol='tcp'):
        """Calculate goodput (useful data rate)"""
        overhead = self.protocols.get(protocol, {'overhead': 0.1})['overhead']
        return throughput_mbps * (1 - overhead)
    
    def bandwidth_delay_product(self, bandwidth_mbps, rtt_ms):
        """Calculate bandwidth-delay product (network capacity)"""
        bandwidth_bps = bandwidth_mbps * 1_000_000
        rtt_seconds = rtt_ms / 1000
        return (bandwidth_bps * rtt_seconds) / 8  # Return in bytes
    
    def tcp_window_size_required(self, bandwidth_mbps, rtt_ms):
        """Calculate required TCP window size for full bandwidth utilization"""
        bdp_bytes = self.bandwidth_delay_product(bandwidth_mbps, rtt_ms)
        return math.ceil(bdp_bytes / 1024)  # Return in KB
    
    def estimate_transfer_time(self, file_size_mb, throughput_mbps):
        """Estimate file transfer time"""
        file_size_bits = file_size_mb * 8 * 1_000_000
        throughput_bps = throughput_mbps * 1_000_000
        return file_size_bits / throughput_bps  # Return in seconds
    
    def network_efficiency(self, actual_throughput, theoretical_bandwidth):
        """Calculate network efficiency percentage"""
        return (actual_throughput / theoretical_bandwidth) * 100

# Usage example
perf = NetworkPerformance()

# Calculate throughput for 100 Mbps connection
bandwidth = 100  # Mbps
utilization = 0.8  # 80% network utilization
throughput = perf.calculate_throughput(bandwidth, utilization, 'tcp', 0.002)
goodput = perf.calculate_goodput(throughput, 'tcp')

print(f"Bandwidth: {bandwidth} Mbps")
print(f"Throughput: {throughput:.2f} Mbps")
print(f"Goodput: {goodput:.2f} Mbps")
print(f"Efficiency: {perf.network_efficiency(throughput, bandwidth):.1f}%")

# Calculate required TCP window size
rtt = 50  # ms
window_size = perf.tcp_window_size_required(bandwidth, rtt)
print(f"Required TCP window size: {window_size} KB")

# Estimate transfer time for 1 GB file
transfer_time = perf.estimate_transfer_time(1000, goodput)
print(f"1 GB transfer time: {transfer_time:.1f} seconds")
      `
    },
    {
      title: "Bandwidth Monitoring Tool",
      language: "java",
      code: `
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

public class BandwidthMonitor {
    private Queue<DataPoint> measurements;
    private long windowSizeMs;
    private double maxBandwidth;
    
    public static class DataPoint {
        public long timestamp;
        public long bytesTransferred;
        
        public DataPoint(long timestamp, long bytes) {
            this.timestamp = timestamp;
            this.bytesTransferred = bytes;
        }
    }
    
    public BandwidthMonitor(double maxBandwidthMbps, long windowSizeMs) {
        this.measurements = new ConcurrentLinkedQueue<>();
        this.maxBandwidth = maxBandwidthMbps * 1_000_000 / 8; // Convert to bytes/sec
        this.windowSizeMs = windowSizeMs;
    }
    
    public void recordTransfer(long bytes) {
        long currentTime = System.currentTimeMillis();
        measurements.offer(new DataPoint(currentTime, bytes));
        
        // Remove old measurements outside the window
        cleanOldMeasurements(currentTime);
    }
    
    private void cleanOldMeasurements(long currentTime) {
        while (!measurements.isEmpty() && 
               (currentTime - measurements.peek().timestamp) > windowSizeMs) {
            measurements.poll();
        }
    }
    
    public double getCurrentThroughput() {
        if (measurements.isEmpty()) return 0.0;
        
        long currentTime = System.currentTimeMillis();
        cleanOldMeasurements(currentTime);
        
        long totalBytes = measurements.stream()
            .mapToLong(dp -> dp.bytesTransferred)
            .sum();
        
        double timeWindowSeconds = windowSizeMs / 1000.0;
        double bytesPerSecond = totalBytes / timeWindowSeconds;
        
        return (bytesPerSecond * 8) / 1_000_000; // Convert to Mbps
    }
    
    public double getBandwidthUtilization() {
        double currentThroughput = getCurrentThroughput();
        double maxThroughputMbps = (maxBandwidth * 8) / 1_000_000;
        return (currentThroughput / maxThroughputMbps) * 100;
    }
    
    public BandwidthStats getStatistics() {
        if (measurements.isEmpty()) {
            return new BandwidthStats(0, 0, 0, 0);
        }
        
        List<Double> throughputSamples = new ArrayList<>();
        long windowStart = System.currentTimeMillis() - windowSizeMs;
        
        // Calculate throughput for each second in the window
        for (long time = windowStart; time < System.currentTimeMillis(); time += 1000) {
            long bytesInSecond = measurements.stream()
                .filter(dp -> dp.timestamp >= time && dp.timestamp < time + 1000)
                .mapToLong(dp -> dp.bytesTransferred)
                .sum();
            
            double mbps = (bytesInSecond * 8.0) / 1_000_000;
            throughputSamples.add(mbps);
        }
        
        double avg = throughputSamples.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        double max = throughputSamples.stream().mapToDouble(Double::doubleValue).max().orElse(0);
        double min = throughputSamples.stream().mapToDouble(Double::doubleValue).min().orElse(0);
        
        // Calculate standard deviation
        double variance = throughputSamples.stream()
            .mapToDouble(x -> Math.pow(x - avg, 2))
            .average().orElse(0);
        double stdDev = Math.sqrt(variance);
        
        return new BandwidthStats(avg, max, min, stdDev);
    }
    
    public static class BandwidthStats {
        public double average, maximum, minimum, standardDeviation;
        
        public BandwidthStats(double avg, double max, double min, double stdDev) {
            this.average = avg;
            this.maximum = max;
            this.minimum = min;
            this.standardDeviation = stdDev;
        }
        
        @Override
        public String toString() {
            return String.format(
                "Avg: %.2f Mbps, Max: %.2f Mbps, Min: %.2f Mbps, StdDev: %.2f",
                average, maximum, minimum, standardDeviation
            );
        }
    }
    
    public static void main(String[] args) throws InterruptedException {
        BandwidthMonitor monitor = new BandwidthMonitor(100, 10000); // 100 Mbps, 10s window
        
        // Simulate data transfers
        Random random = new Random();
        for (int i = 0; i < 20; i++) {
            long bytes = 1_000_000 + random.nextInt(5_000_000); // 1-6 MB
            monitor.recordTransfer(bytes);
            
            System.out.printf("Transfer %d: %.2f Mbps (%.1f%% utilization)\\n",
                i + 1, monitor.getCurrentThroughput(), monitor.getBandwidthUtilization());
            
            Thread.sleep(500);
        }
        
        System.out.println("\\nFinal Statistics: " + monitor.getStatistics());
    }
}
      `
    },
    {
      title: "Network Performance Analyzer",
      language: "javascript",
      code: `
class NetworkAnalyzer {
    constructor() {
        this.measurements = [];
        this.testResults = {};
    }
    
    // Measure download speed using fetch API
    async measureDownloadSpeed(url, durationMs = 10000) {
        const startTime = performance.now();
        let totalBytes = 0;
        let completed = false;
        
        const controller = new AbortController();
        setTimeout(() => {
            completed = true;
            controller.abort();
        }, durationMs);
        
        try {
            const response = await fetch(url, { 
                signal: controller.signal,
                cache: 'no-cache'
            });
            
            const reader = response.body.getReader();
            
            while (!completed) {
                const { done, value } = await reader.read();
                if (done) break;
                
                totalBytes += value.length;
                
                const currentTime = performance.now();
                const elapsedSeconds = (currentTime - startTime) / 1000;
                const currentSpeed = (totalBytes * 8) / (elapsedSeconds * 1_000_000); // Mbps
                
                this.measurements.push({
                    timestamp: currentTime,
                    bytes: totalBytes,
                    speed: currentSpeed
                });
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Download test error:', error);
            }
        }
        
        const endTime = performance.now();
        const totalSeconds = (endTime - startTime) / 1000;
        const averageSpeed = (totalBytes * 8) / (totalSeconds * 1_000_000);
        
        return {
            totalBytes,
            duration: totalSeconds,
            averageSpeed,
            measurements: this.measurements
        };
    }
    
    // Calculate network statistics
    calculateStatistics(measurements) {
        if (!measurements || measurements.length === 0) {
            return null;
        }
        
        const speeds = measurements.map(m => m.speed);
        const sum = speeds.reduce((a, b) => a + b, 0);
        const avg = sum / speeds.length;
        const max = Math.max(...speeds);
        const min = Math.min(...speeds);
        
        // Calculate jitter (speed variation)
        const variance = speeds.reduce((acc, speed) => {
            return acc + Math.pow(speed - avg, 2);
        }, 0) / speeds.length;
        
        const jitter = Math.sqrt(variance);
        
        // Calculate consistency (percentage of measurements within 10% of average)
        const consistentMeasurements = speeds.filter(speed => 
            Math.abs(speed - avg) / avg <= 0.1
        ).length;
        const consistency = (consistentMeasurements / speeds.length) * 100;
        
        return {
            average: avg,
            maximum: max,
            minimum: min,
            jitter: jitter,
            consistency: consistency,
            efficiency: (avg / max) * 100
        };
    }
    
    // Estimate bandwidth requirements
    estimateBandwidthNeeds(applications) {
        const requirements = {
            'web_browsing': 1, // Mbps
            'email': 0.1,
            'video_call_hd': 2,
            'video_call_4k': 8,
            'streaming_hd': 5,
            'streaming_4k': 25,
            'gaming': 3,
            'file_download': 10,
            'cloud_backup': 5
        };
        
        let totalBandwidth = 0;
        let peakBandwidth = 0;
        
        applications.forEach(app => {
            const bandwidth = requirements[app.type] || 1;
            const concurrent = app.concurrent || 1;
            const usage = bandwidth * concurrent;
            
            totalBandwidth += usage * (app.utilizationFactor || 0.7);
            peakBandwidth += usage;
        });
        
        return {
            averageNeeded: Math.ceil(totalBandwidth),
            peakNeeded: Math.ceil(peakBandwidth),
            recommendedCapacity: Math.ceil(peakBandwidth * 1.5), // 50% overhead
            applications: applications.map(app => ({
                ...app,
                bandwidth: requirements[app.type] || 1
            }))
        };
    }
    
    // Generate performance report
    generateReport(testResults, applications = []) {
        const stats = this.calculateStatistics(testResults.measurements);
        const bandwidth = this.estimateBandwidthNeeds(applications);
        
        return {
            testSummary: {
                averageSpeed: testResults.averageSpeed.toFixed(2) + ' Mbps',
                totalData: (testResults.totalBytes / (1024 * 1024)).toFixed(2) + ' MB',
                duration: testResults.duration.toFixed(1) + ' seconds'
            },
            performance: stats ? {
                consistency: stats.consistency.toFixed(1) + '%',
                jitter: stats.jitter.toFixed(2) + ' Mbps',
                efficiency: stats.efficiency.toFixed(1) + '%',
                speedRange: \`\${stats.minimum.toFixed(1)} - \${stats.maximum.toFixed(1)} Mbps\`
            } : null,
            recommendations: {
                currentCapacity: testResults.averageSpeed.toFixed(1) + ' Mbps',
                recommendedFor: bandwidth.recommendedCapacity + ' Mbps',
                adequateFor: testResults.averageSpeed >= bandwidth.averageNeeded ? 
                    'Current applications' : 'Basic usage only',
                upgradeNeeded: testResults.averageSpeed < bandwidth.peakNeeded
            }
        };
    }
}

// Usage example
const analyzer = new NetworkAnalyzer();

// Example applications
const myApplications = [
    { type: 'video_call_hd', concurrent: 2, utilizationFactor: 0.8 },
    { type: 'streaming_hd', concurrent: 1, utilizationFactor: 0.9 },
    { type: 'web_browsing', concurrent: 3, utilizationFactor: 0.5 },
    { type: 'cloud_backup', concurrent: 1, utilizationFactor: 0.3 }
];

// Simulate test results
const simulatedResults = {
    averageSpeed: 45.7,
    totalBytes: 52428800,
    duration: 10.2,
    measurements: Array.from({length: 20}, (_, i) => ({
        timestamp: i * 500,
        bytes: (i + 1) * 2621440,
        speed: 42 + Math.random() * 8
    }))
};

const report = analyzer.generateReport(simulatedResults, myApplications);
console.log('Network Performance Report:', JSON.stringify(report, null, 2));
      `
    }
  ],

  resources: [
    {
      title: "Bandwidth vs Throughput - GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/difference-between-bandwidth-and-throughput/",
      description: "Detailed comparison of bandwidth and throughput concepts"
    },
    {
      title: "Network Performance Monitoring - YouTube",
      url: "https://www.youtube.com/watch?v=VLHJn1bWulU",
      description: "Practical guide to measuring and monitoring network performance"
    },
    {
      title: "TCP Window Scaling and Performance",
      url: "https://www.cisco.com/c/en/us/support/docs/ip/transmission-control-protocol-tcp/10893-tcp-window-scale-option.html",
      description: "Understanding TCP window scaling for high-bandwidth networks"
    },
    {
      title: "Speedtest.net - Internet Speed Test",
      url: "https://www.speedtest.net/",
      description: "Popular tool for measuring internet bandwidth and latency"
    },
    {
      title: "Network Performance Analysis Tools",
      url: "https://www.solarwinds.com/network-performance-monitor",
      description: "Professional network monitoring and analysis solutions"
    }
  ],

  questions: [
    {
      question: "What is the difference between bandwidth and throughput?",
      answer: "Bandwidth is the theoretical maximum data transfer capacity of a network medium (like pipe diameter), while throughput is the actual amount of data successfully transmitted (actual water flow). Throughput is always less than or equal to bandwidth due to factors like network congestion, protocol overhead, and errors."
    },
    {
      question: "Why is actual throughput always less than the advertised bandwidth?",
      answer: "Throughput is reduced by: protocol overhead (headers, acknowledgments), network congestion (shared bandwidth), error rates requiring retransmissions, hardware limitations, latency affecting protocol efficiency, and software bottlenecks in applications or operating systems."
    },
    {
      question: "What is goodput and how does it differ from throughput?",
      answer: "Goodput is the useful data rate excluding protocol overhead - the actual application data transferred. While throughput includes all transmitted bits (data + headers), goodput only counts the payload data that applications can use. For example, if throughput is 100 Mbps with 10% overhead, goodput is 90 Mbps."
    },
    {
      question: "How does network latency affect throughput?",
      answer: "High latency reduces throughput in protocols like TCP that require acknowledgments. The bandwidth-delay product determines how much data can be 'in flight' simultaneously. Higher latency requires larger TCP window sizes to maintain full bandwidth utilization, and increases the time to detect and recover from packet loss."
    },
    {
      question: "What factors should be considered when measuring network performance?",
      answer: "Consider: time of measurement (peak vs off-peak hours), test duration for statistical accuracy, multiple measurement points, protocol overhead, error rates, jitter (speed variation), consistency over time, and real-world application requirements rather than just raw speed tests."
    },
    {
      question: "How do you calculate the bandwidth-delay product?",
      answer: "Bandwidth-delay product = Bandwidth × Round-trip time. For example, 100 Mbps × 50ms = 100,000,000 bps × 0.05s = 5,000,000 bits = 625,000 bytes. This represents the network 'capacity' - how much data can be transmitted before receiving the first acknowledgment."
    },
    {
      question: "What is the impact of protocol overhead on effective throughput?",
      answer: "Protocol overhead reduces effective throughput by adding headers, control messages, and acknowledgments. TCP has ~5% overhead, HTTP can have 15%+, while UDP has only ~2%. The overhead percentage increases with smaller packet sizes and decreases with larger payloads."
    },
    {
      question: "How does network congestion affect bandwidth utilization?",
      answer: "Network congestion occurs when demand exceeds available bandwidth. It causes: increased packet loss requiring retransmissions, higher latency affecting protocol efficiency, reduced throughput per user as bandwidth is shared, and potential quality degradation for real-time applications like video calls."
    },
    {
      question: "What is Quality of Service (QoS) and how does it help manage bandwidth?",
      answer: "QoS is a set of techniques to manage network resources by prioritizing certain types of traffic. It helps by: allocating guaranteed bandwidth to critical applications, limiting bandwidth for less important traffic, reducing latency for real-time applications, and ensuring fair resource distribution among users."
    },
    {
      question: "How do you optimize network throughput in a TCP connection?",
      answer: "Optimize TCP throughput by: increasing TCP window size to match bandwidth-delay product, enabling window scaling for high-bandwidth networks, reducing packet loss through better network design, minimizing latency, using appropriate congestion control algorithms, and optimizing application buffer sizes."
    }
  ]
};