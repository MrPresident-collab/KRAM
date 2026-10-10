"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isLocale, type Locale } from "@/lib/i18n";
import { KramLogo } from "@/components/brand/kram-logo";

const copy = {
  en: { eyebrow:"KRAM / CLIENT ACCESS", title:"Welcome back.", intro:"Sign in to access the information KRAM makes available to you.", email:"Email address", password:"Password", submit:"Sign in", pending:"Signing in…", invalid:"We couldn’t sign you in with those details. Check them and try again.", noAccess:"This account is not linked to an active KRAM client record. Please contact Support for help.", back:"Back to KRAM", privacy:"Your assets and records remain private to your account." },
  fr: { eyebrow:"KRAM / ACCÈS CLIENT", title:"Heureux de vous retrouver.", intro:"Connectez-vous pour accéder aux informations mises à votre disposition par KRAM.", email:"Adresse e-mail", password:"Mot de passe", submit:"Se connecter", pending:"Connexion…", invalid:"Connexion impossible avec ces informations. Vérifiez-les puis réessayez.", noAccess:"Ce compte n’est pas associé à un dossier client KRAM actif. Contactez l’équipe Support.", back:"Retour à KRAM", privacy:"Vos actifs et vos documents restent privés à votre compte." },
  pt: { eyebrow:"KRAM / ACESSO DE CLIENTE", title:"Bem-vindo de volta.", intro:"Inicie sessão para aceder às informações que a KRAM disponibiliza.", email:"Endereço de e-mail", password:"Palavra-passe", submit:"Iniciar sessão", pending:"A iniciar sessão…", invalid:"Não foi possível iniciar sessão com estes dados. Verifique-os e tente novamente.", noAccess:"Esta conta não está associada a um registo ativo de cliente KRAM. Contacte o Support.", back:"Voltar à KRAM", privacy:"Os seus ativos e registos permanecem privados na sua conta." }
} as const;

export default function ClientAccessPage() {
  const params = useParams<{locale:string}>();
  const locale: Locale = isLocale(params.locale) ? params.locale : "fr";
  const t = copy[locale];
  const router = useRouter();
  const supabase = createClient();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [pending,setPending] = useState(false);
  const [error,setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const {data,error:signInError} = await supabase.auth.signInWithPassword({email,password});
    if (signInError || !data.user) {
      setError(t.invalid);
      setPending(false);
      return;
    }
    const {data:client,error:clientError} = await supabase.from("clients").select("id").eq("profile_id",data.user.id).eq("status","active").maybeSingle();
    if (clientError || !client) {
      await supabase.auth.signOut();
      setError(t.noAccess);
      setPending(false);
      return;
    }
    // Client portal destination will be wired when its protected overview is implemented.
    router.replace("/" + locale + "/client");
    router.refresh();
  }

  return <main className="client-access-page">
    <div className="client-access-shell">
      <section className="client-access-story">
        <Link href={"/"+locale} aria-label="KRAM home"><KramLogo className="client-access-logo"/></Link>
        <div className="client-access-story-copy"><p className="eyebrow eyebrow-light"><span className="eyebrow-line"/>{t.eyebrow}</p><h1>{t.title}</h1><p>{t.intro}</p></div>
        <div className="client-access-trust"><ShieldCheck size={17}/><span>{t.privacy}</span></div>
      </section>
      <section className="client-access-form-wrap">
        <div className="client-access-form-inner">
          <p className="eyebrow"><span className="eyebrow-line"/>KRAM / CLIENTS</p><h2>{t.title}</h2><p className="client-access-intro">{t.intro}</p>
          <form onSubmit={submit} className="client-access-form">
            <label>{t.email}<input type="email" autoComplete="email" required value={email} onChange={event=>setEmail(event.target.value)} maxLength={254}/></label>
            <label>{t.password}<input type="password" autoComplete="current-password" required value={password} onChange={event=>setPassword(event.target.value)} maxLength={256}/></label>
            {error && <p role="alert" className="client-access-error">{error}</p>}
            <button type="submit" disabled={pending} className="button button-orange client-access-submit">{pending?t.pending:t.submit}<ArrowRight size={16}/></button>
          </form>
          <div className="client-access-security"><LockKeyhole size={14}/><span>{t.privacy}</span></div>
          <Link className="client-access-back" href={"/"+locale}><ArrowRight size={14} className="client-access-back-icon"/>{t.back}</Link>
        </div>
      </section>
    </div>
  </main>;
}
