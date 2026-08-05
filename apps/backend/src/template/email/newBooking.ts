interface BookingConfirmationHtmlTemplate {
  customer_name: string;
  booking_id: string;
  customer_phone: string;
  customer_email: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  number_of_people: number;
}

export const bookingConfirmationHtmlTemplate = ({
  customer_name,
  booking_id,
  customer_phone,
  customer_email,
  date,
  time,
  number_of_people,
}: BookingConfirmationHtmlTemplate) => {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  const textContent = `LOBANGO - Booking Confirmation

Hello ${customer_name},

Your table reservation is confirmed! Please present your Booking ID upon arrival for verification.

Reservation Details:
- Booking ID: ${booking_id}
- Date: ${formatDate(date)}
- Time: ${formatTime(time)}
- Party Size: ${number_of_people} ${number_of_people === 1 ? "Guest" : "Guests"}
- Contact: ${customer_phone}
- Email: ${customer_email}

Status: RESERVATION CONFIRMED

Arrival Instructions:
- Present your Booking ID ${booking_id} upon arrival
- Please arrive on time. Tables are held for 15 minutes only
- For modifications or cancellations, contact us 2 hours in advance

Contact Information:
- Phone: +91 62968 32453
- Email: lobangorestaurent@gmail.com
- Address: 123 Culinary Street, Barddhaman, West Bengal

Thank you for choosing Lobango.

---
Questions? Contact us at lobangorestaurent@gmail.com`;

  const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0c0c0c; line-height: 1.6;">

        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Main Content -->
            <div style="padding: 50px 40px; background-color: #ffffff;" class="mobile-content-padding">

                <!-- Greeting -->
                <h2 style="margin: 0 0 30px 0; color: #0c0c0c; font-size: 24px; font-weight: 400;">
                    Hello ${customer_name},
                </h2>

                <p style="margin: 0 0 40px 0; color: #575757; font-size: 16px; line-height: 1.6;">
                    Your table reservation is confirmed! Please present your Booking ID upon arrival for verification.
                </p>

                <!-- Booking Summary -->
                <div style="border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden; margin-bottom: 40px;">

                    <!-- Header -->
                    <div style="background-color: #171717; padding: 20px 30px;">
                        <h3 style="margin: 0; color: #c2a572; font-size: 18px; font-weight: 500;">
                            Reservation Details
                        </h3>
                    </div>

                    <!-- Content -->
                    <div style="padding: 30px; background-color: #fafafa;" class="mobile-summary-padding">

                        <!-- Booking ID Row -->
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e8e8e8;" class="mobile-stack">
                            <tr>
                                <td style="color: #575757; font-size: 15px; padding: 8px 0; vertical-align: top; width: 40%;">
                                    Booking ID
                                </td>
                                <td style="color: #0c0c0c; font-weight: 500; font-family: monospace; padding: 8px 0; text-align: right; vertical-align: top;" class="right-align">
                                    <span style="background-color: #f5f5f5; padding: 6px 12px; border-radius: 4px; display: inline-block;">
                                        ${booking_id}
                                    </span>
                                </td>
                            </tr>
                        </table>

                        <!-- Date Row -->
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e8e8e8;" class="mobile-stack">
                            <tr>
                                <td style="color: #575757; font-size: 15px; padding: 8px 0; vertical-align: top; width: 40%;">
                                    Date
                                </td>
                                <td style="color: #0c0c0c; font-size: 16px; font-weight: 500; padding: 8px 0; text-align: right; vertical-align: top;" class="right-align">
                                    ${formatDate(date)}
                                </td>
                            </tr>
                        </table>

                        <!-- Time Row -->
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e8e8e8;" class="mobile-stack">
                            <tr>
                                <td style="color: #575757; font-size: 15px; padding: 8px 0; vertical-align: top; width: 40%;">
                                    Time
                                </td>
                                <td style="color: #0c0c0c; font-size: 16px; font-weight: 500; padding: 8px 0; text-align: right; vertical-align: top;" class="right-align">
                                    ${formatTime(time)}
                                </td>
                            </tr>
                        </table>

                        <!-- Party Size Row -->
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e8e8e8;" class="mobile-stack">
                            <tr>
                                <td style="color: #575757; font-size: 15px; padding: 8px 0; vertical-align: top; width: 40%;">
                                    Party Size
                                </td>
                                <td style="color: #0c0c0c; font-size: 16px; font-weight: 500; padding: 8px 0; text-align: right; vertical-align: top;" class="right-align">
                                    ${number_of_people} ${number_of_people === 1 ? "Guest" : "Guests"}
                                </td>
                            </tr>
                        </table>

                        <!-- Contact Row -->
                        <table style="width: 100%; border-collapse: collapse;" class="mobile-stack">
                            <tr>
                                <td style="color: #575757; font-size: 15px; padding: 8px 0; vertical-align: top; width: 40%;">
                                    Contact
                                </td>
                                <td style="color: #0c0c0c; font-weight: 400; padding: 8px 0; text-align: right; vertical-align: top;" class="right-align">
                                    ${customer_phone}<br>
                                    <span style="color: #888888; font-size: 14px;">${customer_email}</span>
                                </td>
                            </tr>
                        </table>

                    </div>
                </div>

                <!-- Status -->
                <table style="width: 100%; margin-bottom: 40px;">
                    <tr>
                        <td style="text-align: center; padding: 0;">
                            <span style="display: inline-block; background-color: #c2a572; color: #0c0c0c; padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">
                                RESERVATION CONFIRMED
                            </span>
                        </td>
                    </tr>
                </table>

                <!-- Important Information -->
                <div style="background-color: #171717; border-radius: 8px; padding: 25px; margin-bottom: 40px;">
                    <h4 style="margin: 0 0 15px 0; color: #c2a572; font-size: 16px; font-weight: 500;">
                        Arrival Instructions
                    </h4>
                    <ul style="margin: 0; padding-left: 20px; color: #a6a6a6; font-size: 14px; line-height: 1.6;">
                        <li style="margin-bottom: 8px;">Present your Booking ID <strong style="color: #ffffff;">${booking_id}</strong> upon arrival.</li>
                        <li style="margin-bottom: 8px;">Please arrive on time. Tables are held for 15 minutes only.</li>
                        <li style="margin-bottom: 8px;">For modifications or cancellations, contact us 2 hours in advance.</li>
                        <li>We look forward to serving you our finest cuisine.</li>
                    </ul>
                </div>

                <!-- Contact Information -->
                <div style="background-color: #fafafa; border-radius: 8px; padding: 25px; margin-bottom: 40px;">
                    <h4 style="margin: 0 0 15px 0; color: #0c0c0c; font-size: 16px; font-weight: 500;">
                        Contact Information
                    </h4>
                    <div style="color: #575757; font-size: 14px; line-height: 1.6;">
                        <p style="margin: 0 0 8px 0;"><strong style="color: #0c0c0c;">Phone:</strong>+91 62968 32453</p>
                        <p style="margin: 0 0 8px 0;"><strong style="color: #0c0c0c;">Email:</strong> lobangorestaurent@gmail.com</p>
                        <p style="margin: 0;"><strong style="color: #0c0c0c;">Address:</strong> 123 Culinary Street, Barddhaman, West Bengal</p>
                    </div>
                </div>

                <!-- Contact Button -->
                <div style="text-align: center; margin-bottom: 40px;">
                    <a href="mailto:lobangorestaurent@gmail.com" style="display: inline-block; background-color: #0c0c0c; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 500; letter-spacing: 0.5px; transition: all 0.3s ease; margin-right: 15px;">
                        CONTACT US
                    </a>
                    <a href="tel:+916296832453" style="display: inline-block; background-color: transparent; color: #0c0c0c; border: 2px solid #0c0c0c; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 500; letter-spacing: 0.5px; transition: all 0.3s ease;">
                        CALL RESTAURANT
                    </a>
                </div>

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
                    <p style="margin: 0 0 10px 0; color: #0c0c0c; font-size: 16px; font-weight: 500;">
                        Thank you for choosing Lobango
                    </p>
                    <p style="margin: 0; color: #a6a6a6; font-size: 14px;">
                        We can't wait to welcome you to our restaurant
                    </p>
                </div>

            </div>

            <!-- Footer -->
            <div style="background-color: #171717; padding: 40px; text-align: center;">
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0; color: #c2a572; font-size: 16px; font-weight: 400; letter-spacing: 1px;">
                        LOBANGO
                    </h4>
                </div>
                <p style="margin: 0 0 15px 0; color: #a6a6a6; font-size: 13px; line-height: 1.5;">
                    Need to modify your reservation?<br>
                    Contact us at lobangorestaurent@gmail.com
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
                .mobile-padding {
                    padding: 40px 20px !important;
                }
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
                .mobile-button {
                    padding: 14px 28px !important;
                    font-size: 14px !important;
                    margin: 5px 0 !important;
                    display: block !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
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
