import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

type GlossaryCategory = 'Capital Markets' | 'Angular' | 'Backend Contracts';

type CodeReference = {
  label: string;
  path: string;
  note: string;
};

type GlossaryTerm = {
  id: string;
  term: string;
  category: GlossaryCategory;
  summary: string;
  detail: string;
  codeReferences: CodeReference[];
  relatedTerms: string[];
};

@Component({
  standalone: true,
  selector: 'app-glossary-page',
  imports: [CommonModule, ButtonModule, TagModule],
  templateUrl: './glossary.page.html',
  styleUrl: './glossary.page.scss',
})
export class GlossaryPage {
  protected readonly categories: Array<GlossaryCategory | 'All'> = [
    'All',
    'Capital Markets',
    'Angular',
    'Backend Contracts',
  ];

  protected readonly selectedCategory = signal<GlossaryCategory | 'All'>('All');
  protected readonly selectedTermId = signal('security');

  protected readonly terms: GlossaryTerm[] = [
    {
      id: 'security',
      term: 'Security',
      category: 'Capital Markets',
      summary: 'A tradable instrument or securitized pool representation used by the lab search workflow.',
      detail:
        'In this lab, Security is the top-level capital-markets row shape for pool, coupon, balance, commitment, disclosure, settlement, and audit metadata. It is intentionally narrower than a full market security master.',
      codeReferences: [
        {
          label: 'Security Search facade',
          path: 'apps/architecture-dashboard/src/app/features/security-search/security-search.facade.ts',
          note: 'Defines deterministic SecuritySearchRowVm data and query projection.',
        },
        {
          label: 'Security Search page',
          path: 'apps/architecture-dashboard/src/app/features/security-search/security-search.page.ts',
          note: 'Binds filter, detail, export, and table state for security rows.',
        },
        {
          label: 'Capital Markets vocabulary',
          path: 'documentation/21-capital-markets-vocabulary.md',
          note: 'Locks shared naming across docs, DTOs, ViewModels, and planning.',
        },
      ],
      relatedTerms: ['Pool', 'Commitment', 'Disclosure File'],
    },
    {
      id: 'pool',
      term: 'Pool',
      category: 'Capital Markets',
      summary: 'A grouped set of loans backing a security or workflow row.',
      detail:
        'The pool term keeps the lab focused on grouped loan exposure, not complete agency or private-label pooling rules. It gives the UI a realistic capital-markets handle for balance, coupon, and disclosure state.',
      codeReferences: [
        {
          label: 'Security Search facade',
          path: 'apps/architecture-dashboard/src/app/features/security-search/security-search.facade.ts',
          note: 'Contains pool identifiers and related search filters.',
        },
        {
          label: 'Capital Markets page',
          path: 'apps/architecture-dashboard/src/app/features/capital-markets/capital-markets.page.ts',
          note: 'Shows the simplified security and commitment sample screen.',
        },
      ],
      relatedTerms: ['Security', 'Loan', 'Disclosure File'],
    },
    {
      id: 'commitment',
      term: 'Commitment',
      category: 'Capital Markets',
      summary: 'A delivery or trade workflow state tied to a security or pool.',
      detail:
        'Commitment state helps explain operational workflow around settlement readiness, trade delivery, and exceptions. The lab uses status tags and audit fields instead of modeling full trading lifecycle rules.',
      codeReferences: [
        {
          label: 'Security Search template',
          path: 'apps/architecture-dashboard/src/app/features/security-search/security-search.page.html',
          note: 'Renders commitment status and row actions in the PrimeNG table.',
        },
        {
          label: 'Phase 9A planning',
          path: 'planning/20-build-phases-and-acceptance-criteria.md',
          note: 'Tracks the PrimeNG capital-markets table acceptance criteria.',
        },
      ],
      relatedTerms: ['Security', 'Settlement', 'Trade Event'],
    },
    {
      id: 'disclosure-file',
      term: 'Disclosure File',
      category: 'Capital Markets',
      summary: 'A metadata artifact describing loan, pool, or security state for review.',
      detail:
        'Disclosure files stand in for audit-friendly file metadata. The lab uses them to teach filtering, missing-file states, export placeholders, and contract drift risk without implementing a document repository.',
      codeReferences: [
        {
          label: 'Security Search facade',
          path: 'apps/architecture-dashboard/src/app/features/security-search/security-search.facade.ts',
          note: 'Models disclosure status, filenames, and updated timestamps.',
        },
        {
          label: 'OpenAPI risk inventory',
          path: 'planning/phase-6-5-openapi-client-risk-inventory.md',
          note: 'Connects contract exposure and drift risk to generated client boundaries.',
        },
      ],
      relatedTerms: ['Security', 'Pool', 'Contract Snapshot'],
    },
    {
      id: 'agency-mbs',
      term: 'Agency MBS',
      category: 'Capital Markets',
      summary: 'A mortgage-backed security issued or guaranteed by an agency such as Fannie Mae, Freddie Mac, or Ginnie Mae.',
      detail:
        'Agency MBS is useful study vocabulary because many capital-markets systems organize loan pools, disclosure files, settlement dates, factors, and investor reporting around agency security identifiers. The lab does not model full agency eligibility rules, but the Security and Pool rows are shaped to resemble the operational data that appears around MBS workflows.',
      codeReferences: [
        {
          label: 'Capital Markets page',
          path: 'apps/architecture-dashboard/src/app/features/capital-markets/capital-markets.page.ts',
          note: 'Provides the simplified securities and commitments study surface.',
        },
        {
          label: 'Security Search facade',
          path: 'apps/architecture-dashboard/src/app/features/security-search/security-search.facade.ts',
          note: 'Models the security-level rows used for pool and disclosure study flows.',
        },
      ],
      relatedTerms: ['Pool', 'Disclosure File', 'Factor'],
    },
    {
      id: 'tba-trade',
      term: 'TBA Trade',
      category: 'Capital Markets',
      summary: 'A forward agency MBS trade where the exact pools are announced shortly before settlement.',
      detail:
        'TBA means to-be-announced. It is a core MBS market convention: trade economics such as agency, coupon, maturity, price, and settlement are agreed first, while final pool allocation happens later. In a training app, TBA concepts help explain why commitment state, allocation readiness, exception flags, and disclosure completeness matter before settlement.',
      codeReferences: [
        {
          label: 'Security Search template',
          path: 'apps/architecture-dashboard/src/app/features/security-search/security-search.page.html',
          note: 'Shows commitment status and row-level review actions that resemble allocation workflow checkpoints.',
        },
        {
          label: 'Security Search facade',
          path: 'apps/architecture-dashboard/src/app/features/security-search/security-search.facade.ts',
          note: 'Holds commitment and disclosure fields that can be studied as TBA readiness signals.',
        },
      ],
      relatedTerms: ['Commitment', 'Settlement', 'Pool Allocation'],
    },
    {
      id: 'pool-allocation',
      term: 'Pool Allocation',
      category: 'Capital Markets',
      summary: 'The process of assigning specific pools or loans to satisfy a commitment or delivery obligation.',
      detail:
        'Pool allocation connects front-office trade intent with operations data. Study the concept as a bridge between a commitment row, a pool identifier, disclosure availability, and settlement readiness. Real systems also check constraints such as coupon, maturity, agency, factor, unpaid balance, and delivery tolerance.',
      codeReferences: [
        {
          label: 'Security Search facade',
          path: 'apps/architecture-dashboard/src/app/features/security-search/security-search.facade.ts',
          note: 'Keeps pool identifiers and workflow status near the commitment row data.',
        },
        {
          label: 'Map Inspector',
          path: 'apps/architecture-dashboard/src/app/features/map-inspector/map-inspector.page.ts',
          note: 'Shows how lookup indexes support joining related entities without repeated scans.',
        },
      ],
      relatedTerms: ['TBA Trade', 'Pool', 'Commitment'],
    },
    {
      id: 'factor',
      term: 'Factor',
      category: 'Capital Markets',
      summary: 'A ratio showing the remaining principal balance of a pool relative to its original balance.',
      detail:
        'Factors are important in MBS and asset-backed workflows because principal pays down over time. A factor lets systems estimate current face amount, exposure, and cash-flow impact without treating original balance as still outstanding. It is useful study vocabulary for understanding why balances and disclosure dates change after issuance.',
      codeReferences: [
        {
          label: 'Capital Markets vocabulary',
          path: 'documentation/21-capital-markets-vocabulary.md',
          note: 'Keeps finance vocabulary aligned across implementation and documentation.',
        },
        {
          label: 'Security Search facade',
          path: 'apps/architecture-dashboard/src/app/features/security-search/security-search.facade.ts',
          note: 'The row model is the right boundary for adding study-only balance or factor fields later.',
        },
      ],
      relatedTerms: ['Agency MBS', 'Current Face', 'Pool'],
    },
    {
      id: 'current-face',
      term: 'Current Face',
      category: 'Capital Markets',
      summary: 'The currently outstanding principal amount of a security position after paydowns.',
      detail:
        'Current face is usually original face multiplied by factor for an MBS-style instrument. It matters for exposure, settlement, risk, and investor reporting. In UI terms, it is the kind of field that should be clearly labeled because users may compare original balance, current balance, and position quantity.',
      codeReferences: [
        {
          label: 'Security Search page',
          path: 'apps/architecture-dashboard/src/app/features/security-search/security-search.page.ts',
          note: 'Owns table and detail-panel display logic where balance labels must stay clear.',
        },
        {
          label: 'Glossary page',
          path: 'apps/architecture-dashboard/src/app/features/glossary/glossary.page.ts',
          note: 'Captures study-friendly terminology without expanding the backend domain model.',
        },
      ],
      relatedTerms: ['Factor', 'Pool', 'Exposure'],
    },
    {
      id: 'wac-wam',
      term: 'WAC / WAM',
      category: 'Capital Markets',
      summary: 'Weighted average coupon and weighted average maturity for loans or securities in a pool.',
      detail:
        'WAC summarizes coupon characteristics and WAM summarizes remaining maturity. Both are weighted metrics, usually by principal balance. They are common pool analytics because two pools with similar total balances can have different rate and maturity profiles, which affects pricing, risk, and prepayment behavior.',
      codeReferences: [
        {
          label: 'Capital Markets page',
          path: 'apps/architecture-dashboard/src/app/features/capital-markets/capital-markets.page.ts',
          note: 'Represents the right study page for future weighted pool analytics examples.',
        },
        {
          label: 'Dashboard store',
          path: 'apps/architecture-dashboard/src/app/core/dashboard/dashboard.store.ts',
          note: 'Shows where computed projections belong when raw data needs derived ViewModels.',
        },
      ],
      relatedTerms: ['Pool', 'Prepayment', 'Yield'],
    },
    {
      id: 'prepayment',
      term: 'Prepayment / CPR',
      category: 'Capital Markets',
      summary: 'Borrower principal paid earlier than scheduled, often summarized by conditional prepayment rate.',
      detail:
        'Prepayment is central to mortgage-backed products because borrowers can refinance, sell, or pay down loans early. CPR is a standard annualized prepayment measure. For study, connect prepayment to factor changes, current face, cash-flow uncertainty, duration, and why MBS risk differs from a simple fixed-rate bond.',
      codeReferences: [
        {
          label: 'SignalStore Inspector',
          path: 'apps/architecture-dashboard/src/app/features/signal-store-inspector/signal-store-inspector.page.ts',
          note: 'Useful for explaining how future cash-flow or risk metrics should be derived from raw state.',
        },
        {
          label: 'Phase 14 planning',
          path: 'planning/22-pi-and-sprint-plan.md',
          note: 'Keeps deeper backend parity and metrics work separate from glossary-only study content.',
        },
      ],
      relatedTerms: ['Factor', 'Duration', 'WAC / WAM'],
    },
    {
      id: 'duration',
      term: 'Duration',
      category: 'Capital Markets',
      summary: 'A risk measure estimating price sensitivity to interest-rate changes.',
      detail:
        'Duration helps explain why fixed-income prices move when rates change. Mortgage products can have negative convexity because prepayments tend to rise when rates fall and slow when rates rise. The lab should treat this as conceptual study material unless a future phase intentionally adds pricing or risk engines.',
      codeReferences: [
        {
          label: 'Planning README',
          path: 'planning/README.md',
          note: 'Documents current release scope and keeps advanced analytics from leaking into active v1 work.',
        },
        {
          label: 'Glossary page',
          path: 'apps/architecture-dashboard/src/app/features/glossary/glossary.page.ts',
          note: 'Contains conceptual risk terms without adding unvalidated finance math.',
        },
      ],
      relatedTerms: ['Yield', 'Prepayment / CPR', 'Exposure'],
    },
    {
      id: 'yield-spread',
      term: 'Yield / Spread',
      category: 'Capital Markets',
      summary: 'Yield estimates return; spread compares that return to a benchmark or curve.',
      detail:
        'Yield and spread are common fixed-income comparison terms. In study context, spread helps users reason about relative value, risk premium, liquidity, and credit or prepayment uncertainty. This lab avoids pricing implementation, but the vocabulary is useful when reading capital-markets screens and backend contract names.',
      codeReferences: [
        {
          label: 'Capital Markets vocabulary',
          path: 'documentation/21-capital-markets-vocabulary.md',
          note: 'Study terminology belongs in docs unless a validated calculation is implemented.',
        },
        {
          label: 'Security Search page',
          path: 'apps/architecture-dashboard/src/app/features/security-search/security-search.page.ts',
          note: 'Would be the user-facing surface if future fields explain valuation or relative-value labels.',
        },
      ],
      relatedTerms: ['Duration', 'Risk Premium', 'Liquidity'],
    },
    {
      id: 'settlement',
      term: 'Settlement',
      category: 'Capital Markets',
      summary: 'The process where trade obligations are finalized and securities/cash are exchanged.',
      detail:
        'Settlement is where operational accuracy matters: correct counterparty, security, pool, quantity, cash amount, date, and delivery instructions. For study, connect settlement to commitment state, allocation readiness, exception management, and disclosure completeness.',
      codeReferences: [
        {
          label: 'Security Search facade',
          path: 'apps/architecture-dashboard/src/app/features/security-search/security-search.facade.ts',
          note: 'Stores row-level workflow dates and statuses that can represent settlement readiness.',
        },
        {
          label: 'Security Search template',
          path: 'apps/architecture-dashboard/src/app/features/security-search/security-search.page.html',
          note: 'Renders operational status and action affordances for review workflows.',
        },
      ],
      relatedTerms: ['Commitment', 'TBA Trade', 'Delivery Versus Payment'],
    },
    {
      id: 'dvp',
      term: 'Delivery Versus Payment',
      category: 'Capital Markets',
      summary: 'A settlement mechanism where securities delivery and cash payment are linked.',
      detail:
        'Delivery versus payment, often called DVP, reduces principal risk by ensuring securities and cash exchange together. It is useful study language for understanding why settlement systems care about matched instructions, timing, custody, and finality.',
      codeReferences: [
        {
          label: 'Infrastructure page',
          path: 'apps/architecture-dashboard/src/app/features/infrastructure/infrastructure.page.ts',
          note: 'Helps learners connect business-critical workflows to service and routing reliability.',
        },
        {
          label: 'Phase 6.5 threat model',
          path: 'planning/phase-6-5-threat-model.md',
          note: 'Connects workflow integrity concerns to auth, origin, and contract-boundary risks.',
        },
      ],
      relatedTerms: ['Settlement', 'Counterparty', 'Operational Risk'],
    },
    {
      id: 'counterparty',
      term: 'Counterparty',
      category: 'Capital Markets',
      summary: 'The other party to a trade, contract, settlement, or financing transaction.',
      detail:
        'Counterparty data matters in fintech because permissions, settlement instructions, exposure, sanctions checks, and credit risk can depend on who is on the other side of a transaction. The lab does not model counterparties directly yet, but the concept is important for understanding why authorization and audit trails matter.',
      codeReferences: [
        {
          label: 'Admin page',
          path: 'apps/architecture-dashboard/src/app/features/admin/admin.page.ts',
          note: 'Shows why persona permissions and audit-friendly risk callouts matter in regulated workflows.',
        },
        {
          label: 'Permission guard',
          path: 'apps/architecture-dashboard/src/app/core/auth/permission.guard.ts',
          note: 'Represents the frontend route boundary for persona-specific access.',
        },
      ],
      relatedTerms: ['Delivery Versus Payment', 'KYC / AML', 'Operational Risk'],
    },
    {
      id: 'kyc-aml',
      term: 'KYC / AML',
      category: 'Capital Markets',
      summary: 'Know-your-customer and anti-money-laundering controls used to manage financial-crime risk.',
      detail:
        'KYC and AML are compliance domains, not UI decoration. Study them as examples of why fintech apps need clear audit trails, role-based access, data provenance, review queues, and defensible exception handling. They also explain why dev-only auth must be labeled and hardened before broader exposure.',
      codeReferences: [
        {
          label: 'Admin security monitoring',
          path: 'apps/architecture-dashboard/src/app/features/admin/admin.page.ts',
          note: 'Surfaces auth, credential, and generated-client risk items for security study.',
        },
        {
          label: 'Phase 6.5 security issue',
          path: 'planning/phase-6-5-security-issue.md',
          note: 'Tracks active hardening items around guards, origins, CORS, and cookie integrity.',
        },
      ],
      relatedTerms: ['Counterparty', 'Audit Trail', 'Permission Guard'],
    },
    {
      id: 'audit-trail',
      term: 'Audit Trail',
      category: 'Capital Markets',
      summary: 'A record of who did what, when, and why across a workflow or data change.',
      detail:
        'Audit trails are essential in regulated financial systems. A useful study pattern is to separate display state from evidence: status tags show the current workflow state, while audit records explain the actor, timestamp, source system, and decision path. The lab currently teaches this at the UI and planning level rather than implementing a full audit ledger.',
      codeReferences: [
        {
          label: 'Security Search page',
          path: 'apps/architecture-dashboard/src/app/features/security-search/security-search.page.ts',
          note: 'Displays operational status and detail state where audit metadata would be surfaced.',
        },
        {
          label: 'Phase 6.5 security risk map',
          path: 'planning/phase-6-5-security-risk-map.md',
          note: 'Documents security and traceability risks for the training lab.',
        },
      ],
      relatedTerms: ['KYC / AML', 'Disclosure File', 'Operational Risk'],
    },
    {
      id: 'liquidity',
      term: 'Liquidity',
      category: 'Capital Markets',
      summary: 'How easily an asset can be bought or sold without materially moving its price.',
      detail:
        'Liquidity affects spreads, execution quality, valuation confidence, and risk. In study screens, liquidity may appear as volume, bid-ask width, pricing confidence, stale quote warnings, or market depth. It is a useful concept for understanding why some securities need extra review before trade or valuation workflows proceed.',
      codeReferences: [
        {
          label: 'Capital Markets page',
          path: 'apps/architecture-dashboard/src/app/features/capital-markets/capital-markets.page.ts',
          note: 'Good future location for study-only liquidity indicators if scope expands.',
        },
        {
          label: 'Planning README',
          path: 'planning/README.md',
          note: 'Keeps optional advanced market analytics deferred unless explicitly prioritized.',
        },
      ],
      relatedTerms: ['Yield / Spread', 'Risk Premium', 'Settlement'],
    },
    {
      id: 'operational-risk',
      term: 'Operational Risk',
      category: 'Capital Markets',
      summary: 'Risk of loss from failed processes, systems, controls, people, or external events.',
      detail:
        'Operational risk is a practical bridge between fintech business workflows and software architecture. Missing disclosures, bad route permissions, stale generated clients, open CORS policies, and unreliable startup paths are all different forms of operational risk in a training lab context.',
      codeReferences: [
        {
          label: 'Phase 6.5 follow-up',
          path: 'planning/phase-6-5-follow-up.md',
          note: 'Separates active security hardening from deferred enterprise follow-up.',
        },
        {
          label: 'OpenAPI risk inventory',
          path: 'planning/phase-6-5-openapi-client-risk-inventory.md',
          note: 'Connects generated client drift and exposed contracts to operational control gaps.',
        },
      ],
      relatedTerms: ['Audit Trail', 'Contract Snapshot', 'Permission Guard'],
    },
    {
      id: 'signal-store',
      term: 'SignalStore / Signal State',
      category: 'Angular',
      summary: 'Angular signal-owned state plus computed projections used by the lab.',
      detail:
        'The current app uses Angular signals directly while preserving the shape expected from a future NgRx SignalStore migration. Raw DTO state is projected into computed indexes, table ViewModels, and permission sets.',
      codeReferences: [
        {
          label: 'Dashboard store',
          path: 'apps/architecture-dashboard/src/app/core/dashboard/dashboard.store.ts',
          note: 'Owns snapshot state and computed Map/Set projections.',
        },
        {
          label: 'SignalStore Inspector',
          path: 'apps/architecture-dashboard/src/app/features/signal-store-inspector/signal-store-inspector.page.ts',
          note: 'Visualizes raw state, computed indexes, ViewModels, methods, and UI consumers.',
        },
      ],
      relatedTerms: ['Computed Index', 'ViewModel', 'Permission Set'],
    },
    {
      id: 'computed-index',
      term: 'Computed Index',
      category: 'Angular',
      summary: 'A derived Map or Set that makes UI lookups stable and testable.',
      detail:
        'Computed indexes prevent repeated template searching and make missing-data behavior explicit. The dashboard uses maps such as borrowersById, documentsByLoanId, and statusByCode.',
      codeReferences: [
        {
          label: 'Dashboard store',
          path: 'apps/architecture-dashboard/src/app/core/dashboard/dashboard.store.ts',
          note: 'Defines computed lookup maps and the permission set.',
        },
        {
          label: 'Dashboard store tests',
          path: 'apps/architecture-dashboard/src/app/core/dashboard/dashboard.store.spec.ts',
          note: 'Proves borrower, document, status, permission, and fallback projections.',
        },
      ],
      relatedTerms: ['SignalStore / Signal State', 'ViewModel', 'Permission Set'],
    },
    {
      id: 'route-guard',
      term: 'Permission Guard',
      category: 'Angular',
      summary: 'A route-level check that matches selected persona permissions before activating a lab route.',
      detail:
        'The guard supports single permission, any-of arrays, and all-of requirements. Developer-only screens use developer:view as the boundary permission.',
      codeReferences: [
        {
          label: 'Permission guard',
          path: 'apps/architecture-dashboard/src/app/core/auth/permission.guard.ts',
          note: 'Loads the current user and redirects unauthorized personas to landing.',
        },
        {
          label: 'Permission utilities',
          path: 'apps/architecture-dashboard/src/app/core/auth/permission.utils.ts',
          note: 'Implements string, array, anyOf, and allOf matching.',
        },
        {
          label: 'App routes',
          path: 'apps/architecture-dashboard/src/app/app.routes.ts',
          note: 'Defines route metadata and developer-only route permissions.',
        },
      ],
      relatedTerms: ['Developer Persona', 'Permission Set', 'Route Metadata'],
    },
    {
      id: 'openapi-generated-client',
      term: 'Generated OpenAPI Client',
      category: 'Backend Contracts',
      summary: 'A generated Angular client built from Spring or Nest OpenAPI contracts.',
      detail:
        'Generated clients are intentionally wrapped by local facades so pages do not depend directly on generated output. This keeps contract regeneration reproducible and makes drift boundaries visible.',
      codeReferences: [
        {
          label: 'Spring API facade',
          path: 'apps/architecture-dashboard/src/app/core/api/spring-api.facade.ts',
          note: 'Wraps generated Spring client calls behind an app-owned facade.',
        },
        {
          label: 'Nest API facade',
          path: 'apps/architecture-dashboard/src/app/core/api/nest-api.facade.ts',
          note: 'Wraps generated Nest comparison and realtime client calls.',
        },
        {
          label: 'OpenAPI Contract Lab',
          path: 'apps/architecture-dashboard/src/app/features/openapi/openapi.page.ts',
          note: 'Surfaces generated client status and drift watch guidance.',
        },
      ],
      relatedTerms: ['Contract Snapshot', 'Facade', 'DTO'],
    },
    {
      id: 'contract-snapshot',
      term: 'Contract Snapshot',
      category: 'Backend Contracts',
      summary: 'The observed state of an API contract, generated client, and facade boundary.',
      detail:
        'Contract snapshots help explain where drift can enter: database schema, raw OpenAPI docs, generated output, facade mapping, or frontend ViewModels.',
      codeReferences: [
        {
          label: 'OpenAPI store',
          path: 'apps/architecture-dashboard/src/app/core/openapi/openapi.store.ts',
          note: 'Holds generated client status, endpoint ownership, and drift warnings.',
        },
        {
          label: 'Contract lab plan',
          path: 'documentation/17-openapi-contract-lab.md',
          note: 'Explains the OpenAPI anti-drift learning goal.',
        },
      ],
      relatedTerms: ['Generated OpenAPI Client', 'DTO', 'Facade'],
    },
  ];

  protected readonly filteredTerms = computed(() => {
    const category = this.selectedCategory();
    return category === 'All'
      ? this.terms
      : this.terms.filter((term) => term.category === category);
  });

  protected readonly selectedTerm = computed(
    () => this.terms.find((term) => term.id === this.selectedTermId()) ?? this.terms[0],
  );

  protected selectCategory(category: GlossaryCategory | 'All'): void {
    this.selectedCategory.set(category);
    const firstTerm = this.filteredTerms()[0];
    if (firstTerm && !this.filteredTerms().some((term) => term.id === this.selectedTermId())) {
      this.selectedTermId.set(firstTerm.id);
    }
  }

  protected selectTerm(termId: string): void {
    this.selectedTermId.set(termId);
  }
}
