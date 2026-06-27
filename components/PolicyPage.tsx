import Breadcrumb from "@/components/Breadcrumb";

type PolicySection = {
  title: string;
  body: string[];
};

type PolicyPageProps = {
  title: string;
  intro: string;
  sections: PolicySection[];
};

export default function PolicyPage({ title, intro, sections }: PolicyPageProps) {
  return (
    <main className="fix ig-policy-page">
      <Breadcrumb title={title} />
      <section className="ig-policy-page__area black-bg">
        <div className="container">
          <div className="ig-policy-page__header">
            <span>InsaneGenix Policy</span>
            <h1>{title}</h1>
            <p>{intro}</p>
          </div>

          <div className="ig-policy-page__content">
            {sections.map((section) => (
              <section key={section.title} className="ig-policy-page__section">
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
