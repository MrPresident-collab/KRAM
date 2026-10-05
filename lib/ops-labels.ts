import type { Locale } from "@/lib/i18n";

type Labels = Record<string, string>;

const dictionaries: Record<Locale, {
  assetTypes: Labels;
  assetStatuses: Labels;
  workOrderStatuses: Labels;
  workOrderPriorities: Labels;
  inspectionStatuses: Labels;
  inspectionTypes: Labels;
  projectStatuses: Labels;
  projectTypes: Labels;
  milestoneStatuses: Labels;
  expenseStatuses: Labels;
  providerStatuses: Labels;
  verificationStatuses: Labels;
  contactMethods: Labels;
  roles: Labels;
}> = {
  fr: {
    assetTypes: { residential:"Résidentiel", commercial:"Commercial", construction:"Construction", retail:"Commerce", warehouse:"Entrepôt", land:"Terrain", hospitality:"Hôtellerie", other:"Autre" },
    assetStatuses: { active:"Actif", attention:"Attention requise", inactive:"Inactif", archived:"Archivé" },
    workOrderStatuses: { draft:"Brouillon", pending_approval:"En attente d’approbation", approved:"Approuvé", assigned:"Assigné", in_progress:"En cours", awaiting_evidence:"En attente de preuves", completed:"Terminé", verified:"Vérifié", closed:"Clôturé" },
    workOrderPriorities: { low:"Faible", normal:"Normale", high:"Élevée", urgent:"Urgente" },
    inspectionStatuses: { scheduled:"Planifiée", in_progress:"En cours", completed:"Terminée", report_ready:"Rapport prêt", closed:"Clôturée" },
    inspectionTypes: { initial:"Initiale", routine:"Routinière", technical:"Technique", pre_handover:"Avant remise", emergency:"Urgence", other:"Autre" },
    projectStatuses: { planning:"Planification", mobilization:"Mobilisation", in_progress:"En cours", on_hold:"En pause", completed:"Terminé", closed:"Clôturé" },
    projectTypes: { construction:"Construction", renovation:"Rénovation", fit_out:"Aménagement", maintenance_program:"Programme de maintenance", other:"Autre" },
    milestoneStatuses: { pending:"En attente", in_progress:"En cours", completed:"Terminé", blocked:"Bloqué" },
    expenseStatuses: { requested:"Demandée", approved:"Approuvée", paid:"Payée", verified:"Vérifiée", rejected:"Rejetée" },
    providerStatuses: { prospect:"Prospect", active:"Actif", suspended:"Suspendu", archived:"Archivé" },
    verificationStatuses: { pending:"En attente", verified:"Vérifié", rejected:"Rejeté" },
    contactMethods: { whatsapp:"WhatsApp", email:"E-mail", phone:"Téléphone" },
    roles: { owner:"Propriétaire", admin:"Administrateur", regional_admin:"Administrateur régional", operations:"Opérations", finance:"Finance", support:"Support", viewer:"Lecteur", client:"Client" }
  },
  en: {
    assetTypes: { residential:"Residential", commercial:"Commercial", construction:"Construction", retail:"Retail", warehouse:"Warehouse", land:"Land", hospitality:"Hospitality", other:"Other" },
    assetStatuses: { active:"Active", attention:"Needs attention", inactive:"Inactive", archived:"Archived" },
    workOrderStatuses: { draft:"Draft", pending_approval:"Pending approval", approved:"Approved", assigned:"Assigned", in_progress:"In progress", awaiting_evidence:"Awaiting evidence", completed:"Completed", verified:"Verified", closed:"Closed" },
    workOrderPriorities: { low:"Low", normal:"Normal", high:"High", urgent:"Urgent" },
    inspectionStatuses: { scheduled:"Scheduled", in_progress:"In progress", completed:"Completed", report_ready:"Report ready", closed:"Closed" },
    inspectionTypes: { initial:"Initial", routine:"Routine", technical:"Technical", pre_handover:"Pre-handover", emergency:"Emergency", other:"Other" },
    projectStatuses: { planning:"Planning", mobilization:"Mobilization", in_progress:"In progress", on_hold:"On hold", completed:"Completed", closed:"Closed" },
    projectTypes: { construction:"Construction", renovation:"Renovation", fit_out:"Fit-out", maintenance_program:"Maintenance program", other:"Other" },
    milestoneStatuses: { pending:"Pending", in_progress:"In progress", completed:"Completed", blocked:"Blocked" },
    expenseStatuses: { requested:"Requested", approved:"Approved", paid:"Paid", verified:"Verified", rejected:"Rejected" },
    providerStatuses: { prospect:"Prospect", active:"Active", suspended:"Suspended", archived:"Archived" },
    verificationStatuses: { pending:"Pending", verified:"Verified", rejected:"Rejected" },
    contactMethods: { whatsapp:"WhatsApp", email:"Email", phone:"Phone" },
    roles: { owner:"Owner", admin:"Administrator", regional_admin:"Regional Admin", operations:"Operations", finance:"Finance", support:"Support", viewer:"Viewer", client:"Client" }
  },
  pt: {
    assetTypes: { residential:"Residencial", commercial:"Comercial", construction:"Construção", retail:"Comércio", warehouse:"Armazém", land:"Terreno", hospitality:"Hotelaria", other:"Outro" },
    assetStatuses: { active:"Ativo", attention:"Requer atenção", inactive:"Inativo", archived:"Arquivado" },
    workOrderStatuses: { draft:"Rascunho", pending_approval:"A aguardar aprovação", approved:"Aprovada", assigned:"Atribuída", in_progress:"Em curso", awaiting_evidence:"A aguardar evidências", completed:"Concluída", verified:"Verificada", closed:"Encerrada" },
    workOrderPriorities: { low:"Baixa", normal:"Normal", high:"Alta", urgent:"Urgente" },
    inspectionStatuses: { scheduled:"Agendada", in_progress:"Em curso", completed:"Concluída", report_ready:"Relatório pronto", closed:"Encerrada" },
    inspectionTypes: { initial:"Inicial", routine:"Rotina", technical:"Técnica", pre_handover:"Antes da entrega", emergency:"Emergência", other:"Outra" },
    projectStatuses: { planning:"Planeamento", mobilization:"Mobilização", in_progress:"Em curso", on_hold:"Em pausa", completed:"Concluído", closed:"Encerrado" },
    projectTypes: { construction:"Construção", renovation:"Renovação", fit_out:"Acabamentos", maintenance_program:"Programa de manutenção", other:"Outro" },
    milestoneStatuses: { pending:"Pendente", in_progress:"Em curso", completed:"Concluído", blocked:"Bloqueado" },
    expenseStatuses: { requested:"Solicitada", approved:"Aprovada", paid:"Paga", verified:"Verificada", rejected:"Rejeitada" },
    providerStatuses: { prospect:"Potencial", active:"Ativo", suspended:"Suspenso", archived:"Arquivado" },
    verificationStatuses: { pending:"Pendente", verified:"Verificado", rejected:"Rejeitado" },
    contactMethods: { whatsapp:"WhatsApp", email:"E-mail", phone:"Telefone" },
    roles: { owner:"Proprietário", admin:"Administrador", regional_admin:"Administrador regional", operations:"Operações", finance:"Finanças", support:"Suporte", viewer:"Leitor", client:"Cliente" }
  }
};

export function opsLabels(locale: Locale) {
  return dictionaries[locale];
}

export function labelFromMap(locale: Locale, map: Labels, value: string | null | undefined, fallback = "—") {
  if (!value) return fallback;
  return map[value] ?? value.replaceAll("_", " ");
}
