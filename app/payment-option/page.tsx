import PolicyPage from "@/components/PolicyPage";

export default function PaymentOptionPage() {
  return (
    <PolicyPage
      title="Payment Option"
      intro="InsaneGenix offers secure payment choices so customers can complete orders with confidence."
      sections={[
        {
          title: "Available Payment Methods",
          body: [
            "Customers may pay online through Razorpay-supported methods such as UPI, debit card, credit card, net banking, and wallets where available.",
            "Cash on Delivery may be available for eligible orders and serviceable pin codes. COD availability can vary based on order value, address, and operational checks.",
          ],
        },
        {
          title: "Online Payment Security",
          body: [
            "Online payments are processed through the payment gateway. InsaneGenix does not store full card numbers, CVV, UPI PINs, or banking passwords.",
            "An order is confirmed after successful payment authorization or successful COD order placement.",
          ],
        },
        {
          title: "Payment Failures",
          body: [
            "If money is deducted but the order is not confirmed, please contact us with the transaction reference and registered email or phone number.",
            "Failed or duplicate online payment reversals are handled by the payment gateway and issuing bank as per their processing timelines.",
          ],
        },
      ]}
    />
  );
}
