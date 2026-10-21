// The "Reach us" sign under the cards (public/art/contact/sign.webp, 1400 x 635). Its three notes are links: each `box` is where
// one sits on the picture, as [left, top, width, height] in percent.
export const REACH = {
  src: "/art/contact/sign.webp",
  width: 1400,
  height: 635,
  notes: [
    { name: "Email ista@auist.in", href: "mailto:ista@auist.in", box: [10.88, 24.01, 24.24, 60.16] },
    { name: "Instagram ista__ceg", href: "https://www.instagram.com/ista__ceg/", box: [39.52, 24.42, 23.07, 59.48] },
    { name: "LinkedIn ISTA CEG", href: "https://www.linkedin.com/company/ista-ceg/mycompany/", box: [68.27, 23.87, 23.5, 59.75] },
  ],
} as const;

// The team, in the order the cards appear. Phones are the 10-digit mobile numbers; the page groups them 5 + 5 and dials +91.
export const TEAM = [
  { name: "Siva", role: "Chairperson", phone: "7695963602" },
  { name: "Dhanushgodi", role: "Overall Co-ordinator", phone: "9843730005" },
  { name: "Anitha", role: "Events Head", phone: "8220947375" },
  { name: "Divakar", role: "Events Head", phone: "8012488297" },
  { name: "Elankavi", role: "Marketing & Media Head", phone: "8072818815" },
  { name: "Sakthi Kumar", role: "Marketing & Media Head", phone: "8667727189" },
] as const;
