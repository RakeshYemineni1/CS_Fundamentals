export const enhancedBasicCommands = {
  id: 'basic-commands',
  title: 'Basic Network Commands',
  subtitle: 'Essential Networking Tools and Utilities',
  summary: 'Comprehensive guide to essential network commands like ipconfig, ping, traceroute, netstat, and nslookup for network troubleshooting, monitoring, and configuration.',
  
  analogy: "Think of network commands like diagnostic tools in a mechanic's toolbox. Just as a mechanic uses different tools to diagnose car problems (voltmeter for electrical, pressure gauge for fluids), network administrators use different commands to diagnose network issues (ping for connectivity, traceroute for path analysis).",
  
  visualConcept: "Imagine network commands as different types of medical tests. Ping is like checking a pulse (basic connectivity), traceroute is like an X-ray showing the path through the body (network route), and netstat is like a blood test showing what's happening inside (active connections).",
  
  realWorldUse: "Network troubleshooting, system administration, security analysis, performance monitoring, and network configuration verification in enterprise and home environments.",

  explanation: `
Network commands are essential tools for diagnosing, monitoring, and configuring network connections. Each command serves specific purposes in network administration and troubleshooting.

Essential Network Commands:

1. ipconfig/ifconfig
Displays and configures network interface information including IP addresses, subnet masks, and default gateways.

2. ping
Tests network connectivity by sending ICMP echo requests to a target host and measuring response times.

3. traceroute/tracert
Shows the path packets take from source to destination, displaying each hop along the route.

4. netstat
Displays active network connections, listening ports, and network statistics.

5. nslookup/dig
Queries DNS servers to resolve domain names to IP addresses and vice versa.

6. arp
Displays and modifies the ARP (Address Resolution Protocol) table showing IP-to-MAC address mappings.

7. route
Displays and modifies the routing table that determines how packets are forwarded.

8. telnet
Tests connectivity to specific ports on remote hosts.

9. wget/curl
Downloads files and tests HTTP/HTTPS connectivity with detailed protocol information.

10. ss (Socket Statistics)
Modern replacement for netstat with more features and better performance.

Command Usage Patterns:
- Connectivity testing: ping, telnet
- Path analysis: traceroute, mtr
- Configuration: ipconfig, route
- Monitoring: netstat, ss, iftop
- DNS troubleshooting: nslookup, dig
- Performance testing: iperf, speedtest-cli
  `,

  keyPoints: [
    "Network commands are essential for troubleshooting connectivity issues",
    "Each command serves specific diagnostic and configuration purposes",
    "Commands vary between Windows (ipconfig) and Unix/Linux (ifconfig)",
    "Ping tests basic connectivity using ICMP protocol",
    "Traceroute reveals network path and potential bottlenecks",
    "Netstat shows active connections and listening services",
    "DNS commands help resolve name resolution issues",
    "ARP commands manage IP-to-MAC address mappings",
    "Route commands control packet forwarding decisions",
    "Modern tools provide enhanced features and better output"
  ],

  codeExamples: [
    {
      title: "Network Command Wrapper Library",
      language: "python",
      code: `
import subprocess
import platform
import re
import json
import time
from typing import Dict, List, Optional, Tuple

class NetworkCommands:
    def __init__(self):
        self.os_type = platform.system().lower()
        self.command_map = self._initialize_command_map()
    
    def _initialize_command_map(self):
        """Map commands to OS-specific implementations"""
        if self.os_type == "windows":
            return {
                'ipconfig': 'ipconfig',
                'ping': 'ping -n 4',
                'traceroute': 'tracert',
                'netstat': 'netstat',
                'nslookup': 'nslookup',
                'arp': 'arp',
                'route': 'route'
            }
        else:  # Unix/Linux/macOS
            return {
                'ipconfig': 'ifconfig',
                'ping': 'ping -c 4',
                'traceroute': 'traceroute',
                'netstat': 'netstat',
                'nslookup': 'nslookup',
                'arp': 'arp',
                'route': 'route'
            }
    
    def run_command(self, command: str, timeout: int = 30) -> Dict:
        """Execute system command and return structured result"""
        start_time = time.time()
        
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=timeout
            )
            
            execution_time = time.time() - start_time
            
            return {
                'command': command,
                'success': result.returncode == 0,
                'stdout': result.stdout,
                'stderr': result.stderr,
                'return_code': result.returncode,
                'execution_time': execution_time
            }
            
        except subprocess.TimeoutExpired:
            return {
                'command': command,
                'success': False,
                'error': f'Command timed out after {timeout} seconds',
                'execution_time': timeout
            }
        except Exception as e:
            return {
                'command': command,
                'success': False,
                'error': str(e),
                'execution_time': time.time() - start_time
            }
    
    def get_network_config(self) -> Dict:
        """Get network interface configuration"""
        if self.os_type == "windows":
            result = self.run_command("ipconfig /all")
        else:
            result = self.run_command("ifconfig -a")
        
        if not result['success']:
            return result
        
        # Parse network configuration
        interfaces = self._parse_network_config(result['stdout'])
        
        return {
            **result,
            'interfaces': interfaces
        }
    
    def ping_host(self, host: str, count: int = 4) -> Dict:
        """Ping a host and return statistics"""
        if self.os_type == "windows":
            command = f"ping -n {count} {host}"
        else:
            command = f"ping -c {count} {host}"
        
        result = self.run_command(command)
        
        if not result['success']:
            return result
        
        # Parse ping statistics
        stats = self._parse_ping_output(result['stdout'])
        
        return {
            **result,
            'host': host,
            'statistics': stats
        }
    
    def traceroute_host(self, host: str) -> Dict:
        """Trace route to a host"""
        if self.os_type == "windows":
            command = f"tracert {host}"
        else:
            command = f"traceroute {host}"
        
        result = self.run_command(command, timeout=60)
        
        if not result['success']:
            return result
        
        # Parse traceroute hops
        hops = self._parse_traceroute_output(result['stdout'])
        
        return {
            **result,
            'host': host,
            'hops': hops
        }
    
    def get_active_connections(self) -> Dict:
        """Get active network connections"""
        result = self.run_command("netstat -an")
        
        if not result['success']:
            return result
        
        # Parse connections
        connections = self._parse_netstat_output(result['stdout'])
        
        return {
            **result,
            'connections': connections
        }
    
    def dns_lookup(self, host: str, record_type: str = 'A') -> Dict:
        """Perform DNS lookup"""
        command = f"nslookup -type={record_type} {host}"
        result = self.run_command(command)
        
        if not result['success']:
            return result
        
        # Parse DNS response
        dns_info = self._parse_nslookup_output(result['stdout'])
        
        return {
            **result,
            'host': host,
            'record_type': record_type,
            'dns_info': dns_info
        }

# Usage example
if __name__ == "__main__":
    net_cmd = NetworkCommands()
    
    print("=== Network Commands Demonstration ===")
    
    # Get network configuration
    print("\\n1. Network Configuration:")
    config = net_cmd.get_network_config()
    if config['success']:
        for interface in config['interfaces']:
            print(f"  Interface: {interface['name']}")
            print(f"    Status: {interface.get('status', 'unknown')}")
            print(f"    IP: {interface.get('ipv4', 'N/A')}")
            print(f"    MAC: {interface.get('mac_address', 'N/A')}")
    
    # Ping test
    print("\\n2. Ping Test:")
    ping_result = net_cmd.ping_host("8.8.8.8")
    if ping_result['success']:
        stats = ping_result['statistics']
        print(f"  Host: {ping_result['host']}")
        print(f"  Packets: {stats['packets_sent']} sent, {stats['packets_received']} received")
        print(f"  Packet Loss: {stats['packet_loss']}%")
        if stats['avg_time']:
            print(f"  Average Time: {stats['avg_time']}ms")
      `
    },
    {
      title: "Network Diagnostic Tool",
      language: "javascript",
      code: `
class NetworkDiagnosticTool {
    constructor() {
        this.diagnostics = [];
        this.commonPorts = new Map([
            [21, 'FTP'],
            [22, 'SSH'],
            [23, 'Telnet'],
            [25, 'SMTP'],
            [53, 'DNS'],
            [80, 'HTTP'],
            [110, 'POP3'],
            [143, 'IMAP'],
            [443, 'HTTPS'],
            [993, 'IMAPS'],
            [995, 'POP3S']
        ]);
        
        this.commandExamples = this.initializeCommandExamples();
    }
    
    initializeCommandExamples() {
        return {
            windows: {
                ipconfig: {
                    basic: 'ipconfig',
                    all: 'ipconfig /all',
                    release: 'ipconfig /release',
                    renew: 'ipconfig /renew',
                    flushdns: 'ipconfig /flushdns'
                },
                ping: {
                    basic: 'ping google.com',
                    count: 'ping -n 10 google.com',
                    continuous: 'ping -t google.com',
                    size: 'ping -l 1000 google.com'
                },
                tracert: {
                    basic: 'tracert google.com',
                    no_resolve: 'tracert -d google.com',
                    max_hops: 'tracert -h 15 google.com'
                },
                netstat: {
                    all: 'netstat -an',
                    listening: 'netstat -an | findstr LISTENING',
                    established: 'netstat -an | findstr ESTABLISHED',
                    processes: 'netstat -ano'
                },
                nslookup: {
                    basic: 'nslookup google.com',
                    mx: 'nslookup -type=MX google.com',
                    ns: 'nslookup -type=NS google.com',
                    reverse: 'nslookup 8.8.8.8'
                }
            },
            linux: {
                ifconfig: {
                    basic: 'ifconfig',
                    all: 'ifconfig -a',
                    interface: 'ifconfig eth0',
                    up: 'sudo ifconfig eth0 up',
                    down: 'sudo ifconfig eth0 down'
                },
                ping: {
                    basic: 'ping google.com',
                    count: 'ping -c 10 google.com',
                    interval: 'ping -i 2 google.com',
                    flood: 'sudo ping -f google.com'
                },
                traceroute: {
                    basic: 'traceroute google.com',
                    udp: 'traceroute -U google.com',
                    tcp: 'traceroute -T google.com',
                    icmp: 'traceroute -I google.com'
                },
                netstat: {
                    all: 'netstat -tuln',
                    listening: 'netstat -tln',
                    established: 'netstat -tun',
                    processes: 'netstat -tulnp'
                },
                dig: {
                    basic: 'dig google.com',
                    mx: 'dig MX google.com',
                    ns: 'dig NS google.com',
                    reverse: 'dig -x 8.8.8.8',
                    trace: 'dig +trace google.com'
                }
            }
        };
    }
    
    async simulateCommand(command, parameters = {}) {
        const startTime = performance.now();
        
        try {
            let result;
            
            switch (command.toLowerCase()) {
                case 'ping':
                    result = await this.simulatePing(parameters);
                    break;
                case 'traceroute':
                case 'tracert':
                    result = await this.simulateTraceroute(parameters);
                    break;
                case 'nslookup':
                case 'dig':
                    result = await this.simulateDNSLookup(parameters);
                    break;
                case 'netstat':
                    result = this.simulateNetstat(parameters);
                    break;
                case 'ipconfig':
                case 'ifconfig':
                    result = this.simulateNetworkConfig(parameters);
                    break;
                case 'arp':
                    result = this.simulateARP(parameters);
                    break;
                case 'telnet':
                    result = await this.simulateTelnet(parameters);
                    break;
                default:
                    throw new Error(\`Unknown command: \${command}\`);
            }
            
            const diagnostic = {
                command,
                parameters,
                result,
                executionTime: performance.now() - startTime,
                timestamp: new Date().toISOString(),
                success: true
            };
            
            this.diagnostics.push(diagnostic);
            return diagnostic;
            
        } catch (error) {
            const diagnostic = {
                command,
                parameters,
                error: error.message,
                executionTime: performance.now() - startTime,
                timestamp: new Date().toISOString(),
                success: false
            };
            
            this.diagnostics.push(diagnostic);
            return diagnostic;
        }
    }
    
    async simulatePing(params) {
        const { host = 'google.com', count = 4, timeout = 5000 } = params;
        
        const results = [];
        let packetsLost = 0;
        
        for (let i = 0; i < count; i++) {
            await this.delay(100 + Math.random() * 50); // Simulate network delay
            
            const success = Math.random() > 0.05; // 95% success rate
            
            if (success) {
                const responseTime = 10 + Math.random() * 40; // 10-50ms
                results.push({
                    sequence: i + 1,
                    time: Math.round(responseTime * 100) / 100,
                    ttl: 64,
                    success: true
                });
            } else {
                packetsLost++;
                results.push({
                    sequence: i + 1,
                    timeout: true,
                    success: false
                });
            }
        }
        
        const successfulPings = results.filter(r => r.success);
        const times = successfulPings.map(r => r.time);
        
        return {
            host,
            packetsSent: count,
            packetsReceived: count - packetsLost,
            packetsLost,
            packetLossPercent: (packetsLost / count) * 100,
            minTime: times.length > 0 ? Math.min(...times) : null,
            maxTime: times.length > 0 ? Math.max(...times) : null,
            avgTime: times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : null,
            results
        };
    }
    
    // Helper methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    getCommandHelp(command, os = 'windows') {
        const commands = this.commandExamples[os];
        return commands[command] || null;
    }
    
    generateDiagnosticReport() {
        const report = {
            timestamp: new Date().toISOString(),
            totalCommands: this.diagnostics.length,
            successfulCommands: this.diagnostics.filter(d => d.success).length,
            failedCommands: this.diagnostics.filter(d => !d.success).length,
            averageExecutionTime: this.diagnostics.reduce((sum, d) => sum + d.executionTime, 0) / this.diagnostics.length,
            commandSummary: {}
        };
        
        return report;
    }
}

// Usage example
async function demonstrateNetworkCommands() {
    const diagnostic = new NetworkDiagnosticTool();
    
    console.log('=== Network Diagnostic Tool Demo ===');
    
    // Test various commands
    const tests = [
        { command: 'ping', params: { host: 'google.com', count: 4 } },
        { command: 'traceroute', params: { host: 'google.com' } },
        { command: 'nslookup', params: { host: 'google.com', type: 'A' } },
        { command: 'netstat', params: { protocol: 'TCP' } },
        { command: 'ipconfig', params: {} },
        { command: 'telnet', params: { host: 'google.com', port: 80 } }
    ];
    
    for (const test of tests) {
        console.log(\`\\nRunning: \${test.command}\`);
        
        try {
            const result = await diagnostic.simulateCommand(test.command, test.params);
            
            if (result.success) {
                console.log(\`✓ Command completed in \${result.executionTime.toFixed(2)}ms\`);
            } else {
                console.log(\`✗ Command failed: \${result.error}\`);
            }
            
        } catch (error) {
            console.log(\`✗ Error: \${error.message}\`);
        }
    }
}

// Run the demonstration
demonstrateNetworkCommands();
      `
    }
  ],

  resources: [
    {
      title: "Network Commands Guide - GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/basic-network-commands/",
      description: "Comprehensive guide to essential network commands and their usage"
    },
    {
      title: "Windows Network Commands - Microsoft",
      url: "https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/",
      description: "Official Microsoft documentation for Windows network commands"
    },
    {
      title: "Linux Network Commands Tutorial",
      url: "https://www.tecmint.com/linux-network-configuration-and-troubleshooting-commands/",
      description: "Complete guide to Linux networking commands and troubleshooting"
    },
    {
      title: "Network Troubleshooting with Command Line",
      url: "https://www.youtube.com/watch?v=tOR1WzBBkxg",
      description: "Video tutorial on using command line tools for network diagnosis"
    },
    {
      title: "TCP/IP Command Reference",
      url: "https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13769-5.html",
      description: "Cisco's comprehensive TCP/IP command reference guide"
    }
  ],

  questions: [
    {
      question: "What is the difference between ipconfig and ifconfig commands?",
      answer: "ipconfig is the Windows command for displaying and configuring network interfaces, while ifconfig is used on Unix/Linux systems. Both show IP addresses, subnet masks, and interface status, but have different syntax and options. Windows uses 'ipconfig /all' for detailed info, while Linux uses 'ifconfig -a'."
    },
    {
      question: "How does the ping command work and what information does it provide?",
      answer: "Ping sends ICMP Echo Request packets to a target host and measures response times. It provides connectivity status, round-trip time (RTT), packet loss percentage, and basic reachability information. Ping helps diagnose network connectivity issues, latency problems, and basic host availability."
    },
    {
      question: "What is the purpose of traceroute/tracert and how does it work?",
      answer: "Traceroute shows the path packets take from source to destination by incrementally increasing TTL values and recording each hop's response. It helps identify network routing issues, locate bottlenecks, and understand network topology. Each hop represents a router or gateway in the path."
    },
    {
      question: "What information does netstat provide and how is it useful?",
      answer: "Netstat displays active network connections, listening ports, routing tables, and network statistics. It's useful for monitoring network activity, identifying open ports, detecting unauthorized connections, troubleshooting service issues, and security analysis. Different flags show specific types of connections or statistics."
    },
    {
      question: "How do nslookup and dig commands help with DNS troubleshooting?",
      answer: "Both commands query DNS servers to resolve domain names and diagnose DNS issues. nslookup is available on Windows and Unix, while dig is more powerful and primarily on Unix/Linux. They can query different record types (A, MX, NS, PTR), test specific DNS servers, and provide detailed resolution information."
    },
    {
      question: "What is the ARP command used for and when would you need it?",
      answer: "ARP (Address Resolution Protocol) command displays and modifies the ARP table that maps IP addresses to MAC addresses on the local network. It's useful for troubleshooting local network connectivity, identifying duplicate IP addresses, clearing stale entries, and understanding Layer 2 communication issues."
    },
    {
      question: "How can telnet be used for network troubleshooting?",
      answer: "Telnet can test connectivity to specific ports on remote hosts, even though it's primarily a remote access protocol. By connecting to various ports (HTTP 80, SMTP 25, etc.), you can verify if services are running and accessible, test firewall rules, and diagnose application-layer connectivity issues."
    },
    {
      question: "What are the key differences between Windows and Linux network commands?",
      answer: "Windows uses ipconfig, tracert, netstat with different syntax, while Linux uses ifconfig, traceroute, netstat with Unix-style options. Linux has additional tools like dig, ss, ip command. Windows commands often use forward slashes (/), while Linux uses dashes (-). Output formats and available options also differ between systems."
    },
    {
      question: "How do you interpret ping statistics and what do they indicate?",
      answer: "Ping statistics include packets sent/received, packet loss percentage, and timing (min/avg/max/stddev). Low packet loss (<1%) and consistent times indicate good connectivity. High loss suggests network congestion or issues. Variable times (high stddev) indicate jitter. Timeouts suggest routing problems or firewalls."
    },
    {
      question: "What modern alternatives exist for traditional network commands?",
      answer: "Modern alternatives include: 'ss' instead of netstat (faster, more features), 'ip' command instead of ifconfig (more powerful), 'mtr' combining ping and traceroute, 'dig' instead of nslookup (more detailed), and GUI tools like Wireshark for packet analysis. These provide enhanced functionality and better performance."
    }
  ]
};