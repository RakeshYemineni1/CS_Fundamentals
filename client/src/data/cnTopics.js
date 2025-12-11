import networkModels from './enhancedNetworkModels';
import applicationLayer from './enhancedApplicationLayer';
import { enhancedHTTPvsHTTPS } from './enhancedHTTPvsHTTPS';
import { enhancedHTTPMethods } from './enhancedHTTPMethods';
import { enhancedHTTPStatusCodes } from './enhancedHTTPStatusCodes';
import { enhancedDNS } from './enhancedDNS';
import { enhancedEmailProtocols } from './enhancedEmailProtocols';
import { enhancedCookiesSessions } from './enhancedCookiesSessions';
import { enhancedRESTAPI } from './enhancedRESTAPI';
import { enhancedTCPvsUDP } from './enhancedTCPvsUDP';
import { enhancedTCPHandshake } from './enhancedTCPHandshake';
import { enhancedTCPTermination } from './enhancedTCPTermination';
import { enhancedFlowControl } from './enhancedFlowControl';
import { enhancedCongestionControl } from './enhancedCongestionControl';
import { enhancedPortNumbers } from './enhancedPortNumbers';
import { enhancedSocketProgramming } from './enhancedSocketProgramming';
import { enhancedIPv4vsIPv6 } from './enhancedIPv4vsIPv6';
import { enhancedPublicPrivateIP } from './enhancedPublicPrivateIP';
import { enhancedSubnettingCIDR } from './enhancedSubnettingCIDR';
import { enhancedNAT } from './enhancedNAT';
import { enhancedICMP } from './enhancedICMP';
import { enhancedRoutingAlgorithms } from './enhancedRoutingAlgorithms';
import { enhancedRoutingProtocols } from './enhancedRoutingProtocols';
import { enhancedMACAddress } from './enhancedMACAddress';
import { enhancedARP } from './enhancedARP';
import { enhancedSwitchHubRouter } from './enhancedSwitchHubRouter';
import { enhancedEthernet } from './enhancedEthernet';
import { enhancedErrorDetection } from './enhancedErrorDetection';
import { enhancedTransmissionMedia } from './enhancedTransmissionMedia';
import { enhancedBandwidthThroughput } from './enhancedBandwidthThroughput';
import { enhancedNetworkTopologies } from './enhancedNetworkTopologies';

// Import Important Concepts topics
import { enhancedClientServerP2P } from './enhancedClientServerP2P';
import { enhancedDHCP } from './enhancedDHCP';
import { enhancedFirewall } from './enhancedFirewall';
import { enhancedVPN } from './enhancedVPN';
import { enhancedLoadBalancing } from './enhancedLoadBalancing';
import { enhancedCDN } from './enhancedCDN';
import { enhancedLatencyThroughput } from './enhancedLatencyThroughput';
import { enhancedURLWorkflow } from './enhancedURLWorkflow';
import { enhancedBasicCommands } from './enhancedBasicCommands';

export const cnTopics = [
  // Network Models
  networkModels,
  
  // Application Layer - Original Overview
  applicationLayer,
  
  // Application Layer - Detailed Topics
  enhancedHTTPvsHTTPS,
  enhancedHTTPMethods,
  enhancedHTTPStatusCodes,
  enhancedDNS,
  enhancedEmailProtocols,
  enhancedCookiesSessions,
  enhancedRESTAPI,
  
  // Transport Layer - Detailed Topics
  enhancedTCPvsUDP,
  enhancedTCPHandshake,
  enhancedTCPTermination,
  enhancedFlowControl,
  enhancedCongestionControl,
  enhancedPortNumbers,
  enhancedSocketProgramming,
  
  // Network Layer - Detailed Topics
  enhancedIPv4vsIPv6,
  enhancedPublicPrivateIP,
  enhancedSubnettingCIDR,
  enhancedNAT,
  enhancedICMP,
  enhancedRoutingAlgorithms,
  enhancedRoutingProtocols,
  
  // Data Link Layer - Detailed Topics
  enhancedMACAddress,
  enhancedARP,
  enhancedSwitchHubRouter,
  enhancedEthernet,
  enhancedErrorDetection,
  
  // Physical Layer - Detailed Topics
  enhancedTransmissionMedia,
  enhancedBandwidthThroughput,
  enhancedNetworkTopologies,
  
  // Important Concepts - Detailed Topics
  enhancedClientServerP2P,
  enhancedDHCP,
  enhancedFirewall,
  enhancedVPN,
  enhancedLoadBalancing,
  enhancedCDN,
  enhancedLatencyThroughput,
  enhancedURLWorkflow,
  enhancedBasicCommands
];