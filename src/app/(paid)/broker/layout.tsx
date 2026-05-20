import { TierGate } from '@/components/TierGate';

// Tier 4 broker license prep ($1,500). Stricter gate than the outer (paid)
// layout — only tier='broker' (or admins) get through. Salesperson Standard
// / Plus students hitting these routes get bounced to /pricing#broker.
export default function BrokerLayout({ children }: { children: React.ReactNode }) {
  return <TierGate require="broker">{children}</TierGate>;
}
