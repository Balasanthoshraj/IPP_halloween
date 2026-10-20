import type { Metadata, Viewport } from "next";
import { IM_Fell_English, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import Nav from "./Nav";
import "./globals.css";

// Dystopian Canticle by Scapholène, SIL Open Font License 1.1 (license text in ./fonts)
const canticle = localFont({ src: "./fonts/Dystopian-Canticle-Regular.otf", variable: "--font-canticle" });
const sans = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-sans" });
const fell = IM_Fell_English({ subsets: ["latin"], weight: "400", variable: "--font-fell" }); // the book's ink

export const metadata: Metadata = {
  title: "ISTA presents i++26",
};

export const viewport: Viewport = {
  themeColor: "#050b1e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${canticle.variable} ${sans.variable} ${fell.variable}`}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
