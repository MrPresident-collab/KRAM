export const locales = ["fr", "en", "pt"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const copy = {
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
    common: { search: "Rechercher", notifications: "Notifications", today: "Aujourd’hui", cancel: "Annuler", save: "Enregistrer", create: "Créer", back: "Retour" },
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
    }
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
    common: { search: "Search", notifications: "Notifications", today: "Today", cancel: "Cancel", save: "Save", create: "Create", back: "Back" },
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
    }
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
    common: { search: "Pesquisar", notifications: "Notificações", today: "Hoje", cancel: "Cancelar", save: "Guardar", create: "Criar", back: "Voltar" },
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
    }
  }
} as const;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
