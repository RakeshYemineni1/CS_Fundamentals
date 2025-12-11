export const enhancedLatencyThroughput = {
  id: 'latency-throughput',
  title: 'Latency vs Throughput',
  subtitle: 'Network Performance Metrics',
  summary: 'Understanding the difference between latency (response time) and throughput (data transfer rate), their relationship, trade-offs, and optimization strategies for network performance.',
  
  analogy: "Think of latency vs throughput like a highway system. Latency is how long it takes for one car to travel from point A to point B (response time). Throughput is how many cars can travel the highway per hour (capacity). A highway can have low latency (fast travel time) but low throughput (narrow road), or high latency (traffic jams) but high throughput (many lanes).",
  
  visualConcept: "Imagine latency as the time it takes for a message to travel through a pipe, while throughput is the diameter of the pipe determining how much data can flow through it simultaneously.",
  
  realWorldUse: "Online gaming (low latency critical), video streaming (high throughput needed), file downloads, web browsing, VoIP calls, and database queries.",

  explanation: `
Latency and throughput are fundamental network performance metrics that measure different aspects of data transmission.

Latency
The time delay between sending a request and receiving a response. Measured in milliseconds (ms) and includes:
- Propagation delay: Physical signal travel time
- Transmission delay: Time to push data onto the link
- Processing delay: Router/switch processing time
- Queuing delay: Time waiting in buffers

Throughput
The amount of data successfully transmitted over a network in a given time period. Measured in bits per second (bps) and affected by:
- Bandwidth: Maximum theoretical capacity
- Network congestion: Shared resource contention
- Protocol overhead: Headers and control data
- Error rates: Retransmissions reducing effective throughput

Relationship and Trade-offs:

Bandwidth-Delay Product
The amount of data that can be "in flight" simultaneously, calculated as bandwidth × round-trip time. Important for protocol efficiency.

Latency-Throughput Trade-off
Optimizing for one may negatively impact the other:
- Low latency often requires smaller packet sizes (lower throughput)
- High throughput may require larger buffers (higher latency)
- Network protocols must balance both requirements

Application Requirements:
- Interactive applications: Prioritize low latency
- Bulk data transfer: Prioritize high throughput
- Real-time streaming: Balance both metrics
- Web browsing: Optimize for perceived performance

Optimization Strategies:
- Caching: Reduces latency for repeated requests
- Compression: Improves effective throughput
- Protocol tuning: Balances latency and throughput
- Quality of Service: Prioritizes critical traffic
  `,

  keyPoints: [
    "Latency measures response time, throughput measures data transfer rate",
    "Both metrics are crucial for network performance optimization",
    "Bandwidth-delay product determines network capacity utilization",
    "Different applications prioritize different metrics",
    "Geographic distance directly affects latency",
    "Network congestion impacts both latency and throughput",
    "Protocol design involves latency-throughput trade-offs",
    "Caching and CDNs primarily reduce latency",
    "Compression and aggregation improve throughput",
    "Quality of Service helps manage both metrics"
  ],

  codeExamples: [
    {
      title: "Network Performance Measurement Tool",
      language: "python",
      code: `
import time
import socket
import threading
import statistics
from datetime import datetime
import requests
import subprocess
import platform

class NetworkPerformanceMeter:
    def __init__(self):
        self.measurements = []
        self.active_tests = []
        
    def measure_latency(self, host, port=80, timeout=5, samples=10):
        """Measure network latency using TCP connect time"""
        latencies = []
        
        for i in range(samples):
            start_time = time.time()
            
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(timeout)
                
                # Measure connection establishment time
                result = sock.connect_ex((host, port))
                
                if result == 0:
                    latency = (time.time() - start_time) * 1000  # Convert to ms
                    latencies.append(latency)
                
                sock.close()
                
            except Exception as e:
                print(f"Latency measurement error: {e}")
            
            # Small delay between measurements
            time.sleep(0.1)
        
        if latencies:
            return {
                'host': host,
                'port': port,
                'samples': len(latencies),
                'min_latency': min(latencies),
                'max_latency': max(latencies),
                'avg_latency': statistics.mean(latencies),
                'median_latency': statistics.median(latencies),
                'std_dev': statistics.stdev(latencies) if len(latencies) > 1 else 0,
                'jitter': max(latencies) - min(latencies),
                'packet_loss': ((samples - len(latencies)) / samples) * 100
            }
        
        return None
    
    def measure_ping_latency(self, host, count=10):
        """Measure latency using system ping command"""
        try:
            system = platform.system().lower()
            
            if system == "windows":
                cmd = f"ping -n {count} {host}"
            else:
                cmd = f"ping -c {count} {host}"
            
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            
            if result.returncode == 0:
                return self._parse_ping_output(result.stdout, system)
            else:
                return None
                
        except Exception as e:
            print(f"Ping measurement error: {e}")
            return None
    
    def _parse_ping_output(self, output, system):
        """Parse ping command output to extract latency statistics"""
        lines = output.split('\\n')
        latencies = []
        
        for line in lines:
            if 'time=' in line or 'time<' in line:
                try:
                    if system == "windows":
                        # Windows: time=1ms or time<1ms
                        time_part = line.split('time')[1].split('ms')[0]
                        if '<' in time_part:
                            latency = float(time_part.replace('<', '').replace('=', ''))
                        else:
                            latency = float(time_part.replace('=', ''))
                    else:
                        # Unix: time=1.234 ms
                        time_part = line.split('time=')[1].split(' ms')[0]
                        latency = float(time_part)
                    
                    latencies.append(latency)
                except:
                    continue
        
        if latencies:
            return {
                'samples': len(latencies),
                'min_latency': min(latencies),
                'max_latency': max(latencies),
                'avg_latency': statistics.mean(latencies),
                'median_latency': statistics.median(latencies),
                'jitter': max(latencies) - min(latencies)
            }
        
        return None
    
    def measure_throughput(self, url, duration=10, chunk_size=8192):
        """Measure network throughput by downloading data"""
        start_time = time.time()
        total_bytes = 0
        measurements = []
        
        try:
            response = requests.get(url, stream=True, timeout=30)
            response.raise_for_status()
            
            chunk_start = time.time()
            
            for chunk in response.iter_content(chunk_size=chunk_size):
                if chunk:
                    total_bytes += len(chunk)
                    current_time = time.time()
                    
                    # Record throughput measurement every second
                    if current_time - chunk_start >= 1.0:
                        elapsed = current_time - start_time
                        current_throughput = (total_bytes * 8) / elapsed  # bits per second
                        
                        measurements.append({
                            'timestamp': current_time,
                            'elapsed_time': elapsed,
                            'bytes_downloaded': total_bytes,
                            'throughput_bps': current_throughput,
                            'throughput_mbps': current_throughput / 1_000_000
                        })
                        
                        chunk_start = current_time
                    
                    # Stop after specified duration
                    if time.time() - start_time >= duration:
                        break
            
            total_time = time.time() - start_time
            
            if total_time > 0:
                avg_throughput_bps = (total_bytes * 8) / total_time
                
                return {
                    'url': url,
                    'duration': total_time,
                    'total_bytes': total_bytes,
                    'total_mb': total_bytes / (1024 * 1024),
                    'avg_throughput_bps': avg_throughput_bps,
                    'avg_throughput_mbps': avg_throughput_bps / 1_000_000,
                    'measurements': measurements,
                    'peak_throughput': max([m['throughput_mbps'] for m in measurements]) if measurements else 0,
                    'min_throughput': min([m['throughput_mbps'] for m in measurements]) if measurements else 0
                }
        
        except Exception as e:
            print(f"Throughput measurement error: {e}")
            return None
    
    def measure_http_performance(self, url, requests_count=10):
        """Measure HTTP request/response performance"""
        results = []
        
        for i in range(requests_count):
            start_time = time.time()
            
            try:
                response = requests.get(url, timeout=10)
                end_time = time.time()
                
                total_time = (end_time - start_time) * 1000  # Convert to ms
                
                results.append({
                    'request_id': i + 1,
                    'status_code': response.status_code,
                    'response_time': total_time,
                    'content_length': len(response.content),
                    'success': response.status_code == 200
                })
                
            except Exception as e:
                results.append({
                    'request_id': i + 1,
                    'status_code': 0,
                    'response_time': 0,
                    'content_length': 0,
                    'success': False,
                    'error': str(e)
                })
            
            # Small delay between requests
            time.sleep(0.1)
        
        # Calculate statistics
        successful_requests = [r for r in results if r['success']]
        
        if successful_requests:
            response_times = [r['response_time'] for r in successful_requests]
            
            return {
                'url': url,
                'total_requests': requests_count,
                'successful_requests': len(successful_requests),
                'success_rate': (len(successful_requests) / requests_count) * 100,
                'avg_response_time': statistics.mean(response_times),
                'min_response_time': min(response_times),
                'max_response_time': max(response_times),
                'median_response_time': statistics.median(response_times),
                'std_dev': statistics.stdev(response_times) if len(response_times) > 1 else 0,
                'requests_per_second': len(successful_requests) / (max(response_times) / 1000) if response_times else 0,
                'detailed_results': results
            }
        
        return None
    
    def calculate_bandwidth_delay_product(self, bandwidth_mbps, rtt_ms):
        """Calculate bandwidth-delay product"""
        bandwidth_bps = bandwidth_mbps * 1_000_000
        rtt_seconds = rtt_ms / 1000
        
        bdp_bits = bandwidth_bps * rtt_seconds
        bdp_bytes = bdp_bits / 8
        
        return {
            'bandwidth_mbps': bandwidth_mbps,
            'rtt_ms': rtt_ms,
            'bdp_bits': bdp_bits,
            'bdp_bytes': bdp_bytes,
            'bdp_kb': bdp_bytes / 1024,
            'optimal_window_size': bdp_bytes
        }
    
    def analyze_performance_trade_offs(self, latency_ms, throughput_mbps, application_type):
        """Analyze performance characteristics for different application types"""
        
        application_requirements = {
            'gaming': {'max_latency': 50, 'min_throughput': 1},
            'video_streaming': {'max_latency': 200, 'min_throughput': 25},
            'web_browsing': {'max_latency': 100, 'min_throughput': 5},
            'file_transfer': {'max_latency': 1000, 'min_throughput': 100},
            'voip': {'max_latency': 150, 'min_throughput': 0.1},
            'video_conference': {'max_latency': 200, 'min_throughput': 2}
        }
        
        requirements = application_requirements.get(application_type, {})
        
        analysis = {
            'application_type': application_type,
            'current_latency': latency_ms,
            'current_throughput': throughput_mbps,
            'requirements': requirements
        }
        
        if requirements:
            latency_ok = latency_ms <= requirements['max_latency']
            throughput_ok = throughput_mbps >= requirements['min_throughput']
            
            analysis.update({
                'latency_acceptable': latency_ok,
                'throughput_acceptable': throughput_ok,
                'overall_performance': 'Good' if latency_ok and throughput_ok else 'Poor',
                'bottleneck': 'Latency' if not latency_ok else 'Throughput' if not throughput_ok else None
            })
        
        return analysis
    
    def run_comprehensive_test(self, target_host, test_url=None):
        """Run comprehensive network performance test"""
        print(f"Running comprehensive network test for {target_host}")
        
        results = {
            'target': target_host,
            'timestamp': datetime.now().isoformat(),
            'tests': {}
        }
        
        # Test 1: Ping latency
        print("Testing ping latency...")
        ping_result = self.measure_ping_latency(target_host)
        if ping_result:
            results['tests']['ping_latency'] = ping_result
        
        # Test 2: TCP connection latency
        print("Testing TCP connection latency...")
        tcp_result = self.measure_latency(target_host, 80)
        if tcp_result:
            results['tests']['tcp_latency'] = tcp_result
        
        # Test 3: HTTP performance
        if test_url:
            print("Testing HTTP performance...")
            http_result = self.measure_http_performance(test_url)
            if http_result:
                results['tests']['http_performance'] = http_result
            
            # Test 4: Throughput measurement
            print("Testing throughput...")
            throughput_result = self.measure_throughput(test_url, duration=5)
            if throughput_result:
                results['tests']['throughput'] = throughput_result
        
        return results

# Usage example
if __name__ == "__main__":
    meter = NetworkPerformanceMeter()
    
    # Test different scenarios
    test_targets = [
        {'host': 'google.com', 'url': 'https://www.google.com'},
        {'host': 'github.com', 'url': 'https://github.com'},
    ]
    
    print("=== Network Performance Analysis ===")
    
    for target in test_targets:
        print(f"\\n--- Testing {target['host']} ---")
        
        # Run comprehensive test
        results = meter.run_comprehensive_test(target['host'], target['url'])
        
        # Display results
        if 'ping_latency' in results['tests']:
            ping = results['tests']['ping_latency']
            print(f"Ping Latency: {ping['avg_latency']:.2f}ms (min: {ping['min_latency']:.2f}ms, max: {ping['max_latency']:.2f}ms)")
        
        if 'http_performance' in results['tests']:
            http = results['tests']['http_performance']
            print(f"HTTP Response Time: {http['avg_response_time']:.2f}ms (success rate: {http['success_rate']:.1f}%)")
        
        if 'throughput' in results['tests']:
            throughput = results['tests']['throughput']
            print(f"Throughput: {throughput['avg_throughput_mbps']:.2f} Mbps ({throughput['total_mb']:.2f} MB in {throughput['duration']:.1f}s)")
        
        # Analyze for different application types
        if 'ping_latency' in results['tests'] and 'throughput' in results['tests']:
            latency = results['tests']['ping_latency']['avg_latency']
            throughput_mbps = results['tests']['throughput']['avg_throughput_mbps']
            
            print("\\nApplication Suitability:")
            for app_type in ['gaming', 'video_streaming', 'web_browsing']:
                analysis = meter.analyze_performance_trade_offs(latency, throughput_mbps, app_type)
                status = "✓" if analysis.get('overall_performance') == 'Good' else "✗"
                print(f"  {status} {app_type.replace('_', ' ').title()}: {analysis.get('overall_performance', 'Unknown')}")
        
        # Calculate bandwidth-delay product
        if 'ping_latency' in results['tests'] and 'throughput' in results['tests']:
            latency = results['tests']['ping_latency']['avg_latency']
            throughput_mbps = results['tests']['throughput']['avg_throughput_mbps']
            
            bdp = meter.calculate_bandwidth_delay_product(throughput_mbps, latency)
            print(f"\\nBandwidth-Delay Product: {bdp['bdp_kb']:.2f} KB")
            print(f"Optimal TCP Window Size: {bdp['optimal_window_size']:.0f} bytes")
      `
    },
    {
      title: "Performance Optimization Simulator",
      language: "javascript",
      code: `
class NetworkPerformanceSimulator {
    constructor() {
        this.scenarios = new Map();
        this.optimizations = new Map();
        
        this.initializeScenarios();
        this.initializeOptimizations();
    }
    
    initializeScenarios() {
        this.scenarios.set('gaming', {
            name: 'Online Gaming',
            latencyWeight: 0.8,
            throughputWeight: 0.2,
            maxAcceptableLatency: 50, // ms
            minRequiredThroughput: 1, // Mbps
            description: 'Real-time multiplayer gaming requiring instant response'
        });
        
        this.scenarios.set('streaming', {
            name: 'Video Streaming',
            latencyWeight: 0.3,
            throughputWeight: 0.7,
            maxAcceptableLatency: 200,
            minRequiredThroughput: 25,
            description: '4K video streaming with minimal buffering'
        });
        
        this.scenarios.set('web_browsing', {
            name: 'Web Browsing',
            latencyWeight: 0.6,
            throughputWeight: 0.4,
            maxAcceptableLatency: 100,
            minRequiredThroughput: 5,
            description: 'General web browsing and social media'
        });
        
        this.scenarios.set('file_transfer', {
            name: 'File Transfer',
            latencyWeight: 0.1,
            throughputWeight: 0.9,
            maxAcceptableLatency: 1000,
            minRequiredThroughput: 100,
            description: 'Large file downloads and uploads'
        });
        
        this.scenarios.set('video_call', {
            name: 'Video Conferencing',
            latencyWeight: 0.7,
            throughputWeight: 0.3,
            maxAcceptableLatency: 150,
            minRequiredThroughput: 2,
            description: 'Real-time video communication'
        });
    }
    
    initializeOptimizations() {
        this.optimizations.set('caching', {
            name: 'Content Caching',
            latencyImprovement: 0.7, // 70% reduction
            throughputImprovement: 0.1, // 10% improvement
            cost: 'Medium',
            complexity: 'Low',
            description: 'Cache frequently accessed content closer to users'
        });
        
        this.optimizations.set('cdn', {
            name: 'Content Delivery Network',
            latencyImprovement: 0.6,
            throughputImprovement: 0.3,
            cost: 'High',
            complexity: 'Medium',
            description: 'Distribute content globally via edge servers'
        });
        
        this.optimizations.set('compression', {
            name: 'Data Compression',
            latencyImprovement: 0.1,
            throughputImprovement: 0.4,
            cost: 'Low',
            complexity: 'Low',
            description: 'Compress data to reduce transfer size'
        });
        
        this.optimizations.set('protocol_optimization', {
            name: 'Protocol Optimization',
            latencyImprovement: 0.3,
            throughputImprovement: 0.2,
            cost: 'Low',
            complexity: 'High',
            description: 'Optimize network protocols and configurations'
        });
        
        this.optimizations.set('bandwidth_upgrade', {
            name: 'Bandwidth Upgrade',
            latencyImprovement: 0.1,
            throughputImprovement: 0.8,
            cost: 'High',
            complexity: 'Low',
            description: 'Increase available network bandwidth'
        });
        
        this.optimizations.set('qos', {
            name: 'Quality of Service',
            latencyImprovement: 0.4,
            throughputImprovement: 0.2,
            cost: 'Medium',
            complexity: 'Medium',
            description: 'Prioritize critical traffic types'
        });
    }
    
    simulateNetworkConditions(baseLatency, baseThroughput, congestionLevel = 0.5, distance = 1000) {
        // Simulate realistic network conditions
        const propagationDelay = distance / 200000; // Speed of light in fiber ~200,000 km/s
        const congestionMultiplier = 1 + (congestionLevel * 2); // 0.5 congestion = 2x latency
        const jitter = Math.random() * 10; // Random jitter up to 10ms
        
        const simulatedLatency = (baseLatency + propagationDelay) * congestionMultiplier + jitter;
        const simulatedThroughput = baseThroughput / congestionMultiplier;
        
        return {
            latency: Math.max(1, simulatedLatency), // Minimum 1ms
            throughput: Math.max(0.1, simulatedThroughput), // Minimum 0.1 Mbps
            congestionLevel,
            distance,
            jitter
        };
    }
    
    calculatePerformanceScore(latency, throughput, scenario) {
        const scenarioConfig = this.scenarios.get(scenario);
        if (!scenarioConfig) return 0;
        
        // Normalize latency score (lower is better)
        const latencyScore = Math.max(0, 1 - (latency / scenarioConfig.maxAcceptableLatency));
        
        // Normalize throughput score (higher is better)
        const throughputScore = Math.min(1, throughput / scenarioConfig.minRequiredThroughput);
        
        // Weighted combination
        const overallScore = (latencyScore * scenarioConfig.latencyWeight) + 
                           (throughputScore * scenarioConfig.throughputWeight);
        
        return {
            overallScore: overallScore * 100, // Convert to percentage
            latencyScore: latencyScore * 100,
            throughputScore: throughputScore * 100,
            latencyAcceptable: latency <= scenarioConfig.maxAcceptableLatency,
            throughputAcceptable: throughput >= scenarioConfig.minRequiredThroughput
        };
    }
    
    applyOptimizations(baseLatency, baseThroughput, optimizationList) {
        let optimizedLatency = baseLatency;
        let optimizedThroughput = baseThroughput;
        let totalCost = 0;
        let maxComplexity = 'Low';
        
        const complexityLevels = { 'Low': 1, 'Medium': 2, 'High': 3 };
        const costLevels = { 'Low': 1, 'Medium': 2, 'High': 3 };
        
        for (const optimizationName of optimizationList) {
            const optimization = this.optimizations.get(optimizationName);
            if (optimization) {
                // Apply latency improvement (multiplicative)
                optimizedLatency *= (1 - optimization.latencyImprovement);
                
                // Apply throughput improvement (multiplicative)
                optimizedThroughput *= (1 + optimization.throughputImprovement);
                
                // Accumulate cost and complexity
                totalCost += costLevels[optimization.cost];
                if (complexityLevels[optimization.complexity] > complexityLevels[maxComplexity]) {
                    maxComplexity = optimization.complexity;
                }
            }
        }
        
        return {
            originalLatency: baseLatency,
            originalThroughput: baseThroughput,
            optimizedLatency: Math.max(1, optimizedLatency),
            optimizedThroughput: optimizedThroughput,
            latencyImprovement: ((baseLatency - optimizedLatency) / baseLatency) * 100,
            throughputImprovement: ((optimizedThroughput - baseThroughput) / baseThroughput) * 100,
            totalCost: totalCost,
            maxComplexity: maxComplexity,
            appliedOptimizations: optimizationList
        };
    }
    
    findOptimalOptimizations(baseLatency, baseThroughput, scenario, budget = 10, maxComplexity = 'High') {
        const scenarioConfig = this.scenarios.get(scenario);
        if (!scenarioConfig) return null;
        
        const complexityLevels = { 'Low': 1, 'Medium': 2, 'High': 3 };
        const costLevels = { 'Low': 1, 'Medium': 2, 'High': 3 };
        const maxComplexityLevel = complexityLevels[maxComplexity];
        
        // Generate all possible combinations of optimizations
        const optimizationNames = Array.from(this.optimizations.keys());
        const combinations = this.generateCombinations(optimizationNames);
        
        let bestCombination = null;
        let bestScore = 0;
        
        for (const combination of combinations) {
            // Check if combination fits budget and complexity constraints
            let totalCost = 0;
            let maxCombinationComplexity = 1;
            
            for (const optName of combination) {
                const opt = this.optimizations.get(optName);
                totalCost += costLevels[opt.cost];
                maxCombinationComplexity = Math.max(maxCombinationComplexity, 
                                                   complexityLevels[opt.complexity]);
            }
            
            if (totalCost <= budget && maxCombinationComplexity <= maxComplexityLevel) {
                const result = this.applyOptimizations(baseLatency, baseThroughput, combination);
                const score = this.calculatePerformanceScore(
                    result.optimizedLatency, 
                    result.optimizedThroughput, 
                    scenario
                );
                
                if (score.overallScore > bestScore) {
                    bestScore = score.overallScore;
                    bestCombination = {
                        ...result,
                        performanceScore: score,
                        costEfficiency: score.overallScore / totalCost
                    };
                }
            }
        }
        
        return bestCombination;
    }
    
    generateCombinations(array) {
        const combinations = [];
        const maxLength = Math.min(array.length, 4); // Limit to prevent explosion
        
        // Generate all possible combinations up to maxLength
        for (let i = 1; i < (1 << array.length) && combinations.length < 100; i++) {
            const combination = [];
            for (let j = 0; j < array.length; j++) {
                if (i & (1 << j)) {
                    combination.push(array[j]);
                }
            }
            if (combination.length <= maxLength) {
                combinations.push(combination);
            }
        }
        
        return combinations;
    }
    
    runPerformanceAnalysis(baseLatency, baseThroughput, scenarios = null) {
        if (!scenarios) {
            scenarios = Array.from(this.scenarios.keys());
        }
        
        const analysis = {
            baseConditions: { latency: baseLatency, throughput: baseThroughput },
            scenarioAnalysis: {},
            recommendations: []
        };
        
        for (const scenario of scenarios) {
            const score = this.calculatePerformanceScore(baseLatency, baseThroughput, scenario);
            const optimal = this.findOptimalOptimizations(baseLatency, baseThroughput, scenario);
            
            analysis.scenarioAnalysis[scenario] = {
                scenarioName: this.scenarios.get(scenario).name,
                currentScore: score,
                optimalOptimizations: optimal,
                improvement: optimal ? {
                    scoreImprovement: optimal.performanceScore.overallScore - score.overallScore,
                    latencyReduction: optimal.latencyImprovement,
                    throughputIncrease: optimal.throughputImprovement
                } : null
            };
            
            // Generate recommendations
            if (score.overallScore < 70) { // Poor performance
                if (!score.latencyAcceptable) {
                    analysis.recommendations.push({
                        scenario,
                        issue: 'High Latency',
                        suggestion: 'Consider CDN, caching, or protocol optimization',
                        priority: 'High'
                    });
                }
                
                if (!score.throughputAcceptable) {
                    analysis.recommendations.push({
                        scenario,
                        issue: 'Low Throughput',
                        suggestion: 'Consider bandwidth upgrade or compression',
                        priority: 'High'
                    });
                }
            }
        }
        
        return analysis;
    }
    
    generateReport(analysis) {
        let report = "=== Network Performance Analysis Report ===\\n\\n";
        
        report += \`Base Conditions:\\n\`;
        report += \`  Latency: \${analysis.baseConditions.latency.toFixed(2)} ms\\n\`;
        report += \`  Throughput: \${analysis.baseConditions.throughput.toFixed(2)} Mbps\\n\\n\`;
        
        report += "Scenario Analysis:\\n";
        for (const [scenario, data] of Object.entries(analysis.scenarioAnalysis)) {
            report += \`\\n\${data.scenarioName}:\\n\`;
            report += \`  Current Score: \${data.currentScore.overallScore.toFixed(1)}%\\n\`;
            report += \`  Latency Acceptable: \${data.currentScore.latencyAcceptable ? 'Yes' : 'No'}\\n\`;
            report += \`  Throughput Acceptable: \${data.currentScore.throughputAcceptable ? 'Yes' : 'No'}\\n\`;
            
            if (data.optimalOptimizations) {
                report += \`  Recommended Optimizations: \${data.optimalOptimizations.appliedOptimizations.join(', ')}\\n\`;
                report += \`  Potential Score Improvement: +\${data.improvement.scoreImprovement.toFixed(1)}%\\n\`;
            }
        }
        
        if (analysis.recommendations.length > 0) {
            report += "\\n\\nRecommendations:\\n";
            analysis.recommendations.forEach((rec, index) => {
                report += \`\${index + 1}. [\${rec.priority}] \${rec.issue} for \${rec.scenario}: \${rec.suggestion}\\n\`;
            });
        }
        
        return report;
    }
}

// Usage example
const simulator = new NetworkPerformanceSimulator();

// Test different network conditions
const testConditions = [
    { name: 'Fiber Connection', latency: 10, throughput: 100 },
    { name: 'Cable Internet', latency: 25, throughput: 50 },
    { name: 'DSL Connection', latency: 40, throughput: 10 },
    { name: 'Satellite Internet', latency: 600, throughput: 25 },
    { name: 'Mobile 4G', latency: 50, throughput: 20 }
];

console.log('=== Network Performance Simulation ===');

testConditions.forEach(condition => {
    console.log(\`\\n--- \${condition.name} ---\`);
    
    // Simulate realistic conditions with congestion
    const simulated = simulator.simulateNetworkConditions(
        condition.latency, 
        condition.throughput, 
        0.3, // 30% congestion
        1000 // 1000km distance
    );
    
    console.log(\`Simulated Conditions: \${simulated.latency.toFixed(1)}ms, \${simulated.throughput.toFixed(1)} Mbps\`);
    
    // Run analysis
    const analysis = simulator.runPerformanceAnalysis(simulated.latency, simulated.throughput);
    
    // Show top scenarios
    const scenarios = ['gaming', 'streaming', 'web_browsing'];
    scenarios.forEach(scenario => {
        const data = analysis.scenarioAnalysis[scenario];
        const status = data.currentScore.overallScore >= 70 ? '✓' : '✗';
        console.log(\`  \${status} \${data.scenarioName}: \${data.currentScore.overallScore.toFixed(1)}%\`);
    });
    
    // Show best optimization for gaming (most latency sensitive)
    const gamingOpt = analysis.scenarioAnalysis.gaming.optimalOptimizations;
    if (gamingOpt && gamingOpt.appliedOptimizations.length > 0) {
        console.log(\`  Best optimization for gaming: \${gamingOpt.appliedOptimizations.join(', ')}\`);
        console.log(\`  Improvement: \${gamingOpt.latencyImprovement.toFixed(1)}% latency reduction\`);
    }
});

// Detailed analysis for a specific condition
console.log('\\n=== Detailed Analysis: Cable Internet ===');
const detailedAnalysis = simulator.runPerformanceAnalysis(25, 50);
console.log(simulator.generateReport(detailedAnalysis));
      `
    }
  ],

  resources: [
    {
      title: "Latency vs Throughput - GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/difference-between-latency-and-throughput/",
      description: "Comprehensive comparison of latency and throughput concepts"
    },
    {
      title: "Network Performance Metrics - YouTube",
      url: "https://www.youtube.com/watch?v=yHP_EOqBUuY",
      description: "Visual explanation of network performance measurement and optimization"
    },
    {
      title: "Bandwidth-Delay Product Explained",
      url: "https://en.wikipedia.org/wiki/Bandwidth-delay_product",
      description: "Understanding the relationship between bandwidth and latency"
    },
    {
      title: "Network Performance Testing Tools",
      url: "https://www.speedtest.net/",
      description: "Popular tools for measuring internet speed and latency"
    },
    {
      title: "TCP Performance and Optimization",
      url: "https://tools.ietf.org/html/rfc7323",
      description: "RFC on TCP extensions for high performance networks"
    }
  ],

  questions: [
    {
      question: "What is the difference between latency and throughput?",
      answer: "Latency is the time delay between sending a request and receiving a response (measured in milliseconds), while throughput is the amount of data successfully transmitted per unit time (measured in bits per second). Latency affects responsiveness, while throughput affects capacity and transfer speed."
    },
    {
      question: "How do latency and throughput affect different types of applications?",
      answer: "Interactive applications (gaming, VoIP) prioritize low latency for real-time responsiveness. Bulk data applications (file transfers, backups) prioritize high throughput for faster completion. Streaming applications need balanced optimization - sufficient throughput to prevent buffering and reasonable latency for quick startup."
    },
    {
      question: "What is the bandwidth-delay product and why is it important?",
      answer: "Bandwidth-delay product (BDP) is bandwidth × round-trip time, representing the amount of data that can be 'in flight' simultaneously. It's crucial for protocol efficiency - TCP window size should match BDP for optimal performance. Higher BDP requires larger buffers and more sophisticated flow control."
    },
    {
      question: "What causes network latency and how can it be reduced?",
      answer: "Latency causes include: propagation delay (distance), transmission delay (bandwidth), processing delay (routers), and queuing delay (congestion). Reduction strategies: geographic proximity (CDN), caching, protocol optimization, faster hardware, traffic prioritization (QoS), and reducing network hops."
    },
    {
      question: "What factors affect network throughput?",
      answer: "Throughput is affected by: available bandwidth, network congestion, protocol overhead, error rates requiring retransmissions, hardware limitations, software bottlenecks, and TCP window scaling. Optimization involves addressing bottlenecks, improving protocols, and proper resource allocation."
    },
    {
      question: "How do you measure and monitor network performance?",
      answer: "Measurement tools include: ping (latency), iperf (throughput), traceroute (path analysis), network monitoring software, and application-specific metrics. Key metrics: response time, packet loss, jitter, bandwidth utilization, and error rates. Continuous monitoring helps identify trends and issues."
    },
    {
      question: "What are the trade-offs between optimizing for latency vs throughput?",
      answer: "Latency optimization often uses smaller packets and immediate transmission (lower throughput). Throughput optimization uses larger packets and batching (higher latency). Protocol design must balance both - TCP Nagle's algorithm trades latency for throughput, while TCP_NODELAY prioritizes latency over efficiency."
    },
    {
      question: "How does network congestion affect latency and throughput?",
      answer: "Congestion increases queuing delays (higher latency) and causes packet drops requiring retransmissions (lower effective throughput). Effects compound as congestion worsens. Mitigation strategies include traffic shaping, QoS prioritization, load balancing, and congestion control algorithms."
    },
    {
      question: "What role does caching play in latency and throughput optimization?",
      answer: "Caching primarily reduces latency by serving content from closer locations, eliminating round trips to origin servers. It also improves effective throughput by reducing network load and serving popular content faster. CDNs, browser caches, and proxy caches all contribute to performance improvements."
    },
    {
      question: "How do modern protocols address latency and throughput challenges?",
      answer: "Modern protocols use: HTTP/2 multiplexing (reduces latency), QUIC's 0-RTT connections (faster handshakes), TCP BBR congestion control (better throughput), compression (effective throughput), and connection pooling (amortized latency). Protocol evolution continues optimizing both metrics for different use cases."
    }
  ]
};