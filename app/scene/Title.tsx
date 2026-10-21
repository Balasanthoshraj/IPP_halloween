/* eslint-disable @next/next/no-img-element -- two small pre-sized logos in public/art */
// The one DOM layer: the final title. Stage moves it with the same camera as the canvas and fades the lines in
// (--t1: IST logo, --t2: "presents", --t3: the i++26 lockup of emblem, name and tagline).
export default function Title() {
  return (
    <div className="layer" data-layer="title">
      <h1 className="ttl">
        <span className="t t1"><span><img src="/art/logoIst.webp" width={468} height={560} alt="ISTA" /></span></span>
        <span className="t t2"><span>presents</span></span>
        <span className="t t3"><span><img src="/art/logoLockup.webp" width={560} height={641} alt="i++26: iterate to infinity" /></span></span>
      </h1>
    </div>
  );
}
