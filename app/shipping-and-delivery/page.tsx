import PolicyPage from "@/components/PolicyPage";

export default function ShippingAndDeliveryPage() {
  return (
    <PolicyPage
      title="Shipping & Delivery"
      intro="This policy explains how InsaneGenix ships orders and what customers can expect after placing an order."
      sections={[
        {
          title: "Order Processing",
          body: [
            "Orders are processed after successful order placement and, for prepaid orders, payment confirmation.",
            "Processing may take longer during sales, public holidays, courier delays, weather disruptions, or operational constraints.",
          ],
        },
        {
          title: "Delivery Timeline",
          body: [
            "Most serviceable orders are delivered within an estimated 3 to 7 business days after dispatch, depending on location and courier availability.",
            "Remote locations, incorrect addresses, failed delivery attempts, or local restrictions may extend delivery timelines.",
          ],
        },
        {
          title: "Shipping Charges",
          body: [
            "Shipping charges, if applicable, are shown during checkout before you place the order.",
            "Free shipping offers may apply based on order value, coupon, address, or promotional rules.",
          ],
        },
        {
          title: "Delivery Support",
          body: [
            "Please provide a complete shipping address, correct phone number, and reachable contact details to avoid failed delivery attempts.",
            "For delivery help, contact us at info@insanegenix.com with your order number.",
          ],
        },
      ]}
    />
  );
}
