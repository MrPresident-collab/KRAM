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
