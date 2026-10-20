/* eslint-disable @next/next/no-img-element -- three small pre-sized logos in public/art */
// The one DOM layer: the final title. Stage moves it with the same camera as the canvas and fades the lines in
// (--t1: badge, --t2: "presents", --t3: emblem, i++26 and tagline).
export default function Title() {
  return (
    <div className="layer" data-layer="title">
      <h1 className="ttl">
        <span className="t t1"><span><img src="/art/logoIsta.webp" width={480} height={534} alt="ISTA" /></span></span>
        <span className="t t2"><span>presents</span></span>
        <span className="t t3"><span><img src="/art/logoInf.webp" width={700} height={407} alt="" /></span></span>
        <span className="t t4"><span><img src="/art/logo26.webp" width={700} height={192} alt="i++26" /></span></span>
        <span className="t t5"><span>iterate to infinity</span></span>
      </h1>
    </div>
  );
}
