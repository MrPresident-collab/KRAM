import { notFound } from "next/navigation";
import { Building2 } from "lucide-react";
import { isLocale,type Locale } from "@/lib/i18n";
import { getModuleCopy } from "@/lib/ops-modules";
import { OpsModulePage } from "@/components/ops/module-page";

export default async function PropertiesPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const base=getModuleCopy(locale as Locale,"projects");
 const copy={...base,eyebrow:locale==="fr"?"Actifs":locale==="pt"?"Ativos":"Assets",title:locale==="fr"?"Propriétés":locale==="pt"?"Propriedades":"Properties",description:locale==="fr"?"Vue dédiée aux propriétés résidentielles et commerciales suivies par KRAM.":locale==="pt"?"Vista dedicada às propriedades residenciais e comerciais acompanhadas pela KRAM.":"Dedicated view for residential and commercial properties tracked by KRAM.",primaryAction:locale==="fr"?"Nouvelle propriété":locale==="pt"?"Nova propriedade":"New property",queueTitle:locale==="fr"?"Registre des propriétés":locale==="pt"?"Registo de propriedades":"Property register",queueDescription:locale==="fr"?"Les propriétés suivies par KRAM apparaîtront ici.":locale==="pt"?"As propriedades acompanhadas pela KRAM aparecerão aqui.":"Properties tracked by KRAM will appear here.",emptyTitle:locale==="fr"?"Aucune propriété":locale==="pt"?"Ainda não há propriedades":"No properties yet",emptyDescription:locale==="fr"?"Les propriétés résidentielles et commerciales seront accessibles depuis leur fiche actif.":locale==="pt"?"As propriedades residenciais e comerciais estarão acessíveis a partir da ficha do ativo.":"Residential and commercial properties will be accessible from their asset record."};
 return <OpsModulePage locale={locale as Locale} copy={copy} icon={Building2}/>;
}
