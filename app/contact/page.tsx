import type { Metadata } from "next";
import ContactScene from "./ContactScene";

export const metadata: Metadata = { title: "Contact · ISTA presents i++26" };

export default function Contact() {
  return <ContactScene />;
}
