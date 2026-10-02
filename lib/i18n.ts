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
    common: { search: "Rechercher", notifications: "Notifications", today: "Aujourd’hui" }
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
    common: { search: "Search", notifications: "Notifications", today: "Today" }
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
    common: { search: "Pesquisar", notifications: "Notificações", today: "Hoje" }
  }
} as const;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
