import Breadcrumb from "@/components/Breadcrumb";

export default function AboutPage() {
  const aboutParagraphs = [];

   return (
    <main className="fix ig-about-page">
      <Breadcrumb title="About Us" />

      <section className="eg-about-2__area pt-120 pb-120 black-bg">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-30">
              <div className="eg-about-2__thumb">
                <img
                  src="/assets/img/about/about-01.png"
                  alt="InsaneGenix"
                />
              </div>
            </div>

            <div className="col-lg-6 mb-30">
              <div className="eg-section mb-30">
                <h2 className="eg-section__title title-white">
                  Built For Serious Performance
                </h2>
              </div>

              <div className="ig-about-page__copy">
                {/* {aboutParagraphs.map((paragraph) => 
                ( <p key={paragraph} className="text-white text-justify">
                  {paragraph} </p> ))} */}
               
                <p className="text-justify">
                  At InsaneGenix, we are more than a sports nutrition brand—we
                  are a movement driven by the pursuit of excellence. Built on
                  the foundation of innovation, quality, and performance,
                  InsaneGenix is dedicated to empowering individuals who refuse
                  to settle for average and strive to become the best version of
                  themselves.
                </p>

                <p className="text-justify">
                  In today's fast-paced world, achieving peak physical
                  performance requires more than hard work alone. It demands the
                  right nutrition, scientifically developed formulations, and
                  products you can trust. That's why every InsaneGenix
                  supplement is crafted with carefully selected ingredients,
                  advanced research, and rigorous quality standards to deliver
                  exceptional results without compromise.
                </p>

                <p className="text-justify">
                  We understand that every fitness journey is unique. Whether
                  your goal is building lean muscle, improving endurance,
                  accelerating recovery, enhancing strength, or maintaining
                  overall wellness, our products are designed to support your
                  ambitions at every stage. From beginners taking their first
                  step into fitness to professional athletes pushing their
                  limits, InsaneGenix stands as a trusted partner in achieving
                  sustainable performance and long-term success.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <p className="text-justify">
                Our commitment extends beyond supplements. We aim to inspire a
                lifestyle built on discipline, determination, and continuous
                growth. By combining premium nutrition with a passion for
                fitness, we help individuals transform not only their bodies but
                also their confidence, mindset, and daily performance.
              </p>

              <p className="text-justify">
                At InsaneGenix, quality is never an option—it's our promise.
                Every product undergoes strict testing and quality assurance
                processes to ensure purity, effectiveness, and consistency. We
                believe that our customers deserve nothing less than excellence,
                and that belief drives everything we do.
              </p>

              <p className="text-justify">
                As we continue to grow, our vision remains clear: to become a
                globally trusted name in sports nutrition, recognized for
                delivering innovative products that fuel extraordinary results.
              </p>

              <p className="text-justify">
                <strong>
                  InsaneGenix isn't just a supplement brand—it's a commitment
                  to strength, resilience, and the relentless pursuit of
                  greatness.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

