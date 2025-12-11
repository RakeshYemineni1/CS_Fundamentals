export const enhancedTransmissionMedia = {
  id: 'transmission-media',
  title: 'Transmission Media',
  subtitle: 'Guided vs Unguided Media Types',
  summary: 'Physical pathways for data transmission including wired (guided) and wireless (unguided) communication channels with their characteristics, advantages, and applications.',
  
  analogy: "Think of transmission media like different types of roads for transportation. Guided media are like highways with clear lanes and barriers (cables with defined paths), while unguided media are like open fields where vehicles can move freely in any direction (wireless signals through air).",
  
  visualConcept: "Imagine data as cars traveling from source to destination. Guided media provide dedicated lanes (copper wires, fiber optics) with specific routes, while unguided media allow free movement through open space (radio waves, microwaves) but with potential interference from weather and obstacles.",
  
  realWorldUse: "Ethernet cables in offices (guided), Wi-Fi networks in homes (unguided), fiber optic internet connections (guided), cellular networks (unguided), and satellite communications (unguided).",

  explanation: `
Transmission media are the physical pathways through which data travels from sender to receiver in a network. They are classified into two main categories:

Guided Media (Wired)
Physical cables that provide a direct pathway for signals. The electromagnetic signals are guided along a specific path.

Unguided Media (Wireless)
Signals propagate through air, water, or vacuum without physical conductors. The signals spread in all directions from the source.

Key Characteristics:
- Bandwidth: Range of frequencies the medium can carry
- Attenuation: Signal strength loss over distance
- Interference: External signal disruption
- Cost: Installation and maintenance expenses
- Security: Susceptibility to eavesdropping
- Installation: Ease of setup and maintenance

Selection Criteria:
- Distance requirements
- Bandwidth needs
- Environmental conditions
- Security requirements
- Cost constraints
- Mobility requirements
  `,

  keyPoints: [
    "Guided media use physical cables for signal transmission",
    "Unguided media transmit signals through air or space",
    "Twisted pair cables are most common for LANs",
    "Fiber optic cables offer highest bandwidth and security",
    "Coaxial cables provide good shielding from interference",
    "Radio waves enable long-distance wireless communication",
    "Microwaves require line-of-sight transmission",
    "Infrared is used for short-range, high-speed communication",
    "Satellite communication covers vast geographical areas",
    "Media selection depends on distance, bandwidth, and cost"
  ],

  codeExamples: [
    {
      title: "Cable Specifications Calculator",
      language: "python",
      code: `
class TransmissionMedia:
    def __init__(self):
        self.guided_media = {
            'twisted_pair': {
                'bandwidth': '100 MHz',
                'max_distance': '100m',
                'cost': 'Low',
                'security': 'Medium'
            },
            'coaxial': {
                'bandwidth': '1 GHz',
                'max_distance': '500m',
                'cost': 'Medium',
                'security': 'High'
            },
            'fiber_optic': {
                'bandwidth': '100+ GHz',
                'max_distance': '100+ km',
                'cost': 'High',
                'security': 'Very High'
            }
        }
        
        self.unguided_media = {
            'radio_waves': {
                'frequency': '3 kHz - 300 GHz',
                'range': '1000+ km',
                'line_of_sight': False
            },
            'microwaves': {
                'frequency': '300 MHz - 300 GHz',
                'range': '50 km',
                'line_of_sight': True
            },
            'infrared': {
                'frequency': '300 GHz - 400 THz',
                'range': '10m',
                'line_of_sight': True
            }
        }
    
    def calculate_attenuation(self, media_type, distance, frequency=None):
        """Calculate signal attenuation for different media"""
        if media_type == 'twisted_pair':
            # Attenuation in dB per 100m
            return 0.2 * (distance / 100) * (frequency / 1000000) ** 0.5
        elif media_type == 'coaxial':
            return 0.1 * (distance / 100) * (frequency / 1000000) ** 0.5
        elif media_type == 'fiber_optic':
            return 0.2 * (distance / 1000)  # dB per km
        else:
            return "Unknown media type"
    
    def recommend_media(self, distance, bandwidth_req, security_level):
        """Recommend appropriate transmission media"""
        recommendations = []
        
        if distance <= 100 and bandwidth_req <= 1000:
            recommendations.append("Twisted Pair (Cat 6)")
        
        if distance <= 500 and security_level == "high":
            recommendations.append("Coaxial Cable")
        
        if distance > 500 or bandwidth_req > 10000:
            recommendations.append("Fiber Optic")
        
        if distance > 1000:
            recommendations.extend(["Microwave", "Satellite"])
        
        return recommendations

# Usage example
media = TransmissionMedia()
print("Attenuation for 200m twisted pair at 100MHz:")
print(f"{media.calculate_attenuation('twisted_pair', 200, 100000000):.2f} dB")

print("\\nRecommendation for 50m, 100Mbps, high security:")
print(media.recommend_media(50, 100, "high"))
      `
    },
    {
      title: "Wireless Signal Propagation Model",
      language: "java",
      code: `
public class WirelessPropagation {
    private static final double SPEED_OF_LIGHT = 3e8; // m/s
    
    public static class SignalCharacteristics {
        private double frequency;
        private double wavelength;
        private double power;
        private String propagationType;
        
        public SignalCharacteristics(double frequency, double power) {
            this.frequency = frequency;
            this.wavelength = SPEED_OF_LIGHT / frequency;
            this.power = power;
            this.propagationType = determinePropagationType(frequency);
        }
        
        private String determinePropagationType(double freq) {
            if (freq < 2e6) return "Ground Wave";
            else if (freq < 30e6) return "Sky Wave";
            else return "Line of Sight";
        }
        
        // Free Space Path Loss calculation
        public double calculatePathLoss(double distance) {
            return 20 * Math.log10(distance) + 
                   20 * Math.log10(frequency) + 
                   20 * Math.log10(4 * Math.PI / SPEED_OF_LIGHT);
        }
        
        public double getReceivedPower(double distance) {
            double pathLoss = calculatePathLoss(distance);
            return power - pathLoss;
        }
        
        @Override
        public String toString() {
            return String.format(
                "Frequency: %.2f MHz\\nWavelength: %.2f m\\n" +
                "Power: %.2f dBm\\nPropagation: %s",
                frequency / 1e6, wavelength, power, propagationType
            );
        }
    }
    
    public static void main(String[] args) {
        // WiFi 2.4 GHz signal
        SignalCharacteristics wifi = new SignalCharacteristics(2.4e9, 20);
        System.out.println("WiFi Signal Characteristics:");
        System.out.println(wifi);
        System.out.println("Path Loss at 100m: " + 
                         String.format("%.2f dB", wifi.calculatePathLoss(100)));
        System.out.println("Received Power at 100m: " + 
                         String.format("%.2f dBm", wifi.getReceivedPower(100)));
    }
}
      `
    },
    {
      title: "Cable Performance Comparison",
      language: "javascript",
      code: `
class CablePerformance {
    constructor() {
        this.cableTypes = {
            'cat5e': {
                bandwidth: 100, // MHz
                maxLength: 100, // meters
                cost: 0.5, // per meter
                shielding: false
            },
            'cat6': {
                bandwidth: 250,
                maxLength: 100,
                cost: 0.8,
                shielding: false
            },
            'cat6a': {
                bandwidth: 500,
                maxLength: 100,
                cost: 1.2,
                shielding: true
            },
            'fiber_mm': {
                bandwidth: 10000, // MHz
                maxLength: 2000,
                cost: 2.0,
                shielding: true
            },
            'fiber_sm': {
                bandwidth: 100000,
                maxLength: 100000,
                cost: 3.0,
                shielding: true
            }
        };
    }
    
    calculateTotalCost(cableType, length, connectors = 2) {
        const cable = this.cableTypes[cableType];
        const cableCost = cable.cost * length;
        const connectorCost = connectors * (cableType.includes('fiber') ? 50 : 5);
        return cableCost + connectorCost;
    }
    
    getMaxDataRate(cableType) {
        const cable = this.cableTypes[cableType];
        // Simplified calculation based on Shannon's theorem
        const snr = cable.shielding ? 40 : 30; // dB
        return cable.bandwidth * Math.log2(1 + Math.pow(10, snr/10));
    }
    
    comparePerformance(requirements) {
        const suitable = [];
        
        for (const [type, specs] of Object.entries(this.cableTypes)) {
            const maxRate = this.getMaxDataRate(type);
            const cost = this.calculateTotalCost(type, requirements.distance);
            
            if (specs.maxLength >= requirements.distance &&
                maxRate >= requirements.dataRate &&
                cost <= requirements.budget) {
                
                suitable.push({
                    type,
                    bandwidth: specs.bandwidth,
                    maxRate: Math.round(maxRate),
                    cost: cost.toFixed(2),
                    efficiency: (maxRate / cost).toFixed(2)
                });
            }
        }
        
        return suitable.sort((a, b) => b.efficiency - a.efficiency);
    }
}

// Usage example
const performance = new CablePerformance();
const requirements = {
    distance: 80, // meters
    dataRate: 1000, // Mbps
    budget: 200 // dollars
};

console.log("Cable Performance Comparison:");
const results = performance.comparePerformance(requirements);
results.forEach(cable => {
    console.log(\`\${cable.type}: \${cable.maxRate} Mbps, $\${cable.cost}, Efficiency: \${cable.efficiency}\`);
});
      `
    }
  ],

  resources: [
    {
      title: "Transmission Media - GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/transmission-media/",
      description: "Comprehensive guide to guided and unguided transmission media"
    },
    {
      title: "Network Cables Explained - YouTube",
      url: "https://www.youtube.com/watch?v=_NX99ad2FUA",
      description: "Visual explanation of different cable types and their uses"
    },
    {
      title: "Fiber Optic Communication - Tutorial",
      url: "https://www.tutorialspoint.com/optical_fiber_communication/index.htm",
      description: "Detailed tutorial on fiber optic transmission principles"
    },
    {
      title: "Wireless Communication Fundamentals",
      url: "https://www.electronics-tutorials.ws/radio/radio_1.html",
      description: "Basic principles of wireless signal propagation"
    },
    {
      title: "Cable Performance Standards - TIA/EIA",
      url: "https://www.tiaonline.org/standards/",
      description: "Official standards for structured cabling systems"
    }
  ],

  questions: [
    {
      question: "What are the main differences between guided and unguided transmission media?",
      answer: "Guided media use physical cables (twisted pair, coaxial, fiber optic) to direct signals along specific paths, offering better security and reliability. Unguided media transmit signals through air/space (radio, microwave, infrared) without physical conductors, providing mobility but with potential interference and security concerns."
    },
    {
      question: "Why is fiber optic cable preferred for long-distance communication?",
      answer: "Fiber optic cables offer extremely high bandwidth (100+ GHz), very low attenuation (0.2 dB/km), immunity to electromagnetic interference, high security (difficult to tap), and can transmit over long distances (100+ km) without repeaters."
    },
    {
      question: "What factors determine the choice of transmission media?",
      answer: "Key factors include: required bandwidth, transmission distance, cost constraints, security requirements, environmental conditions, installation complexity, maintenance needs, and whether mobility is required."
    },
    {
      question: "Explain the concept of attenuation in transmission media.",
      answer: "Attenuation is the loss of signal strength as it travels through the medium. It increases with distance and frequency. Copper cables have higher attenuation than fiber optics. It's measured in decibels (dB) and determines the maximum transmission distance without amplification."
    },
    {
      question: "What are the advantages and disadvantages of wireless transmission?",
      answer: "Advantages: mobility, easy installation, cost-effective for remote areas, broadcast capability. Disadvantages: susceptible to interference, security vulnerabilities, limited bandwidth, weather-dependent, requires line-of-sight for some types."
    },
    {
      question: "How does frequency affect wireless signal propagation?",
      answer: "Higher frequencies have shorter wavelengths, enabling higher data rates but with limited range and requiring line-of-sight. Lower frequencies can travel longer distances and penetrate obstacles better but offer lower bandwidth. Frequency also determines propagation characteristics (ground wave, sky wave, space wave)."
    },
    {
      question: "What is the difference between single-mode and multi-mode fiber optic cables?",
      answer: "Single-mode fiber has a smaller core (8-10 μm) allowing only one light path, suitable for long distances (100+ km) with higher bandwidth. Multi-mode fiber has a larger core (50-62.5 μm) allowing multiple light paths, used for shorter distances (2 km) with lower cost."
    },
    {
      question: "Why do microwave transmissions require line-of-sight?",
      answer: "Microwaves (300 MHz - 300 GHz) have short wavelengths that cannot bend around obstacles or follow Earth's curvature. They travel in straight lines and are absorbed by atmospheric moisture, requiring direct visual path between transmitter and receiver antennas."
    },
    {
      question: "What are the security implications of different transmission media?",
      answer: "Guided media offer better security as physical access is required for tapping. Fiber optics are most secure (difficult to tap without detection). Wireless media are most vulnerable as signals can be intercepted from a distance. Coaxial cables offer better security than twisted pair due to shielding."
    },
    {
      question: "How do you calculate the bandwidth requirements for a transmission medium?",
      answer: "Consider: data rate requirements, number of simultaneous users, protocol overhead, error correction needs, and future growth. Use Shannon's theorem (C = B × log₂(1 + S/N)) where C is capacity, B is bandwidth, and S/N is signal-to-noise ratio. Add safety margin for real-world conditions."
    }
  ]
};