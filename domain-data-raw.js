// Domain study content from previous app
export const domainData = [
  {
    id: 1,
    numeral: 'I',
    title: 'Understanding the Foundations of AI Governance',
    shortTitle: 'Foundations',
    questions: '16–20 questions',
    icon: 'brain',
    color: '#01696F',
    chapters: [
      {
        id: 'IA',
        title: 'I.A: Foundational Concepts of AI',
        content: `
          <div class="concept-block" style="animation-delay:0ms">
            <h4>OECD Definition of AI System</h4>
            <p>"A machine-based system that, for explicit or implicit objectives, infers, from the input it receives, how to generate outputs such as predictions, content, recommendations, or decisions that can influence physical or virtual environments."</p>
            <p>This definition is referenced by the EU AI Act, NIST AI RMF, and other major regulatory instruments.</p>
          </div>
          <div class="concept-block" style="animation-delay:100ms">
            <h4>Types of AI</h4>
            <ul>
              <li><strong>Traditional/Rule-based AI</strong> — Explicit rules programmed by humans</li>
              <li><strong>Machine Learning</strong> — Supervised, unsupervised, and reinforcement learning</li>
              <li><strong>Deep Learning</strong> — Neural networks with multiple layers</li>
              <li><strong>Generative AI</strong> — LLMs like GPT, Claude, Gemini that create new content</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:200ms">
            <h4>AI Capability Levels</h4>
            <table class="study-table">
              <thead><tr><th>Level</th><th>Description</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td>Narrow AI (ANI)</td><td>Specialized for specific tasks</td><td>All current systems</td></tr>
                <tr><td>General AI (AGI)</td><td>Human-level reasoning across domains</td><td>Theoretical</td></tr>
                <tr><td>Superintelligent AI</td><td>Exceeds human intelligence in all areas</td><td>Hypothetical</td></tr>
              </tbody>
            </table>
          </div>
          <div class="concept-block" style="animation-delay:300ms">
            <h4>NIST Bias Categories</h4>
            <ul>
              <li><strong>Systemic</strong> — Embedded in datasets and societal structures</li>
              <li><strong>Computational/Statistical</strong> — Non-representative samples, algorithmic errors</li>
              <li><strong>Human-Cognitive</strong> — Confirmation bias, automation bias, groupthink</li>
            </ul>
          </div>
          <div class="exam-tip">
            <div class="exam-tip-icon"><i data-lucide="alert-triangle" width="18" height="18"></i></div>
            <div class="exam-tip-content">
              <div class="exam-tip-label">Exam Tip</div>
              The OECD AI definition is critical — know that it emphasizes "machine-based," "infers from input," and "can influence environments." Expect questions testing this exact wording.
            </div>
          </div>
          <div class="concept-block" style="animation-delay:400ms">
            <h4>7 Unique AI Characteristics Requiring Governance</h4>
            <ul>
              <li><strong>Complexity</strong> — Intricate system interactions</li>
              <li><strong>Opacity</strong> — Black box problem</li>
              <li><strong>Autonomy</strong> — Decision-making without human intervention</li>
              <li><strong>Speed and Scale</strong> — Operates at volume humans cannot match</li>
              <li><strong>Potential for Harm/Misuse</strong> — Dual-use capabilities</li>
              <li><strong>Data Dependency</strong> — Quality in, quality out</li>
              <li><strong>Probabilistic Outputs</strong> — Not deterministic like traditional software</li>
            </ul>
          </div>
          <div class="key-takeaway">
            <div class="key-takeaway-icon"><i data-lucide="lightbulb" width="18" height="18"></i></div>
            <div class="key-takeaway-content">
              <div class="key-takeaway-label">Key Takeaway</div>
              AI risks span four levels: individuals (discrimination, privacy), groups (amplified bias), organizations (legal, reputational), and society (democratic erosion, job displacement).
            </div>
          </div>`
      },
      {
        id: 'IB',
        title: 'I.B: Principles of Responsible AI',
        content: `
          <div class="concept-block" style="animation-delay:0ms">
            <h4>6 Core Principles of Responsible AI</h4>
            <table class="study-table">
              <thead><tr><th>Principle</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td>Fairness & Non-discrimination</td><td>Equal treatment across demographics; multiple mathematical definitions exist (demographic parity, equalized odds, calibration) — they cannot all be satisfied simultaneously</td></tr>
                <tr><td>Transparency</td><td>Meaningful information about AI system purpose, capabilities, and limitations</td></tr>
                <tr><td>Explainability & Interpretability</td><td>Explainability: describe decisions in human terms. Interpretability: understand meaning of outputs in context</td></tr>
                <tr><td>Accountability</td><td>Clear roles, responsibility assignment, audit trails</td></tr>
                <tr><td>Safety & Reliability</td><td>Robust testing, fail-safe mechanisms, human override capability</td></tr>
                <tr><td>Privacy</td><td>Data minimization, purpose limitation, consent, PETs</td></tr>
              </tbody>
            </table>
          </div>
          <div class="concept-block" style="animation-delay:100ms">
            <h4>Privacy-Enhancing Technologies (PETs)</h4>
            <ul>
              <li><strong>Differential Privacy</strong> — Adding noise to protect individual data</li>
              <li><strong>Federated Learning</strong> — Training across devices without centralizing data</li>
              <li><strong>Homomorphic Encryption</strong> — Computing on encrypted data</li>
              <li><strong>Secure Multi-Party Computation</strong> — Joint computation without revealing inputs</li>
              <li><strong>Synthetic Data Generation</strong> — Creating artificial datasets that preserve statistical properties</li>
            </ul>
          </div>
          <div class="exam-tip">
            <div class="exam-tip-icon"><i data-lucide="alert-triangle" width="18" height="18"></i></div>
            <div class="exam-tip-content">
              <div class="exam-tip-label">Exam Tip</div>
              Know the distinction: <strong>Explainability</strong> describes HOW a decision was made; <strong>Interpretability</strong> describes WHAT the output means in context. The exam tests this difference.
            </div>
          </div>
          <div class="key-takeaway">
            <div class="key-takeaway-icon"><i data-lucide="lightbulb" width="18" height="18"></i></div>
            <div class="key-takeaway-content">
              <div class="key-takeaway-label">Key Takeaway</div>
              Multiple fairness definitions (demographic parity, equalized odds, calibration) cannot all be satisfied simultaneously. This is a mathematical impossibility, not a policy choice — the exam frequently tests this concept.
            </div>
          </div>`
      },
      {
        id: 'IC',
        title: 'I.C: AI Governance Structures and Roles',
        content: `
          <div class="concept-block" style="animation-delay:0ms">
            <h4>Governance Structure Models</h4>
            <table class="study-table">
              <thead><tr><th>Model</th><th>Pros</th><th>Cons</th></tr></thead>
              <tbody>
                <tr><td>Centralized</td><td>Consistent policies, clear accountability</td><td>Less agile, bottleneck risk</td></tr>
                <tr><td>Decentralized</td><td>Flexible, fast</td><td>Fragmented, inconsistent</td></tr>
                <tr><td>Hub-and-Spoke (Federated)</td><td>Balanced — central standards with local flexibility</td><td>Requires coordination</td></tr>
              </tbody>
            </table>
          </div>
          <div class="svg-diagram-container">
            <h5>Governance Structure: Hub-and-Spoke Model</h5>
            <svg id="gov-structure-svg" viewBox="0 0 400 300" width="400" height="300"></svg>
          </div>
          <div class="concept-block" style="animation-delay:100ms">
            <h4>Key Governance Roles</h4>
            <ul>
              <li><strong>Chief AI Officer</strong> — Strategic oversight of AI initiatives</li>
              <li><strong>AI Ethics Board</strong> — Cross-functional (technical, legal, business, ethics, external stakeholders)</li>
              <li><strong>AI Governance Committee</strong> — Policy development and enforcement</li>
              <li><strong>Data Protection Officer</strong> — Privacy compliance</li>
              <li><strong>Model Risk Manager</strong> — Model risk assessment and monitoring</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:200ms">
            <h4>Framework Components</h4>
            <ul>
              <li><strong>Policies</strong> — High-level principles and rules</li>
              <li><strong>Procedures</strong> — Step-by-step instructions</li>
              <li><strong>Standards</strong> — Mandatory requirements</li>
              <li><strong>Guidelines</strong> — Recommended practices</li>
              <li><strong>Controls</strong> — Technical and organizational safeguards</li>
            </ul>
          </div>
          <div class="key-takeaway">
            <div class="key-takeaway-icon"><i data-lucide="lightbulb" width="18" height="18"></i></div>
            <div class="key-takeaway-content">
              <div class="key-takeaway-label">Key Takeaway</div>
              The hub-and-spoke (federated) model is the most recommended governance structure — it provides central oversight and standards while allowing business units flexibility in implementation.
            </div>
          </div>`
      },
      {
        id: 'ID',
        title: 'I.D: AI Lifecycle Policies and Governance',
        content: `
          <div class="svg-diagram-container">
            <h5>AI System Lifecycle</h5>
            <svg id="lifecycle-svg" viewBox="0 0 400 400" width="400" height="400"></svg>
          </div>
          <div class="concept-block" style="animation-delay:0ms">
            <h4>AI Lifecycle Phases</h4>
            <ul>
              <li>Planning & Design</li>
              <li>Data Collection & Processing</li>
              <li>Model Development</li>
              <li>Testing & Validation</li>
              <li>Deployment</li>
              <li>Monitoring & Maintenance</li>
              <li>Decommissioning</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:100ms">
            <h4>Key Policy Types</h4>
            <ul>
              <li><strong>Acceptable Use Policy</strong> — Defines permitted AI uses</li>
              <li><strong>AI Risk Management Policy</strong> — Risk identification and mitigation</li>
              <li><strong>Data Governance Policy</strong> — Data handling requirements</li>
              <li><strong>Model Governance Policy</strong> — Model development and deployment standards</li>
              <li><strong>Incident Response Policy</strong> — Handling AI-related incidents</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:200ms">
            <h4>Impact Assessments</h4>
            <ul>
              <li><strong>AI Impact Assessment (AIA)</strong> — Broad evaluation of AI effects</li>
              <li><strong>Algorithmic Impact Assessment</strong> — Focus on algorithmic decisions</li>
              <li><strong>Human Rights Impact Assessment</strong> — Effects on fundamental rights</li>
              <li><strong>Data Protection Impact Assessment (DPIA)</strong> — Required under GDPR for high-risk processing</li>
            </ul>
          </div>
          <div class="exam-tip">
            <div class="exam-tip-icon"><i data-lucide="alert-triangle" width="18" height="18"></i></div>
            <div class="exam-tip-content">
              <div class="exam-tip-label">Exam Tip</div>
              A risk-based approach means categorizing AI systems by risk level and applying proportional governance — not treating all AI systems the same. This is a core concept across frameworks.
            </div>
          </div>`
      }
    ]
  },
  {
    id: 2,
    numeral: 'II',
    title: 'Understanding Current Laws, Standards and Frameworks',
    shortTitle: 'Laws & Standards',
    questions: '28–34 questions',
    icon: 'scale',
    color: '#006494',
    chapters: [
      {
        id: 'IIA',
        title: 'II.A: Privacy and Data Protection Laws',
        content: `
          <div class="concept-block" style="animation-delay:0ms">
            <h4>GDPR & AI</h4>
            <ul>
              <li><strong>Article 22</strong> — Right not to be subject to solely automated decisions with legal or significant effects</li>
              <li><strong>DPIA</strong> — Required for high-risk automated processing</li>
              <li><strong>Lawfulness bases</strong> — Consent, legitimate interest, contract, legal obligation, public task, vital interests</li>
              <li><strong>Data subject rights</strong> — Access, rectification, erasure, portability, objection</li>
              <li><strong>Data protection by design and by default</strong></li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:100ms">
            <h4>GDPR–AI Tensions</h4>
            <table class="study-table">
              <thead><tr><th>GDPR Principle</th><th>AI Challenge</th></tr></thead>
              <tbody>
                <tr><td>Purpose limitation</td><td>Model retraining may expand original purpose</td></tr>
                <tr><td>Data minimization</td><td>AI models need large training datasets</td></tr>
                <tr><td>Storage limitation</td><td>Models retain data implicitly</td></tr>
                <tr><td>Accuracy</td><td>AI outputs are probabilistic, not deterministic</td></tr>
              </tbody>
            </table>
          </div>
          <div class="concept-block" style="animation-delay:200ms">
            <h4>Other Privacy Laws</h4>
            <ul>
              <li><strong>CCPA/CPRA</strong> — Right to opt out of profiling, data minimization</li>
              <li><strong>LGPD (Brazil)</strong>, <strong>PIPL (China)</strong>, <strong>PIPA (South Korea)</strong> — All have AI-relevant provisions</li>
            </ul>
          </div>
          <div class="exam-tip">
            <div class="exam-tip-icon"><i data-lucide="alert-triangle" width="18" height="18"></i></div>
            <div class="exam-tip-content">
              <div class="exam-tip-label">Exam Tip</div>
              GDPR Article 22 is heavily tested. Remember: it applies to <strong>solely</strong> automated decisions with <strong>legal or similarly significant</strong> effects. Human involvement that is merely nominal doesn't satisfy the requirement.
            </div>
          </div>
          <div class="key-takeaway">
            <div class="key-takeaway-icon"><i data-lucide="lightbulb" width="18" height="18"></i></div>
            <div class="key-takeaway-content">
              <div class="key-takeaway-label">Key Takeaway</div>
              Privacy-Enhancing Technologies (PETs) like differential privacy, federated learning, and homomorphic encryption can help resolve the tension between AI data needs and privacy requirements.
            </div>
          </div>`
      },
      {
        id: 'IIB',
        title: 'II.B: Other Existing Laws Applied to AI',
        content: `
          <div class="concept-block" style="animation-delay:0ms">
            <h4>IP Law & AI</h4>
            <ul>
              <li><strong>Training data copyright</strong> — US: fair use doctrine (4 factors); EU: CDSM text/data mining exception with opt-out</li>
              <li><strong>AI-generated content</strong> — Requires human authorship (US Copyright Office); AI cannot be named inventor (DABUS case)</li>
              <li><strong>AI-assisted inventions</strong> — Patentable if human made substantive contribution</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:100ms">
            <h4>Non-Discrimination Laws</h4>
            <ul>
              <li><strong>Employment</strong> — Title VII, California FEHA (effective Oct 2025 — explicitly addresses AI/ADS), ADA</li>
              <li><strong>Credit</strong> — ECOA, FCRA</li>
              <li><strong>Housing</strong> — Fair Housing Act</li>
              <li><strong>Disparate impact doctrine</strong> — Neutral practices with disproportionate effect on protected groups</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:200ms">
            <h4>Product Liability & AI</h4>
            <ul>
              <li><strong>Design defects</strong> — Architectural AI flaws</li>
              <li><strong>Development defects</strong> — Training/data issues</li>
              <li><strong>Failure to warn</strong> — Inadequate AI limitations disclosure</li>
              <li><strong>EU Product Liability Directive (2024)</strong> — Expanded to include software/AI/digital components</li>
            </ul>
          </div>
          <div class="exam-tip">
            <div class="exam-tip-icon"><i data-lucide="alert-triangle" width="18" height="18"></i></div>
            <div class="exam-tip-content">
              <div class="exam-tip-label">Exam Tip</div>
              The DABUS case established globally that AI systems cannot be named as inventors on patents. However, AI-assisted inventions ARE patentable if a human made the substantive inventive contribution.
            </div>
          </div>`
      },
      {
        id: 'IIC',
        title: 'II.C: AI-Specific Laws and Regulations',
        content: `
          <div class="concept-block" style="animation-delay:0ms">
            <h4>EU AI Act: Risk-Based Classification</h4>
          </div>
          <div class="svg-diagram-container">
            <h5>EU AI Act Risk Pyramid</h5>
            <svg id="risk-pyramid-svg" viewBox="0 0 420 340" width="420" height="340"></svg>
          </div>
          <div class="concept-block" style="animation-delay:100ms">
            <h4>Prohibited AI Practices (Unacceptable Risk)</h4>
            <ul>
              <li>Social scoring by public authorities</li>
              <li>Subliminal manipulation causing harm</li>
              <li>Exploitation of vulnerable groups</li>
              <li>Emotion inference in workplaces/schools</li>
              <li>Untargeted facial image scraping</li>
              <li>Predictive policing based solely on profiling</li>
              <li>Real-time remote biometric ID in public (with narrow exceptions)</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:200ms">
            <h4>High-Risk AI Requirements</h4>
            <ul>
              <li>Risk management system</li>
              <li>Data governance</li>
              <li>Technical documentation</li>
              <li>Record-keeping & transparency</li>
              <li>Human oversight</li>
              <li>Accuracy, robustness, cybersecurity</li>
              <li>Conformity assessment</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:300ms">
            <h4>GPAI (General-Purpose AI) Provisions</h4>
            <table class="study-table">
              <thead><tr><th>Requirement</th><th>All GPAI</th><th>Systemic Risk GPAI (>10²⁵ FLOPs)</th></tr></thead>
              <tbody>
                <tr><td>Technical documentation</td><td>✓</td><td>✓</td></tr>
                <tr><td>EU copyright compliance</td><td>✓</td><td>✓</td></tr>
                <tr><td>Training data summary</td><td>✓</td><td>✓</td></tr>
                <tr><td>Model evaluations</td><td></td><td>✓</td></tr>
                <tr><td>Systemic risk assessment</td><td></td><td>✓</td></tr>
                <tr><td>Red teaming</td><td></td><td>✓</td></tr>
                <tr><td>Incident reporting</td><td></td><td>✓</td></tr>
              </tbody>
            </table>
          </div>
          <div class="concept-block" style="animation-delay:400ms">
            <h4>EU AI Act Timeline</h4>
            <table class="study-table">
              <thead><tr><th>Date</th><th>Milestone</th></tr></thead>
              <tbody>
                <tr><td>August 2024</td><td>Entered into force</td></tr>
                <tr><td>February 2025</td><td>Prohibited practices effective</td></tr>
                <tr><td>August 2025</td><td>GPAI obligations</td></tr>
                <tr><td>August 2026</td><td>High-risk obligations</td></tr>
                <tr><td>August 2027</td><td>Full application</td></tr>
              </tbody>
            </table>
          </div>
          <div class="exam-tip">
            <div class="exam-tip-icon"><i data-lucide="alert-triangle" width="18" height="18"></i></div>
            <div class="exam-tip-content">
              <div class="exam-tip-label">Exam Tip</div>
              Know the systemic risk GPAI threshold: >10²⁵ FLOPs. These providers must do red teaming, model evaluations, and incident reporting — requirements that don't apply to all GPAI providers.
            </div>
          </div>`
      },
      {
        id: 'IID',
        title: 'II.D: Standards and Frameworks',
        content: `
          <div class="concept-block" style="animation-delay:0ms">
            <h4>OECD AI Principles (2019, updated 2024)</h4>
            <p>5 principles adopted by 46+ countries:</p>
            <ul>
              <li>Inclusive growth, sustainable development, well-being</li>
              <li>Human-centred values and fairness</li>
              <li>Transparency and explainability</li>
              <li>Robustness, security and safety</li>
              <li>Accountability</li>
            </ul>
          </div>
          <div class="svg-diagram-container">
            <h5>NIST AI Risk Management Framework</h5>
            <svg id="nist-rmf-svg" viewBox="0 0 400 400" width="400" height="400"></svg>
          </div>
          <div class="concept-block" style="animation-delay:100ms">
            <h4>NIST AI RMF 1.0 Core Functions</h4>
            <table class="study-table">
              <thead><tr><th>Function</th><th>Purpose</th><th>Key Activities</th></tr></thead>
              <tbody>
                <tr><td>GOVERN</td><td>Cross-cutting — policies, processes, accountability</td><td>Establish governance structure, define roles, create policies</td></tr>
                <tr><td>MAP</td><td>Contextualize risks</td><td>Identify stakeholders, characterize AI system, assess context</td></tr>
                <tr><td>MEASURE</td><td>Quantify and assess risks</td><td>Test for bias/fairness/reliability, evaluate metrics</td></tr>
                <tr><td>MANAGE</td><td>Treat and monitor risks</td><td>Prioritize risks, implement controls, continuous monitoring</td></tr>
              </tbody>
            </table>
          </div>
          <div class="concept-block" style="animation-delay:200ms">
            <h4>ISO/IEC 42001:2023 — AI Management System</h4>
            <ul>
              <li>First international <strong>certifiable</strong> standard for AI</li>
              <li>Based on Annex SL (compatible with ISO 27001, 9001)</li>
              <li>Annex A controls: AI policies, risk management, responsible AI, lifecycle, data, impact assessment, documentation, third-party management</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:300ms">
            <h4>Key Frameworks Comparison</h4>
            <table class="study-table">
              <thead><tr><th>Framework</th><th>Type</th><th>Key Feature</th></tr></thead>
              <tbody>
                <tr><td>OECD AI Principles</td><td>International principles</td><td>5 principles, 46+ countries</td></tr>
                <tr><td>NIST AI RMF 1.0</td><td>Voluntary framework</td><td>GOVERN-MAP-MEASURE-MANAGE</td></tr>
                <tr><td>ISO/IEC 42001</td><td>Certifiable standard</td><td>AI Management System (AIMS)</td></tr>
                <tr><td>EU AI Act</td><td>Binding regulation</td><td>Risk-based classification (4 tiers)</td></tr>
                <tr><td>IEEE 7000-2021</td><td>Standard</td><td>Ethics in system design</td></tr>
              </tbody>
            </table>
          </div>
          <div class="key-takeaway">
            <div class="key-takeaway-icon"><i data-lucide="lightbulb" width="18" height="18"></i></div>
            <div class="key-takeaway-content">
              <div class="key-takeaway-label">Key Takeaway</div>
              GOVERN is the cross-cutting function in NIST AI RMF — it applies to MAP, MEASURE, and MANAGE. ISO 42001 is the only certifiable AI standard. The OECD principles form the basis for the G20 AI Principles.
            </div>
          </div>`
      }
    ]
  },
  {
    id: 3,
    numeral: 'III',
    title: 'Understanding How to Govern the Development of AI',
    shortTitle: 'Development',
    questions: '21–25 questions',
    icon: 'code-2',
    color: '#7A39BB',
    chapters: [
      {
        id: 'IIIA',
        title: 'III.A: Design Governance',
        content: `
          <div class="concept-block" style="animation-delay:0ms">
            <h4>Design Thinking for AI</h4>
            <ul>
              <li><strong>Human-centered design</strong> — Focus on end user needs and impacts</li>
              <li><strong>Stakeholder engagement</strong> — Involve affected parties early</li>
              <li><strong>Inclusive design</strong> — Consider diverse populations</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:100ms">
            <h4>AI Impact Assessment</h4>
            <ul>
              <li>Identify affected stakeholders</li>
              <li>Assess potential harms and benefits</li>
              <li>Evaluate proportionality</li>
              <li>Document mitigation measures</li>
              <li>Should occur <strong>before</strong> development begins</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:200ms">
            <h4>Architecture Decisions with Governance Implications</h4>
            <ul>
              <li><strong>Model selection</strong> — Complexity vs interpretability trade-off</li>
              <li><strong>Data pipeline design</strong> — Provenance and quality controls</li>
              <li><strong>Human oversight integration</strong> — Points of human review</li>
              <li><strong>Feedback mechanisms</strong> — User reporting channels</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:300ms">
            <h4>Governance Gates</h4>
            <p>Stage-gate reviews at key development milestones ensure governance checkpoints are integrated into the development process, not bolted on after the fact.</p>
          </div>
          <div class="exam-tip">
            <div class="exam-tip-icon"><i data-lucide="alert-triangle" width="18" height="18"></i></div>
            <div class="exam-tip-content">
              <div class="exam-tip-label">Exam Tip</div>
              The complexity-interpretability trade-off is a key design decision: more complex models (deep learning) are harder to explain. For high-stakes decisions, interpretability may be more important than marginal accuracy gains.
            </div>
          </div>`
      },
      {
        id: 'IIIB',
        title: 'III.B: Data and Model Governance',
        content: `
          <div class="concept-block" style="animation-delay:0ms">
            <h4>5 Key Data Requirements for AI</h4>
            <table class="study-table">
              <thead><tr><th>#</th><th>Requirement</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>Lawful rights to use</td><td>Consent, legitimate interest, contractual necessity</td></tr>
                <tr><td>2</td><td>Data quality</td><td>Accuracy, completeness, timeliness, consistency</td></tr>
                <tr><td>3</td><td>Data quantity</td><td>Sufficient volume for reliable training</td></tr>
                <tr><td>4</td><td>Data integrity</td><td>Protection from corruption, unauthorized modification</td></tr>
                <tr><td>5</td><td>Fit-for-purpose</td><td>Appropriate for the specific AI use case</td></tr>
              </tbody>
            </table>
          </div>
          <div class="concept-block" style="animation-delay:100ms">
            <h4>Data Provenance vs Data Lineage</h4>
            <ul>
              <li><strong>Provenance</strong> — Records WHERE data originates (source, collection method, conditions)</li>
              <li><strong>Lineage</strong> — Tracks HOW data was transformed, cleaned, and augmented throughout its lifecycle</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:200ms">
            <h4>7 Testing Types for AI Systems</h4>
            <ul>
              <li><strong>Unit testing</strong> — Individual component validation</li>
              <li><strong>Integration testing</strong> — Component interaction verification</li>
              <li><strong>Validation testing</strong> — Meets requirements and purpose</li>
              <li><strong>Performance testing</strong> — Speed, throughput, scalability</li>
              <li><strong>Security testing</strong> — Vulnerability assessment</li>
              <li><strong>Bias testing</strong> — Fairness across demographics</li>
              <li><strong>Interpretability testing</strong> — Output explainability</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:300ms">
            <h4>Key Issues to Monitor</h4>
            <ul>
              <li><strong>Overfitting</strong> — Model learns noise instead of patterns</li>
              <li><strong>Underfitting</strong> — Model too simple to capture patterns</li>
              <li><strong>Data leakage</strong> — Test data inadvertently in training set</li>
              <li><strong>Concept drift</strong> — Underlying real-world patterns change</li>
              <li><strong>Label noise</strong> — Incorrect training labels</li>
              <li><strong>Data poisoning</strong> — Malicious data manipulation</li>
            </ul>
          </div>
          <div class="key-takeaway">
            <div class="key-takeaway-icon"><i data-lucide="lightbulb" width="18" height="18"></i></div>
            <div class="key-takeaway-content">
              <div class="key-takeaway-label">Key Takeaway</div>
              Strict training/testing data separation is essential to prevent data leakage. Also distinguish data provenance (origin) from data lineage (transformation history) — the exam tests this distinction.
            </div>
          </div>`
      },
      {
        id: 'IIIC',
        title: 'III.C: Release, Monitoring and Maintenance',
        content: `
          <div class="concept-block" style="animation-delay:0ms">
            <h4>Model Cards</h4>
            <p>A model card documents key information about an AI model:</p>
            <ul>
              <li>Purpose and intended uses</li>
              <li>Performance characteristics and metrics</li>
              <li>Limitations and out-of-scope uses</li>
              <li>Ethical considerations</li>
              <li>Training data specifications</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:100ms">
            <h4>5 Areas of Continuous Monitoring</h4>
            <table class="study-table">
              <thead><tr><th>Area</th><th>What to Monitor</th></tr></thead>
              <tbody>
                <tr><td>Performance</td><td>Accuracy, latency, throughput, error rates</td></tr>
                <tr><td>Data drift</td><td>Distribution changes vs training data</td></tr>
                <tr><td>Model drift</td><td>Performance degradation over time</td></tr>
                <tr><td>Bias</td><td>Fairness metrics across demographics</td></tr>
                <tr><td>Security</td><td>Adversarial attacks, anomalous inputs</td></tr>
              </tbody>
            </table>
          </div>
          <div class="concept-block" style="animation-delay:200ms">
            <h4>Periodic Assessments</h4>
            <ul>
              <li><strong>Audits</strong> — Internal/external compliance review</li>
              <li><strong>Red teaming</strong> — Adversarial testing (required for systemic GPAI under EU AI Act)</li>
              <li><strong>Threat modeling</strong> — Identifying potential attack vectors</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:300ms">
            <h4>Incident Management Process</h4>
            <p>Detection → Response → Root Cause Analysis → Remediation → Documentation</p>
            <p>Common root causes: brittleness, lack of robustness, poor data quality, insufficient testing, model drift, data drift.</p>
          </div>
          <div class="exam-tip">
            <div class="exam-tip-icon"><i data-lucide="alert-triangle" width="18" height="18"></i></div>
            <div class="exam-tip-content">
              <div class="exam-tip-label">Exam Tip</div>
              Data drift vs model drift: <strong>Data drift</strong> is when input data distribution changes. <strong>Model drift</strong> is when the model's performance degrades. Data drift often causes model drift, but they are distinct concepts.
            </div>
          </div>`
      }
    ]
  },
  {
    id: 4,
    numeral: 'IV',
    title: 'Understanding How to Govern AI Deployment and Use',
    shortTitle: 'Deployment',
    questions: '21–25 questions',
    icon: 'rocket',
    color: '#DA7101',
    chapters: [
      {
        id: 'IVA',
        title: 'IV.A: Deployment Factors',
        content: `
          <div class="concept-block" style="animation-delay:0ms">
            <h4>AI Model Types & Governance Implications</h4>
            <table class="study-table">
              <thead><tr><th>Dimension</th><th>Options</th><th>Governance Implication</th></tr></thead>
              <tbody>
                <tr><td>Classic vs Generative</td><td>Traditional ML vs LLMs</td><td>Generative: hallucination, IP, content safety</td></tr>
                <tr><td>Pre-trained vs Custom</td><td>Off-the-shelf vs trained</td><td>Custom: more control but more responsibility</td></tr>
                <tr><td>API vs On-premises</td><td>Cloud vs local</td><td>API: data governance concerns, latency trade-offs</td></tr>
                <tr><td>Open-source vs Proprietary</td><td>Transparent vs vendor</td><td>Open: transparency; Proprietary: support, liability</td></tr>
              </tbody>
            </table>
          </div>
          <div class="concept-block" style="animation-delay:100ms">
            <h4>Provider vs Deployer Obligations (EU AI Act)</h4>
            <ul>
              <li><strong>Provider</strong> — Develops or places AI system on market. Responsible for compliance, conformity assessment, technical documentation</li>
              <li><strong>Deployer</strong> — Uses AI system in professional capacity. Responsible for appropriate use, human oversight, monitoring in context</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:200ms">
            <h4>Third-Party AI Assessment</h4>
            <ul>
              <li>Vendor due diligence</li>
              <li>Contractual safeguards</li>
              <li>Performance validation in deployment context</li>
              <li>Ongoing monitoring of vendor performance</li>
            </ul>
          </div>
          <div class="exam-tip">
            <div class="exam-tip-icon"><i data-lucide="alert-triangle" width="18" height="18"></i></div>
            <div class="exam-tip-content">
              <div class="exam-tip-label">Exam Tip</div>
              Under the EU AI Act, both providers AND deployers have obligations. A deployer cannot simply rely on the provider's compliance — they must ensure proper use, human oversight, and monitoring in their specific context.
            </div>
          </div>`
      },
      {
        id: 'IVB',
        title: 'IV.B: Model Assessment and Testing',
        content: `
          <div class="concept-block" style="animation-delay:0ms">
            <h4>Pre-Deployment Assessment Checklist</h4>
            <ul>
              <li>Accuracy benchmarks against deployment-relevant data</li>
              <li>Fairness evaluation across protected groups</li>
              <li>Security testing (adversarial robustness)</li>
              <li>Regulatory compliance verification</li>
              <li>Documentation completeness check</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:100ms">
            <h4>Deployer-Specific Testing</h4>
            <ul>
              <li>Test in <strong>deployment context</strong>, not just development context</li>
              <li>Use <strong>representative deployment data</strong> (deployment population may differ from training population)</li>
              <li>Assess edge cases specific to the use case</li>
              <li>Validate performance metrics: latency, throughput, reliability, scalability</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:200ms">
            <h4>Bias in Deployment</h4>
            <p>Bias testing in deployment may yield different results than in development because the deployment population may differ from the training population. This is why deployer-specific testing is essential.</p>
          </div>
          <div class="key-takeaway">
            <div class="key-takeaway-icon"><i data-lucide="lightbulb" width="18" height="18"></i></div>
            <div class="key-takeaway-content">
              <div class="key-takeaway-label">Key Takeaway</div>
              Testing in the deployment context is critical because the deployment population often differs from the training/development population. A model that passes development testing may still fail in production.
            </div>
          </div>`
      },
      {
        id: 'IVC',
        title: 'IV.C: Deployment Governance',
        content: `
          <div class="concept-block" style="animation-delay:0ms">
            <h4>Human Oversight Models</h4>
            <table class="study-table">
              <thead><tr><th>Model</th><th>Description</th><th>When to Use</th></tr></thead>
              <tbody>
                <tr><td>Human-in-the-Loop</td><td>Must approve every decision</td><td>High-stakes individual decisions (medical, legal)</td></tr>
                <tr><td>Human-on-the-Loop</td><td>Monitors with override capability</td><td>High-volume moderate-risk decisions</td></tr>
                <tr><td>Human-in-Command</td><td>Sets objectives and constraints</td><td>Strategic decisions, policy-level oversight</td></tr>
              </tbody>
            </table>
          </div>
          <div class="concept-block" style="animation-delay:100ms">
            <h4>Kill Switch & Deactivation</h4>
            <ul>
              <li><strong>Kill switch capability</strong> — Required for high-risk AI under EU AI Act</li>
              <li><strong>Localization by jurisdiction</strong> — Ability to disable in specific regions</li>
              <li><strong>Deactivation triggers</strong> — Defined conditions for automatic shutdown</li>
              <li><strong>Data handling after deactivation</strong> — Retention and disposal procedures</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:200ms">
            <h4>Secondary/Unintended Uses</h4>
            <ul>
              <li>Identify misuse scenarios proactively</li>
              <li>Implement technical controls (guardrails)</li>
              <li>Monitor downstream applications</li>
              <li>Establish terms of use / acceptable use policies</li>
            </ul>
          </div>
          <div class="concept-block" style="animation-delay:300ms">
            <h4>Documentation in Deployment</h4>
            <ul>
              <li>Incident logs</li>
              <li>Risk register updates</li>
              <li>Post-market monitoring reports</li>
              <li>Compliance documentation</li>
              <li>Stakeholder communication plans</li>
            </ul>
          </div>
          <div class="exam-tip">
            <div class="exam-tip-icon"><i data-lucide="alert-triangle" width="18" height="18"></i></div>
            <div class="exam-tip-content">
              <div class="exam-tip-label">Exam Tip</div>
              Know the three human oversight models precisely: Human-in-the-Loop (approves each decision), Human-on-the-Loop (monitors with override), Human-in-Command (sets objectives/constraints). The exam will present scenarios where you must pick the appropriate model.
            </div>
          </div>
          <div class="key-takeaway">
            <div class="key-takeaway-icon"><i data-lucide="lightbulb" width="18" height="18"></i></div>
            <div class="key-takeaway-content">
              <div class="key-takeaway-label">Key Takeaway</div>
              High-risk AI under the EU AI Act requires a kill switch capability. Deployment governance also means proactively identifying misuse scenarios and implementing guardrails before they occur.
            </div>
          </div>`
      }
    ]
  }
];
