import PolicyPage from "@/components/PolicyPage";

export default function TermsAndConditionsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      intro="These terms apply when you access the InsaneGenix website, create an account, place an order, or use our services."
      sections={[
        {
          title: "Use Of Website",
          body: [
            "You agree to provide accurate account, contact, billing, and shipping information while using this website.",
            "You must not misuse the website, attempt unauthorized access, upload harmful code, or interfere with website security and operations.",
          ],
        },
        {
          title: "Products And Information",
          body: [
            "Product descriptions, images, pricing, availability, offers, and packaging may change from time to time. We aim to keep information accurate but errors may occur.",
            "Supplements and nutrition products should be used as directed. Customers with medical conditions, allergies, pregnancy, or medication use should consult a qualified professional before use.",
          ],
        },
        {
          title: "Orders",
          body: [
            "Order acceptance is subject to product availability, payment confirmation, address serviceability, and fraud-prevention checks.",
            "We may cancel or refuse orders in cases of incorrect pricing, stock issues, payment risk, suspicious activity, or delivery limitations.",
          ],
        },
        {
          title: "Limitation Of Liability",
          body: [
            "InsaneGenix is not liable for indirect, incidental, or consequential losses arising from website use, delayed delivery, unavailable products, or customer misuse of products.",
            "These terms are governed by applicable laws in India.",
          ],
        },
      ]}
    />
  );
}
