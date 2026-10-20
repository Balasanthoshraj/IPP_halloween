import type { Metadata } from "next";
import Room from "../Room";

export const metadata: Metadata = { title: "Events · ISTA presents i++26" };

export default function Events() {
  return <Room title="Events" />;
}
