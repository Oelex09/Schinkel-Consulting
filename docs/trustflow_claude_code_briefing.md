# TrustFlow — Projekt-Briefing für Claude Code

**Anweisung an Claude Code:** Lies dieses Dokument zu Beginn jeder Session vollständig durch, bevor du Code schreibst. Es ist die Single Source of Truth für Produkt-Vision, Architektur-Entscheidungen, Roadmap und Compliance-Anforderungen. Wenn du auf Fragen stößt, die hier nicht beantwortet sind, frag NACH, bevor du baust. Speichere dieses Dokument im Repo unter `docs/PROJECT_BRIEF.md`.

---

## 1\. Wer der Gründer ist

Alexander Schinkel, Maurermeister und Bauingenieur, 15 Jahre Bau- und Projektmanagement-Erfahrung. **Kein Software-Entwickler.** Du (Claude Code) bist sein Entwicklungspartner. Erkläre technische Entscheidungen so, dass ein Nicht-Entwickler sie nachvollziehen kann. Bevorzuge etablierte Patterns vor cleveren Lösungen. Schreibe kurze, lesbare Code-Kommentare.

## 2\. Was wir bauen

**TrustFlow** ist eine B2B-SaaS-Plattform für deutsche Handwerksbetriebe. Sie verwandelt zufriedene Kunden in drei verbundene Wertströme:

1. **Verifizierte Bewertungen** — eigene (per einmaligem QR-Code nach Auftragsabnahme) plus synchronisierte Google-Bewertungen.  
2. **Lebenslange Empfehler** — jeder Kunde behält einen permanenten persönlichen Empfehlungs-Code, der mit gestaffelter Belohnung (Stufen-System mit physischen Auszeichnungen ab Goldstatus) hinterlegt ist.  
3. **Mitarbeiter-Recruiting** — offene Stellen werden automatisch durch die Netzwerke zufriedener Kunden geteilt; auch hier mit Affiliate-Belohnung.

Kernslogan intern: **"Aus jedem zufriedenen Kunden ein Empfehler. Aus jedem Empfehler ein Recruiter."**

## 3\. Zielgruppe (Beachhead-Strategie)

**Phase 1 (Monat 1-12):** Bauhandwerk in DACH. Erste Pilotkunden GaLaBau und Bad-/Heizungssanierung. **Phase 2 (Monat 13-24):** Andere Handwerks-Sparten (Friseur, KFZ, Bäcker etc.) — gleiche Codebase, branchenspezifische Defaults. **Phase 3 (ab Monat 24):** Optional Service-Branchen außerhalb des Handwerks.

**Wichtig:** Baue ALLES so, dass es zunächst für Bauhandwerk perfekt funktioniert. Andere Sparten werden später durch Konfiguration und Templates abgedeckt, NICHT durch parallelen Produkt-Stamm. Wenn du ein Feature baust, frag dich: "Funktioniert das auch bei einem Bad-Sanierer mit drei Mitarbeitern?" — wenn nein, vereinfachen.

## 4\. Tech-Stack (NICHT ohne Rücksprache ändern)

- **Frontend:** Next.js (App Router)  
- **Backend/DB:** Supabase (PostgreSQL mit Row Level Security)  
- **Auth:** Supabase Auth  
- **Hosting:** Vercel, Region Frankfurt (DSGVO)  
- **Payments:** Stripe (mit EU-VAT/Reverse-Charge-Konfiguration)  
- **E-Mail-Versand:** Resend oder Postmark (zu klären)  
- **Storage (für Bilder):** Supabase Storage

## 5\. Aktueller Stand (Stand: April 2026\)

| Phase | Status | Was existiert |
| :---- | :---- | :---- |
| Phase 1 — Fundament | ✅ 100% | Next.js-Projekt, Supabase-Client (server/admin), Auth mit Login \+ Register |
| Phase 2 — Bewertungssystem | ✅ \~90% | Öffentliche Bewertungsseite `[company]/bewertung`, Soft-Delete, Audit Trail, Admin-Panel für Löschanfragen. Offen: DSGVO-Einwilligungs-Checkboxen im Formular |
| Phase 3 — Recruiting & Social | ⚠️ \~60% | Bewerber-Landingpage, Apply-Link-API, ShareButtons, RewardShare-Komponente. Offen: Sharing/Recruiting ist noch an positive Sternezahl gekoppelt — muss entkoppelt werden |
| Phase 4 — Dashboard | ✅ \~85% | Dashboard, ReviewManager, JobManager, Settings, ApplicationList, TokenList. Detailschliff offen |
| Phase 5 — Rechtliches & Billing | ❌ \~10% | Stripe fehlt komplett. Impressum/Datenschutz fehlen. DSGVO-Checkboxen unklar |

Gesamt: \~70-75%

## 6\. Strategische Entscheidungen (DIESE NICHT ALLEIN ÄNDERN)

Diese Entscheidungen wurden bewusst getroffen. Wenn du Anlass siehst, davon abzuweichen, frag erst.

1. **Permanenter Empfehlungs-Token:** Pro Kombination Kunde × Handwerker existiert genau EIN dauerhafter Empfehlungs-Token. Jede Teilung erzeugt ein neues `share_event`, aber kein neues Token. Lebenslange Empfehler-Beziehung.  
     
2. **Reviews haben eine Quell-Spalte (`source`):** Mögliche Werte: `own`, `google`, `trustpilot`, `provenexpert`, etc. Eigene Reviews und importierte Reviews liegen in DERSELBEN Tabelle, unterschieden nur durch `source`.  
     
3. **Belohnung NUR für konvertierte Empfehlungen, NIEMALS für Bewertungen:** Aus UWG-Gründen (Gesetz gegen unlauteren Wettbewerb). Eine Bewertung gegen Belohnung wäre eine "gekaufte Bewertung" und abmahnfähig. Eine Empfehlung gegen Belohnung ist klassisches Empfehlungsmarketing und legal.  
     
4. **Conversion-Markierung erfolgt manuell durch den Handwerker:** Kein Auto-Trigger. Der Handwerker setzt im Dashboard pro Lead den Status auf `converted` und gibt den Auftragswert ein. Erst dann wird die Belohnung freigeschaltet.  
     
5. **DSGVO: Separate Einwilligungs-Checkboxen, niemals Sammelzustimmung:** Zustimmung zur Bewertungs-Veröffentlichung, zur Bild-Verwendung, zur dauerhaften Speicherung des Empfehlungs-Codes — alles separate Checkboxen, alle ungekreuzt voreingestellt.  
     
6. **Einmaliger QR-Code für Bewertung, permanenter QR-Code für Empfehlungen:** Nicht verwechseln. Der Bewertungs-QR ist single-use (Authentizität). Der Empfehlungs-QR ist multi-use und lifelong.  
     
7. **Audit Trail über Soft-Deletes:** Bewertungen werden NIE physisch gelöscht. Jeder Lösch-Versuch (durch wen auch immer) wird protokolliert. Datenbank-Spalte `deleted_at` plus `audit_log`\-Tabelle.

## 7\. Priorisierte Roadmap

### Sprint 1 (Woche 1-2): Launch-Vorbereitung — MUSS-HABEN für Pilot

**Ziel:** Tool ist juristisch einsatzfähig und für ersten Pilotkunden bereit.

- [ ] **Sharing-Logik entkoppeln von Sternezahl.** Aktuell ist der Share- und Recruiting-Button nur bei positiven Bewertungen aktiv. Muss bei JEDER Bewertung verfügbar sein, egal ob 1 oder 5 Sterne. Frage an Alexander: Soll bei sehr negativen Bewertungen (1-2 Sterne) ein zusätzlicher Hinweis-Schritt kommen, der dem Kunden die Möglichkeit zur direkten Kontaktaufnahme mit dem Handwerker bietet, BEVOR er teilt?  
        
- [ ] **DSGVO-Einwilligungs-Checkboxen im Bewertungsformular.** Drei separate Checkboxen, alle ungekreuzt:  
        
      - "Ich stimme der Veröffentlichung meiner Bewertung zu (Pflicht)."  
      - "Ich stimme der Verwendung des vom Handwerker hochgeladenen Vorher-/Nachher-Bildes in meiner Empfehlung zu (optional)."  
      - "Ich möchte einen persönlichen Empfehlungs-Code dauerhaft behalten und über Belohnungen informiert werden — jederzeit widerrufbar (optional)." Verknüpfen mit Datenschutz-Erklärung als Link.

      

- [ ] **Impressum \+ Datenschutzerklärung.** Generieren mit eRecht24 oder Dr. Schwenke. **NICHT KI-generieren** — das hat im Streitfall keine juristische Tragfähigkeit. Statische Routes `/impressum` und `/datenschutz`.  
        
- [ ] **E-Mail-Versand für Bewertungs-Anfragen verifizieren.** Existierende Funktion testen. Falls nicht funktional: Resend-Integration einrichten. Templating-System aufsetzen für: Bewertungs-Einladung, Empfehlungs-Belohnung verfügbar, Belohnung eingelöst, Stellen-Update.  
        
- [ ] **Stripe vorbereiten, aber NICHT zwingend launchfähig.** Für die ersten 3-5 Pilotkunden wird manuell per Rechnung abgerechnet. Stripe in Sprint 4 fertigstellen. Im Code-Stub schon das `subscriptions`\-Schema anlegen mit Feldern: `customer_id`, `plan`, `status`, `stripe_customer_id` (nullable), `manual_invoice` (boolean default false).

### Sprint 2 (Woche 3-4): Empfehlungs-Engine — DAS HERZSTÜCK

**Ziel:** Die permanente Empfehlungs-Mechanik mit Lifetime-Tracking und gestaffelten Belohnungen.

**Datenmodell-Erweiterungen:**

\-- Permanenter Empfehlungs-Token pro Kunde × Handwerker

CREATE TABLE referral\_tokens (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  customer\_id UUID NOT NULL REFERENCES customers(id),

  company\_id UUID NOT NULL REFERENCES companies(id),

  token TEXT UNIQUE NOT NULL,  \-- z.B. base32-encoded, lesbar

  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'revoked')),

  created\_at TIMESTAMPTZ DEFAULT now(),

  last\_used\_at TIMESTAMPTZ,

  UNIQUE (customer\_id, company\_id)

);

\-- Jedes Mal, wenn der Kunde teilt (WhatsApp, Facebook, persönlich, etc.)

CREATE TABLE referral\_share\_events (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  referral\_token\_id UUID NOT NULL REFERENCES referral\_tokens(id),

  channel TEXT NOT NULL,  \-- 'whatsapp', 'facebook', 'instagram', 'linkedin', 'qr\_save', 'manual'

  shared\_at TIMESTAMPTZ DEFAULT now()

);

\-- Jeder Klick auf den Empfehlungs-Link

CREATE TABLE referral\_clicks (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  referral\_token\_id UUID NOT NULL REFERENCES referral\_tokens(id),

  ip\_hash TEXT,  \-- gehashed wegen DSGVO

  user\_agent TEXT,

  clicked\_at TIMESTAMPTZ DEFAULT now()

);

\-- Lead, der durch eine Empfehlung kommt

CREATE TABLE referral\_leads (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  referral\_token\_id UUID NOT NULL REFERENCES referral\_tokens(id),

  contact\_name TEXT NOT NULL,

  contact\_email TEXT,

  contact\_phone TEXT,

  message TEXT,

  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'converted', 'lost')),

  conversion\_value\_cents INTEGER,  \-- Auftragswert in Cent

  notes TEXT,

  created\_at TIMESTAMPTZ DEFAULT now(),

  status\_changed\_at TIMESTAMPTZ

);

\-- Belohnung, die durch konvertierten Lead ausgelöst wurde

CREATE TABLE referral\_rewards (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  referral\_lead\_id UUID NOT NULL REFERENCES referral\_leads(id),

  customer\_id UUID NOT NULL REFERENCES customers(id),  \-- der Empfehler

  reward\_type TEXT NOT NULL,  \-- 'discount\_percent', 'fixed\_amount', 'service'

  reward\_value TEXT NOT NULL,  \-- '10', '50.00', 'Kostenloser Rasenschnitt'

  voucher\_code TEXT UNIQUE,

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'available', 'redeemed', 'expired')),

  available\_at TIMESTAMPTZ,

  expires\_at TIMESTAMPTZ,

  redeemed\_at TIMESTAMPTZ

);

\-- Loyalitäts-Stufen pro Empfehler × Handwerker

CREATE TABLE referral\_loyalty\_status (

  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

  customer\_id UUID NOT NULL REFERENCES customers(id),

  company\_id UUID NOT NULL REFERENCES companies(id),

  level TEXT DEFAULT 'bronze' CHECK (level IN ('bronze', 'silver', 'gold', 'platin')),

  total\_conversions INTEGER DEFAULT 0,

  total\_conversion\_value\_cents BIGINT DEFAULT 0,

  upgraded\_at TIMESTAMPTZ,

  UNIQUE (customer\_id, company\_id)

);

**Belohnungs-Konfiguration im Handwerker-Dashboard:**

Pro Handwerker einstellbar:

- Belohnungs-Typ und \-Höhe pro Stufe (Bronze: 10%, Silber: 15%, Gold: kostenloser Service, Platin: nochmal größer)  
- Mindest-Auftragswert für Belohnungs-Auslösung (z.B. 500 €)  
- Gültigkeitsdauer der Gutscheine (z.B. 12 Monate)

**Wichtige UX-Punkte:**

- Im Empfehler-Flow: Nach Bewertungs-Abgabe Anzeige des persönlichen Empfehlungs-Codes mit Speicher-Optionen (PDF-Download, "zu Apple Wallet", QR als Bild speichern, per E-Mail an sich selbst senden).  
- Im Handwerker-Dashboard: Lead-Inbox mit Workflow-Buttons. Bei Status-Änderung auf `converted` automatisch E-Mail an den Empfehler.  
- Empfehler-Stats-Seite: Personalisierte URL, auf der der Empfehler sieht, wie viele Empfehlungen er bisher abgegeben hat, welchen Status (Bronze/Silber/Gold), nächste Stufe.

**Frage an Alexander vor Sprint 2 Start:** Wie sollen die Stufen heißen und wo liegen die Schwellen? Vorschlag: Bronze (1 Conversion), Silber (3), Gold (7), Platin (15).

### Sprint 3 (Woche 5-6): Google Business Profile Sync

**Ziel:** Bestehende Google-Reviews in TrustFlow einlesen, anzeigen und shareable machen. **Read-only.** Keine Antwortfunktion via Google in dieser Phase.

**Implementierung:**

- OAuth2-Flow für Google Business Profile API anbinden. Dokumentation: [https://developers.google.com/my-business](https://developers.google.com/my-business)  
- Token-Storage in Supabase (Tabelle `google_oauth_tokens` mit `company_id`, `access_token`, `refresh_token`, `expires_at`).  
- Cron-Job (Vercel Cron oder Supabase Edge Function), der täglich für jeden verbundenen Account die Reviews abruft.  
- Importierte Reviews landen in der bestehenden `reviews`\-Tabelle mit `source = 'google'` und `external_id` als Google-Review-ID.  
- Idempotenz sicherstellen: Beim erneuten Sync KEINE Duplikate erzeugen, sondern Updates spielen (Bewertung kann sich ändern).  
- Im Dashboard: Klare Kennzeichnung "Quelle: Google" bei importierten Reviews. Auf der öffentlichen Bewertungsseite ebenfalls Quell-Anzeige.

**Wichtig:**

- Reviews aus Google werden NUR über die offizielle API geholt. KEIN Scraping.  
- DSGVO: Speichern auf Basis berechtigtes Interesse (der Handwerker als Inhaber des Profils stimmt der Verarbeitung seiner Profile-Daten explizit per OAuth zu).  
- Quell-URL bei jedem importierten Review speichern, damit jederzeit zur Originalquelle verwiesen werden kann.

**Frage an Alexander vor Sprint 3 Start:** Sollen importierte Google-Reviews auch durch die Social-Share-Engine laufen können — also: Kann der Handwerker eine seiner Google-Reviews auswählen und daraus eine LinkedIn-Grafik generieren? (Empfohlen: ja)

### Sprint 4 (Woche 7-8): Stripe \+ UX-Polish \+ Soft-Launch-Vorbereitung

- Stripe Subscription-Integration mit EU-VAT und Reverse-Charge.  
- Kundenself-Service: Plan-Wechsel, Kündigung, Rechnungen herunterladen.  
- Onboarding-Flow für neue Handwerksbetriebe (Geschäftsprofil eingeben, Google verbinden, ersten QR-Code generieren).  
- E-Mail-Templates final designen.  
- Performance-Pass: Lighthouse-Score auf der öffentlichen Bewertungsseite über 90\.  
- Letzter Bug-Fix-Pass aus den Pilot-Feedback-Sessions.

### Sprint 5 (später): Vorher-/Nachher-Bilder \+ Workflow-Verbesserung

- Im "QR-Code generieren"-Dialog im Dashboard: Vorher- und Nachher-Foto hochladen können (Supabase Storage).  
- Bilder erscheinen automatisch im Empfehlungs-Schritt als Vorschlag.  
- Kunde kann das vom Handwerker hochgeladene Bild übernehmen ODER eigenes ergänzen.  
- Bild-Lizenz-Klausel: Der Handwerker bestätigt beim Upload, dass er die Rechte hat (Personen auf Bild \= Einwilligung erforderlich).

### Sprint 6 (später, nach Validierung): Physische Auszeichnung

- Anbindung an Druck-Partner (z.B. Flyeralarm-API oder lokaler Druck-Partner).  
- Wenn ein Empfehler Goldstatus erreicht: Automatisch eine personalisierte Empfehler-Urkunde (PDF-Generation) erzeugen, die der Handwerker drucken/rahmen lassen kann.  
- Optional: Magnet-Druck mit dem persönlichen Empfehlungs-QR-Code, den der Handwerker dem Kunden mit der Rechnung übergibt.

### Sprint 7 (später): SMS-Versand für nicht-anwesende Kunden

- Twilio oder vergleichbar anbinden.  
- Im Dashboard: "Bewertungs-Link per SMS senden" als Alternative zum QR-Code.  
- Use-Case: Vermieter, gewerbliche Kunden, Projekte ohne Endkunden-Anwesenheit bei Abnahme.

## 8\. DSGVO / Legal — Hard Requirements

- **AVV (Auftragsverarbeitungsvertrag)** mit jedem Kunden abschließen. Template muss im Onboarding hinterlegt sein, vom Kunden im Selfservice unterschreibbar.  
- **Verarbeitungsverzeichnis** der TrustFlow GmbH selbst pflegen.  
- **Recht auf Vergessenwerden:** Jeder Endnutzer (Empfehler, Bewerber) muss seine Daten löschen können. Soft-Delete für Reviews bleibt bestehen, aber personenbezogene Spalten (Name, E-Mail) müssen anonymisierbar sein.  
- **Datenexport:** Endnutzer können ihre Daten als JSON exportieren.  
- **Cookie-Banner:** TrustFlow eigene Webseite und alle Kunden-Bewertungsseiten brauchen DSGVO-konformen Cookie-Banner. Empfehlung: Klaro oder Cookiebot, kein selbstgebautes Banner.  
- **IP-Adressen:** Wenn gespeichert, dann gehasht. Niemals im Klartext.  
- **Hosting in der EU:** Vercel-Region Frankfurt setzen, Supabase EU-Region. Drittland-Transfers vermeiden.  
- **Bilder mit Personen:** Vor Upload bestätigen, dass Einwilligung der abgebildeten Personen vorliegt.

## 9\. Designprinzipien

**Tu:**

- Schreibe Code in Englisch (Variablennamen, Funktionsnamen), aber UI-Texte in Deutsch.  
- Halte alle UI-Texte in einer zentralen `i18n/de.json` für spätere Internationalisierung.  
- Bevorzuge Server Components und Server Actions, wo möglich.  
- Nutze Supabase RLS aggressiv: jede Tabelle hat klare Policies, kein Tenant sieht Daten eines anderen.  
- Schreibe für jeden neuen Feature-Endpunkt mindestens einen Integrationstest.  
- Logge Fehler in Sentry (oder Alternative — zu klären).

**Tu nicht:**

- Keine Auth-Bypass-Tricks, keine "for now we trust the client".  
- Keine Inline-Styles, immer Tailwind oder CSS Modules.  
- Keine Magic Strings: enums oder Konstanten verwenden.  
- Keine Daten-Migrations ohne Backup-Schritt im Migration-File.  
- Keine PII (personenbezogene Daten) in Server-Logs.

## 10\. Was Claude Code NICHT alleine entscheiden soll

Wenn du auf eine dieser Fragen stößt, **frag Alexander**, bevor du baust:

- Soll ein Feature für andere Handwerks-Sparten unterschiedlich konfiguriert werden? (z.B. Belohnungs-Schwellen)  
- Soll eine Belohnung automatisch oder manuell freigeschaltet werden?  
- Welcher Preis-Plan-Tier soll welches Feature haben?  
- Welche Branche/Sparte soll als Default in den Stammdaten erscheinen?  
- Wie sollen E-Mail-Templates inhaltlich klingen? (Tonalität ist wichtig — Handwerk \= direkter, freundlicher, nicht zu corporate)  
- Bei juristischen Fragen (Texte für Datenschutz, AGB, Belohnungs-Bedingungen): IMMER an Anwalt oder Tool-Anbieter wie eRecht24 weiterleiten, nicht selbst formulieren.

## 11\. Workflow für jede Session mit Claude Code

1. Claude Code liest dieses Dokument.  
2. Claude Code listet auf: "In Sprint X stehen aktuell folgende Tasks offen: \[Liste\]. Welche soll ich angehen?"  
3. Vor dem Bau jedes Tasks: Claude Code stellt klärende Fragen, falls Specs unvollständig sind.  
4. Während des Baus: kleine Commits, klare Messages.  
5. Nach Fertigstellung: Claude Code listet auf, was getestet wurde und was offen ist.  
6. Diese `PROJECT_BRIEF.md` wird bei strategischen Änderungen gemeinsam aktualisiert.

---

**Letztes Update:** 29\. April 2026 **Verantwortlich:** Alexander Schinkel ([info@alexanderschinkel.com](mailto:info@alexanderschinkel.com))  
