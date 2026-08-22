interface OtpHtmlTemplate {
  customer_name: string;
  otp: string;
  expiry_minutes: number;
}

export const otpHtmlTemplate = ({
  customer_name,
  otp,
  expiry_minutes,
}: OtpHtmlTemplate) => {
  const textContent = `LOBANGO - Verification Code

Hello ${customer_name},

Your one-time verification code is:

${otp}

This code will expire in ${expiry_minutes} minutes. Do not share this code with anyone, Lobango staff will never ask for it.

If you did not request this code, please ignore this email or contact us.

Contact Information:
- Phone: +91 62968 32453
- Email: lobangorestaurent@gmail.com

---
Questions? Contact us at lobangorestaurent@gmail.com`;

  const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
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
                    Use the verification code below to complete your request. This code is valid for a limited time only.
                </p>

                <!-- OTP Box -->
                <div style="border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                    <div style="background-color: #171717; padding: 20px 30px;">
                        <h3 style="margin: 0; color: #c2a572; font-size: 18px; font-weight: 500;">
                            Verification Code
                        </h3>
                    </div>
                    <div style="padding: 40px 30px; background-color: #fafafa; text-align: center;" class="mobile-summary-padding">
                        <span style="display: inline-block; background-color: #f5f5f5; color: #0c0c0c; font-family: monospace; font-size: 36px; font-weight: 600; letter-spacing: 10px; padding: 20px 30px; border-radius: 6px;">
                            ${otp}
                        </span>
                    </div>
                </div>

                <!-- Expiry Notice -->
                <table style="width: 100%; margin-bottom: 40px;">
                    <tr>
                        <td style="text-align: center; padding: 0;">
                            <span style="display: inline-block; background-color: #c2a572; color: #0c0c0c; padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">
                                EXPIRES IN ${expiry_minutes} MINUTES
                            </span>
                        </td>
                    </tr>
                </table>

                <!-- Security Notice -->
                <div style="background-color: #171717; border-radius: 8px; padding: 25px; margin-bottom: 40px;">
                    <h4 style="margin: 0 0 15px 0; color: #c2a572; font-size: 16px; font-weight: 500;">
                        Security Notice
                    </h4>
                    <ul style="margin: 0; padding-left: 20px; color: #a6a6a6; font-size: 14px; line-height: 1.6;">
                        <li style="margin-bottom: 8px;">Do not share this code with anyone.</li>
                        <li style="margin-bottom: 8px;">Lobango staff will never ask for your verification code.</li>
                        <li>If you did not request this code, you can safely ignore this email.</li>
                    </ul>
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
                        We appreciate your trust in our culinary expertise
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
                    Need help? Contact us at lobangorestaurent@gmail.com
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
            }
        </style>
    </body>
    </html>`;

  return {
    text: textContent,
    html: htmlContent,
  };
};
