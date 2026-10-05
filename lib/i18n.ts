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
    ui: { system: "Système", activity: "Activité", activityDescription: "Journal chronologique des changements opérationnels dans KRAM.", events: "Événements", today: "Aujourd’hui", eventTypes: "Types d’événements", noActivity: "Aucune activité enregistrée.", newActions: "Les nouvelles actions opérationnelles apparaîtront ici automatiquement.", finance: "Finance", approvals: "Approbations", approvalsDescription: "Examinez les coûts et demandes d’approbation dans votre périmètre autorisé.", pendingApprovals: "Approbations en attente", approvalDescription: "Demandes nécessitant une décision opérationnelle.", decisionHistory: "Historique des décisions", noApprovals: "Aucune approbation en attente.", noDecisions: "Aucune décision d’approbation enregistrée.", review: "Examiner", requested: "Demandée", approved: "Approuvée", paid: "Payée", totalRecorded: "Total enregistré", expenseRegister: "Registre des dépenses", expenses: "Dépenses", expensesDescription: "Suivez les coûts opérationnels de la demande à la vérification.", newExpense: "Nouvelle dépense", noExpenses: "Aucune dépense", operationalCosts: "Les coûts opérationnels apparaîtront ici.", noAsset: "Aucun actif", noWorkOrder: "Aucun ordre de travail", documents: "Documents", documentLibrary: "Bibliothèque de documents", documentsDescription: "Preuves privées et fichiers opérationnels liés aux dossiers KRAM.", searchDocuments: "Rechercher par nom de fichier...", document: "Document", type: "Type", added: "Ajouté", general: "Général", noDocuments: "Aucun document trouvé.", open: "Ouvrir", record: "Dossier", created: "Créé", openWorkOrders: "Ordres de travail ouverts", activeInspections: "Inspections actives", activeProjects: "Projets actifs", recordedExpenses: "Dépenses enregistrées", recentOperations: "Opérations récentes", latestWork: "Derniers travaux liés à cet actif.", workOrder: "Ordre de travail", inspection: "Inspection", notScheduled: "Non planifiée", complete: "terminé", noOperationalRecords: "Aucun dossier opérationnel.", financialRecords: "Dossiers financiers et documentaires", recentRecords: "dossiers récents", reports: "Rapports", noDescription: "Aucune description enregistrée pour cet actif.", coordinates: "Coordonnées", noCoordinates: "Aucune coordonnée enregistrée.", quickActions: "Actions rapides", startProject: "Démarrer un projet", recordExpense: "Enregistrer une dépense", createReport: "Créer un rapport", schedule: "Planning", progress: "Progression", projectOverview: "Vue du projet", noProjectDescription: "Aucune description de projet enregistrée.", milestones: "Jalons", noMilestones: "Aucun jalon enregistré.", projectEvidence: "Preuves du projet", projectEvidenceDescription: "Documents liés à ce projet.", noProjectEvidence: "Aucune preuve de projet enregistrée.", projectUpdates: "Mises à jour du projet", noProjectUpdates: "Aucune mise à jour enregistrée.", recordProgress: "Enregistrer la progression", fieldUpdate: "Documentez la dernière mise à jour terrain.", project: "Projet", noDecisionDate: "Aucune date de décision", serviceProviders: "Prestataires de services", fieldNetwork: "Réseau terrain", noProviders: "Aucun prestataire", providerDescription: "Le réseau terrain de KRAM apparaîtra ici.", coverageNotRecorded: "Couverture non renseignée", noPhone: "Aucun téléphone", active: "Actifs", remoteAssetManagement: "Gestion d’actifs à distance", allSystemsOperational: "Tous les systèmes sont opérationnels", workspace: "Espace de travail", globalWorkspace: "KRAM Global", opsDesk: "Bureau des opérations", authorizedScopeActive: "Votre périmètre opérationnel autorisé est actif.", function: "Fonction", workEmail: "E-mail professionnel", workflow: "Cycle de travail", operationalContext: "Contexte opérationnel", paidAt: "Payée le", paidTo: "Payée à", provider: "Prestataire", details: "Détails", updateStatus: "Mettre à jour le statut", operationalHistory: "Historique opérationnel", noUpdates: "Aucune mise à jour enregistrée.", firstTransition: "La première transition apparaîtra ici.", validTransitions: "Seules les transitions opérationnelles valides sont disponibles.", workOrderDetails: "Détails de l’ordre de travail", attachReport: "Joindre le document du rapport", sourceRecord: "Dossier source", sourceType: "Type de source", reportType: "Type de rapport", selectRecord: "Sélectionner un dossier", noSource: "Aucun dossier source", propertyInspectionReport: "Rapport d’inspection de propriété", downloadDocument: "Télécharger le document", operationalSource: "Source opérationnelle", summary: "Résumé", fieldEvidence: "Preuves terrain", executionEvidence: "Preuves d’exécution", uploadEvidence: "Téléverser des preuves", noEvidence: "Aucune preuve téléversée.", checklist: "Checklist d’inspection", structuredFindings: "Constats structurés pour cette inspection.", checklistEmpty: "La checklist n’est pas encore remplie.", checklistInit: "Créez une inspection pour initialiser la checklist KRAM standard.", inspectionQueue: "File d’inspection", inspectionDescription: "Inspectez les actifs, enregistrez les constats et produisez des rapports étayés par des preuves.", createInspection: "Créer la première inspection d’un actif KRAM.", newInspection: "Nouvelle inspection", reportRegister: "Registre des rapports", reportsDescription: "Rapports opérationnels et dossiers destinés aux clients générés par l’activité KRAM.", newReport: "Nouveau rapport", noReports: "Aucun rapport", reportsAppear: "Les rapports apparaîtront ici lorsque les opérations KRAM seront documentées." },
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
    ui: { system: "System", activity: "Activity", activityDescription: "A chronological audit trail of operational changes across KRAM.", events: "Events", today: "Today", eventTypes: "Event types", noActivity: "No activity recorded yet.", newActions: "New operational actions will appear here automatically.", finance: "Finance", approvals: "Approvals", approvalsDescription: "Review operational costs and other approval requests within your authorized scope.", pendingApprovals: "Pending approvals", approvalDescription: "Requests requiring an operational decision.", decisionHistory: "Decision history", noApprovals: "No approvals are waiting for review.", noDecisions: "No approval decisions recorded yet.", review: "Review", requested: "Requested", approved: "Approved", paid: "Paid", totalRecorded: "Total recorded", expenseRegister: "Expense register", expenses: "Expenses", expensesDescription: "Track operational costs from request through verification.", newExpense: "New expense", noExpenses: "No expenses yet", operationalCosts: "Operational costs will appear here.", noAsset: "No asset", noWorkOrder: "No work order", documents: "Documents", documentLibrary: "Document library", documentsDescription: "Private evidence and operational files connected to KRAM records.", searchDocuments: "Search documents by filename...", document: "Document", type: "Type", added: "Added", general: "General", noDocuments: "No documents found.", open: "Open", record: "Record", created: "Created", openWorkOrders: "Open work orders", activeInspections: "Active inspections", activeProjects: "Active projects", recordedExpenses: "Recorded expenses", recentOperations: "Recent operations", latestWork: "Latest work connected to this asset.", workOrder: "Work order", inspection: "Inspection", notScheduled: "Not scheduled", complete: "complete", noOperationalRecords: "No operational records yet.", financialRecords: "Financial & document records", recentRecords: "recent records", reports: "Reports", noDescription: "No description has been recorded for this asset.", coordinates: "Coordinates", noCoordinates: "No coordinates recorded yet.", quickActions: "Quick actions", startProject: "Start project", recordExpense: "Record expense", createReport: "Create report", schedule: "Schedule", progress: "Progress", projectOverview: "Project overview", noProjectDescription: "No project description recorded.", milestones: "Milestones", noMilestones: "No milestones recorded yet.", projectEvidence: "Project evidence", projectEvidenceDescription: "Documents linked to this project.", noProjectEvidence: "No project evidence recorded yet.", projectUpdates: "Project updates", noProjectUpdates: "No updates recorded yet.", recordProgress: "Record progress", fieldUpdate: "Document the latest field update.", project: "Project", noDecisionDate: "No decision date", serviceProviders: "Service providers", fieldNetwork: "Field network", noProviders: "No service providers yet", providerDescription: "KRAM’s field network will appear here.", coverageNotRecorded: "Coverage not recorded", noPhone: "No phone", active: "Active", remoteAssetManagement: "Remote Asset Management", allSystemsOperational: "All systems operational", workspace: "Workspace", globalWorkspace: "KRAM Global", opsDesk: "Ops desk", authorizedScopeActive: "Your authorized operational scope is active.", function: "Function", workEmail: "Work email", workflow: "Workflow", operationalContext: "Operational context", paidAt: "Paid At", paidTo: "Paid to", provider: "Provider", details: "Details", updateStatus: "Update status", operationalHistory: "Operational history", noUpdates: "No updates recorded yet.", firstTransition: "The first transition will appear here.", validTransitions: "Only valid operational transitions are available.", workOrderDetails: "Work order details", attachReport: "Attach report document", sourceRecord: "Source record", sourceType: "Source type", reportType: "Report type", selectRecord: "Select a record", noSource: "No source record", propertyInspectionReport: "Property inspection report", downloadDocument: "Download document", operationalSource: "Operational source", summary: "Summary", fieldEvidence: "Field evidence", executionEvidence: "Execution evidence", uploadEvidence: "Upload evidence", noEvidence: "No evidence uploaded yet.", checklist: "Inspection checklist", structuredFindings: "Structured findings for this inspection.", checklistEmpty: "Checklist not populated yet.", checklistInit: "Create a new inspection to initialize the standard KRAM checklist.", inspectionQueue: "Inspection queue", inspectionDescription: "Inspect assets, record findings and produce evidence-backed reports.", createInspection: "Create the first inspection for a KRAM asset.", newInspection: "New inspection", reportRegister: "Report register", reportsDescription: "Operational reports and client-ready records generated from KRAM activity.", newReport: "New report", noReports: "No reports yet", reportsAppear: "Reports will appear here as KRAM operations are documented." },
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
    ui: { system: "Sistema", activity: "Atividade", activityDescription: "Registo cronológico das alterações operacionais na KRAM.", events: "Eventos", today: "Hoje", eventTypes: "Tipos de evento", noActivity: "Ainda não há atividade registada.", newActions: "As novas ações operacionais aparecerão aqui automaticamente.", finance: "Finanças", approvals: "Aprovações", approvalsDescription: "Reveja custos operacionais e pedidos de aprovação no seu âmbito autorizado.", pendingApprovals: "Aprovações pendentes", approvalDescription: "Pedidos que requerem uma decisão operacional.", decisionHistory: "Histórico de decisões", noApprovals: "Não há aprovações pendentes.", noDecisions: "Ainda não há decisões de aprovação registadas.", review: "Rever", requested: "Solicitada", approved: "Aprovada", paid: "Paga", totalRecorded: "Total registado", expenseRegister: "Registo de despesas", expenses: "Despesas", expensesDescription: "Acompanhe custos operacionais desde o pedido até à verificação.", newExpense: "Nova despesa", noExpenses: "Ainda não há despesas", operationalCosts: "Os custos operacionais aparecerão aqui.", noAsset: "Sem ativo", noWorkOrder: "Sem ordem de trabalho", documents: "Documentos", documentLibrary: "Biblioteca de documentos", documentsDescription: "Evidências privadas e ficheiros operacionais ligados aos registos KRAM.", searchDocuments: "Pesquisar por nome de ficheiro...", document: "Documento", type: "Tipo", added: "Adicionado", general: "Geral", noDocuments: "Não foram encontrados documentos.", open: "Abrir", record: "Registo", created: "Criado", openWorkOrders: "Ordens de trabalho abertas", activeInspections: "Inspeções ativas", activeProjects: "Projetos ativos", recordedExpenses: "Despesas registadas", recentOperations: "Operações recentes", latestWork: "Trabalhos mais recentes ligados a este ativo.", workOrder: "Ordem de trabalho", inspection: "Inspeção", notScheduled: "Não agendada", complete: "concluído", noOperationalRecords: "Ainda não há registos operacionais.", financialRecords: "Registos financeiros e documentais", recentRecords: "registos recentes", reports: "Relatórios", noDescription: "Ainda não foi registada uma descrição para este ativo.", coordinates: "Coordenadas", noCoordinates: "Ainda não há coordenadas registadas.", quickActions: "Ações rápidas", startProject: "Iniciar projeto", recordExpense: "Registar despesa", createReport: "Criar relatório", schedule: "Agenda", progress: "Progresso", projectOverview: "Visão geral do projeto", noProjectDescription: "Ainda não foi registada uma descrição do projeto.", milestones: "Marcos", noMilestones: "Ainda não há marcos registados.", projectEvidence: "Evidências do projeto", projectEvidenceDescription: "Documentos ligados a este projeto.", noProjectEvidence: "Ainda não há evidências do projeto.", projectUpdates: "Atualizações do projeto", noProjectUpdates: "Ainda não há atualizações registadas.", recordProgress: "Registar progresso", fieldUpdate: "Documente a atualização de campo mais recente.", project: "Projeto", noDecisionDate: "Sem data de decisão", serviceProviders: "Prestadores de serviços", fieldNetwork: "Rede de campo", noProviders: "Ainda não há prestadores", providerDescription: "A rede de campo da KRAM aparecerá aqui.", coverageNotRecorded: "Cobertura não registada", noPhone: "Sem telefone", active: "Ativos", remoteAssetManagement: "Gestão de ativos à distância", allSystemsOperational: "Todos os sistemas operacionais", workspace: "Espaço de trabalho", globalWorkspace: "KRAM Global", opsDesk: "Balcão de operações", authorizedScopeActive: "O seu âmbito operacional autorizado está ativo.", function: "Função", workEmail: "E-mail profissional", workflow: "Fluxo de trabalho", operationalContext: "Contexto operacional", paidAt: "Paga em", paidTo: "Paga a", provider: "Prestador", details: "Detalhes", updateStatus: "Atualizar estado", operationalHistory: "Histórico operacional", noUpdates: "Ainda não há atualizações registadas.", firstTransition: "A primeira transição aparecerá aqui.", validTransitions: "Só estão disponíveis transições operacionais válidas.", workOrderDetails: "Detalhes da ordem de trabalho", attachReport: "Anexar documento do relatório", sourceRecord: "Registo de origem", sourceType: "Tipo de origem", reportType: "Tipo de relatório", selectRecord: "Selecionar registo", noSource: "Sem registo de origem", propertyInspectionReport: "Relatório de inspeção de propriedade", downloadDocument: "Transferir documento", operationalSource: "Origem operacional", summary: "Resumo", fieldEvidence: "Evidências de campo", executionEvidence: "Evidências de execução", uploadEvidence: "Carregar evidências", noEvidence: "Ainda não há evidências carregadas.", checklist: "Checklist de inspeção", structuredFindings: "Constatações estruturadas para esta inspeção.", checklistEmpty: "A checklist ainda não foi preenchida.", checklistInit: "Crie uma inspeção para inicializar a checklist KRAM padrão.", inspectionQueue: "Fila de inspeções", inspectionDescription: "Inspecione ativos, registe constatações e produza relatórios apoiados por evidências.", createInspection: "Crie a primeira inspeção de um ativo KRAM.", newInspection: "Nova inspeção", reportRegister: "Registo de relatórios", reportsDescription: "Relatórios operacionais e registos para clientes gerados pela atividade KRAM.", newReport: "Novo relatório", noReports: "Ainda não há relatórios", reportsAppear: "Os relatórios aparecerão aqui quando as operações KRAM forem documentadas." },
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


export const detailUi = {
  fr: {
    client: {
      contactDetails:"Coordonnées", primaryPhone:"Téléphone principal", alternativePhone:"Téléphone alternatif",
      residency:"Résidence", country:"Pays", city:"Ville", address:"Adresse", preferences:"Préférences",
      language:"Langue préférée", contactMethod:"Mode de contact préféré",
      trusted:"Personne de confiance / représentant autorisé", relationship:"Lien avec le client",
      clientOperations:"Opérations du client", clientOperationsDesc:"Activité récente sur les actifs de ce client.",
      financial:"Finance & rapports", linkedReports:"rapports liés aux actifs du client",
      assets:"Actifs du client", assetsDesc:"Actifs enregistrés pour ce client.",
      noAssets:"Aucun actif n’est encore lié à ce client.", createAsset:"Créer un actif",
      notes:"Notes", noNotes:"Aucune note n’a été enregistrée pour ce client.",
      record:"Dossier", created:"Créé", updated:"Mis à jour", openWorkOrders:"Ordres de travail ouverts",
      activeInspections:"Inspections actives", activeProjects:"Projets actifs", asset:"Actif",
      workOrder:"Ordre de travail", inspection:"Inspection", project:"Projet", recent:"Récent",
      noActivity:"Aucune activité opérationnelle pour le moment.", expense:"Dépenses", reports:"Rapports",
      back:"Retour aux clients", languageValues:{fr:"Français",en:"Anglais",pt:"Portugais"},
      methodValues:{whatsapp:"WhatsApp",email:"E-mail",phone:"Téléphone"}
    }
  },
  en: {
    client: {
      contactDetails:"Contact details", primaryPhone:"Primary phone", alternativePhone:"Alternative phone",
      residency:"Residency", country:"Country", city:"City", address:"Address", preferences:"Preferences",
      language:"Preferred language", contactMethod:"Preferred contact method",
      trusted:"Trusted person / authorised representative", relationship:"Relationship to client",
      clientOperations:"Client operations", clientOperationsDesc:"Recent activity across this client’s assets.",
      financial:"Financial & reporting", linkedReports:"reports linked to client assets",
      assets:"Client assets", assetsDesc:"Assets registered to this client.",
      noAssets:"No assets are linked to this client yet.", createAsset:"Create an asset",
      notes:"Notes", noNotes:"No notes have been recorded for this client.",
      record:"Record", created:"Created", updated:"Updated", openWorkOrders:"Open work orders",
      activeInspections:"Active inspections", activeProjects:"Active projects", asset:"Asset",
      workOrder:"Work order", inspection:"Inspection", project:"Project", recent:"Recent",
      noActivity:"No operational activity yet.", expense:"Expenses", reports:"Reports",
      back:"Back to clients", languageValues:{fr:"French",en:"English",pt:"Portuguese"},
      methodValues:{whatsapp:"WhatsApp",email:"Email",phone:"Phone"}
    }
  },
  pt: {
    client: {
      contactDetails:"Dados de contacto", primaryPhone:"Número principal", alternativePhone:"Número alternativo",
      residency:"Residência", country:"País", city:"Cidade", address:"Morada", preferences:"Preferências",
      language:"Idioma preferido", contactMethod:"Meio de contacto preferido",
      trusted:"Pessoa de confiança / representante autorizado", relationship:"Relação com o cliente",
      clientOperations:"Operações do cliente", clientOperationsDesc:"Atividade recente nos ativos deste cliente.",
      financial:"Finanças e relatórios", linkedReports:"relatórios ligados aos ativos do cliente",
      assets:"Ativos do cliente", assetsDesc:"Ativos registados para este cliente.",
      noAssets:"Ainda não há ativos ligados a este cliente.", createAsset:"Criar um ativo",
      notes:"Notas", noNotes:"Ainda não foram registadas notas para este cliente.",
      record:"Registo", created:"Criado", updated:"Atualizado", openWorkOrders:"Ordens de trabalho abertas",
      activeInspections:"Inspeções ativas", activeProjects:"Projetos ativos", asset:"Ativo",
      workOrder:"Ordem de trabalho", inspection:"Inspeção", project:"Projeto", recent:"Recente",
      noActivity:"Ainda não há atividade operacional.", expense:"Despesas", reports:"Relatórios",
      back:"Voltar aos clientes", languageValues:{fr:"Francês",en:"Inglês",pt:"Português"},
      methodValues:{whatsapp:"WhatsApp",email:"E-mail",phone:"Telefone"}
    }
  }
} as const;

export function getDetailUi(locale: Locale) {
  return detailUi[locale];
}
