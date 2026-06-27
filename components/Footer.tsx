import Link from "next/link";
import { defaultStorefrontSettings, phoneHref, type StorefrontSettings } from "@/lib/settings";
import { INSTAGRAM_URL } from "@/lib/social-links";

const productLinks = ["Creatine", "Dart", "EAA", "ISO", "Mass Gainer"];

const policyLinks = [
  ["Privacy Policy", "/privacy-policy"],
  ["Payment Option", "/payment-option"],
  ["Terms & Conditions", "/terms-and-conditions"],
  ["Shipping & Delivery", "/shipping-and-delivery"],
  ["Cancellation & Refund", "/cancellation-and-refund"],
];

const pageLinks = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Our Products", "/shop"],
  ["Contact Us", "/contact"],
];

const paymentBrands = [
  { label: "PayPal", className: "is-paypal" },
  { label: "VISA", className: "is-visa" },
  { label: "Mastercard", className: "is-mastercard" },
  { label: "stripe", className: "is-stripe" },
];

export default function Footer({
  settings = defaultStorefrontSettings,
}: {
  settings?: StorefrontSettings;
}) {
  return (
    <footer className="eg-footer-2__area black-bg scene">
      <div className="eg-footer-2 p-relative z-index-1">
        <div className="container">
          <div className="eg-footer-2__widget-wrapper">
            <div className="row ig-footer-widget-grid">
              <div className="ig-footer-widget-grid__item ig-footer-widget-grid__about mb-40">
                <div className="eg-footer-2__widget widget-1">
                  <div className="eg-footer-2__about">
                    <div className="eg-footer-2__logo logo mb-20">
                      <Link href="/">
                        <img src="/assets/img/logo/footer-logo.png" alt="InsaneGenix" />
                      </Link>
                    </div>
                    <p>
                      Insanegenix engineers high-performance gym gear, empowering fitness enthusiasts to crush limits
                      with ultimate strength and comfort.
                    </p>
                    <div className="eg-footer-2__social mt-30">
                      <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                      <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                      <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ig-footer-widget-grid__item mb-40">
                <div className="eg-footer-2__widget widget-2">
                  <h4 className="fw-title">Products</h4>
                  <ul>
                    {productLinks.map((label) => (
                      <li key={label}><Link href="/shop">{label}</Link></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="ig-footer-widget-grid__item mb-40">
                <div className="eg-footer-2__widget widget-3">
                  <h4 className="fw-title">Policy Info</h4>
                  <ul>
                    {policyLinks.map(([label, href]) => (
                      <li key={label}><Link href={href}>{label}</Link></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="ig-footer-widget-grid__item mb-40">
                <div className="eg-footer-2__widget widget-4">
                  <h4 className="fw-title">Page Links</h4>
                  <ul>
                    {pageLinks.map(([label, href]) => (
                      <li key={label}><Link href={href}>{label}</Link></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="ig-footer-widget-grid__item ig-footer-widget-grid__help mb-40">
                <div>
                  <div className="eg-footer-2__widget widget-5">
                    <h4 className="fw-title">Need Help?</h4>
                    <div className="eg-footer-2__contact">
                      <ul>
                        <li className="phone">
                          <span className="icon"><i className="fal fa-phone-alt"></i></span>
                          <a href={phoneHref(settings.supportPhone)}>{settings.supportPhone}</a>
                        </li>
                        <li className="mail">
                          <span className="icon"><i className="fal fa-envelope"></i></span>
                          <a href={`mailto:${settings.supportEmail}`}>{settings.supportEmail}</a>
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
                <div className="ig-footer-payments" aria-label="Payment options">
                  {paymentBrands.map(({ label, className }) => (
                    <span key={label} className={`ig-footer-payments__brand ${className}`} aria-label={label}>
                      {className === "is-mastercard" ? (
                        <span className="ig-footer-payments__mastercard-mark" aria-hidden="true">
                          <span />
                          <span />
                        </span>
                      ) : (
                        <span>{label}</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </footer>
  );
}
