export const enhancedCDN = {
  id: 'cdn',
  title: 'CDN (Content Delivery Network)',
  subtitle: 'Global Content Distribution System',
  summary: 'Geographically distributed network of servers that deliver web content and services to users based on their location, improving performance, availability, and user experience.',
  
  analogy: "Think of CDN like a chain of local libraries. Instead of everyone traveling to one central library (origin server) in the capital city, people can access the same books from their local branch library (edge server), getting faster service and reducing crowding at the main location.",
  
  visualConcept: "Imagine CDN as a pizza delivery chain with multiple locations. When you order pizza, it comes from the nearest location rather than the main headquarters, ensuring faster delivery and fresher food.",
  
  realWorldUse: "Netflix streaming videos, Amazon product images, WordPress plugin downloads, software updates, news websites, e-commerce platforms, and mobile app content delivery.",

  explanation: `
A Content Delivery Network (CDN) is a geographically distributed group of servers that work together to provide fast delivery of internet content by caching content at edge locations closer to users.

CDN Components:

1. Origin Server
The primary server where original content is stored and from which CDN servers fetch content when not cached.

2. Edge Servers (PoPs - Points of Presence)
Geographically distributed servers that cache and serve content to users from the nearest location.

3. CDN Management System
Controls content distribution, cache policies, analytics, and routing decisions across the network.

How CDN Works:

Content Caching
Static content (images, CSS, JavaScript, videos) is cached at edge servers based on popularity and geographic demand.

Request Routing
DNS or anycast routing directs user requests to the nearest or best-performing edge server.

Cache Management
Implements cache policies including TTL (Time To Live), cache invalidation, and content freshening strategies.

CDN Benefits:

Performance Improvement
Reduced latency through geographic proximity, faster content delivery, and optimized routing paths.

Scalability
Handles traffic spikes by distributing load across multiple servers and geographic regions.

Availability
Provides redundancy and failover capabilities, reducing single points of failure.

Bandwidth Cost Reduction
Reduces origin server load and bandwidth costs through efficient caching and content distribution.

Security Features
DDoS protection, Web Application Firewall (WAF), SSL/TLS termination, and bot mitigation.
  `,

  keyPoints: [
    "CDN distributes content globally for faster delivery",
    "Edge servers cache content closer to users",
    "Reduces latency and improves user experience",
    "Provides scalability for handling traffic spikes",
    "Offers DDoS protection and security features",
    "Reduces bandwidth costs and origin server load",
    "Supports both static and dynamic content delivery",
    "Implements intelligent routing and failover",
    "Provides detailed analytics and monitoring",
    "Essential for global web applications and streaming"
  ],

  codeExamples: [
    {
      title: "CDN Cache Management System",
      language: "python",
      code: `
import time
import hashlib
import threading
from collections import defaultdict, OrderedDict
from datetime import datetime, timedelta
from typing import Dict, Optional, Tuple
import requests
from dataclasses import dataclass

@dataclass
class CacheEntry:
    content: bytes
    content_type: str
    etag: str
    last_modified: datetime
    expires: datetime
    hit_count: int = 0
    size: int = 0
    
    def is_expired(self) -> bool:
        return datetime.now() > self.expires
    
    def is_stale(self, max_age: int = 3600) -> bool:
        return (datetime.now() - self.last_modified).seconds > max_age

class CDNEdgeServer:
    def __init__(self, server_id: str, location: str, max_cache_size: int = 1024*1024*1024):  # 1GB default
        self.server_id = server_id
        self.location = location
        self.max_cache_size = max_cache_size
        self.current_cache_size = 0
        
        # LRU cache implementation
        self.cache: OrderedDict[str, CacheEntry] = OrderedDict()
        self.cache_lock = threading.RLock()
        
        # Statistics
        self.stats = {
            'requests': 0,
            'cache_hits': 0,
            'cache_misses': 0,
            'bytes_served': 0,
            'origin_requests': 0,
            'start_time': datetime.now()
        }
        
        # Origin servers
        self.origin_servers = []
        
    def add_origin_server(self, origin_url: str):
        """Add origin server URL"""
        self.origin_servers.append(origin_url)
    
    def generate_cache_key(self, url: str, headers: Dict[str, str] = None) -> str:
        """Generate cache key from URL and relevant headers"""
        key_data = url
        
        # Include relevant headers for cache key
        if headers:
            vary_headers = ['Accept-Encoding', 'User-Agent', 'Accept-Language']
            for header in vary_headers:
                if header in headers:
                    key_data += f"|{header}:{headers[header]}"
        
        return hashlib.md5(key_data.encode()).hexdigest()
    
    def get_content(self, url: str, headers: Dict[str, str] = None) -> Tuple[bytes, str, int]:
        """Get content from cache or origin server"""
        self.stats['requests'] += 1
        cache_key = self.generate_cache_key(url, headers)
        
        with self.cache_lock:
            # Check cache first
            if cache_key in self.cache:
                entry = self.cache[cache_key]
                
                # Check if content is expired
                if not entry.is_expired():
                    # Move to end (LRU)
                    self.cache.move_to_end(cache_key)
                    entry.hit_count += 1
                    self.stats['cache_hits'] += 1
                    self.stats['bytes_served'] += entry.size
                    
                    return entry.content, entry.content_type, 200
                else:
                    # Remove expired content
                    self._remove_from_cache(cache_key)
        
        # Cache miss - fetch from origin
        self.stats['cache_misses'] += 1
        return self._fetch_from_origin(url, headers, cache_key)
    
    def _fetch_from_origin(self, url: str, headers: Dict[str, str], cache_key: str) -> Tuple[bytes, str, int]:
        """Fetch content from origin server"""
        self.stats['origin_requests'] += 1
        
        for origin in self.origin_servers:
            try:
                full_url = origin + url if not url.startswith('http') else url
                
                # Add CDN headers
                request_headers = headers.copy() if headers else {}
                request_headers['X-CDN-Server'] = self.server_id
                request_headers['X-CDN-Location'] = self.location
                
                response = requests.get(full_url, headers=request_headers, timeout=10)
                
                if response.status_code == 200:
                    content = response.content
                    content_type = response.headers.get('Content-Type', 'application/octet-stream')
                    
                    # Cache the content
                    self._store_in_cache(cache_key, content, content_type, response.headers)
                    
                    self.stats['bytes_served'] += len(content)
                    return content, content_type, 200
                    
            except Exception as e:
                print(f"Error fetching from origin {origin}: {e}")
                continue
        
        # All origins failed
        return b"Content not available", "text/plain", 503
    
    def _store_in_cache(self, cache_key: str, content: bytes, content_type: str, headers: Dict[str, str]):
        """Store content in cache with proper eviction"""
        content_size = len(content)
        
        # Don't cache if content is too large
        if content_size > self.max_cache_size * 0.1:  # Don't cache items > 10% of total cache
            return
        
        with self.cache_lock:
            # Make space if needed
            while (self.current_cache_size + content_size > self.max_cache_size and 
                   len(self.cache) > 0):
                self._evict_lru()
            
            # Create cache entry
            expires = datetime.now() + timedelta(seconds=self._get_cache_ttl(headers))
            etag = headers.get('ETag', '')
            last_modified = datetime.now()
            
            entry = CacheEntry(
                content=content,
                content_type=content_type,
                etag=etag,
                last_modified=last_modified,
                expires=expires,
                size=content_size
            )
            
            self.cache[cache_key] = entry
            self.current_cache_size += content_size
    
    def _get_cache_ttl(self, headers: Dict[str, str]) -> int:
        """Determine cache TTL from headers"""
        # Check Cache-Control header
        cache_control = headers.get('Cache-Control', '')
        if 'max-age=' in cache_control:
            try:
                max_age = int(cache_control.split('max-age=')[1].split(',')[0])
                return max_age
            except:
                pass
        
        # Check Expires header
        expires = headers.get('Expires')
        if expires:
            try:
                expires_dt = datetime.strptime(expires, '%a, %d %b %Y %H:%M:%S GMT')
                ttl = (expires_dt - datetime.now()).seconds
                return max(0, ttl)
            except:
                pass
        
        # Default TTL based on content type
        content_type = headers.get('Content-Type', '')
        if 'image/' in content_type:
            return 86400  # 24 hours for images
        elif 'text/css' in content_type or 'javascript' in content_type:
            return 3600   # 1 hour for CSS/JS
        else:
            return 300    # 5 minutes default
    
    def _evict_lru(self):
        """Evict least recently used item"""
        if self.cache:
            cache_key, entry = self.cache.popitem(last=False)
            self.current_cache_size -= entry.size
    
    def _remove_from_cache(self, cache_key: str):
        """Remove specific item from cache"""
        if cache_key in self.cache:
            entry = self.cache.pop(cache_key)
            self.current_cache_size -= entry.size
    
    def invalidate_cache(self, pattern: str = None):
        """Invalidate cache entries matching pattern"""
        with self.cache_lock:
            if pattern is None:
                # Clear all cache
                self.cache.clear()
                self.current_cache_size = 0
            else:
                # Remove entries matching pattern
                keys_to_remove = [key for key in self.cache.keys() if pattern in key]
                for key in keys_to_remove:
                    self._remove_from_cache(key)
    
    def get_cache_stats(self) -> Dict:
        """Get cache statistics"""
        uptime = datetime.now() - self.stats['start_time']
        hit_rate = (self.stats['cache_hits'] / max(1, self.stats['requests'])) * 100
        
        return {
            'server_id': self.server_id,
            'location': self.location,
            'uptime_minutes': uptime.total_seconds() / 60,
            'total_requests': self.stats['requests'],
            'cache_hits': self.stats['cache_hits'],
            'cache_misses': self.stats['cache_misses'],
            'hit_rate_percent': round(hit_rate, 2),
            'origin_requests': self.stats['origin_requests'],
            'bytes_served': self.stats['bytes_served'],
            'cache_size_mb': round(self.current_cache_size / (1024*1024), 2),
            'cache_utilization_percent': round((self.current_cache_size / self.max_cache_size) * 100, 2),
            'cached_objects': len(self.cache)
        }

class CDNNetwork:
    def __init__(self):
        self.edge_servers: Dict[str, CDNEdgeServer] = {}
        self.server_locations = {}
        self.routing_table = defaultdict(list)
        
    def add_edge_server(self, server: CDNEdgeServer, region: str):
        """Add edge server to CDN network"""
        self.edge_servers[server.server_id] = server
        self.server_locations[server.server_id] = region
        self.routing_table[region].append(server.server_id)
    
    def find_nearest_server(self, client_location: str) -> Optional[CDNEdgeServer]:
        """Find nearest edge server for client location"""
        # Simplified location matching - in reality would use geolocation
        location_priority = {
            'us-east': ['us-east', 'us-west', 'europe', 'asia'],
            'us-west': ['us-west', 'us-east', 'asia', 'europe'],
            'europe': ['europe', 'us-east', 'us-west', 'asia'],
            'asia': ['asia', 'us-west', 'europe', 'us-east']
        }
        
        priorities = location_priority.get(client_location, ['us-east'])
        
        for region in priorities:
            if region in self.routing_table and self.routing_table[region]:
                server_id = self.routing_table[region][0]  # Simple selection
                return self.edge_servers[server_id]
        
        # Fallback to any available server
        if self.edge_servers:
            return next(iter(self.edge_servers.values()))
        
        return None
    
    def serve_request(self, url: str, client_location: str, headers: Dict[str, str] = None) -> Tuple[bytes, str, int, str]:
        """Serve request through CDN"""
        server = self.find_nearest_server(client_location)
        
        if not server:
            return b"CDN unavailable", "text/plain", 503, "none"
        
        content, content_type, status_code = server.get_content(url, headers)
        return content, content_type, status_code, server.server_id
    
    def get_network_stats(self) -> Dict:
        """Get CDN network statistics"""
        total_requests = sum(server.stats['requests'] for server in self.edge_servers.values())
        total_hits = sum(server.stats['cache_hits'] for server in self.edge_servers.values())
        total_bytes = sum(server.stats['bytes_served'] for server in self.edge_servers.values())
        
        network_hit_rate = (total_hits / max(1, total_requests)) * 100
        
        return {
            'total_edge_servers': len(self.edge_servers),
            'total_requests': total_requests,
            'network_hit_rate_percent': round(network_hit_rate, 2),
            'total_bytes_served': total_bytes,
            'server_stats': [server.get_cache_stats() for server in self.edge_servers.values()]
        }

# Usage example
if __name__ == "__main__":
    # Create CDN network
    cdn = CDNNetwork()
    
    # Create edge servers
    us_east = CDNEdgeServer("edge-us-east-1", "Virginia", max_cache_size=512*1024*1024)
    us_west = CDNEdgeServer("edge-us-west-1", "California", max_cache_size=512*1024*1024)
    europe = CDNEdgeServer("edge-eu-west-1", "Ireland", max_cache_size=512*1024*1024)
    
    # Add origin servers
    for server in [us_east, us_west, europe]:
        server.add_origin_server("https://origin.example.com")
    
    # Add to CDN network
    cdn.add_edge_server(us_east, "us-east")
    cdn.add_edge_server(us_west, "us-west")
    cdn.add_edge_server(europe, "europe")
    
    print("=== CDN Network Simulation ===")
    
    # Simulate requests from different locations
    test_requests = [
        ("/images/logo.png", "us-east"),
        ("/css/style.css", "us-west"),
        ("/js/app.js", "europe"),
        ("/images/logo.png", "us-east"),  # Should hit cache
        ("/api/data.json", "asia"),
        ("/images/banner.jpg", "us-west"),
        ("/css/style.css", "europe"),     # Should hit cache
    ]
    
    for url, location in test_requests:
        content, content_type, status, server_id = cdn.serve_request(
            url, location, {"User-Agent": "CDN-Test/1.0"}
        )
        
        print(f"Request: {url} from {location}")
        print(f"  Served by: {server_id}")
        print(f"  Status: {status}")
        print(f"  Content-Type: {content_type}")
        print(f"  Size: {len(content)} bytes")
        print()
    
    # Show network statistics
    print("=== CDN Network Statistics ===")
    stats = cdn.get_network_stats()
    
    print(f"Total Edge Servers: {stats['total_edge_servers']}")
    print(f"Total Requests: {stats['total_requests']}")
    print(f"Network Hit Rate: {stats['network_hit_rate_percent']}%")
    print(f"Total Bytes Served: {stats['total_bytes_served']}")
    
    print("\\n=== Individual Server Stats ===")
    for server_stat in stats['server_stats']:
        print(f"Server: {server_stat['server_id']} ({server_stat['location']})")
        print(f"  Requests: {server_stat['total_requests']}")
        print(f"  Hit Rate: {server_stat['hit_rate_percent']}%")
        print(f"  Cache Size: {server_stat['cache_size_mb']} MB")
        print(f"  Cached Objects: {server_stat['cached_objects']}")
        print()
      `
    },
    {
      title: "CDN Performance Analyzer",
      language: "javascript",
      code: `
class CDNPerformanceAnalyzer {
    constructor() {
        this.measurements = [];
        this.regions = new Map();
        this.providers = new Map();
        
        this.initializeRegions();
        this.initializeProviders();
    }
    
    initializeRegions() {
        this.regions.set('us-east-1', { name: 'US East (Virginia)', latency: 20 });
        this.regions.set('us-west-1', { name: 'US West (California)', latency: 25 });
        this.regions.set('eu-west-1', { name: 'Europe (Ireland)', latency: 30 });
        this.regions.set('ap-southeast-1', { name: 'Asia Pacific (Singapore)', latency: 35 });
        this.regions.set('ap-northeast-1', { name: 'Asia Pacific (Tokyo)', latency: 40 });
    }
    
    initializeProviders() {
        this.providers.set('cloudflare', {
            name: 'Cloudflare',
            pops: 250,
            features: ['DDoS Protection', 'WAF', 'Workers'],
            pricing: 0.10 // per GB
        });
        
        this.providers.set('aws-cloudfront', {
            name: 'AWS CloudFront',
            pops: 400,
            features: ['Lambda@Edge', 'Shield', 'WAF'],
            pricing: 0.085
        });
        
        this.providers.set('fastly', {
            name: 'Fastly',
            pops: 65,
            features: ['Edge Computing', 'Real-time Analytics', 'Image Optimization'],
            pricing: 0.12
        });
    }
    
    async measurePerformance(url, region, provider) {
        const startTime = performance.now();
        
        try {
            // Simulate CDN request with realistic delays
            const baseLatency = this.regions.get(region)?.latency || 50;
            const providerMultiplier = this.getProviderMultiplier(provider);
            const cacheStatus = Math.random() > 0.3 ? 'HIT' : 'MISS';
            
            // Simulate network delay
            const networkDelay = baseLatency * providerMultiplier;
            const cacheDelay = cacheStatus === 'HIT' ? 5 : 150; // Cache hit vs origin fetch
            
            await this.simulateDelay(networkDelay + cacheDelay);
            
            const endTime = performance.now();
            const totalTime = endTime - startTime;
            
            const measurement = {
                url,
                region,
                provider,
                timestamp: new Date().toISOString(),
                responseTime: totalTime,
                cacheStatus,
                ttfb: networkDelay, // Time to First Byte
                downloadTime: totalTime - networkDelay,
                success: true
            };
            
            this.measurements.push(measurement);
            return measurement;
            
        } catch (error) {
            const measurement = {
                url,
                region,
                provider,
                timestamp: new Date().toISOString(),
                responseTime: performance.now() - startTime,
                cacheStatus: 'ERROR',
                error: error.message,
                success: false
            };
            
            this.measurements.push(measurement);
            return measurement;
        }
    }
    
    getProviderMultiplier(provider) {
        const multipliers = {
            'cloudflare': 0.9,
            'aws-cloudfront': 1.0,
            'fastly': 0.95
        };
        return multipliers[provider] || 1.0;
    }
    
    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async runPerformanceTest(urls, regions, providers, iterations = 3) {
        console.log('Starting CDN Performance Test...');
        const results = [];
        
        for (const url of urls) {
            for (const region of regions) {
                for (const provider of providers) {
                    console.log(\`Testing \${url} via \${provider} from \${region}\`);
                    
                    const measurements = [];
                    for (let i = 0; i < iterations; i++) {
                        const result = await this.measurePerformance(url, region, provider);
                        measurements.push(result);
                        
                        // Small delay between iterations
                        await this.simulateDelay(100);
                    }
                    
                    results.push({
                        url,
                        region,
                        provider,
                        measurements,
                        average: this.calculateAverage(measurements),
                        median: this.calculateMedian(measurements),
                        cacheHitRate: this.calculateCacheHitRate(measurements)
                    });
                }
            }
        }
        
        return results;
    }
    
    calculateAverage(measurements) {
        const validMeasurements = measurements.filter(m => m.success);
        if (validMeasurements.length === 0) return 0;
        
        const sum = validMeasurements.reduce((acc, m) => acc + m.responseTime, 0);
        return sum / validMeasurements.length;
    }
    
    calculateMedian(measurements) {
        const validTimes = measurements
            .filter(m => m.success)
            .map(m => m.responseTime)
            .sort((a, b) => a - b);
        
        if (validTimes.length === 0) return 0;
        
        const mid = Math.floor(validTimes.length / 2);
        return validTimes.length % 2 === 0
            ? (validTimes[mid - 1] + validTimes[mid]) / 2
            : validTimes[mid];
    }
    
    calculateCacheHitRate(measurements) {
        const validMeasurements = measurements.filter(m => m.success);
        if (validMeasurements.length === 0) return 0;
        
        const hits = validMeasurements.filter(m => m.cacheStatus === 'HIT').length;
        return (hits / validMeasurements.length) * 100;
    }
    
    generateReport(testResults) {
        const report = {
            summary: this.generateSummary(testResults),
            providerComparison: this.compareProviders(testResults),
            regionAnalysis: this.analyzeRegions(testResults),
            recommendations: this.generateRecommendations(testResults)
        };
        
        return report;
    }
    
    generateSummary(results) {
        const totalTests = results.length;
        const successfulTests = results.filter(r => r.average > 0).length;
        
        const allAverages = results
            .filter(r => r.average > 0)
            .map(r => r.average);
        
        const overallAverage = allAverages.length > 0
            ? allAverages.reduce((a, b) => a + b, 0) / allAverages.length
            : 0;
        
        const allCacheRates = results.map(r => r.cacheHitRate);
        const overallCacheRate = allCacheRates.length > 0
            ? allCacheRates.reduce((a, b) => a + b, 0) / allCacheRates.length
            : 0;
        
        return {
            totalTests,
            successfulTests,
            successRate: (successfulTests / totalTests) * 100,
            overallAverageResponseTime: overallAverage,
            overallCacheHitRate: overallCacheRate
        };
    }
    
    compareProviders(results) {
        const providerStats = new Map();
        
        for (const result of results) {
            if (!providerStats.has(result.provider)) {
                providerStats.set(result.provider, {
                    provider: result.provider,
                    tests: 0,
                    totalResponseTime: 0,
                    totalCacheRate: 0,
                    regions: new Set()
                });
            }
            
            const stats = providerStats.get(result.provider);
            stats.tests++;
            stats.totalResponseTime += result.average;
            stats.totalCacheRate += result.cacheHitRate;
            stats.regions.add(result.region);
        }
        
        return Array.from(providerStats.values()).map(stats => ({
            provider: stats.provider,
            averageResponseTime: stats.totalResponseTime / stats.tests,
            averageCacheHitRate: stats.totalCacheRate / stats.tests,
            regionsServed: stats.regions.size,
            providerInfo: this.providers.get(stats.provider)
        })).sort((a, b) => a.averageResponseTime - b.averageResponseTime);
    }
    
    analyzeRegions(results) {
        const regionStats = new Map();
        
        for (const result of results) {
            if (!regionStats.has(result.region)) {
                regionStats.set(result.region, {
                    region: result.region,
                    tests: 0,
                    totalResponseTime: 0,
                    bestProvider: null,
                    bestTime: Infinity
                });
            }
            
            const stats = regionStats.get(result.region);
            stats.tests++;
            stats.totalResponseTime += result.average;
            
            if (result.average < stats.bestTime && result.average > 0) {
                stats.bestTime = result.average;
                stats.bestProvider = result.provider;
            }
        }
        
        return Array.from(regionStats.values()).map(stats => ({
            region: stats.region,
            regionName: this.regions.get(stats.region)?.name || stats.region,
            averageResponseTime: stats.totalResponseTime / stats.tests,
            bestProvider: stats.bestProvider,
            bestProviderTime: stats.bestTime
        }));
    }
    
    generateRecommendations(results) {
        const recommendations = [];
        
        // Find best overall provider
        const providerComparison = this.compareProviders(results);
        const bestProvider = providerComparison[0];
        
        recommendations.push({
            type: 'Best Overall Provider',
            recommendation: bestProvider.provider,
            reason: \`Lowest average response time (\${bestProvider.averageResponseTime.toFixed(2)}ms) with \${bestProvider.averageCacheHitRate.toFixed(1)}% cache hit rate\`
        });
        
        // Regional recommendations
        const regionAnalysis = this.analyzeRegions(results);
        const slowestRegion = regionAnalysis.reduce((prev, current) => 
            prev.averageResponseTime > current.averageResponseTime ? prev : current
        );
        
        if (slowestRegion.averageResponseTime > 200) {
            recommendations.push({
                type: 'Performance Improvement',
                recommendation: \`Add more edge servers in \${slowestRegion.regionName}\`,
                reason: \`High response time (\${slowestRegion.averageResponseTime.toFixed(2)}ms) indicates need for closer edge presence\`
            });
        }
        
        // Cache optimization
        const lowCacheRates = results.filter(r => r.cacheHitRate < 70);
        if (lowCacheRates.length > 0) {
            recommendations.push({
                type: 'Cache Optimization',
                recommendation: 'Increase cache TTL and implement cache warming',
                reason: \`\${lowCacheRates.length} test scenarios show cache hit rates below 70%\`
            });
        }
        
        return recommendations;
    }
    
    exportResults(results, format = 'json') {
        const report = this.generateReport(results);
        
        if (format === 'json') {
            return JSON.stringify(report, null, 2);
        } else if (format === 'csv') {
            return this.convertToCSV(results);
        }
        
        return report;
    }
    
    convertToCSV(results) {
        const headers = ['URL', 'Region', 'Provider', 'Average Response Time', 'Cache Hit Rate', 'Median Response Time'];
        const rows = results.map(r => [
            r.url,
            r.region,
            r.provider,
            r.average.toFixed(2),
            r.cacheHitRate.toFixed(1),
            r.median.toFixed(2)
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\\n');
    }
}

// Usage example
async function runCDNAnalysis() {
    const analyzer = new CDNPerformanceAnalyzer();
    
    const testUrls = [
        '/images/hero-banner.jpg',
        '/css/main.css',
        '/js/app.bundle.js',
        '/api/products.json'
    ];
    
    const testRegions = ['us-east-1', 'us-west-1', 'eu-west-1'];
    const testProviders = ['cloudflare', 'aws-cloudfront', 'fastly'];
    
    console.log('=== CDN Performance Analysis ===');
    
    try {
        const results = await analyzer.runPerformanceTest(
            testUrls, testRegions, testProviders, 3
        );
        
        const report = analyzer.generateReport(results);
        
        console.log('\\n=== Test Summary ===');
        console.log(\`Total Tests: \${report.summary.totalTests}\`);
        console.log(\`Success Rate: \${report.summary.successRate.toFixed(1)}%\`);
        console.log(\`Overall Average Response Time: \${report.summary.overallAverageResponseTime.toFixed(2)}ms\`);
        console.log(\`Overall Cache Hit Rate: \${report.summary.overallCacheHitRate.toFixed(1)}%\`);
        
        console.log('\\n=== Provider Comparison ===');
        report.providerComparison.forEach((provider, index) => {
            console.log(\`\${index + 1}. \${provider.provider}\`);
            console.log(\`   Average Response Time: \${provider.averageResponseTime.toFixed(2)}ms\`);
            console.log(\`   Cache Hit Rate: \${provider.averageCacheHitRate.toFixed(1)}%\`);
            console.log(\`   Regions Served: \${provider.regionsServed}\`);
            console.log(\`   POPs: \${provider.providerInfo.pops}\`);
        });
        
        console.log('\\n=== Recommendations ===');
        report.recommendations.forEach((rec, index) => {
            console.log(\`\${index + 1}. \${rec.type}: \${rec.recommendation}\`);
            console.log(\`   Reason: \${rec.reason}\`);
        });
        
        // Export results
        const jsonReport = analyzer.exportResults(results, 'json');
        console.log('\\n=== Full Report (JSON) ===');
        console.log(jsonReport);
        
    } catch (error) {
        console.error('Analysis failed:', error);
    }
}

// Run the analysis
runCDNAnalysis();
      `
    }
  ],

  resources: [
    {
      title: "CDN Fundamentals - GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/what-is-cdn-how-it-works/",
      description: "Comprehensive introduction to CDN concepts and architecture"
    },
    {
      title: "How CDNs Work - YouTube",
      url: "https://www.youtube.com/watch?v=RI9np1LWzqw",
      description: "Visual explanation of CDN architecture and content delivery"
    },
    {
      title: "Cloudflare CDN Documentation",
      url: "https://developers.cloudflare.com/cache/",
      description: "Official Cloudflare guide to CDN configuration and optimization"
    },
    {
      title: "AWS CloudFront Developer Guide",
      url: "https://docs.aws.amazon.com/cloudfront/",
      description: "Comprehensive AWS CloudFront CDN documentation and best practices"
    },
    {
      title: "CDN Performance Testing Tools",
      url: "https://www.cdnperf.com/",
      description: "Real-time CDN performance monitoring and comparison tools"
    }
  ],

  questions: [
    {
      question: "What is a CDN and how does it improve web performance?",
      answer: "A CDN (Content Delivery Network) is a geographically distributed network of servers that cache and deliver content from locations closest to users. It improves performance by reducing latency through geographic proximity, decreasing server load, providing faster content delivery, and offering better availability through redundancy."
    },
    {
      question: "How does CDN caching work and what types of content can be cached?",
      answer: "CDN caching stores copies of content at edge servers based on cache policies and user demand. Static content (images, CSS, JavaScript, videos) is easily cached with long TTLs. Dynamic content can be cached with shorter TTLs or edge-side includes. Some CDNs also support API response caching and database query caching."
    },
    {
      question: "What are the different CDN architectures and their trade-offs?",
      answer: "Push CDN: Content is proactively uploaded to edge servers, good for sites with predictable traffic. Pull CDN: Content is cached on-demand when first requested, better for dynamic sites. Hybrid: Combines both approaches. Trade-offs include storage costs, cache hit rates, and content freshness."
    },
    {
      question: "How do CDNs handle cache invalidation and content updates?",
      answer: "CDN cache invalidation methods include: TTL expiration (time-based), manual purging (immediate removal), versioned URLs (cache busting), and conditional requests (ETag/Last-Modified). Strategies balance content freshness with cache efficiency, considering update frequency and business requirements."
    },
    {
      question: "What security features do modern CDNs provide?",
      answer: "CDN security features include: DDoS protection through traffic absorption, Web Application Firewall (WAF) for application-layer attacks, SSL/TLS termination and certificate management, bot mitigation, rate limiting, IP geoblocking, and security analytics. These protect both the origin server and end users."
    },
    {
      question: "How do you measure and optimize CDN performance?",
      answer: "CDN performance metrics include: cache hit ratio, response times, TTFB (Time to First Byte), bandwidth savings, and error rates. Optimization strategies involve proper cache policies, content compression, image optimization, HTTP/2 support, and strategic edge server placement."
    },
    {
      question: "What is the difference between CDN and load balancing?",
      answer: "CDN focuses on geographic content distribution and caching to reduce latency globally, while load balancing distributes traffic across multiple servers in the same location for capacity and availability. CDNs often include load balancing features, and load balancers can work with CDNs for comprehensive traffic management."
    },
    {
      question: "How do CDNs handle dynamic content and personalization?",
      answer: "CDNs handle dynamic content through: edge-side includes (ESI) for partial caching, API response caching with short TTLs, edge computing for personalization logic, cache segmentation by user attributes, and real-time content assembly at edge locations while maintaining performance benefits."
    },
    {
      question: "What factors should you consider when choosing a CDN provider?",
      answer: "Key factors include: global coverage and PoP locations, performance benchmarks, pricing structure, security features, API capabilities, integration ease, analytics and reporting, customer support, SLA guarantees, and specific features like edge computing or streaming optimization."
    },
    {
      question: "How do CDNs impact SEO and website analytics?",
      answer: "CDN benefits for SEO include improved page load speeds (ranking factor), better user experience, and global accessibility. Analytics considerations involve proper tracking setup, understanding cache behavior effects on metrics, implementing real user monitoring, and ensuring accurate geographic data collection."
    }
  ]
};