export type OrderStatus = "delivered" | "cancelled" | "rejected";

interface OrderStatusUpdateHtmlTemplate {
  customer_name: string;
  order_id: string;
  status: OrderStatus;
  reason?: string; // optional, mainly for cancelled/rejected
}

const STATUS_COPY: Record<
  OrderStatus,
  { label: string; badgeColor: string; message: string }
> = {
  delivered: {
    label: "ORDER DELIVERED",
    badgeColor: "#4a7c59",
    message: "Your order has been delivered. We hope you enjoy your meal!",
  },
  cancelled: {
    label: "ORDER CANCELLED",
    badgeColor: "#8a3b3b",
    message: "Your order has been cancelled as requested.",
  },
  rejected: {
    label: "ORDER REJECTED",
    badgeColor: "#8a3b3b",
    message:
      "Unfortunately, we were unable to process your order at this time.",
  },
};

export const orderStatusUpdateHtmlTemplate = ({
  customer_name,
  order_id,
  status,
  reason,
}: OrderStatusUpdateHtmlTemplate) => {
  const copy = STATUS_COPY[status];

  const textContent = `LOBANGO - Order Update

Hello ${customer_name},

${copy.message}

Order Details:
- Order ID: ${order_id}
- Status: ${copy.label}
${reason ? `- Reason: ${reason}` : ""}

${status === "delivered" ? `Track your order: https://lobango.in/order-tracking/?orderId=${order_id}` : ""}

Thank you for choosing Lobango.

---
Questions? Contact us at hello@anishroy.dev`;

  const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Update</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0d0d0d; line-height: 1.6;">

        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Main Content -->
            <div style="padding: 50px 40px; background-color: #ffffff;" class="mobile-content-padding">

                <!-- Greeting -->
                <h2 style="margin: 0 0 30px 0; color: #0d0d0d; font-size: 24px; font-weight: 400;">
                    Hello ${customer_name},
                </h2>

                <p style="margin: 0 0 40px 0; color: #575757; font-size: 16px; line-height: 1.6;">
                    ${copy.message}
                </p>

                <!-- Order Summary -->
                <div style="border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden; margin-bottom: 40px;">

                    <!-- Header -->
                    <div style="background-color: #1c1c1c; padding: 20px 30px;">
                        <h3 style="margin: 0; color: #c2a572; font-size: 18px; font-weight: 500;">
                            Order Details
                        </h3>
                    </div>

                    <!-- Content -->
                    <div style="padding: 30px; background-color: #fafafa;" class="mobile-summary-padding">

                        <!-- Order ID Row -->
                        <table style="width: 100%; border-collapse: collapse; ${reason ? "margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e8e8e8;" : ""}" class="mobile-stack">
                            <tr>
                                <td style="color: #575757; font-size: 15px; padding: 8px 0; vertical-align: top; width: 40%;">
                                    Order ID
                                </td>
                                <td style="color: #0d0d0d; font-weight: 500; font-family: monospace; padding: 8px 0; text-align: right; vertical-align: top;" class="right-align">
                                    <span style="background-color: #f5f5f5; padding: 6px 12px; border-radius: 4px; display: inline-block;">
                                        ${order_id}
                                    </span>
                                </td>
                            </tr>
                        </table>

                        ${
                          reason
                            ? `
                        <!-- Reason Row -->
                        <table style="width: 100%; border-collapse: collapse;" class="mobile-stack">
                            <tr>
                                <td style="color: #575757; font-size: 15px; padding: 8px 0; vertical-align: top; width: 40%;">
                                    Reason
                                </td>
                                <td style="color: #0d0d0d; font-weight: 400; padding: 8px 0; text-align: right; vertical-align: top;" class="right-align">
                                    ${reason}
                                </td>
                            </tr>
                        </table>
                        `
                            : ""
                        }

                    </div>
                </div>

                <!-- Status -->
                <table style="width: 100%; margin-bottom: 40px;">
                    <tr>
                        <td style="text-align: center; padding: 0;">
                            <span style="display: inline-block; background-color: ${copy.badgeColor}; color: #ffffff; padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">
                                ${copy.label}
                            </span>
                        </td>
                    </tr>
                </table>

                ${
                  status === "delivered"
                    ? `
                <!-- Track Order Button -->
                <div style="text-align: center; margin-bottom: 40px;">
                    <a href="https://lobango.in/order-tracking/?orderId=${order_id}" style="display: inline-block; background-color: #0d0d0d; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 500; letter-spacing: 0.5px;">
                        VIEW ORDER
                    </a>
                </div>
                `
                    : `
                <!-- Contact Button -->
                <div style="text-align: center; margin-bottom: 40px;">
                    <a href="mailto:lobangorestaurent@gmail.com" style="display: inline-block; background-color: #0d0d0d; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 500; letter-spacing: 0.5px;">
                        CONTACT US
                    </a>
                </div>
                `
                }

                <!-- Divider -->
                <table style="width: 100%; margin: 40px 0;">
                    <tr>
                        <td style="text-align: center; padding: 0;">
                            <div style="width: 60px; height: 1px; background-color: #e8e8e8; margin: 0 auto;"></div>
                        </td>
                    </tr>
                </table>

                <!-- Footer Message -->
                <div style="text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #0d0d0d; font-size: 16px; font-weight: 500;">
                        Thank you for choosing Lobango
                    </p>
                    <p style="margin: 0; color: #a6a6a6; font-size: 14px;">
                        We appreciate your trust in our culinary expertise
                    </p>
                </div>

            </div>

            <!-- Footer -->
            <div style="background-color: #1c1c1c; padding: 40px; text-align: center;">
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0; color: #c2a572; font-size: 16px; font-weight: 400; letter-spacing: 1px;">
                        LOBANGO
                    </h4>
                </div>
                <p style="margin: 0 0 15px 0; color: #a6a6a6; font-size: 13px; line-height: 1.5;">
                    Questions about your order?<br>
                    Contact us at lobangorestaurent@gmail.com<br>
                    Ph: <a href="tel:+916296832453" style="color: #c2a572;">+91 62968 32453</a>
                </p>
                <div style="width: 30px; height: 1px; background-color: #c2a572; margin: 20px auto; opacity: 0.5;"></div>
                <p style="margin: 0; color: #666666; font-size: 11px; opacity: 0.7;">
                    This email was sent automatically. Please do not reply.
                </p>
            </div>

        </div>

        <!-- Mobile Responsive -->
        <style>
            @media only screen and (max-width: 600px) {
                .mobile-content-padding {
                    padding: 30px 20px !important;
                }
                .mobile-summary-padding {
                    padding: 20px !important;
                }
                .mobile-stack td {
                    display: block !important;
                    width: 100% !important;
                    text-align: left !important;
                    padding: 4px 0 !important;
                }
                .mobile-stack .right-align {
                    text-align: left !important;
                    margin-top: 5px !important;
                }
            }
        </style>
    </body>
    </html>`;

  return {
    text: textContent,
    html: htmlContent,
  };
};
