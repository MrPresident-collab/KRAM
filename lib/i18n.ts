export const locales = ["fr", "en", "pt"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

// The three locale objects intentionally share a flexible shape while the product copy evolves.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const copy: Record<Locale, any> = {
  fr: {
    nav: {
      overview: "Vue d’ensemble", operations: "Opérations", workOrders: "Ordres de travail",
      inspections: "Inspections", projects: "Projets", maintenance: "Maintenance",
      assets: "Actifs", allAssets: "Tous les actifs", properties: "Propriétés",
      construction: "Construction", commercial: "Commercial", clients: "Clients",
      network: "Réseau", providers: "Prestataires", finance: "Finance",
      expenses: "Dépenses", approvals: "Approbations", documents: "Documents",
      reports: "Rapports", system: "Système", activity: "Activité",
      usersRoles: "Utilisateurs & rôles", settings: "Paramètres"
    },
    dashboard: {
      eyebrow: "Centre de contrôle", title: "Vue d’ensemble",
      description: "Surveillez les actifs, les opérations et les décisions qui nécessitent votre attention.",
      clients: "Clients", assets: "Actifs", openWorkOrders: "Ordres de travail ouverts",
      awaitingApproval: "En attente d’approbation", activeOperations: "Opérations actives",
      needsAttention: "Nécessite votre attention", approval: "approbation client en attente",
      overdue: "inspection en retard", verification: "dépense à vérifier",
      recentActivity: "Activité récente", operationsSnapshot: "État des opérations",
      launchNote: "La fondation KRAM est prête. Les données opérationnelles seront connectées à Supabase dans la prochaine étape."
    },
    common: { search: "Rechercher", notifications: "Notifications", today: "Aujourd’hui", cancel: "Annuler", save: "Enregistrer", create: "Créer", back: "Retour", signOut: "Se déconnecter" },
    settings: {
      title: "Paramètres du système", description: "Configurez la structure géographique et les contrôles d’accès de KRAM.",
      countries: "Pays", countriesDesc: "Gérez les pays dans lesquels KRAM opère.",
      branches: "Agences", branchesDesc: "Gérez les agences, villes et zones opérationnelles.",
      access: "Accès & rôles", accessDesc: "Contrôlez les rôles et la portée géographique des utilisateurs.",
      comingSoon: "Cette section sera disponible prochainement.", noCountries: "Aucun pays configuré.",
      branchCreate: "Créer une agence", branchName: "Nom de l’agence", branchCode: "Code de l’agence",
      city: "Ville", region: "Région", country: "Pays", createBranch: "Créer l’agence",
      branchHint: "Un code court et unique au sein de KRAM."
    },
    users: {
      title: "Utilisateurs & rôles", description: "Gérez les accès internes, les rôles et la portée opérationnelle.",
      staff: "Personnel", staffDesc: "Utilisateurs internes autorisés à accéder à KRAM Ops.",
      roles: "Rôles", rolesDesc: "Définissez les responsabilités et niveaux d’accès.",
      scope: "Portée géographique", scopeDesc: "Limitez l’accès à l’échelle globale, nationale ou d’agence."
    },
    auth: { signIn: "Se connecter", email: "Adresse e-mail", password: "Mot de passe", signInAction: "Accéder à KRAM Ops", signingIn: "Connexion...", invalid: "E-mail ou mot de passe incorrect.", subtitle: "Accédez à votre centre de contrôle KRAM." },
    clients: {
      title: "Clients", description: "Gérez les propriétaires et contacts liés aux actifs KRAM.",
      newClient: "Nouveau client", search: "Rechercher un client", records: "clients",
      name: "Nom", contact: "E-mail", phone: "Téléphone", created: "Créé le",
      loadError: "Impossible de charger les clients.", emptyTitle: "Aucun client",
      emptyDescription: "Commencez par enregistrer un propriétaire ou un contact pour son actif.",
      createFirst: "Créer le premier client", formTitle: "Créer un client",
      formDescription: "Ajoutez les coordonnées de base du client.", fullName: "Nom complet",
      email: "Adresse e-mail", notes: "Notes", createSuccess: "Client créé avec succès."
    },
    assets: {
      title: "Tous les actifs", description: "Registre central des propriétés, projets et autres actifs suivis par KRAM.",
      newAsset: "Nouvel actif", search: "Rechercher un actif", records: "actifs",
      asset: "Actif", type: "Type", location: "Emplacement", owner: "Propriétaire", status: "Statut",
      loadError: "Impossible de charger les actifs.", emptyTitle: "Aucun actif",
      emptyDescription: "Créez un actif pour commencer à suivre son état, ses opérations et son historique.",
      createFirst: "Créer le premier actif", formTitle: "Créer un actif",
      formDescription: "Enregistrez les informations essentielles de l’actif.",
      name: "Nom de l’actif", reference: "Code de référence", country: "Pays", city: "Ville",
      address: "Adresse", descriptionField: "Description", client: "Client / propriétaire",
      typeResidential: "Résidentiel", typeCommercial: "Commercial", typeConstruction: "Construction",
      typeRetail: "Commerce", typeWarehouse: "Entrepôt", typeLand: "Terrain",
      typeHospitality: "Hôtellerie", typeOther: "Autre"
    },
    workOrders: { formTitle: "Nouvel ordre de travail", formDescription: "Créez une demande opérationnelle reliée à un actif.", title: "Titre", category: "Catégorie", priority: "Priorité", description: "Description", estimatedCost: "Coût estimé", approval: "Approbation client", asset: "Actif", create: "Créer l’ordre" },
    inspections: { formTitle: "Nouvelle inspection", formDescription: "Planifiez une visite terrain et initialisez sa checklist.", type: "Type d’inspection", scheduled: "Planifiée le", inspector: "Inspecteur", phone: "Téléphone", summary: "Résumé", recommendations: "Recommandations", create: "Créer l’inspection" },
    projects: { formTitle: "Nouveau projet", formDescription: "Suivez un projet de construction, rénovation ou maintenance.", name: "Nom du projet", type: "Type de projet", asset: "Actif", status: "Statut", budget: "Budget", start: "Date de début", end: "Date cible", description: "Description", create: "Créer le projet" }
  },
  en: {
    nav: {
      overview: "Overview", operations: "Operations", workOrders: "Work Orders",
      inspections: "Inspections", projects: "Projects", maintenance: "Maintenance",
      assets: "Assets", allAssets: "All Assets", properties: "Properties",
      construction: "Construction", commercial: "Commercial", clients: "Clients",
      network: "Network", providers: "Service Providers", finance: "Finance",
      expenses: "Expenses", approvals: "Approvals", documents: "Documents",
      reports: "Reports", system: "System", activity: "Activity",
      usersRoles: "Users & Roles", settings: "Settings"
    },
    dashboard: {
      eyebrow: "Control center", title: "Overview",
      description: "Monitor assets, operations and decisions that require your attention.",
      clients: "Clients", assets: "Assets", openWorkOrders: "Open Work Orders",
      awaitingApproval: "Awaiting Approval", activeOperations: "Active Operations",
      needsAttention: "Needs your attention", approval: "client approval pending",
      overdue: "inspection overdue", verification: "expense needs verification",
      recentActivity: "Recent Activity", operationsSnapshot: "Operations snapshot",
      launchNote: "The KRAM foundation is ready. Operational data will be connected to Supabase in the next step."
    },
    common: { search: "Search", notifications: "Notifications", today: "Today", cancel: "Cancel", save: "Save", create: "Create", back: "Back", signOut: "Sign out" },
    settings: {
      title: "System settings", description: "Configure KRAM's geographic structure and access controls.",
      countries: "Countries", countriesDesc: "Manage the countries where KRAM operates.",
      branches: "Branches", branchesDesc: "Manage branches, cities and operational areas.",
      access: "Access & roles", accessDesc: "Control user roles and geographic scope.",
      comingSoon: "This section will be available soon.", noCountries: "No countries configured.",
      branchCreate: "Create branch", branchName: "Branch name", branchCode: "Branch code",
      city: "City", region: "Region", country: "Country", createBranch: "Create branch",
      branchHint: "A short, unique code within KRAM."
    },
    users: {
      title: "Users & roles", description: "Manage internal access, roles and operational scope.",
      staff: "Staff", staffDesc: "Internal users authorized to access KRAM Ops.",
      roles: "Roles", rolesDesc: "Define responsibilities and access levels.",
      scope: "Geographic scope", scopeDesc: "Limit access at global, country or branch level."
    },
    auth: { signIn: "Sign in", email: "Email address", password: "Password", signInAction: "Enter KRAM Ops", signingIn: "Signing in...", invalid: "Incorrect email or password.", subtitle: "Access your KRAM control center." },
    clients: {
      title: "Clients", description: "Manage owners and contacts connected to KRAM assets.",
      newClient: "New client", search: "Search clients", records: "clients", name: "Name",
      contact: "Email", phone: "Phone", created: "Created", loadError: "Unable to load clients.",
      emptyTitle: "No clients yet", emptyDescription: "Start by registering an owner or contact for an asset.",
      createFirst: "Create first client", formTitle: "Create client",
      formDescription: "Add the client's basic contact details.", fullName: "Full name",
      email: "Email address", notes: "Notes", createSuccess: "Client created successfully."
    },
    assets: {
      title: "All Assets", description: "Central registry for properties, projects and other assets tracked by KRAM.",
      newAsset: "New asset", search: "Search assets", records: "assets", asset: "Asset", type: "Type",
      location: "Location", owner: "Owner", status: "Status", loadError: "Unable to load assets.",
      emptyTitle: "No assets yet", emptyDescription: "Create an asset to begin tracking its condition, operations and history.",
      createFirst: "Create first asset", formTitle: "Create asset",
      formDescription: "Record the essential information for the asset.", name: "Asset name",
      reference: "Reference code", country: "Country", city: "City", address: "Address",
      descriptionField: "Description", client: "Client / owner", typeResidential: "Residential",
      typeCommercial: "Commercial", typeConstruction: "Construction", typeRetail: "Retail",
      typeWarehouse: "Warehouse", typeLand: "Land", typeHospitality: "Hospitality", typeOther: "Other"
    },
    workOrders: { formTitle: "New work order", formDescription: "Create an operational request linked to an asset.", title: "Title", category: "Category", priority: "Priority", description: "Description", estimatedCost: "Estimated cost", approval: "Client approval", asset: "Asset", create: "Create work order" },
    inspections: { formTitle: "New inspection", formDescription: "Schedule a field visit and initialize its checklist.", type: "Inspection type", scheduled: "Scheduled for", inspector: "Inspector", phone: "Phone", summary: "Summary", recommendations: "Recommendations", create: "Create inspection" },
    projects: { formTitle: "New project", formDescription: "Track a construction, renovation or maintenance project.", name: "Project name", type: "Project type", asset: "Asset", status: "Status", budget: "Budget", start: "Start date", end: "Target end", description: "Description", create: "Create project" }
  },
  pt: {
    nav: {
      overview: "Visão geral", operations: "Operações", workOrders: "Ordens de trabalho",
      inspections: "Inspeções", projects: "Projetos", maintenance: "Manutenção",
      assets: "Ativos", allAssets: "Todos os ativos", properties: "Propriedades",
      construction: "Construção", commercial: "Comercial", clients: "Clientes",
      network: "Rede", providers: "Prestadores", finance: "Finanças",
      expenses: "Despesas", approvals: "Aprovações", documents: "Documentos",
      reports: "Relatórios", system: "Sistema", activity: "Atividade",
      usersRoles: "Utilizadores e funções", settings: "Definições"
    },
    dashboard: {
      eyebrow: "Centro de controlo", title: "Visão geral",
      description: "Acompanhe ativos, operações e decisões que precisam da sua atenção.",
      clients: "Clientes", assets: "Ativos", openWorkOrders: "Ordens de trabalho abertas",
      awaitingApproval: "Aguardando aprovação", activeOperations: "Operações ativas",
      needsAttention: "Requer atenção", approval: "aprovação do cliente pendente",
      overdue: "inspeção atrasada", verification: "despesa a verificar",
      recentActivity: "Atividade recente", operationsSnapshot: "Estado das operações",
      launchNote: "A fundação do KRAM está pronta. Os dados operacionais serão ligados ao Supabase na próxima etapa."
    },
    common: { search: "Pesquisar", notifications: "Notificações", today: "Hoje", cancel: "Cancelar", save: "Guardar", create: "Criar", back: "Voltar", signOut: "Terminar sessão" },
    settings: {
      title: "Definições do sistema", description: "Configure a estrutura geográfica e os controlos de acesso da KRAM.",
      countries: "Países", countriesDesc: "Gira os países onde a KRAM opera.",
      branches: "Filiais", branchesDesc: "Gira filiais, cidades e áreas operacionais.",
      access: "Acesso e funções", accessDesc: "Controle as funções e o âmbito geográfico dos utilizadores.",
      comingSoon: "Esta secção estará disponível em breve.", noCountries: "Ainda não há países configurados.",
      branchCreate: "Criar filial", branchName: "Nome da filial", branchCode: "Código da filial",
      city: "Cidade", region: "Região", country: "País", createBranch: "Criar filial",
      branchHint: "Um código curto e único dentro da KRAM."
    },
    users: {
      title: "Utilizadores e funções", description: "Gira acessos internos, funções e âmbito operacional.",
      staff: "Pessoal", staffDesc: "Utilizadores internos autorizados a aceder ao KRAM Ops.",
      roles: "Funções", rolesDesc: "Defina responsabilidades e níveis de acesso.",
      scope: "Âmbito geográfico", scopeDesc: "Limite o acesso ao nível global, nacional ou de filial."
    },
    auth: { signIn: "Iniciar sessão", email: "Endereço de e-mail", password: "Palavra-passe", signInAction: "Entrar no KRAM Ops", signingIn: "A entrar...", invalid: "E-mail ou palavra-passe incorretos.", subtitle: "Aceda ao seu centro de controlo KRAM." },
    clients: {
      title: "Clientes", description: "Gira proprietários e contactos ligados aos ativos KRAM.",
      newClient: "Novo cliente", search: "Pesquisar clientes", records: "clientes", name: "Nome",
      contact: "E-mail", phone: "Telefone", created: "Criado em", loadError: "Não foi possível carregar os clientes.",
      emptyTitle: "Ainda não há clientes", emptyDescription: "Comece por registar um proprietário ou contacto de um ativo.",
      createFirst: "Criar primeiro cliente", formTitle: "Criar cliente",
      formDescription: "Adicione os dados básicos de contacto do cliente.", fullName: "Nome completo",
      email: "Endereço de e-mail", notes: "Notas", createSuccess: "Cliente criado com sucesso."
    },
    assets: {
      title: "Todos os ativos", description: "Registo central de propriedades, projetos e outros ativos acompanhados pela KRAM.",
      newAsset: "Novo ativo", search: "Pesquisar ativos", records: "ativos", asset: "Ativo", type: "Tipo",
      location: "Localização", owner: "Proprietário", status: "Estado", loadError: "Não foi possível carregar os ativos.",
      emptyTitle: "Ainda não há ativos", emptyDescription: "Crie um ativo para começar a acompanhar o seu estado, operações e histórico.",
      createFirst: "Criar primeiro ativo", formTitle: "Criar ativo",
      formDescription: "Registe as informações essenciais do ativo.", name: "Nome do ativo",
      reference: "Código de referência", country: "País", city: "Cidade", address: "Morada",
      descriptionField: "Descrição", client: "Cliente / proprietário", typeResidential: "Residencial",
      typeCommercial: "Comercial", typeConstruction: "Construção", typeRetail: "Comércio",
      typeWarehouse: "Armazém", typeLand: "Terreno", typeHospitality: "Hotelaria", typeOther: "Outro"
    },
    workOrders: { formTitle: "Nova ordem de trabalho", formDescription: "Crie um pedido operacional ligado a um ativo.", title: "Título", category: "Categoria", priority: "Prioridade", description: "Descrição", estimatedCost: "Custo estimado", approval: "Aprovação do cliente", asset: "Ativo", create: "Criar ordem" },
    inspections: { formTitle: "Nova inspeção", formDescription: "Agende uma visita no terreno e inicialize a checklist.", type: "Tipo de inspeção", scheduled: "Agendada para", inspector: "Inspetor", phone: "Telefone", summary: "Resumo", recommendations: "Recomendações", create: "Criar inspeção" },
    projects: { formTitle: "Novo projeto", formDescription: "Acompanhe um projeto de construção, renovação ou manutenção.", name: "Nome do projeto", type: "Tipo de projeto", asset: "Ativo", status: "Estado", budget: "Orçamento", start: "Data de início", end: "Fim previsto", description: "Descrição", create: "Criar projeto" }
  }
} as const;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}


export const opsUi = {
  fr: {
    header: {
      searchPlaceholder: "Rechercher dans KRAM…", notifications: "Notifications", activeNotifications: "Notifications actives",
      noNewActivity: "Aucune nouvelle activité", nothingAttention: "Rien ne nécessite votre attention pour le moment.",
      openNavigation: "Ouvrir la navigation", toggleSidebar: "Basculer la barre latérale",
      searchHint: "Rechercher des actifs, clients, ordres de travail, projets, inspections, prestataires, rapports ou documents.",
      noResults: "Aucun enregistrement KRAM correspondant.", searchRecords: "Rechercher dans les opérations KRAM…"
    },
    activity: {
      eyebrow: "Système", title: "Activité", description: "Journal chronologique des changements opérationnels dans KRAM.",
      events: "Événements", today: "Aujourd’hui", eventTypes: "Types d’événements", empty: "Aucune activité enregistrée.",
      emptyDesc: "Les nouvelles actions opérationnelles apparaîtront automatiquement ici.", user: "Utilisateur KRAM"
    },
    approvals: {
      eyebrow: "Finance", title: "Approbations", description: "Examinez les coûts opérationnels et autres demandes dans votre périmètre autorisé.",
      pending: "En attente", decided: "Approuvées / traitées", total: "Demandes totales",
      pendingTitle: "Approbations en attente", pendingDesc: "Demandes nécessitant une décision opérationnelle.",
      review: "Examiner", request: "Demande d’approbation", operationalCost: "Coût opérationnel",
      decisionHistory: "Historique des décisions", noPending: "Aucune approbation n’attend de révision.",
      noDecisions: "Aucune décision d’approbation enregistrée.", approved: "Approuvée", rejected: "Rejetée",
      noDecisionDate: "Aucune date de décision"
    },
    expensesPage: {
      eyebrow: "Finance", title: "Dépenses", description: "Suivez les coûts opérationnels de la demande à la vérification.",
      newExpense: "Nouvelle dépense", totalRecorded: "Total enregistré", requested: "Demandées", approved: "Approuvées", paid: "Payées",
      register: "Registre des dépenses", noAsset: "Aucun actif", noWorkOrder: "Aucun ordre de travail",
      empty: "Aucune dépense", emptyDesc: "Les coûts opérationnels apparaîtront ici."
    },
    reportsPage: {
      eyebrow: "Documents", title: "Rapports", description: "Rapports opérationnels et documents prêts à être transmis aux clients.",
      newReport: "Nouveau rapport", total: "Total des rapports", draftReview: "Brouillons / révision",
      publishedSent: "Publiés / envoyés", register: "Registre des rapports", noAsset: "Aucun actif", empty: "Aucun rapport",
      emptyDesc: "Les rapports apparaîtront ici au fur et à mesure que les opérations KRAM sont documentées."
    },
    usersPage: {
      scopeTitle: "Portée", staffAccounts: "Comptes du personnel", administrators: "Administrateurs", countries: "Pays utilisés",
      function: "Fonction", role: "Rôle KRAM", staff: "Personnel", unknown: "Utilisateur inconnu",
      accessMissing: "L’accès KRAM n’est pas configuré", accessMissingDesc: "Votre compte est authentifié, mais n’est affecté à aucune organisation KRAM.",
      noStaff: "Aucun compte du personnel n’a encore été configuré.", manage: "Gérer les accès",
      staffDescription: "Gérez l’identité du personnel KRAM, le rôle d’autorisation et la portée géographique."
    },
    workOrdersPage: {
      eyebrow: "Opérations", title: "Ordres de travail", description: "Contrôlez les demandes, interventions et travaux terrain dans le réseau KRAM.",
      new: "Nouvel ordre de travail", open: "Ouverts", pending: "En attente", inProgress: "En cours",
      activeRequests: "Demandes actives", awaitingAction: "En attente d’action", activeInterventions: "Interventions actives",
      queue: "File opérationnelle", queueDesc: "Chaque intervention reste rattachée à un actif.",
      empty: "Aucun ordre de travail", emptyDesc: "Créez la première demande opérationnelle pour la voir apparaître ici.",
      create: "Créer un ordre de travail"
    },
    communications: {
      eyebrow: "Communication", title: "Conversations clients",
      description: "Centralisez les échanges clients, le contexte opérationnel et les notes internes sans transformer KRAM en messagerie d’équipe générique.",
      search: "Rechercher des conversations", select: "Sélectionnez une conversation",
      selectDesc: "Choisissez une conversation à gauche pour afficher son historique et répondre.",
      general: "Communication générale", client: "Client", internal: "Interne", clientVisible: "Visible par le client",
      send: "Envoyer", messagePlaceholder: "Écrire un message…", internalNote: "Note interne",
      clientMessage: "Message client", communicationSeparation: "La communication client est conservée séparément de l’activité d’audit interne.",
      noConversations: "Aucune conversation pour le moment.", newConversation: "Nouvelle conversation"
    },
    commonOps: {
      noData: "Aucune donnée", review: "Examiner", status: "Statut", priority: "Priorité", created: "Créé", requested: "Demandé le",
      noDate: "Sans date", yes: "Oui", no: "Non"
    }
  },
  en: {
    header: {
      searchPlaceholder: "Search KRAM…", notifications: "Notifications", activeNotifications: "Active notifications",
      noNewActivity: "No new activity", nothingAttention: "Nothing requires attention right now.",
      openNavigation: "Open navigation", toggleSidebar: "Toggle sidebar",
      searchHint: "Search assets, clients, work orders, projects, inspections, providers, reports or documents.",
      noResults: "No matching KRAM records.", searchRecords: "Search KRAM operations…"
    },
    activity: {
      eyebrow: "System", title: "Activity", description: "A chronological audit trail of operational changes across KRAM.",
      events: "Events", today: "Today", eventTypes: "Event types", empty: "No activity recorded yet.",
      emptyDesc: "New operational actions will appear here automatically.", user: "KRAM user"
    },
    approvals: {
      eyebrow: "Finance", title: "Approvals", description: "Review operational costs and other approval requests within your authorized scope.",
      pending: "Pending", decided: "Approved / decided", total: "Total requests",
      pendingTitle: "Pending approvals", pendingDesc: "Requests requiring an operational decision.",
      review: "Review", request: "Approval request", operationalCost: "Operational cost",
      decisionHistory: "Decision history", noPending: "No approvals are waiting for review.",
      noDecisions: "No approval decisions recorded yet.", approved: "Approved", rejected: "Rejected",
      noDecisionDate: "No decision date"
    },
    expensesPage: {
      eyebrow: "Finance", title: "Expenses", description: "Track operational costs from request through verification.",
      newExpense: "New expense", totalRecorded: "Total recorded", requested: "Requested", approved: "Approved", paid: "Paid",
      register: "Expense register", noAsset: "No asset", noWorkOrder: "No work order",
      empty: "No expenses yet", emptyDesc: "Operational costs will appear here."
    },
    reportsPage: {
      eyebrow: "Documents", title: "Reports", description: "Operational reports and client-ready records generated from KRAM activity.",
      newReport: "New report", total: "Total reports", draftReview: "Draft / review",
      publishedSent: "Published / sent", register: "Report register", noAsset: "No asset", empty: "No reports yet",
      emptyDesc: "Reports will appear here as KRAM operations are documented."
    },
    usersPage: {
      scopeTitle: "Scope", staffAccounts: "Staff accounts", administrators: "Administrators", countries: "Countries in use",
      function: "Function", role: "KRAM role", staff: "Staff", unknown: "Unknown user",
      accessMissing: "KRAM access is not configured", accessMissingDesc: "Your account is authenticated, but it is not assigned to a KRAM organization.",
      noStaff: "No staff accounts have been configured yet.", manage: "Manage access",
      staffDescription: "Manage KRAM staff identity, authorization role and geographic scope."
    },
    workOrdersPage: {
      eyebrow: "Operations", title: "Work Orders", description: "Control requests, interventions and field work across the KRAM network.",
      new: "New work order", open: "Open", pending: "Pending", inProgress: "In progress",
      activeRequests: "Active requests", awaitingAction: "Awaiting action", activeInterventions: "Active interventions",
      queue: "Operations queue", queueDesc: "Every intervention stays attached to an asset.",
      empty: "No work orders yet", emptyDesc: "Create the first operational request and it will appear here.",
      create: "Create work order"
    },
    communications: {
      eyebrow: "Communication", title: "Client conversations",
      description: "Keep client communication, operational context and internal notes together without turning KRAM into a generic team chat.",
      search: "Search conversations", select: "Select a conversation",
      selectDesc: "Choose a client conversation from the left to view its history and reply.",
      general: "General communication", client: "Client", internal: "Internal", clientVisible: "Client-visible",
      send: "Send", messagePlaceholder: "Write a message…", internalNote: "Internal note",
      clientMessage: "Client message", communicationSeparation: "Client communication is kept separate from internal audit activity.",
      noConversations: "No conversations yet.", newConversation: "New conversation"
    },
    commonOps: {
      noData: "No data", review: "Review", status: "Status", priority: "Priority", created: "Created", requested: "Requested",
      noDate: "No date", yes: "Yes", no: "No"
    }
  },
  pt: {
    header: {
      searchPlaceholder: "Pesquisar no KRAM…", notifications: "Notificações", activeNotifications: "Notificações ativas",
      noNewActivity: "Nenhuma atividade nova", nothingAttention: "Nada requer a sua atenção neste momento.",
      openNavigation: "Abrir navegação", toggleSidebar: "Alternar barra lateral",
      searchHint: "Pesquisar ativos, clientes, ordens de trabalho, projetos, inspeções, prestadores, relatórios ou documentos.",
      noResults: "Nenhum registo KRAM correspondente.", searchRecords: "Pesquisar nas operações KRAM…"
    },
    activity: {
      eyebrow: "Sistema", title: "Atividade", description: "Registo cronológico das alterações operacionais no KRAM.",
      events: "Eventos", today: "Hoje", eventTypes: "Tipos de evento", empty: "Ainda não há atividade registada.",
      emptyDesc: "As novas ações operacionais aparecerão aqui automaticamente.", user: "Utilizador KRAM"
    },
    approvals: {
      eyebrow: "Finanças", title: "Aprovações", description: "Analise custos operacionais e outros pedidos dentro do seu âmbito autorizado.",
      pending: "Pendentes", decided: "Aprovadas / decididas", total: "Pedidos totais",
      pendingTitle: "Aprovações pendentes", pendingDesc: "Pedidos que requerem uma decisão operacional.",
      review: "Analisar", request: "Pedido de aprovação", operationalCost: "Custo operacional",
      decisionHistory: "Histórico de decisões", noPending: "Não há aprovações a aguardar análise.",
      noDecisions: "Ainda não há decisões de aprovação registadas.", approved: "Aprovada", rejected: "Rejeitada",
      noDecisionDate: "Sem data de decisão"
    },
    expensesPage: {
      eyebrow: "Finanças", title: "Despesas", description: "Acompanhe custos operacionais desde o pedido até à verificação.",
      newExpense: "Nova despesa", totalRecorded: "Total registado", requested: "Solicitadas", approved: "Aprovadas", paid: "Pagas",
      register: "Registo de despesas", noAsset: "Sem ativo", noWorkOrder: "Sem ordem de trabalho",
      empty: "Ainda não há despesas", emptyDesc: "Os custos operacionais aparecerão aqui."
    },
    reportsPage: {
      eyebrow: "Documentos", title: "Relatórios", description: "Relatórios operacionais e registos prontos para o cliente gerados pela atividade do KRAM.",
      newReport: "Novo relatório", total: "Total de relatórios", draftReview: "Rascunho / revisão",
      publishedSent: "Publicados / enviados", register: "Registo de relatórios", noAsset: "Sem ativo", empty: "Ainda não há relatórios",
      emptyDesc: "Os relatórios aparecerão aqui à medida que as operações KRAM forem documentadas."
    },
    usersPage: {
      scopeTitle: "Âmbito", staffAccounts: "Contas do pessoal", administrators: "Administradores", countries: "Países em uso",
      function: "Função", role: "Função KRAM", staff: "Pessoal", unknown: "Utilizador desconhecido",
      accessMissing: "O acesso KRAM não está configurado", accessMissingDesc: "A sua conta está autenticada, mas não está atribuída a uma organização KRAM.",
      noStaff: "Ainda não foram configuradas contas do pessoal.", manage: "Gerir acessos",
      staffDescription: "Gira a identidade do pessoal KRAM, a função de autorização e o âmbito geográfico."
    },
    workOrdersPage: {
      eyebrow: "Operações", title: "Ordens de trabalho", description: "Controle pedidos, intervenções e trabalhos no terreno em toda a rede KRAM.",
      new: "Nova ordem de trabalho", open: "Abertas", pending: "Pendentes", inProgress: "Em curso",
      activeRequests: "Pedidos ativos", awaitingAction: "A aguardar ação", activeInterventions: "Intervenções ativas",
      queue: "Fila de operações", queueDesc: "Cada intervenção permanece ligada a um ativo.",
      empty: "Ainda não há ordens de trabalho", emptyDesc: "Crie o primeiro pedido operacional para o ver aqui.",
      create: "Criar ordem de trabalho"
    },
    communications: {
      eyebrow: "Comunicação", title: "Conversas com clientes",
      description: "Mantenha a comunicação com o cliente, o contexto operacional e as notas internas juntos sem transformar o KRAM numa aplicação de chat genérica.",
      search: "Pesquisar conversas", select: "Selecione uma conversa",
      selectDesc: "Escolha uma conversa à esquerda para ver o histórico e responder.",
      general: "Comunicação geral", client: "Cliente", internal: "Interno", clientVisible: "Visível para o cliente",
      send: "Enviar", messagePlaceholder: "Escrever uma mensagem…", internalNote: "Nota interna",
      clientMessage: "Mensagem do cliente", communicationSeparation: "A comunicação com o cliente é mantida separada da atividade de auditoria interna.",
      noConversations: "Ainda não há conversas.", newConversation: "Nova conversa"
    },
    commonOps: {
      noData: "Sem dados", review: "Analisar", status: "Estado", priority: "Prioridade", created: "Criado", requested: "Solicitado",
      noDate: "Sem data", yes: "Sim", no: "Não"
    }
  }
} as const;

export function getOpsUi(locale: Locale) {
  return opsUi[locale];
}
