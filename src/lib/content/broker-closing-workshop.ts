// Closing Statement Workshop — Tier 4 ($1,500) HERO deliverable.
// Full Closing Disclosure (CD) reconciliation walkthrough with worked
// examples and interactive drills. Renders at /broker/workshop.
//
// Populated by the broker-closing-workshop content agent; this file
// scaffolds the type surface so the route compiles before the workshop
// content is fully authored.

export interface WorkshopSection {
  id: string;
  title: string;
  summary: string;
  body: string[];
  example?: {
    scenario: string;
    facts: string[];
    table: {
      label: string;
      sellerDebit?: string;
      sellerCredit?: string;
      buyerDebit?: string;
      buyerCredit?: string;
      note?: string;
    }[];
    sellerNet: string;
    buyerCashToClose: string;
    walkthrough: string[];
  };
  drill?: {
    q: string;
    options: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
    explain: string;
  }[];
}

export const BROKER_CLOSING_WORKSHOP: WorkshopSection[] = [];
