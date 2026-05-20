// Stripe client + product / price configuration.
// Four Stripe Price IDs map to three paid tiers + one extension SKU. Prices
// are created in the Stripe dashboard and wired through env vars so we never
// hard-code amounts in source.

import Stripe from 'stripe';

// Tier the user IS on after a successful charge.
//   - standard : full Hawaii salesperson licensing prep
//   - plus     : standard + agent website on graduation
//   - solo     : standalone website build (already-licensed agents)
//   - broker   : Tier 4 — Hawaii broker license prep (80 hrs HI-broker
//                pre-license, 600+ math problems, 6 timed mocks, closing
//                statement workshop, AI tutor, pass guarantee).
//                Requires prior salesperson license + 3 yrs full-time HI
//                experience per HAR §16-99-19.2 (Broker Experience Cert).
export type CheckoutTier = 'standard' | 'plus' | 'solo' | 'broker';

// A SKU you can buy. Includes the four tiers plus the Plus-only extension.
// Extension is NOT a tier — it tops up an existing Plus user's
// accessExpiresAt without changing their tier.
export type CheckoutSku = CheckoutTier | 'extension';

const PRICE_ENV: Record<CheckoutSku, string> = {
  standard:  'STRIPE_PRICE_STANDARD',
  plus:      'STRIPE_PRICE_PLUS',
  solo:      'STRIPE_PRICE_SOLO',
  broker:    'STRIPE_PRICE_BROKER',
  extension: 'STRIPE_PRICE_EXTENSION',
};

// How many days each SKU grants. Standard and Plus set a fresh window from
// `now`. Extension ADDS to the existing accessExpiresAt (or `now`, whichever
// is later — Stripe's at-least-once delivery means we should be defensive).
// Solo is a website build, not coursework, so it has no expiry.
// Broker is a 12-month window — brokers study while working full-time so
// they need substantially more cushion than salesperson candidates.
export const ACCESS_DAYS: Record<CheckoutSku, number | null> = {
  standard:  90,
  plus:      180,
  solo:      null,
  broker:    365,
  extension: 90,
};

const DAY_MS = 24 * 60 * 60 * 1000;

// Compute the new accessExpiresAt for a paid event. `current` is the user's
// existing accessExpiresAt (possibly null, possibly in the past).
//   - standard / plus: fresh window from now (a re-enroll resets the clock).
//   - solo:            null (no course access component).
//   - extension:       max(current, now) + 90 days. This is what makes the
//                      $249.99 extension feel fair — buying it the day before
//                      expiry doesn't waste the unused days.
export function computeAccessExpiry(sku: CheckoutSku, current: Date | null, now: Date = new Date()): Date | null {
  const days = ACCESS_DAYS[sku];
  if (days === null) return null;
  if (sku === 'extension') {
    const base = current && current > now ? current : now;
    return new Date(base.getTime() + days * DAY_MS);
  }
  return new Date(now.getTime() + days * DAY_MS);
}

export function stripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function stripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  // No explicit apiVersion — defaults to the version pinned by the installed
  // Stripe SDK, which is the only version the SDK guarantees type compatibility
  // with. Override here if you need to peg to a specific API release.
  return new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true });
}

export function priceIdFor(sku: CheckoutSku): string | null {
  return process.env[PRICE_ENV[sku]] ?? null;
}

// Reverse-lookup: given a Stripe price ID, return the SKU it belongs to.
// Useful in the webhook when metadata is missing.
export function skuFromPriceId(priceId: string): CheckoutSku | null {
  for (const sku of ['standard', 'plus', 'solo', 'broker', 'extension'] as const) {
    if (process.env[PRICE_ENV[sku]] === priceId) return sku;
  }
  return null;
}

// Back-compat alias for the older import name used by the webhook.
export const tierFromPriceId = skuFromPriceId;

export const TIER_PRICE_USD: Record<CheckoutSku, number> = {
  standard:  599,
  plus:      899,
  solo:      800,
  broker:    1500,
  extension: 249.99,
};

export const TIER_LABEL: Record<CheckoutSku, string> = {
  standard:  'Standard',
  plus:      'Plus',
  solo:      'Solo Website Build',
  broker:    'Broker License Prep',
  extension: 'Plus Extension (90 days)',
};
