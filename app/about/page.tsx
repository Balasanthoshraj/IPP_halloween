import type { Metadata } from "next";
import Transition from "../Transition";
import { IllustratedScene } from "@/ippbook/components/Scene/IllustratedScene";
import "./book.css";

export const metadata: Metadata = {
  title: "About · ISTA presents i++26",
};

export default function About() {
  return (
    <Transition>
      <main id="ippbook">
        <IllustratedScene />
      </main>
    </Transition>
  );
}
