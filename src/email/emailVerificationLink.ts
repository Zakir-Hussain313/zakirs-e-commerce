export const emailVerificationLink = (link: string): string => {
  const html = `
<!DOCTYPE html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
    <title>Email Verification</title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
        #MessageViewBody a { color: inherit; text-decoration: none; }
        p { line-height: inherit }
        .desktop_hide, .desktop_hide table { mso-hide: all; display: none; max-height: 0px; overflow: hidden; }
        .image_block img+div { display: none; }
        sup, sub { font-size: 75%; line-height: 0; }
        @media (max-width:520px) {
            .desktop_hide table.icons-inner { display: inline-block !important; }
            .icons-inner { text-align: center; }
            .icons-inner td { margin: 0 auto; }
            .mobile_hide { display: none; }
            .row-content { width: 100% !important; }
            .stack .column { width: 100%; display: block; }
            .mobile_hide { min-height: 0; max-height: 0; max-width: 0; overflow: hidden; font-size: 0px; }
            .desktop_hide, .desktop_hide table { display: table !important; max-height: none !important; }
        }
    </style>
</head>
<body style="background-color:#FFFFFF; margin:0; padding:0; -webkit-text-size-adjust:none; text-size-adjust:none;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FFFFFF;">
    <tr>
      <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f5f5f5; padding:50px 0;">
          <tr>
            <td>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="500" style="background-color:#ffffff; color:#000000; margin:0 auto;">
                <tr>
                  <td style="padding:15px 0 20px 0;">
                    <div style="text-align:center;">
                      <img src="https://res.cloudinary.com/diziboq91/image/upload/v1757301033/otp-email_cmle9r.webp" alt="reset-password" width="250" style="display:block; margin:0 auto;" />
                    </div>
                    <h1 style="text-align:center; color:#393d47; font-family:Tahoma, Verdana, Segoe, sans-serif; font-size:25px;">
                      <strong>Email Verification</strong>
                    </h1>
                    <p style="text-align:center; color:#393d47; font-size:14px;">
                      We received a request to verify your identity. Use the following link to complete the verification process:
                    </p>
                    <div style="text-align:center; margin:20px 0;">
                      <a href="${link}" style="background-color:#7747FF; color:white; padding:10px 30px; text-decoration:none; border-radius:50px;">Verify</a>
                    </div>
                    <p style="text-align:center; font-size:14px; color:#393d47;">
                      If the button above does not work, copy and paste the following link:<br/>
                      <a href="${link}">${link}</a>
                    </p>
                    <p style="text-align:center; font-size:13px; color:#393d47;">
                      <strong>Note:</strong> This link will expire in 1 hour. If you did not create an account, you can safely ignore this email.
                    </p>
                    <p style="text-align:center; font-size:13px; color:#393d47;">
                      Thank you,<br/>
                      <a href="https://www.instagram.com/_k1r0oo_/" target="_blank">Zakir Hussain</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return html;
};
