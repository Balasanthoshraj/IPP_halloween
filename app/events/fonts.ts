import { Chakra_Petch, Pirata_One, Teko } from "next/font/google";

// Only the Events page uses these, so only it preloads them.
// titles, like the category frames' lettering; no `weight`, since listing weights for this font breaks `next build`
export const teko = Teko({ subsets: ["latin"], variable: "--font-teko" });
export const chakra = Chakra_Petch({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-chakra" }); // the details
export const pirata = Pirata_One({ subsets: ["latin"], weight: "400", variable: "--font-pirata" }); // the page heading, as on the Contact page
