/* eslint-disable @next/next/no-img-element -- one small pre-blurred background in public/art/about */
import Transition from "./Transition";

// A page that is not built yet: the castle, out of focus, with its name.
export default function Room({ title }: { title: string }) {
  return (
    <Transition>
      <main className="room">
        <img className="room-bg" src="/art/about/scene-dim.webp" alt="" />
        <h1>{title}</h1>
        <p>Coming soon</p>
      </main>
    </Transition>
  );
}
