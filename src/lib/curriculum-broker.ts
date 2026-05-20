// RALPH FOULGER'S ACADEMY — Tier 4 BROKER LICENSE PREP curriculum.
// Separate from the salesperson curriculum (lib/curriculum.ts) because the
// PSI Hawaii BROKER examination tests at a different depth and includes
// broker-only sections (trust accounts, brokerage management, supervision,
// investment analysis) that the salesperson exam only touches lightly.
//
// AUTHORITATIVE SOURCES (verified 2026-05-19 HST):
//   - PSI 2023 National Real Estate Examination Content Outlines (effective
//     Oct 2023; broker national portion = 80 scored items across 8 categories
//     I–VIII).
//   - DCCA Real Estate Branch (cca.hawaii.gov/reb):
//     • 130-question Hawaii broker exam, 75% passing score (vs 70%
//       salesperson), administered by PSI Services LLC.
//     • Hawaii state portion = 50 items.
//     • Pre-license education = 80 hours of REC-approved broker curriculum.
//     • Broker Experience Certificate (HAR §16-99-19.2) REQUIRED before
//       exam scheduling: 3 years full-time (40 hrs/wk) HI-licensed
//       salesperson experience within the prior 5 years.
//   - HRS Chapter 467 + HAR Title 16, Chapter 99.
//
// QUESTION COUNTS below match the PSI broker blueprint exactly. Total = 130.

export interface BrokerChapterMeta {
  slug: string;
  number: number;
  portion: 'national' | 'state';
  category: string;       // PSI roman-numeral category I..VIII (national) or HI section name (state)
  title: string;
  examItems: number;      // PSI question count for this section
  description: string;
  estimatedMinutes: number; // teaching time (excl. drills/mocks)
  brokerFocus: string[];  // what makes this chapter HARDER than salesperson
}

export const BROKER_CURRICULUM: BrokerChapterMeta[] = [
  // ─── National Portion (80 items, PSI categories I–VIII) ───
  {
    slug: 'broker-property-characteristics',
    number: 1,
    portion: 'national',
    category: 'I',
    title: 'Property Characteristics, Legal Descriptions & Property Use',
    examItems: 9,
    description: 'Land characteristics, legal descriptions (metes & bounds, lot/block, government survey, TMK), property types, encumbrances, water rights.',
    estimatedMinutes: 75,
    brokerFocus: [
      'Multi-step legal description reading (broker must catch errors in MLS / listing input)',
      'Surface vs subsurface vs air rights — commercial / mineral implications',
      'Riparian / littoral / appropriative water rights distinctions',
    ],
  },
  {
    slug: 'broker-forms-of-ownership-transfer',
    number: 2,
    portion: 'national',
    category: 'II',
    title: 'Forms of Ownership, Transfer & Recording of Title',
    examItems: 8,
    description: 'Co-ownership forms, common-interest properties, deeds, title insurance, recording, escrow, foreclosure — at broker depth.',
    estimatedMinutes: 75,
    brokerFocus: [
      'Selecting the right co-ownership form for clients with creditor / estate planning concerns',
      'Title cure for clouds, gaps, and adverse possession',
      'Foreclosure types (judicial / non-judicial / power of sale) and broker referral duties',
    ],
  },
  {
    slug: 'broker-valuation-appraisal',
    number: 3,
    portion: 'national',
    category: 'III',
    title: 'Property Value & Appraisal',
    examItems: 10,
    description: 'Market value vs market price, three appraisal approaches, CMAs, depreciation, GRM/GIM, income capitalization, reconciliation.',
    estimatedMinutes: 90,
    brokerFocus: [
      'Income approach for commercial / multi-family (NOI → cap rate → value, reverse-solved)',
      'Cost approach with cost-segregation (land vs improvements vs personalty)',
      'Reconciliation logic across all three approaches',
    ],
  },
  {
    slug: 'broker-contracts-agency',
    number: 4,
    portion: 'national',
    category: 'IV',
    title: 'Real Estate Contracts & Agency',
    examItems: 17,
    description: 'Listing agreements, buyer agency, purchase contracts, options, leases, agency formation/termination, dual agency, fiduciary duties at supervisory depth.',
    estimatedMinutes: 135,
    brokerFocus: [
      'Vicarious liability of a Principal Broker for agent acts',
      'Option contracts, installment land contracts, novation, assignment vs sublease',
      'Commercial lease structures (NNN, modified gross, percentage with breakpoint)',
      'Buyer-broker compensation post-NAR settlement (2024 changes)',
    ],
  },
  {
    slug: 'broker-real-estate-practice',
    number: 5,
    portion: 'national',
    category: 'V',
    title: 'Real Estate Practice',
    examItems: 13,
    description: 'Brokerage operations, supervision, trust account management, advertising, antitrust, ethics, fair housing supervision.',
    estimatedMinutes: 120,
    brokerFocus: [
      'Trust account: timing of deposits, monthly reconciliation, commingling, escheat',
      'Branch office rules, broker-in-charge designation, supervision obligations',
      'Sherman antitrust: commission fixing, market allocation, tying arrangements',
      'Fair Housing supervisor liability for agent violations',
    ],
  },
  {
    slug: 'broker-property-disclosures-environmental',
    number: 6,
    portion: 'national',
    category: 'VI',
    title: 'Property Disclosures & Environmental Issues',
    examItems: 8,
    description: 'Mandated disclosures, material facts, environmental hazards (lead, asbestos, radon, mold, formaldehyde), CERCLA, stigma.',
    estimatedMinutes: 75,
    brokerFocus: [
      'CERCLA innocent purchaser defense — what brokers must advise',
      'Environmental site assessment (Phase I, II, III) referral duties',
      'Latent vs patent defects — when broker must disclose despite client wishes',
    ],
  },
  {
    slug: 'broker-financing-settlement',
    number: 7,
    portion: 'national',
    category: 'VII',
    title: 'Financing & Settlement',
    examItems: 8,
    description: 'Loan types, LTV, points, amortization, RESPA/TRID, ECOA, Closing Disclosure reconciliation, escrow procedures.',
    estimatedMinutes: 90,
    brokerFocus: [
      'Full Closing Disclosure reconciliation (debit/credit columns balance to penny)',
      'RESPA Section 8 kickback / referral fee rules at broker level',
      'TRID timing rules and broker advertising compliance',
    ],
  },
  {
    slug: 'broker-real-estate-math',
    number: 8,
    portion: 'national',
    category: 'VIII',
    title: 'Real Estate Mathematics',
    examItems: 7,
    description: 'All exam math at broker depth: prorations, commission splits, cap rate, LTV, amortization, depreciation, 1031, closing reconciliation.',
    estimatedMinutes: 180,
    brokerFocus: [
      'Multi-step investment analysis (NOI build, cap rate solve, DSCR check)',
      'Capital gains + depreciation recapture on investment sale',
      '1031 exchange boot calculations',
    ],
  },

  // ─── State Portion (50 items, HI BROKER) ───
  {
    slug: 'broker-hi-license-law',
    number: 9,
    portion: 'state',
    category: 'HI-License-Law',
    title: 'Hawaii: License Law, REC & Disciplinary Process',
    examItems: 10,
    description: 'HRS Chapter 467, HAR Title 16 Chapter 99, REC structure, Principal Broker / Broker-in-Charge designations, complaint and disciplinary process, Recovery Fund.',
    estimatedMinutes: 90,
    brokerFocus: [
      'Principal Broker vs associate broker vs salesperson — chain of supervision',
      'Disciplinary actions: revocation, suspension, fines, conditional licensure',
      'Recovery Fund: when it pays, claim process, broker indemnification',
    ],
  },
  {
    slug: 'broker-hi-trust-accounts',
    number: 10,
    portion: 'state',
    category: 'HI-Trust-Accounts',
    title: 'Hawaii: Trust Accounts & Client Funds',
    examItems: 6,
    description: 'HAR §16-99-3 / §16-99-4 trust account rules, deposit timing, segregation, reconciliation, audit triggers, commingling penalties.',
    estimatedMinutes: 75,
    brokerFocus: [
      'Hawaii-specific deposit timing rule (next business day)',
      'Required monthly three-way reconciliation',
      'Common audit findings + how to avoid them',
    ],
  },
  {
    slug: 'broker-hi-brokerage-operations',
    number: 11,
    portion: 'state',
    category: 'HI-Brokerage-Ops',
    title: 'Hawaii: Brokerage Operations & Supervision',
    examItems: 6,
    description: 'Branch office rules, broker-in-charge designation, employee vs independent contractor, written policies, recordkeeping (3-year retention), advertising rules, agency disclosure timing.',
    estimatedMinutes: 75,
    brokerFocus: [
      'When a Hawaii Principal Broker must designate a Broker-in-Charge for a branch',
      'Form RECS-15 (or current form) agency disclosure timing',
      'Hawaii advertising rules: broker name, no misleading claims',
    ],
  },
  {
    slug: 'broker-hi-harpta-firpta-get',
    number: 12,
    portion: 'state',
    category: 'HI-Tax',
    title: 'Hawaii: HARPTA, FIRPTA & General Excise Tax',
    examItems: 5,
    description: 'HARPTA 7.25% non-resident seller withholding, FIRPTA 15% federal foreign-seller withholding, GET 4% (+ county surcharge) on commissions and rents, conveyance tax tiers.',
    estimatedMinutes: 60,
    brokerFocus: [
      'When HARPTA and FIRPTA both apply (foreign non-resident seller)',
      'GET visible pass-on on commissions',
      'Conveyance tax math: tiered rates by price + owner-occupant status',
    ],
  },
  {
    slug: 'broker-hi-leasehold-fee',
    number: 13,
    portion: 'state',
    category: 'HI-Leasehold',
    title: 'Hawaii: Leasehold, Fee Simple & Land Court',
    examItems: 5,
    description: 'Leasehold market mechanics, lease rent step-ups, reversion, fee conversion, Land Court vs Regular System (Bureau of Conveyances), dual parcels.',
    estimatedMinutes: 60,
    brokerFocus: [
      'Reading and disclosing a leasehold lease (remaining term, rent steps, reversion)',
      'Land Court Transfer Certificate of Title (TCT) — what it changes',
      'Hawaiian Home Lands transfer restrictions',
    ],
  },
  {
    slug: 'broker-hi-condo-aoao',
    number: 14,
    portion: 'state',
    category: 'HI-Condo',
    title: 'Hawaii: Condominium & AOAO Governance',
    examItems: 5,
    description: 'HRS Chapter 514B (condo law), AOAO governance, board powers, house rules, common elements vs limited common elements, condo public reports, transient accommodations.',
    estimatedMinutes: 60,
    brokerFocus: [
      'AOAO disclosure obligations on resale',
      'Hotel-condo / transient accommodation rules + GE tax',
      'Limited common elements (parking stalls, storage lockers) vs LCE assignment',
    ],
  },
  {
    slug: 'broker-hi-land-use-zoning',
    number: 15,
    portion: 'state',
    category: 'HI-Land-Use',
    title: 'Hawaii: Land Use Districts, Zoning & SMA',
    examItems: 4,
    description: 'State Land Use Districts (Urban / Rural / Agricultural / Conservation), county zoning, Special Management Areas (SMA), shoreline setbacks, agricultural use restrictions.',
    estimatedMinutes: 50,
    brokerFocus: [
      'When SMA permit is required — and broker disclosure duty',
      'Ag-land restrictions on residential dwellings (Ohana, farm dwelling)',
      'Shoreline setback (40 ft minimum, may be more by county)',
    ],
  },
  {
    slug: 'broker-hi-contracts-disclosures',
    number: 16,
    portion: 'state',
    category: 'HI-Contracts',
    title: 'Hawaii: Standard Contracts & Mandatory Disclosures',
    examItems: 5,
    description: 'Standard Hawaii Purchase Contract (DROA / HBR or HAR forms), required addenda, HRS 508D Seller Disclosure, lead paint, condo public report, leasehold disclosure.',
    estimatedMinutes: 60,
    brokerFocus: [
      'Which addenda are required vs optional',
      'HRS 508D disclosure timing — buyer rescission right window',
      'Distressed-property / short-sale disclosure obligations',
    ],
  },
  {
    slug: 'broker-hi-property-management',
    number: 17,
    portion: 'state',
    category: 'HI-Property-Mgmt',
    title: 'Hawaii: Property Management & Landlord-Tenant',
    examItems: 4,
    description: 'HRS Chapter 521 (Residential Landlord-Tenant Code), security deposit rules (1 month + pet deposit), eviction process, fair housing in rentals, transient (short-term) rental law.',
    estimatedMinutes: 50,
    brokerFocus: [
      'Security deposit limits + return timeline (14 days)',
      'Eviction notice periods by cause',
      'Short-term rental law: county-by-county (Honolulu Ord. 22-7, Maui restrictions)',
    ],
  },
];

export const BROKER_NATIONAL_TOTAL = BROKER_CURRICULUM.filter(c => c.portion === 'national').reduce((s, c) => s + c.examItems, 0); // 80
export const BROKER_STATE_TOTAL = BROKER_CURRICULUM.filter(c => c.portion === 'state').reduce((s, c) => s + c.examItems, 0); // 50
export const BROKER_TOTAL_QUESTIONS = BROKER_NATIONAL_TOTAL + BROKER_STATE_TOTAL; // 130
export const BROKER_PASSING_PCT = 75; // Hawaii broker requires 75%, vs 70% salesperson

// Approved REC pre-license credit hours for the broker course.
export const BROKER_REC_HOURS = 80;

// Total recommended study commitment including drills + mocks.
export const BROKER_TOTAL_STUDY_HOURS = 120;

export function getBrokerChapter(slug: string): BrokerChapterMeta | null {
  return BROKER_CURRICULUM.find(c => c.slug === slug) ?? null;
}

export function brokerChapterIndex(slug: string): number {
  return BROKER_CURRICULUM.findIndex(c => c.slug === slug);
}

export function brokerNeighbors(slug: string): { prev: BrokerChapterMeta | null; next: BrokerChapterMeta | null } {
  const idx = brokerChapterIndex(slug);
  return {
    prev: idx > 0 ? BROKER_CURRICULUM[idx - 1] : null,
    next: idx < BROKER_CURRICULUM.length - 1 ? BROKER_CURRICULUM[idx + 1] : null,
  };
}
