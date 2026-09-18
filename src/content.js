export const services = [
  {
    slug: 'developpement-web', enSlug: 'web-development', short: ['Web', 'Web'],
    title: ['Développement web', 'Web development'],
    intro: ['Des sites et applications web qui répondent à vos besoins, et donnent envie de les utiliser.', 'Websites and web applications built around your needs, and a pleasure to use.'],
    description: ['Du site vitrine à la plateforme métier, nous concevons le front-end et le back-end comme un ensemble cohérent. Une navigation claire, des temps de chargement courts et une architecture qui accompagne votre évolution.', 'From a company website to a business platform, we design the front end and back end as one coherent system. Clear navigation, fast loading and an architecture that can grow with you.'],
    items: [['Sites vitrines et e-commerce', 'Applications web sur mesure', 'API et connexions à vos outils', 'Performance, accessibilité et maintenance'], ['Company websites and e-commerce', 'Custom web applications', 'APIs and integrations', 'Performance, accessibility and maintenance']]
  },
  {
    slug: 'logiciels-sur-mesure', enSlug: 'custom-software', short: ['Logiciel', 'Software'],
    title: ['Logiciels sur mesure', 'Custom software'],
    intro: ['Des outils qui s’adaptent à votre métier. Et vous simplifient le quotidien.', 'Tools that adapt to your business and make everyday work easier.'],
    description: ['Nous partons de vos processus et des usages de vos équipes pour développer des outils métier utiles : gestion, suivi, automatisation et consolidation des données. Le périmètre est défini ensemble, puis livré par étapes.', 'We start with your workflows and the way your teams work to develop useful business tools for management, tracking, automation and data consolidation. We define the scope together and deliver in stages.'],
    items: [['Outils métier et interfaces de gestion', 'Automatisation des processus', 'Connexion aux systèmes existants', 'Évolution et maintenance applicative'], ['Business tools and management interfaces', 'Process automation', 'Integration with existing systems', 'Application maintenance and evolution']]
  },
  {
    slug: 'applications-mobiles', enSlug: 'mobile-apps', short: ['Mobile', 'Mobile'],
    title: ['Applications mobiles', 'Mobile applications'],
    intro: ['L’essentiel de votre service, à portée de main.', 'The heart of your service, within easy reach.'],
    description: ['Nous concevons des applications mobiles autour de parcours simples et des conditions réelles d’utilisation. Du prototype à la publication, les choix techniques se font selon votre public, vos fonctionnalités et votre budget.', 'We design mobile applications around simple journeys and real-world use. From prototype to release, technical choices follow your audience, features and budget.'],
    items: [['Conception des parcours et prototypes', 'Développement iOS et Android', 'API et synchronisation des données', 'Accompagnement à la publication'], ['User journeys and prototypes', 'iOS and Android development', 'APIs and data synchronisation', 'Release support']]
  },
  {
    slug: 'referencement-seo', enSlug: 'search-engine-optimisation', short: ['SEO', 'SEO'],
    title: ['Référencement naturel', 'Search engine optimisation'],
    intro: ['Être trouvé par les bonnes personnes, pour les bonnes raisons.', 'Be found by the right people, for the right reasons.'],
    description: ['Le référencement commence dans la structure du site. Nous travaillons l’indexabilité, la performance, l’organisation des pages et la pertinence des contenus pour rendre votre offre lisible par vos visiteurs et les moteurs de recherche.', 'Search visibility starts with your website structure. We work on crawlability, performance, page organisation and content relevance so your offer is clear to visitors and search engines.'],
    items: [['Audit technique et éditorial', 'Architecture et maillage interne', 'Référencement local et multilingue', 'Suivi et priorisation des améliorations'], ['Technical and content audits', 'Site architecture and internal linking', 'Local and multilingual SEO', 'Monitoring and prioritised improvements']]
  },
  {
    slug: 'integration-intelligence-artificielle', enSlug: 'ai-integration', short: ['Intelligence artificielle', 'Artificial intelligence'],
    title: ['Intégration IA', 'AI integration'],
    intro: ['L’intelligence artificielle là où elle apporte une utilité concrète.', 'Artificial intelligence where it makes a practical difference.'],
    description: ['Nous identifions les tâches pour lesquelles l’IA peut aider vos équipes, puis intégrons les solutions à vos outils. Les données utilisées, les coûts, la qualité des réponses et la supervision humaine font partie du cadrage dès le départ.', 'We identify tasks where AI can support your teams, then integrate solutions into your tools. Data handling, costs, response quality and human oversight are part of the project from the start.'],
    items: [['Étude des usages et preuve de concept', 'Assistants connectés à vos documents', 'Automatisation et enrichissement de données', 'Intégration API et évaluation des résultats'], ['Use-case assessment and proof of concept', 'Assistants connected to your documents', 'Automation and data enrichment', 'API integration and output evaluation']]
  },
  {
    slug: 'gouvernance-projet', enSlug: 'project-governance', short: ['Gouvernance', 'Governance'],
    title: ['Gouvernance de projet', 'Project governance'],
    intro: ['Un cap clair, des décisions éclairées, un projet qui avance.', 'A clear direction, informed decisions and steady progress.'],
    description: ['Nous relions les objectifs métier aux réalités techniques. Cadrage, feuille de route, coordination des intervenants et suivi des risques : chaque étape vous donne de la visibilité sur les priorités, les arbitrages et la livraison.', 'We connect business objectives with technical realities. Scoping, roadmaps, stakeholder coordination and risk monitoring give you visibility over priorities, decisions and delivery at every stage.'],
    items: [['Cadrage et feuille de route', 'Coordination métier et technique', 'Suivi des budgets, délais et risques', 'Recette et accompagnement au lancement'], ['Scoping and roadmaps', 'Business and technical coordination', 'Budget, schedule and risk monitoring', 'Acceptance testing and launch support']]
  }
];

// Project scope and outcomes have deliberately not been invented.
// The administrator can enrich these descriptions once confirmed.
export const initialProjects = [
  { slug: 'snv', title: 'SNV', url: 'https://www.snv-vetements-pro.fr/', image: '/media/snv.webp', category: 'web', position: 0, published: 1,
    subtitle_fr: 'Le savoir-faire professionnel, en ligne.', subtitle_en: 'Professional expertise, online.',
    sector_fr: 'Vêtements professionnels', sector_en: 'Professional workwear',
    description_fr: 'SNV conçoit et fabrique des vêtements professionnels pour les entreprises et les collectivités. Son site présente les collections par métier, les possibilités de personnalisation et la fabrication spéciale.',
    description_en: 'SNV designs and manufactures professional workwear for businesses and public organisations. Its website presents collections by industry, customisation options and bespoke manufacturing.' },
  { slug: 'maison-charlet', title: 'Maison Charlet', url: 'https://maisoncharlet.fr/', image: '/media/maison-charlet.webp', category: 'web', position: 1, published: 1,
    subtitle_fr: 'Une maison, un univers singulier.', subtitle_en: 'A distinctive brand and its world.',
    sector_fr: 'Mobilier sur mesure', sector_en: 'Bespoke furniture',
    description_fr: 'Maison Charlet crée du mobilier et des aménagements sur mesure dans ses ateliers du Nord de la France. Son site invite à découvrir les collections, les réalisations et le savoir-faire de la maison.',
    description_en: 'Maison Charlet creates bespoke furniture and interiors in its workshops in northern France. Its website introduces the collections, completed pieces and the craftsmanship behind the brand.' },
  { slug: 'junaki', title: 'Junaki', url: 'https://junaki.fr/', image: '/media/junaki.webp', category: 'web', position: 2, published: 1,
    subtitle_fr: 'Une expertise qui traverse les frontières.', subtitle_en: 'Expertise that crosses borders.',
    sector_fr: 'Conseil · Petcare', sector_en: 'Consulting · Petcare',
    description_fr: 'Junaki accompagne les marques du secteur animalier dans leur stratégie, le développement produit et le sourcing entre l’Europe et l’Asie. Le site présente cette offre de conseil à un public international.',
    description_en: 'Junaki supports petcare brands with strategy, product development and sourcing between Europe and Asia. The website presents its consulting services to an international audience.' }
];

export const copy = {
  fr: {
    nav: ['Expertises', 'Clients', 'Apps', 'L’agence'], contact: 'Parlons de votre projet', allProjects: 'Tous les clients', discover: 'Découvrir le projet',
    appsLabel: 'Les applications Thermidor', appsTitle: 'Des apps.<br>À portée de main.', appsIntro: 'Découvrez nos applications, leurs usages et leurs fonctionnalités.', appsEmpty: 'Nos applications seront bientôt présentées ici.', appDiscover: 'Découvrir l’app', appBack: 'Retour aux apps', appVisit: 'Ouvrir l’app', appContext: 'L’app en quelques mots', appSelection: 'Application Thermidor',
    eyebrow: 'Agence digitale indépendante · Lille, France & Europe',
    hero: 'Des idées claires.<br>Du digital <em>qui compte.</em>',
    intro: 'Nous concevons des sites, des logiciels et des applications utiles. Du premier échange à la mise en ligne, la même exigence : faire simple, juste et durable.',
    seeProjects: 'Découvrir nos clients', heroAside: 'La technique au service<br>de votre ambition.',
    selected: 'Une sélection de collaborations', projectsTitle: 'Des clients.<br>Des liens durables.',
    projectsIntro: 'Des univers différents. Une même attention portée à ce qui rend chaque projet singulier.',
    expertiseLabel: 'Ce que nous faisons', expertiseTitle: 'De la vision<br>à la réalisation.',
    expertiseIntro: 'Les bonnes compétences, au bon moment. Nous vous accompagnons sur l’ensemble de votre projet ou sur un besoin précis.',
    approachLabel: 'L’esprit Thermidor', approachTitle: 'La bonne technologie.<br>La relation en plus.',
    approachText: 'Nous aimons comprendre avant de construire. Votre métier, vos contraintes et vos ambitions donnent le cap. Ensuite, nous choisissons les outils et la méthode qui font avancer votre projet.',
    approachLink: 'Faire connaissance', method: ['Comprendre', 'Concevoir', 'Construire', 'Accompagner'],
    methodText: ['Échanger, poser les bonnes questions et définir les priorités.', 'Dessiner des parcours clairs et une solution adaptée.', 'Développer, tester et livrer par étapes concrètes.', 'Mettre en ligne, suivre et faire évoluer avec vous.'],
    contactLabel: 'Tout commence par une conversation', contactTitle: 'Et si on faisait<br><em>avancer votre idée ?</em>',
    contactText: 'Un projet en tête, une question technique ou simplement l’envie d’échanger ? Racontez-nous.',
    name: 'Votre nom', email: 'Votre email', company: 'Entreprise (facultatif)', need: 'Votre besoin', message: 'Parlez-nous de votre projet', send: 'Envoyer le message', choose: 'Sélectionner un sujet',
    privacyForm: 'Vos informations servent uniquement à traiter votre demande. Vous recevrez une copie par email.', privacy: 'Confidentialité', legal: 'Mentions légales', back: 'Retour aux clients', visit: 'Visiter le site',
    footer: 'Du sens dans les idées.<br>Du soin dans le digital.', rights: 'Tous droits réservés.', location: 'Lille · France · Europe',
    aboutTitle: 'Une vision d’ensemble.<br>Le soin du détail.', aboutIntro: 'Thermidor accompagne les entreprises, les indépendants et les agences dans leurs projets numériques. Du développement fullstack à la gouvernance, nous faisons le lien entre votre vision et sa réalisation.',
    leaderLabel: 'Le dirigeant', leaderRole: 'Dirigeant de Thermidor · Développeur fullstack senior',
    leaderIntro: 'Martin Rupp-Dahlem est un ingénieur ICAM. Il a travaillé dans de nombreux secteurs (défense, retail, assurances) et a également des activités d’enseignement en informatique à EFFICOM et à ESGI.',
    leaderText: 'Avec Thermidor, il met cette expérience au service de vos projets : comprendre vos besoins, éclairer les choix techniques et construire des solutions adaptées à votre activité.',
    leaderLink: 'Voir le profil LinkedIn', leaderPhotoAlt: 'Portrait de Martin Rupp-Dahlem, dirigeant de Thermidor',
    notFound: 'Cette page a pris un autre chemin.', home: 'Retour à l’accueil', included: 'Comment nous vous accompagnons', related: 'À découvrir aussi', menu: 'Ouvrir le menu', close: 'Fermer le menu',
    projectContext: 'Le projet en quelques mots', projectSelection: 'Collaboration client', serviceCta: 'Échangeons sur votre besoin',
  },
  en: {
    nav: ['Expertise', 'Clients', 'Apps', 'About'], contact: 'Let’s talk about your project', allProjects: 'All clients', discover: 'Explore the project',
    appsLabel: 'Thermidor applications', appsTitle: 'Useful apps.<br>At your fingertips.', appsIntro: 'Explore our applications, what they do and how to use them.', appsEmpty: 'Our applications will be featured here soon.', appDiscover: 'Explore the app', appBack: 'Back to apps', appVisit: 'Open the app', appContext: 'About the app', appSelection: 'Thermidor application',
    eyebrow: 'Independent digital agency · Lille, France & Europe',
    hero: 'Clear ideas.<br>Digital <em>that matters.</em>',
    intro: 'We build useful websites, software and applications. From our first conversation to launch, one shared ambition: make it simple, thoughtful and lasting.',
    seeProjects: 'Meet our clients', heroAside: 'Technology in service<br>of your ambition.',
    selected: 'Selected collaborations', projectsTitle: 'Our clients.<br>Lasting partnerships.',
    projectsIntro: 'Different worlds. The same attention to what makes each project distinctive.',
    expertiseLabel: 'What we do', expertiseTitle: 'From vision<br>to reality.',
    expertiseIntro: 'The right expertise, at the right time. We can support your entire project or help with a specific need.',
    approachLabel: 'The Thermidor approach', approachTitle: 'The right technology.<br>A closer partnership.',
    approachText: 'We believe in understanding before building. Your business, constraints and ambitions set the direction. Then we choose the tools and approach that move your project forward.',
    approachLink: 'Get to know us', method: ['Understand', 'Design', 'Build', 'Support'],
    methodText: ['Listen, ask the right questions and define priorities.', 'Shape clear user journeys and a fitting solution.', 'Develop, test and deliver in practical stages.', 'Launch, monitor and evolve together.'],
    contactLabel: 'It starts with a conversation', contactTitle: 'Let’s move<br><em>your idea forward.</em>',
    contactText: 'A project in mind, a technical question, or just a conversation? Tell us about it.',
    name: 'Your name', email: 'Your email', company: 'Company (optional)', need: 'What do you need?', message: 'Tell us about your project', send: 'Send message', choose: 'Select a topic',
    privacyForm: 'Your information is only used to handle your enquiry. You will receive a copy by email.', privacy: 'Privacy', legal: 'Legal notice', back: 'Back to clients', visit: 'Visit website',
    footer: 'Purpose in every idea.<br>Care in every detail.', rights: 'All rights reserved.', location: 'Lille · France · Europe',
    aboutTitle: 'The bigger picture.<br>Attention to detail.', aboutIntro: 'Thermidor supports businesses, independent professionals and agencies with their digital projects. From fullstack development to project governance, we connect your vision with its implementation.',
    leaderLabel: 'Meet the director', leaderRole: 'Director of Thermidor · Senior fullstack developer',
    leaderIntro: 'Martin Rupp-Dahlem is an ICAM-trained engineer. He has worked across a range of sectors (defence, retail and insurance) and also teaches computer science at EFFICOM and ESGI.',
    leaderText: 'At Thermidor, he brings this experience to your projects: understanding your needs, explaining technical choices and building solutions that fit your business.',
    leaderLink: 'View LinkedIn profile', leaderPhotoAlt: 'Portrait of Martin Rupp-Dahlem, director of Thermidor',
    notFound: 'This page has taken another path.', home: 'Back to home', included: 'How we can help', related: 'You may also be interested in', menu: 'Open menu', close: 'Close menu',
    projectContext: 'About the project', projectSelection: 'Client collaboration', serviceCta: 'Let’s discuss your needs',
  }
};

export const paths = {
  fr: { home: '/', services: '/expertises', projects: '/clients', apps: '/apps', about: '/agence', contact: '/contact', privacy: '/confidentialite', legal: '/mentions-legales' },
  en: { home: '/en', services: '/en/expertise', projects: '/en/clients', apps: '/en/apps', about: '/en/about', contact: '/en/contact', privacy: '/en/privacy', legal: '/en/legal' }
};
