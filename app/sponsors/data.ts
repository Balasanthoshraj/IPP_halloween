// Left to right, in this order. The logos are trimmed copies of the supplied files. `card` is what a phone shows instead of the
// lanyards: the sponsor's title and logo together, cut out on transparent (CARD_SIZE, all alike).
export type Sponsor = { role: string; name: string; logo: string; card: string };

export const CARD_SIZE = { width: 840, height: 411 };

export const SPONSORS: readonly Sponsor[] = [
  { role: "Title sponsor", name: "Zentropy", logo: "/art/sponsors/zentropy.webp", card: "/art/sponsors/card-zentropy.webp" },
  { role: "Associate sponsor", name: "Codestax AI", logo: "/art/sponsors/codestax.webp", card: "/art/sponsors/card-codestax.webp" },
  { role: "Apparel sponsor", name: "Samhitha Marine", logo: "/art/sponsors/samhitha.webp", card: "/art/sponsors/card-samhitha.webp" },
  { role: "Printing sponsor", name: "Rajams", logo: "/art/sponsors/rajams.webp", card: "/art/sponsors/card-rajams.webp" },
];
