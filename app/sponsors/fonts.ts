import { Pirata_One } from "next/font/google";

// Only the phone view shows a heading, in the face of the Contact page's title. So it is not preloaded (that would go to every
// screen, and pull in the other pages' fonts with it), and until it arrives the text stays invisible instead of flashing in a plain one.
export const pirata = Pirata_One({ subsets: ["latin"], weight: "400", variable: "--font-pirata", preload: false, display: "block" });
