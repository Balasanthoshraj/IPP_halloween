export interface DepartmentHighlight {
  label: string;
  value: string;
  subtext: string;
}

export interface AcademicPillar {
  title: string;
  iconName: string;
  description: string;
  specialties: string[];
}

export interface SymposiumEvent {
  id: string;
  title: string;
  category: "Technical" | "Non-Technical" | "Workshop" | "Gaming";
  tagline: string;
  time: string;
  venue: string;
  teamSize: string;
  prizePool: string;
  description: string;
  rules: string[];
  coordinators: { name: string; contact: string }[];
}

export interface ChronicleArchive {
  year: string;
  editionName: string;
  theme: string;
  delegates: string;
  colleges: string;
  cashPrize: string;
  overallChampion: string;
  summary: string;
  photos: { caption: string; url: string }[];
  highlights: string[];
}

export interface AchievementItem {
  id: string;
  year: string;
  title: string;
  category: "Hackathon" | "Research" | "Placement" | "Patent";
  badge: string;
  description: string;
}

export interface SymposiumData {
  department: {
    institution: string;
    name: string;
    shortName: string;
    establishedYear: string;
    accreditation: string;
    hodMessage: {
      quote: string;
      author: string;
      designation: string;
    };
    vision: string;
    mission: string[];
    stats: DepartmentHighlight[];
    academicPillars: AcademicPillar[];
  };
  symposium: {
    title: string;
    edition: string;
    dates: string;
    venue: string;
    themeTitle: string;
    themeDescription: string;
    vision: string;
    pillars: { title: string; desc: string }[];
    totalPrizePool: string;
  };
  events: SymposiumEvent[];
  archives: ChronicleArchive[];
  achievements: AchievementItem[];
  nextChapter: {
    dates: string;
    countdownTarget: string; // ISO string
    registrationDeadline: string;
    registrationUrl: string;
    venueAddress: string;
    email: string;
    phone: string;
    faqs: { question: string; answer: string }[];
  };
}

export const symposiumData: SymposiumData = {
  department: {
    institution: "Imperial Institute of Technology & Science",
    name: "Department of Computer Science & Engineering",
    shortName: "CSE Citadel",
    establishedYear: "1998",
    accreditation: "NBA Tier-I Accredited | NAAC A++ Grade",
    hodMessage: {
      quote:
        "Within these shadowed halls of computational mastery, we forge not merely engineers, but digital alchemists capable of bending data, algorithms, and artificial minds to solve humanity's deepest enigmas.",
      author: "Dr. Alistair Vance, Ph.D.",
      designation: "Professor & Head of Department",
    },
    vision:
      "To be a premier sanctuary of computer science education and cutting-edge research, nurturing visionary innovators who master ethical intelligence and solve global challenges.",
    mission: [
      "Deliver rigorous foundational mastery in systems, algorithms, and emerging intelligence paradigms.",
      "Cultivate high-impact research collaborations with global technology conglomerates and laboratories.",
      "Empower students through experiential hackathons, open-source craftsmanship, and symposium leadership.",
    ],
    stats: [
      { label: "Active Scholars", value: "850+", subtext: "Undergraduate & Postgrad" },
      { label: "Placement Ratio", value: "98.4%", subtext: "Top Tier Tier-1 Tech Firms" },
      { label: "Patents Granted", value: "34+", subtext: "AI & Embedded Computing" },
      { label: "Research Grants", value: "$2.4M", subtext: "Funded Labs & Projects" },
    ],
    academicPillars: [
      {
        title: "Artificial Intelligence & Neural Lore",
        iconName: "BrainCircuit",
        description: "Deep generative networks, reinforcement learning agents, and NLP reasoning architectures.",
        specialties: ["Deep Vision", "Autonomous Systems", "Cognitive Computing"],
      },
      {
        title: "Cyber Defense & Cryptographic Séances",
        iconName: "ShieldAlert",
        description: "Zero-trust network architectures, reverse engineering, ethical penetration, and blockchain resilience.",
        specialties: ["Quantum Cryptography", "Malware Forensics", "Hardware Security"],
      },
      {
        title: "Distributed Realms & Cloud Infrastructure",
        iconName: "CloudLightning",
        description: "High-throughput microservices, edge orchestration, and fault-tolerant cloud clusters.",
        specialties: ["Kubernetes Fabric", "Serverless Systems", "Low-Latency DBs"],
      },
    ],
  },

  symposium: {
    title: "CRYPTOSIS '26",
    edition: "The 18th Annual Grand Chronicle",
    dates: "October 30 – 31, 2026",
    venue: "Gothic Auditorium & Computing Crypts, Central Campus",
    themeTitle: "The Haunted Realm of Computation",
    themeDescription:
      "When the clock strikes midnight and the digital veil thins, the brightest minds gather to duel across lines of code, unravel cryptic algorithms, and resurrect legendary computing relics. A premier national symposium where ancient mystery meets futuristic technology.",
    vision:
      "To provide an extraordinary battleground for university scholars across the nation to test their intellect, display architectural artistry, and forge bonds of lifelong technical fellowship.",
    pillars: [
      {
        title: "Rigorous Intellect",
        desc: "Puzzles and contests designed by elite industry architects and competitive programmers.",
      },
      {
        title: "Unrivaled Atmosphere",
        desc: "A fully immersive thematic production blending Halloween folklore with modern technology.",
      },
      {
        title: "Industry Laurels",
        desc: "Direct recruitment tracks, venture scout interactions, and grand cash prizes.",
      },
    ],
    totalPrizePool: "₹2,50,000+",
  },

  events: [
    {
      id: "code-crypt",
      title: "Code in the Crypt",
      category: "Technical",
      tagline: "Speed algorithmic duel against the clock of doom.",
      time: "Day 1 | 10:00 AM - 1:00 PM",
      venue: "Turing Lab, Crypt Level 2",
      teamSize: "1 - 2 Alchemists",
      prizePool: "₹45,000",
      description:
        "Enter the subterranean coding labyrinth where time is your greatest adversary. Solve increasingly eerie algorithmic puzzles and dynamic programming curses under escalating time penalties.",
      rules: [
        "Allowed Languages: C++, Java, Python3, Rust, Go.",
        "Round 1: 5 rapid algorithmic traps (60 minutes).",
        "Round 2: The Final Gauntlet with hidden test vectors and memory limits.",
      ],
      coordinators: [
        { name: "Lucian Sterling", contact: "+91 98765 43210" },
        { name: "Elena Blackwood", contact: "+91 98765 43211" },
      ],
    },
    {
      id: "ai-necromancy",
      title: "AI Necromancy (Hackathon)",
      category: "Technical",
      tagline: "Resurrect dead codebases & forge sentient generative entities.",
      time: "Day 1 to Day 2 | 24-Hour Non-stop",
      venue: "Ada Lovelace Hall",
      teamSize: "3 - 4 Developers",
      prizePool: "₹75,000",
      description:
        "Teams are handed abandoned legacy codebases haunted by severe architectural decay. Your challenge is to resurrect them using modern LLM agents, refactor them into microservices, and deploy them live before sunset.",
      rules: [
        "All code must be committed to the official symposium GitHub sandbox.",
        "Generative AI APIs permitted but core reasoning must be demonstrated.",
        "Evaluation criteria: Innovation, Architecture, Live Demo, and Presentation.",
      ],
      coordinators: [
        { name: "Damian Thorne", contact: "+91 98765 43212" },
        { name: "Seraphina Moore", contact: "+91 98765 43213" },
      ],
    },
    {
      id: "bug-bounty",
      title: "Bug Bounty Séance",
      category: "Technical",
      tagline: "Exorcise vulnerabilities from a fortified cyber fortress.",
      time: "Day 2 | 11:00 AM - 2:00 PM",
      venue: "Cyber Defense Warfare Arena",
      teamSize: "Solo or Duo",
      prizePool: "₹35,000",
      description:
        "A live CTF (Capture The Flag) combat environment featuring reverse engineering, binary exploitation, web injection, and steganographic occult secrets hidden in memory dumps.",
      rules: [
        "Attacking the competition hosting infrastructure results in immediate disqualification.",
        "Flags must be entered into the live scoreboard in exact format.",
        "First-blood bonuses awarded for every solved relic challenge.",
      ],
      coordinators: [
        { name: "Vikram Knight", contact: "+91 98765 43214" },
      ],
    },
    {
      id: "escape-dark-lab",
      title: "Escape the Dark Lab",
      category: "Non-Technical",
      tagline: "Physical escape room powered by laser puzzles and logic keys.",
      time: "Both Days | Continuous Slots",
      venue: "The Old Basement Vault",
      teamSize: "3 - 5 Investigators",
      prizePool: "₹25,000",
      description:
        "Trapped in an antique professor's study during an automated system lockdown. Decrypt cipher manuscripts, align optical mirrors, and disable the emergency lockdown countdown.",
      rules: [
        "Time limit: Exactly 30 minutes per team.",
        "No electronic devices permitted inside the chamber.",
        "Physical destruction of props forfeits the run.",
      ],
      coordinators: [
        { name: "Rowena Ravenscroft", contact: "+91 98765 43215" },
      ],
    },
    {
      id: "witch-hunt-trivia",
      title: "Witch-Hunt Cryptic Hunt",
      category: "Non-Technical",
      tagline: "Campus-wide augmented reality riddle hunt across hidden landmarks.",
      time: "Day 1 | 2:30 PM - 5:30 PM",
      venue: "Entire Campus Grounds",
      teamSize: "2 - 3 Seekers",
      prizePool: "₹20,000",
      description:
        "Follow cryptic audio whispers, scan invisible QR sigils engraved across campus monuments, and solve historical mysteries before rival teams reach the central relic.",
      rules: [
        "Smartphone with camera and internet connection required.",
        "Teams must remain together at all clue checkpoints.",
      ],
      coordinators: [
        { name: "Julian Frost", contact: "+91 98765 43216" },
      ],
    },
    {
      id: "lan-o-lantern",
      title: "Lan-o'-Lantern Esports",
      category: "Gaming",
      tagline: "High-voltage collegiate showdown in Valorant and Rocket League.",
      time: "Day 2 | 10:00 AM - 6:00 PM",
      venue: "Esports Den & Stream Lounge",
      teamSize: "5 Players",
      prizePool: "₹50,000",
      description:
        "The ultimate gaming championship with tournament-grade displays, low-latency fibers, live shoutcasting, and pumpkin trophy honors.",
      rules: [
        "Standard competitive tournament rules apply.",
        "Bring your own peripherals (mice, keyboards, headsets).",
      ],
      coordinators: [
        { name: "Marcus Crowley", contact: "+91 98765 43217" },
      ],
    },
  ],

  archives: [
    {
      year: "2025",
      editionName: "CRYPTOSIS XVII: Blood Moon Protocol",
      theme: "Cyber-Gothic Renaissance",
      delegates: "3,420 Delegates",
      colleges: "52 Universities",
      cashPrize: "₹2,20,000",
      overallChampion: "National Institute of Technology, Trichy",
      summary:
        "An awe-inspiring edition marked by record-breaking 24-hour hackathon submissions, an electrifying drone swarm show over the gothic bell tower, and 14 technical keynote speakers.",
      photos: [
        { caption: "Opening ceremony beneath the candlelit gothic arches", url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80" },
        { caption: "24-Hour Hackathon midnight frenzy", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80" },
        { caption: "Championship trophy handover", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80" },
      ],
      highlights: [
        "Over 120 hackathon prototypes submitted on GitHub.",
        "Zero server downtime during 10,000+ simultaneous web hits.",
        "Featured in National Tech Chronicle as Top 5 Student Symposiums.",
      ],
    },
    {
      year: "2024",
      editionName: "CRYPTOSIS XVI: Spectral Algorithms",
      theme: "Occult AI & Machine Mysteries",
      delegates: "2,850 Delegates",
      colleges: "44 Universities",
      cashPrize: "₹1,80,000",
      overallChampion: "College of Engineering, Guindy",
      summary:
        "The symposium that introduced the legendary 'Escape the Dark Lab' experiential maze, drawing hours of queues and viral social media engagement.",
      photos: [
        { caption: "Keynote lecture in the historic amphitheater", url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80" },
        { caption: "Intense competitive programming arena", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80" },
      ],
      highlights: [
        "Keynote by Distinguished Scientist from DRDO.",
        "Introduction of the Pumpkin Trophy made of cast bronze.",
        "98% satisfaction rating from visiting collegiate delegations.",
      ],
    },
  ],

  achievements: [
    {
      id: "ach-1",
      year: "2025",
      title: "Smart India Hackathon: 1st Place National Trophy",
      category: "Hackathon",
      badge: "National Gold",
      description:
        "Team 'CrypticByte' secured First Prize (₹1,00,000) for designing an AI-assisted disaster response mesh network for the Ministry of Home Affairs.",
    },
    {
      id: "ach-2",
      year: "2025",
      title: "US Patent Granted: Quantum Resistant Encryption",
      category: "Patent",
      badge: "International Patent",
      description:
        "Department faculty and 3 final-year researchers were granted a full US patent for lightweight post-quantum lattice cryptography.",
    },
    {
      id: "ach-3",
      year: "2024",
      title: "IEEE Best Student Paper Award, Tokyo",
      category: "Research",
      badge: "Global Research",
      description:
        "Published breakthrough research on edge federated learning for autonomous underwater vehicles in IEEE Transactions on Mobile Computing.",
    },
    {
      id: "ach-4",
      year: "2024",
      title: "Google Summer of Code: 8 Department Scholars Selected",
      category: "Placement",
      badge: "Open Source Laurels",
      description:
        "Record selection of students contributing to Linux Foundation, Apache Software Foundation, and Chromium Project.",
    },
  ],

  nextChapter: {
    dates: "October 30 – 31, 2026",
    countdownTarget: "2026-10-30T09:00:00",
    registrationDeadline: "October 27, 2026 at 11:59 PM",
    registrationUrl: "https://cryptosis26.symposium.edu/register",
    venueAddress: "Department of CSE, Grand Campus, Heritage Road, Tech Valley",
    email: "symposium.cse@institution.edu",
    phone: "+91 98765 43200 / +91 98765 43201",
    faqs: [
      {
        question: "Who is eligible to participate in the symposium?",
        answer:
          "All bona fide undergraduate and postgraduate students from any recognized college or university (Engineering, Arts, Science, and Polytechnic) with a valid college ID card.",
      },
      {
        question: "Is accommodation provided for outstation participants?",
        answer:
          "Yes! Haunted-hall campus hostel accommodation and meal packages are available upon prior registration for delegates traveling from outside the district.",
      },
      {
        question: "Can I participate in multiple events?",
        answer:
          "Yes, event schedules have been meticulously curated to avoid overlaps between major technical events and gaming/non-technical showdowns.",
      },
      {
        question: "What are the registration fees?",
        answer:
          "A nominal single symposium entry pass of ₹250 per delegate grants full access to all technical events, paper presentations, keynote sessions, and symposium lunch.",
      },
    ],
  },
};
