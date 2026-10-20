/* eslint-disable @next/next/no-img-element -- four small pre-trimmed logos in public/art/sponsors */
import { SPONSORS } from "./data";
import LanyardHost from "./LanyardHost";
import "./sponsors.css";

// The end of the home page: four lanyards hang from this section's top edge (board.ts draws them). The list is what
// screen readers get, and what everyone sees if WebGL is unavailable.
export default function Sponsors() {
  return (
    <section id="sponsors" className="sp" aria-labelledby="sponsors-title">
      <h2 id="sponsors-title" className="sr-only">
        Sponsors
      </h2>
      <ul className="sp-list sr-only">
        {SPONSORS.map(({ role, name, logo }) => (
          <li key={name}>
            <span>{role}</span>
            <img src={logo} alt={name} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
      <LanyardHost />
    </section>
  );
}
