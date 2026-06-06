import Breadcrumb from "@/components/Breadcrumb";

export default function AuthenticityPage() {
  return (
    <main className="fix">
      <Breadcrumb title="Authenticity" />
      <section className="eg-formula__area black-bg pt-120 pb-120">
        <div className="container">
          <div className="eg-formula__wrapper black-bg-2" style={{ background: "linear-gradient(135deg, #0a0a0a, #1a0000, #ff0000)" }}>
            <div className="row align-items-center">
              <div className="col-lg-7">
                <div className="eg-section">
                  <h2 className="eg-section__title title-white mb-30">Verify Before You Use</h2>
                </div>
                <p className="text-white">
                  Buy only from authorized InsaneGenix channels. Check seal integrity, batch details, and authenticity
                  codes before consumption.
                </p>
              </div>
              <div className="col-lg-5">
                <img src="/assets/img/product/Whey.png" alt="InsaneGenix authenticity" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
