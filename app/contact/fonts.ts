import { Chakra_Petch, Pirata_One, Share_Tech_Mono } from "next/font/google";

// Only the Contact page uses these, so only it preloads them.
export const pirata = Pirata_One({ subsets: ["latin"], weight: "400", variable: "--font-pirata" }); // the heading
export const chakra = Chakra_Petch({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-chakra" }); // the cards
export const mono = Share_Tech_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono" }); // the quote
