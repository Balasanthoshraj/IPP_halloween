// Left to right, in this order. The logos are trimmed copies of the supplied files.
export type Sponsor = { role: string; name: string; logo: string };

export const SPONSORS: readonly Sponsor[] = [
  { role: "Title sponsor", name: "Zentropy", logo: "/art/sponsors/zentropy.webp" },
  { role: "Associate sponsor", name: "Codestax AI", logo: "/art/sponsors/codestax.webp" },
  { role: "Apparel sponsor", name: "Samhitha Marine", logo: "/art/sponsors/samhitha.webp" },
  { role: "Printing sponsor", name: "Rajams", logo: "/art/sponsors/rajams.webp" },
];
