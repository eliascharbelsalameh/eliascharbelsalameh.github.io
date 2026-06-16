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
   FRENCH TRANSLATION (the EN / FR button)
   ---------------------------------------------------------------------------
   Any text field can have a French twin by adding the same name + "_fr":
     title  / title_fr        summary / summary_fr
     org    / org_fr          highlights / highlights_fr   (array)
     role   / role_fr         tags / tags_fr               (array)
     label  / label_fr        items / items_fr             (array)
   If a `*_fr` field is missing, the site simply falls back to the English text,
   so nothing breaks if you only translate part of an entry.

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
    name: "Elias Charbel SALAMEH",
    initials: "ecs",                       // shown if no photo is provided
    photo: "assets/images/profile.jpg",   // optional — drop a file here to show it
    role: "Robotics, Automation & AI Engineer",
    role_fr: "Ingénieur en robotique, automatique & IA",
    tagline: "Combining Learning and Model-Based Methods for autonomous systems.",
    tagline_fr: "Allier apprentissage et méthodes à base de modèles pour les systèmes autonomes.",
    summary:
      "M2 student in Automation & Robotics of Intelligent Systems at UTC Compiègne, " +
      "in a double-degree program with USEK (Lebanon). Hands-on across control systems, " +
      "computer vision, SLAM and deep learning — currently an R&D intern at OpenLab " +
      "Stellantis–IMS–SANPSY improving Adaptive Cruise Control with mixed AI/control " +
      "methods. Seeking a CIFRE industrial PhD at the intersection of control and " +
      "learning-based methods for autonomous systems.",
    summary_fr:
      "Étudiant en M2 Automatique & Robotique des Systèmes Intelligents à l'UTC Compiègne, " +
      "en double diplôme avec l'USEK (Liban). Compétences pratiques en commande, vision par " +
      "ordinateur, SLAM et apprentissage profond — actuellement stagiaire R&D à l'OpenLab " +
      "Stellantis–IMS–SANPSY, où j'améliore le régulateur de vitesse adaptatif (ACC) par des " +
      "méthodes mixtes IA/commande. À la recherche d'une thèse CIFRE à l'intersection de la " +
      "commande et des méthodes par apprentissage pour les systèmes autonomes.",
    location: "Bordeaux, France",
    // Contacts — edit freely. Set any to "" to hide it.
    email: "eliascharbel.salameh@gmail.com",
    phone: "+33 7 83 75 76 69",
    github: "https://github.com/eliascharbelsalameh",
    linkedin: "https://www.linkedin.com/in/eliascharbelsalameh",
    // Punchy numbers shown in the hero band. Add / remove freely.
    stats: [
      { value: "5.0/5.0", label: "UTC M2 GPA — highest honors", label_fr: "Moyenne M2 UTC — félicitations du jury" },
      { value: "98.4%",   label: "mAP — BMW vision model", label_fr: "mAP — modèle de vision BMW" },
      { value: "42",      label: "judges led — WRO 2025", label_fr: "juges encadrés — WRO 2025" },
      { value: "3×",      label: "IEEE Regional Exemplary Awards", label_fr: "prix régionaux d'excellence IEEE" },
      { value: "$1.5K",   label: "startup grant — Byssus", label_fr: "subvention startup — Byssus" },
      { value: "990/990", label: "TOEIC English (C1)", label_fr: "TOEIC anglais (C1)" }
    ]
  },

  /* ------------------------------------------------------------------ */
  /*  CATEGORIES  —  the filter buttons (id, label, colour)              */
  /*  Add a new category here, then use its `id` in any entry.           */
  /* ------------------------------------------------------------------ */
  categories: [
    { id: "research",            label: "Research",        label_fr: "Recherche",          color: "#7c3aed" },
    { id: "technical",           label: "Technical",       label_fr: "Technique",          color: "#2563eb" },
    { id: "academic",            label: "Academic",        label_fr: "Académique",         color: "#0891b2" },
    { id: "project-management",  label: "Project Mgmt",    label_fr: "Gestion de projet",  color: "#c026d3" },
    { id: "leadership",          label: "Leadership",      label_fr: "Leadership",         color: "#d97706" },
    { id: "volunteering",        label: "Volunteering",    label_fr: "Bénévolat",          color: "#16a34a" },
    { id: "community",           label: "Community",       label_fr: "Communauté",         color: "#ea580c" },
    { id: "award",               label: "Awards & Honors", label_fr: "Prix & distinctions", color: "#ca8a04" },
    { id: "personal",            label: "Personal",        label_fr: "Personnel",          color: "#e11d48" }
  ],

  /* ------------------------------------------------------------------ */
  /*  TIMELINE  —  your efforts (any order; the site sorts by date)      */
  /* ------------------------------------------------------------------ */
  timeline: [

    /* ---- Current / 2026 ------------------------------------------- */
    {
      title: "IEEE Young Professionals R8 LEAD 2.0 Program",
      title_fr: "Programme IEEE Young Professionals R8 LEAD 2.0",
      org: "IEEE Region 8",
      org_fr: "IEEE Région 8",
      location: "Remote",
      location_fr: "À distance",
      start: "2026-05", end: "present",
      kind: "leadership",
      categories: ["leadership", "volunteering", "community"],
      featured: false,
      summary:
        "Leadership development and networking program for IEEE Young Professionals in Region 8.",
      summary_fr:
        "Programme de développement du leadership et de réseautage pour les Young Professionals IEEE de la Région 8.",
      highlights: [
        "IEEE R8 YP Member Activities.",
        "IEEE MGA YP Opportunities.",
        "IEEE vTools","IEEE Collabratec.",
        "IEEE Volunteer Ethics.",
        "Leadership sessions."
      ],
      highlights_fr: [
        "Activités pour les membres IEEE R8 YP.",
        "Opportunités IEEE MGA YP.",
        "IEEE vTools", "IEEE Collabratec.",
        "Éthique du bénévolat IEEE.",
        "Sessions de leadership."
      ],
      tags: ["Leadership", "Community", "Partnerships", "Events"],
      tags_fr: ["Leadership", "Communauté", "Partenariats", "Événements"]
    }
    ,{
      title: "R&D Intern — Robotics & Intelligent Systems",
      title_fr: "Stagiaire R&D — Robotique & systèmes intelligents",
      org: "OpenLab Stellantis–IMS–SANPSY",
      location: "Bordeaux, France",
      start: "2026-02", end: "present",
      kind: "experience",
      categories: ["research", "technical"],
      featured: true,
      summary:
        "Improving Adaptive Cruise Control (ACC) under uncertainty for connected " +
        "automated vehicles, blending robust control with learning.",
      summary_fr:
        "Amélioration du régulateur de vitesse adaptatif (ACC) sous incertitude pour les " +
        "véhicules connectés et automatisés, en combinant commande robuste et apprentissage.",
      highlights: [
        "Researching a mixed control approach for ACC under uncertainty within ADAS for connected automated vehicles (CAV).",
        "Implementing and benchmarking robust MPC, soft-constrained MPC and reinforcement learning across varied speed profiles (MATLAB/Simulink, Python, SCANeR studio, C).",
        "Developing a mixed Safe-RL ACC with Control Barrier Functions (SFRL-ACC + CBF).",
        "Validating each approach in simulation on common speed profiles."
      ],
      highlights_fr: [
        "Recherche d'une approche de commande mixte pour l'ACC sous incertitude dans les ADAS des véhicules connectés et automatisés (CAV).",
        "Implémentation et évaluation comparative de MPC robuste, MPC à contraintes souples et apprentissage par renforcement sur divers profils de vitesse (MATLAB/Simulink, Python, SCANeR studio, C).",
        "Développement d'un ACC mixte Safe-RL avec fonctions barrières de contrôle (SFRL-ACC + CBF).",
        "Validation de chaque approche en simulation sur des profils de vitesse courants."
      ],
      tags: ["MPC", "Reinforcement Learning", "Control Barrier Functions", "ADAS", "SCANeR studio", "MATLAB/Simulink"],
      tags_fr: ["MPC", "Apprentissage par renforcement", "Fonctions barrières de contrôle", "ADAS", "SCANeR studio", "MATLAB/Simulink"],
      links: [{ label: "GitHub", url: "https://github.com/eliascharbelsalameh/Stage_IA_Autom" }]
    },
    {
      title: "Cooperative Control of 6 Robots in Rendezvous",
      title_fr: "Commande coopérative de 6 robots en rendez-vous",
      org: "UTC — Control of Autonomous Cooperative Robots",
      org_fr: "UTC — Commande de robots coopératifs autonomes",
      location: "Compiègne, France",
      start: "2025-11", end: "2026-01",
      kind: "project",
      categories: ["research", "technical", "academic"],
      summary: "Designed a distributed control scheme driving six robots to a common rendezvous.",
      summary_fr: "Conception d'une commande distribuée amenant six robots à un rendez-vous commun.",
      highlights: [
        "Multi-agent control design for consensus / rendezvous of six mobile robots.",
        "Studied stability and convergence of cooperative control laws."
      ],
      highlights_fr: [
        "Conception d'une commande multi-agents pour le consensus / rendez-vous de six robots mobiles.",
        "Étude de la stabilité et de la convergence des lois de commande coopérative."
      ],
      tags: ["Multi-agent control", "Consensus", "Cooperative robotics"],
      tags_fr: ["Commande multi-agents", "Consensus", "Robotique coopérative"]
    },
    {
      title: "RISE for Collaboration — Research Program",
      title_fr: "RISE for Collaboration — programme de recherche",
      org: "RISE",
      location: "Remote",
      location_fr: "À distance",
      start: "2026-04",
      end: "2026-05",
      kind: "certification",
      categories: ["research"],
      summary: "Completed for the RISE for Collaboration research program.",
      summary_fr: "Programme de recherche RISE for Collaboration validé."
    },

    /* ---- 2025 ------------------------------------------------------ */
    {
      title: "M.Sc. — Complex Systems Eng.: Automation & Robotics of Intelligent Systems",
      title_fr: "M2 — Ingénierie des systèmes complexes : Automatique & Robotique des Systèmes Intelligents",
      org: "Université de Technologie de Compiègne (UTC)",
      location: "Compiègne, France",
      start: "2025-09", end: "present",
      kind: "education",
      categories: ["academic", "research"],
      featured: true,
      summary: "Double-degree M2 with USEK — GPA 5.0/5.0, highest honors. Research-project lead.",
      summary_fr: "Double diplôme M2 avec l'USEK — moyenne 5,0/5,0, félicitations du jury. Responsable de projet de recherche.",
      highlights: [
        "Leading a research project on Hyperdimensional Computing applied to neuromorphic vision.",
        "Coursework: advanced control of dynamic systems, control of cooperative autonomous robots, estimation for robotic navigation, robotic vision, systems-of-systems, modeling & propagation of uncertainty, optimization, biomimicry."
      ],
      highlights_fr: [
        "Pilotage d'un projet de recherche sur le calcul hyperdimensionnel appliqué à la vision neuromorphique.",
        "Cours : commande avancée des systèmes dynamiques, commande de robots coopératifs autonomes, estimation pour la navigation robotique, vision robotique, systèmes de systèmes, modélisation & propagation de l'incertitude, optimisation, biomimétisme."
      ],
      tags: ["Robotics", "Control", "Estimation", "Optimization", "Robotic Vision"],
      tags_fr: ["Robotique", "Commande", "Estimation", "Optimisation", "Vision robotique"]
    },
    {
      title: "Hyperdimensional Computing for Neuromorphic Vision",
      title_fr: "Calcul hyperdimensionnel pour la vision neuromorphique",
      org: "UTC — Research Project (lead)",
      org_fr: "UTC — Projet de recherche (responsable)",
      location: "Compiègne, France",
      start: "2025-09", end: "2026-01",
      kind: "research",
      categories: ["research", "academic"],
      featured: true,
      summary: "Leading research into hyperdimensional computing applied to event-based / neuromorphic vision.",
      summary_fr: "Pilotage d'une recherche sur le calcul hyperdimensionnel appliqué à la vision évènementielle / neuromorphique.",
      highlights: [
        "Investigating HDC representations for spatio-temporal, event-based vision.",
        "Project lead — scoping, literature, and experimental direction."
      ],
      highlights_fr: [
        "Étude des représentations HDC pour la vision évènementielle spatio-temporelle.",
        "Responsable du projet — cadrage, état de l'art et orientation expérimentale."
      ],
      tags: ["Hyperdimensional Computing", "Neuromorphic Vision", "Event-based Vision"],
      tags_fr: ["Calcul hyperdimensionnel", "Vision neuromorphique", "Vision évènementielle"]
    },
    {
      title: "FORSA — French Government Excellence Scholarship",
      title_fr: "FORSA — bourse d'excellence du gouvernement français",
      org: "French Government",
      org_fr: "Gouvernement français",
      location: "France",
      start: "2025-08", end: "2026-08",
      kind: "honor",
      categories: ["award", "academic"],
      featured: true,
      summary: "Awarded the competitive FORSA excellence scholarship for graduate study in France.",
      summary_fr: "Lauréat de la bourse d'excellence compétitive FORSA pour des études supérieures en France."
    },
    {
      title: "Head of Judges — World Robot Olympiad (WRO) Lebanon 2025",
      title_fr: "Responsable des juges — World Robot Olympiad (WRO) Liban 2025",
      org: "World Robot Olympiad — Lebanon",
      org_fr: "World Robot Olympiad — Liban",
      location: "Lebanon",
      location_fr: "Liban",
      start: "2025-07",
      kind: "leadership",
      categories: ["leadership", "volunteering", "community"],
      featured: true,
      summary: "Led and coordinated 42 judges across all categories of the national robotics olympiad.",
      summary_fr: "Encadrement et coordination de 42 juges dans toutes les catégories de l'olympiade nationale de robotique.",
      highlights: [
        "Managed 42 judges across every competition category.",
        "Capped three consecutive years judging the WRO national competition."
      ],
      highlights_fr: [
        "Gestion de 42 juges dans toutes les catégories de la compétition.",
        "Troisième année consécutive comme juge de la compétition nationale WRO."
      ],
      tags: ["Judging", "Event leadership", "Robotics"],
      tags_fr: ["Jugement", "Direction d'événement", "Robotique"]
    },
    {
      title: "Final Year Project — SLAM on Unitree AlienGo",
      title_fr: "Projet de fin d'études — SLAM sur Unitree AlienGo",
      org: "USEK — Robotics Department",
      org_fr: "USEK — Département de robotique",
      location: "Jounieh, Lebanon",
      location_fr: "Jounieh, Liban",
      start: "2025-02", end: "2025-05",
      kind: "project",
      categories: ["research", "technical", "academic"],
      featured: true,
      summary: "Studied and implemented a SLAM pipeline for autonomous navigation of a quadruped robot.",
      summary_fr: "Étude et implémentation d'une chaîne SLAM pour la navigation autonome d'un robot quadrupède.",
      highlights: [
        "Study and preliminary implementation of a SLAM algorithm (ROS1) on the Unitree AlienGo quadruped.",
        "Fused 3D LiDAR, IMU and an Intel RealSense D435i depth camera to improve navigation robustness and performance."
      ],
      highlights_fr: [
        "Étude et implémentation préliminaire d'un algorithme SLAM (ROS1) sur le quadrupède Unitree AlienGo.",
        "Fusion d'un LiDAR 3D, d'une centrale inertielle (IMU) et d'une caméra de profondeur Intel RealSense D435i pour améliorer la robustesse et les performances de navigation."
      ],
      tags: ["SLAM", "ROS1", "3D LiDAR", "RealSense D435i", "Quadruped"],
      tags_fr: ["SLAM", "ROS1", "LiDAR 3D", "RealSense D435i", "Quadrupède"]
    },
    {
      title: "Machine Learning & Computer Vision — Intern",
      title_fr: "Apprentissage automatique & vision par ordinateur — stagiaire",
      org: "inmind.ai academy",
      location: "Mkalles, Lebanon",
      location_fr: "Mkalles, Liban",
      start: "2025-02", end: "2025-03",
      kind: "experience",
      categories: ["technical", "research"],
      featured: true,
      summary: "Built an end-to-end computer-vision pipeline for BMW factory inference (98.4% mAP).",
      summary_fr: "Conception d'une chaîne de vision par ordinateur de bout en bout pour l'inspection en usine BMW (98,4 % mAP).",
      highlights: [
        "Designed an end-to-end CV pipeline for BMW assembly-line item detection with YOLOv5 (mAP[0.5–0.95] = 98.4%).",
        "Across the track, worked the modern AI stack — Transformers/BERT, RAG, CNNs, point clouds and Vision Transformers.",
        "Stack: PyTorch, Python, Docker / Docker-Compose, Git, NVIDIA Omniverse; synthetic data, CI/CD, FastAPI, containerization.",
        "Got offered an interview with the BMW technical team based on the program performance, but decided to proceed with a Robotics/Control Systems Specialization in UTC since they had conflicting timelines."
      ],
      highlights_fr: [
        "Conception d'une chaîne CV de bout en bout pour la détection de pièces sur ligne d'assemblage BMW avec YOLOv5 (mAP[0,5–0,95] = 98,4 %).",
        "Tout au long du parcours, utilisation de la pile IA moderne — Transformers/BERT, RAG, CNN, nuages de points et Vision Transformers.",
        "Outils : PyTorch, Python, Docker / Docker-Compose, Git, NVIDIA Omniverse ; données synthétiques, CI/CD, FastAPI, conteneurisation.",
        "Entretien proposé avec l'équipe technique BMW grâce aux résultats du programme, mais choix de poursuivre une spécialisation Robotique/Systèmes de commande à l'UTC en raison de calendriers incompatibles."
      ],
      tags: ["YOLOv5", "Computer Vision", "PyTorch", "Transformers / BERT", "RAG", "Vision Transformers", "Docker", "Synthetic Data", "FastAPI"],
      tags_fr: ["YOLOv5", "Vision par ordinateur", "PyTorch", "Transformers / BERT", "RAG", "Vision Transformers", "Docker", "Données synthétiques", "FastAPI"],
      links: [{ label: "GitHub", url: "https://github.com/eliascharbelsalameh/ComputerVision_Project_inmind" }]
    },
    {
      title: "ROS2 Workshop — IC2AI'25",
      title_fr: "Atelier ROS2 — IC2AI'25",
      org: "IEEE Lebanon — Joint Chapter RA/IM/CS",
      org_fr: "IEEE Liban — Chapitre conjoint RA/IM/CS",
      location: "Lebanon",
      location_fr: "Liban",
      start: "2025-02",
      kind: "certification",
      categories: ["technical"],
      summary: "Hands-on ROS2 training at the IC2AI'25 workshop.",
      summary_fr: "Formation pratique ROS2 lors de l'atelier IC2AI'25."
    },
    {
      title: "AI for Research and Insights - Gemini",
      title_fr: "L'IA pour la recherche et l'analyse - Gemini",
      org: "Coursera",
      location: "Online",
      location_fr: "En ligne",
      start: "2025",            // approximate date — set the real month in data.js if you have it
      kind: "certification",
      categories: ["research", "technical"],
      summary: "Applying AI to research workflows and insight generation.",
      summary_fr: "Application de l'IA aux workflows de recherche et à la production d'analyses."
    },
    {
      title: "AI Fundamentals - Gemini",
      title_fr: "Fondamentaux de l'IA - Gemini",
      org: "Coursera",
      location: "Online",
      location_fr: "En ligne",
      start: "2025",            // approximate date — set the real month in data.js if you have it
      kind: "certification",
      categories: ["technical"],
      summary: "Foundations of artificial intelligence and core ML concepts.",
      summary_fr: "Bases de l'intelligence artificielle et concepts clés du machine learning."
    },

    /* ---- 2024 ------------------------------------------------------ */
    {
      title: "Co-founder — Byssus (textile-waste recycling)",
      title_fr: "Cofondateur — Byssus (recyclage de déchets textiles)",
      org: "Byssus",
      location: "Jounieh, Lebanon",
      location_fr: "Jounieh, Liban",
      start: "2024-06", end: "present",
      kind: "experience",
      categories: ["project-management", "leadership", "technical"],
      featured: true,
      summary: "Co-founded a textile-waste recycling startup; won a $1,500 prototyping grant.",
      summary_fr: "Cofondation d'une startup de recyclage de déchets textiles ; lauréate d'une subvention de prototypage de 1 500 $.",
      highlights: [
        "Co-created a startup tackling textile-waste recycling; winners of a $1,500 grant at ACIE USEK IdeaLab #3.",
        "Contributed to the design of automated systems and prototyping of innovative solutions."
      ],
      highlights_fr: [
        "Cocréation d'une startup dédiée au recyclage des déchets textiles ; lauréats d'une subvention de 1 500 $ à l'ACIE USEK IdeaLab #3.",
        "Contribution à la conception de systèmes automatisés et au prototypage de solutions innovantes."
      ],
      tags: ["Entrepreneurship", "Automation", "Prototyping", "Sustainability"],
      tags_fr: ["Entrepreneuriat", "Automatisation", "Prototypage", "Développement durable"]
    },
    {
      title: "Huawei ICT Innovation Competition — 3rd place, MECA region",
      title_fr: "Huawei ICT Innovation Competition — 3e place, région MECA",
      org: "Huawei",
      location: "MECA Region",
      location_fr: "Région MECA",
      start: "2024-09", end: "2024-12",
      kind: "honor",
      categories: ["award", "technical", "research"],
      featured: true,
      summary: "Placed 3rd in the MECA region of the Huawei ICT Innovation Competition.",
      summary_fr: "3e place dans la région MECA du concours Huawei ICT Innovation.",
      tags: ["Innovation", "Competition"],
      tags_fr: ["Innovation", "Concours"]
    },
    {
      title: "Seeds for the Future — MECA Program",
      title_fr: "Seeds for the Future — programme MECA",
      org: "Huawei",
      location: "Uzbekistan / MECA",
      location_fr: "Ouzbékistan / MECA",
      start: "2024-08",
      kind: "certification",
      categories: ["community", "technical", "leadership"],
      summary: "Selected for Huawei's flagship MECA talent program; Tech4Good pitch team.",
      summary_fr: "Sélectionné pour le programme phare de talents MECA de Huawei ; équipe de pitch Tech4Good.",
      tags: ["ICT", "Tech4Good", "Leadership"],
      tags_fr: ["TIC", "Tech4Good", "Leadership"]
    },
    {
      title: "AI Bootcamp",
      title_fr: "Bootcamp IA",
      org: "ZAKA AI",
      location: "Lebanon",
      location_fr: "Liban",
      start: "2024-06",end: "2024-07",
      kind: "certification",
      categories: ["technical"],
      summary: "Intensive bootcamp in AI, machine learning and deep learning.",
      summary_fr: "Bootcamp intensif en IA, apprentissage automatique et apprentissage profond.",
      tags: ["AI", "Machine Learning", "Deep Learning"],
      tags_fr: ["IA", "Apprentissage automatique", "Apprentissage profond"]
    },
    {
      title: "Telecommunications Intern — RAN Capacity",
      title_fr: "Stagiaire télécommunications — capacité RAN",
      org: "Alfa Telecommunications",
      location: "Dekwaneh, Lebanon",
      location_fr: "Dekwaneh, Liban",
      start: "2024-07", end: "2024-08",
      kind: "experience",
      categories: ["technical"],
      summary: "Optimised and managed Radio Access Network (RAN) capacity for a national telecom operator.",
      summary_fr: "Optimisation et gestion de la capacité du réseau d'accès radio (RAN) pour un opérateur télécom national.",
      highlights: [
        "Analysed network-performance data and helped plan and deploy network resources.",
        "Identified efficiency improvements using advanced analytical tools and strategic capacity planning."
      ],
      highlights_fr: [
        "Analyse des données de performance réseau et participation à la planification et au déploiement des ressources réseau.",
        "Identification de gains d'efficacité grâce à des outils analytiques avancés et à une planification stratégique de la capacité."
      ],
      tags: ["RAN", "Telecom", "Network Optimization", "Data Analysis"],
      tags_fr: ["RAN", "Télécom", "Optimisation réseau", "Analyse de données"]
    },
    {
      title: "Self-Balancing Robot",
      title_fr: "Robot auto-équilibré",
      org: "Personal Project",
      org_fr: "Projet personnel",
      location: "Lebanon",
      location_fr: "Liban",
      start: "2024-03",
      kind: "project",
      categories: ["technical"],
      summary: "Built a two-wheeled self-balancing robot as a base for humanoid / rover work.",
      summary_fr: "Construction d'un robot auto-équilibré à deux roues comme base pour des travaux humanoïdes / rover.",
      highlights: [
        "Designed and built a two-wheel self-balancing robot — a foundation for more advanced platforms (humanoid, rover)."
      ],
      highlights_fr: [
        "Conception et construction d'un robot auto-équilibré à deux roues — base pour des plateformes plus avancées (humanoïde, rover)."
      ],
      tags: ["Control", "Embedded", "Robotics"],
      tags_fr: ["Commande", "Embarqué", "Robotique"],
      links: [{ label: "GitHub", url: "https://github.com/eliascharbelsalameh/self-balancing-robot" }]
    },
    {
      title: "Martial-Arts Assistant on Pepper (HRI)",
      title_fr: "Assistant d'arts martiaux sur Pepper (IHR)",
      org: "USEK — GIN456",
      location: "Jounieh, Lebanon",
      location_fr: "Jounieh, Liban",
      start: "2024-09", end: "2025-01",
      kind: "project",
      categories: ["technical", "research", "academic"],
      summary: "Built a martial-arts assistant on the Pepper social robot, focused on human-robot interaction.",
      summary_fr: "Développement d'un assistant d'arts martiaux sur le robot social Pepper, axé sur l'interaction homme-robot.",
      highlights: [
        "Developed a martial-arts assistant on the Pepper social robot.",
        "Applied human-robot interaction (HRI) principles."
      ],
      highlights_fr: [
        "Développement d'un assistant d'arts martiaux sur le robot social Pepper.",
        "Application des principes d'interaction homme-robot (IHR)."
      ],
      tags: ["HRI", "Social Robotics", "Pepper"],
      tags_fr: ["IHR", "Robotique sociale", "Pepper"],
      links: [{ label: "GitHub", url: "https://github.com/eliascharbelsalameh/GIN456-Martial_Arts" }]
    },
    {
      title: "Retrieval-Augmented Generation Chatbot (Web App)",
      title_fr: "Chatbot à génération augmentée par récupération (application web)",
      org: "Personal Project",
      org_fr: "Projet personnel",
      location: "Lebanon",
      location_fr: "Liban",
      start: "2024-08",
      kind: "project",
      categories: ["technical"],
      summary: "Led development of a RAG chatbot web app built with Streamlit.",
      summary_fr: "Pilotage du développement d'une application web de chatbot RAG construite avec Streamlit.",
      tags: ["RAG", "LLM", "NLP", "Streamlit"],
      tags_fr: ["RAG", "LLM", "TALN", "Streamlit"],
      links: [{ label: "GitHub", url: "https://github.com/eliascharbelsalameh/Chatbot_RAG_Webapp" }]
    },
    {
      title: "Emotion Analysis — NLP Classifier",
      title_fr: "Analyse des émotions — classifieur TALN",
      org: "Personal Project",
      org_fr: "Projet personnel",
      location: "Lebanon",
      location_fr: "Liban",
      start: "2025-03",
      kind: "project",
      categories: ["technical"],
      summary: "Built an NLP classifier for categorical emotion prediction.",
      summary_fr: "Développement d'un classifieur TALN pour la prédiction d'émotions catégorielles.",
      tags: ["NLP", "Classification", "Deep Learning"],
      tags_fr: ["TALN", "Classification", "Apprentissage profond"],
      links: [{ label: "GitHub", url: "https://github.com/eliascharbelsalameh/emotion_analysis" }]
    },
    {
      title: "AI Model Portfolio — Vision & Regression",
      title_fr: "Portfolio de modèles IA — vision & régression",
      org: "Academic USEK Projects",
      org_fr: "Projets académiques USEK",
      location: "Lebanon",
      location_fr: "Liban",
      start: "2024-09", end: "2025-05",
      kind: "project",
      categories: ["technical"],
      summary: "A set of from-scratch ML models: image classification, regression and medical diagnosis. All the below projects are part of my Machine Learning and Deep Learning coursework at USEK, where I implemented each model from scratch (no pre-trained weights or transfer learning) to deepen my understanding of the underlying algorithms and architectures. The datasets are either public or in the github repositories.",
      summary_fr: "Un ensemble de modèles de ML développés de zéro : classification d'images, régression et diagnostic médical. Tous ces projets s'inscrivent dans mes cours d'apprentissage automatique et profond à l'USEK, où j'ai implémenté chaque modèle de zéro (sans poids pré-entraînés ni apprentissage par transfert) afin d'approfondir ma compréhension des algorithmes et architectures sous-jacents. Les jeux de données sont publics ou disponibles dans les dépôts GitHub.",
      highlights: [
        "Fashion-MNIST — MLP/CNN/ANN implemented from scratch (99.61%).",
        "Animals-10 — multi-class image classifier (92%).",
        "Cats vs Dogs — binary image classifier (95%).",
        "Breast-cancer diagnosis — classifier up to 99% accuracy.",
        "Function approximation — regression with MSE 0.0006."
      ],
      highlights_fr: [
        "Fashion-MNIST — MLP/CNN/ANN implémentés de zéro (99,61 %).",
        "Animals-10 — classifieur d'images multi-classes (92 %).",
        "Chats vs Chiens — classifieur d'images binaire (95 %).",
        "Diagnostic du cancer du sein — classifieur jusqu'à 99 % de précision.",
        "Approximation de fonction — régression avec MSE 0,0006."
      ],
      tags: ["CNN", "Classification", "Regression", "Keras"],
      tags_fr: ["CNN", "Classification", "Régression", "Keras"],
      links: [
        { label: "Fashion-MNIST", url: "https://github.com/eliascharbelsalameh/Fashion_MNIST-AI" },
        { label: "Animals-10", url: "https://github.com/eliascharbelsalameh/animals-10_AI" },
        { label: "Cats vs Dogs", url: "https://github.com/eliascharbelsalameh/cats_and_dogs-AI" },
        { label: "Breast Cancer", url: "https://github.com/eliascharbelsalameh/WISC_BCancer_diagnonsis_AI" },
        { label: "Function Approx.", url: "https://github.com/eliascharbelsalameh/Function_Approximation-AI" }
      ]
    },{
      title: "Chair — IEEE USEK Student Branch",
      title_fr: "Président — Antenne étudiante IEEE USEK",
      org: "IEEE",
      location: "Jounieh, Lebanon",
      location_fr: "Jounieh, Liban",
      start: "2024-12", end: "2025-07",
      kind: "leadership",
      categories: ["leadership", "volunteering", "community"],
      featured: true,
      summary: "Led the branch to an IEEE Regional Exemplary Student Branch Awards (2025).",
      summary_fr: "Antenne menée à un Prix régional IEEE d'antenne étudiante exemplaire (2025).",
      highlights: [
        "Led a multidisciplinary team; built industry–academia links with IEEE Lebanon, Zaka AI, Semicolon, LebThree and EXEO.",
        "Branch won the IEEE Regional Exemplary Student Branch Award for the third consecutive year (2025).",
        "Technical Ambassador at Zaka AI, delivering AI sessions."
      ],
      highlights_fr: [
        "Direction d'une équipe pluridisciplinaire ; création de liens industrie–université avec IEEE Liban, Zaka AI, Semicolon, LebThree et EXEO.",
        "L'antenne a remporté le Prix régional IEEE d'antenne étudiante exemplaire pour la troisième année consécutive (2025).",
        "Ambassadeur technique chez Zaka AI, animation de sessions IA."
      ],
      tags: ["Leadership", "Community", "Partnerships", "Events"],
      tags_fr: ["Leadership", "Communauté", "Partenariats", "Événements"]
    },

    /* ---- 2023 ------------------------------------------------------ */
    {
      title: "Teaching & Research Assistant",
      title_fr: "Assistant d'enseignement et de recherche",
      org: "USEK — Electrical & Electronics Eng.",
      org_fr: "USEK — Génie électrique & électronique",
      location: "Jounieh, Lebanon",
      location_fr: "Jounieh, Liban",
      start: "2023-09", end: "2025-06",
      kind: "experience",
      categories: ["academic", "technical", "leadership"],
      summary: "Supported labs and built automated grading workflows for 40+ students each semester.",
      summary_fr: "Encadrement de TP et mise en place de workflows de notation automatisés pour plus de 40 étudiants par semestre.",
      highlights: [
        "Ran lab sessions and departmental academic support for 40+ students per semester.",
        "Introduced automated methods for evaluating and grading submissions (incl. power-systems courses).",
        "Entrusted with class management and development; fostered new collaboration opportunities with faculty leaders."
      ],
      highlights_fr: [
        "Animation de séances de TP et soutien académique pour plus de 40 étudiants par semestre.",
        "Introduction de méthodes automatisées d'évaluation et de notation des rendus (y compris cours de réseaux électriques).",
        "Responsabilité de la gestion et du développement de la classe ; nouvelles collaborations avec les responsables pédagogiques."
      ],
      tags: ["Teaching", "Automation", "Mentoring"],
      tags_fr: ["Enseignement", "Automatisation", "Mentorat"]
    },
    {
      title: "Installing Solar PV Systems for Residential Use",
      title_fr: "Installation de systèmes photovoltaïques résidentiels",
      org: "Apave",
      location: "Lebanon",
      location_fr: "Liban",
      start: "2023-06",
      kind: "certification",
      categories: ["technical"],
      summary: "Certified in the design and installation of residential solar photovoltaic systems.",
      summary_fr: "Certifié pour la conception et l'installation de systèmes photovoltaïques solaires résidentiels.",
      tags: ["Solar PV", "Power Systems"],
      tags_fr: ["Photovoltaïque", "Réseaux électriques"]
    },
    {
      title: "Electrical Engineering Intern",
      title_fr: "Stagiaire en génie électrique",
      org: "EMCO Group",
      location: "Hazmieh, Lebanon",
      location_fr: "Hazmieh, Liban",
      start: "2023-08",
      kind: "experience",
      categories: ["technical"],
      summary: "Helped design the electrical system for a water-treatment plant (Cabinda Angola Refinery).",
      summary_fr: "Participation à la conception du système électrique d'une station de traitement des eaux (raffinerie de Cabinda, Angola).",
      highlights: [
        "EPB design — wiring diagrams and layouts from P&ID; cable-tray routing and schedules.",
        "Prepared work orders, instrumentation and PLC I/O lists; exposure to power electrical, automation (PLC) and panel-board design."
      ],
      highlights_fr: [
        "Conception EPB — schémas de câblage et implantations à partir des P&ID ; cheminement et nomenclatures des chemins de câbles.",
        "Préparation des ordres de travail, des listes d'instrumentation et d'E/S d'automate ; exposition à l'électricité de puissance, à l'automatisation (API) et à la conception d'armoires."
      ],
      tags: ["Electrical Design", "PLC", "Automation", "P&ID"],
      tags_fr: ["Conception électrique", "API", "Automatisation", "P&ID"]
    },
    {
      title: "Level Up Leadership Program 2023",
      title_fr: "Programme Level Up Leadership 2023",
      org: "Level Up",
      location: "Lebanon",
      location_fr: "Liban",
      start: "2023-10", end: "2023-12",
      kind: "certification",
      categories: ["leadership", "community"],
      summary: "Completed a structured leadership-development program.",
      summary_fr: "Programme structuré de développement du leadership validé."
    },
    {
      title: "Vice Chair — IEEE USEK Student Branch",
      title_fr: "Vice-président — Antenne étudiante IEEE USEK",
      org: "IEEE",
      location: "Jounieh, Lebanon",
      location_fr: "Jounieh, Liban",
      start: "2023-12", end: "2024-12",
      kind: "leadership",
      categories: ["leadership", "volunteering", "community"],
      featured: false,
      summary: "Participated in the organization of the IEEE Student Branch.",
      summary_fr: "Participation à l'organisation de l'antenne étudiante IEEE.",
      highlights: [
        "Co-Led a multidisciplinary team; built industry–academia links with IEEE Lebanon, Zaka AI, Semicolon, LebThree and EXEO.",
        "Branch the IEEE Regional Exemplary Student Branch Award of 2024.",
        "Ambassador for IEEE Day 2024 and IEEEXtreme 17.0 — coordinated 50 students and a $745 budget across a two-day event.",
        "Technical Ambassador at Zaka AI, delivering AI sessions."
      ],
      highlights_fr: [
        "Codirection d'une équipe pluridisciplinaire ; création de liens industrie–université avec IEEE Liban, Zaka AI, Semicolon, LebThree et EXEO.",
        "L'antenne a remporté le Prix régional IEEE d'antenne étudiante exemplaire 2024.",
        "Ambassadeur pour l'IEEE Day 2024 et IEEEXtreme 17.0 — coordination de 50 étudiants et d'un budget de 745 $ sur un événement de deux jours.",
        "Ambassadeur technique chez Zaka AI, animation de sessions IA."
      ],
      tags: ["Leadership", "Community", "Partnerships", "Events"],
      tags_fr: ["Leadership", "Communauté", "Partenariats", "Événements"]
    },

    /* ---- 2022 ------------------------------------------------------ */
    {
      title: "Treasurer — IEEE USEK Student Branch",
      title_fr: "Trésorier — Antenne étudiante IEEE USEK",
      org: "IEEE",
      location: "Jounieh, Lebanon",
      location_fr: "Jounieh, Liban",
      start: "2022-12", end: "2023-12",
      kind: "leadership",
      categories: ["leadership", "volunteering", "community"],
      featured: false,
      summary: "Helped the branch to the IEEE Regional Exemplary Student Branch Awards of 2023.",
      summary_fr: "Contribution à l'obtention par l'antenne du Prix régional IEEE d'antenne étudiante exemplaire 2023.",
      highlights: [
        "Branch won the IEEE Regional Exemplary Student Branch Award of 2023.",
        "Kept the books for the IEEE USEK SB.",
        "Developed a new method to register members to the IEEE Membership, making their experience smoother and more efficient.",
        "Increased the membership of the branch by 74% in one year.",
        "IEEE SYPLC'23 Treasury Team Member."
      ],
      highlights_fr: [
        "L'antenne a remporté le Prix régional IEEE d'antenne étudiante exemplaire 2023.",
        "Tenue de la comptabilité de l'antenne IEEE USEK.",
        "Développement d'une nouvelle méthode d'adhésion des membres à l'IEEE, rendant l'expérience plus fluide et efficace.",
        "Augmentation de 74 % du nombre de membres de l'antenne en un an.",
        "Membre de l'équipe trésorerie IEEE SYPLC'23."
      ],
      tags: ["Leadership", "Community", "Partnerships", "Events","Reporting","Treasury Management"],
      tags_fr: ["Leadership", "Communauté", "Partenariats", "Événements", "Reporting", "Gestion de trésorerie"]
    },

    /* ---- 2021 ------------------------------------------------------ */
    {
      title: "B.E. — Electrical & Electronics Engineering",
      title_fr: "Diplôme d'ingénieur — Génie électrique & électronique",
      org: "Holy Spirit University of Kaslik (USEK)",
      location: "Jounieh, Lebanon",
      location_fr: "Jounieh, Liban",
      start: "2021-09", end: "2026-06",
      kind: "education",
      categories: ["academic"],
      summary: "Bachelor of Engineering, double-degree with UTC — GPA 93.34/100, High Distinction.",
      summary_fr: "Diplôme d'ingénieur, double diplôme avec l'UTC — moyenne 93,34/100, mention très bien.",
      highlights: [
        "GPA 93.34/100 — High Distinction (≈ 18.7/20).",
        "Coursework in control, automation, AI, plus project management, agile methodology and innovation & entrepreneurship.",
        "USEK Merit Scholarship across the full program (2021–2026)."
      ],
      highlights_fr: [
        "Moyenne 93,34/100 — mention très bien (≈ 18,7/20).",
        "Cours en commande, automatisation, IA, ainsi que gestion de projet, méthode agile et innovation & entrepreneuriat.",
        "Bourse au mérite USEK sur l'ensemble du cursus (2021–2026)."
      ],
      tags: ["Electrical Eng.", "Control", "Automation"],
      tags_fr: ["Génie électrique", "Commande", "Automatisation"]
    },

    /* ---- 2006 ------------------------------------------------------ */
    {
      title: "French & Lebanese Double Baccalaureate — General Sciences",
      title_fr: "Double baccalauréat franco-libanais — sciences générales",
      org: "Collège Saint Joseph Antoura (CSJA) — AEFE",
      location: "Antoura, Lebanon",
      location_fr: "Antoura, Liban",
      start: "2006-09", end: "2021-06",
      kind: "education",
      categories: ["academic"],
      summary: "AEFE double baccalaureate in general sciences — 16.23/20, highest honors.",
      summary_fr: "Double baccalauréat AEFE en sciences générales — 16,23/20, félicitations du jury."
    },

    /* ---- Personal / Athletics (dates below are PLACEHOLDERS — set the real ones) ---- */
    {
      title: "Back Squat — 166 kg (1-rep-max PR)",
      title_fr: "Squat arrière — 166 kg (record max sur 1 rép.)",
      org: "Strength training",
      org_fr: "Musculation",
      start: "2023-11",            // PLACEHOLDER — set the real date
      kind: "fitness",
      categories: ["personal"],
      summary: "Hit a 166 kg back-squat — a one-rep-max personal record.",
      summary_fr: "Squat arrière à 166 kg — record personnel sur une répétition.",
      tags: ["Strength", "Powerlifting", "166 kg"],
      tags_fr: ["Force", "Powerlifting", "166 kg"]
    },
    {
      title: "Back Squat — 140 kg x 5",
      title_fr: "Squat arrière — 140 kg × 5",
      org: "Strength training",
      org_fr: "Musculation",
      start: "2024-02",            // PLACEHOLDER — set the real date
      kind: "fitness",
      categories: ["personal"],
      summary: "Hit a 140 kg back-squat — a five-rep-max personal record.",
      summary_fr: "Squat arrière à 140 kg — record personnel sur cinq répétitions.",
      tags: ["Strength", "Powerlifting", "140 kg"],
      tags_fr: ["Force", "Powerlifting", "140 kg"]
    },
    {
      title: "Deadlift — 180 kg (1-rep-max PR)",
      title_fr: "Soulevé de terre — 180 kg (record max sur 1 rép.)",
      org: "Strength training",
      org_fr: "Musculation",
      start: "2025-06",            // PLACEHOLDER — set the real date
      kind: "fitness",
      categories: ["personal"],
      summary: "Hit a 180 kg deadlift — a one-rep-max personal record.",
      summary_fr: "Soulevé de terre à 180 kg — record personnel sur une répétition.",
      tags: ["Strength", "Powerlifting", "180 kg"],
      tags_fr: ["Force", "Powerlifting", "180 kg"]
    },
    {
      title: "Bench Press — 120 kg × 2",
      title_fr: "Développé couché — 120 kg × 2",
      org: "Strength training",
      org_fr: "Musculation",
      start: "2023-09",            // PLACEHOLDER — set the real date
      kind: "fitness",
      categories: ["personal"],
      summary: "Benched 120 kg for 2 reps.",
      summary_fr: "Développé couché à 120 kg sur 2 répétitions.",
      tags: ["Strength", "Bench Press", "120 kg"],
      tags_fr: ["Force", "Développé couché", "120 kg"]
    },
    {
      title: "Completed an 8K run",
      title_fr: "Course de 8 km terminée",
      org: "Running",
      org_fr: "Course à pied",
      start: "2021-11",            // PLACEHOLDER — set the real date
      kind: "fitness",
      categories: ["personal"],
      summary: "Finished an 8K road run — endurance goal completed.",
      summary_fr: "Course sur route de 8 km terminée — objectif d'endurance atteint.",
      tags: ["Running", "Endurance", "8K"],
      tags_fr: ["Course à pied", "Endurance", "8 km"]
    },
    {
      title: "Reading — \"Rich Dad Poor Dad\" by Robert Kiyosaki",
      title_fr: "Lecture — « Rich Dad Poor Dad » de Robert Kiyosaki",
      org: "Reading",
      org_fr: "Lecture",
      start: "2026-03",end: "2026-04",
      kind: "education",
      categories: ["personal"],
      summary: "Finished reading Rich Dad Poor Dad — personal finance and investing mindset.",
      summary_fr: "Lecture terminée de « Rich Dad Poor Dad » — état d'esprit finance personnelle et investissement.",
      tags: ["Reading", "Personal Finance"],
      tags_fr: ["Lecture", "Finance personnelle"]
    },
    {
      title: "Reading — \"Mastery\" by Robert Greene",
      title_fr: "Lecture — « Mastery » de Robert Greene",
      org: "Reading",
      org_fr: "Lecture",
      start: "2026-04", end: "present",
      kind: "education",
      categories: ["personal"],
      summary: "Better understanding the level of \"Mastery\" — on the path from apprenticeship to expertise.",
      summary_fr: "Mieux comprendre le niveau de « maîtrise » — sur le chemin de l'apprenti à l'expert.",
      tags: ["Reading", "Self-development"],
      tags_fr: ["Lecture", "Développement personnel"]
    },
    {
      title: "Reading — \"The Prince\" by Nicolo Machiavelli",
      title_fr: "Lecture — « The Prince » de Nicolo Machiavelli",
      org: "Reading",
      org_fr: "Lecture",
      start: "2026-06", end: "present",
      kind: "education",
      categories: ["personal"],
      summary: "The Prince by Machiavelli — classic on power, strategy and leadership.",
      summary_fr: "« The Prince » de Nicolo Machiavelli — classique sur le pouvoir, la stratégie et le leadership.",
      tags: ["Reading", "Self-development"],
      tags_fr: ["Lecture", "Développement personnel"]
    },
    {
      title: "Started playing chess",
      title_fr: "Début de la pratique des échecs",
      org: "Chess",
      org_fr: "Échecs",
      start: "2025-06",
      kind: "project",
      categories: ["personal"],
      summary: "Took up chess — strategy, pattern recognition and endgame practice.",
      summary_fr: "Initiation aux échecs — stratégie, reconnaissance de schémas et pratique des finales.",
      tags: ["Chess", "Strategy"],
      tags_fr: ["Échecs", "Stratégie"]
    }
  ],

  /* ------------------------------------------------------------------ */
  /*  SKILLS  —  grouped chips shown in the Skills section               */
  /* ------------------------------------------------------------------ */
  skills: [
    { group: "Programming", group_fr: "Programmation", items: ["Python", "C / C++", "MATLAB / Simulink", "Java", "Assembly", "Bash", "LaTeX"] },
    { group: "Robotics & Simulation", group_fr: "Robotique & simulation", items: ["ROS / ROS2", "SLAM", "NVIDIA Isaac Sim / Omniverse", "Webots", "SCANeR studio", "Docker", "Git", "Linux / Unix", "NI LabVIEW"] },
    { group: "AI & Machine Learning", group_fr: "IA & apprentissage automatique", items: ["PyTorch", "Keras", "TensorFlow", "OpenCV", "Deep Learning", "Reinforcement Learning", "Computer Vision", "NLP", "Transformers / BERT", "RAG", "Vision Transformers", "YOLO", "Feature Engineering"] },
    { group: "Control & Systems", group_fr: "Commande & systèmes", items: ["MPC", "Kalman Filtering", "Control under Uncertainty", "Control Barrier Functions", "Fuzzy Logic", "Optimization", "Microcontrollers", "PLCs", "Power Electronics"] },
    { group: "Management & Soft", group_fr: "Management & savoir-être", items: ["Project Management", "Agile", "Innovation & Entrepreneurship", "Market Research", "Business Impact Analysis", "Leadership", "Strategic Planning", "Technical Communication", "Teamwork"], items_fr: ["Gestion de projet", "Agile", "Innovation & entrepreneuriat", "Étude de marché", "Analyse d'impact métier", "Leadership", "Planification stratégique", "Communication technique", "Travail d'équipe"] },
    { group: "Languages", group_fr: "Langues", items: ["English — C1 (TOEIC 990/990)", "French — Professional (C1)", "Arabic — Native"], items_fr: ["Anglais — C1 (TOEIC 990/990)", "Français — professionnel (C1)", "Arabe — langue maternelle"] }
  ]
};
