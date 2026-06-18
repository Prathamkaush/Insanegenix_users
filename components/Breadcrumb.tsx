import Link from "next/link";

export default function Breadcrumb({ title }: { title: string }) {
  return (
    <section className="simple-breadcrumb">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="simple-breadcrumb__content">
              <Link href="/" className="text-white">
                Home
              </Link>
              <span className="divider mr-5 ml-5 font-normal text-white">
                <i className="fas fa-angle-right"></i>
              </span>
              <span className="active text-white"> {title}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}