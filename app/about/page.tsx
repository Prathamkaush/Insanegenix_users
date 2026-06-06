import Breadcrumb from "@/components/Breadcrumb";

export default function AboutPage() {
  return (
    <main className="fix">
      <Breadcrumb title="About Us" />
      <section className="eg-about-2__area pt-120 pb-120 black-bg">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-30">
              <div className="eg-about-2__thumb">
                <img src="/assets/img/about/about-01.png" alt="InsaneGenix" />
              </div>
            </div>
            <div className="col-lg-6 mb-30">
              <div className="eg-section mb-30">
                <h2 className="eg-section__title title-white">Built For Serious Performance</h2>
              </div>
              <p className="text-white text-justify">
                InsaneGenix exists for athletes, lifters, and everyday performers who want reliable supplements with
                strong formulation, quality checks, and transparent product information.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
