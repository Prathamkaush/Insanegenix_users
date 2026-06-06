import Link from "next/link";

const productLinks = ["Creatine", "Dart", "EAA", "ISO", "Mass Gainer"];

const policyLinks = [
  "Privacy Policy",
  "Payment Option",
  "Terms & Conditions",
  "Shipping & Delivery",
  "Cancellation & Refund",
];

const pageLinks = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Our Products", "/shop"],
  ["Contact Us", "/contact"],
];

export default function Footer() {
  return (
    <footer className="eg-footer-2__area black-bg scene">
      <div className="eg-footer-2 p-relative z-index-1">
        <div className="container">
          <div className="eg-footer-2__widget-wrapper">
            <div className="row">
              <div className="col-xl-3 col-md-4 col-sm-6 mb-40">
                <div className="eg-footer-2__widget widget-1">
                  <div className="eg-footer-2__about">
                    <div className="eg-footer-2__logo logo mb-20">
                      <Link href="/">
                        <img src="/assets/img/logo/footer-logo.png" alt="InsaneGenix" />
                      </Link>
                    </div>
                    <p className="text-justify">
                      Insanegenix engineers high-performance gym gear, empowering fitness enthusiasts to crush limits
                      with ultimate strength and comfort.
                    </p>
                    <div className="eg-footer-2__social mt-30">
                      <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                      <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                      <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                      <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-2 col-md-4 col-sm-6 mb-40">
                <div className="eg-footer-2__widget widget-2">
                  <h4 className="fw-title">Products</h4>
                  <ul>
                    {productLinks.map((label) => (
                      <li key={label}><Link href="/shop">{label}</Link></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-xl-3 col-md-4 col-sm-6 mb-40">
                <div className="eg-footer-2__widget widget-3">
                  <h4 className="fw-title">Policy Info</h4>
                  <ul>
                    {policyLinks.map((label) => (
                      <li key={label}><Link href="/">{label}</Link></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-xl-2 col-md-4 col-sm-6 mb-40">
                <div className="eg-footer-2__widget widget-4">
                  <h4 className="fw-title">Page Links</h4>
                  <ul>
                    {pageLinks.map(([label, href]) => (
                      <li key={label}><Link href={href}>{label}</Link></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-xl-2 col-md-4 col-sm-6 mb-40">
                <div className="d-lg-flex justify-content-xl-end">
                  <div className="eg-footer-2__widget widget-5">
                    <h4 className="fw-title">Need Help?</h4>
                    <div className="eg-footer-2__contact">
                      <ul>
                        <li className="phone">
                          <span className="icon"><i className="fal fa-phone-alt"></i></span>
                          <a href="tel:0203701425">020 370 1425</a>
                        </li>
                        <li className="mail">
                          <span className="icon"><i className="fal fa-envelope"></i></span>
                          <a href="mailto:info@insanegenix.com">info@insanegenix.com</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="eg-footer-2__copyright mt-40">
            <div className="row align-items-center">
              <div className="col-md-7 mb-40">
                <div className="eg-footer-2__copyright-text">
                  <p>Copyright © 2026 <Link href="/">Insane Genix</Link> All Rights Reserved.</p>
                </div>
              </div>
              <div className="col-md-5 mb-40">
                <div className="eg-footer-2__shape-1 text-center text-md-end">
                  <img src="/assets/img/icon/payment-option.png" alt="Payment options" />
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </footer>
  );
}
