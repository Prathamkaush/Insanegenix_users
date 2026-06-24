import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import ProductReviewSection from "@/components/ProductReviewSection";
import ProductVariantPurchase from "@/components/ProductVariantPurchase";
import {
  Product,
  ProductVariant,
  getProduct,
  getProducts,
  productImage,
  productVideo,
} from "@/lib/products";

type ProductDetailParams = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailParams) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([getProduct(slug), getProducts()]);

  if (!product) notFound();

  const images = productImages(product);
  const video = productVideo(product);
  const defaultVariant = product.variants?.find((variant) => variant.isDefault) || product.variants?.[0];
  const inStock = Number(defaultVariant?.stock ?? product.stock ?? 0) > 0;
  const category = product.category?.name || product.type?.name || "Sports Nutrition";
  const relatedProducts = allProducts.filter((item) => item.slug !== product.slug).slice(0, 4);
  const benefits = normalizeList(product.keyBenefits);
  const certifications = normalizeList(product.certifications);
  const specItems = productSpecs(product, defaultVariant);
  const averageRating = Number(product.averageRating || 0);
  const reviewCount = Number(product.reviewCount || 0);

  return (
    <main className="fix ig-product-detail-page">
      <Breadcrumb title={product.title} />

      <section className="eg-product-single__area pb-120">
        <div className="container mt-50">
          <div className="row align-items-start">
            <div className="col-lg-6">
              <ProductGallery images={images} video={video} title={product.title} />
            </div>

            <div className="col-lg-6">
              <div className="eg-product-details__wrapper ig-product-summary">
                <div className="eg-product-details__content">
                  <div className="ig-product-kicker">{product.brandName || "InsaneGenix"}</div>
                  <h1 className="eg-product-details__title">{product.title}</h1>

                  <div className="eg-product-details__stock d-flex align-items-center mt-20 mb-20">
                    <button className="stock mr-15">{inStock ? "in stock" : "out of stock"}</button>
                    <div className="eg-product-details__rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          <img
                            src="/assets/img/icon/rating-star.svg"
                            alt="rating-star"
                            style={{ opacity: star <= Math.round(averageRating) ? 1 : 0.28 }}
                          />
                        </span>
                      ))}
                      <span className="eg-product-details__rating-count ml-5">
                        ({reviewCount ? `${averageRating.toFixed(1)} / ${reviewCount}` : "No ratings"})
                      </span>
                    </div>
                  </div>

                  <p>{product.shortDescription || product.description || "Premium InsaneGenix performance supplement."}</p>

                </div>

                <div className="ig-product-highlights">
                  <InfoPill label="Goal" value={product.goal || category} />
                  <InfoPill label="Serving" value={product.servingSize || defaultVariant?.netQuantity || "-"} />
                  <InfoPill label="Shipping" value={product.freeShipping ? "Free" : product.estimatedShipping || "Standard"} />
                </div>

                <ProductVariantPurchase product={product} defaultVariantId={defaultVariant?.id} />

                <div className="eg-product-details__bottom mb-30">
                  <DetailLine label="SKU" value={defaultVariant?.sku || product.slug.toUpperCase()} />
                  <DetailLine label="Category" value={<Link href="/shop">{category}</Link>} />
                  <DetailLine label="Type" value={product.proteinType || product.productLine || "Performance Supplement"} />
                  {product.fssaiLicense ? <DetailLine label="FSSAI" value={product.fssaiLicense} /> : null}
                </div>

                <div className="eg-product-details__socials d-flex align-items-center">
                  <h4 className="eg-product-details__socials-title">Share with friends</h4>
                  <a href="https://twitter.com/" aria-label="Share on Twitter"><i className="fab fa-twitter" /></a>
                  <a href="https://facebook.com/" aria-label="Share on Facebook"><i className="fab fa-facebook" /></a>
                  <a href="https://instagram.com/" aria-label="Share on Instagram"><i className="fab fa-instagram" /></a>
                </div>
              </div>
            </div>
          </div>

          <div className="eg-review__wrap mt-50">
            <div className="eg-review__wrapper ig-product-info">
              <div className="row">
                <div className="col-lg-7 mb-30">
                  <InfoSection title="Description">
                    <p>{product.description || product.shortDescription || "Built for serious training, clean recovery, and daily consistency."}</p>
                    {benefits.length ? (
                      <ul className="ig-check-list">
                        {benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
                      </ul>
                    ) : null}
                  </InfoSection>
                </div>
                <div className="col-lg-5 mb-30">
                  <InfoSection title="Supplement Facts">
                    <div className="ig-nutrition-grid">
                      {specItems.map((item) => <Nutrition key={item.label} label={item.label} value={item.value} />)}
                    </div>
                  </InfoSection>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4 mb-30">
                  <InfoSection title="How to Use">
                    <p>{product.howToUse || "Use as directed on the product label or as recommended by your nutrition professional."}</p>
                    {product.whenToUse ? <p className="mt-15">{product.whenToUse}</p> : null}
                  </InfoSection>
                </div>
                <div className="col-lg-4 mb-30">
                  <InfoSection title="Ingredients & Safety">
                    <p>{product.ingredients || "See product label for the complete ingredient profile."}</p>
                    {product.allergenInfo ? <p className="mt-15">{product.allergenInfo}</p> : null}
                    {product.safetyInformation ? <p className="mt-15">{product.safetyInformation}</p> : null}
                  </InfoSection>
                </div>
                <div className="col-lg-4 mb-30">
                  <InfoSection title="Authenticity">
                    <p>{product.authenticityNote || "Buy only from InsaneGenix authorized channels and verify packaging before use."}</p>
                    {certifications.length ? (
                      <div className="ig-cert-list">
                        {certifications.map((certification) => <span key={certification}>{certification}</span>)}
                      </div>
                    ) : null}
                    <div className="ig-origin-list mt-20">
                      {product.countryOfOrigin ? <DetailLine label="Origin" value={product.countryOfOrigin} /> : null}
                      {product.manufacturedBy ? <DetailLine label="MFG" value={product.manufacturedBy} /> : null}
                      {product.marketedBy ? <DetailLine label="Marketed By" value={product.marketedBy} /> : null}
                    </div>
                  </InfoSection>
                </div>
              </div>

              <ProductReviewSection
                productId={product.id}
                initialAverage={averageRating}
                initialTotal={reviewCount}
              />
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="product__area eg-product__bg fix">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="eg-section text-center">
                  <h2 className="eg-section__title mb-60">Similar Products</h2>
                </div>
              </div>
            </div>
            <div className="row ig-product-grid">
              {relatedProducts.map((item) => (
                <div className="col-xl-3 col-md-6" key={item.id}>
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function productImages(product: Product) {
  const keys: Array<"img1" | "img2" | "img3" | "img4" | "img5" | "img6"> = [
    "img1",
    "img2",
    "img3",
    "img4",
    "img5",
    "img6",
  ];
  const images = keys
    .filter((key) => product[key])
    .map((key) => productImage(product, key));

  return Array.from(new Set(images.length ? images : [productImage(product)]));
}

function normalizeList(value?: string[] | null) {
  if (!Array.isArray(value)) return [];
  return value.filter(Boolean);
}

function productSpecs(product: Product, variant?: ProductVariant) {
  const specs = [
    { label: "Serving Size", value: product.servingSize || variant?.netQuantity || "-" },
    { label: "Servings", value: product.servingsPerContainer || variant?.servings || "-" },
    { label: "Protein", value: product.proteinPerServing ? `${product.proteinPerServing}g` : "-" },
    { label: "Calories", value: product.caloriesPerServing || "-" },
    { label: "BCAA", value: product.bcaaPerServing ? `${product.bcaaPerServing}g` : "-" },
    { label: "EAA", value: product.eaaPerServing ? `${product.eaaPerServing}g` : "-" },
  ];

  const backendFacts = product.nutritionFacts?.map((fact) => ({
    label: fact.name,
    value: `${fact.amount}${fact.unit || ""}${fact.per ? ` / ${fact.per}` : ""}`,
  })) || [];

  return [...specs, ...backendFacts].filter((item, index, list) => (
    item.value !== "-" || index < 4 || !list.some((other, otherIndex) => otherIndex < index && other.label === item.label)
  ));
}

function InfoPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="ig-info-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="eg-product-details__sku">
      <b>{label} :</b><span>{value}</span>
    </div>
  );
}

function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="ig-product-info-card">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function Nutrition({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="ig-nutrition-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
