import { PLATE, PLATE_CAPTION } from './common';

export function TitleSlide() {
  return (
    <div className="title-slide">
      <figure className="title-plate">
        <div className="plate">
          <img src={PLATE} alt="" />
        </div>
        <figcaption>{PLATE_CAPTION}</figcaption>
      </figure>
      <div className="title-text">
        <div className="eyebrow">A Symposium on</div>
        <h1>
          High
          <br />
          Performance
          <br />
          Computing
        </h1>
        <div className="rule-ornament">
          <span />◆<span />
        </div>
        <p className="subtitle">
          The Free Lunch, the Fire,
          <br />
          and the Gaming Card
          <br />
          That Ate the World
        </p>
        <div className="date">XXVIII · XI · MMXXVI</div>
      </div>
    </div>
  );
}
