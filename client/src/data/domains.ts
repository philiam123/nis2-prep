export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface Domain {
  id: number;
  numeral: string;
  title: string;
  shortTitle: string;
  questions: string;
  icon: string;
  color: string;
  chapters: Chapter[];
}

export const domainData: Domain[] = [
  {
    id: 0,
    numeral: "0",
    title: "Gemensam introduktion",
    shortTitle: "Gemensam",
    questions: "~60 min",
    icon: "book-open",
    color: "#10B981",
    chapters: [
      {
        id: "A1",
        title: "Avsnitt 1: Vad är NIS2?",
        content: `
          <div class="concept-block">
            <h4>EU:s nya cybersäkerhetsdirektiv</h4>
            <p>NIS2 (Network and Information Systems Directive 2, officiellt direktiv 2022/2555) är EU:s uppdaterade cybersäkerhetsdirektiv som ersätter det ursprungliga NIS-direktivet från 2016. Syftet är att höja cybersäkerhetsnivån i hela EU genom att ställa strängare krav på fler sektorer och organisationer.</p>
            <ul>
              <li><strong>Antaget:</strong> 14 december 2022 av EU-parlamentet och rådet</li>
              <li><strong>Ersätter:</strong> NIS1-direktivet (2016/1148) som ansågs ha för stora skillnader i implementering mellan medlemsstaterna</li>
              <li><strong>I Sverige:</strong> Implementerat genom Cybersäkerhetslagen (2025:1506), i kraft den 15 januari 2026</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Tre huvudpelare</h4>
            <p>NIS2 vilar på tre grundläggande pelare som tillsammans skapar ett starkare cybersäkerhetsramverk:</p>
            <ul>
              <li><strong>Bredare omfattning:</strong> Från 7 till 18 sektorer. Fler organisationer omfattas, inklusive medelstora företag med 50+ anställda eller 10M€+ omsättning</li>
              <li><strong>Strängare krav:</strong> 10 obligatoriska säkerhetsåtgärder (artikel 21), striktare incidentrapportering, krav på ledningsansvar</li>
              <li><strong>Hårdare straff:</strong> Böter upp till 10 MEUR eller 2% av global omsättning. Personligt ansvar för ledningen</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>18 sektorer</h4>
            <p>NIS2 delar in sektorer i två kategorier:</p>
            <ul>
              <li><strong>Hög kritikalitet (Annex I):</strong> Energi, transport, bank, finansmarknadsinfrastruktur, hälso- och sjukvård, dricksvatten, avloppsvatten, digital infrastruktur, ICT-tjänsthantering, offentlig förvaltning, rymd</li>
              <li><strong>Andra kritiska sektorer (Annex II):</strong> Post och kurirtjänster, avfallshantering, kemikalier, livsmedel, tillverkning, digitala leverantörer, forskning</li>
            </ul>
          </div>

          <div class="key-takeaway">
            <strong>Viktigt att komma ihåg:</strong> Energisektorn klassas som en sektor av "hög kritikalitet" i Annex I. Det innebär att energibolag generellt betraktas som väsentliga verksamhetsutövare med strängare tillsyn.
          </div>
        `,
      },
      {
        id: "A2",
        title: "Avsnitt 2: Omfattas vi?",
        content: `
          <div class="concept-block">
            <h4>Energisektorn i NIS2</h4>
            <p>Energisektorn klassas som en sektor av hög kritikalitet (Annex I) i NIS2-direktivet. Inom elsektorn omfattas bland annat:</p>
            <ul>
              <li><strong>Distributionsnätsoperatörer:</strong> Företag som driver elnätet på lokal och regional nivå</li>
              <li><strong>Transmissionsnätsoperatörer:</strong> Företag som driver stamnätet (t.ex. Svenska Kraftnät)</li>
              <li><strong>Producenter:</strong> Elproducenter inklusive förnybar energi</li>
              <li><strong>Elhandlare:</strong> Företag som säljer el till slutkunder</li>
              <li><strong>Energilagring:</strong> Operatörer av energilagringssystem</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Storlekskrav</h4>
            <p>NIS2 använder EU:s standarddefinitioner för företagsstorlek. Som huvudregel omfattas:</p>
            <ul>
              <li><strong>Medelstora företag:</strong> 50+ anställda ELLER 10M€+ i omsättning</li>
              <li><strong>Stora företag:</strong> 250+ anställda ELLER 50M€+ i omsättning</li>
              <li><strong>Undantag:</strong> Vissa typer av organisationer omfattas oavsett storlek (t.ex. den enda leverantören av en kritisk tjänst i en medlemsstat)</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Väsentliga vs viktiga verksamhetsutövare</h4>
            <div class="study-table-wrapper">
              <table class="study-table">
                <thead>
                  <tr>
                    <th>Aspekt</th>
                    <th>Väsentlig</th>
                    <th>Viktig</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tillsyn</td>
                    <td>Proaktiv — regelbundna revisioner och inspektioner</td>
                    <td>Reaktiv — tillsyn vid misstanke om bristande efterlevnad</td>
                  </tr>
                  <tr>
                    <td>Böter (max)</td>
                    <td>10 MEUR eller 2% av global omsättning</td>
                    <td>7 MEUR eller 1,4% av global omsättning</td>
                  </tr>
                  <tr>
                    <td>Typiska sektorer</td>
                    <td>Energi, transport, bank, hälso- och sjukvård</td>
                    <td>Post, avfall, livsmedel, tillverkning</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="key-takeaway">
            <strong>Leverantörskedjan:</strong> Även om ditt företag inte direkt omfattas av NIS2 kan du påverkas indirekt. Organisationer som omfattas måste ställa cybersäkerhetskrav på sina underleverantörer. Om du levererar tjänster till kritisk infrastruktur kommer du sannolikt att behöva uppfylla krav från dina kunder.
          </div>
        `,
      },
      {
        id: "A3",
        title: "Avsnitt 3: De 10 säkerhetsåtgärderna",
        content: `
          <div class="concept-block">
            <h4>Artikel 21: Riskhanteringsåtgärder</h4>
            <p>NIS2 kräver ett "all-hazards approach" — alla typer av hot ska beaktas. Artikel 21 specificerar minst 10 åtgärdsområden som alla verksamhetsutövare måste implementera:</p>
          </div>

          <div class="concept-block">
            <h4>(a) Riskanalys och informationssäkerhetspolicy</h4>
            <p>Organisationen ska ha en dokumenterad policy för informationssäkerhet baserad på en systematisk riskanalys. Policyn ska regelbundet granskas och uppdateras.</p>
          </div>

          <div class="concept-block">
            <h4>(b) Incidenthantering</h4>
            <p>Processer för att upptäcka, hantera och rapportera cybersäkerhetsincidenter. Inkluderar larmrutiner, eskaleringsprocedurer och kommunikationsplaner.</p>
          </div>

          <div class="concept-block">
            <h4>(c) Kontinuitetsplanering</h4>
            <p>Backup-hantering, disaster recovery-planer och krishantering. Organisationen ska kunna upprätthålla verksamheten även vid en allvarlig incident.</p>
          </div>

          <div class="concept-block">
            <h4>(d) Leverantörssäkerhet</h4>
            <p>Krav på underleverantörer och tjänsteleverantörer. Inkluderar riskbedömning av leverantörskedjan och kontraktuella cybersäkerhetskrav.</p>
          </div>

          <div class="concept-block">
            <h4>(e) Säkerhet vid anskaffning, utveckling och underhåll</h4>
            <p>Cybersäkerhet ska beaktas vid anskaffning av nya system, vid systemutveckling och vid löpande underhåll. "Security by design" och "security by default".</p>
          </div>

          <div class="concept-block">
            <h4>(f) Utvärdering av åtgärdernas effektivitet</h4>
            <p>Regelbunden utvärdering och testning av säkerhetsåtgärder. Inkluderar penetrationstester, sårbarhetsskanningar och revisioner.</p>
          </div>

          <div class="concept-block">
            <h4>(g) Cyberhygien och utbildning</h4>
            <p>Grundläggande säkerhetsrutiner för alla anställda. Regelbunden utbildning och medvetenhetsträning om cyberhot.</p>
          </div>

          <div class="concept-block">
            <h4>(h) Kryptografi och kryptering</h4>
            <p>Policy för kryptografisk skydd av information. Kryptering av data i vila och under transport.</p>
          </div>

          <div class="concept-block">
            <h4>(i) Personalsäkerhet, åtkomstkontroll och tillgångshantering</h4>
            <p>Kontroll av vem som har tillgång till vad. Principer som "least privilege" och "need-to-know". Hantering av IT-tillgångar.</p>
          </div>

          <div class="concept-block">
            <h4>(j) Multifaktorautentisering och säker kommunikation</h4>
            <p>MFA ska användas för att skydda åtkomst till system. Säkra kommunikationskanaler för känslig information.</p>
          </div>

          <div class="key-takeaway">
            <strong>Kom ihåg:</strong> Alla 10 åtgärder är obligatoriska. Det räcker inte att vara bra på 8 av 10 — alla områden måste adresseras proportionerligt baserat på organisationens riskprofil.
          </div>
        `,
      },
      {
        id: "A4",
        title: "Avsnitt 4: Cyberhot i energisektorn",
        content: `
          <div class="concept-block">
            <h4>Ransomware — det största hotet</h4>
            <p>Ransomware är den vanligaste och mest kostsamma typen av cyberattack mot energisektorn:</p>
            <ul>
              <li><strong>Colonial Pipeline (2021):</strong> En ransomware-attack stängde ner den största bränsleledningen i USA i 6 dagar. 45% av östkustens bränsleförsörjning stoppades. Företaget betalade 4,4 miljoner USD i lösen.</li>
              <li><strong>+70% ökning</strong> av cyberattacker mot energisektorn under 2024, med 1 162 dokumenterade attacker i USA</li>
              <li><strong>Genomsnittlig kostnad:</strong> Ett dataintrång kostar i genomsnitt 4,88 miljoner USD (IBM Cost of a Data Breach 2024)</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Statsaktörer</h4>
            <p>Energisektorn är ett prioriterat mål för statsstödda hackergrupper:</p>
            <ul>
              <li><strong>Ryssland:</strong> Grupper som Sandworm och Dragonfly har utfört attacker mot energi-infrastruktur i Ukraina och Europa</li>
              <li><strong>Kina:</strong> APT-grupper riktar sig mot energisektorn för industrispionage</li>
              <li><strong>Iran:</strong> Attacker mot energi- och vatteninfrastruktur i Mellanöstern och globalt</li>
              <li><strong>Ukraina 2015/2016:</strong> Ryska hackare orsakade strömavbrott som drabbade hundratusentals hushåll</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>OT-attacker</h4>
            <p>Attacker mot operativ teknik (OT) är särskilt farliga i energisektorn:</p>
            <ul>
              <li>SCADA-system styr fysiska processer — en attack kan leda till strömavbrott, utrustningsskador eller säkerhetsrisker</li>
              <li>Phishing står för 84% av de inledande attackvektorerna i energisektorn</li>
              <li>OT-system är ofta äldre och svårare att uppdatera än IT-system</li>
            </ul>
          </div>

          <div class="key-takeaway">
            <strong>Svenska incidenter:</strong> Även Sverige drabbas. Attacker mot kommunal infrastruktur, IT-driftstörningar i regioner och energibolag visar att hotet är reellt även i Norden. Den ökande digitaliseringen av energisektorn skapar nya angreppspunkter.
          </div>
        `,
      },
    ],
  },
  {
    id: 1,
    numeral: "1",
    title: "Spår 1: Ledning & Styrelse",
    shortTitle: "Ledning & Styrelse",
    questions: "~45 min",
    icon: "shield",
    color: "#00D4FF",
    chapters: [
      {
        id: "A5",
        title: "Avsnitt 5: Ledningens ansvar",
        content: `
          <div class="concept-block">
            <h4>Artikel 20: Ledningens skyldigheter</h4>
            <p>NIS2 är tydligt: cybersäkerhet är en ledningsfråga, inte bara en IT-fråga. Artikel 20 fastställer att:</p>
            <ul>
              <li>Ledningen <strong>MÅSTE</strong> godkänna de cybersäkerhetsåtgärder som organisationen vidtar</li>
              <li>Ledningen <strong>MÅSTE</strong> övervaka genomförandet av åtgärderna</li>
              <li>Ledningen kan hållas <strong>personligt ansvarig</strong> vid bristande efterlevnad</li>
              <li>Ledningen <strong>SKA</strong> genomgå utbildning om cybersäkerhetsrisker och åtgärder</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Cybersäkerhetslagen 4 §</h4>
            <p>Den svenska Cybersäkerhetslagen (2025:1506) förtydligar i 4 § att:</p>
            <ul>
              <li>Ledningen i verksamhetsutövare ska genomgå utbildning om riskhanteringsåtgärder för cybersäkerhet</li>
              <li>Utbildningen ska ge tillräcklig kunskap för att identifiera risker och bedöma cybersäkerhetsåtgärder</li>
              <li>Alla anställda ska erbjudas regelbunden cybersäkerhetsutbildning</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Sanktioner</h4>
            <p>NIS2 inför betydligt hårdare sanktioner jämfört med NIS1:</p>
            <ul>
              <li><strong>Väsentliga verksamheter:</strong> Böter upp till 10 MEUR eller 2% av global omsättning (det högsta beloppet gäller)</li>
              <li><strong>Viktiga verksamheter:</strong> Böter upp till 7 MEUR eller 1,4% av global omsättning</li>
              <li><strong>Personligt ansvar:</strong> Ledningen kan tillfälligt förbjudas att utöva ledningsfunktioner</li>
              <li><strong>Offentliggörande:</strong> Tillsynsmyndigheten kan offentliggöra vilka organisationer som brister</li>
            </ul>
          </div>

          <div class="exam-tip">
            <strong>Praktiskt:</strong> Som ledningsperson bör du: (1) Upprätta en formell cybersäkerhetspolicy, (2) Utse en cybersäkerhetsansvarig (CISO eller motsvarande), (3) Budgetera tillräckliga resurser för cybersäkerhet, (4) Genomgå utbildning (som denna!), (5) Regelbundet granska cybersäkerhetsrapporter.
          </div>
        `,
      },
      {
        id: "A6",
        title: "Avsnitt 6: Incidentrapportering",
        content: `
          <div class="concept-block">
            <h4>Strikta tidsfrister</h4>
            <p>NIS2 inför strikta tidsfrister för rapportering av betydande cybersäkerhetsincidenter:</p>
            <ul>
              <li><strong>Inom 24 timmar:</strong> Tidig varning till tillsynsmyndigheten. Ska ange om incidenten misstänks vara orsakad av olagliga handlingar och om den kan ha gränsöverskridande påverkan.</li>
              <li><strong>Inom 72 timmar:</strong> Fullständig incidentanmälan med en initial bedömning av incidentens allvarlighetsgrad och påverkan, samt eventuella indikatorer på kompromettering (IoC).</li>
              <li><strong>Inom 1 månad:</strong> Slutrapport med detaljerad analys av incidenten, dess grundorsak, vidtagna åtgärder och lärdomar.</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Vem rapporterar till vem?</h4>
            <p>I Sverige är Myndigheten för samhällsskydd och beredskap (MSB) nationell kontaktpunkt. Beroende på sektor kan tillsynsmyndigheten vara:</p>
            <ul>
              <li><strong>Energisektorn:</strong> Energimyndigheten (tillsynsmyndighet), rapportering via MSB:s incidentrapporteringssystem</li>
              <li><strong>CERT-SE:</strong> Sveriges nationella CSIRT (Computer Security Incident Response Team) för teknisk hantering</li>
              <li><strong>Viktigt:</strong> Rapportering ska ske till tillsynsmyndigheten, som i sin tur samordnar med CERT-SE</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Vad är en "betydande incident"?</h4>
            <p>En incident anses vara betydande om den:</p>
            <ul>
              <li>Har orsakat eller kan orsaka allvarliga driftstörningar eller ekonomisk skada</li>
              <li>Har påverkat eller kan påverka andra fysiska eller juridiska personer genom att orsaka betydande materiell eller immateriell skada</li>
              <li>Drabbar konfidentialitet, integritet eller tillgänglighet på ett väsentligt sätt</li>
            </ul>
          </div>

          <div class="exam-tip">
            <strong>Dokumentation:</strong> Logga ALLA incidenter, även mindre sådana som inte uppfyller tröskeln för rapportering. God dokumentation visar tillsynsmyndigheten att ni har kontroll och hjälper er att upptäcka mönster och trender.
          </div>
        `,
      },
      {
        id: "A7",
        title: "Avsnitt 7: Leverantörs- och supply chain-säkerhet",
        content: `
          <div class="concept-block">
            <h4>NIS2 artikel 21(d)</h4>
            <p>Säkerhet i leverantörskedjan är ett obligatoriskt krav i NIS2. Organisationer måste:</p>
            <ul>
              <li>Identifiera och bedöma cybersäkerhetsrisker i sin leverantörskedja</li>
              <li>Ställa cybersäkerhetskrav på leverantörer och underleverantörer</li>
              <li>Säkerställa att leverantörer uppfyller avtalade säkerhetskrav</li>
              <li>Regelbundet granska leverantörers säkerhet</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Supply chain-attacker</h4>
            <p>Några av de mest förödande cyberattackerna har gått via leverantörskedjan:</p>
            <ul>
              <li><strong>SolarWinds (2020):</strong> Angripare komprometterade en mjukvaruuppdatering som distribuerades till 18 000 organisationer, inklusive amerikanska myndigheter</li>
              <li><strong>Kaseya (2021):</strong> Ransomware distribuerades via IT-managementprogramvara och drabbade 1 500+ företag</li>
              <li><strong>Kostnad:</strong> Supply chain-attacker beräknas kosta 138 miljarder USD per år globalt till 2031</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Praktiska åtgärder</h4>
            <ul>
              <li><strong>Riskbedömning:</strong> Klassificera leverantörer efter risk (kritiska vs icke-kritiska)</li>
              <li><strong>Kontraktuella krav:</strong> Inkludera cybersäkerhetskrav, rätt till revision och incidentrapporteringsklausuler i avtal</li>
              <li><strong>Fjärråtkomst:</strong> Leverantörer med fjärråtkomst till era system kräver extra övervakning — VPN, tidsbegränsade sessioner, loggning</li>
              <li><strong>Tredjepartskontroller:</strong> Begär certifieringar (ISO 27001) och genomför regelbundna granskningar</li>
            </ul>
          </div>

          <div class="key-takeaway">
            <strong>Energisektorn:</strong> Elkraftsentreprenörer och underleverantörer med fjärråtkomst till SCADA-system och stationsutrustning utgör särskilda risker. Varje leverantör med åtkomst till era kritiska system bör behandlas som en förlängning av er egen organisation.
          </div>
        `,
      },
    ],
  },
  {
    id: 2,
    numeral: "2",
    title: "Spår 2: All Personal",
    shortTitle: "All Personal",
    questions: "~60 min",
    icon: "users",
    color: "#0066FF",
    chapters: [
      {
        id: "A5",
        title: "Avsnitt 5: Lösenord och autentisering",
        content: `
          <div class="concept-block">
            <h4>Starka lösenord</h4>
            <p>Svaga och stulna lösenord är orsaken till 81% av dataintrång. Grundregler:</p>
            <ul>
              <li><strong>Minst 12 tecken</strong> — ju längre desto bättre</li>
              <li>Mix av versaler, gemener, siffror och specialtecken</li>
              <li>Använd aldrig samma lösenord på flera ställen</li>
              <li>Undvik personlig information (namn, födelsedatum, husdjur)</li>
              <li>Undvik vanliga lösenord ("Password123", "Qwerty", företagsnamn+år)</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Lösenordshanterare</h4>
            <p>En lösenordshanterare genererar och lagrar unika, starka lösenord för alla dina konton:</p>
            <ul>
              <li>Du behöver bara komma ihåg ETT huvudlösenord</li>
              <li>Exempel: Bitwarden (gratis, open source), 1Password, LastPass</li>
              <li>Många organisationer tillhandahåller lösenordshanterare till anställda</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Multifaktorautentisering (MFA)</h4>
            <p>NIS2 kräver MFA (artikel 21j). MFA innebär att du behöver mer än bara ett lösenord:</p>
            <ul>
              <li><strong>Något du vet:</strong> Lösenord eller PIN</li>
              <li><strong>Något du har:</strong> Telefon, säkerhetsnyckel (YubiKey)</li>
              <li><strong>Något du är:</strong> Fingeravtryck, ansiktsigenkänning</li>
            </ul>
            <p>Typer av MFA (från svagast till starkast):</p>
            <ul>
              <li><strong>SMS-kod:</strong> Bättre än ingenting, men kan kapas via SIM-swap</li>
              <li><strong>Autentiseringsapp:</strong> Microsoft Authenticator, Google Authenticator — genererar tidsbaserade engångskoder (TOTP)</li>
              <li><strong>Fysisk säkerhetsnyckel:</strong> YubiKey, Titan — starkaste skyddet, immunt mot phishing</li>
            </ul>
          </div>

          <div class="exam-tip">
            <strong>Praktiskt:</strong> Aktivera MFA på alla kritiska system. Börja med e-post och VPN — det tar bara 3 minuter att konfigurera en autentiseringsapp. Skriv aldrig ner lösenord på post-it-lappar vid skärmen!
          </div>
        `,
      },
      {
        id: "A6",
        title: "Avsnitt 6: Phishing och social engineering",
        content: `
          <div class="concept-block">
            <h4>Vad är phishing?</h4>
            <p>Phishing är den vanligaste attackmetoden och utgör den inledande attackvektorn i 84% av cyberangrepp mot energisektorn:</p>
            <ul>
              <li><strong>E-postphishing:</strong> Falska e-postmeddelanden som ser ut att komma från betrodda avsändare (bank, IT-avdelning, chef)</li>
              <li><strong>Spear phishing:</strong> Riktade attacker mot specifika personer med personanpassat innehåll</li>
              <li><strong>Vishing:</strong> Telefonbedrägerier — "Hej, jag ringer från IT-avdelningen, jag behöver ditt lösenord för att fixa ett problem..."</li>
              <li><strong>Smishing:</strong> SMS-bedrägerier med skadliga länkar</li>
              <li><strong>USB-attacker:</strong> Infekterade USB-minnen placerade vid arbetsplatser</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Varningstecken</h4>
            <p>Lär dig känna igen phishing-försök:</p>
            <ul>
              <li><strong>Brådska:</strong> "Ditt konto stängs om 24 timmar!" — angripare försöker skapa panik</li>
              <li><strong>Stavfel och dålig grammatik:</strong> Ofta (men inte alltid) tecken på bedrägeri</li>
              <li><strong>Oväntade bilagor:</strong> Speciellt .exe, .zip, eller makro-aktiverade dokument</li>
              <li><strong>Suspekta länkar:</strong> Hovra över länken (utan att klicka!) för att se den riktiga URL:en</li>
              <li><strong>Avvikande avsändaradress:</strong> Kontrollera avsändarens e-postadress noggrant</li>
              <li><strong>Ovanliga förfrågningar:</strong> Begäran om lösenord, bankuppgifter eller överföringar</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Skydda dig</h4>
            <ul>
              <li>Hovra över länkar innan du klickar — kontrollera URL:en</li>
              <li>Verifiera ovanliga förfrågningar via telefon (ring det kända numret, inte numret i e-postmeddelandet)</li>
              <li>Öppna aldrig bilagor från okända avsändare</li>
              <li>Rapportera ALLTID misstänkt phishing till IT-avdelningen</li>
              <li>Använd e-postfilter och anti-phishing-verktyg</li>
            </ul>
          </div>

          <div class="key-takeaway">
            <strong>Energisektorsexempel:</strong> En angripare skickar ett e-postmeddelande som ser ut att komma från Svenska Kraftnät med en "brådskande säkerhetsuppdatering". Bilagan innehåller skadlig kod som ger angriparen tillgång till interna system. Alltid verifiera med avsändaren via en separat kanal!
          </div>
        `,
      },
      {
        id: "A7",
        title: "Avsnitt 7: Incidenthantering i praktiken",
        content: `
          <div class="concept-block">
            <h4>Vad är en incident?</h4>
            <p>En cybersäkerhetsincident är varje händelse som hotar konfidentialitet, integritet eller tillgänglighet:</p>
            <ul>
              <li>Obehörig åtkomst till system eller data</li>
              <li>Malware-infektion (virus, ransomware, trojaner)</li>
              <li>Dataläckage — känslig information exponerad</li>
              <li>Driftstörning — system otillgängliga</li>
              <li>Phishing-attack som lyckats</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>5 steg vid incident</h4>
            <p>Följ dessa steg vid en misstänkt cybersäkerhetsincident:</p>
            <ul>
              <li><strong>Steg 1 — Upptäck och identifiera:</strong> Vad har hänt? Vilka system är drabbade? Dokumentera allt du observerar.</li>
              <li><strong>Steg 2 — Begränsa skadan:</strong> Isolera drabbade system (koppla bort från nätverket). Ändra INTE lösenord om du inte vet exakt vad som hänt — det kan förstöra bevis.</li>
              <li><strong>Steg 3 — Rapportera:</strong> Intern eskalering till IT-chef/CISO + extern rapportering enligt NIS2 (24h/72h/1 mån).</li>
              <li><strong>Steg 4 — Åtgärda:</strong> Ta bort hotet, patcha sårbarheter, återställ system från backup.</li>
              <li><strong>Steg 5 — Lär av incidenten:</strong> Uppföljningsmöte, dokumentera lärdomar, uppdatera rutiner.</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>"No-blame"-kultur</h4>
            <p>Det viktigaste för god incidenthantering är att skapa en kultur där medarbetare vågar rapportera:</p>
            <ul>
              <li>Rapportera utan rädsla för konsekvenser — det är inte fel att bli lurad av phishing, det är fel att inte rapportera det</li>
              <li>Snabb rapportering minimerar skadan — 10 minuter kan vara skillnaden mellan en liten incident och en katastrof</li>
              <li>Belöna rapportering, straffa aldrig den som rapporterar</li>
            </ul>
          </div>

          <div class="exam-tip">
            <strong>Kontaktlista:</strong> Ha alltid en aktuell kontaktlista tillgänglig: IT-chef/CISO, IT-support, extern incidenthanterare, tillsynsmyndigheten (MSB/Energimyndigheten), polisen (vid brott). Skriv ut listan — den ska fungera även om IT-systemen är nere.
          </div>
        `,
      },
      {
        id: "A8",
        title: "Avsnitt 8: IT/OT, fysisk säkerhet & kryptografi",
        content: `
          <div class="concept-block">
            <h4>IT = Informationsteknik</h4>
            <p>IT-system hanterar data och information:</p>
            <ul>
              <li>Datorer, servrar, nätverk, e-post, affärssystem</li>
              <li><strong>Prioritet:</strong> Konfidentialitet (skydda data)</li>
              <li>Livslängd: 3-5 år typiskt</li>
              <li>Uppdateringar: regelbundna patchar och uppdateringar</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>OT = Operativ Teknik</h4>
            <p>OT-system styr fysiska processer:</p>
            <ul>
              <li><strong>SCADA:</strong> Supervisory Control and Data Acquisition — övervakar och styr industriella processer</li>
              <li><strong>PLC:</strong> Programmable Logic Controller — styr enskilda maskiner</li>
              <li><strong>RTU:</strong> Remote Terminal Unit — fjärrstyrning av fältutrustning</li>
              <li><strong>HMI:</strong> Human-Machine Interface — operatörens gränssnitt</li>
              <li><strong>Prioritet:</strong> Tillgänglighet (systemet måste fungera)</li>
              <li>Livslängd: 15-30 år</li>
              <li>Äldre protokoll: Modbus, DNP3, IEC 61850</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>IT/OT-konvergens</h4>
            <p>Traditionellt var IT och OT separata världar. Idag kopplas de ihop, vilket skapar nya risker:</p>
            <ul>
              <li>Fjärrstyrning av OT via IT-nätverk möjliggör effektivitet men öppnar nya attackvägar</li>
              <li>Traditionell IT-säkerhet räcker inte för OT — t.ex. kan man inte alltid starta om ett SCADA-system</li>
              <li><strong>IEC 62443:</strong> International standard för industriell cybersäkerhet</li>
              <li><strong>Purdue-modellen:</strong> Segmentering av nätverk i nivåer för att separera IT och OT</li>
            </ul>
          </div>

          <div class="key-takeaway">
            <strong>Kom ihåg:</strong> I OT-världen prioriteras tillgänglighet och säkerhet (safety) framför konfidentialitet. En patch som kräver omstart av ett SCADA-system kan vara omöjlig att applicera under drift. IT- och OT-team måste samarbeta men förstå varandras prioriteringar.
          </div>
        
          <div class="concept-block">
            <h4>NIS2:s "all-hazards approach"</h4>
            <p>NIS2 kräver skydd mot alla typer av hot — inte bara digitala utan även fysiska. I energisektorn innebär det:</p>
            <ul>
              <li>Skydd av driftmiljöer: stationer, ställverk, kontrollrum</li>
              <li>Fysisk säkerhet är första försvarslinjen för OT-system</li>
              <li>Många OT-attacker kräver eller underlättas av fysisk åtkomst</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Åtkomstkontroll</h4>
            <p>Vem får fysisk åtkomst till styrsystem och kritiska anläggningar?</p>
            <ul>
              <li><strong>Passersystem:</strong> Elektroniska passerkort med loggning av in- och utpassering</li>
              <li><strong>Besökspolicy:</strong> Besökare ska alltid eskorteras och dokumenteras</li>
              <li><strong>USB-policy:</strong> Inga obehöriga USB-enheter i OT-system — USB-portar bör vara blockerade eller övervakade</li>
              <li><strong>Kameror och larm:</strong> Övervakning av kritiska utrymmen</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>Fjärråtkomst till OT</h4>
            <p>Fjärråtkomst till OT-system är ofta nödvändig men måste hanteras noggrant:</p>
            <ul>
              <li><strong>VPN:</strong> All fjärråtkomst via krypterad VPN-tunnel</li>
              <li><strong>Tidsbegränsade sessioner:</strong> Åtkomst ska vara tidsbegränsad och godkännas per tillfälle</li>
              <li><strong>Loggning:</strong> All fjärråtkomst ska loggas och kunna granskas</li>
              <li><strong>MFA:</strong> Kräv multifaktorautentisering för all fjärråtkomst</li>
            </ul>
          </div>

          <div class="exam-tip">
            <strong>Tänk på:</strong> En angripare som får fysisk tillgång till ett kontrollrum kan göra enorma skador på kort tid. Fysisk säkerhet och cybersäkerhet måste samverka — det räcker inte med den ena utan den andra.
          </div>
        
          <div class="concept-block">
            <h4>Grundläggande kryptering</h4>
            <p>NIS2 artikel 21(h) kräver en kryptografipolicy. Kryptering skyddar data genom att göra den oläslig för obehöriga:</p>
            <ul>
              <li><strong>Data i vila:</strong> Information lagrad på hårddiskar, servrar, databaser — skyddas med kryptering (AES-256)</li>
              <li><strong>Data under transport:</strong> Information som skickas mellan system — skyddas med TLS/SSL</li>
              <li><strong>Data under bearbetning:</strong> Information som bearbetas i minnet — nyare tekniker som confidential computing</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>TLS/SSL och VPN</h4>
            <p>Grundläggande teknologier för säker kommunikation:</p>
            <ul>
              <li><strong>TLS (Transport Layer Security):</strong> Skyddar kommunikation över internet. Webbplatser med "https://" använder TLS. Kontrollera alltid att det finns ett lås i webbläsarens adressfält.</li>
              <li><strong>VPN (Virtual Private Network):</strong> Skapar en krypterad tunnel för säker fjärråtkomst till företagets nätverk. Obligatoriskt för distansarbete och fjärråtkomst till OT-system.</li>
              <li><strong>E-postkryptering:</strong> Verktyg som S/MIME och PGP för att skydda känslig kommunikation via e-post</li>
            </ul>
          </div>

          <div class="concept-block">
            <h4>GDPR-koppling</h4>
            <p>Kryptering är också viktig för GDPR-efterlevnad:</p>
            <ul>
              <li>Personuppgifter kräver särskilt skydd — kryptering är en rekommenderad teknisk åtgärd</li>
              <li>Krypterade data som läcks kan i vissa fall anses vara mindre allvarligt vid en dataintrångsanmälan</li>
              <li>NIS2 och GDPR kompletterar varandra — cybersäkerhet skyddar även personuppgifter</li>
            </ul>
          </div>

          <div class="key-takeaway">
            <strong>Praktiskt:</strong> I en energiorganisation bör följande krypteras: (1) All kommunikation med SCADA-system, (2) VPN för all fjärråtkomst, (3) E-post med känslig information, (4) Databaser med kunduppgifter, (5) Backup-kopior, (6) Bärbara enheter (laptops, USB-minnen).
          </div>
        `,
      },
    ],
  },
];
