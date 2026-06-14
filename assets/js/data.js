/* =============================================================================
   PORTFOLIO CONTENT  —  edit THIS file to update your site
   =============================================================================

   You do NOT need to touch any HTML/CSS/JS to add experiences or images.
   Everything on the page is generated from the data below.

   ---------------------------------------------------------------------------
   HOW TO ADD A NEW TIMELINE ENTRY
   ---------------------------------------------------------------------------
   Copy one of the { ... } blocks inside the `timeline` array, paste it, and
   edit the fields. Only `title`, `start`, and `categories` are required.

   Field reference:
     title        (string)  Main line, e.g. "R&D Intern — Robotics".
     org          (string)  Company / school / organisation.
     location     (string)  "City, Country".
     start        (string)  "YYYY-MM"  (month is optional: "2025" also works).
     end          (string)  "YYYY-MM" or "present" (omit for a one-off event).
     kind         (string)  Picks the icon. One of:
                            "experience" | "education" | "project" |
                            "leadership" | "honor" | "certification"
     categories   (array)   Which filters this entry belongs to. Use any of the
                            ids listed in the `categories` array further down,
                            e.g. ["research","technical"]. An entry shows up
                            whenever AT LEAST ONE of its categories is enabled.
     summary      (string)  One sentence shown under the title.
     highlights   (array)   Bullet points (optional).
     tags         (array)   Small skill/keyword chips (optional).
     links        (array)   [{ label:"GitHub", url:"https://..." }] (optional).
     image        (string)  "assets/images/yourphoto.jpg" (optional). Drop the
                            file in assets/images/ — if it's missing the card
                            simply shows no image, nothing breaks.
     featured     (boolean) true marks it with a star (optional).

   ---------------------------------------------------------------------------
   HOW TO ADD AN IMAGE TO AN ENTRY
   ---------------------------------------------------------------------------
   1. Put the image file in  assets/images/   (e.g. wro2025.jpg)
   2. Add  image: "assets/images/wro2025.jpg"  to that entry.
   That's it.
   ============================================================================= */

window.PORTFOLIO = {

  /* ------------------------------------------------------------------ */
  /*  PROFILE  —  the hero / header section                              */
  /* ------------------------------------------------------------------ */
  profile: {
    name: "Elias Charbel Salameh",
    initials: "ecs",                       // shown if no photo is provided
    photo: "assets/images/profile.jpg",   // optional — drop a file here to show it
    role: "Robotics, Automation & AI Engineer",
    tagline: "Combining Learning and Model-Based Methods for autonomous systems.",
    summary:
      "M2 student in Automation & Robotics of Intelligent Systems at UTC Compiègne, " +
      "in a double-degree program with USEK (Lebanon). Hands-on across control systems, " +
      "computer vision, SLAM and deep learning — currently an R&D intern at OpenLab " +
      "Stellantis–IMS–SANPSY improving Adaptive Cruise Control with mixed AI/control " +
      "methods. Seeking a CIFRE industrial PhD at the intersection of control and " +
      "learning-based methods for autonomous systems.",
    location: "Bordeaux, France",
    // Contacts — edit freely. Set any to "" to hide it.
    email: "eliascharbel.salameh@gmail.com",
    phone: "+33 7 83 75 76 69",
    github: "https://github.com/eliascharbelsalameh",
    linkedin: "https://www.linkedin.com/in/eliascharbelsalameh",
    // Punchy numbers shown in the hero band. Add / remove freely.
    stats: [
      { value: "5.0/5.0", label: "UTC M2 GPA — highest honors" },
      { value: "98.4%",   label: "mAP — BMW vision model" },
      { value: "42",      label: "judges led — WRO 2025" },
      { value: "3×",      label: "IEEE Regional Exemplary Awards" },
      { value: "$1.5K",   label: "startup grant — Byssus" },
      { value: "990/990", label: "TOEIC English (C1)" }
    ]
  },

  /* ------------------------------------------------------------------ */
  /*  CATEGORIES  —  the filter buttons (id, label, colour)              */
  /*  Add a new category here, then use its `id` in any entry.           */
  /* ------------------------------------------------------------------ */
  categories: [
    { id: "research",            label: "Research",        color: "#7c3aed" },
    { id: "technical",           label: "Technical",       color: "#2563eb" },
    { id: "academic",            label: "Academic",        color: "#0891b2" },
    { id: "project-management",  label: "Project Mgmt",    color: "#c026d3" },
    { id: "leadership",          label: "Leadership",      color: "#d97706" },
    { id: "volunteering",        label: "Volunteering",    color: "#16a34a" },
    { id: "community",           label: "Community",       color: "#ea580c" },
    { id: "award",               label: "Awards & Honors", color: "#ca8a04" },
    { id: "personal",            label: "Personal",        color: "#e11d48" }
  ],

  /* ------------------------------------------------------------------ */
  /*  TIMELINE  —  your efforts (any order; the site sorts by date)      */
  /* ------------------------------------------------------------------ */
  timeline: [

    /* ---- Current / 2026 ------------------------------------------- */
    {
      title: "IEEE Young Professionals R8 LEAD 2.0 Program",
      org: "IEEE Region 8",
      location: "Bordeaux, France",
      start: "2026-05", end: "present",
      kind: "leadership",
      categories: ["leadership", "volunteering", "community"],
      featured: false,
      summary:
        "Leadership development and networking program for IEEE Young Professionals in Region 8.",
      highlights: [
        "IEEE R8 YP Member Activities.", 
        "IEEE MGA YP Opportunities.",
        "IEEE vTools","IEEE Collabratec.",
        "IEEE Volunteer Ethics.",
        "Leadership sessions."        
      ],
      tags: ["Leadership", "Community", "Partnerships", "Events"]
    }
    ,{
      title: "R&D Intern — Robotics & Intelligent Systems",
      org: "OpenLab Stellantis–IMS–SANPSY",
      location: "Bordeaux, France",
      start: "2026-02", end: "present",
      kind: "experience",
      categories: ["research", "technical"],
      featured: true,
      summary:
        "Improving Adaptive Cruise Control (ACC) under uncertainty for connected " +
        "automated vehicles, blending robust control with learning.",
      highlights: [
        "Researching a mixed control approach for ACC under uncertainty within ADAS for connected automated vehicles (CAV).",
        "Implementing and benchmarking robust MPC, soft-constrained MPC and reinforcement learning across varied speed profiles (MATLAB/Simulink, Python, SCANeR studio, C).",
        "Developing a mixed Safe-RL ACC with Control Barrier Functions (SFRL-ACC + CBF).",
        "Validating each approach in simulation on common speed profiles."
      ],
      tags: ["MPC", "Reinforcement Learning", "Control Barrier Functions", "ADAS", "SCANeR studio", "MATLAB/Simulink"]
    },
    {
      title: "Cooperative Control of 6 Robots in Rendezvous",
      org: "UTC — Control of Autonomous Cooperative Robots",
      location: "Compiègne, France",
      start: "2025-11", end: "2026-01",
      kind: "project",
      categories: ["research", "technical", "academic"],
      summary: "Designed a distributed control scheme driving six robots to a common rendezvous.",
      highlights: [
        "Multi-agent control design for consensus / rendezvous of six mobile robots.",
        "Studied stability and convergence of cooperative control laws."
      ],
      tags: ["Multi-agent control", "Consensus", "Cooperative robotics"]
    },
    {
      title: "RISE for Collaboration — Research Program",
      org: "RISE",
      location: "Remote",
      start: "2026-04",
      end: "2026-05",
      kind: "certification",
      categories: ["research"],
      summary: "Completed for the RISE for Collaboration research program."
    },

    /* ---- 2025 ------------------------------------------------------ */
    {
      title: "M.Sc. — Complex Systems Eng.: Automation & Robotics of Intelligent Systems",
      org: "Université de Technologie de Compiègne (UTC)",
      location: "Compiègne, France",
      start: "2025-09", end: "present",
      kind: "education",
      categories: ["academic", "research"],
      featured: true,
      summary: "Double-degree M2 with USEK — GPA 5.0/5.0, highest honors. Research-project lead.",
      highlights: [
        "Leading a research project on Hyperdimensional Computing applied to neuromorphic vision.",
        "Coursework: advanced control of dynamic systems, control of cooperative autonomous robots, estimation for robotic navigation, robotic vision, systems-of-systems, modeling & propagation of uncertainty, optimization, biomimicry."
      ],
      tags: ["Robotics", "Control", "Estimation", "Optimization", "Robotic Vision"]
    },
    {
      title: "Hyperdimensional Computing for Neuromorphic Vision",
      org: "UTC — Research Project (lead)",
      location: "Compiègne, France",
      start: "2025-09", end: "2026-01",
      kind: "research",
      categories: ["research", "academic"],
      featured: true,
      summary: "Leading research into hyperdimensional computing applied to event-based / neuromorphic vision.",
      highlights: [
        "Investigating HDC representations for spatio-temporal, event-based vision.",
        "Project lead — scoping, literature, and experimental direction."
      ],
      tags: ["Hyperdimensional Computing", "Neuromorphic Vision", "Event-based Vision"]
    },
    {
      title: "FORSA — French Government Excellence Scholarship",
      org: "French Government",
      location: "France",
      start: "2025-08", end: "2026-08",
      kind: "honor",
      categories: ["award", "academic"],
      featured: true,
      summary: "Awarded the competitive FORSA excellence scholarship for graduate study in France."
    },
    {
      title: "Head of Judges — World Robot Olympiad (WRO) Lebanon 2025",
      org: "World Robot Olympiad — Lebanon",
      location: "Lebanon",
      start: "2025-07",
      kind: "leadership",
      categories: ["leadership", "volunteering", "community"],
      featured: true,
      summary: "Led and coordinated 42 judges across all categories of the national robotics olympiad.",
      highlights: [
        "Managed 42 judges across every competition category.",
        "Capped three consecutive years judging the WRO national competition."
      ],
      tags: ["Judging", "Event leadership", "Robotics"]
    },
    {
      title: "Final Year Project — SLAM on Unitree AlienGo",
      org: "USEK — Robotics Department",
      location: "Jounieh, Lebanon",
      start: "2025-02", end: "2025-05",
      kind: "project",
      categories: ["research", "technical", "academic"],
      featured: true,
      summary: "Studied and implemented a SLAM pipeline for autonomous navigation of a quadruped robot.",
      highlights: [
        "Study and preliminary implementation of a SLAM algorithm (ROS1) on the Unitree AlienGo quadruped.",
        "Fused 3D LiDAR, IMU and an Intel RealSense D435i depth camera to improve navigation robustness and performance."
      ],
      tags: ["SLAM", "ROS1", "3D LiDAR", "RealSense D435i", "Quadruped"]
    },
    {
      title: "Machine Learning & Computer Vision — Intern",
      org: "inmind.ai academy",
      location: "Mkalles, Lebanon",
      start: "2025-02", end: "2025-03",
      kind: "experience",
      categories: ["technical", "research"],
      featured: true,
      summary: "Built an end-to-end computer-vision pipeline for BMW factory inference (98.4% mAP).",
      highlights: [
        "Designed an end-to-end CV pipeline for BMW assembly-line item detection with YOLOv5 (mAP[0.5–0.95] = 98.4%).",
        "Across the track, worked the modern AI stack — Transformers/BERT, RAG, CNNs, point clouds and Vision Transformers.",
        "Stack: PyTorch, Python, Docker / Docker-Compose, Git, NVIDIA Omniverse; synthetic data, CI/CD, FastAPI, containerization."
      ],
      tags: ["YOLOv5", "Computer Vision", "PyTorch", "Transformers / BERT", "RAG", "Vision Transformers", "Docker", "Synthetic Data", "FastAPI"],
      links: [{ label: "GitHub", url: "https://github.com/eliascharbelsalameh/ComputerVision_Project_inmind" }]
    },
    {
      title: "ROS2 Workshop — IC2AI'25",
      org: "IEEE Lebanon — Joint Chapter RA/IM/CS",
      location: "Lebanon",
      start: "2025-02",
      kind: "certification",
      categories: ["technical"],
      summary: "Hands-on ROS2 training at the IC2AI'25 workshop."
    },
    {
      title: "AI for Research and Insights - Gemini",
      org: "Coursera",
      location: "Online",
      start: "2025",            // approximate date — set the real month in data.js if you have it
      kind: "certification",
      categories: ["research", "technical"],
      summary: "Applying AI to research workflows and insight generation."
    },
    {
      title: "AI Fundamentals - Gemini",
      org: "Coursera",
      location: "Online",
      start: "2025",            // approximate date — set the real month in data.js if you have it
      kind: "certification",
      categories: ["technical"],
      summary: "Foundations of artificial intelligence and core ML concepts."
    },

    /* ---- 2024 ------------------------------------------------------ */
    {
      title: "Co-founder — Byssus (textile-waste recycling)",
      org: "Byssus",
      location: "Jounieh, Lebanon",
      start: "2024-06", end: "present",
      kind: "experience",
      categories: ["project-management", "leadership", "technical"],
      featured: true,
      summary: "Co-founded a textile-waste recycling startup; won a $1,500 prototyping grant.",
      highlights: [
        "Co-created a startup tackling textile-waste recycling; winners of a $1,500 grant at ACIE USEK IdeaLab #3.",
        "Contributed to the design of automated systems and prototyping of innovative solutions."
      ],
      tags: ["Entrepreneurship", "Automation", "Prototyping", "Sustainability"]
    },
    {
      title: "Huawei ICT Innovation Competition — 3rd place, MECA region",
      org: "Huawei",
      location: "MECA Region",
      start: "2024-09", end: "2024-12",
      kind: "honor",
      categories: ["award", "technical", "research"],
      featured: true,
      summary: "Placed 3rd in the MECA region of the Huawei ICT Innovation Competition.",
      tags: ["Innovation", "Competition"]
    },
    {
      title: "Seeds for the Future — MECA Program",
      org: "Huawei",
      location: "Uzbekistan / MECA",
      start: "2024-08",
      kind: "certification",
      categories: ["community", "technical", "leadership"],
      summary: "Selected for Huawei's flagship MECA talent program; Tech4Good pitch team.",
      tags: ["ICT", "Tech4Good", "Leadership"]
    },
    {
      title: "AI Bootcamp",
      org: "ZAKA AI",
      location: "Lebanon",
      start: "2024-06",end: "2024-07",
      kind: "certification",
      categories: ["technical"],
      summary: "Intensive bootcamp in AI, machine learning and deep learning.",
      tags: ["AI", "Machine Learning", "Deep Learning"]
    },
    {
      title: "Telecommunications Intern — RAN Capacity",
      org: "Alfa Telecommunications",
      location: "Dekwaneh, Lebanon",
      start: "2024-07", end: "2024-08",
      kind: "experience",
      categories: ["technical"],
      summary: "Optimised and managed Radio Access Network (RAN) capacity for a national telecom operator.",
      highlights: [
        "Analysed network-performance data and helped plan and deploy network resources.",
        "Identified efficiency improvements using advanced analytical tools and strategic capacity planning."
      ],
      tags: ["RAN", "Telecom", "Network Optimization", "Data Analysis"]
    },
    {
      title: "Self-Balancing Robot",
      org: "Personal Project",
      location: "Lebanon",
      start: "2024-03",
      kind: "project",
      categories: ["technical"],
      summary: "Built a two-wheeled self-balancing robot as a base for humanoid / rover work.",
      highlights: [
        "Designed and built a two-wheel self-balancing robot — a foundation for more advanced platforms (humanoid, rover)."
      ],
      tags: ["Control", "Embedded", "Robotics"],
      links: [{ label: "GitHub", url: "https://github.com/eliascharbelsalameh/self-balancing-robot" }]
    },
    {
      title: "Martial-Arts Assistant on Pepper (HRI)",
      org: "USEK — GIN456",
      location: "Jounieh, Lebanon",
      start: "2024-09", end: "2025-01",
      kind: "project",
      categories: ["technical", "research", "academic"],
      summary: "Built a martial-arts assistant on the Pepper social robot, focused on human-robot interaction.",
      highlights: [
        "Developed a martial-arts assistant on the Pepper social robot.",
        "Applied human-robot interaction (HRI) principles."
      ],
      tags: ["HRI", "Social Robotics", "Pepper"],
      links: [{ label: "GitHub", url: "https://github.com/eliascharbelsalameh/GIN456-Martial_Arts" }]
    },
    {
      title: "Retrieval-Augmented Generation Chatbot (Web App)",
      org: "Personal Project",
      location: "Lebanon",
      start: "2024-08",
      kind: "project",
      categories: ["technical"],
      summary: "Led development of a RAG chatbot web app built with Streamlit.",
      tags: ["RAG", "LLM", "NLP", "Streamlit"],
      links: [{ label: "GitHub", url: "https://github.com/eliascharbelsalameh/Chatbot_RAG_Webapp" }]
    },
    {
      title: "Emotion Analysis — NLP Classifier",
      org: "Personal Project",
      location: "Lebanon",
      start: "2024-07",
      kind: "project",
      categories: ["technical"],
      summary: "Built an NLP classifier for categorical emotion prediction.",
      tags: ["NLP", "Classification", "Deep Learning"],
      links: [{ label: "GitHub", url: "https://github.com/eliascharbelsalameh/emotion_analysis" }]
    },
    {
      title: "AI Model Portfolio — Vision & Regression",
      org: "Personal Projects (ZAKA AI track)",
      location: "Lebanon",
      start: "2024-07",
      kind: "project",
      categories: ["technical"],
      summary: "A set of from-scratch ML models: image classification, regression and medical diagnosis.",
      highlights: [
        "Fashion-MNIST — MLP/CNN/ANN implemented from scratch (99.61%).",
        "Animals-10 — multi-class image classifier (92%).",
        "Cats vs Dogs — binary image classifier (95%).",
        "Breast-cancer diagnosis — classifier up to 99% accuracy.",
        "Function approximation — regression with MSE 0.0006."
      ],
      tags: ["CNN", "Classification", "Regression", "Keras"],
      links: [
        { label: "Fashion-MNIST", url: "https://github.com/eliascharbelsalameh/Fashion_MNIST-AI" },
        { label: "Animals-10", url: "https://github.com/eliascharbelsalameh/animals-10_AI" },
        { label: "Cats vs Dogs", url: "https://github.com/eliascharbelsalameh/cats_and_dogs-AI" },
        { label: "Breast Cancer", url: "https://github.com/eliascharbelsalameh/WISC_BCancer_diagnonsis_AI" },
        { label: "Function Approx.", url: "https://github.com/eliascharbelsalameh/Function_Approximation-AI" }
      ]
    },{
      title: "Chair — IEEE USEK Student Branch",
      org: "IEEE",
      location: "Jounieh, Lebanon",
      start: "2024-12", end: "2025-07",
      kind: "leadership",
      categories: ["leadership", "volunteering", "community"],
      featured: true,
      summary: "Led the branch to an IEEE Regional Exemplary Student Branch Awards (2025).",
      highlights: [
        "Led a multidisciplinary team; built industry–academia links with IEEE Lebanon, Zaka AI, Semicolon, LebThree and EXEO.",
        "Branch won the IEEE Regional Exemplary Student Branch Award three years running (2023, 2024, 2025).",
        "Technical Ambassador at Zaka AI, delivering AI sessions."
      ],
      tags: ["Leadership", "Community", "Partnerships", "Events"]
    },

    /* ---- 2023 ------------------------------------------------------ */
    {
      title: "Teaching & Research Assistant",
      org: "USEK — Electrical & Electronics Eng.",
      location: "Jounieh, Lebanon",
      start: "2023-09", end: "2025-06",
      kind: "experience",
      categories: ["academic", "technical", "leadership"],
      summary: "Supported labs and built automated grading workflows for 40+ students each semester.",
      highlights: [
        "Ran lab sessions and departmental academic support for 40+ students per semester.",
        "Introduced automated methods for evaluating and grading submissions (incl. power-systems courses).",
        "Entrusted with class management and development; fostered new collaboration opportunities with faculty leaders."
      ],
      tags: ["Teaching", "Automation", "Mentoring"]
    },
    {
      title: "Installing Solar PV Systems for Residential Use",
      org: "Apave",
      location: "Lebanon",
      start: "2023-06",
      kind: "certification",
      categories: ["technical"],
      summary: "Certified in the design and installation of residential solar photovoltaic systems.",
      tags: ["Solar PV", "Power Systems"]
    },
    {
      title: "Electrical Engineering Intern",
      org: "EMCO Group",
      location: "Hazmieh, Lebanon",
      start: "2023-08",
      kind: "experience",
      categories: ["technical"],
      summary: "Helped design the electrical system for a water-treatment plant (Cabinda Angola Refinery).",
      highlights: [
        "EPB design — wiring diagrams and layouts from P&ID; cable-tray routing and schedules.",
        "Prepared work orders, instrumentation and PLC I/O lists; exposure to power electrical, automation (PLC) and panel-board design."
      ],
      tags: ["Electrical Design", "PLC", "Automation", "P&ID"]
    },
    {
      title: "Level Up Leadership Program 2023",
      org: "Level Up",
      location: "Lebanon",
      start: "2023-10", end: "2023-12",
      kind: "certification",
      categories: ["leadership", "community"],
      summary: "Completed a structured leadership-development program."
    },
    {
      title: "Vice Chair — IEEE USEK Student Branch",
      org: "IEEE",
      location: "Jounieh, Lebanon",
      start: "2023-12", end: "2024-12",
      kind: "leadership",
      categories: ["leadership", "volunteering", "community"],
      featured: false,
      summary: "Participated in the organization of the IEEE Student Branch.",
      highlights: [
        "Co-Led a multidisciplinary team; built industry–academia links with IEEE Lebanon, Zaka AI, Semicolon, LebThree and EXEO.",
        "Branch the IEEE Regional Exemplary Student Branch Award of 2024.",
        "Ambassador for IEEE Day 2024 and IEEEXtreme 17.0 — coordinated 50 students and a $745 budget across a two-day event.",
        "Technical Ambassador at Zaka AI, delivering AI sessions."
      ],
      tags: ["Leadership", "Community", "Partnerships", "Events"]
    },

    /* ---- 2022 ------------------------------------------------------ */
    {
      title: "Treasurer — IEEE USEK Student Branch",
      org: "IEEE",
      location: "Jounieh, Lebanon",
      start: "2022-12", end: "2023-12",
      kind: "leadership",
      categories: ["leadership", "volunteering", "community"],
      featured: false,
      summary: "Helped the branch to the IEEE Regional Exemplary Student Branch Awards of 2023.",
      highlights: [
        "Branch won the IEEE Regional Exemplary Student Branch Award of 2023.",
        "Kept the books for the IEEE USEK SB.",
        "Developed a new method to register members to the IEEE Membership, making their experience smoother and more efficient.",
        "Increased the membership of the branch by 74% in one year.",
        "IEEE SYPLC'23 Treasury Team Member."
      ],
      tags: ["Leadership", "Community", "Partnerships", "Events","Reporting","Treasury Management"]
    },

    /* ---- 2021 ------------------------------------------------------ */
    {
      title: "B.E. — Electrical & Electronics Engineering",
      org: "Holy Spirit University of Kaslik (USEK)",
      location: "Jounieh, Lebanon",
      start: "2021-09", end: "2026-06",
      kind: "education",
      categories: ["academic"],
      summary: "Bachelor of Engineering, double-degree with UTC — GPA 93.34/100, High Distinction.",
      highlights: [
        "GPA 93.34/100 — High Distinction (≈ 18.7/20).",
        "Coursework in control, automation, AI, plus project management, agile methodology and innovation & entrepreneurship.",
        "USEK Merit Scholarship across the full program (2021–2026)."
      ],
      tags: ["Electrical Eng.", "Control", "Automation"]
    },

    /* ---- 2006 ------------------------------------------------------ */
    {
      title: "French & Lebanese Double Baccalaureate — General Sciences",
      org: "Collège Saint Joseph Antoura (CSJA) — AEFE",
      location: "Antoura, Lebanon",
      start: "2006-09", end: "2021-06",
      kind: "education",
      categories: ["academic"],
      summary: "AEFE double baccalaureate in general sciences — 16.23/20, highest honors."
    },

    /* ---- Personal / Athletics (dates below are PLACEHOLDERS — set the real ones) ---- */
    {
      title: "Back Squat — 166 kg (1-rep-max PR)",
      org: "Strength training",
      start: "2023-11",            // PLACEHOLDER — set the real date
      kind: "fitness",
      categories: ["personal"],
      summary: "Hit a 166 kg back-squat — a one-rep-max personal record.",
      tags: ["Strength", "Powerlifting", "166 kg"]
    },
    {
      title: "Back Squat — 140 kg x 5",
      org: "Strength training",
      start: "2024-02",            // PLACEHOLDER — set the real date
      kind: "fitness",
      categories: ["personal"],
      summary: "Hit a 140 kg back-squat — a five-rep-max personal record.",
      tags: ["Strength", "Powerlifting", "140 kg"]
    },
    {
      title: "Deadlift — 180 kg (1-rep-max PR)",
      org: "Strength training",
      start: "2025-06",            // PLACEHOLDER — set the real date
      kind: "fitness",
      categories: ["personal"],
      summary: "Hit a 180 kg deadlift — a one-rep-max personal record.",
      tags: ["Strength", "Powerlifting", "180 kg"]
    },
    {
      title: "Bench Press — 120 kg × 2",
      org: "Strength training",
      start: "2023-09",            // PLACEHOLDER — set the real date
      kind: "fitness",
      categories: ["personal"],
      summary: "Benched 120 kg for 2 reps.",
      tags: ["Strength", "Bench Press", "120 kg"]
    },
    {
      title: "Completed an 8K run",
      org: "Running",
      start: "2021-11",            // PLACEHOLDER — set the real date
      kind: "fitness",
      categories: ["personal"],
      summary: "Finished an 8K road run — endurance goal completed.",
      tags: ["Running", "Endurance", "8K"]
    },
    {
      title: "Reading — \"Rich Dad Poor Dad\" by Robert Kiyosaki",
      org: "Reading",
      start: "2026-03",end: "2026-04",
      kind: "education",
      categories: ["personal"],
      summary: "Finished reading Rich Dad Poor Dad — personal finance and investing mindset.",
      tags: ["Reading", "Personal Finance"]
    },
    {
      title: "Reading — \"Mastery\" by Robert Greene",
      org: "Reading",
      start: "2026-04", end: "present",
      kind: "education",
      categories: ["personal"],
      summary: "Currently reading Mastery — on the path from apprenticeship to expertise.",
      tags: ["Reading", "Self-development"]
    },
    {
      title: "Started playing chess",
      org: "Chess",
      start: "2025-06",
      kind: "project",
      categories: ["personal"],
      summary: "Took up chess — strategy, pattern recognition and endgame practice.",
      tags: ["Chess", "Strategy"]
    }
  ],

  /* ------------------------------------------------------------------ */
  /*  SKILLS  —  grouped chips shown in the Skills section               */
  /* ------------------------------------------------------------------ */
  skills: [
    { group: "Programming",          items: ["Python", "C / C++", "MATLAB / Simulink", "Java", "Assembly", "Bash", "LaTeX"] },
    { group: "Robotics & Simulation", items: ["ROS / ROS2", "SLAM", "NVIDIA Isaac Sim / Omniverse", "Webots", "SCANeR studio", "Docker", "Git", "Linux / Unix", "NI LabVIEW"] },
    { group: "AI & Machine Learning", items: ["PyTorch", "Keras", "TensorFlow", "OpenCV", "Deep Learning", "Reinforcement Learning", "Computer Vision", "NLP", "Transformers / BERT", "RAG", "Vision Transformers", "YOLO", "Feature Engineering"] },
    { group: "Control & Systems",     items: ["MPC", "Kalman Filtering", "Control under Uncertainty", "Control Barrier Functions", "Fuzzy Logic", "Optimization", "Microcontrollers", "PLCs", "Power Electronics"] },
    { group: "Management & Soft",      items: ["Project Management", "Agile", "Innovation & Entrepreneurship", "Market Research", "Business Impact Analysis", "Leadership", "Strategic Planning", "Technical Communication", "Teamwork"] },
    { group: "Languages",             items: ["English — C1 (TOEIC 990/990)", "French — Professional (C1)", "Arabic — Native"] }
  ]
};
