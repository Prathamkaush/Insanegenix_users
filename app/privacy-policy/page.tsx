import PolicyPage from "@/components/PolicyPage";

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="This policy explains how InsaneGenix collects, uses, and protects customer information when you browse, shop, or contact us."
      sections={[
        {
          title: "Information We Collect",
          body: [
            "We may collect your name, phone number, email address, billing and shipping address, order details, payment status, and account activity when you use our website.",
            "We may also collect basic technical information such as device type, browser, IP address, pages visited, and cookies to improve website performance and security.",
          ],
        },
        {
          title: "How We Use Information",
          body: [
            "We use your information to create accounts, process orders, arrange delivery, provide customer support, send order updates, prevent fraud, and improve our services.",
            "We do not sell your personal information. We share it only with service providers such as payment gateways, logistics partners, and technical vendors when needed to complete your request.",
          ],
        },
        {
          title: "Data Protection",
          body: [
            "We use reasonable administrative, technical, and operational safeguards to protect customer information from unauthorized access, misuse, loss, or disclosure.",
            "No online system is completely risk-free, so customers should keep account passwords confidential and notify us if they suspect unauthorized account activity.",
          ],
        },
        {
          title: "Your Choices",
          body: [
            "You can contact us to request access, correction, or deletion of your personal information, subject to legal, tax, fraud-prevention, and order-record requirements.",
            "For privacy questions, contact us at info@insanegenix.com.",
          ],
        },
      ]}
    />
  );
}
