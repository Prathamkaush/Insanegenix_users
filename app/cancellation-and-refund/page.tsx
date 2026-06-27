import PolicyPage from "@/components/PolicyPage";

export default function CancellationAndRefundPage() {
  return (
    <PolicyPage
      title="Cancellation & Refund"
      intro="This policy explains when orders can be cancelled and how refunds are handled for eligible purchases."
      sections={[
        {
          title: "Order Cancellation",
          body: [
            "You may request cancellation before the order is packed or dispatched. Once an order has shipped, cancellation may not be possible.",
            "InsaneGenix may cancel an order due to stock unavailability, payment failure, address issues, courier restrictions, or suspected misuse.",
          ],
        },
        {
          title: "Refund Eligibility",
          body: [
            "Refunds are considered for prepaid orders that are cancelled before dispatch, orders not fulfilled by us, duplicate payments, or verified service failures.",
            "Opened, used, damaged-after-delivery, or tampered products are not eligible for refund unless the issue is due to a verified error from our side.",
          ],
        },
        {
          title: "Damaged Or Incorrect Items",
          body: [
            "If you receive a damaged, missing, or incorrect item, contact us promptly with order details, photos, and an unboxing video where available.",
            "After verification, we may offer replacement, store credit, or refund depending on the issue and product condition.",
          ],
        },
        {
          title: "Refund Timeline",
          body: [
            "Approved refunds for online payments are initiated to the original payment method. Bank or gateway processing timelines may vary.",
            "COD refunds, where approved, may require bank or UPI details from the customer for processing.",
          ],
        },
      ]}
    />
  );
}
