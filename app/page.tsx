import Stage from "./Stage";
import Title from "./scene/Title";

// Not wrapped in <Transition>: this page is taller than the screen, and a view transition would capture all of it.
// The browser's root snapshot (just the screen) carries it instead; see ::view-transition-*(root) in globals.css.
export default function Home() {
  return (
    <main>
      <Stage>
        <Title />
      </Stage>
    </main>
  );
}
