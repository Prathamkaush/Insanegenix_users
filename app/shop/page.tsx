import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import ShopPriceRange from "@/components/ShopPriceRange";
import {
  getProductCatalog,
  getProductCategories,
  ProductCatalogParams,
} from "@/lib/products";

type ShopSearchParams = ProductCatalogParams;

function shopHref(
  current: ShopSearchParams,
  updates: Record<string, string | number | undefined>,
) {
  const params = new URLSearchParams();
  Object.entries({ ...current, ...updates }).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && key !== "limit") {
      params.set(key, String(value));
    }
  });
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<ShopSearchParams>;
}) {
  const filters = { ...((await searchParams) || {}) };
  delete filters.dietaryType;
  const page = Number(filters.page || 1);
  const [catalog, categories] = await Promise.all([
    getProductCatalog({ ...filters, page, limit: 9 }),
    getProductCategories(),
  ]);
  const start = catalog.total ? (catalog.page - 1) * 9 + 1 : 0;
  const end = Math.min(catalog.page * 9, catalog.total);

  return (
    <main className="fix">
      <Breadcrumb title="Shop Now" />
      <section className="ig-shop-page">
        <div className="container">
          <div className="ig-shop-head">
            <div>
              <span>Performance nutrition</span>
              <h1>Shop supplements</h1>
              <p>Find the right formula for your goal, diet, and training routine.</p>
            </div>
            <form className="ig-shop-search" action="/shop">
              <Search size={17} />
              <input name="search" defaultValue={String(filters.search || "")} placeholder="Search products..." />
              <button type="submit">Search</button>
            </form>
          </div>

          <div className="ig-shop-layout">
            <aside className="ig-shop-sidebar">
              <div className="ig-shop-sidebar__title">
                <SlidersHorizontal size={17} />
                <span>Filters</span>
                <Link href="/shop">Clear all</Link>
              </div>

              <form action="/shop" className="ig-shop-filter-form">
                {filters.search ? <input type="hidden" name="search" value={String(filters.search)} /> : null}

                <fieldset>
                  <legend>Categories</legend>
                  <label className={!filters.categoryId ? "active" : ""}>
                    <input type="radio" name="categoryId" value="" defaultChecked={!filters.categoryId} />
                    <span>All products</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className={String(filters.categoryId) === String(category.id) ? "active" : ""}>
                      <input
                        type="radio"
                        name="categoryId"
                        value={category.id}
                        defaultChecked={String(filters.categoryId) === String(category.id)}
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </fieldset>

                <fieldset>
                  <legend>Availability</legend>
                  <label className={filters.stock === "in" ? "active" : ""}>
                    <input type="checkbox" name="stock" value="in" defaultChecked={filters.stock === "in"} />
                    <span>In stock only</span>
                  </label>
                </fieldset>

                <fieldset>
                  <legend>Customer rating</legend>
                  {[4, 3, 2].map((rating) => (
                    <label key={rating} className={Number(filters.minRating) === rating ? "active" : ""}>
                      <input
                        type="radio"
                        name="minRating"
                        value={rating}
                        defaultChecked={Number(filters.minRating) === rating}
                      />
                      <span className="ig-shop-rating-option">{"★".repeat(rating)} & up</span>
                    </label>
                  ))}
                </fieldset>

                <fieldset>
                  <legend>Price range</legend>
                  <ShopPriceRange
                    initialMin={filters.minPrice}
                    initialMax={filters.maxPrice}
                  />
                </fieldset>

                {filters.tag ? <input type="hidden" name="tag" value={String(filters.tag)} /> : null}
                <button type="submit" className="ig-shop-apply ig-primary-action">Apply filters</button>
              </form>

              {catalog.availableTags.length ? (
                <div className="ig-shop-tags">
                  <h3>Popular tags</h3>
                  <div>
                    {catalog.availableTags.slice(0, 12).map((tag) => (
                      <Link
                        key={tag}
                        className={filters.tag === tag ? "active" : ""}
                        href={shopHref(filters, { tag: filters.tag === tag ? undefined : tag, page: 1 })}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>

            <div className="ig-shop-results">
              <div className="ig-shop-toolbar">
                <p>Showing {start}-{end} of {catalog.total} results</p>
                <form action="/shop">
                  {Object.entries(filters).map(([key, value]) =>
                    key !== "sort" && key !== "page" && value ? (
                      <input key={key} type="hidden" name={key} value={String(value)} />
                    ) : null,
                  )}
                  <select name="sort" defaultValue={String(filters.sort || "newest")}>
                    <option value="newest">Newest first</option>
                    <option value="low_to_high">Price: high to low</option>
                    <option value="high_to_low">Price: low to high</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                  <button type="submit">Sort</button>
                </form>
              </div>

              {catalog.products.length ? (
                <div className="ig-shop-grid">
                  {catalog.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="ig-shop-empty">
                  <h2>No products matched</h2>
                  <p>Try removing a filter or searching for another term.</p>
                  <Link href="/shop" className="ig-primary-action">Reset filters</Link>
                </div>
              )}

              {catalog.pages > 1 ? (
                <nav className="ig-shop-pagination" aria-label="Shop pages">
                  <Link
                    className={page <= 1 ? "disabled" : ""}
                    href={shopHref(filters, { page: Math.max(1, page - 1) })}
                    aria-label="Previous page"
                  >
                    <ArrowLeft size={16} />
                  </Link>
                  {Array.from({ length: catalog.pages }, (_, index) => index + 1).map((pageNumber) => (
                    <Link
                      key={pageNumber}
                      className={pageNumber === page ? "active" : ""}
                      href={shopHref(filters, { page: pageNumber })}
                    >
                      {pageNumber}
                    </Link>
                  ))}
                  <Link
                    className={page >= catalog.pages ? "disabled" : ""}
                    href={shopHref(filters, { page: Math.min(catalog.pages, page + 1) })}
                    aria-label="Next page"
                  >
                    <ArrowRight size={16} />
                  </Link>
                </nav>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
