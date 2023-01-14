/**
 * Mail Template was built with Maizzle AMP template
 * 
 * TODO: Add Doge Logo Header
 */
const VERIFYEMAILTEMPLATE = (name: string, link: string) => `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style>
    td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
  </style>
  <![endif]-->
  <title>Please Verify Your Email Address</title>
  <style>
    .hover-bg-blue-600:hover {
      background-color: #2563eb !important
    }
    @media (max-width: 600px) {
      .sm-h-8 {
        height: 32px !important
      }
      .sm-w-full {
        width: 100% !important
      }
      .sm-px-8 {
        padding-left: 32px !important;
        padding-right: 32px !important
      }
      .sm-px-6 {
        padding-left: 24px !important;
        padding-right: 24px !important
      }
    }
  </style>
</head>
<body style="word-break: break-word; -webkit-font-smoothing: antialiased; margin: 0; width: 100%; background-color: #e5e7eb; padding: 0">
  <div role="article" aria-roledescription="email" aria-label="Please Verify Your Email Address" lang="en">
    <table style="width: 100%; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="background-color: #e5e7eb; padding-top: 24px; padding-bottom: 24px">
          <table class="sm-w-full" style="width: 600px" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td align="center" class="sm-px-8">
                <table class="sm-w-full" style="width: 75%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="background-color: #fff; padding-top: 40px; text-align: center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="height: 75px; width: 75px; color: #3b82f6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"></path>
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td class="sm-px-6" style="background-color: #fff; padding-left: 48px; padding-right: 48px; padding-top: 8px; text-align: center">
                      <p style="padding-bottom: 0; font-size: 20px; font-weight: 600; color: #000">Verify Your Email Address</p>
                      <hr style="margin-bottom: 32px; height: 1px; border-width: 0px; background-color: #e5e7eb">
                    </td>
                  </tr>
                  <tr>
                    <td class="sm-px-6" style="background-color: #fff; padding: 8px 48px; text-align: left">
                      <p style="margin: 0 0 32px; font-size: 18px; font-weight: 600; color: #374151">Hey ${name},</p>
                      <p style="font-size: 16px; color: #374151">We're thrilled to welcome you to NFinsighT. <br> <br>To get started, confirm your email address:</p>
                      <div class="sm-h-8" style="line-height: 16px">&zwnj;</div>
                      <a href="${link}" class="hover-bg-blue-600" style="text-decoration: none; display: inline-block; border-radius: 4px; background-color: #3b82f6; padding: 20px 24px; font-size: 14px; font-weight: 600; text-transform: uppercase; line-height: 1; color: #fff">
                        <!--[if mso]><i style="letter-spacing: 24px; mso-font-width: -100%; mso-text-raise: 26pt;">&nbsp;</i><![endif]-->
                        <span style="mso-text-raise: 13pt;">Confirm your email &rarr;</span>
                        <!--[if mso]><i style="letter-spacing: 24px; mso-font-width: -100%;">&nbsp;</i><![endif]-->
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td class="sm-px-6" style="background-color: #fff; padding: 16px 32px 48px; text-align: center">
                      <hr style="margin-bottom: 32px; height: 1px; border-width: 0px; background-color: #e5e7eb">
                      <p style="font-size: 11px; color: #6b7280">If you did not sign up for this account, you may ignore this email. This account will be deleted automatically after 1 day.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="height: 2px; background-color: #d1d5db"></td>
                  </tr>
                  <tr>
                    <td style="padding: 32px; text-align: center; font-size: 12px; color: #4b5563">
                      <p style="margin: 0 0 16px">© NFinsighT 2022</p>
                      <p style="margin: 0; font-style: italic">Your #1 source of upcoming trends in NFT and Crypto</p>
                      <p style="margin: 0"> </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;

export function VerifyEmail ({ name, link } : { name: string, link: string}) {
  return {
    subject: "Verify Email Address for NFinsighT",
    body: (
      <div dangerouslySetInnerHTML={ { __html: VERIFYEMAILTEMPLATE(name, link) } }/>
    )
  };
}