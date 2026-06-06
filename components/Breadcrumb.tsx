import Link from "next/link";

export default function Breadcrumb({ title }: { title: string }) {
  return (
    <section className="simple-breadcrumb">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="simple-breadcrumb__content">
              <Link href="/">Home</Link>
              <span className="active"> / {title}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
