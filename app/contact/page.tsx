import type { Metadata } from "next";
import Room from "../Room";

export const metadata: Metadata = { title: "Contact · ISTA presents i++26" };

export default function Contact() {
  return <Room title="Contact" />;
}
