// Broker mock-exam question bank — Tier 4 ($1,500).
// ~250-400 questions across PSI national categories I-VIII and 9 Hawaii
// state sections; the mock-exam UI at /broker/mocks/[kind] randomizes from
// this pool. Populated by the broker-exam-bank content agent; this file
// scaffolds the type surface so the route compiles before the bank is full.
//
// When the agent writes questions, it OVERWRITES this file with the same
// exported type + a populated BROKER_EXAM_BANK array.

export interface BrokerExamQuestion {
  id: string;
  portion: 'national' | 'state';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  q: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explain: string;
}

export const BROKER_EXAM_BANK: BrokerExamQuestion[] = [];
