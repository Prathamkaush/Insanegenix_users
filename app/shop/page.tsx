import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

type ShopPageProps = {
  searchParams?: Promise<{ categoryId?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = await searchParams;
  const products = await getProducts({ categoryId: resolvedSearchParams?.categoryId });

  return (
    <main className="fix">
      <Breadcrumb title="Shop Now" />
      <section className="product-area pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-4">
              <div className="eg-product__sidebar p-relative">
                <div className="eg-product__search d-block p-relative mb-30">
                  <form action="#">
                    <input type="text" placeholder="Keyword..." />
                  </form>
                </div>
                <div className="eg-product__categories">
                  <h3 className="eg-product__sidebar-title">Categories</h3>
                  <ul>
                    {["Protein", "Gainers", "Pre/Post Workout", "Nutrition", "Wellness"].map((item) => (
                      <li key={item}>
                        <a href="#"><span className="fa fa-arrow-right" />{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-8">
              <div className="eg-product__info-top">
                <div className="eg-product__showing-top">
                  <p className="eg-product__showing-text">Showing 1-{products.length} of {products.length} Results</p>
                </div>
                <div className="eg-product__showing-sort">
                  <select className="eg-product__filter shop-filter" defaultValue="popular">
                    <option value="popular">Sort by popular</option>
                    <option value="newest">Sort by newest</option>
                    <option value="price">Sort by price</option>
                  </select>
                </div>
              </div>
              <div className="row ig-product-grid">
                {products.map((product) => (
                  <div key={product.id} className="col-xl-4 col-md-6">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
