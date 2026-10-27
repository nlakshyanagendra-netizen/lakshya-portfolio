// ============================================================
// SITE CONFIG — single source of truth for editable content
// Edit values here to update the portfolio. No other file needs
// to change for personal information, links, projects, or music.
// ============================================================

export type Category =
  | 'Electrical Engineering'
  | 'Experimental Physics'
  | 'Electrostatics'
  | 'Acoustics'
  | 'AI'
  | 'Computer Vision'
  | 'Software'
  | 'Robotics'
  | 'Automation'
  | 'Python';

export type SkillGroup = {
  id: 'electrical' | 'software' | 'robotics';
  title: string;
  icon: string; // lucide icon name
  skills: { name: string; relatedProjects: string[] }[];
};

export type Project = {
  id: string;
  number: string;
  title: string;
  short: string;
  categories: Category[];
  description: string;
  technical: string;
  visualKind: 'tesla' | 'electrostatic' | 'ultrasonic' | 'pipeline' | 'hand' | 'faces' | 'maze';
  media?: {
    photoUrl?: string;
    diagramUrl?: string;
    videoUrl?: string;
  };
  links?: {
    source?: string;
    docs?: string;
  };
  safetyNote?: string;
};

export type Achievement = {
  id: string;
  title: string;
  body: string;
  link?: { label: string; url: string };
  icon: string;
};

export const site = {
  name: 'Lakshya Nagendra Nakka',
  shortName: 'Lakshya',
  tagline: 'Electrical Engineering · Experimental Physics · Robotics · AI',
  institution: 'NIT Tiruchirappalli',
  role: 'Electrical Engineering Student',
  heroHeadline: 'I like turning physical phenomena into things that actually work.',
  heroSub:
    'From high-voltage experiments and particle levitation to computer-vision tools and autonomous robots, I enjoy exploring the intersection of electricity, physics, software, and intelligent systems.',
  heroLabel: 'EXPLORING THE BOUNDARY BETWEEN PHYSICS AND SOFTWARE',

  socials: {
    github: 'https://github.com/nlakshyanagendra-netizen',
    linkedin: 'https://www.linkedin.com/in/lakshya-nagendra-nakka/',
  },

  // Replace with your real address. Leaving this empty keeps a placeholder.
  email: 'nlakshyanagendra@gmail.com',

  // Contact form submission endpoint (optional).
  // Leave empty to use the documented email fallback.
  // Example: 'https://formspree.io/f/your-id' or a Supabase Edge Function URL.
  contactEndpoint: '',

  // Owner-configured, fixed music reference (YouTube video ID).
  // Visitors are not offered a track-selection interface.
  // YouTube's own player controls may allow interaction beyond this track.
  youtubeId: 'MQcSxra6XvE',
  youtubeTitle: 'Ambient reference track',

  about: {
    heading: 'Curiosity, made tangible.',
    body: [
      "I'm an electrical engineering student at NIT Tiruchirappalli. What pulls me in is the moment a physical phenomenon stops being abstract — when you understand it well enough to make something with it.",
      "I like reading the physics behind a phenomenon first, then building something that demonstrates or applies it. Sometimes that means winding a Tesla coil; sometimes it means training a hand-gesture detector in OpenCV or tuning a robot's path through a maze.",
      'The projects on this site are experiments I have actually run or am actively working on. They span high voltage, electrostatics, acoustics, computer vision, and control systems — and they are all driven by the same question: does this actually work?',
    ],
  },

  sections: [
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'lab', label: 'Lab' },
    { id: 'contact', label: 'Contact' },
  ] as const,
};

export const skillGroups: SkillGroup[] = [
  {
    id: 'electrical',
    title: 'Electrical Engineering & Physics',
    icon: 'Zap',
    skills: [
      { name: 'High-voltage experiments', relatedProjects: ['tesla-coils'] },
      { name: 'Tesla coils & electrical discharges', relatedProjects: ['tesla-coils'] },
      { name: 'Electrostatics', relatedProjects: ['electrostatic-levitation'] },
      { name: 'Electric fields & particle levitation', relatedProjects: ['electrostatic-levitation', 'ultrasonic-levitation'] },
      { name: 'Ultrasonic / acoustic levitation', relatedProjects: ['ultrasonic-levitation'] },
    ],
  },
  {
    id: 'software',
    title: 'Software & Computer Vision',
    icon: 'Code2',
    skills: [
      { name: 'Python', relatedProjects: ['jee-result', 'hand-gesture', 'attention-browser'] },
      { name: 'OpenCV', relatedProjects: ['hand-gesture', 'attention-browser'] },
      { name: 'AI-assisted application development', relatedProjects: ['jee-result'] },
      { name: 'Automation & web data retrieval', relatedProjects: ['jee-result'] },
      { name: 'Hand-gesture recognition', relatedProjects: ['hand-gesture'] },
      { name: 'Face detection & browser automation', relatedProjects: ['attention-browser'] },
    ],
  },
  {
    id: 'robotics',
    title: 'Robotics & Control',
    icon: 'Cpu',
    skills: [
      { name: 'Maze pathfinding', relatedProjects: ['e-yantra'] },
      { name: 'Self-centering', relatedProjects: ['e-yantra'] },
      { name: 'Path planning', relatedProjects: ['e-yantra'] },
      { name: 'Physical path tuning', relatedProjects: ['e-yantra'] },
      { name: 'Motion optimization', relatedProjects: ['e-yantra'] },
    ],
  },
];

export const projects: Project[] = [
  {
    id: 'tesla-coils',
    number: '01',
    title: 'Tesla Coils & High-Voltage Experiments',
    short: 'High-voltage setups to explore electrical discharges, fields, and energy in physical systems.',
    categories: ['Electrical Engineering', 'Experimental Physics'],
    description:
      "I have built high-voltage experimental setups, including Tesla coils, to explore electrical discharges, electric fields, and electrical energy in physical systems.",
    technical:
      'The work focuses on building and tuning resonant transformer circuits, observing corona and streamer discharges, and reasoning about field geometry around the secondary. I treat the coil as a way to make electromagnetic principles visible rather than as a finished product.',
    visualKind: 'tesla',
    safetyNote:
      'High-voltage experiments carry real electrical and fire risk. Proper isolation, discharge shorting, and one-hand working practices are essential. This section describes educational experiments only.',
    links: {},
  },
  {
    id: 'electrostatic-levitation',
    number: '02',
    title: 'Electrostatic Particle Levitation',
    short: 'Using static electricity to levitate small particles — electric force vs. gravity.',
    categories: ['Electrostatics', 'Experimental Physics'],
    description:
      "I have experimented with using static electricity to levitate small particles, exploring how electric forces can counteract gravitational effects.",
    technical:
      'Charged electrodes create a non-uniform field; light particles in the field experience a force that can balance weight. I explored how charge polarity, electrode geometry, and humidity affect stability and trapping time.',
    visualKind: 'electrostatic',
    links: {},
  },
  {
    id: 'ultrasonic-levitation',
    number: '03',
    title: 'Ultrasonic Particle Levitation',
    short: 'Acoustic fields manipulating small objects — a distinct physical mechanism from electrostatics.',
    categories: ['Acoustics', 'Experimental Physics'],
    description:
      "I have also experimented with particle levitation using ultrasonic sensors or transducers, exploring how acoustic fields can manipulate small objects.",
    technical:
      'Two opposing ultrasonic transducers form a standing wave; particles settle at pressure nodes where the acoustic radiation force traps them against gravity. The mechanism is acoustic, not electrostatic — distinct physics, similar visible result.',
    visualKind: 'ultrasonic',
    links: {},
  },
  {
    id: 'jee-result',
    number: '04',
    title: 'JEE Result Notification Application',
    short: 'A Python app that watches the JEE results page and notifies me when results appear.',
    categories: ['Python', 'Automation', 'Software'],
    description:
      "I built an application using AI-assisted development to retrieve information from the JEE website and notify me when examination results are released.",
    technical:
      'The app periodically fetches a page, hashes its meaningful content, and compares against the previous hash. On a change it fires a desktop notification. No official API was used and the tool only reads publicly visible page state. It does not log in or access protected systems.',
    visualKind: 'pipeline',
    links: {},
  },
  {
    id: 'hand-gesture',
    number: '05',
    title: 'Hand-Gesture Desktop Controller',
    short: 'Python + OpenCV hand-gesture recognition to control desktop applications.',
    categories: ['Python', 'Computer Vision'],
    description:
      "I developed a Python application using OpenCV and hand-gesture recognition to control desktop applications. For example, showing two fingers can trigger the application in the second taskbar position.",
    technical:
      'Hand landmarks are detected per frame; a small gesture classifier maps finger counts and poses to desktop actions via OS input simulation. Latency is dominated by the camera feed, not the classifier. The app runs locally and does not upload video.',
    visualKind: 'hand',
    links: {},
  },
  {
    id: 'attention-browser',
    number: '06',
    title: 'Attention-Aware Browser Automation',
    short: 'Detects two faces via camera and switches or closes browser tabs by preference.',
    categories: ['Computer Vision', 'Automation'],
    description:
      "I built a camera-based application that detects when two faces are visible and automatically switches browser tabs or closes a tab according to configurable preferences.",
    technical:
      'A face detector runs over the local camera feed; a configurable rule maps the two-face condition to an action (switch tab / close tab / alert). It is a heuristic, not perfect attention detection — false negatives and edge cases are expected. Nothing leaves the machine.',
    visualKind: 'faces',
    links: {},
  },
  {
    id: 'e-yantra',
    number: '07',
    title: 'e-Yantra Robotics Competition',
    short: 'Maze pathfinding, self-centering, and physical path tuning for a competition robot.',
    categories: ['Robotics', 'Software'],
    description:
      "I am currently participating in e-Yantra Robotics Competition, where I have worked on maze pathfinding, self-centering behavior, and physical path tuning to improve robot performance.",
    technical:
      'Work covers discrete path planning over a known maze, continuous self-centering against walls using sensor feedback, and tuning forward/turn kinematics so the planned path survives contact with the real floor. The biggest gap is always between the planned trajectory and what the robot physically does.',
    visualKind: 'maze',
    links: {},
  },
];

export const achievements: Achievement[] = [
  {
    id: 'mekathlon',
    title: 'Mekathlon — International Competition',
    body: 'Won an international competition in Grade 11 involving the capture or recovery of waste-heat energy.',
    link: { label: 'mekathlon.com', url: 'https://www.mekathlon.com/' },
    icon: 'Trophy',
  },
  {
    id: 'science-secretary',
    title: 'Science Secretary',
    body: 'Served as Science Secretary at school during Grade 12, contributing to science-related activities and initiatives.',
    icon: 'FlaskConical',
  },
  {
    id: 'interact',
    title: 'Interact Club Director',
    body: "Served as a director in my school's Interact Club and participated in philanthropic and community-service initiatives.",
    icon: 'HeartHandshake',
  },
  {
    id: 'community',
    title: 'Community Initiatives',
    body: 'Participated in awareness-raising camps, marathons, blood donation camps, and other philanthropic activities.',
    icon: 'Users',
  },
];

// Short messages for the edge-dwelling pet.
export const petMessages: string[] = [
  'Interesting project!',
  'Still exploring?',
  'Back to the lab?',
  'Nice — keep scrolling.',
  'Did you try the field explorer?',
  'Ctrl-K opens shortcuts.',
  'Zap! Did you see that arc?',
  'The field is energetic today.',
  'Boop! That tickles.',
  'Careful — high voltage!',
  'I like your energy.',
  'Psst — there\'s a timeline below.',
  'Mind the embers!',
  'Click me again, I dare you.',
  'Currents are flowing nicely.',
  'You\'re sparking interest.',
  'I\'m conducting an experiment.',
  'Ground yourself first!',
  'Resistors? Never heard of them.',
  'That heading looks electrified.',
  'Watt\'s up?',
  'Ohm my, that was bright!',
  'I\'m fully charged now.',
  'Catch a falling ember!',
  'The cursor crackles today.',
  'Static cling is my thing.',
  'Feel that potential difference?',
  'You\'re a real live wire.',
  'Tesla would be proud.',
  'Shocking, isn\'t it?',
  'Capacitor humor — it\'s a charge.',
  'I\'m glowing because of you.',
  'Arc you paying attention?',
];
