/* eslint-disable @next/next/no-img-element -- small pre-trimmed pictures in public/art/sponsors */
import { CARD_SIZE, SPONSORS } from "./data";
import LanyardHost from "./LanyardHost";
import "./sponsors.css";

// The sponsors page's content: four lanyards hang from this section's top edge (board.ts draws them). The list is what
// screen readers get, and what everyone sees if WebGL is unavailable. A phone gets no lanyards at all: the cards below, one to
// a row (sponsors.css shows one or the other).
export default function Sponsors() {
  return (
    <section className="sp" aria-labelledby="sponsors-title">
      <h1 id="sponsors-title" className="sr-only sp-title">
        Sponsors
      </h1>
      <ul className="sp-list sr-only">
        {SPONSORS.map(({ role, name, logo }) => (
          <li key={name}>
            <span>{role}</span>
            <img src={logo} alt={name} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
      <ul className="sp-cards">
        {SPONSORS.map(({ role, name, card }) => (
          <li className="sp-card" key={name}>
            <img src={card} alt={`${role}: ${name}`} {...CARD_SIZE} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
      <LanyardHost />
    </section>
  );
}
