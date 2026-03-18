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

          <div class="timeline">
            <div class="timeline-item">
              <strong>2016 — NIS1 antas</strong>
              <p>EU:s första cybersäkerhetsdirektiv. Omfattade 7 sektorer med relativt lösa krav.</p>
            </div>
            <div class="timeline-item">
              <strong>December 2022 — NIS2 publiceras</strong>
              <p>Det uppdaterade direktivet (2022/2555) antas av EU-parlamentet och rådet.</p>
            </div>
            <div class="timeline-item">
              <strong>Oktober 2024 — Implementeringsdeadline</strong>
              <p>Medlemsstaterna ska ha införlivat NIS2 i nationell lagstiftning.</p>
            </div>
            <div class="timeline-item">
              <strong>15 januari 2026 — Cybersäkerhetslagen</strong>
              <p>Den svenska Cybersäkerhetslagen (2025:1506) träder i kraft. Alla omfattade organisationer måste nu uppfylla kraven.</p>
            </div>
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

          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-value">18</div>
              <div class="stat-label">Sektorer som omfattas</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">10</div>
              <div class="stat-label">Obligatoriska åtgärder</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">10M€</div>
              <div class="stat-label">Max böter</div>
            </div>
          </div>

          <div class="concept-block">
            <h4>18 sektorer</h4>
            <p>NIS2 delar in sektorer i två kategorier:</p>
            <ul>
              <li><strong>Hög kritikalitet (Annex I):</strong> Energi, transport, bank, finansmarknadsinfrastruktur, hälso- och sjukvård, dricksvatten, avloppsvatten, digital infrastruktur, ICT-tjänsthantering, offentlig förvaltning, rymd</li>
              <li><strong>Andra kritiska sektorer (Annex II):</strong> Post och kurirtjänster, avfallshantering, kemikalier, livsmedel, tillverkning, digitala leverantörer, forskning</li>
            </ul>
          </div>

          <div class="example-box">
            <div class="example-label">Exempel</div>
            <p>Ett regionalt elbolag med 120 anställda och 200 MSEK i omsättning: de uppfyller storlekskravet (50+ anställda), verkar inom energisektorn (Annex I), och klassas därmed som väsentlig verksamhetsutövare under NIS2. De måste uppfylla samtliga krav senast 15 januari 2026.</p>
          </div>

          <div class="example-box">
            <div class="example-label">Exempel</div>
            <p>En liten solcellsinstallatör med 15 anställda: de ligger under storleksgränsen och omfattas normalt inte direkt. Men om de levererar underhållstjänster till ett större energibolag kan de indirekt påverkas genom leverantörskrav (artikel 21d).</p>
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
              <li><strong>Transmissionsnätsoperatörer:</strong> Företag som driver stamnätet</li>
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

          <div class="example-box">
            <div class="example-label">Exempel — Omfattas</div>
            <p>Elbolaget Norrström Energi AB har 80 anställda och en omsättning på 150 MSEK (~14 MEUR). De driver ett regionalt distributionsnät. Resultat: De uppfyller storlekskravet (80 > 50 anställda), verkar inom energi (Annex I), och klassas som väsentlig verksamhetsutövare.</p>
          </div>

          <div class="example-box">
            <div class="example-label">Exempel — Gränsfall</div>
            <p>Smålands Vindkraft AB har 45 anställda men en omsättning på 110 MSEK (~10,5 MEUR). Trots att de har färre än 50 anställda överstiger omsättningen 10 MEUR-gränsen — de omfattas alltså av NIS2.</p>
          </div>

          <div class="example-box">
            <div class="example-label">Exempel — Ej direkt omfattad</div>
            <p>En elbilsladdningsoperatör med 20 anställda och 30 MSEK i omsättning: de ligger under storleksgränsen. Men om de levererar laddinfrastruktur till en nätägare kan de påverkas via leverantörskrav.</p>
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

          <div class="highlight-box">
            <span class="hl-icon">⚠️</span>
            <p><strong>Indirekt påverkan:</strong> Även om ditt företag inte direkt omfattas kan du bli indirekt påverkad. En undersökning visar att 62% av cyberattacker mot energisektorn sker via leverantörskedjan. Organisationer som omfattas av NIS2 måste ställa cybersäkerhetskrav på sina underleverantörer.</p>
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

          <div class="highlight-box">
            <span class="hl-icon">📋</span>
            <p>Alla 10 åtgärder är <strong>obligatoriska</strong>. Det räcker inte att vara bra på 8 av 10. Varje åtgärd ska implementeras proportionerligt baserat på organisationens storlek, riskexponering och samhällspåverkan.</p>
          </div>

          <div class="concept-block">
            <h4>(a) Riskanalys och informationssäkerhetspolicy</h4>
            <p>Organisationen ska ha en dokumenterad policy för informationssäkerhet baserad på en systematisk riskanalys. Policyn ska regelbundet granskas och uppdateras.</p>
          </div>

          <div class="example-box">
            <div class="example-label">Exempel — Riskanalys</div>
            <p>Ett elnätsbolag genomför en årlig riskanalys: de identifierar att fjärrstyrda transformatorstationer är en kritisk tillgång. Risken för obehörig fjärråtkomst bedöms som hög. Åtgärd: MFA, VPN och tidsbegränsade sessioner implementeras för all fjärråtkomst.</p>
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

          <div class="example-box">
            <div class="example-label">Exempel — Checklista i praktiken</div>
            <p>En energikoncern gör en GAP-analys mot de 10 åtgärderna och upptäcker: (a) Riskanalys ✅, (b) Incidenthantering ✅, (c) Kontinuitetsplan ⚠️ gammal, (d) Leverantörskrav ❌ saknas helt, (e) Anskaffning ⚠️ ad hoc, (f) Testning ❌ aldrig gjort pentest, (g) Utbildning ⚠️ sporadisk, (h) Kryptering ✅, (i) Åtkomstkontroll ✅, (j) MFA ⚠️ bara e-post. De prioriterar: leverantörskrav och penetrationstestning först.</p>
          </div>

          <div class="steps-grid">
            <div class="step-box">
              <div class="step-number">1</div>
              <p><strong>Inventera:</strong> Kartlägg era nuvarande säkerhetsåtgärder mot alla 10 områden.</p>
            </div>
            <div class="step-box">
              <div class="step-number">2</div>
              <p><strong>GAP-analys:</strong> Identifiera vilka områden som saknas eller är otillräckliga.</p>
            </div>
            <div class="step-box">
              <div class="step-number">3</div>
              <p><strong>Prioritera:</strong> Åtgärda de mest kritiska bristerna först, baserat på riskbedömning.</p>
            </div>
            <div class="step-box">
              <div class="step-number">4</div>
              <p><strong>Implementera:</strong> Genomför åtgärderna med tydlig ansvarsfördelning och tidsplan.</p>
            </div>
            <div class="step-box">
              <div class="step-number">5</div>
              <p><strong>Följ upp:</strong> Utvärdera regelbundet och justera — säkerhetsarbete är en löpande process.</p>
            </div>
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
              <li><strong>Stort bränsleföretag (2021):</strong> En ransomware-attack stängde ner den största bränsleledningen i USA i 6 dagar. 45% av östkustens bränsleförsörjning stoppades. Företaget betalade 4,4 miljoner USD i lösen.</li>
              <li><strong>+70% ökning</strong> av cyberattacker mot energisektorn under 2024, med 1 162 dokumenterade attacker i USA</li>
              <li><strong>Genomsnittlig kostnad:</strong> Ett dataintrång kostar i genomsnitt 4,88 miljoner USD enligt branschrapporter (2024)</li>
            </ul>
          </div>

          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-value">+70%</div>
              <div class="stat-label">Ökning cyberattacker 2024</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">4,88M$</div>
              <div class="stat-label">Snittskada per intrång</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">84%</div>
              <div class="stat-label">Börjar med phishing</div>
            </div>
          </div>

          <div class="concept-block">
            <h4>Statsaktörer</h4>
            <p>Energisektorn är ett prioriterat mål för statsstödda hackergrupper:</p>
            <ul>
              <li><strong>Ryssland:</strong> Statsstödda hackergrupper har utfört attacker mot energi-infrastruktur i Ukraina och Europa</li>
              <li><strong>Kina:</strong> APT-grupper riktar sig mot energisektorn för industrispionage</li>
              <li><strong>Iran:</strong> Attacker mot energi- och vatteninfrastruktur i Mellanöstern och globalt</li>
              <li><strong>Ukraina 2015/2016:</strong> Ryska hackare orsakade strömavbrott som drabbade hundratusentals hushåll</li>
            </ul>
          </div>

          <div class="highlight-box">
            <span class="hl-icon">🎯</span>
            <p><strong>Ukraina 2015:</strong> En statsstödd hackergrupp attackerade tre ukrainska elbolag samtidigt. 230 000 hushåll blev utan ström i upp till 6 timmar. Attacken använde spear-phishing för initial åtkomst, sedan fjärrstyrdes SCADA-systemen direkt.</p>
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

          <div class="example-box">
            <div class="example-label">Exempel — Ransomware-scenario</div>
            <p>En anställd på ett svenskt elnätsbolag klickar på en länk i ett e-postmeddelande som ser ut att komma från en leverantör. Skadlig kod installeras och sprider sig via nätverket. Inom 4 timmar är 200 datorer krypterade. Kundtjänst, fakturasystem och intern kommunikation ligger nere. Backup finns — men den senaste lyckade backupen är 72 timmar gammal. Återställning tar 5 dagar. Total kostnad: ~8 MSEK.</p>
          </div>

          <div class="example-box">
            <div class="example-label">Exempel — Social engineering</div>
            <p>En angripare ringer till driftcentralen och utger sig för att vara en tekniker från SCADA-leverantören. "Vi ser ett allvarligt fel i ert system och behöver fjärråtkomst omedelbart." Under tidspress ger operatören fjärråtkomst — utan att verifiera identiteten via leverantörens kända kontaktvägar.</p>
          </div>

          <div class="compare-grid">
            <div class="compare-card bad">
              <h5>❌ Vanliga misstag</h5>
              <p>Ingen segmentering mellan IT och OT. Samma lösenord överallt. Ingen MFA på fjärråtkomst. Gammal firmware i SCADA utan patchplan.</p>
            </div>
            <div class="compare-card good">
              <h5>✅ Bra skydd</h5>
              <p>IT/OT-segmentering med brandvägg. MFA på all fjärråtkomst. Regelbundna patchplaner. Simulerade phishing-tester varje kvartal.</p>
            </div>
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

          <div class="highlight-box">
            <span class="hl-icon">⚖️</span>
            <p><strong>Personligt ansvar:</strong> Till skillnad från NIS1 kan enskilda ledningsmedlemmar nu hållas personligt ansvariga. I allvarliga fall kan ledningen tillfälligt förbjudas att utöva ledningsfunktioner — en helt ny typ av sanktion inom EU:s cybersäkerhetslagstiftning.</p>
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

          <div class="example-box">
            <div class="example-label">Exempel — Ledningens roller</div>
            <p>I ett energibolag med 150 anställda bör minst styrelseordföranden, VD, CFO och teknikchef genomgå NIS2-utbildning. Styrelsen bör ha cybersäkerhet som en stående punkt på dagordningen (minst kvartalsvis) och utse en CISO eller informationssäkerhetsansvarig som rapporterar direkt till VD.</p>
          </div>

          <div class="example-box">
            <div class="example-label">Exempel — Vad kan gå fel</div>
            <p>En styrelseledamot i ett nätbolag frågar aldrig om cybersäkerhet vid styrelsemötena. Vid en revision visar det sig att bolaget saknar incidenthanteringsplan. Tillsynsmyndigheten konstaterar att ledningen inte uppfyllt sin övervakningsskyldighet enligt artikel 20. Resultat: Böter + personlig anmärkning.</p>
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

          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-value">10M€</div>
              <div class="stat-label">Max böter (väsentlig)</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">7M€</div>
              <div class="stat-label">Max böter (viktig)</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">2%</div>
              <div class="stat-label">Av global omsättning</div>
            </div>
          </div>

          <div class="steps-grid">
            <div class="step-box">
              <div class="step-number">1</div>
              <p><strong>Policy:</strong> Upprätta en formell cybersäkerhetspolicy godkänd av styrelsen.</p>
            </div>
            <div class="step-box">
              <div class="step-number">2</div>
              <p><strong>CISO:</strong> Utse en cybersäkerhetsansvarig (CISO eller motsvarande) med direkt rapportering till VD.</p>
            </div>
            <div class="step-box">
              <div class="step-number">3</div>
              <p><strong>Budget:</strong> Budgetera tillräckliga resurser för cybersäkerhet (tumregel: 5-10% av IT-budget).</p>
            </div>
            <div class="step-box">
              <div class="step-number">4</div>
              <p><strong>Utbildning:</strong> Genomgå utbildning (som denna!) och säkerställ löpande kompetensutveckling.</p>
            </div>
            <div class="step-box">
              <div class="step-number">5</div>
              <p><strong>Uppföljning:</strong> Granska cybersäkerhetsrapporter regelbundet och agera på identifierade brister.</p>
            </div>
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

          <div class="timeline">
            <div class="timeline-item">
              <strong>Timme 0 — Incident upptäcks</strong>
              <p>Larmrutiner aktiveras. Intern dokumentation påbörjas omedelbart. Incidentteamet samlas.</p>
            </div>
            <div class="timeline-item">
              <strong>Inom 24 timmar — Tidig varning</strong>
              <p>Rapportera till tillsynsmyndigheten (MSB/Energimyndigheten). Ange: Typ av incident, misstanke om olaglig handling, potentiell gränsöverskridande påverkan.</p>
            </div>
            <div class="timeline-item">
              <strong>Inom 72 timmar — Fullständig anmälan</strong>
              <p>Komplettera med: allvarlighetsgrad, påverkade system/tjänster, antal drabbade användare, IoC (indikatorer på kompromettering).</p>
            </div>
            <div class="timeline-item">
              <strong>Inom 1 månad — Slutrapport</strong>
              <p>Detaljerad analys: grundorsak, kronologi, vidtagna åtgärder, lärdomar, förslag på förbättringar.</p>
            </div>
          </div>

          <div class="example-box">
            <div class="example-label">Exempel — Incidentrapportering i praktiken</div>
            <p>Fredag kl 14:00 upptäcker IT-avdelningen på ett elnätsbolag ovanlig trafik mot en extern server. Kl 16:00 bekräftas att malware har exfiltrerat data. Tidig varning skickas till MSB kl 18:30 (inom 24h-gränsen). Under helgen genomförs forensisk analys. Måndag kl 10:00 skickas den fullständiga anmälan (inom 72h). En månad senare levereras slutrapporten med root cause: en obehörig VPN-anslutning via en leverantörs komprometterade konto.</p>
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

          <div class="compare-grid">
            <div class="compare-card bad">
              <h5>❌ Ska rapporteras</h5>
              <p>Ransomware som krypterar driftsystem. Dataläckage med kunduppgifter. SCADA-intrång. Strömavbrott orsakat av cyberattack. DDoS som slår ut kundportal i 12+ timmar.</p>
            </div>
            <div class="compare-card good">
              <h5>✅ Intern loggning räcker</h5>
              <p>Enstaka blockerat phishing-mail. Misslyckade inloggningsförsök. Mindre malware som antivirusprogrammet stoppar. Kort driftavbrott pga planerat underhåll.</p>
            </div>
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
              <li><strong>Företag A (2020):</strong> Angripare komprometterade en mjukvaruuppdatering som distribuerades till 18 000 organisationer, inklusive amerikanska myndigheter</li>
              <li><strong>Företag B (2021):</strong> Ransomware distribuerades via IT-managementprogramvara och drabbade 1 500+ företag</li>
              <li><strong>Kostnad:</strong> Supply chain-attacker beräknas kosta 138 miljarder USD per år globalt till 2031</li>
            </ul>
          </div>

          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-value">62%</div>
              <div class="stat-label">Attacker via leverantörer</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">18 000</div>
              <div class="stat-label">Drabbade (Företag A)</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">138Md$</div>
              <div class="stat-label">Beräknad årlig kostnad</div>
            </div>
          </div>

          <div class="example-box">
            <div class="example-label">Exempel — Leverantörsrisk i energisektorn</div>
            <p>Ett elnätsbolag anlitar en IT-driftpartner som har fjärråtkomst till SCADA-systemen för övervakning. Driftpartnern drabbas av ransomware. Via deras VPN-anslutning sprids skadlig kod till elnätsbolagets OT-miljö. Orsak: Leverantören saknade MFA och hade utdaterade system. Elnätsbolaget hade inte granskat leverantörens säkerhet sedan kontraktet skrevs 3 år tidigare.</p>
          </div>

          <div class="example-box">
            <div class="example-label">Exempel — Bra leverantörshantering</div>
            <p>Ett proaktivt energibolag klassificerar sina 40 leverantörer i tre risknivåer: 5 kritiska (SCADA-leverantör, IT-drift, molntjänst), 15 högrisk (underhållsentreprenörer med fysisk åtkomst), 20 standardrisk. Kritiska leverantörer granskas årligen och måste ha ISO 27001. Högrisk granskas vartannat år. Alla avtal innehåller incidentrapporteringsklausuler.</p>
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

          <div class="steps-grid">
            <div class="step-box">
              <div class="step-number">1</div>
              <p><strong>Kartlägg:</strong> Lista alla leverantörer med åtkomst till era system, data eller fysiska anläggningar.</p>
            </div>
            <div class="step-box">
              <div class="step-number">2</div>
              <p><strong>Klassificera:</strong> Bedöm risk per leverantör: kritisk, hög, standard. Basera på åtkomstnivå och beroende.</p>
            </div>
            <div class="step-box">
              <div class="step-number">3</div>
              <p><strong>Avtalskrav:</strong> Uppdatera avtal med cybersäkerhetskrav, revisionsrätt och incidentrapporteringsklausuler.</p>
            </div>
            <div class="step-box">
              <div class="step-number">4</div>
              <p><strong>Granska:</strong> Genomför regelbundna granskningar — årligen för kritiska, vartannat år för övriga.</p>
            </div>
            <div class="step-box">
              <div class="step-number">5</div>
              <p><strong>Övervaka:</strong> Monitorera leverantörers fjärråtkomst i realtid. Stäng av oanvända konton.</p>
            </div>
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

          <div class="compare-grid">
            <div class="compare-card good">
              <h5>✅ Bra lösenord</h5>
              <p>Xk9#mP2\$vL7nQ4w — 16 tecken, slumpgenererat via lösenordshanterare. Eller en lösenfras: "Katten-Äter-Pannkakor-42!"</p>
            </div>
            <div class="compare-card bad">
              <h5>❌ Dåliga lösenord</h5>
              <p>Energi2025! — företagsnamn + år. Sommar123 — säsongsord. Bella2018 — husdjursnamn + år. Admin1234 — default-lösenord.</p>
            </div>
          </div>

          <div class="highlight-box">
            <span class="hl-icon">🔓</span>
            <p><strong>81%</strong> av dataintrång beror på svaga eller stulna lösenord. Ett 8-teckens lösenord kan knäckas på under 1 timme med moderna verktyg. Ett 16-teckens lösenord tar miljarder år.</p>
          </div>

          <div class="concept-block">
            <h4>Lösenordshanterare</h4>
            <p>En lösenordshanterare genererar och lagrar unika, starka lösenord för alla dina konton:</p>
            <ul>
              <li>Du behöver bara komma ihåg ETT huvudlösenord</li>
              <li>Det finns flera lösenordshanterare — både gratis och betalda alternativ</li>
              <li>Många organisationer tillhandahåller lösenordshanterare till anställda</li>
            </ul>
          </div>

          <div class="example-box">
            <div class="example-label">Exempel — Lösenordsmiss</div>
            <p>En drifttekniker på ett elnätsbolag använder samma lösenord för sin privata e-post och VPN-åtkomsten till arbetet. Hans privata e-postkonto läcks i ett dataintrång. Angripare testar lösenordet mot företagets VPN — och kommer in. Med en lösenordshanterare hade varje konto haft ett unikt lösenord.</p>
          </div>

          <div class="concept-block">
            <h4>Multifaktorautentisering (MFA)</h4>
            <p>NIS2 kräver MFA (artikel 21j). MFA innebär att du behöver mer än bara ett lösenord:</p>
            <ul>
              <li><strong>Något du vet:</strong> Lösenord eller PIN</li>
              <li><strong>Något du har:</strong> Telefon, fysisk säkerhetsnyckel</li>
              <li><strong>Något du är:</strong> Fingeravtryck, ansiktsigenkänning</li>
            </ul>
            <p>Typer av MFA (från svagast till starkast):</p>
            <ul>
              <li><strong>SMS-kod:</strong> Bättre än ingenting, men kan kapas via SIM-swap</li>
              <li><strong>Autentiseringsapp:</strong> Genererar tidsbaserade engångskoder (TOTP) — det finns flera etablerade appar att välja mellan</li>
              <li><strong>Fysisk säkerhetsnyckel:</strong> Starkaste skyddet, immunt mot phishing — finns i flera varianter från olika tillverkare</li>
            </ul>
          </div>

          <div class="steps-grid">
            <div class="step-box">
              <div class="step-number">1</div>
              <p><strong>Installera:</strong> Ladda ner en autentiseringsapp.</p>
            </div>
            <div class="step-box">
              <div class="step-number">2</div>
              <p><strong>Aktivera:</strong> Gå till säkerhetsinställningar i ditt konto och slå på MFA/tvåfaktorsautentisering.</p>
            </div>
            <div class="step-box">
              <div class="step-number">3</div>
              <p><strong>Skanna:</strong> Skanna QR-koden med appen. Spara backup-koder på ett säkert ställe.</p>
            </div>
            <div class="step-box">
              <div class="step-number">4</div>
              <p><strong>Använd:</strong> Varje inloggning kräver nu lösenord + kod från appen. Det tar 5 extra sekunder — men stoppar 99% av attacker.</p>
            </div>
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

          <div class="highlight-box">
            <span class="hl-icon">📧</span>
            <p><strong>84%</strong> av cyberangrepp mot energisektorn börjar med phishing. En enda medarbetare som klickar på fel länk kan ge angriparen tillgång till hela nätverket — inklusive OT-system.</p>
          </div>

          <div class="example-box">
            <div class="example-label">Exempel — Spear phishing mot energibolag</div>
            <p>En angripare skickar e-post till ekonomichefen som ser ut att komma från VD:n: "Hej, kan du göra en brådskande överföring på 340 000 kr till detta konto? Jag sitter i möte och kan inte ringa." E-postadressen är vd.namn@f0retag.se (med nolla istället för O). Ekonomichefen, van vid snabba beslut, genomför överföringen utan att dubbelkolla.</p>
          </div>

          <div class="example-box">
            <div class="example-label">Exempel — Phishing mot driftpersonal</div>
            <p>Driftpersonal får ett e-postmeddelande: "Brådskande: Säkerhetsuppdatering krävs för era SCADA-system. Ladda ner patchen här." Länken leder till en falsk sida som ser ut som leverantörens portal. Teknikern loggar in — och angriparen fångar inloggningsuppgifterna till det riktiga systemet.</p>
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

          <div class="compare-grid">
            <div class="compare-card bad">
              <h5>🚩 Phishing-tecken</h5>
              <p>Från: support@microsoift.com (felstavat). Ämne: "BRÅDSKANDE: Ditt konto spärras!" Begär lösenord i e-post. Länk till: login.microsoftt-verify.com.</p>
            </div>
            <div class="compare-card good">
              <h5>✅ Äkta kommunikation</h5>
              <p>Från: no-reply@microsoft.com. Ber dig ALDRIG ange lösenord via e-post. Hänvisar till account.microsoft.com. Innehåller ditt fullständiga namn och kontouppgifter.</p>
            </div>
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

          <div class="steps-grid">
            <div class="step-box">
              <div class="step-number">1</div>
              <p><strong>STOPPA:</strong> Klicka inte på något. Andas. Tänk efter.</p>
            </div>
            <div class="step-box">
              <div class="step-number">2</div>
              <p><strong>KONTROLLERA:</strong> Hovra över länkar. Granska avsändaradressen. Ser det rimligt ut?</p>
            </div>
            <div class="step-box">
              <div class="step-number">3</div>
              <p><strong>VERIFIERA:</strong> Ring avsändaren på ett känt nummer (INTE numret i e-posten).</p>
            </div>
            <div class="step-box">
              <div class="step-number">4</div>
              <p><strong>RAPPORTERA:</strong> Vidarebefordra misstänkt e-post till IT-avdelningen / phishing@ertforetag.se.</p>
            </div>
          </div>

          <div class="key-takeaway">
            <strong>Energisektorsexempel:</strong> En angripare skickar ett e-postmeddelande som ser ut att komma från en myndighet eller branschorganisation med en "brådskande säkerhetsuppdatering". Bilagan innehåller skadlig kod som ger angriparen tillgång till interna system. Alltid verifiera med avsändaren via en separat kanal!
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

          <div class="example-box">
            <div class="example-label">Exempel — Typiska incidenter</div>
            <p>En kollega ringer och säger: "Min dator beter sig konstigt — filer har fått nya ändelser och det poppar upp ett meddelande om att betala i Bitcoin." Det är ransomware. Eller: "Jag klickade på en länk i ett mail och loggade in, men sedan hände inget." Det kan vara credential-stöld via phishing. Båda är incidenter som ska rapporteras omedelbart.</p>
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

          <div class="steps-grid">
            <div class="step-box">
              <div class="step-number">1</div>
              <p><strong>Upptäck:</strong> Vad har hänt? Vilka system? Dokumentera exakt vad du ser — skärmdumpar, tidpunkter, felmeddelanden.</p>
            </div>
            <div class="step-box">
              <div class="step-number">2</div>
              <p><strong>Begränsa:</strong> Koppla bort datorn från nätverket (dra ut nätverkskabeln eller stäng av WiFi). Stäng INTE av datorn — det kan förstöra bevis.</p>
            </div>
            <div class="step-box">
              <div class="step-number">3</div>
              <p><strong>Rapportera:</strong> Ring IT-support / CISO omedelbart. Beskriv vad som hänt. Vänta inte — varje minut räknas.</p>
            </div>
            <div class="step-box">
              <div class="step-number">4</div>
              <p><strong>Åtgärda:</strong> IT-teamet tar bort hotet, patchar sårbarheter och återställer system. Du hjälper till genom att svara på frågor.</p>
            </div>
            <div class="step-box">
              <div class="step-number">5</div>
              <p><strong>Utvärdera:</strong> Uppföljningsmöte: Vad hände? Varför? Hur förhindrar vi det igen? Uppdatera rutiner.</p>
            </div>
          </div>

          <div class="example-box">
            <div class="example-label">Exempel — Snabb rapportering räddar situationen</div>
            <p>Kl 09:15 klickar en anställd på en phishing-länk och anger sina inloggningsuppgifter. Kl 09:20 inser hon att något var fel och ringer IT-support direkt. Kl 09:25 spärrar IT kontot och tvingar lösenordsbyte. Kl 09:30 identifieras att angriparen hann logga in men inte nådde några system. Tack vare att rapporteringen skedde inom 5 minuter begränsades skadan helt.</p>
          </div>

          <div class="example-box">
            <div class="example-label">Exempel — Sen rapportering eskalerar</div>
            <p>En anställd märker att datorn beter sig konstigt men tänker "det är väl inget" och väntar till nästa dag. Under natten sprids ransomware till 50 datorer och krypterar fakturasystemet. Hade incidenten rapporterats direkt hade IT kunnat isolera den första datorn och stoppa spridningen.</p>
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

          <div class="highlight-box">
            <span class="hl-icon">⏱️</span>
            <p><strong>Tid är allt:</strong> Genomsnittlig tid från initial åtkomst till fullständig ransomware-kryptering har minskat från dagar till timmar. Snabb rapportering — inom minuter — kan vara skillnaden mellan en isolerad incident och total driftstopp.</p>
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

          <div class="compare-grid">
            <div class="compare-card">
              <h5>💻 IT-system</h5>
              <p>Prioritet: Konfidentialitet. Livslängd: 3-5 år. Patchar: Regelbundna. Omstart: Acceptabelt. Standard: ISO 27001.</p>
            </div>
            <div class="compare-card">
              <h5>⚙️ OT-system</h5>
              <p>Prioritet: Tillgänglighet. Livslängd: 15-30 år. Patchar: Sällan/svårt. Omstart: Kan vara omöjligt. Standard: IEC 62443.</p>
            </div>
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

          <div class="example-box">
            <div class="example-label">Exempel — IT/OT-konvergens i praktiken</div>
            <p>Ett elnätsbolag kopplar sina transformatorstationer till internet för fjärrövervakning. En anställd klickar på en phishing-länk på sin kontorsdator. Malware sprider sig via IT-nätverket. Utan ordentlig IT/OT-segmentering når det SCADA-systemet. Med en brandvägg och DMZ mellan IT och OT hade spridningen stoppats.</p>
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

          <div class="example-box">
            <div class="example-label">Exempel — Fysisk säkerhetsbrist</div>
            <p>En elektriker anlitad av en underleverantör besöker en obemannad transformatorstation. Stationen saknar passersystem — bara ett vanligt lås. Elektrikern kopplar in sitt eget USB-minne i HMI-datorn för att "uppdatera firmware". USB-minnet innehåller malware. Med ett passersystem, loggning och USB-blockering hade detta förhindrats.</p>
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

          <div class="highlight-box">
            <span class="hl-icon">🔐</span>
            <p><strong>Kryptering i vardagen:</strong> Varje gång du ser "https://" och ett hänglås i webbläsaren används TLS-kryptering. Utan det kan vem som helst på samma nätverk läsa din kommunikation — inklusive lösenord och personuppgifter.</p>
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

          <div class="example-box">
            <div class="example-label">Exempel — Kryptering i praktiken</div>
            <p>En drifttekniker jobbar hemifrån och behöver komma åt SCADA-statusen. Utan VPN: trafiken skickas okrypterad — alla på samma WiFi-nätverk (t.ex. på ett café) kan se kommunikationen. Med VPN: en krypterad tunnel skapas och all data är oläslig för utomstående. Utan VPN ska du ALDRIG ansluta till arbetssystem.</p>
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

          <div class="compare-grid">
            <div class="compare-card good">
              <h5>✅ Krypterad</h5>
              <p>En bärbar dator med heldiskkryptering (BitLocker/FileVault) förloras. Data är oåtkomlig utan lösenord. Ingen GDPR-anmälan krävs normalt.</p>
            </div>
            <div class="compare-card bad">
              <h5>❌ Okrypterad</h5>
              <p>En bärbar dator utan kryptering förloras. Hårddisken kan läsas av vem som helst. Personuppgifter exponerade. GDPR-anmälan krävs inom 72 timmar.</p>
            </div>
          </div>

          <div class="key-takeaway">
            <strong>Praktiskt:</strong> I en energiorganisation bör följande krypteras: (1) All kommunikation med SCADA-system, (2) VPN för all fjärråtkomst, (3) E-post med känslig information, (4) Databaser med kunduppgifter, (5) Backup-kopior, (6) Bärbara enheter (laptops, USB-minnen).
          </div>
        `,
      },
    ],
  },
];
