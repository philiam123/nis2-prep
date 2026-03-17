export interface Question {
  domain: number;
  subtopic: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const allQuestions: Question[] = [
  // ========== Modul 1: Vad är NIS2? ==========
  {
    domain: 1, subtopic: "M1",
    question: "Vilket EU-direktiv ersätter NIS2?",
    options: ["GDPR (2016/679)", "NIS1 (2016/1148)", "eIDAS (2014/910)", "DORA (2022/2554)"],
    correct: 1,
    explanation: "NIS2 (2022/2555) ersätter det ursprungliga NIS-direktivet (2016/1148) som ansågs ha för stora skillnader i implementering mellan EU:s medlemsstater."
  },
  {
    domain: 1, subtopic: "M1",
    question: "Vad heter den svenska lag som implementerar NIS2?",
    options: ["Dataskyddslagen", "Cybersäkerhetslagen (2025:1506)", "Säkerhetsskyddslagen", "IT-säkerhetslagen"],
    correct: 1,
    explanation: "I Sverige implementeras NIS2 genom Cybersäkerhetslagen (2025:1506) som trädde i kraft den 15 januari 2026."
  },
  {
    domain: 1, subtopic: "M1",
    question: "Hur många sektorer täcker NIS2-direktivet?",
    options: ["7 sektorer", "12 sektorer", "18 sektorer", "25 sektorer"],
    correct: 2,
    explanation: "NIS2 utökar omfattningen från 7 sektorer (under NIS1) till 18 sektorer, uppdelade i sektorer av hög kritikalitet (Annex I) och andra kritiska sektorer (Annex II)."
  },
  {
    domain: 1, subtopic: "M1",
    question: "Vilka tre huvudpelare vilar NIS2 på?",
    options: [
      "Kryptering, autentisering och loggning",
      "Bredare omfattning, strängare krav och hårdare straff",
      "Prevention, detektion och respons",
      "Fysisk säkerhet, digital säkerhet och personalsäkerhet"
    ],
    correct: 1,
    explanation: "NIS2:s tre huvudpelare är: bredare omfattning (18 sektorer), strängare krav (10 obligatoriska åtgärder) och hårdare straff (böter upp till 10 MEUR)."
  },
  {
    domain: 1, subtopic: "M1",
    question: "När trädde den svenska Cybersäkerhetslagen i kraft?",
    options: ["1 januari 2025", "15 januari 2026", "1 juli 2026", "1 januari 2027"],
    correct: 1,
    explanation: "Cybersäkerhetslagen (2025:1506) trädde i kraft den 15 januari 2026, vilket implementerar NIS2-direktivet i svensk lagstiftning."
  },
  {
    domain: 1, subtopic: "M1",
    question: "Vilken kategori tillhör energisektorn i NIS2?",
    options: ["Andra kritiska sektorer (Annex II)", "Sektor av hög kritikalitet (Annex I)", "Frivillig sektor", "Stödjande sektor"],
    correct: 1,
    explanation: "Energisektorn klassas som en sektor av hög kritikalitet i Annex I, vilket innebär strängare tillsyn och högre bötesbelopp."
  },
  {
    domain: 1, subtopic: "M1",
    question: "Vad var det huvudsakliga problemet med NIS1 som NIS2 adresserar?",
    options: [
      "NIS1 täckte för många sektorer",
      "NIS1 hade för höga böter",
      "NIS1 hade för stora skillnader i implementering mellan medlemsstater",
      "NIS1 saknade krav på kryptering"
    ],
    correct: 2,
    explanation: "NIS1 kritiserades för att medlemsstaterna implementerade direktivet mycket olika, vilket ledde till ojämn cybersäkerhetsnivå inom EU."
  },
  {
    domain: 1, subtopic: "M1",
    question: "Vilket år antogs NIS2-direktivet av EU?",
    options: ["2020", "2021", "2022", "2024"],
    correct: 2,
    explanation: "NIS2-direktivet (2022/2555) antogs den 14 december 2022 av EU-parlamentet och rådet."
  },

  // ========== Modul 2: Omfattas vi? ==========
  {
    domain: 1, subtopic: "M2",
    question: "Vilka av följande aktörer i elsektorn omfattas av NIS2?",
    options: [
      "Enbart stamnätsoperatörer",
      "Distributionsnätsoperatörer, transmissionsnätsoperatörer, producenter och elhandlare",
      "Enbart elproducenter",
      "Enbart företag med mer än 250 anställda"
    ],
    correct: 1,
    explanation: "NIS2 omfattar ett brett spektrum av aktörer i elsektorn: distributionsnätsoperatörer, transmissionsnätsoperatörer, producenter, elhandlare och operatörer av energilagringssystem."
  },
  {
    domain: 1, subtopic: "M2",
    question: "Vad är storlekströskeln för att omfattas av NIS2 som huvudregel?",
    options: [
      "10+ anställda eller 1M€+ omsättning",
      "50+ anställda eller 10M€+ omsättning",
      "250+ anställda eller 50M€+ omsättning",
      "Alla företag oavsett storlek"
    ],
    correct: 1,
    explanation: "NIS2 använder EU:s definition av medelstort företag: 50+ anställda ELLER 10M€+ i årsomsättning. Vissa organisationer kan dock omfattas oavsett storlek."
  },
  {
    domain: 1, subtopic: "M2",
    question: "Vad är den maximala bötesnivån för väsentliga verksamhetsutövare under NIS2?",
    options: [
      "1 MEUR eller 0,5% av omsättning",
      "5 MEUR eller 1% av omsättning",
      "7 MEUR eller 1,4% av omsättning",
      "10 MEUR eller 2% av global omsättning"
    ],
    correct: 3,
    explanation: "Väsentliga verksamhetsutövare kan bötfällas med upp till 10 MEUR eller 2% av den globala årsomsättningen, beroende på vilket belopp som är högst."
  },
  {
    domain: 1, subtopic: "M2",
    question: "Vad skiljer tillsynen av väsentliga från viktiga verksamhetsutövare?",
    options: [
      "Det finns ingen skillnad i tillsyn",
      "Väsentliga har proaktiv tillsyn med regelbundna revisioner; viktiga har reaktiv tillsyn",
      "Viktiga har strängare tillsyn än väsentliga",
      "Väsentliga övervakas bara vid incidenter"
    ],
    correct: 1,
    explanation: "Väsentliga verksamhetsutövare utsätts för proaktiv tillsyn med regelbundna revisioner och inspektioner, medan viktiga verksamhetsutövare har reaktiv tillsyn som aktiveras vid misstanke om bristande efterlevnad."
  },
  {
    domain: 1, subtopic: "M2",
    question: "Hur påverkas underleverantörer till kritisk infrastruktur av NIS2?",
    options: [
      "De påverkas inte alls",
      "De kan påverkas indirekt genom krav från sina kunder som omfattas av NIS2",
      "De måste registrera sig som väsentliga verksamhetsutövare",
      "De behöver bara följa GDPR"
    ],
    correct: 1,
    explanation: "Även om underleverantörer inte direkt omfattas av NIS2 påverkas de indirekt. Organisationer som omfattas måste ställa cybersäkerhetskrav på sina leverantörer enligt artikel 21(d)."
  },
  {
    domain: 1, subtopic: "M2",
    question: "Vad är den maximala bötesnivån för viktiga verksamhetsutövare?",
    options: [
      "3 MEUR eller 0,5% av omsättning",
      "5 MEUR eller 1% av omsättning",
      "7 MEUR eller 1,4% av global omsättning",
      "10 MEUR eller 2% av global omsättning"
    ],
    correct: 2,
    explanation: "Viktiga verksamhetsutövare kan bötfällas med upp till 7 MEUR eller 1,4% av den globala årsomsättningen."
  },

  // ========== Modul 3: Ledningens ansvar ==========
  {
    domain: 1, subtopic: "M3",
    question: "Vilken artikel i NIS2 fastställer ledningens skyldigheter?",
    options: ["Artikel 6", "Artikel 12", "Artikel 20", "Artikel 30"],
    correct: 2,
    explanation: "Artikel 20 i NIS2 fastställer att ledningen måste godkänna cybersäkerhetsåtgärder, övervaka genomförandet och kan hållas personligt ansvarig."
  },
  {
    domain: 1, subtopic: "M3",
    question: "Kan ledningspersoner hållas personligt ansvariga under NIS2?",
    options: [
      "Nej, bara organisationen kan bötfällas",
      "Ja, ledningen kan tillfälligt förbjudas att utöva ledningsfunktioner",
      "Bara om det rör sig om dataskyddsbrott",
      "Bara i länder som specifikt valt att implementera det"
    ],
    correct: 1,
    explanation: "Under NIS2 kan ledningen hållas personligt ansvarig och tillfälligt förbjudas att utöva ledningsfunktioner vid allvarliga brister i cybersäkerhetsarbetet."
  },
  {
    domain: 1, subtopic: "M3",
    question: "Vad säger 4 § i Cybersäkerhetslagen om ledningens utbildning?",
    options: [
      "Ledningen behöver inte utbildas",
      "Bara IT-chefen behöver utbildning",
      "Ledningen ska genomgå utbildning om riskhanteringsåtgärder för cybersäkerhet",
      "Utbildning krävs bara vid incidenter"
    ],
    correct: 2,
    explanation: "4 § Cybersäkerhetslagen kräver att ledningen genomgår utbildning om riskhanteringsåtgärder för cybersäkerhet, och att alla anställda erbjuds regelbunden cybersäkerhetsutbildning."
  },
  {
    domain: 1, subtopic: "M3",
    question: "Vilka praktiska åtgärder bör en ledningsperson vidta enligt NIS2?",
    options: [
      "Delegera allt cybersäkerhetsarbete till IT-avdelningen",
      "Upprätta cybersäkerhetspolicy, utse ansvarig, budgetera resurser och genomgå utbildning",
      "Enbart installera antivirusprogram",
      "Vänta på att tillsynsmyndigheten ger instruktioner"
    ],
    correct: 1,
    explanation: "Ledningen bör: upprätta en formell cybersäkerhetspolicy, utse en CISO eller cybersäkerhetsansvarig, budgetera tillräckliga resurser, genomgå utbildning och regelbundet granska cybersäkerhetsrapporter."
  },
  {
    domain: 1, subtopic: "M3",
    question: "Vad innebär NIS2 för cybersäkerhet som ämne i organisationen?",
    options: [
      "Det förblir enbart en IT-fråga",
      "Det blir en lednings- och styrelsefråga med personligt ansvar",
      "Det behöver bara behandlas vid årsstämman",
      "Det delegeras till externa konsulter"
    ],
    correct: 1,
    explanation: "NIS2 lyfter uttryckligen cybersäkerhet från att vara enbart en IT-fråga till att vara en lednings- och styrelsefråga med personligt ansvar för ledningspersoner."
  },

  // ========== Modul 4: De 10 säkerhetsåtgärderna ==========
  {
    domain: 1, subtopic: "M4",
    question: "Hur många obligatoriska säkerhetsåtgärder specificerar NIS2 artikel 21?",
    options: ["5", "8", "10", "15"],
    correct: 2,
    explanation: "Artikel 21 specificerar minst 10 åtgärdsområden som alla verksamhetsutövare måste implementera som del av ett all-hazards approach."
  },
  {
    domain: 1, subtopic: "M4",
    question: "Vad innebär NIS2:s 'all-hazards approach'?",
    options: [
      "Fokusera bara på de vanligaste hoten",
      "Alla typer av hot ska beaktas, inte bara digitala",
      "Enbart fysiska hot ska beaktas",
      "Bara hot som har hänt tidigare ska beaktas"
    ],
    correct: 1,
    explanation: "NIS2:s all-hazards approach innebär att organisationer måste beakta alla typer av hot — cyberattacker, fysiska hot, naturkatastrofer, leverantörsproblem med mera."
  },
  {
    domain: 1, subtopic: "M4",
    question: "Vilken av följande är INTE en av de 10 obligatoriska åtgärderna i NIS2 artikel 21?",
    options: [
      "Incidenthantering",
      "Leverantörssäkerhet",
      "Obligatorisk cyberförsäkring",
      "Kryptografi och kryptering"
    ],
    correct: 2,
    explanation: "Obligatorisk cyberförsäkring är inte en del av de 10 åtgärderna i artikel 21. De faktiska åtgärderna inkluderar bl.a. riskanalys, incidenthantering, kontinuitetsplanering, leverantörssäkerhet och kryptografi."
  },
  {
    domain: 1, subtopic: "M4",
    question: "Artikel 21(d) handlar om vilken typ av säkerhet?",
    options: ["Personalsäkerhet", "Leverantörssäkerhet", "Kryptografi", "Incidenthantering"],
    correct: 1,
    explanation: "Artikel 21(d) handlar om leverantörssäkerhet — krav på underleverantörer och tjänsteleverantörer, inklusive riskbedömning av leverantörskedjan."
  },
  {
    domain: 1, subtopic: "M4",
    question: "Vad innebär åtgärd (g) i artikel 21?",
    options: [
      "Kryptografi och kryptering",
      "Kontinuitetsplanering",
      "Cyberhygien och utbildning för alla anställda",
      "Incidentrapportering"
    ],
    correct: 2,
    explanation: "Åtgärd (g) handlar om grundläggande cyberhygien och utbildning — grundläggande säkerhetsrutiner för alla anställda och regelbunden medvetenhetsträning."
  },
  {
    domain: 1, subtopic: "M4",
    question: "Räcker det att uppfylla 8 av 10 säkerhetsåtgärder?",
    options: [
      "Ja, 80% räcker för godkänt",
      "Nej, alla 10 åtgärder är obligatoriska",
      "Ja, om de 8 täcker de viktigaste riskerna",
      "Det beror på organisationens storlek"
    ],
    correct: 1,
    explanation: "Alla 10 åtgärder är obligatoriska. Det räcker inte att vara bra på 8 av 10 — alla områden måste adresseras proportionerligt baserat på organisationens riskprofil."
  },

  // ========== Modul 5: Incidentrapportering ==========
  {
    domain: 1, subtopic: "M5",
    question: "Inom vilken tidsfrist ska en tidig varning skickas till tillsynsmyndigheten?",
    options: ["Inom 12 timmar", "Inom 24 timmar", "Inom 48 timmar", "Inom 72 timmar"],
    correct: 1,
    explanation: "En tidig varning ska skickas till tillsynsmyndigheten inom 24 timmar efter att en betydande incident upptäckts."
  },
  {
    domain: 1, subtopic: "M5",
    question: "Inom vilken tidsfrist ska en fullständig incidentanmälan lämnas?",
    options: ["Inom 24 timmar", "Inom 48 timmar", "Inom 72 timmar", "Inom 1 vecka"],
    correct: 2,
    explanation: "En fullständig incidentanmälan med initial bedömning av allvarlighetsgrad och påverkan ska lämnas inom 72 timmar."
  },
  {
    domain: 1, subtopic: "M5",
    question: "Inom vilken tidsfrist ska slutrapporten lämnas efter en incident?",
    options: ["Inom 1 vecka", "Inom 2 veckor", "Inom 1 månad", "Inom 3 månader"],
    correct: 2,
    explanation: "En slutrapport med detaljerad analys, grundorsak, vidtagna åtgärder och lärdomar ska lämnas inom 1 månad efter incidenten."
  },
  {
    domain: 1, subtopic: "M5",
    question: "Vad anses vara en 'betydande incident' enligt NIS2?",
    options: [
      "Alla incidenter oavsett storlek",
      "En incident som orsakat eller kan orsaka allvarlig driftstörning eller ekonomisk skada",
      "Enbart incidenter som leder till dataintrång",
      "Enbart incidenter orsakade av statsaktörer"
    ],
    correct: 1,
    explanation: "En betydande incident är en som har orsakat eller kan orsaka allvarliga driftstörningar, ekonomisk skada, eller som har påverkat eller kan påverka andra personer genom betydande skada."
  },
  {
    domain: 1, subtopic: "M5",
    question: "Vilken myndighet är tillsynsmyndighet för energisektorn i Sverige under NIS2?",
    options: ["Datainspektionen", "Säkerhetspolisen", "Energimyndigheten", "Riksbanken"],
    correct: 2,
    explanation: "Energimyndigheten är tillsynsmyndighet för energisektorn i Sverige. Rapportering sker via MSB:s incidentrapporteringssystem, och CERT-SE hanterar den tekniska sidan."
  },
  {
    domain: 1, subtopic: "M5",
    question: "Bör organisationen logga även mindre incidenter som inte uppfyller rapporteringströskeln?",
    options: [
      "Nej, bara betydande incidenter ska loggas",
      "Ja, alla incidenter ska loggas för att visa kontroll och upptäcka mönster",
      "Bara om tillsynsmyndigheten kräver det",
      "Enbart om de leder till ekonomisk skada"
    ],
    correct: 1,
    explanation: "God praxis är att logga alla incidenter, även mindre sådana. Det visar tillsynsmyndigheten att organisationen har kontroll och hjälper att upptäcka mönster och trender."
  },

  // ========== Modul 6: Cyberhot i energisektorn ==========
  {
    domain: 2, subtopic: "M6",
    question: "Vilken incident 2021 stängde ner 45% av USA:s östkustbränsle i 6 dagar?",
    options: ["SolarWinds-attacken", "Colonial Pipeline ransomware-attacken", "Log4j-sårbarheten", "Kaseya-attacken"],
    correct: 1,
    explanation: "Colonial Pipeline-attacken (maj 2021) var en ransomware-attack som tvingade företaget att stänga den största bränsleledningen i USA i 6 dagar. Företaget betalade 4,4 miljoner USD i lösen."
  },
  {
    domain: 2, subtopic: "M6",
    question: "Med hur många procent ökade cyberattacker mot energisektorn under 2024?",
    options: ["20%", "40%", "70%", "100%"],
    correct: 2,
    explanation: "Cyberattacker mot energisektorn ökade med över 70% under 2024, med 1 162 dokumenterade attacker i USA."
  },
  {
    domain: 2, subtopic: "M6",
    question: "Vilken attackvektor står för 84% av inledande attacker mot energisektorn?",
    options: ["Brute force-attacker", "Fysiskt intrång", "Phishing", "Zero-day-exploits"],
    correct: 2,
    explanation: "Phishing (nätfiske) står för 84% av de inledande attackvektorerna i energisektorn, vilket gör det till det i särklass vanligaste sättet att ta sig in i organisationer."
  },
  {
    domain: 2, subtopic: "M6",
    question: "Vad är den genomsnittliga kostnaden för ett dataintrång enligt IBM 2024?",
    options: ["1,2 miljoner USD", "2,5 miljoner USD", "4,88 miljoner USD", "8,5 miljoner USD"],
    correct: 2,
    explanation: "Enligt IBM Cost of a Data Breach Report 2024 kostar ett dataintrång i genomsnitt 4,88 miljoner USD globalt."
  },
  {
    domain: 2, subtopic: "M6",
    question: "Vilka statsaktörer nämns ofta som hot mot energisektorn?",
    options: [
      "Enbart Kina",
      "Ryssland, Kina och Iran",
      "Enbart Nordkorea",
      "Inga statsaktörer hotar energisektorn"
    ],
    correct: 1,
    explanation: "Ryssland (Sandworm, Dragonfly), Kina (APT-grupper) och Iran riktar sig aktivt mot energi-infrastruktur för sabotage och spionage."
  },
  {
    domain: 2, subtopic: "M6",
    question: "Varför är OT-attacker särskilt farliga i energisektorn?",
    options: [
      "De kostar alltid mer pengar",
      "De kan orsaka strömavbrott, utrustningsskador och fysiska säkerhetsrisker",
      "De är alltid permanenta",
      "De påverkar bara databaser"
    ],
    correct: 1,
    explanation: "OT-attacker mot SCADA-system i energisektorn kan ha fysiska konsekvenser — strömavbrott som drabbar samhället, skador på generatorer och transformatorer, och i värsta fall säkerhetsrisker."
  },
  {
    domain: 2, subtopic: "M6",
    question: "Vad hände i Ukraina 2015 relaterat till cybersäkerhet i energisektorn?",
    options: [
      "En stor dataläcka av kunduppgifter",
      "Ryska hackare orsakade strömavbrott som drabbade hundratusentals hushåll",
      "En ransomware-attack mot ett kärnkraftverk",
      "Inget cybersäkerhetsrelaterat"
    ],
    correct: 1,
    explanation: "I december 2015 genomförde ryska hackare (gruppen Sandworm) en cyberattack mot Ukrainas elnät som ledde till strömavbrott för cirka 230 000 hushåll — den första kända cyberattacken som orsakade ett strömavbrott."
  },

  // ========== Modul 7: IT vs OT-säkerhet ==========
  {
    domain: 2, subtopic: "M7",
    question: "Vad står SCADA för?",
    options: [
      "Secure Controlled Access Data Architecture",
      "Supervisory Control and Data Acquisition",
      "System Control and Database Administration",
      "Standardized Cyber Attack Defense Architecture"
    ],
    correct: 1,
    explanation: "SCADA står för Supervisory Control and Data Acquisition — system som övervakar och styr industriella processer i realtid."
  },
  {
    domain: 2, subtopic: "M7",
    question: "Vad prioriteras högst i OT-miljöer?",
    options: ["Konfidentialitet", "Tillgänglighet", "Integritet", "Skalbarhet"],
    correct: 1,
    explanation: "I OT-miljöer prioriteras tillgänglighet (availability) högst — systemet måste fungera och vara tillgängligt. I IT-miljöer prioriteras ofta konfidentialitet istället."
  },
  {
    domain: 2, subtopic: "M7",
    question: "Vilken standard gäller specifikt för industriell cybersäkerhet?",
    options: ["ISO 27001", "IEC 62443", "GDPR", "PCI DSS"],
    correct: 1,
    explanation: "IEC 62443 är den internationella standarden specifikt utformad för cybersäkerhet i industriella automatiserings- och styrsystem (OT/ICS)."
  },
  {
    domain: 2, subtopic: "M7",
    question: "Vad är Purdue-modellen?",
    options: [
      "En riskanalysmetod",
      "En modell för nätverkssegmentering som separerar IT och OT i nivåer",
      "Ett krypteringsprotokoll för OT",
      "En standard för incidentrapportering"
    ],
    correct: 1,
    explanation: "Purdue-modellen (Purdue Enterprise Reference Architecture) är en referensmodell som delar upp nätverk i nivåer (0-5) för att segmentera och separera IT- och OT-nätverk."
  },
  {
    domain: 2, subtopic: "M7",
    question: "Hur lång livslängd har typiskt OT-system?",
    options: ["1-3 år", "3-5 år", "5-10 år", "15-30 år"],
    correct: 3,
    explanation: "OT-system har ofta en livslängd på 15-30 år, mycket längre än typiska IT-system. Det innebär att många OT-system kör äldre programvara och protokoll som kan vara svåra att uppdatera."
  },
  {
    domain: 2, subtopic: "M7",
    question: "Varför skapar IT/OT-konvergens nya säkerhetsrisker?",
    options: [
      "IT-system blir långsammare",
      "OT-system som tidigare var isolerade kopplas nu till IT-nätverk och internet",
      "Det minskar kostnader och därmed säkerhetsbudgeten",
      "IT/OT-konvergens skapar inga nya risker"
    ],
    correct: 1,
    explanation: "IT/OT-konvergens innebär att OT-system som tidigare var isolerade (air-gapped) nu kopplas till IT-nätverk för fjärrstyrning och effektivitet. Det öppnar nya attackvägar mot kritiska styrsystem."
  },
  {
    domain: 2, subtopic: "M7",
    question: "Vilka protokoll är vanliga i äldre OT-miljöer?",
    options: [
      "HTTP och HTTPS",
      "Modbus och DNP3",
      "REST och GraphQL",
      "SSH och SFTP"
    ],
    correct: 1,
    explanation: "Modbus och DNP3 är vanliga OT-protokoll som utvecklades utan säkerhet i åtanke. De saknar ofta autentisering och kryptering, vilket gör dem sårbara."
  },

  // ========== Modul 8: Lösenord och autentisering ==========
  {
    domain: 2, subtopic: "M8",
    question: "Hur många procent av dataintrång beror på svaga eller stulna lösenord?",
    options: ["45%", "63%", "81%", "95%"],
    correct: 2,
    explanation: "Enligt studier beror 81% av dataintrång på svaga, återanvända eller stulna lösenord, vilket gör lösenordssäkerhet till en av de viktigaste åtgärderna."
  },
  {
    domain: 2, subtopic: "M8",
    question: "Vilken artikel i NIS2 kräver multifaktorautentisering (MFA)?",
    options: ["Artikel 21(a)", "Artikel 21(g)", "Artikel 21(j)", "Artikel 25"],
    correct: 2,
    explanation: "Artikel 21(j) kräver multifaktorautentisering (MFA) och säker kommunikation som del av de obligatoriska säkerhetsåtgärderna."
  },
  {
    domain: 2, subtopic: "M8",
    question: "Vilken typ av MFA ger starkast skydd?",
    options: ["SMS-kod", "E-postverifiering", "Autentiseringsapp (TOTP)", "Fysisk säkerhetsnyckel (YubiKey)"],
    correct: 3,
    explanation: "Fysiska säkerhetsnycklar som YubiKey ger det starkaste MFA-skyddet och är immuna mot phishing-attacker. SMS-koder kan kapas via SIM-swap."
  },
  {
    domain: 2, subtopic: "M8",
    question: "Vad är det rekommenderade minimumet för lösenordslängd?",
    options: ["6 tecken", "8 tecken", "12 tecken", "20 tecken"],
    correct: 2,
    explanation: "Rekommendationen är minst 12 tecken med en mix av versaler, gemener, siffror och specialtecken. Längre lösenord är exponentiellt svårare att knäcka."
  },
  {
    domain: 2, subtopic: "M8",
    question: "Vad gör en lösenordshanterare?",
    options: [
      "Den hackar andras lösenord",
      "Den genererar och lagrar unika, starka lösenord för alla konton",
      "Den skickar lösenord via e-post",
      "Den tar bort behovet av lösenord helt"
    ],
    correct: 1,
    explanation: "En lösenordshanterare genererar och lagrar unika, starka lösenord för alla dina konton i ett krypterat valv. Du behöver bara komma ihåg ett huvudlösenord."
  },
  {
    domain: 2, subtopic: "M8",
    question: "Varför är SMS-baserad MFA svagare än autentiseringsappar?",
    options: [
      "SMS är långsammare",
      "SMS-koder kan kapas via SIM-swap-attacker",
      "SMS kräver internetanslutning",
      "Autentiseringsappar är billigare"
    ],
    correct: 1,
    explanation: "SMS-koder kan kapas genom SIM-swap-attacker, där angriparen övertar offrets telefonnummer. Autentiseringsappar genererar koder lokalt och är därför säkrare."
  },
  {
    domain: 2, subtopic: "M8",
    question: "Vilka tre faktorer kan användas för multifaktorautentisering?",
    options: [
      "Namn, e-post och telefonnummer",
      "Något du vet, något du har och något du är",
      "Lösenord, PIN och hemlig fråga",
      "Dator, telefon och surfplatta"
    ],
    correct: 1,
    explanation: "MFA baseras på tre faktorer: något du vet (lösenord/PIN), något du har (telefon/säkerhetsnyckel) och något du är (biometri som fingeravtryck/ansiktsigenkänning)."
  },

  // ========== Modul 9: Phishing och social engineering ==========
  {
    domain: 2, subtopic: "M9",
    question: "Vad är spear phishing?",
    options: [
      "Massutsändning av phishing-mail till alla anställda",
      "Riktade phishing-attacker mot specifika personer med personanpassat innehåll",
      "Phishing via sociala medier",
      "Phishing som bara riktas mot chefer"
    ],
    correct: 1,
    explanation: "Spear phishing är riktade attacker mot specifika individer, ofta med personanpassat innehåll baserat på information om offret, dess roll och organisation."
  },
  {
    domain: 2, subtopic: "M9",
    question: "Vad är vishing?",
    options: ["Phishing via video", "Telefonbedrägerier", "Phishing via VPN", "Phishing via sociala medier"],
    correct: 1,
    explanation: "Vishing (voice phishing) är telefonbedrägerier där angriparen ringer och utger sig för att vara t.ex. IT-support och försöker få offret att avslöja lösenord eller annan känslig information."
  },
  {
    domain: 2, subtopic: "M9",
    question: "Vad bör du göra om du misstänker att ett e-postmeddelande är phishing?",
    options: [
      "Klicka på länken för att verifiera",
      "Svara och fråga om det är äkta",
      "Rapportera till IT-avdelningen och radera meddelandet",
      "Vidarebefordra till alla kollegor som varning"
    ],
    correct: 2,
    explanation: "Rapportera alltid misstänkt phishing till IT-avdelningen och radera meddelandet. Klicka aldrig på länkar och öppna inga bilagor. IT-avdelningen kan analysera och varna andra."
  },
  {
    domain: 2, subtopic: "M9",
    question: "Vilken teknik bör du använda för att kontrollera en länk i ett misstänkt e-postmeddelande?",
    options: [
      "Klicka på länken i en privat webbläsare",
      "Hovra över länken utan att klicka för att se den riktiga URL:en",
      "Kopiera och klistra in länken",
      "Be en kollega klicka på länken"
    ],
    correct: 1,
    explanation: "Hovra över länken utan att klicka — webbläsaren visar den faktiska URL:en i nedre vänstra hörnet. Kontrollera att den matchar den förväntade avsändaren."
  },
  {
    domain: 2, subtopic: "M9",
    question: "Vilket av följande är ett varningstecken för phishing?",
    options: [
      "E-postmeddelandet kommer från en känd kollega med vanlig ton",
      "E-postmeddelandet skapar brådska och hotar med konsekvenser",
      "E-postmeddelandet innehåller en kallelse till ett möte",
      "E-postmeddelandet skickades under kontorstid"
    ],
    correct: 1,
    explanation: "Brådska och hot om konsekvenser ('Ditt konto stängs om du inte agerar nu!') är ett av de vanligaste varningstecknen för phishing."
  },
  {
    domain: 2, subtopic: "M9",
    question: "Vad är en USB-attack?",
    options: [
      "En attack mot USB-portar med hög spänning",
      "Infekterade USB-minnen som placeras strategiskt för att offret ska koppla in dem",
      "En attack som sprids via USB-laddningskablar",
      "En attack som blockerar USB-portar"
    ],
    correct: 1,
    explanation: "USB-attacker innebär att angripare placerar infekterade USB-minnen vid arbetsplatser eller parkeringsplatser. När nyfikna anställda kopplar in dem installeras skadlig kod automatiskt."
  },
  {
    domain: 2, subtopic: "M9",
    question: "Varför bör du verifiera ovanliga förfrågningar via telefon?",
    options: [
      "Det är snabbare än e-post",
      "En angripare kan ha komprometterat avsändarens e-postkonto",
      "Telefonsamtal är alltid säkra",
      "Det krävs enligt lag"
    ],
    correct: 1,
    explanation: "Om du får en ovanlig begäran via e-post (t.ex. penningöverföring från din 'chef'), ring det kända numret för att verifiera. Angriparen kan ha komprometterat avsändarens e-post."
  },

  // ========== Modul 10: Incidenthantering i praktiken ==========
  {
    domain: 2, subtopic: "M10",
    question: "Vad är det första steget vid en misstänkt cybersäkerhetsincident?",
    options: [
      "Stänga av alla servrar",
      "Upptäcka och identifiera — vad har hänt?",
      "Ringa polisen",
      "Installera ny antivirus"
    ],
    correct: 1,
    explanation: "Steg 1 är att upptäcka och identifiera: Vad har hänt? Vilka system är drabbade? Dokumentera allt du observerar innan du vidtar åtgärder."
  },
  {
    domain: 2, subtopic: "M10",
    question: "Vad innebär en 'no-blame'-kultur i incidenthantering?",
    options: [
      "Att ingen ansvarig person utses",
      "Att medarbetare kan rapportera incidenter utan rädsla för straff",
      "Att incidenter inte dokumenteras",
      "Att ledningen inte informeras"
    ],
    correct: 1,
    explanation: "En no-blame-kultur innebär att medarbetare uppmuntras rapportera incidenter utan rädsla för negativa konsekvenser. Snabb rapportering minimerar skadan och belönas istället för bestraffas."
  },
  {
    domain: 2, subtopic: "M10",
    question: "Varför ska du INTE ändra lösenord omedelbart vid misstänkt intrång?",
    options: [
      "Det spelar ingen roll",
      "Det kan förstöra bevis som behövs för utredningen",
      "Angriparen kan se det",
      "Det tar för lång tid"
    ],
    correct: 1,
    explanation: "Att omedelbart ändra lösenord kan förstöra forensiska bevis. Isolera drabbade system först och rådgör med IT-avdelningen eller incidenthanterare innan du gör ändringar."
  },
  {
    domain: 2, subtopic: "M10",
    question: "I vilken ordning sker incidentrapportering externt enligt NIS2?",
    options: [
      "Polisen → tillsynsmyndigheten → CERT-SE",
      "Tidig varning (24h) → incidentanmälan (72h) → slutrapport (1 mån)",
      "Slutrapport → incidentanmälan → tidig varning",
      "Enbart till tillsynsmyndigheten inom 1 vecka"
    ],
    correct: 1,
    explanation: "NIS2 kräver stegvis rapportering: tidig varning inom 24 timmar, fullständig incidentanmälan inom 72 timmar, och slutrapport inom 1 månad."
  },
  {
    domain: 2, subtopic: "M10",
    question: "Varför ska man ha en tryckt kontaktlista för incidenthantering?",
    options: [
      "Det ser professionellt ut",
      "Den ska fungera även om IT-systemen är nere",
      "Det är billigare",
      "Det krävs inte"
    ],
    correct: 1,
    explanation: "Vid en allvarlig incident kan IT-systemen vara otillgängliga. En tryckt kontaktlista säkerställer att du kan nå IT-chef, CISO, incidenthanterare och tillsynsmyndigheter även utan åtkomst till e-post eller intranät."
  },
  {
    domain: 2, subtopic: "M10",
    question: "Vad bör ingå i steg 5 (Lär av incidenten)?",
    options: [
      "Straffa de ansvariga",
      "Uppföljningsmöte, dokumentera lärdomar och uppdatera rutiner",
      "Radera all dokumentation",
      "Byta alla system"
    ],
    correct: 1,
    explanation: "Steg 5 innebär att genomföra ett uppföljningsmöte, dokumentera lärdomar och uppdatera rutiner och procedurer så att liknande incidenter kan förebyggas i framtiden."
  },

  // ========== Modul 11: Leverantörs- och supply chain-säkerhet ==========
  {
    domain: 2, subtopic: "M11",
    question: "Vilken attackincident 2020 komprometterade 18 000 organisationer via en mjukvaruuppdatering?",
    options: ["Colonial Pipeline", "Log4Shell", "SolarWinds", "Kaseya"],
    correct: 2,
    explanation: "SolarWinds-attacken (2020) komprometterade Orion-plattformens uppdateringsmekanism och distribuerade bakdörrar till cirka 18 000 organisationer, inklusive amerikanska myndigheter."
  },
  {
    domain: 2, subtopic: "M11",
    question: "Vad kräver NIS2 artikel 21(d) avseende leverantörer?",
    options: [
      "Att alla leverantörer ska vara ISO 27001-certifierade",
      "Att säkerhet i leverantörskedjan ska adresseras med riskbedömning och kontraktuella krav",
      "Att organisationer inte får använda externa leverantörer",
      "Att leverantörer ska betala för revisioner"
    ],
    correct: 1,
    explanation: "Artikel 21(d) kräver att organisationer adresserar säkerhet i leverantörskedjan genom riskbedömning, ställer krav på leverantörer och inkluderar cybersäkerhetskrav i avtal."
  },
  {
    domain: 2, subtopic: "M11",
    question: "Hur mycket beräknas supply chain-attacker kosta globalt per år till 2031?",
    options: ["10 miljarder USD", "50 miljarder USD", "138 miljarder USD", "500 miljarder USD"],
    correct: 2,
    explanation: "Supply chain-attacker beräknas kosta 138 miljarder USD per år globalt till 2031, vilket understryker vikten av leverantörssäkerhet."
  },
  {
    domain: 2, subtopic: "M11",
    question: "Hur bör leverantörer med fjärråtkomst till OT-system hanteras?",
    options: [
      "Med samma rättigheter som interna anställda",
      "Med VPN, tidsbegränsade sessioner, loggning och MFA",
      "Med obegränsad åtkomst för effektivitet",
      "Utan särskild hantering"
    ],
    correct: 1,
    explanation: "Leverantörer med fjärråtkomst till kritiska system ska använda VPN, ha tidsbegränsade sessioner som godkänns per tillfälle, och all åtkomst ska loggas. MFA är obligatoriskt."
  },
  {
    domain: 2, subtopic: "M11",
    question: "Vad bör inkluderas i avtal med leverantörer avseende cybersäkerhet?",
    options: [
      "Enbart prisinformation",
      "Cybersäkerhetskrav, rätt till revision och incidentrapporteringsklausuler",
      "Bara leveranstider",
      "Inget cybersäkerhetsrelaterat"
    ],
    correct: 1,
    explanation: "Avtal med leverantörer bör inkludera specifika cybersäkerhetskrav, rätt till revision av leverantörens säkerhetsarbete, och krav på incidentrapportering vid säkerhetsincidenter."
  },

  // ========== Modul 12: Fysisk säkerhet och OT ==========
  {
    domain: 2, subtopic: "M12",
    question: "Varför inkluderar NIS2 fysisk säkerhet?",
    options: [
      "Det gör det inte",
      "NIS2:s all-hazards approach inkluderar alla hot, även fysiska",
      "Bara för att fylla ut direktivet",
      "Enbart i energisektorn"
    ],
    correct: 1,
    explanation: "NIS2:s all-hazards approach kräver skydd mot alla typer av hot — digitala, fysiska, naturkatastrofer med mera. Fysisk säkerhet är första försvarslinjen för OT-system."
  },
  {
    domain: 2, subtopic: "M12",
    question: "Vad bör USB-policyn för OT-system innebära?",
    options: [
      "Fri användning av USB-enheter",
      "Inga obehöriga USB-enheter — portar bör vara blockerade eller övervakade",
      "Bara USB-enheter från leverantörer tillåts",
      "USB-portar ska tas bort fysiskt"
    ],
    correct: 1,
    explanation: "I OT-miljöer bör inga obehöriga USB-enheter tillåtas. USB-portar bör blockeras eller övervakas för att förhindra infektion via infekterade USB-minnen."
  },
  {
    domain: 2, subtopic: "M12",
    question: "Vilka krav bör ställas på besökare i kritiska driftmiljöer?",
    options: [
      "Inga särskilda krav",
      "Besökare ska alltid eskorteras och besöket dokumenteras",
      "Besökare ska bara underteckna ett NDA",
      "Besökare bör få fritt tillträde"
    ],
    correct: 1,
    explanation: "Besökare i kritiska driftmiljöer ska alltid eskorteras av behörig personal, besöket ska dokumenteras med namn, tid och syfte, och besökare ska inte lämnas utan uppsikt."
  },
  {
    domain: 2, subtopic: "M12",
    question: "Vilka krav gäller för fjärråtkomst till OT-system?",
    options: [
      "Direktåtkomst via internet är OK",
      "VPN, tidsbegränsade sessioner, loggning och MFA",
      "Enbart lösenordsskydd",
      "Fjärråtkomst bör aldrig tillåtas"
    ],
    correct: 1,
    explanation: "All fjärråtkomst till OT-system ska ske via krypterad VPN, med tidsbegränsade sessioner som godkänns per tillfälle, fullständig loggning och multifaktorautentisering."
  },

  // ========== Modul 13: Kryptografi och dataskydd ==========
  {
    domain: 2, subtopic: "M13",
    question: "Vilken artikel i NIS2 kräver en kryptografipolicy?",
    options: ["Artikel 21(a)", "Artikel 21(d)", "Artikel 21(h)", "Artikel 21(j)"],
    correct: 2,
    explanation: "Artikel 21(h) kräver policy och rutiner för kryptografi och kryptering som en av de 10 obligatoriska säkerhetsåtgärderna."
  },
  {
    domain: 2, subtopic: "M13",
    question: "Vad är skillnaden mellan 'data i vila' och 'data under transport'?",
    options: [
      "Det finns ingen skillnad",
      "Data i vila är lagrad data; data under transport skickas mellan system",
      "Data i vila finns i molnet; data under transport finns lokalt",
      "Data i vila är krypterad; data under transport är inte det"
    ],
    correct: 1,
    explanation: "Data i vila är information lagrad på hårddiskar, servrar och databaser. Data under transport är information som skickas mellan system via nätverk. Båda typer kräver kryptering."
  },
  {
    domain: 2, subtopic: "M13",
    question: "Vad säkerställer TLS/SSL?",
    options: [
      "Att data lagras krypterad",
      "Att kommunikation över nätverk är krypterad",
      "Att lösenord är starka",
      "Att virus inte sprids"
    ],
    correct: 1,
    explanation: "TLS (Transport Layer Security, tidigare SSL) krypterar kommunikation mellan system över nätverk. Webbplatser med 'https://' använder TLS. Kontrollera alltid att det finns ett lås i webbläsarens adressfält."
  },
  {
    domain: 2, subtopic: "M13",
    question: "Hur relaterar GDPR till NIS2 avseende kryptering?",
    options: [
      "De har ingen relation",
      "NIS2 ersätter GDPR:s krypteringskrav",
      "Kryptering skyddar personuppgifter (GDPR) och cybersäkerhet (NIS2) kompletterar varandra",
      "GDPR förbjuder kryptering"
    ],
    correct: 2,
    explanation: "NIS2 och GDPR kompletterar varandra — cybersäkerhetsåtgärder som kryptering skyddar även personuppgifter. Krypterade data som läcks kan i vissa fall anses vara mindre allvarligt vid en dataintrångsanmälan."
  },
  {
    domain: 2, subtopic: "M13",
    question: "Vilka system i en energiorganisation bör krypteras?",
    options: [
      "Enbart e-post",
      "Enbart databaser med kunduppgifter",
      "SCADA-kommunikation, VPN, e-post, databaser, backup och bärbara enheter",
      "Enbart webbplatser"
    ],
    correct: 2,
    explanation: "I en energiorganisation bör alla kritiska system krypteras: SCADA-kommunikation, VPN, e-post med känslig information, databaser med kunduppgifter, backup-kopior och bärbara enheter."
  },
  {
    domain: 2, subtopic: "M13",
    question: "Vad är VPN och varför behövs det?",
    options: [
      "Virtual Private Network — skapar en krypterad tunnel för säker fjärråtkomst",
      "Very Personal Network — ett privat internet",
      "Virus Protection Network — skyddar mot virus",
      "Virtual Public Network — ett öppet nätverk"
    ],
    correct: 0,
    explanation: "VPN (Virtual Private Network) skapar en krypterad tunnel mellan användarens enhet och företagets nätverk, vilket möjliggör säker fjärråtkomst. Det är obligatoriskt för distansarbete och fjärråtkomst till OT-system."
  },

  // ========== Extra blandade frågor för slutprovet ==========
  {
    domain: 1, subtopic: "M4",
    question: "Vad innebär 'security by design'?",
    options: [
      "Att design-avdelningen ansvarar för säkerhet",
      "Att cybersäkerhet beaktas från start vid anskaffning och utveckling av system",
      "Att säkerheten designas av en konsult",
      "Att systemen ser säkra ut visuellt"
    ],
    correct: 1,
    explanation: "Security by design innebär att cybersäkerhet integreras i system redan från designfasen, inte som en eftertanke. Det är del av artikel 21(e) om säkerhet vid anskaffning, utveckling och underhåll."
  },
  {
    domain: 2, subtopic: "M6",
    question: "Vilken grupp stod bakom cyberattacken mot Ukrainas elnät 2015?",
    options: ["APT28", "Sandworm", "Lazarus", "Fancy Bear"],
    correct: 1,
    explanation: "Sandworm (även känd som Unit 74455 i Rysslands GRU) stod bakom attacken mot Ukrainas elnät i december 2015 som orsakade strömavbrott för hundratusentals hushåll."
  },
  {
    domain: 1, subtopic: "M3",
    question: "Kan tillsynsmyndigheten offentliggöra vilka organisationer som brister i cybersäkerhet?",
    options: [
      "Nej, det är alltid konfidentiellt",
      "Ja, tillsynsmyndigheten kan offentliggöra bristande organisationer",
      "Bara vid böter över 1 MEUR",
      "Bara inom hälso- och sjukvården"
    ],
    correct: 1,
    explanation: "Under NIS2 har tillsynsmyndigheten befogenhet att offentliggöra vilka organisationer som brister i cybersäkerhetsarbetet, vilket kan ha betydande reputationspåverkan."
  },
  {
    domain: 2, subtopic: "M10",
    question: "Vad är IoC (Indicators of Compromise)?",
    options: [
      "En typ av kryptering",
      "Tekniska indikatorer som visar att ett system har komprometterats",
      "En incidentrapporteringsstandard",
      "En leverantörsbedömningsmodell"
    ],
    correct: 1,
    explanation: "IoC (Indicators of Compromise) är tekniska spår som visar att ett system har komprometterats — t.ex. ovanliga IP-adresser, skadliga filer, ovanlig nätverkstrafik eller oauktoriserade kontoändringar."
  },
  {
    domain: 1, subtopic: "M4",
    question: "Vad innebär principen 'least privilege'?",
    options: [
      "Att minimera antalet anställda",
      "Att varje person bara ska ha den åtkomst som behövs för sina arbetsuppgifter",
      "Att alla ska ha samma rättigheter",
      "Att privilegierade konton inte behöver MFA"
    ],
    correct: 1,
    explanation: "Principen 'least privilege' (minsta privilegium) innebär att varje användare och system bara ska ha den minimiåtkomst som krävs för att utföra sina arbetsuppgifter. Det är del av artikel 21(i)."
  },
  {
    domain: 2, subtopic: "M7",
    question: "Vad står PLC för i OT-sammanhang?",
    options: [
      "Private Local Connection",
      "Programmable Logic Controller",
      "Protected Layer Communication",
      "Power Line Carrier"
    ],
    correct: 1,
    explanation: "PLC (Programmable Logic Controller) är en industriell dator som styr enskilda maskiner och processer i OT-miljöer. PLC:er finns överallt i energisektorn för att styra t.ex. generatorer och ställverk."
  },
  {
    domain: 1, subtopic: "M5",
    question: "Vad är CERT-SE:s roll i incidenthantering?",
    options: [
      "Utfärda böter",
      "Sveriges nationella CSIRT för teknisk incidenthantering",
      "Lagstiftande myndighet",
      "Enbart forskning"
    ],
    correct: 1,
    explanation: "CERT-SE är Sveriges nationella CSIRT (Computer Security Incident Response Team) som hanterar den tekniska sidan av cybersäkerhetsincidenter och ger stöd till drabbade organisationer."
  },
  {
    domain: 2, subtopic: "M9",
    question: "Vad kallas det när en angripare utger sig för att vara VD och begär en brådskande betalning?",
    options: ["Ransomware", "VD-bedrägeri (CEO fraud/BEC)", "DDoS-attack", "Man-in-the-middle"],
    correct: 1,
    explanation: "VD-bedrägeri (CEO fraud) eller Business Email Compromise (BEC) är en form av spear phishing där angriparen utger sig för att vara VD eller annan ledningsperson och begär brådskande penningöverföringar."
  },
  {
    domain: 2, subtopic: "M11",
    question: "Vad hände vid Kaseya-attacken 2021?",
    options: [
      "En DDoS-attack mot finanssektorn",
      "Ransomware distribuerades via IT-managementprogramvara och drabbade 1500+ företag",
      "En statsaktör infiltrerade EU:s nätverk",
      "En USB-attack mot ett sjukhus"
    ],
    correct: 1,
    explanation: "Kaseya-attacken (juli 2021) utnyttjade en sårbarhet i Kaseya VSA, en IT-managementprogramvara, för att distribuera ransomware till över 1 500 företag via deras managed service providers."
  },
  {
    domain: 1, subtopic: "M2",
    question: "Vad händer om ett företag inte uppfyller NIS2-kraven?",
    options: [
      "Ingenting, det är frivilligt",
      "Böter, eventuellt ledningsförbud och offentliggörande av brister",
      "Enbart en varning",
      "Företaget läggs ner"
    ],
    correct: 1,
    explanation: "Företag som inte uppfyller NIS2-kraven kan drabbas av betydande böter (upp till 10 MEUR/2% av omsättning), ledningen kan förbjudas utöva sina funktioner, och bristerna kan offentliggöras."
  },

  // ========== Extra frågor för att nå 100+ ==========
  {
    domain: 1, subtopic: "M1",
    question: "Vad är det officiella numret på NIS2-direktivet?",
    options: ["2016/1148", "2022/2555", "2023/1234", "2024/0001"],
    correct: 1,
    explanation: "NIS2-direktivet har det officiella numret 2022/2555 och antogs den 14 december 2022."
  },
  {
    domain: 2, subtopic: "M7",
    question: "Vad står HMI för i OT-sammanhang?",
    options: ["High Memory Interface", "Human-Machine Interface", "Hardware Management Integration", "Hybrid Monitoring Instrument"],
    correct: 1,
    explanation: "HMI (Human-Machine Interface) är operatörens gränssnitt för att övervaka och styra industriella processer i OT-miljöer."
  },
  {
    domain: 2, subtopic: "M7",
    question: "Vad står RTU för?",
    options: ["Real-Time Update", "Remote Terminal Unit", "Router Transmission Unit", "Risk Treatment Utility"],
    correct: 1,
    explanation: "RTU (Remote Terminal Unit) är en enhet för fjärrstyrning och övervakning av fältutrustning i OT-nätverk, ofta kopplad till SCADA-system."
  },
  {
    domain: 1, subtopic: "M4",
    question: "Vilken av de 10 åtgärderna handlar om backup och disaster recovery?",
    options: ["(a) Riskanalys", "(b) Incidenthantering", "(c) Kontinuitetsplanering", "(d) Leverantörssäkerhet"],
    correct: 2,
    explanation: "Åtgärd (c) handlar om kontinuitetsplanering — backup-hantering, disaster recovery-planer och krishantering för att upprätthålla verksamheten vid allvarliga incidenter."
  },
  {
    domain: 2, subtopic: "M8",
    question: "Vad är TOTP?",
    options: ["Total Organizational Threat Prevention", "Time-based One-Time Password", "Trusted Operator Token Protocol", "Temporary Online Transaction Permission"],
    correct: 1,
    explanation: "TOTP (Time-based One-Time Password) är den teknik som autentiseringsappar som Microsoft Authenticator och Google Authenticator använder för att generera tidsbaserade engångskoder."
  },
  {
    domain: 2, subtopic: "M9",
    question: "Vad är smishing?",
    options: ["Phishing via sociala medier", "Phishing via SMS", "Phishing via Slack", "Phishing via videomöten"],
    correct: 1,
    explanation: "Smishing (SMS phishing) är phishing-attacker som levereras via SMS-meddelanden med skadliga länkar eller uppmaningar att ringa bedrägliga nummer."
  },
  {
    domain: 1, subtopic: "M5",
    question: "Vad ska den tidiga varningen inom 24 timmar innehålla?",
    options: [
      "En fullständig analys av incidenten",
      "Information om huruvida incidenten misstänks vara orsakad av olagliga handlingar och eventuell gränsöverskridande påverkan",
      "Namn på alla drabbade medarbetare",
      "En komplett lista över alla system som påverkats"
    ],
    correct: 1,
    explanation: "Den tidiga varningen inom 24 timmar ska ange om incidenten misstänks vara orsakad av olagliga handlingar och om den kan ha gränsöverskridande påverkan."
  },
  {
    domain: 2, subtopic: "M12",
    question: "Varför bör USB-portar på OT-system vara blockerade?",
    options: [
      "USB-enheter drar för mycket ström",
      "Infekterade USB-minnen kan användas för att installera skadlig kod i isolerade OT-system",
      "USB-portar förstör hårdvaran",
      "Det är enbart en estetisk fråga"
    ],
    correct: 1,
    explanation: "USB-enheter är en vanlig attackvektor mot OT-system, särskilt sådana som är isolerade från internet. Infekterade USB-minnen kan användas för att sprida malware till annars skyddade styrsystem."
  },
  {
    domain: 2, subtopic: "M13",
    question: "Vad är AES-256?",
    options: [
      "Ett antivirusprogram",
      "En stark krypteringsstandard för att skydda data i vila",
      "Ett nätverksprotokoll",
      "En typ av brandvägg"
    ],
    correct: 1,
    explanation: "AES-256 (Advanced Encryption Standard med 256-bitars nyckel) är en av de starkaste krypteringsstandarderna och rekommenderas för att skydda känslig data i vila."
  },
  {
    domain: 1, subtopic: "M3",
    question: "Vem bör utses som cybersäkerhetsansvarig enligt NIS2-kraven?",
    options: [
      "Den yngsta medarbetaren",
      "En CISO (Chief Information Security Officer) eller motsvarande",
      "Den som har mest IT-erfarenhet oavsett roll",
      "En extern konsult på deltid"
    ],
    correct: 1,
    explanation: "Organisationer bör utse en CISO (Chief Information Security Officer) eller motsvarande cybersäkerhetsansvarig person som rapporterar direkt till ledningen."
  }
];
