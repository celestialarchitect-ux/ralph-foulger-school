// Closing Statement Workshop — Tier 4 ($1,500) HERO deliverable.
// Full Closing Disclosure (CD) reconciliation walkthrough with worked
// examples and interactive drills. Renders at /broker/workshop.
//
// All Hawaii-specific math (HARPTA 7.25%, FIRPTA 15%, GET 4% + 0.5%
// county surcharge, conveyance tax HRS 247 tiered, 30/360 proration,
// seller pays through day of closing) is current as of 2026.

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

export const BROKER_CLOSING_WORKSHOP: WorkshopSection[] = [
  {
    id: "why-this-matters",
    title: "Why CD Reconciliation Dominates the Broker Exam",
    summary:
      "Closing math is the single highest-leverage topic on the Hawaii broker exam. Master the Closing Disclosure and you cover roughly a third of the math questions plus a meaningful slice of practice questions.",
    body: [
      "If you scan the broker exam blueprint, you'll notice that the heaviest mathematical weighting falls on one document: the Closing Disclosure (CD). Candidates who can fluently reconcile a CD generally pass on their first attempt. Candidates who cannot rarely do. This workshop is engineered to move you from 'I sort of remember how prorations work' to 'I can build a closing statement from raw facts and have it balance to the penny.'",
      "Why is the CD so heavily tested? Because it is the moment where every other real-estate concept collides. Agency, contracts, financing, taxes, fair housing, and Hawaii-specific statute all show up at closing. The CD is also the document where a broker's negligence costs the most money. The exam mirrors the consequences: get it wrong and the candidate fails, get it wrong in practice and you face a complaint with the Real Estate Commission.",
      "There is also a structural reason this topic dominates: the math is deterministic. Unlike subjective ethics questions where two answer choices feel almost equally right, closing math has one correct answer. Examiners love deterministic questions because they discriminate cleanly between prepared and unprepared candidates. A well-designed CD question can eliminate guessing entirely.",
      "Beyond the exam, CD fluency is the single biggest day-one skill a new broker can carry into the office. The principal broker who hired you wants to know that you can sit across from a seller and explain every line on page three of the CD without flinching. This workshop builds that capability in parallel with exam prep, so you graduate the course already useful.",
      "Finally, a note on mindset. Closing math is not difficult. It is precise. Treat each entry like a chess move: ask which side owes, which side is owed, and whether the item is being paid in advance or in arrears. If you can answer those three questions for every line, you cannot get a CD problem wrong."
    ],
    drill: [
      {
        q: "Which document replaced the HUD-1 for most residential closings after October 3, 2015?",
        options: [
          "The Uniform Settlement Statement",
          "The Closing Disclosure (CD)",
          "The Good Faith Estimate",
          "The TILA Notice of Right to Cancel"
        ],
        correctIndex: 1,
        explain:
          "TRID integrated the HUD-1 and the final TIL into the Closing Disclosure, effective October 3, 2015. The HUD-1 still appears on reverse mortgages and some commercial closings, but not on standard residential purchase or refinance closings."
      },
      {
        q: "Closing math questions on the broker exam are weighted heavily because:",
        options: [
          "Examiners have a personal preference for arithmetic",
          "The answers are deterministic, which discriminates cleanly between prepared and unprepared candidates",
          "Closing math is the only math tested on the exam",
          "Federal law requires a specific minimum percentage of math questions"
        ],
        correctIndex: 1,
        explain:
          "Deterministic questions remove the ambiguity that hurts well-prepared candidates on subjective items. There is one correct number, and your reconciliation either reaches it or doesn't."
      },
      {
        q: "The Closing Disclosure must be delivered to the borrower at least how many business days before consummation?",
        options: ["1", "3", "7", "10"],
        correctIndex: 1,
        explain:
          "TRID requires the CD in the borrower's hands at least three business days before consummation. Certain material changes (APR shift outside tolerance, loan product change, prepayment penalty added) restart the three-day clock."
      }
    ]
  },
  {
    id: "the-two-column-model",
    title: "The Two-Column Mental Model: Debits and Credits",
    summary:
      "Every entry on a closing statement does one of four things: debits the seller, credits the seller, debits the buyer, or credits the buyer. Master this grid and the entire CD becomes mechanical.",
    body: [
      "Forget the page numbers for a moment. Strip the CD down to its core mechanic and what you find is a two-column ledger. The seller has a column. The buyer has a column. Each column has a debit side and a credit side. Every line on the closing statement is an entry into one or both columns. Nothing more. Nothing less.",
      "A debit to a party is an amount they owe. A credit to a party is an amount they are owed. The seller's net proceeds at closing equal seller credits minus seller debits. The buyer's cash to close equals buyer debits minus buyer credits. If you can sort each line into the right bucket, you can reconcile any statement, period.",
      "Why two columns instead of one? Because not every entry hits both sides. The buyer's loan, for example, only affects the buyer's column. The seller has no opinion on the buyer's financing. Conversely, the seller's existing mortgage payoff is a seller debit but no entry on the buyer's side. The two-column model honors this asymmetry.",
      "When an entry does hit both sides, it usually mirrors itself. The sale price is a buyer debit and a seller credit. The earnest money deposit, however, is a buyer credit (they already paid it) with no seller entry. We will work through dozens of examples like this until each one becomes automatic.",
      "Mental shortcut: ask 'who paid for what, and who is paying now?' If the seller paid for something in advance that the buyer will benefit from after closing, the seller deserves a credit. If the seller used something that they haven't yet paid for, the buyer will be paying it later, so the seller owes a debit and the buyer gets a credit. This is the entire logic of proration in one sentence."
    ],
    drill: [
      {
        q: "The sale price of $750,000 is entered on the closing statement as:",
        options: [
          "Seller debit and buyer credit",
          "Seller credit and buyer debit",
          "Seller credit only",
          "Buyer debit only"
        ],
        correctIndex: 1,
        explain:
          "The buyer owes the sale price (debit). The seller is owed the sale price (credit). Both columns receive the entry."
      },
      {
        q: "Earnest money deposit of $25,000 already held in escrow appears as:",
        options: [
          "Seller credit and buyer debit",
          "Buyer credit only",
          "Seller debit and buyer credit",
          "Buyer debit only"
        ],
        correctIndex: 1,
        explain:
          "The buyer already paid the earnest money before closing, so they get a credit. The seller has no entry for this because the earnest money becomes part of the seller's credit when applied to the sale price (which is already a seller credit)."
      },
      {
        q: "Seller's net proceeds at closing equal:",
        options: [
          "Buyer debits minus buyer credits",
          "Seller credits minus seller debits",
          "Sale price minus loan payoff",
          "Total credits minus total debits across both columns"
        ],
        correctIndex: 1,
        explain:
          "Seller net = seller credits − seller debits. Sale price minus loan payoff is a simplified version that ignores prorations, commissions, and other line items."
      },
      {
        q: "Buyer's cash to close equals:",
        options: [
          "Buyer credits minus buyer debits",
          "Buyer debits minus buyer credits",
          "Sale price minus loan amount",
          "Sale price minus down payment"
        ],
        correctIndex: 1,
        explain:
          "Buyer cash to close = buyer debits − buyer credits. The sale-price-minus-loan-amount shortcut ignores closing costs and prorations."
      }
    ]
  },
  {
    id: "cd-page-by-page",
    title: "The CD Page-by-Page: A Quick Tour",
    summary:
      "TRID's Closing Disclosure has five pages. Each page has a job. Knowing which page hosts which figure speeds up both exam questions and real-world client conversations.",
    body: [
      "Page 1 is the loan summary: loan terms, projected payments, costs at closing. This is the page consumers actually read. For exam purposes, page 1 tells you the loan amount, interest rate, monthly payment, and the bottom-line 'Cash to Close' figure that will be reconciled on page 3.",
      "Page 2 lists loan costs (origination, services the borrower did and did not shop for) and other costs (taxes, prepaids, escrow, owner's title policy, recording fees). This is where most buyer debits live. Every dollar of buyer-side closing costs traces to a line on page 2.",
      "Page 3 is the reconciliation page: calculating cash to close, summaries of transactions (the actual debit/credit grid for both buyer and seller). This is the page the exam loves. When a question asks 'what is the seller's net?' or 'what is the buyer's cash to close?', you are reasoning about page 3.",
      "Page 4 is loan disclosures: assumption, demand feature, late payment, negative amortization, partial payments, security interest, escrow account. These are mostly TILA-style disclosures and rarely the subject of arithmetic questions.",
      "Page 5 is the loan calculations and final disclosures: total of payments, finance charge, amount financed, APR, total interest percentage, plus contact information and confirm receipt signatures. The TIP (Total Interest Percentage) is occasionally tested as a yes/no concept question, but the arithmetic burden is light.",
      "TRID replaced the HUD-1 effective October 3, 2015. The HUD-1 was a single two-sided document; the CD is five pages because Congress wanted disclosures front-loaded for consumer comprehension. The underlying math is identical. If you trained on the HUD-1, you already know how to read a CD."
    ],
    drill: [
      {
        q: "On the Closing Disclosure, the seller's net proceeds calculation appears on which page?",
        options: ["Page 1", "Page 2", "Page 3", "Page 5"],
        correctIndex: 2,
        explain:
          "Page 3 hosts the 'Summaries of Transactions' grid where both buyer's cash to close and seller's net proceeds are reconciled."
      },
      {
        q: "TRID went into effect on what date?",
        options: ["August 1, 2015", "October 3, 2015", "January 1, 2016", "June 1, 2015"],
        correctIndex: 1,
        explain:
          "October 3, 2015 is when TRID's CD/LE forms replaced the HUD-1, GFE, and final TIL for most residential closings."
      },
      {
        q: "Loan-related closing costs the borrower could and could not shop for appear on:",
        options: ["Page 1", "Page 2", "Page 3", "Page 4"],
        correctIndex: 1,
        explain:
          "Page 2 itemizes loan costs (A, B, C sections) and other costs (E, F, G, H sections), including which items the borrower could shop for."
      }
    ]
  },
  {
    id: "sale-price",
    title: "Sale Price: The Anchor Entry",
    summary:
      "The sale price is the only line guaranteed to appear on every closing statement. It is also the largest. Get it right and your reconciliation has a fighting chance.",
    body: [
      "The contract sale price hits the closing statement as a buyer debit and a seller credit, in equal amounts. If the contract says $850,000, the buyer's column shows $850,000 on the debit side and the seller's column shows $850,000 on the credit side. There are no exceptions to this rule for a standard purchase.",
      "Why? Because the buyer is buying. They owe the seller the agreed-upon price. The seller is selling. They are owed that price. The number is identical because we are talking about the same exchange viewed from two sides. The two-column model lets us see both sides at once.",
      "Personal property included in the sale (refrigerator, washer, dryer, a piece of artwork) is usually folded into the contract price. If it is separately stated, it can still be a single sale-price entry. Personal property handled outside escrow does not hit the closing statement at all, but it also creates GET liability concerns we will address later.",
      "Watch for trick wording on exam questions. 'Contract price,' 'purchase price,' 'sale price,' and 'consideration' all refer to the same number unless the question explicitly distinguishes between gross and net of a seller concession. Seller concessions are credits to the buyer; they reduce the buyer's cash to close, not the sale price."
    ],
    drill: [
      {
        q: "On a $950,000 sale, the sale-price entry appears as:",
        options: [
          "Seller debit $950,000; buyer credit $950,000",
          "Seller credit $950,000; buyer debit $950,000",
          "Seller credit $950,000 only",
          "Buyer debit $950,000 only"
        ],
        correctIndex: 1,
        explain:
          "Seller is owed the price (credit). Buyer owes the price (debit). Both sides receive the entry."
      },
      {
        q: "A seller agrees to a $10,000 seller concession toward buyer's closing costs. This is recorded as:",
        options: [
          "A reduction to the sale price entry",
          "A buyer credit and a seller debit",
          "A buyer debit and a seller credit",
          "It is not recorded on the CD"
        ],
        correctIndex: 1,
        explain:
          "Seller concessions are entered as their own line: seller debit / buyer credit. The sale-price entry stays at the contract price."
      }
    ]
  },
  {
    id: "earnest-money",
    title: "Earnest Money: The Buyer-Only Credit",
    summary:
      "Earnest money sits in escrow before closing. At closing, it becomes a buyer credit. The seller's side gets no entry for it directly.",
    body: [
      "When a buyer signs the purchase contract, they typically deposit earnest money into escrow. That money is the buyer's. At closing, escrow applies it toward the buyer's obligation, which mechanically shows up as a credit on the buyer's side of the CD.",
      "The seller's column shows no entry for earnest money. Why? Because the sale price already includes the earnest money in the seller's credit. The seller is being credited for the full sale price, and the buyer's column is recognizing that part of that price was already deposited via earnest money.",
      "If a candidate forgets the earnest money, the buyer's cash to close will be overstated by exactly the deposit amount. This is one of the most common exam errors. Always scan the facts twice for the earnest money figure before computing cash to close.",
      "Edge cases: if the buyer increases earnest money (a 'good faith deposit bump' after due diligence), the total earnest money is still a single buyer credit. If earnest money is forfeited in a different transaction, that does not appear on this CD. Stay focused on this transaction."
    ],
    drill: [
      {
        q: "Earnest money of $30,000 already in escrow is shown on the CD as:",
        options: [
          "Buyer debit $30,000",
          "Buyer credit $30,000",
          "Seller debit $30,000",
          "Seller credit $30,000"
        ],
        correctIndex: 1,
        explain:
          "Buyer paid this before closing, so it's a credit on the buyer side. No seller entry."
      },
      {
        q: "A candidate computing buyer's cash to close on a $600,000 sale forgets to include the $20,000 earnest money. Their answer will be:",
        options: [
          "$20,000 too low",
          "$20,000 too high",
          "Correct (earnest money cancels out)",
          "Off by half the earnest money"
        ],
        correctIndex: 1,
        explain:
          "Forgetting a buyer credit overstates cash to close by exactly the credit amount."
      }
    ]
  },
  {
    id: "loan-amount",
    title: "Loan Amount: The Buyer-Only Credit (Part Two)",
    summary:
      "The new loan financing the buyer's purchase appears as a buyer credit. The seller has no entry because the seller is being paid in cash from the lender via escrow.",
    body: [
      "When a buyer borrows from a lender to fund the purchase, the lender wires the loan proceeds into escrow at closing. From the buyer's perspective, this is money 'paid' on their behalf, so it shows up as a credit on the buyer's column. From the seller's perspective, the funds are just part of the sale-price credit they already have; no separate entry.",
      "A $680,000 loan on an $850,000 sale puts $680,000 in the buyer's credit column. Combined with the buyer's earnest money and any other credits, this gives us the reduction we need to determine cash to close. The buyer brings the difference.",
      "Be careful with seller-financed transactions. If the seller carries back a note (seller takes a promissory note instead of cash), the transaction can look different. In a standard exam question, assume a third-party lender unless told otherwise.",
      "Loan-to-value relationships often appear as a setup. 'The buyer obtains an 80% LTV loan on a $1,000,000 sale.' That's an $800,000 buyer credit. Down payment is the buyer's cash, which appears nowhere on the statement; it is the residual after credits and debits balance. Watch for the trap where candidates list down payment as a buyer credit; it isn't, because the buyer is bringing it to escrow at closing, not before."
    ],
    drill: [
      {
        q: "Buyer obtains a $640,000 first mortgage on an $800,000 home. The loan amount is recorded as:",
        options: [
          "Buyer debit $640,000",
          "Buyer credit $640,000",
          "Seller credit $640,000",
          "Seller debit $640,000"
        ],
        correctIndex: 1,
        explain:
          "Loan proceeds reduce the buyer's cash obligation, so they're a buyer credit. The seller has no entry; the proceeds simply fund the seller's existing credit for the sale price."
      },
      {
        q: "The down payment on the CD typically appears as:",
        options: [
          "A buyer credit",
          "A buyer debit",
          "A seller credit",
          "It does not appear as a discrete line; it is the residual cash the buyer brings"
        ],
        correctIndex: 3,
        explain:
          "Down payment is the difference between buyer debits and buyer credits (cash to close). It is not its own credit or debit line."
      }
    ]
  },
  {
    id: "existing-loan-payoff",
    title: "Existing Loan Payoff: Seller's Big Debit",
    summary:
      "The seller's existing mortgage is paid off from escrow at closing. The payoff amount is a seller debit. No buyer entry.",
    body: [
      "Most sellers have an existing mortgage. At closing, escrow uses part of the seller's credit (the sale price) to wire off the existing loan. Mechanically, the payoff is a seller debit because it reduces what the seller will walk away with.",
      "The buyer has no entry for the seller's existing loan because the buyer's new loan is independent. The buyer's lender doesn't care what the seller owed; they care about the buyer's new mortgage going on title in first position.",
      "Watch the date. Payoff figures are good through a specific day, usually closing day plus a few days of cushion for wire processing. If the wire is delayed, the lender may require additional per-diem interest, which is a separate small debit to the seller. Examiners sometimes test this nuance.",
      "Junior liens (HELOCs, second mortgages, judgment liens, tax liens) all hit the seller's debit column. Each gets its own line. The seller wants liens off the title; escrow makes that happen by debiting the seller and paying the lien holders directly."
    ],
    drill: [
      {
        q: "Seller's existing mortgage payoff of $342,150 appears on the CD as:",
        options: [
          "Buyer debit $342,150",
          "Buyer credit $342,150",
          "Seller debit $342,150",
          "Seller credit $342,150"
        ],
        correctIndex: 2,
        explain:
          "Payoff is paid out of seller's credit, reducing the seller's net proceeds. It's a seller debit. No buyer entry."
      },
      {
        q: "If a seller has both a first mortgage payoff of $300,000 and a HELOC payoff of $45,000:",
        options: [
          "Only the first mortgage is debited; HELOCs are off-CD",
          "Both are seller debits, separately listed",
          "Both are combined into one buyer credit",
          "The HELOC becomes a buyer debit"
        ],
        correctIndex: 1,
        explain:
          "All liens against the seller's title must be paid off and removed before transfer. Each is its own seller debit."
      }
    ]
  },
  {
    id: "property-tax-proration",
    title: "Property Tax Proration: The 30/360 Workhorse",
    summary:
      "Hawaii real property taxes are typically paid in two installments. Closing happens mid-period. Proration splits the tax bill so the seller pays for the days they owned and the buyer pays for the days they will own.",
    body: [
      "Hawaii's tax year for real property runs July 1 to June 30. Honolulu County, for example, bills in two installments: August 20 (covering July 1 to December 31) and February 20 (covering January 1 to June 30). Other counties have similar schedules with minor date variations.",
      "Proration answers a single question: as of the closing date, who has paid for whose use of the property? If the seller pre-paid the second installment but closes on March 15, the seller has paid through June 30 but only owned through March 15. The buyer must reimburse the seller for the days from closing to June 30. This is a seller credit and a buyer debit.",
      "If, on the other hand, taxes are due but unpaid as of closing, the seller has used the property through closing without paying. The seller owes the buyer for those days (because the buyer will pay the full installment when it comes due). This is a seller debit and a buyer credit.",
      "Direction of the proration depends entirely on whether the bill has been paid or is still owed. Always determine 'paid in advance' vs 'paid in arrears' before doing the arithmetic.",
      "The broker exam defaults to the 30/360 convention unless stated otherwise: every month is 30 days, every year is 360 days. This makes arithmetic cleaner. Some real-world prorations use actual/365 (especially for mortgage interest), but for the exam, use 30/360 unless told otherwise. Hawaii custom: seller pays through and including the day of closing.",
      "Worked example methodology: (1) compute the daily rate (annual tax ÷ 360); (2) count days seller owes or is owed; (3) multiply. Always sanity-check by asking 'is this a credit or debit to the seller?' before writing the answer down."
    ],
    example: {
      scenario:
        "Standard tax proration with taxes paid in advance through June 30",
      facts: [
        "Annual property taxes: $4,800",
        "Tax year: July 1, 2025 to June 30, 2026",
        "Seller paid second installment in full (covering January 1 to June 30, 2026)",
        "Closing date: March 15, 2026",
        "Hawaii custom: seller pays through and including day of closing",
        "Use 30/360 convention"
      ],
      table: [
        {
          label: "Daily rate: $4,800 / 360 = $13.3333 per day",
          note: "Keep precision; round only at the end"
        },
        {
          label: "Period seller pre-paid but will not own: March 16 through June 30 = 105 days",
          note: "March 16-30 = 15 days; April + May + June = 90 days; total 105 days"
        },
        {
          label: "Buyer reimburses seller: 105 days x $13.3333 = $1,400.00",
          sellerCredit: "$1,400.00",
          buyerDebit: "$1,400.00"
        }
      ],
      sellerNet: "+$1,400.00 net seller credit for tax proration",
      buyerCashToClose: "+$1,400.00 added to buyer's cash to close",
      walkthrough: [
        "Step 1: Identify the proration direction. Seller paid through June 30. Closing is March 15. Seller has paid for days they will not own (March 16 through June 30). Buyer must reimburse. So this is a Seller CREDIT and a Buyer DEBIT.",
        "Step 2: Daily rate. $4,800 / 360 = $13.3333 per day. Keep precision; round only the final answer.",
        "Step 3: Day count using 30/360. Seller's last owned day is March 15. Days remaining in March that buyer will own: March 16 through 30 inclusive = 15 days. April: 30. May: 30. June: 30. Total: 15 + 30 + 30 + 30 = 105 days.",
        "Step 4: Multiply. 105 x $13.3333 = $1,400.00.",
        "Step 5: Sanity check. Seller paid $2,400 for the January-June half ($4,800 / 2). Of that, seller actually owned January 1 through March 15 = 75 days. 75 x $13.3333 = $1,000. Seller's actual tax expense should be $1,000. Seller paid $2,400. Reimbursement owed: $2,400 - $1,000 = $1,400. This confirms the answer."
      ]
    },
    drill: [
      {
        q: "Annual taxes $3,600, paid in arrears (unpaid at closing). Closing June 1. Using 30/360 and a tax year of July 1 to June 30, what is the seller's tax proration entry?",
        options: [
          "Seller credit $3,300",
          "Seller debit $3,300",
          "Seller credit $300",
          "Seller debit $300"
        ],
        correctIndex: 1,
        explain:
          "Taxes are unpaid; seller owes the buyer for the days the seller owned. Seller owned July 1 through June 1 = 11 months x 30 = 330 days. Daily rate: $3,600 / 360 = $10. 330 x $10 = $3,300. Seller debit."
      },
      {
        q: "Annual taxes $7,200, paid in advance through December 31. Closing September 30. Using 30/360, what is the buyer's tax proration entry?",
        options: [
          "Buyer credit $1,800",
          "Buyer debit $1,800",
          "Buyer credit $5,400",
          "Buyer debit $5,400"
        ],
        correctIndex: 1,
        explain:
          "Seller paid through December 31 but only owns through September 30. Buyer reimburses for October, November, December = 90 days. Daily rate: $7,200 / 360 = $20. 90 x $20 = $1,800. Buyer debit (seller credit)."
      },
      {
        q: "When using the 30/360 day convention, how many days are in the period March 15 through June 30 (seller's last day is March 15)?",
        options: ["105", "107", "108", "115"],
        correctIndex: 0,
        explain:
          "March 16-30 = 15 days. April + May + June = 90 days. Total = 105 days under 30/360."
      },
      {
        q: "Hawaii custom for proration day-of-closing is:",
        options: [
          "Buyer pays through and including day of closing",
          "Seller pays through and including day of closing",
          "Day of closing is split 50/50",
          "Day of closing is ignored"
        ],
        correctIndex: 1,
        explain:
          "Hawaii custom: seller pays through and including the day of closing. This means the seller's last owned day is closing day."
      }
    ]
  },
  {
    id: "hoa-aoao-proration",
    title: "HOA/AOAO Proration: Hawaii's Condo Quirk",
    summary:
      "Hawaii condominium AOAO (Association of Apartment Owners) fees are typically paid in advance. At closing, the buyer reimburses the seller for the unused portion of the month or quarter.",
    body: [
      "Most Hawaii condominium associations bill monthly. The AOAO collects maintenance fees on the first of the month for that month's service. When a closing happens mid-month, the seller has already paid for the full month, but only used part of it. The buyer reimburses for the unused days.",
      "Direction: AOAO paid in advance produces a seller credit and a buyer debit. Same logic as property taxes paid in advance. The phrase 'paid in advance' is the trigger word: any item paid in advance creates a seller credit at mid-period closings.",
      "Some larger AOAOs bill quarterly or include special assessments. Special assessments are a separate question: who is responsible per the contract? Default Hawaii custom: assessments levied before closing are seller's responsibility; assessments levied after are buyer's. Pending assessments (announced but not levied) are negotiable and should be addressed in the purchase contract.",
      "Watch for capital reserve transfers. Some AOAOs require a working capital contribution from new owners (often equal to two months' fees) at the time of purchase. This is a separate buyer debit, not part of the proration. Do not conflate the two on the exam."
    ],
    drill: [
      {
        q: "Monthly AOAO fee $600, paid in advance on the 1st. Closing March 20. Using 30/360, what is the AOAO proration entry?",
        options: [
          "Seller credit $200, buyer debit $200",
          "Seller debit $200, buyer credit $200",
          "Seller credit $400, buyer debit $400",
          "Seller debit $400, buyer credit $400"
        ],
        correctIndex: 0,
        explain:
          "Paid in advance produces a seller credit. Days seller paid for but will not own: March 21-30 = 10 days. Daily rate: $600 / 30 = $20. 10 x $20 = $200. Seller credit, buyer debit."
      },
      {
        q: "A new AOAO working capital contribution required of new buyers in addition to the prorated monthly fee is:",
        options: [
          "Combined with the monthly proration",
          "A separate buyer debit",
          "A seller debit",
          "Not shown on the CD"
        ],
        correctIndex: 1,
        explain:
          "Working capital contributions are a separate buyer-side debit, paid into the AOAO's reserve fund. They do not combine with proration math."
      }
    ]
  },
  {
    id: "mortgage-interest-proration",
    title: "Mortgage Interest Proration: Per-Diem Math",
    summary:
      "Mortgage interest accrues daily on the outstanding balance. At closing, the seller's existing loan and the buyer's new loan both require per-diem calculations.",
    body: [
      "Mortgage interest is paid in arrears. The payment due on April 1, for example, covers interest that accrued in March. If a seller closes mid-month, they owe the lender interest from the last payment date through closing day. This shows up as a small seller debit (interest unpaid as of closing) added to the payoff.",
      "Formula: per-diem interest = balance x annual rate / 360 (or 365, depending on lender). Most conventional mortgages in the U.S. use a 360-day base, but exam questions sometimes specify 365. Read the question carefully.",
      "Example: seller's loan balance $400,000 at 6% interest. Per-diem at 360: $400,000 x 0.06 / 360 = $66.67/day. Last payment covered through March 31. Closing April 15. Seller owes 15 days of interest: 15 x $66.67 = $1,000.05. This is added to the payoff, increasing the seller's debit.",
      "The buyer's new loan also generates per-diem interest. The buyer's first regular payment usually starts the second month after closing (e.g., closing in March produces a first payment of May 1, covering April). So the lender collects per-diem interest from closing day through the end of the closing month at the CD. This is a buyer debit (prepaid interest) listed in the 'Prepaids' section on page 2 of the CD.",
      "Example: buyer's new loan $640,000 at 6.5%. Per-diem at 360: $640,000 x 0.065 / 360 = $115.56/day. Closing March 15. Buyer prepays interest for March 16-31 = 16 days (day after closing through month end). 16 x $115.56 = $1,848.89. Buyer debit, no seller entry."
    ],
    drill: [
      {
        q: "Seller's loan balance is $250,000 at 5% interest, paid through May 31. Closing June 20. Using 360-day per-diem, how much interest does seller owe at closing?",
        options: ["$555.55", "$694.44", "$833.33", "$1,041.67"],
        correctIndex: 1,
        explain:
          "Per-diem: $250,000 x 0.05 / 360 = $34.7222/day. Days owed: June 1 through June 20 inclusive = 20 days. 20 x $34.7222 = $694.44. Seller debit (added to payoff)."
      },
      {
        q: "Buyer's new $500,000 loan at 7%, closing August 12. Using 360-day per-diem and Hawaii custom where buyer pays interest from day after closing through month end, the prepaid interest debit is approximately:",
        options: ["$1,847.22", "$1,944.44", "$2,041.67", "$2,138.89"],
        correctIndex: 0,
        explain:
          "Per-diem: $500,000 x 0.07 / 360 = $97.2222/day. Days: August 13-31 = 19 days. 19 x $97.2222 = $1,847.22. Buyer debit (prepaid interest)."
      }
    ]
  },
  {
    id: "rent-and-security-deposits",
    title: "Rents and Security Deposits: The Transfer Mechanics",
    summary:
      "If the property is leased at closing, the seller transfers prorated rent and security deposits to the buyer. Both create seller debits with mirroring buyer credits.",
    body: [
      "When a tenant-occupied property sells, the buyer steps into the landlord's shoes. Two adjustments happen at closing: rent for the closing month is prorated, and the tenant's security deposit transfers to the new owner.",
      "Rent proration: if the tenant paid the full month to the seller on the 1st, and closing is mid-month, the buyer is entitled to the days from the day after closing through month end. Mechanically, this is a seller debit and a buyer credit. Note this direction is the OPPOSITE of tax proration with seller paying in advance, because rent flows TO the seller and now must be passed to the buyer.",
      "Security deposit: the tenant gave the deposit to the seller. The buyer will be responsible for returning it at lease end. So the seller transfers the deposit to the buyer at closing. Seller debit, buyer credit, for the full amount of the deposit (not prorated; it's not a usage fee, it's an obligation transfer).",
      "Last-month rent (if collected): also transfers as seller debit / buyer credit. Same logic as security deposit. Pet deposits, key deposits, any other refundable tenant funds all transfer.",
      "Watch the exam trap: candidates sometimes prorate the security deposit. Do not. The full deposit transfers because the buyer assumes the full obligation. Only the current month's rent is prorated."
    ],
    drill: [
      {
        q: "Tenant pays $3,000 monthly rent on the 1st. Closing is March 18. Hawaii custom (seller pays through closing day). Using 30/360, the rent proration is:",
        options: [
          "Seller debit $1,200, buyer credit $1,200",
          "Seller credit $1,200, buyer debit $1,200",
          "Seller debit $1,800, buyer credit $1,800",
          "Seller credit $1,800, buyer debit $1,800"
        ],
        correctIndex: 0,
        explain:
          "Seller collected $3,000 for the month but only owns through March 18. Days buyer will own: March 19-30 = 12 days. Daily rent: $3,000 / 30 = $100. 12 x $100 = $1,200. Seller debit (passes through to buyer), buyer credit."
      },
      {
        q: "Tenant's security deposit of $2,500 is held by the seller. At closing it appears as:",
        options: [
          "Seller debit $2,500, buyer credit $2,500",
          "Seller credit $2,500, buyer debit $2,500",
          "Buyer credit $2,500 only",
          "Not on the CD; handled outside escrow"
        ],
        correctIndex: 0,
        explain:
          "Seller transfers the deposit obligation to the buyer. Full amount, not prorated. Seller debit, buyer credit."
      },
      {
        q: "True or false: security deposits are prorated like rent.",
        options: [
          "True; they are prorated identically",
          "True; prorated but using actual/365",
          "False; deposits transfer in full as a single line",
          "False; deposits do not appear on the CD"
        ],
        correctIndex: 2,
        explain:
          "Deposits transfer in full. They are not usage fees; they are obligations the new owner inherits."
      }
    ]
  },
  {
    id: "harpta-firpta-withholding",
    title: "HARPTA and FIRPTA: Withholding on Non-Resident Sellers",
    summary:
      "Hawaii (HARPTA) and federal (FIRPTA) law require withholding on sales by non-resident and foreign sellers. Both create seller debits. Both can apply simultaneously.",
    body: [
      "HARPTA (Hawaii Real Property Tax Act, HRS section 235-68) requires escrow to withhold 7.25% of the gross sale price when the seller is a non-resident of Hawaii. The funds are sent to the Hawaii Department of Taxation as a prepayment of the seller's Hawaii income tax on any gain. The seller files Form N-288A and can claim back any over-withheld amount.",
      "FIRPTA (Foreign Investment in Real Property Tax Act, IRC section 1445) requires withholding of 15% of the gross sale price when the seller is a foreign person (not a U.S. citizen or resident alien). Funds go to the IRS as a prepayment of federal income tax on any gain. Seller files Form 8288-B and reclaims any over-withholding.",
      "If a seller is BOTH a non-resident of Hawaii AND a foreign person, BOTH withholdings apply. On a $1,000,000 sale, that's $72,500 HARPTA plus $150,000 FIRPTA = $222,500 of seller debits.",
      "Both are seller debits on the CD because they reduce the seller's net proceeds. The buyer has no entry; the withholding is the seller's tax liability, not the buyer's. (Note: legally the buyer is the withholding agent and bears liability for failure to withhold, but the dollars come out of the seller's proceeds.)",
      "Exemptions: HARPTA exempts Hawaii residents. FIRPTA has a partial exemption ($300,000 sale price threshold) for buyer-occupants and a full exemption for U.S. persons. Read the facts carefully. The question 'is the seller a non-resident?' is separate from 'is the seller a foreign person?'",
      "Common exam trap: candidates apply HARPTA to all sales over a price threshold. Wrong. HARPTA depends on residency, not price. A Hawaii resident selling a $20M property pays no HARPTA. A California resident selling a $300,000 property pays HARPTA at 7.25% of $300,000 = $21,750."
    ],
    drill: [
      {
        q: "A California resident sells Hawaii property for $1,200,000. HARPTA withholding equals:",
        options: ["$60,000", "$87,000", "$120,000", "$174,000"],
        correctIndex: 1,
        explain:
          "HARPTA = 7.25% of gross sale price. $1,200,000 x 0.0725 = $87,000. Seller debit."
      },
      {
        q: "A foreign person (Canadian citizen, non-U.S. resident) sells Hawaii property for $800,000. FIRPTA withholding equals:",
        options: ["$58,000", "$96,000", "$120,000", "$160,000"],
        correctIndex: 2,
        explain:
          "FIRPTA = 15% of gross sale price. $800,000 x 0.15 = $120,000. Seller debit."
      },
      {
        q: "A Canadian citizen who lives in Vancouver (not a U.S. resident, not a Hawaii resident) sells a $2,000,000 property. Total withholding on the CD is:",
        options: ["$145,000", "$300,000", "$390,000", "$445,000"],
        correctIndex: 3,
        explain:
          "Both apply. HARPTA: $2,000,000 x 0.0725 = $145,000. FIRPTA: $2,000,000 x 0.15 = $300,000. Total: $445,000 seller debit."
      },
      {
        q: "A Hawaii owner-occupant sells her Oahu home for $1,500,000. HARPTA withholding is:",
        options: ["$0", "$108,750", "$112,500", "$225,000"],
        correctIndex: 0,
        explain:
          "HARPTA does not apply to Hawaii residents. $0 withholding. Residency status matters, not price."
      }
    ]
  },
  {
    id: "conveyance-tax",
    title: "Conveyance Tax: HRS 247's Tiered Schedule",
    summary:
      "Hawaii's conveyance tax (HRS 247) is paid on most real property transfers. Rates are tiered by price and depend on whether the property qualifies for the owner-occupant rate. Seller customarily pays.",
    body: [
      "Hawaii imposes a state conveyance tax on most real property transfers. Statutory authority is HRS Chapter 247. The tax is calculated on the actual and full consideration (sale price) and is customarily paid by the seller in Hawaii (though by contract it can be reallocated).",
      "Rates are tiered and have two tracks: the 'non-occupant' rate (higher) and the 'owner-occupant' rate (lower). The owner-occupant rate applies when the property is the buyer's primary residence and the buyer files the proper certification (Form P-64A signed and recorded). Otherwise, the non-occupant rate applies, including for investment properties, second homes, and most non-resident buyers.",
      "Current rate schedule (2026 effective rates per $100 of consideration):",
      "Non-occupant rates: $0.15/$100 for under $600,000; $0.25/$100 for $600,000 to under $1,000,000; $0.40/$100 for $1,000,000 to under $2,000,000; $0.60/$100 for $2,000,000 to under $4,000,000; $0.85/$100 for $4,000,000 to under $6,000,000; $1.10/$100 for $6,000,000 to under $10,000,000; $1.25/$100 for $10,000,000 and over.",
      "Owner-occupant rates (roughly half of non-occupant): $0.10/$100 for under $600,000; $0.20/$100 for $600,000 to under $1,000,000; $0.30/$100 for $1,000,000 to under $2,000,000; $0.50/$100 for $2,000,000 to under $4,000,000; $0.70/$100 for $4,000,000 to under $6,000,000; $0.90/$100 for $6,000,000 to under $10,000,000; $1.00/$100 for $10,000,000 and over.",
      "Application: the rate is applied flat to the full sale price (NOT bracketed like income tax). A $1,500,000 non-occupant sale pays 0.40% of $1,500,000 = $6,000, not a layered calculation. This is a common point of confusion.",
      "On the CD: conveyance tax is a seller debit (customary). If the buyer agrees to pay it in the contract, it becomes a buyer debit instead. Either way, it's a single line."
    ],
    drill: [
      {
        q: "A non-resident buys a $750,000 Hawaii investment property. Conveyance tax (seller customarily pays, non-occupant rate) equals:",
        options: ["$1,125", "$1,500", "$1,875", "$2,250"],
        correctIndex: 2,
        explain:
          "Non-occupant rate for $600K to under $1M is $0.25/$100, which is 0.25%. $750,000 x 0.0025 = $1,875. Seller debit."
      },
      {
        q: "A Hawaii resident buys a $1,300,000 home as their primary residence and properly files for owner-occupant rate. Conveyance tax equals:",
        options: ["$3,900", "$5,200", "$6,500", "$7,800"],
        correctIndex: 0,
        explain:
          "Owner-occupant rate for $1M to under $2M is $0.30/$100 = 0.30%. $1,300,000 x 0.003 = $3,900. Seller debit (customarily)."
      },
      {
        q: "Conveyance tax is calculated on:",
        options: [
          "The portion of the sale price exceeding the lower-tier threshold (bracketed)",
          "The full sale price at a single applicable rate",
          "The amount above $300,000",
          "Only the down payment"
        ],
        correctIndex: 1,
        explain:
          "The applicable rate is applied flat to the full sale price. There is no bracketed calculation like income tax."
      },
      {
        q: "On a $3,500,000 non-occupant sale, conveyance tax is:",
        options: ["$14,000", "$17,500", "$21,000", "$29,750"],
        correctIndex: 2,
        explain:
          "Non-occupant rate for $2M to under $4M is $0.60/$100 = 0.60%. $3,500,000 x 0.006 = $21,000."
      }
    ]
  },
  {
    id: "recording-escrow-title-fees",
    title: "Recording, Escrow, and Title: The Mid-Sized Debits",
    summary:
      "Settlement-service charges (escrow fee, title insurance, recording fees, document prep) hit both columns by Hawaii custom. Knowing who pays what is high-value exam material.",
    body: [
      "Escrow fee in Hawaii is customarily split 50/50 between buyer and seller (each pays half). Both parties get debited for their share. The escrow fee covers the title company's coordination, document preparation, fund disbursement, and wire processing.",
      "Title insurance has two policies: an owner's policy (protects the buyer) and a lender's policy (protects the lender). Hawaii custom: seller pays for the owner's policy (a seller debit); buyer pays for the lender's policy (a buyer debit). Other states reverse this. The exam tests Hawaii custom, so remember: owner's = seller, lender's = buyer.",
      "Recording fees vary by document. The deed recording fee is customarily paid by the buyer (their deed). The mortgage recording fee is paid by the buyer (their loan). The release of seller's mortgage is paid by the seller (their lien being released). Each is a small debit, typically $30-$50 per instrument.",
      "Document preparation and notary: small charges, usually $25-$100 each, allocated by who needs the document. Notary for the seller's signature on the deed is a seller charge.",
      "Watch the exam for fees that look ambiguous. A 'transfer fee' might be a state conveyance tax (seller pays) or a private association transfer fee (negotiable, default per contract). When in doubt, follow the contract."
    ],
    drill: [
      {
        q: "Hawaii custom for escrow fee allocation is:",
        options: [
          "Buyer pays 100%",
          "Seller pays 100%",
          "Split 50/50",
          "Negotiated separately every time"
        ],
        correctIndex: 2,
        explain:
          "Hawaii custom: escrow fee split 50/50 between buyer and seller."
      },
      {
        q: "Owner's title insurance policy in Hawaii is customarily paid by:",
        options: ["Buyer", "Seller", "Lender", "Title company"],
        correctIndex: 1,
        explain:
          "Seller pays for the owner's policy in Hawaii. Buyer pays for the lender's policy."
      },
      {
        q: "Recording fee for the buyer's new deed is paid by:",
        options: ["Buyer", "Seller", "Split 50/50", "Title insurer"],
        correctIndex: 0,
        explain:
          "The buyer's deed is the buyer's instrument. Buyer pays to record it."
      }
    ]
  },
  {
    id: "realtor-commission-and-get",
    title: "Realtor Commission and GET on Commission",
    summary:
      "The commission is the largest single seller debit on most CDs. On top of it, Hawaii's GE Tax (4% state + county surcharge) applies because brokerage is a service. Easy points if you remember it; easy losses if you don't.",
    body: [
      "Real estate commission is customarily paid by the seller in Hawaii as a percentage of the sale price (6% is the textbook number; actual rates are negotiated). The commission is a single large seller debit, then split between listing and selling brokerages per the listing agreement.",
      "Hawaii's General Excise Tax (GET) applies to gross income from services, including real estate brokerage. The state rate is 4%. Oahu adds a 0.5% county surcharge for a total of 4.5%. Hawaii County, Kauai, and Maui have their own county surcharges (varying by year and ordinance), generally yielding 4.25% to 4.5% total.",
      "The GET is paid by the brokerage to the state, but it is customarily passed through to the seller as a separate line on the CD: '4.5% GE Tax on commission' or similar. The base is the commission, not the sale price. Example: on a $1,000,000 sale with 6% commission ($60,000), Oahu GET = $60,000 x 0.045 = $2,700 seller debit.",
      "Common trap: candidates apply GET to the sale price instead of the commission. Wrong. GET is on the brokerage's income (the commission). Read the question.",
      "Another trap: candidates forget GET entirely. The exam loves to embed it. If a question gives you a commission rate and a county location, GET is almost certainly part of the answer."
    ],
    drill: [
      {
        q: "On a $900,000 Oahu sale at 6% commission, GET on commission equals:",
        options: ["$2,160", "$2,430", "$2,700", "$4,050"],
        correctIndex: 1,
        explain:
          "Commission: $900,000 x 6% = $54,000. Oahu GET: $54,000 x 4.5% = $2,430. Seller debit (in addition to the $54,000 commission)."
      },
      {
        q: "On a $1,200,000 Maui sale at 5.5% commission, with Maui GET total rate of 4.25%, GET on commission equals:",
        options: ["$2,640", "$2,805", "$3,300", "$3,564"],
        correctIndex: 1,
        explain:
          "Commission: $1,200,000 x 5.5% = $66,000. Maui GET: $66,000 x 4.25% = $2,805. Seller debit."
      },
      {
        q: "GET on commission is calculated on:",
        options: [
          "Sale price",
          "Commission",
          "Net proceeds after payoff",
          "Sale price minus loan amount"
        ],
        correctIndex: 1,
        explain:
          "GET is on the brokerage's gross income, which is the commission. Not the sale price."
      }
    ]
  },
  {
    id: "lender-fees-and-prepaids",
    title: "Lender Fees and Prepaids: The Buyer's Stack",
    summary:
      "Loan origination, underwriting, appraisal, credit report, prepaid interest, escrow reserves, and homeowner's insurance all hit the buyer's debit column. These add up.",
    body: [
      "Loan-related charges on the CD page 2 break into three subsections: A. Origination Charges (paid to the lender directly), B. Services the borrower did not shop for, C. Services the borrower did shop for. Together they form the buyer's loan costs. All are buyer debits.",
      "Origination: lender's fee for making the loan. Usually a flat fee or percentage of the loan amount (often 0.5% to 1%). Often described as 'loan origination fee' or 'discount points' on the CD.",
      "Discount points: 1 point = 1% of the loan amount, paid upfront to lower the interest rate. Buyer debit. Example: 1 point on a $640,000 loan = $6,400.",
      "Appraisal, credit report, flood determination, tax service, underwriting: each a small fixed fee. Buyer debit.",
      "Prepaids (Section F): prepaid interest (per-diem from closing to month end), homeowner's insurance first year premium, mortgage insurance up-front premium (if applicable). All buyer debits.",
      "Initial escrow payment at closing (Section G): the lender requires several months of property tax and insurance held in escrow reserves. Typical: 2-3 months of taxes plus 2-3 months of insurance. Buyer debit.",
      "Do not double-count. If you include prepaid interest as both a buyer debit AND a separate proration with the seller, the math will be wrong. The buyer's prepaid interest goes to the lender (not the seller); it's unilateral, not a proration."
    ],
    drill: [
      {
        q: "Buyer pays 1 discount point on a $700,000 loan. The debit equals:",
        options: ["$3,500", "$5,250", "$7,000", "$10,500"],
        correctIndex: 2,
        explain:
          "1 point = 1% of loan amount. $700,000 x 1% = $7,000. Buyer debit."
      },
      {
        q: "Lender requires 3 months of property tax reserves at closing. Annual taxes are $4,800. The buyer debit is:",
        options: ["$400", "$800", "$1,200", "$1,600"],
        correctIndex: 2,
        explain:
          "Monthly tax: $4,800 / 12 = $400. Three months: $400 x 3 = $1,200. Buyer debit (initial escrow account funding)."
      }
    ]
  },
  {
    id: "putting-it-all-together",
    title: "Putting It All Together: The Reconciliation Principle",
    summary:
      "Every closing statement balances: buyer total debits minus buyer credits equals cash to close. Seller net proceeds equal seller credits minus seller debits. If both don't reconcile, you have an error.",
    body: [
      "Once you can sort every line into the right column, the reconciliation is mechanical. For the buyer: sum all debits, sum all credits, subtract credits from debits. The difference is the buyer's cash to close. This is the wire the buyer sends to escrow before recording.",
      "For the seller: sum all credits, sum all debits, subtract debits from credits. The difference is the seller's net proceeds. This is the wire escrow sends to the seller after recording.",
      "Validation: every double-sided entry (sale price, prorations, escrow fee splits, rent transfers) is mirrored across columns. If your numbers don't balance, scan for a missing entry first; arithmetic errors are rarer than omissions.",
      "Most common cause of imbalance: a proration entered on only one side. Every proration is double-entry by definition: a credit to one party equals a debit to the other. If you've debited the seller but forgotten to credit the buyer, the books will not balance.",
      "Second most common cause: applying a rate to the wrong base. GET applied to sale price instead of commission. Conveyance tax applied to net proceeds instead of sale price. Per-diem interest applied to original loan amount instead of current balance. Each of these will throw a single number off by a meaningful amount.",
      "Final mental check before submitting an exam answer: does the seller's net feel right? On a $1M sale with a $400K payoff and $60K commission, the seller's net should be roughly $500K (back-of-envelope). If your reconciliation produces $200K or $800K, something is wrong. Big-picture sanity checks catch most errors."
    ],
    drill: [
      {
        q: "Buyer total debits are $890,000 and buyer total credits are $815,000. Cash to close is:",
        options: ["$75,000", "$815,000", "$890,000", "$1,705,000"],
        correctIndex: 0,
        explain:
          "Cash to close = buyer debits - buyer credits. $890,000 - $815,000 = $75,000."
      },
      {
        q: "Seller credits total $920,000 and seller debits total $440,000. Net to seller is:",
        options: ["$440,000", "$480,000", "$920,000", "$1,360,000"],
        correctIndex: 1,
        explain:
          "Net = seller credits - seller debits. $920,000 - $440,000 = $480,000."
      },
      {
        q: "A candidate's reconciliation shows the buyer's cash to close as $145,000, but the candidate forgot to record the $25,000 earnest money. The correct cash to close should be:",
        options: ["$120,000", "$145,000", "$170,000", "$195,000"],
        correctIndex: 0,
        explain:
          "Earnest money is a buyer credit. Adding the missing credit reduces cash to close. $145,000 - $25,000 = $120,000."
      }
    ]
  },
  {
    id: "full-integrated-example",
    title: "Full Integrated Example: $850,000 Honolulu Closing",
    summary:
      "A complete, reconciled CD walkthrough using all the rules covered. Every dollar accounts for itself.",
    body: [
      "This is the master example. Build it slowly, line by line. By the end, you should be able to recreate the entire statement from the facts alone.",
      "We'll use realistic Hawaii customs throughout: seller pays through day of closing, Oahu GET of 4.5%, owner's title to seller, lender's title to buyer, escrow fee split 50/50, owner-occupant conveyance tax rate.",
      "Watch how each section we've built so far slots in. The integrated reconciliation is just the sum of everything we've practiced."
    ],
    example: {
      scenario:
        "$850,000 Honolulu condominium sale, owner-occupant buyer, Hawaii-resident seller, closing March 15, 2026",
      facts: [
        "Sale price: $850,000",
        "Earnest money deposit: $25,000 (in escrow)",
        "Buyer's new loan: $680,000 at 6.5% (80% LTV)",
        "Seller's existing loan payoff: $295,000 (includes accrued interest)",
        "Annual property taxes: $4,800 (paid in advance through June 30)",
        "Monthly AOAO fee: $600 (paid in advance for March)",
        "Commission: 6% of sale price",
        "Oahu GET rate: 4.5% on commission",
        "Conveyance tax: owner-occupant buyer rate ($0.20/$100 for $600K-$1M tier)",
        "Owner's title insurance (seller): $1,400",
        "Lender's title insurance (buyer): $850",
        "Escrow fee: $1,800 total, split 50/50",
        "Recording fees: deed $50 (buyer), mortgage $50 (buyer), release of seller's mortgage $40 (seller)",
        "Buyer's prepaid interest: 16 days x $122.78/day per-diem on $680K at 6.5% = $1,964.45 (rounded to $1,964.45)",
        "Buyer's homeowner's insurance first year premium: $1,200",
        "Buyer's initial escrow reserves: 3 months tax ($1,200) + 2 months insurance ($200) = $1,400",
        "Seller is a Hawaii resident (no HARPTA); buyer is U.S. citizen (no FIRPTA)",
        "30/360 convention"
      ],
      table: [
        {
          label: "Sale price",
          sellerCredit: "$850,000.00",
          buyerDebit: "$850,000.00"
        },
        {
          label: "Earnest money deposit",
          buyerCredit: "$25,000.00"
        },
        {
          label: "Buyer's new loan",
          buyerCredit: "$680,000.00"
        },
        {
          label: "Seller's existing loan payoff",
          sellerDebit: "$295,000.00"
        },
        {
          label: "Property tax proration (paid in advance; March 16 to June 30 = 105 days x $13.3333)",
          sellerCredit: "$1,400.00",
          buyerDebit: "$1,400.00"
        },
        {
          label: "AOAO proration (paid in advance for March; March 16-30 = 15 days x $20)",
          sellerCredit: "$300.00",
          buyerDebit: "$300.00"
        },
        {
          label: "Commission (6% x $850,000)",
          sellerDebit: "$51,000.00"
        },
        {
          label: "GET on commission (4.5% x $51,000)",
          sellerDebit: "$2,295.00"
        },
        {
          label: "Conveyance tax (owner-occupant, $0.20/$100 x $850,000)",
          sellerDebit: "$1,700.00"
        },
        {
          label: "Owner's title insurance",
          sellerDebit: "$1,400.00"
        },
        {
          label: "Lender's title insurance",
          buyerDebit: "$850.00"
        },
        {
          label: "Escrow fee (split 50/50, $900 each)",
          sellerDebit: "$900.00",
          buyerDebit: "$900.00"
        },
        {
          label: "Recording: deed",
          buyerDebit: "$50.00"
        },
        {
          label: "Recording: buyer's mortgage",
          buyerDebit: "$50.00"
        },
        {
          label: "Recording: release of seller's mortgage",
          sellerDebit: "$40.00"
        },
        {
          label: "Buyer's prepaid interest (16 days x $122.78)",
          buyerDebit: "$1,964.45"
        },
        {
          label: "Buyer's homeowner's insurance (first year)",
          buyerDebit: "$1,200.00"
        },
        {
          label: "Buyer's initial escrow reserves",
          buyerDebit: "$1,400.00"
        }
      ],
      sellerNet:
        "Seller credits: $850,000 + $1,400 + $300 = $851,700.00. Seller debits: $295,000 + $51,000 + $2,295 + $1,700 + $1,400 + $900 + $40 = $352,335.00. NET TO SELLER: $851,700.00 - $352,335.00 = $499,365.00",
      buyerCashToClose:
        "Buyer debits: $850,000 + $1,400 + $300 + $850 + $900 + $50 + $50 + $1,964.45 + $1,200 + $1,400 = $858,114.45. Buyer credits: $25,000 + $680,000 = $705,000.00. CASH TO CLOSE: $858,114.45 - $705,000.00 = $153,114.45",
      walkthrough: [
        "Step 1: Anchor with sale price. Seller credit $850,000, buyer debit $850,000. The biggest number on the page.",
        "Step 2: Buyer's existing credits. Earnest money $25,000 (already paid) and new loan $680,000 (lender will wire). Total buyer credits before prorations: $705,000.",
        "Step 3: Seller's existing debt. Payoff $295,000. Seller's only big debit so far.",
        "Step 4: Property tax proration. Annual $4,800, paid through June 30. Closing March 15. Daily rate $13.3333 (using 30/360). Days seller paid for but will not own: March 16 to June 30 = 105 days. 105 x $13.3333 = $1,400. Seller credit, buyer debit.",
        "Step 5: AOAO proration. Monthly $600 paid for March, closing March 15. Days buyer will own in March: 15 (March 16-30). Daily rate $20. 15 x $20 = $300. Seller credit, buyer debit.",
        "Step 6: Commission. 6% x $850,000 = $51,000. Seller debit.",
        "Step 7: GET on commission. 4.5% x $51,000 = $2,295. Seller debit.",
        "Step 8: Conveyance tax. Owner-occupant rate for $600K to $1M bracket is $0.20/$100 = 0.20%. $850,000 x 0.002 = $1,700. Seller debit (customary).",
        "Step 9: Title insurance. Owner's $1,400 seller, lender's $850 buyer. Two separate lines.",
        "Step 10: Escrow fee $1,800 split 50/50 = $900 each. Both columns.",
        "Step 11: Recording fees. Buyer's deed $50 and mortgage $50, both buyer debits. Release of seller's lien $40, seller debit.",
        "Step 12: Buyer's prepaids and reserves. Prepaid interest $1,964.45 (16 days x $122.78), homeowner's insurance $1,200, initial escrow $1,400. All buyer debits.",
        "Step 13: No HARPTA (Hawaii-resident seller). No FIRPTA (U.S. citizen seller).",
        "Step 14: Tally. Seller credits = $851,700. Seller debits = $352,335. Seller net = $499,365.00. Buyer debits = $858,114.45. Buyer credits = $705,000. Buyer cash to close = $153,114.45.",
        "Step 15: Sanity check. Sale price $850K, payoff $295K, commission + GET ~ $53K, conveyance tax + small fees ~ $4K, plus tax/AOAO credits of about $1.7K back to seller. Net ~ $850K - $295K - $53K - $4K + $1.7K ~ $500K. Matches $499,365 to within rounding. Confirmed."
      ]
    },
    drill: [
      {
        q: "In the integrated example, what was the total of seller debits?",
        options: ["$295,000", "$352,335", "$499,365", "$851,700"],
        correctIndex: 1,
        explain:
          "Seller debits sum: $295,000 + $51,000 + $2,295 + $1,700 + $1,400 + $900 + $40 = $352,335."
      },
      {
        q: "If the seller in the integrated example had been a California resident, HARPTA would add a seller debit of:",
        options: ["$42,500", "$54,000", "$61,625", "$127,500"],
        correctIndex: 2,
        explain:
          "HARPTA: 7.25% x $850,000 = $61,625. Reduces seller net by exactly that amount."
      },
      {
        q: "If the buyer in the integrated example had been a foreign person, FIRPTA would be:",
        options: ["$42,500", "$0 (FIRPTA only applies to foreign sellers)", "$127,500", "$170,000"],
        correctIndex: 1,
        explain:
          "FIRPTA applies to foreign SELLERS, not buyers. Buyer's foreign status does not trigger FIRPTA withholding on the seller's side."
      }
    ]
  },
  {
    id: "common-traps",
    title: "Top 10 Closing-Math Traps on the Broker Exam",
    summary:
      "The errors that cost the most points. Pre-internalize each one and the exam loses most of its power.",
    body: [
      "Trap 1: Proration direction. Determine FIRST whether the item is paid in advance or in arrears, THEN compute. Reversing the direction (credit instead of debit) costs the entire question.",
      "Trap 2: Forgetting earnest money. The earnest money is a buyer credit that's already in escrow. If you forget it, cash to close is overstated by the deposit amount. Always scan the facts for earnest money before reconciling.",
      "Trap 3: Misapplying HARPTA or FIRPTA. HARPTA is 7.25%, FIRPTA is 15%, both on gross sale price (not net). Trap question: 'After the existing loan payoff, what is HARPTA on the seller's net?' Wrong premise. HARPTA is on gross sale.",
      "Trap 4: Double-counting property tax. If you prorate the tax AND list the full annual tax separately, you've double-counted. Only the prorated amount enters the CD.",
      "Trap 5: Forgetting GET on commission. Hawaii adds 4.5% (Oahu) GET on top of the commission. Easy to miss. If a question gives you commission and county, GET is usually part of the answer.",
      "Trap 6: Applying GET to sale price instead of commission. GET is on the brokerage's income (commission), not the sale price.",
      "Trap 7: Mis-allocating title insurance. In Hawaii, owner's policy is seller-paid, lender's policy is buyer-paid. Reversing this is a common mistake (and the exam knows it).",
      "Trap 8: Treating down payment as a buyer credit. Down payment is the residual cash the buyer brings; it's not a separate credit line. The only buyer credits are earnest money, loan amount, and any seller concessions.",
      "Trap 9: Forgetting the security deposit transfer. If the property is leased, the security deposit transfers from seller to buyer (seller debit, buyer credit). Easy to miss when the question focuses on rent.",
      "Trap 10: Conveyance tax bracketing. Hawaii's conveyance tax applies the rate to the FULL sale price at a single rate, not bracketed like income tax. Do not layer the calculation."
    ],
    drill: [
      {
        q: "Which of the following is NOT a buyer credit?",
        options: [
          "Earnest money deposit",
          "Buyer's new loan amount",
          "Seller concession",
          "Buyer's down payment"
        ],
        correctIndex: 3,
        explain:
          "Down payment is the residual (cash brought by buyer), not a credit line. The other three are all buyer credits."
      },
      {
        q: "Which trap causes the buyer's cash to close to be overstated by the deposit amount?",
        options: [
          "Forgetting earnest money",
          "Forgetting the new loan amount",
          "Mis-applying HARPTA",
          "Conveyance tax bracketing"
        ],
        correctIndex: 0,
        explain:
          "Earnest money is a buyer credit already paid into escrow. Omitting it leaves cash to close artificially high by exactly the deposit."
      },
      {
        q: "HARPTA is calculated on:",
        options: [
          "Gross sale price",
          "Net to seller",
          "Sale price minus payoff",
          "Gain on sale"
        ],
        correctIndex: 0,
        explain:
          "HARPTA = 7.25% of gross sale price. Always."
      }
    ]
  },
  {
    id: "final-drill-set",
    title: "Final Drill Set: Reconciliation Under Pressure",
    summary:
      "Fifteen exam-grade questions that integrate everything above. If you can finish this section in under 30 minutes with 80%+ accuracy, you are ready.",
    body: [
      "Treat each question as a mini-CD. Read the facts twice, sort entries into the four buckets (seller debit, seller credit, buyer debit, buyer credit), then compute.",
      "If a question feels long, slow down. The exam intentionally embeds extra information to test whether you can isolate what matters. The hardest questions reward patient reading.",
      "After completing the set, review every explanation. Re-do the questions you missed. Then move to the live mock exams."
    ],
    drill: [
      {
        q: "Sale price $700,000. Earnest money $20,000. Buyer's loan $560,000. Seller's loan payoff $310,000. No prorations, no other costs. Seller net is:",
        options: ["$370,000", "$390,000", "$700,000", "$370,000 minus commission"],
        correctIndex: 1,
        explain:
          "Seller credits = $700,000 (sale price). Seller debits = $310,000 (payoff). Net = $390,000."
      },
      {
        q: "Continuing the previous fact pattern with 6% Oahu commission added (and GET on commission): seller net is:",
        options: ["$304,110", "$346,110", "$348,000", "$390,000"],
        correctIndex: 1,
        explain:
          "Commission $700,000 x 6% = $42,000. GET on commission $42,000 x 4.5% = $1,890. New seller debits = $310,000 + $42,000 + $1,890 = $353,890. Seller net = $700,000 - $353,890 = $346,110."
      },
      {
        q: "Sale price $1,000,000. Buyer is a Hawaii resident owner-occupant. Conveyance tax (seller pays) equals:",
        options: ["$1,500", "$2,000", "$2,500", "$3,000"],
        correctIndex: 3,
        explain:
          "$1,000,000 is at the bottom of the $1M-$2M tier. Owner-occupant rate is $0.30/$100 = 0.30%. $1,000,000 x 0.003 = $3,000."
      },
      {
        q: "Sale price $500,000. Seller is a California resident. HARPTA withholding equals:",
        options: ["$25,000", "$30,000", "$36,250", "$75,000"],
        correctIndex: 2,
        explain:
          "HARPTA = 7.25% x $500,000 = $36,250."
      },
      {
        q: "Annual property tax $6,000, paid in arrears. Tax year July 1 to June 30. Closing November 15. Using 30/360 and seller-pays-through-closing-day convention, the tax proration is:",
        options: [
          "Seller debit $2,250, buyer credit $2,250",
          "Seller credit $2,250, buyer debit $2,250",
          "Seller debit $3,750, buyer credit $3,750",
          "Seller credit $3,750, buyer debit $3,750"
        ],
        correctIndex: 0,
        explain:
          "Paid in arrears means seller owes buyer. Seller owned July 1 to November 15 = 4 months + 15 days = 135 days. Daily rate: $6,000 / 360 = $16.6667. 135 x $16.6667 = $2,250. Seller debit, buyer credit."
      },
      {
        q: "Monthly rent $4,500 paid on the 1st. Closing September 22. The rent proration entry is:",
        options: [
          "Seller debit $1,200, buyer credit $1,200",
          "Seller credit $1,200, buyer debit $1,200",
          "Seller debit $3,300, buyer credit $3,300",
          "Seller credit $3,300, buyer debit $3,300"
        ],
        correctIndex: 0,
        explain:
          "Seller collected full month, owns through September 22. Days buyer will own: September 23-30 = 8 days. Daily rate: $4,500 / 30 = $150. 8 x $150 = $1,200. Seller debit, buyer credit."
      },
      {
        q: "Seller's loan balance $400,000 at 6%. Last payment covered through July 31. Closing August 18. Using 360-day per-diem and Hawaii custom, interest accrued at closing is:",
        options: ["$960", "$1,200", "$1,400", "$1,800"],
        correctIndex: 1,
        explain:
          "Per-diem: $400,000 x 0.06 / 360 = $66.6667/day. Days: August 1-18 = 18 days. 18 x $66.6667 = $1,200. Added to seller's payoff (seller debit)."
      },
      {
        q: "On a $1,500,000 sale to a non-occupant buyer, conveyance tax equals:",
        options: ["$3,000", "$4,500", "$6,000", "$9,000"],
        correctIndex: 2,
        explain:
          "Non-occupant rate for $1M-$2M is $0.40/$100 = 0.40%. $1,500,000 x 0.004 = $6,000."
      },
      {
        q: "Buyer cash to close calculation: total debits $920,000, earnest money $30,000, new loan $720,000, seller concession $5,000. Cash to close is:",
        options: ["$155,000", "$165,000", "$170,000", "$200,000"],
        correctIndex: 1,
        explain:
          "Credits: $30,000 + $720,000 + $5,000 = $755,000. Cash to close: $920,000 - $755,000 = $165,000."
      },
      {
        q: "On an Oahu sale, commission is $48,000. GET on commission is:",
        options: ["$1,920", "$2,160", "$2,400", "$2,880"],
        correctIndex: 1,
        explain:
          "Oahu GET: $48,000 x 4.5% = $2,160."
      },
      {
        q: "Owner-occupant buyer purchases for $2,800,000 in Hawaii. Conveyance tax (seller pays) equals:",
        options: ["$8,400", "$11,200", "$14,000", "$16,800"],
        correctIndex: 2,
        explain:
          "Owner-occupant rate for $2M-$4M is $0.50/$100 = 0.50%. $2,800,000 x 0.005 = $14,000."
      },
      {
        q: "Foreign-citizen non-resident seller sells Hawaii property for $1,400,000 to a U.S. owner-occupant. Total combined HARPTA + FIRPTA equals:",
        options: ["$101,500", "$210,000", "$311,500", "$420,000"],
        correctIndex: 2,
        explain:
          "Both apply. HARPTA: 7.25% x $1,400,000 = $101,500. FIRPTA: 15% x $1,400,000 = $210,000. Total: $311,500."
      },
      {
        q: "AOAO monthly fee $750, paid in advance. Closing on the 10th. Under 30/360, the AOAO proration is:",
        options: [
          "Seller credit $500, buyer debit $500",
          "Seller credit $250, buyer debit $250",
          "Seller debit $500, buyer credit $500",
          "Seller debit $250, buyer credit $250"
        ],
        correctIndex: 0,
        explain:
          "Paid in advance for the month. Seller owns through the 10th. Days buyer will own: 11-30 = 20 days. Daily rate: $750 / 30 = $25. 20 x $25 = $500. Seller credit (paid in advance and will not own those days)."
      },
      {
        q: "Buyer prepaid interest: $720,000 loan at 7%, closing March 20. Using 360-day base and the rule 'buyer pays from day after closing through month end', prepaid interest is:",
        options: ["$1,400.00", "$1,540.00", "$1,680.00", "$1,820.00"],
        correctIndex: 1,
        explain:
          "Per-diem: $720,000 x 0.07 / 360 = $140/day. Days: March 21-31 = 11 days. 11 x $140 = $1,540. Buyer debit."
      },
      {
        q: "Sale price $950,000. Buyer's loan $760,000. Earnest money $30,000. Seller payoff $410,000. Tax proration: seller credit $1,200, buyer debit $1,200. Commission 6% Oahu (with GET 4.5%). Conveyance tax $1,900 (non-occupant). Owner's title $1,500 (seller). Lender's title $900 (buyer). Escrow fee $1,600 split 50/50. Recording fees: $100 buyer total, $50 seller. No other items. Approximate seller net is:",
        options: ["$464,000", "$471,000", "$477,000", "$485,000"],
        correctIndex: 2,
        explain:
          "Seller credits: $950,000 + $1,200 = $951,200. Commission: $950,000 x 6% = $57,000. GET: $57,000 x 4.5% = $2,565. Seller debits: $410,000 + $57,000 + $2,565 + $1,900 + $1,500 + $800 + $50 = $473,815. Net = $951,200 - $473,815 = $477,385. Closest to $477,000."
      }
    ]
  }
];
