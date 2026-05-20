// Broker math drill bank — Tier 4 ($1,500) hero deliverable.
// 300+ original worked problems across 22 PSI broker-math categories.
// Populated by the broker-math content agent; this file scaffolds the type
// surface so /broker/math compiles even before the bank is fully authored.
//
// When the agent writes problems, they OVERWRITE this file with the same
// exported type + a populated BROKER_MATH_PROBLEMS array.

export interface BrokerMathProblem {
  id: string;
  category:
    | 'proration' | 'commission' | 'cap-rate' | 'ltv' | 'dscr' | 'grm'
    | 'depreciation' | 'capital-gains' | 'exchange-1031' | 'amortization'
    | 'points' | 'closing-statement' | 'area' | 't-bar' | 'percentage'
    | 'appreciation' | 'equity' | 'lease-economics' | 'pv-fv'
    | 'property-tax' | 'insurance' | 'breakeven';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  given: string[];
  formula?: string;
  steps: string[];
  answer: string;
  pitfall?: string;
}

export const BROKER_MATH_PROBLEMS: BrokerMathProblem[] = [];
