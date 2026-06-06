import Link from "next/link";
import Script from "next/script";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { getLatestReviews } from "@/lib/reviews";

export default async function HomePage() {
  const [products, latestReviews] = await Promise.all([getProducts(), getLatestReviews(4)]);
  const testimonialRating = (index: number) => Number(latestReviews[index]?.rating || 5);

  return (
    <main className="fix bg-black">

      {/* ── MAIN SLIDER ── */}
      <div className="main-slider swiper myMainSlider">
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <picture>
              <source srcSet="/assets/img/slider/slider-m-1.png" media="(max-width: 768px)" />
              <img src="/assets/img/slider/slider-1.png" alt="InsaneGenix performance supplements hero" />
            </picture>
          </div>
          <div className="swiper-slide">
            <picture>
              <source srcSet="/assets/img/slider/slider-m-1.png" media="(max-width: 768px)" />
              <img src="/assets/img/slider/slider-2.png" alt="InsaneGenix training nutrition hero" />
            </picture>
          </div>
        </div>
        <div className="swiper-pagination"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>

      {/* ── FEATURE / OUR STORY ── */}
      <section
        className="features-area eg-feature-2 scene"
        style={{ background: "linear-gradient(270deg, rgb(0 0 0), rgb(255 0 0 / 67%))" }}
      >
        <div
          className="eg-feature-2__bg"
          data-background="/assets/img/feature/feature-2-bg-1.jpg"
          style={{ backgroundImage: "url('/assets/img/feature/feature-2-bg-1.jpg')" }}
        ></div>
        <div className="container">
          <div className="row">
            <div className="offset-lg-6 col-lg-6">
              <div className="eg-feature-2__content">
                <div className="eg-section">
                  <h2 className="eg-section__title title-white mb-40">
                    Our <br />
                    <span className="about-text"> Story</span>
                  </h2>
                  <p className="text-white text-justify">
                    Welcome to InsaneGenix, a brand dedicated to empowering individuals on their fitness journey
                    through high-quality nutritional supplements and performance products. Our mission is simple:
                    to help athletes, fitness enthusiasts, and everyday individuals achieve their health and strength
                    goals with reliable and effective supplements. At InsaneGenix, we understand that fitness is more
                    than just working out in the gym. It is a lifestyle that requires dedication, discipline, and the
                    right nutrition. That is why we focus on providing premium supplements that support muscle growth,
                    recovery, endurance, and overall wellness.
                  </p>
                </div>
                <div className="eg-feature-2__list">
                  <div className="row">
                    <div className="col-lg-6 col-sm-6">
                      <ul className="eg-feature-2__list_wrap">
                        <li><span><i className="fas fa-flask"></i></span> Premium Ingredients</li>
                        <li><span><i className="fas fa-dumbbell"></i></span> Strength Support</li>
                        <li><span><i className="fas fa-heartbeat"></i></span> Recovery Focus</li>
                      </ul>
                    </div>
                    <div className="col-lg-6 col-sm-6">
                      <ul className="eg-feature-2__list_wrap">
                        <li><span><i className="fas fa-shield-alt"></i></span> Quality Checked</li>
                        <li><span><i className="fas fa-seedling"></i></span> Daily Wellness</li>
                        <li><span><i className="fas fa-bolt"></i></span> Peak Performance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="eg-feature-2__shape-1">
          <img src="/assets/img/feature/feature-2-shape-03.png" alt="shape" />
        </div>
        <div className="eg-feature-2__shape-2">
          <img className="layer" data-depth="0.3" src="/assets/img/feature/feature-2-shape-02.png" alt="shape" />
        </div>
        <div className="eg-feature-2__shape-3 scene-y">
          <img className="layer" data-depth="3" src="/assets/img/feature/feature-2-shape-04.png" alt="" />
        </div>
        <div className="eg-feature-2__shape-4">
          <img className="layer" data-depth="0.3" src="/assets/img/feature/feature-2-shape-05.png" alt="" />
        </div>
      </section>

      {/* ── COUNTER ── */}
      <section className="counter-area eg-counter p-relative scene">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="eg-section">
                <h2 className="eg-section__title title-white text-center mb-70">
                  Targeted Nutrition for Your Well-Being
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="eg-counter__wrap">
                <div className="eg-counter__black eg-counter__black-1">
                  <img src="/assets/img/counter/counter-thumb-1.png" alt="counter" />
                  <div className="eg-counter__content text-center">
                    <h2 className="count">
                      <span className="odometer" data-count="1123">1123</span>
                    </h2>
                    <p>Happy Customer</p>
                  </div>
                </div>
                <div className="eg-counter__black eg-counter__black-2">
                  <img src="/assets/img/counter/counter-thumb-2.png" alt="counter" />
                  <div className="eg-counter__content text-center">
                    <h2 className="count">
                      <span className="odometer" data-count="1278">1278</span>
                    </h2>
                    <p>Package Delivered</p>
                  </div>
                </div>
                <div className="eg-counter__black eg-counter__black-3">
                  <img src="/assets/img/counter/counter-thumb-3.png" alt="counter" />
                  <div className="eg-counter__content text-center">
                    <h2 className="count">
                      <span className="odometer" data-count="10">10</span>
                    </h2>
                    <p>Year Experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="eg-counter__shape-1">
          <img className="layer" data-depth="0.3" src="/assets/img/counter/counter-shape-1.png" alt="shape" />
        </div>
      </section>

      {/* ── LATEST PRODUCTS ── */}
      <section className="product-area-2">
        <div className="eg-product-2">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="eg-section mb-75">
                  <h2 className="eg-section__title title-white">Latest Products</h2>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="eg-product-2__arrow d-flex justify-content-end mb-30">
                  <div className="eg-product-2__prev">
                    <span>
                      <svg width="39" height="16" viewBox="0 0 39 16" fill="current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.292893 8.70711C-0.0976311 8.31659 -0.0976311 7.68342 0.292893 7.2929L6.65685 0.928936C7.04738 0.538411 7.68054 0.538411 8.07107 0.928936C8.46159 1.31946 8.46159 1.95262 8.07107 2.34315L2.41421 8L8.07107 13.6569C8.46159 14.0474 8.46159 14.6805 8.07107 15.0711C7.68054 15.4616 7.04738 15.4616 6.65685 15.0711L0.292893 8.70711ZM39 9L1 9L1 7L39 7L39 9Z" fill="current" />
                      </svg>
                    </span>
                  </div>
                  <div className="eg-product-2__next">
                    <span>
                      <svg width="39" height="16" viewBox="0 0 39 16" fill="#000" xmlns="http://www.w3.org/2000/svg">
                        <path d="M38.7071 8.70711C39.0976 8.31659 39.0976 7.68342 38.7071 7.2929L32.3431 0.928935C31.9526 0.538411 31.3195 0.538411 30.9289 0.928935C30.5384 1.31946 30.5384 1.95263 30.9289 2.34315L36.5858 8L30.9289 13.6569C30.5384 14.0474 30.5384 14.6805 30.9289 15.0711C31.3195 15.4616 31.9526 15.4616 32.3431 15.0711L38.7071 8.70711ZM1.15027e-08 9L38 9L38 7L-1.15033e-08 7L1.15027e-08 9Z" fill="current" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper eg-product-2__active">
            <div className="swiper-wrapper">
              {products.slice(0, 8).map((product) => (
                <div key={product.id} className="swiper-slide ig-home-product-slide">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VIDEO AREA ── */}
      <div className="eg-video__area">
        <div
          className="eg-video__bg"
          data-background="/assets/img/others/video-area-bg.png"
          style={{ backgroundImage: "url('/assets/img/others/video-area-bg.png')" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="eg-video__btn">
                  <a href="#" className="eg-video__popup popup-video eg-video__ripple" aria-label="Play InsaneGenix video">
                    <i className="fas fa-play"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── WHY CHOOSE INSANEGENIX ── */}
      <section className="eg-formula__area black-bg scene">
        <div className="eg-formula p-relative">
          <div className="container">
            <div
              className="eg-formula__wrapper black-bg-2"
              style={{ background: "linear-gradient(135deg, #0a0a0a, #1a0000, #ff0000)" }}
            >
              <div className="row justify-content-center align-items-center">
                <div className="col-lg-6 col-sm-12 mb-30">
                  <div className="eg-formula-content">
                    <div className="eg-section">
                      <h2 className="eg-section__title title-white mb-40">Why Choose InsaneGenix</h2>
                    </div>
                    <p className="text-white text-justify">
                      At InsaneGenix, we are committed to providing high-quality fitness supplements designed to
                      support strength, performance, and overall health. Our products are carefully formulated to
                      help athletes and fitness enthusiasts achieve their goals faster and more effectively. We
                      focus on quality, safety, and customer satisfaction. Every product is created with premium
                      ingredients and strict quality standards to ensure reliable results. Whether you are looking
                      to build muscle, improve recovery, or boost workout performance, InsaneGenix offers
                      supplements you can trust.
                    </p>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-12">
                  <div className="eg-formula__thumb">
                    <img src="/assets/img/formula/formula-thumb.png" alt="InsaneGenix supplement formula" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="eg-formula__shape">
            <img className="layer" data-depth="0.3" src="/assets/img/formula/formula-shape-02.png" alt="formula-shape" />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="eg-testimonial-2__area pt-135 scene">
        <div className="eg-testimonial p-relative">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="eg-section mb-65">
                  <h2 className="eg-section__title title-white">What Our Fitness Community Says</h2>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="eg-product-2__arrow d-flex justify-content-end mb-30">
                  <div className="eg-product-2__prev eg-testimonial-2__prev">
                    <span>
                      <svg width="39" height="16" viewBox="0 0 39 16" fill="current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.292893 8.70711C-0.0976311 8.31659 -0.0976311 7.68342 0.292893 7.2929L6.65685 0.928936C7.04738 0.538411 7.68054 0.538411 8.07107 0.928936C8.46159 1.31946 8.46159 1.95262 8.07107 2.34315L2.41421 8L8.07107 13.6569C8.46159 14.0474 8.46159 14.6805 8.07107 15.0711C7.68054 15.4616 7.04738 15.4616 6.65685 15.0711L0.292893 8.70711ZM39 9L1 9L1 7L39 7L39 9Z" fill="current" />
                      </svg>
                    </span>
                  </div>
                  <div className="eg-product-2__next eg-testimonial-2__next">
                    <span>
                      <svg width="39" height="16" viewBox="0 0 39 16" fill="#000" xmlns="http://www.w3.org/2000/svg">
                        <path d="M38.7071 8.70711C39.0976 8.31659 39.0976 7.68342 38.7071 7.2929L32.3431 0.928935C31.9526 0.538411 31.3195 0.538411 30.9289 0.928935C30.5384 1.31946 30.5384 1.95263 30.9289 2.34315L36.5858 8L30.9289 13.6569C30.5384 14.0474 30.5384 14.6805 30.9289 15.0711C31.3195 15.4616 31.9526 15.4616 32.3431 15.0711L38.7071 8.70711ZM1.15027e-08 9L38 9L38 7L-1.15033e-08 7L1.15027e-08 9Z" fill="current" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper eg-testimonial-2__active">
            <div className="swiper-wrapper">

              {/* Testimonial 1 */}
              <div className="swiper-slide eg-testimonial-2__item">
                <div className="eg-testimonial-2__wrap">
                  <div className="eg-testimonial-2__content mb-60">
                    <div className="eg-testimonial-2__rating pb-60">
                      {renderRatingStars(testimonialRating(0))}
                    </div>
                    <p>
                      "I have been using the ultra-pure <span>ISO Protein Supplement</span> for several months now,
                      and I am thrilled with the results. Not only has it boosted my muscle recovery levels, but it
                      has also improved my overall lean muscle growth. I feel more energized, strong, and active."
                    </p>
                  </div>
                  <div className="row">
                    <div className="col-lg-9 col-9">
                      <div className="eg-testimonial-2__avatar d-flex">
                        <div className="eg-testimonial-2__avatar-img">
                          <img src="/assets/img/testimonial/testimonial-2-avatar-01.png" alt="Aarav Sharma" />
                        </div>
                        <div className="eg-testimonial-2__avatar-text">
                          <h5 className="title">Aarav Sharma</h5>
                          <p>Delhi, Fitness Athlete</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-3">
                      <div className="eg-testimonial-2__quote">
                        <span><i className="fas fa-quote-right"></i></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="swiper-slide eg-testimonial-2__item">
                <div className="eg-testimonial-2__wrap">
                  <div className="eg-testimonial-2__content mb-60">
                    <div className="eg-testimonial-2__rating pb-60">
                      {renderRatingStars(testimonialRating(1))}
                    </div>
                    <p>
                      "After incorporating the advanced <span>Creatine and EAA Blend</span> into my routine, I have
                      experienced a significant improvement in my workout stamina. I used to suffer from mid-set
                      fatigue and muscle soreness, especially after heavy lifting. Since taking this, my strength is
                      next level."
                    </p>
                  </div>
                  <div className="row">
                    <div className="col-lg-9 col-9">
                      <div className="eg-testimonial-2__avatar d-flex">
                        <div className="eg-testimonial-2__avatar-img">
                          <img src="/assets/img/testimonial/testimonial-2-avatar-02.png" alt="Rohan Malhotra" />
                        </div>
                        <div className="eg-testimonial-2__avatar-text">
                          <h5 className="title">Rohan Malhotra</h5>
                          <p>Mumbai, Gym Trainer</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-3">
                      <div className="eg-testimonial-2__quote">
                        <span><i className="fas fa-quote-right"></i></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="swiper-slide eg-testimonial-2__item">
                <div className="eg-testimonial-2__wrap">
                  <div className="eg-testimonial-2__content mb-60">
                    <div className="eg-testimonial-2__rating pb-60">
                      {renderRatingStars(testimonialRating(2))}
                    </div>
                    <p>
                      "The high-calorie <span>Mass Gainer Formula</span> has been a lifesaver for me. I have
                      struggled with gaining clean size for years, and this premium product has provided me with
                      the proper macronutrients I've been longing for. It helps me bulk up faster and looks solid."
                    </p>
                  </div>
                  <div className="row">
                    <div className="col-lg-9 col-9">
                      <div className="eg-testimonial-2__avatar d-flex">
                        <div className="eg-testimonial-2__avatar-img">
                          <img src="/assets/img/testimonial/testimonial-2-avatar-03.png" alt="Kabir Mehta" />
                        </div>
                        <div className="eg-testimonial-2__avatar-text">
                          <h5 className="title">Kabir Mehta</h5>
                          <p>Bangalore, Powerlifter</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-3">
                      <div className="eg-testimonial-2__quote">
                        <span><i className="fas fa-quote-right"></i></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 4 */}
              <div className="swiper-slide eg-testimonial-2__item">
                <div className="eg-testimonial-2__wrap">
                  <div className="eg-testimonial-2__content mb-60">
                    <div className="eg-testimonial-2__rating pb-60">
                      {renderRatingStars(testimonialRating(3))}
                    </div>
                    <p>
                      "I've struggled with laser focus during morning workouts, but since incorporating the{" "}
                      <span>Dart Energy Formula</span> into my daily routine, I've experienced a significant
                      reduction in mid-workout crashes. This formula combines pure focus and heavy pump blends
                      perfectly."
                    </p>
                  </div>
                  <div className="row">
                    <div className="col-lg-9 col-9">
                      <div className="eg-testimonial-2__avatar d-flex">
                        <div className="eg-testimonial-2__avatar-img">
                          <img src="/assets/img/testimonial/testimonial-2-avatar-04.png" alt="Ananya Verma" />
                        </div>
                        <div className="eg-testimonial-2__avatar-text">
                          <h5 className="title">Ananya Verma</h5>
                          <p>Chandigarh, Fitness Enthusiast</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-3">
                      <div className="eg-testimonial-2__quote">
                        <span><i className="fas fa-quote-right"></i></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div className="eg-testimonial-2__shape scene-y">
            <img className="layer" data-depth="3" src="/assets/img/testimonial/testimonial-2-shape-01.png" alt="shape" />
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM / BLOG AREA ── */}
      <section className="eg-blog-2__area black-bg-2 pt-135 pb-120">
        <div className="eg-blog-2">
          <div className="container">
            <div className="row">
              <div className="col-xl-12 col-lg-7 mb-30">
                <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
                <div className="elfsight-app-7a3e1fea-fff4-4da8-8343-34962e293f3b" data-elfsight-app-lazy></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="eg-brand-2__area black-bg pt-80 pb-80 scene ig-home-brand">
        <div className="eg-brand-2 p-relative z-index-1">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="eg-section mb-70">
                  <h6 className="eg-section__title title-white text-center">Perfect Brand is Featured on</h6>
                </div>
              </div>
            </div>
            <div className="row swiper eg-brand-2__active">
              <div className="swiper-wrapper">
                {[1, 2, 3, 4, 5, 6].map((brand) => (
                  <div className="swiper-slide col-lg-2" key={brand}>
                    <div className="eg-brand-2__item">
                      <a href="#" aria-label={`Featured brand ${brand}`}>
                        <img src="/assets/img/brnad/brand-2-01.png" alt="useberry" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="eg-footer-2__shape-2 scene-y">
            <img className="layer" data-depth="3" src="/assets/img/shape/footer-2-shape-02.png" alt="shape" />
          </div>
          <div className="eg-footer-2__shape-3 scene-y">
            <img className="layer" data-depth="3" src="/assets/img/shape/footer-2-shape-03.png" alt="shape" />
          </div>
        </div>
      </section>

    </main>
  );
}

function renderRatingStars(rating: number) {
  const roundedRating = Math.round(Number(rating || 0));

  return [1, 2, 3, 4, 5].map((star) => (
    <span key={star} style={{ opacity: star <= roundedRating ? 1 : 0.28 }}>
      <img src="/assets/img/testimonial/testimonial-2-rating.svg" alt="rating" />
    </span>
  ));
}
