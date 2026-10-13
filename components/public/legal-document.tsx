import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { KramBrand } from "@/components/brand/kram-brand";

type DocumentKind = "privacy" | "terms" | "cookies" | "faqs";

const copy = {
  en: {
    home: "Home", contact: "Contact KRAM", updated: "Information for visitors",
    privacy: { title: "Privacy Policy", intro: "How KRAM handles information submitted through this website.", sections: [
      ["Information you provide", "When you submit an enquiry, you may provide your name, email address, telephone number, country and city of residence, asset location and type, the help you need, and any details you choose to share."],
      ["How information is used", "We use enquiry information to understand your request, assess the support you are asking about, contact you about next steps, and manage the resulting communication. Submitting an enquiry does not automatically create a client account or commit you to a service."],
      ["Sharing and security", "Access to enquiry information should be limited to people who need it to respond to your request or operate the service. No website can guarantee absolute security; please do not include passwords, payment credentials, or other highly sensitive information in an enquiry."],
      ["Your questions", "For questions about information you have submitted or a request concerning your information, contact KRAM using the contact details published on this website."]
    ]},
    terms: { title: "Terms of Use", intro: "Conditions for using the public KRAM website and submitting an enquiry.", sections: [
      ["Website information", "The website provides general information about KRAM and its asset oversight services. Content is provided for information and does not, by itself, create a service agreement."],
      ["Enquiries", "Submitting an enquiry is a request to discuss your needs. It does not create a client account, guarantee acceptance, confirm availability, or commit either party to a project. Any agreed service, scope, responsibilities, fees and timelines should be confirmed separately in writing."],
      ["Appropriate use", "Do not misuse the website, attempt to gain unauthorised access, interfere with its operation, or submit information that you are not entitled to share."],
      ["Updates and contact", "Website content may be updated as KRAM's services develop. For questions about these terms, contact KRAM through the published contact channels."]
    ]},
    cookies: { title: "Cookie Policy", intro: "Information about cookies and similar technologies on this website.", sections: [
      ["Essential operation", "The website may use technical storage or similar mechanisms where needed for security, navigation, language preferences, or features you explicitly request."],
      ["Analytics and marketing", "This policy does not confirm that analytics or advertising cookies are active. If KRAM introduces non-essential tracking technologies, this page should be updated with the relevant purposes and available choices before they are used."],
      ["Managing your browser", "Most browsers let you review or remove stored cookies and control whether websites may store them. Blocking essential technologies may affect some site functions."],
      ["Questions", "If you have a question about cookies or similar technologies, contact KRAM using the contact details published on this website."]
    ]},
    faqs: { title: "Frequently Asked Questions", intro: "A few useful answers about KRAM's approach.", sections: [
      ["What does KRAM do?", "KRAM helps property owners oversee assets remotely through inspections, maintenance coordination, project oversight and clear reporting."],
      ["Can I enquire from another country?", "Yes. The enquiry form is designed for owners who may be living away from the asset they need to oversee."],
      ["Does submitting an enquiry create a client account?", "No. The enquiry is reviewed by the KRAM team; an account is not created automatically."],
      ["What happens after I enquire?", "The team reviews the information you submit and contacts you about possible next steps."],
      ["Which locations does KRAM serve?", "KRAM's current footprint is shown on this website. Contact the team to discuss your asset's location and requirements."]
    ]}
  },
  fr: {
    home: "Accueil", contact: "Contacter KRAM", updated: "Informations pour les visiteurs",
    privacy: { title: "Politique de confidentialité", intro: "Comment KRAM traite les informations transmises par ce site.", sections: [
      ["Informations fournies", "Lorsque vous envoyez une demande, vous pouvez communiquer votre nom, votre adresse e-mail, votre téléphone, votre pays et votre ville de résidence, la localisation et le type d’actif, vos besoins ainsi que les détails que vous choisissez de partager."],
      ["Utilisation des informations", "Ces informations servent à comprendre votre demande, à évaluer l’accompagnement recherché, à vous contacter concernant les prochaines étapes et à gérer les échanges qui en découlent. Une demande ne crée pas automatiquement un compte client et ne vous engage pas à acheter un service."],
      ["Partage et sécurité", "L’accès aux informations devrait être limité aux personnes qui en ont besoin pour répondre à votre demande ou assurer le fonctionnement du service. Aucun site ne peut garantir une sécurité absolue ; n’incluez pas de mots de passe, de données de paiement ou d’autres informations hautement sensibles dans votre demande."],
      ["Vos questions", "Pour toute question concernant les informations transmises ou une demande relative à celles-ci, contactez KRAM via les coordonnées publiées sur ce site."]
    ]},
    terms: { title: "Conditions d’utilisation", intro: "Conditions d’utilisation du site public de KRAM et d’envoi d’une demande.", sections: [
      ["Informations du site", "Le site présente KRAM et ses services de suivi d’actifs à titre informatif. Son contenu ne constitue pas, à lui seul, un contrat de prestation."],
      ["Demandes de renseignements", "L’envoi d’une demande permet de discuter de vos besoins. Il ne crée pas de compte client, ne garantit pas l’acceptation de la demande ou la disponibilité d’un service et n’engage aucune partie sur un projet. Toute prestation convenue, son périmètre, les responsabilités, les frais et les délais doivent être confirmés séparément par écrit."],
      ["Utilisation appropriée", "N’utilisez pas le site de manière abusive, ne tentez pas d’obtenir un accès non autorisé, ne perturbez pas son fonctionnement et ne transmettez pas d’informations que vous n’êtes pas autorisé à partager."],
      ["Mises à jour et contact", "Le contenu du site peut évoluer avec les services de KRAM. Pour toute question sur ces conditions, contactez KRAM via les canaux publiés."]
    ]},
    cookies: { title: "Politique relative aux cookies", intro: "Informations sur les cookies et technologies similaires utilisés sur ce site.", sections: [
      ["Fonctionnement essentiel", "Le site peut utiliser un stockage technique ou des mécanismes similaires lorsque cela est nécessaire à la sécurité, à la navigation, aux préférences linguistiques ou aux fonctionnalités que vous demandez explicitement."],
      ["Analyse et marketing", "Cette politique ne confirme pas l’activation de cookies d’analyse ou de publicité. Si KRAM introduit des technologies de suivi non essentielles, cette page devra être mise à jour avec leurs finalités et les choix disponibles avant leur utilisation."],
      ["Paramètres du navigateur", "La plupart des navigateurs permettent de consulter ou supprimer les cookies stockés et de contrôler leur enregistrement. Le blocage des technologies essentielles peut affecter certaines fonctions du site."],
      ["Questions", "Pour toute question sur les cookies ou technologies similaires, contactez KRAM via les coordonnées publiées sur ce site."]
    ]},
    faqs: { title: "Questions fréquentes", intro: "Quelques réponses utiles sur l’approche de KRAM.", sections: [
      ["Que fait KRAM ?", "KRAM aide les propriétaires à suivre leurs actifs à distance grâce aux inspections, à la coordination de la maintenance, au suivi de projets et à des rapports clairs."],
      ["Puis-je faire une demande depuis un autre pays ?", "Oui. Le formulaire est conçu pour les propriétaires qui vivent parfois loin de l’actif qu’ils souhaitent suivre."],
      ["Une demande crée-t-elle un compte client ?", "Non. L’équipe KRAM examine la demande ; aucun compte n’est créé automatiquement."],
      ["Que se passe-t-il après ma demande ?", "L’équipe examine les informations transmises et vous contacte au sujet des prochaines étapes possibles."],
      ["Dans quelles zones KRAM intervient-elle ?", "La présence actuelle de KRAM est indiquée sur ce site. Contactez l’équipe pour discuter de la localisation et des besoins liés à votre actif."]
    ]}
  },
  pt: {
    home: "Início", contact: "Contactar a KRAM", updated: "Informações para visitantes",
    privacy: { title: "Política de Privacidade", intro: "Como a KRAM trata as informações enviadas através deste site.", sections: [
      ["Informações fornecidas", "Ao enviar um pedido, poderá fornecer o seu nome, e-mail, telefone, país e cidade de residência, localização e tipo de ativo, ajuda necessária e outros detalhes que decida partilhar."],
      ["Utilização das informações", "Utilizamos os dados do pedido para compreender as suas necessidades, avaliar o acompanhamento solicitado, contactá-lo sobre os próximos passos e gerir a comunicação resultante. O envio de um pedido não cria automaticamente uma conta de cliente nem o compromete com um serviço."],
      ["Partilha e segurança", "O acesso às informações deve limitar-se às pessoas que precisam delas para responder ao pedido ou operar o serviço. Nenhum site pode garantir segurança absoluta; não inclua palavras-passe, dados de pagamento ou outras informações altamente sensíveis no pedido."],
      ["Dúvidas", "Para questões sobre as informações enviadas ou pedidos relacionados com os seus dados, contacte a KRAM através dos contactos publicados neste site."]
    ]},
    terms: { title: "Termos de Utilização", intro: "Condições de utilização do site público da KRAM e de envio de pedidos.", sections: [
      ["Informações do site", "O site apresenta informações gerais sobre a KRAM e os seus serviços de acompanhamento de ativos. O conteúdo, por si só, não cria um contrato de prestação de serviços."],
      ["Pedidos de informação", "O envio de um pedido permite discutir as suas necessidades. Não cria uma conta de cliente, não garante aceitação ou disponibilidade e não compromete nenhuma das partes com um projeto. Qualquer serviço acordado, âmbito, responsabilidades, custos e prazos devem ser confirmados separadamente por escrito."],
      ["Utilização adequada", "Não utilize o site de forma abusiva, não tente obter acesso não autorizado, não interfira com o seu funcionamento e não envie informações que não esteja autorizado a partilhar."],
      ["Atualizações e contacto", "O conteúdo do site pode ser atualizado à medida que os serviços da KRAM evoluem. Para dúvidas sobre estes termos, contacte a KRAM através dos canais publicados."]
    ]},
    cookies: { title: "Política de Cookies", intro: "Informações sobre cookies e tecnologias semelhantes neste site.", sections: [
      ["Funcionamento essencial", "O site poderá utilizar armazenamento técnico ou mecanismos semelhantes quando necessários para segurança, navegação, preferências de idioma ou funcionalidades que solicitar expressamente."],
      ["Análise e marketing", "Esta política não confirma que estejam ativos cookies de análise ou publicidade. Se a KRAM introduzir tecnologias de rastreamento não essenciais, esta página deverá ser atualizada com as respetivas finalidades e opções disponíveis antes da sua utilização."],
      ["Definições do navegador", "A maioria dos navegadores permite consultar ou remover cookies armazenados e controlar o seu armazenamento. Bloquear tecnologias essenciais pode afetar algumas funções do site."],
      ["Dúvidas", "Para questões sobre cookies ou tecnologias semelhantes, contacte a KRAM através dos contactos publicados neste site."]
    ]},
    faqs: { title: "Perguntas Frequentes", intro: "Algumas respostas úteis sobre a abordagem da KRAM.", sections: [
      ["O que faz a KRAM?", "A KRAM ajuda proprietários a acompanhar ativos à distância através de inspeções, coordenação de manutenção, acompanhamento de projetos e relatórios claros."],
      ["Posso enviar um pedido a partir de outro país?", "Sim. O formulário foi pensado para proprietários que podem viver longe do ativo que precisam de acompanhar."],
      ["O envio de um pedido cria uma conta de cliente?", "Não. A equipa da KRAM analisa o pedido; não é criada automaticamente uma conta."],
      ["O que acontece depois do pedido?", "A equipa analisa as informações enviadas e contacta-o sobre os possíveis próximos passos."],
      ["Em que locais a KRAM opera?", "A presença atual da KRAM está indicada neste site. Contacte a equipa para conversar sobre a localização e as necessidades do seu ativo."]
    ]}
  }
} as const;

export function LegalDocument({ locale, kind }: { locale: Locale; kind: DocumentKind }) {
  const t = copy[locale];
  const document = t[kind];
  return (
    <main className="public-home legal-page" id="top">
      <header className="site-header">
        <KramBrand locale={locale} href={`/${locale}`} className="brand-mark" />
        <nav className="main-nav" aria-label={locale === "fr" ? "Navigation principale" : locale === "pt" ? "Navegação principal" : "Main navigation"}>
          <Link href={`/${locale}`}>{t.home}</Link>
          <Link href={`/${locale}/about`}>{locale === "fr" ? "À propos" : locale === "pt" ? "Sobre" : "About"}</Link>
          <Link href={`/${locale}/services`}>{locale === "fr" ? "Services" : locale === "pt" ? "Serviços" : "Services"}</Link>
          <Link href={`/${locale}/enquiry`}>{t.contact}</Link>
        </nav>
        <div className="header-actions"><div className="language-switch" aria-label={locale === "fr" ? "Langue" : locale === "pt" ? "Idioma" : "Language"}>
          {(["en", "fr", "pt"] as const).map((language) => <Link key={language} href={`/${language}/${kind === "privacy" ? "privacy-policy" : kind === "terms" ? "terms-of-service" : kind === "cookies" ? "cookie-policy" : "faqs"}`} aria-current={locale === language ? "page" : undefined} className={locale === language ? "language-current" : ""}>{language.toUpperCase()}</Link>)}
        </div></div>
      </header>
      <section className="section-shell legal-content">
        <p className="eyebrow"><span className="eyebrow-line" />KRAM · {t.updated}</p>
        <h1>{document.title}</h1>
        <p className="section-description">{document.intro}</p>
        <div className="legal-sections">{document.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</div>
        <p><Link className="text-link" href={`/${locale}/enquiry`}>{t.contact} <span aria-hidden="true">↗</span></Link></p>
      </section>
    </main>
  );
}
