import type { Metadata } from "next";
import Transition from "../Transition";
import Grimoire from "./Grimoire";

export const metadata: Metadata = {
  title: "About · ISTA presents i++26",
};

export default function About() {
  return (
    <Transition>
      <main className="page">
        <Grimoire />
      </main>
    </Transition>
  );
}
