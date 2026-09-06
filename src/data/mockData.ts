import type { Application, EcosystemCluster, VerificationTask, SimulationScenario } from '../types/eeris';

// Preserved Hero Demonstration Case
const HERO_APPLICATION: Application = {
  id: 'APP-78287',
  applicantName: 'Sunita Verma',
  pan: 'ABCPS9182F',
  phone: '+91 98765 43210',
  deviceId: 'DEV-9810',
  dealer: 'Apex Auto',
  guarantor: 'GNT-8890',
  location: 'North Zone • Delhi NCR',
  status: 'Targeted Verification Required',
  ecosystemPattern: 'High Ecosystem Risk',
  individualRisk: 31,
  individualRiskLevel: 'Low',
  ecosystemRisk: 84,
  ecosystemRiskLevel: 'High',
  novelty: 0.92,
  ecosystem: 'ECO-1024',
  appliedAmount: '₹2,40,000',
  submittedTime: '3.2 hours ago',
  caseId: '8849-0192-A',
  rail: 'Auto Loan Underwriting Rail • Regional Cluster North',
  maturityState: 'Stage 3',
  coordinatedPattern: 'Coordinated Pattern',
  topDrivers: [
    {
      id: 'driver-1',
      title: 'Shared Device',
      contributionPercent: 22,
      riskLevel: 'High',
      details: 'IMEI 863920194827 is associated with 8 loan applications across 3 geographic PIN codes within 48 hours.',
      tags: ['Hardware Signature Match', 'Cluster #CL-901']
    },
    {
      id: 'driver-2',
      title: 'Dealer Concentration',
      contributionPercent: 18,
      riskLevel: 'High',
      details: 'Apex Auto has a 4.2x velocity spike in first-time buyer applications.',
      tags: ['Merchant Velocity Anomaly'],
      metaKey: 'POS-ID:',
      metaValue: '44021'
    },
    {
      id: 'driver-3',
      title: 'Guarantor Reuse',
      contributionPercent: 14,
      riskLevel: 'Medium',
      details: 'Guarantor R. Sharma (GNT-8890) co-signed 5 pending loans without declared familial relation.',
      tags: ['Cross-Entity Link', 'Unrelated Co-sign']
    }
  ],
  recommendedAction: {
    badge: 'TARGETED VERIFICATION',
    title: 'Recommended Action',
    text: 'Verify device and guarantor.',
    targetAppId: 'APP-78287'
  }
};

// Seeded PRNG for reproducible synthetic generation
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const FIRST_NAMES = [
  'Amit', 'Priya', 'Rajesh', 'Sunita', 'Vikram', 'Sneha', 'Suresh', 'Ananya', 'Rohan', 'Kavita',
  'Deepak', 'Meera', 'Arjun', 'Pooja', 'Sanjay', 'Neha', 'Alok', 'Ritu', 'Manish', 'Divya',
  'Nitin', 'Swati', 'Gaurav', 'Anjali', 'Karan', 'Preeti', 'Rahul', 'Nisha', 'Vijay', 'Shweta'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Kumar', 'Nair', 'Malhotra', 'Kulkarni', 'Patel', 'Iyer', 'Gupta', 'Reddy',
  'Singh', 'Joshi', 'Deshmukh', 'Chawla', 'Mehta', 'Rao', 'Bhasin', 'Bose', 'Pillai', 'Agarwal',
  'Choudhury', 'Kapoor', 'Saxena', 'Trivedi', 'Venkatesh', 'Bhatt', 'Shetty', 'Jain', 'Das', 'Chatterjee'
];

const DEALERS = [
  'Apex Auto', 'Zenith Motors', 'Royal Wheels', 'Velocity Auto', 'Metro Motors',
  'Bharat Mobiles', 'Sunrise Retailers', 'Spark Auto', 'Apex Electronics', 'Horizon Motors',
  'Prime Mobility', 'Grand Wheels', 'Star Digital', 'National Auto', 'City Motors'
];

const LOCATIONS = [
  'North Zone • Delhi NCR', 'West Zone • Mumbai Metro', 'South Zone • Bengaluru Urban',
  'East Zone • Kolkata Metro', 'Central Zone • Indore', 'North-West • Jaipur',
  'South Zone • Hyderabad', 'West Zone • Pune Urban'
];

const RAILS = [
  'Auto Loan Underwriting Rail • Regional Cluster North',
  'Consumer Durable Rail • Regional Cluster West',
  'Personal Loan Rail • Regional Cluster South',
  'Two-Wheeler Loan Rail • Regional Cluster East',
  'Commercial Vehicle Rail • Central Zone'
];

function generate100Applications(): Application[] {
  const apps: Application[] = [HERO_APPLICATION];
  const rng = seededRandom(4029);

  const sharedDevices = ['DEV-9810', 'DEV-4402', 'DEV-7719', 'DEV-2290', 'DEV-8815', 'DEV-3301'];
  const sharedGuarantors = ['GNT-8890', 'GNT-4401', 'GNT-1289', 'GNT-9902', 'GNT-5540'];
  const sharedEcosystems = ['ECO-1024', 'ECO-1033', 'ECO-1045', 'ECO-1011', 'ECO-0995', 'ECO-1088', 'ECO-1102'];

  for (let i = 2; i <= 100; i++) {
    const appId = `APP-${78287 + i - 1}`;
    const firstName = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    const applicantName = `${firstName} ${lastName}`;
    const pan = `${String.fromCharCode(65 + Math.floor(rng() * 26))}${String.fromCharCode(65 + Math.floor(rng() * 26))}${String.fromCharCode(65 + Math.floor(rng() * 26))}PS${1000 + Math.floor(rng() * 9000)}${String.fromCharCode(65 + Math.floor(rng() * 26))}`;
    const phone = `+91 ${98000 + Math.floor(rng() * 1999)} ${10000 + Math.floor(rng() * 89999)}`;
    
    // Determine Ecosystem Pattern & Risks
    const patternType = Math.floor(rng() * 10); // 0-3 Low, 4-5 Medium, 6-7 High Eco, 8 Emerging, 9 Benign Dense
    let ecosystemPattern: Application['ecosystemPattern'] = 'Low Risk';
    let individualRisk = Math.floor(15 + rng() * 25);
    let ecosystemRisk = Math.floor(15 + rng() * 30);
    let ecosystem = sharedEcosystems[Math.floor(rng() * sharedEcosystems.length)];
    let deviceId = `DEV-${1000 + Math.floor(rng() * 9000)}`;
    let dealer = DEALERS[Math.floor(rng() * DEALERS.length)];
    let guarantor = `GNT-${1000 + Math.floor(rng() * 9000)}`;
    let maturityState = 'Stage 1';
    let coordinatedPattern = 'Isolated Application';
    let novelty = Number((0.15 + rng() * 0.45).toFixed(2));
    let status = 'Standard Approval';

    if (patternType >= 6 && patternType <= 7) {
      // High Ecosystem Risk scenario (Hero-like divergence!)
      ecosystemPattern = 'High Ecosystem Risk';
      individualRisk = Math.floor(20 + rng() * 20); // Low individual risk (20-40)
      ecosystemRisk = Math.floor(74 + rng() * 18);  // High ecosystem risk (74-92)
      ecosystem = rng() > 0.4 ? 'ECO-1024' : 'ECO-1033';
      deviceId = sharedDevices[Math.floor(rng() * sharedDevices.length)];
      dealer = 'Apex Auto';
      guarantor = sharedGuarantors[Math.floor(rng() * sharedGuarantors.length)];
      maturityState = 'Stage 3';
      coordinatedPattern = 'Coordinated Pattern';
      novelty = Number((0.75 + rng() * 0.22).toFixed(2));
      status = 'Targeted Verification Required';
    } else if (patternType === 8) {
      // Emerging Ecosystem
      ecosystemPattern = 'Emerging Ecosystem';
      individualRisk = Math.floor(35 + rng() * 20);
      ecosystemRisk = Math.floor(65 + rng() * 15);
      ecosystem = 'ECO-1045';
      deviceId = sharedDevices[Math.floor(rng() * sharedDevices.length)];
      maturityState = 'Stage 2';
      coordinatedPattern = 'Emerging Cluster';
      novelty = Number((0.60 + rng() * 0.25).toFixed(2));
      status = 'Under Review';
    } else if (patternType === 9) {
      // Benign Dense Ecosystem (Family / village cluster - high connections, low risk)
      ecosystemPattern = 'Benign Dense Ecosystem';
      individualRisk = Math.floor(18 + rng() * 15);
      ecosystemRisk = Math.floor(28 + rng() * 20);
      ecosystem = 'ECO-1011';
      maturityState = 'Stage 1';
      coordinatedPattern = 'Dense Family Cluster (Clean)';
      novelty = Number((0.25 + rng() * 0.20).toFixed(2));
      status = 'Standard Approval';
    } else if (patternType >= 4 && patternType <= 5) {
      // Medium Risk
      ecosystemPattern = 'Medium Risk';
      individualRisk = Math.floor(45 + rng() * 18);
      ecosystemRisk = Math.floor(52 + rng() * 18);
      maturityState = 'Stage 2';
      coordinatedPattern = 'Moderate Dealer Velocity';
      status = 'Under Review';
    }

    const individualRiskLevel = individualRisk > 60 ? 'High' : individualRisk > 40 ? 'Medium' : 'Low';
    const ecosystemRiskLevel = ecosystemRisk > 70 ? 'High' : ecosystemRisk > 45 ? 'Medium' : 'Low';

    const appliedAmountNum = Math.floor(100 + rng() * 400) * 1000;
    const appliedAmount = `₹${appliedAmountNum.toLocaleString('en-IN')}`;
    const hoursAgo = (0.5 + i * 0.35).toFixed(1);

    const drivers: Application['topDrivers'] = [];
    if (ecosystemRiskLevel === 'High') {
      drivers.push({
        id: `driver-${i}-1`,
        title: 'Shared Device Collision',
        contributionPercent: Math.floor(20 + rng() * 10),
        riskLevel: 'High',
        details: `Device ${deviceId} registered with multiple loan requests in 24 hours.`,
        tags: ['Device Signature']
      });
      drivers.push({
        id: `driver-${i}-2`,
        title: 'Dealer Velocity Anomaly',
        contributionPercent: Math.floor(15 + rng() * 8),
        riskLevel: 'High',
        details: `High application burst through merchant ${dealer}.`,
        tags: ['Merchant Burst']
      });
      if (rng() > 0.4) {
        drivers.push({
          id: `driver-${i}-3`,
          title: 'Guarantor Reuse',
          contributionPercent: Math.floor(10 + rng() * 6),
          riskLevel: 'Medium',
          details: `Guarantor ${guarantor} co-signed multiple unrelated active applications.`,
          tags: ['Guarantor Link']
        });
      }
    } else if (ecosystemRiskLevel === 'Medium') {
      drivers.push({
        id: `driver-${i}-1`,
        title: 'Moderate Merchant Velocity',
        contributionPercent: Math.floor(12 + rng() * 8),
        riskLevel: 'Medium',
        details: `Slight surge in applicant volume via ${dealer}.`,
        tags: ['Merchant Signal']
      });
    }

    let recBadge = 'STANDARD APPROVAL';
    let recText = 'Individual and ecosystem risk profiles remain low. Proceed with standard verification.';
    if (ecosystemRiskLevel === 'High') {
      recBadge = 'TARGETED VERIFICATION';
      recText = 'Verify device and guarantor.';
    } else if (ecosystemRiskLevel === 'Medium') {
      recBadge = 'ENHANCED DUE DILIGENCE';
      recText = 'Request additional proof of address and dealer confirmation.';
    }

    apps.push({
      id: appId,
      applicantName,
      pan,
      phone,
      deviceId,
      dealer,
      guarantor,
      location: LOCATIONS[Math.floor(rng() * LOCATIONS.length)],
      status,
      ecosystemPattern,
      individualRisk,
      individualRiskLevel,
      ecosystemRisk,
      ecosystemRiskLevel,
      novelty,
      ecosystem,
      appliedAmount,
      submittedTime: `${hoursAgo} hours ago`,
      caseId: `8849-0${200 + i}-X`,
      rail: RAILS[Math.floor(rng() * RAILS.length)],
      maturityState,
      coordinatedPattern,
      topDrivers: drivers,
      recommendedAction: {
        badge: recBadge,
        title: 'Recommended Action',
        text: recText,
        targetAppId: appId
      }
    });
  }

  return apps;
}

export const INITIAL_APPLICATIONS: Application[] = generate100Applications();

export const MAIN_CLUSTER: EcosystemCluster = {
  id: 'ECO-1024',
  name: 'Synthetic Ring #4029',
  status: 'Critical Topology',
  riskScore: 84,
  novelty: 0.92,
  maturity: 'Stage 3',
  growth: '+34%',
  nodesCount: 14,
  edgesCount: 19,
  detectedPattern: 'Detected: Rapid multi-applicant device collision with synchronized UPI sweep pattern'
};

export const INITIAL_VERIFICATION_TASKS: VerificationTask[] = [
  {
    id: 'task-1',
    title: 'Verify device possession',
    description: 'Trigger silent SMS hardware challenge and biometric one-time sign on applicant handset.',
    completed: false
  },
  {
    id: 'task-2',
    title: 'Dealer verification',
    description: 'Cross-reference POS terminal logs and physical dealer invoice with Apex Auto.',
    completed: false
  },
  {
    id: 'task-3',
    title: 'Guarantor verification',
    description: 'Confirm familial relationship and obtain verified affidavit from GNT-8890.',
    completed: false
  }
];

export const INITIAL_SIMULATION: SimulationScenario = {
  id: 'scenario-shared-device',
  name: 'Verify Shared Device',
  currentRisk: 84,
  simulatedRisk: 56,
  reductionPts: 28,
  statusBefore: 'Elevated',
  statusAfter: 'Moderate'
};
