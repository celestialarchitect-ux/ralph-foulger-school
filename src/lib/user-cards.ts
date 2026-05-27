// Student-created flashcards (localStorage). Built from highlights via
// "Save as flashcard", surfaced on the Flashcards page under the "My cards"
// deck. Kept client-side like course progress — no server round-trip needed.

export interface UserCard {
  id: string;
  term: string;        // front (cue)
  definition: string;  // back (the highlighted passage)
  category: 'my-cards';
  hawaiiNote?: string;
  sourceSlug?: string; // chapter it came from
  createdAt: number;
}

const LS_KEY = 'ralph-user-cards-v1';

export function loadUserCards(): UserCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as UserCard[]) : [];
  } catch {
    return [];
  }
}

function save(list: UserCard[]): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch { /* quota */ }
}

export function addUserCard(input: { term: string; definition: string; sourceSlug?: string }): UserCard {
  const card: UserCard = {
    id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `c_${Date.now()}`,
    term: input.term.slice(0, 300),
    definition: input.definition.slice(0, 2000),
    category: 'my-cards',
    sourceSlug: input.sourceSlug,
    createdAt: Date.now(),
  };
  const list = loadUserCards();
  // de-dupe: same definition already saved → return existing
  const existing = list.find((c) => c.definition === card.definition);
  if (existing) return existing;
  list.push(card);
  save(list);
  return card;
}

export function removeUserCard(id: string): void {
  save(loadUserCards().filter((c) => c.id !== id));
}

export function userCardCount(): number {
  return loadUserCards().length;
}
