import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import Seo from "../components/Seo.jsx";
import {
  CTA,
  FAQSection,
  ServicesGrid,
  WhyUs,
} from "../components/HomeSections.jsx";
import { FAQS } from "../data/content.js";
import { ReceiptText } from "lucide-react";
const Hero = ({ title, sub }) => (
  <section className="sky py-14 text-center text-white">
    <div className="container-x">
      <h1 className="text-4xl font-bold sm:text-6xl">{title}</h1>
      {sub && <p className="mx-auto mt-3 max-w-2xl text-white/75">{sub}</p>}
    </div>
  </section>
);

export function Services() {
  return (
    <>
      <Seo
        title="Astrology Services"
        description="Love, marriage, career, business, relationship and family guidance from experienced astrologers by chat or call."
        path="/services"
      />
      <Hero
        title="Astrology services"
        sub="Consultation categories to help you find the right astrologer."
      />
      <ServicesGrid
        title="Choose your area of guidance"
        sub="Each service links to astrologers who specialise in it."
      />
      <CTA />
    </>
  );
}

export function About() {
  return (
    <section id="about" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            About SevenSpirit
          </h2>

          <p className="text-gray-600 leading-8 mb-5">
            Welcome to SevenSpirit, your platform for astrology and spiritual
            guidance. We aim to help individuals explore astrology, understand
            astrological insights, and seek personalized guidance for their life
            journey.
          </p>

          <p className="text-gray-600 leading-8 mb-5">
            SevenSpirit connects users with astrology consultation services
            designed to support reflection, self-understanding, and personal
            growth. Our goal is to provide a convenient online experience where
            users can explore available consultation services.
          </p>

          <p className="text-gray-600 leading-8 mb-5">
            SevenSpirit is operated by LEAPFLOWX PRIVATE LIMITED. We are
            committed to providing clear service information and accessible
            customer support to our users.
          </p>

          <div className="mt-8 rounded-xl border p-6 text-left">
            <h3 className="text-xl font-semibold mb-4">Company Information</h3>

            <p className="mb-2">
              <strong>Legal Entity:</strong> LEAPFLOWX PRIVATE LIMITED
            </p>

            <p className="mb-2">
              <strong>GSTIN:</strong> 08AAFCJ8345K2Z2
            </p>

            <p className="mb-2">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:support@leapflowx.in"
                className="text-blue-600 hover:underline"
              >
                support@leapflowx.in
              </a>
            </p>

            <p>
              <strong>Registered Office:</strong> 3rd Floor, Plot No. 6-A, Okay
              Plus Big Benn Swag Farm, New Sanganer Road, Sundar Singh Bhandari
              Nagar, Ganesh Nagar, Ramnagar, Jaipur, Rajasthan – 302019, India.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <>
      <Seo
        title="Contact Us"
        description="Get in touch with the SevenSpirit support team."
        path="/contact"
      />
      <Hero
        title="Contact us"
        sub="Questions about a payment or a consultation? We reply within one working day."
      />
      <section className="container-x grid max-w-4xl gap-5 py-14 sm:grid-cols-3">
        {[
          [
            Mail,
            "Email",
            "support@leapflowx.in",
            "mailto:support@leapflowx.in",
          ],
          [ReceiptText, "GSTIN", "08AAFCJ8345K2Z2", null],
          [
            MapPin,
            "Registered Office",
            "3rd Floor, Plot No. 6-A, Okay Plus Big Benn Swag Farm, New Sanganer Road, Sundar Singh Bhandari Nagar, Ganesh Nagar, Ramnagar, Jaipur, Rajasthan – 302019, India.",
            null,
          ],
        ].map(([Icon, l, v, href]) => (
          <div
            key={l}
            className="rounded-2xl border border-royal-100 bg-white p-6 text-center"
          >
            <Icon className="mx-auto text-gold-500" />
            <h2 className="mt-2 text-2xl font-bold text-royal-900">{l}</h2>
            {href ? (
              <a
                href={href}
                className="mt-1 block text-sm text-royal-700 hover:underline"
              >
                {v}
              </a>
            ) : (
              <p className="mt-1 text-sm text-slate-600">{v}</p>
            )}
          </div>
        ))}
      </section>
    </>
  );
}

export function FaqPage() {
  return (
    <>
      <Seo
        title="FAQ"
        description="Answers about online astrology consultations, chat, calls, payments and refunds."
        path="/faq"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <Hero title="Frequently asked questions" />
      <FAQSection title="Everything you need to know" />
    </>
  );
}

const LEGAL = {
  terms: [
    "Terms & Conditions",
    [
      "Last Updated: 19 October 2026",

      '1. Introduction: Welcome to SevenSpirit (https://sevenspirit.in), operated by LEAPFLOWX PRIVATE LIMITED ("Company", "we", "us", or "our"). These Terms & Conditions govern your access to and use of our website and astrology consultation services. By accessing or using the platform, you agree to these terms.',

      "2. Our Services: SevenSpirit provides an online platform where users can browse astrologers and purchase astrology consultations through chat or voice calls, subject to availability. The services and features offered may change from time to time.",

      "3. Eligibility and Account: You must meet the minimum age required under applicable law to use our services. You agree to provide accurate information when registering, keep your account credentials confidential, and promptly notify us of any unauthorized access to your account.",

      "4. Bookings and Payments: Consultation fees, available durations, and applicable charges will be displayed on the platform before payment. A booking or consultation will be confirmed subject to successful payment verification and service availability. You must not use another person’s payment credentials without proper authorization.",

      "5. Consultation Duration: Consultations may be offered in specified durations, such as 10, 30, or 60 minutes, depending on availability. A paid session may begin after successful payment and connection to the astrologer. The applicable session duration and any extension options will be displayed before purchase. Session interruptions or technical issues may be reviewed by our support team.",

      "6. Nature of Astrology Services: Astrology is a belief-based practice. Astrologers provide interpretations and guidance for personal reflection and informational purposes. We do not guarantee any particular result, prediction, decision, or outcome. Our services are not a substitute for qualified medical, mental health, legal, financial, or other professional advice.",

      "7. Independent Astrologers: Astrologers may act as independent service providers using our platform. Where applicable, their profiles, experience, languages, ratings, and consultation fees may be displayed to help users make informed choices. We may review profiles and take reasonable steps to address reported misconduct, but we do not guarantee the accuracy of every prediction or statement made during a consultation.",

      "8. User Conduct: You agree not to misuse the platform, harass or threaten astrologers or other users, submit false information, attempt unauthorized access, interfere with platform operations, commit fraud, or use the services for any unlawful purpose. You must not record, reproduce, publish, or distribute private consultation content without the necessary consent and legal authorization.",

      "9. Cancellation and Refunds: Cancellation and refund requests are governed by our Refund Policy published on the website. Completed consultations are generally not refundable, except where required by applicable law or otherwise approved under our policy. If payment is deducted but the consultation does not start, or a service is not delivered as promised, please contact support with your transaction reference for review.",

      "10. Privacy: We collect and process personal information in accordance with our Privacy Policy. By using the platform, you acknowledge that you have had the opportunity to review that policy.",

      "11. Technical Availability: We aim to keep the platform available and functioning properly but do not guarantee uninterrupted or error-free service. Maintenance, connectivity issues, third-party service failures, or events beyond our reasonable control may affect access to the platform.",

      "12. Intellectual Property: The website design, branding, text, graphics, software, and other platform materials are owned by or licensed to the Company or relevant rights holders. You may not copy, modify, distribute, or commercially exploit these materials without prior authorization, except where permitted by law.",

      "13. Limitation of Liability: To the extent permitted by applicable law, the Company will not be responsible for indirect or consequential losses arising from the use of the platform or reliance on astrology guidance. Nothing in these terms excludes or limits liability that cannot legally be excluded or limited under applicable law.",

      "14. Suspension or Termination: We may restrict, suspend, or terminate access to an account where there is reasonable evidence of fraud, misuse, security risks, violations of these terms, or a legal requirement. We will handle such action in accordance with applicable law and any relevant refund obligations.",

      "15. Changes to These Terms: We may revise these Terms & Conditions from time to time. Updated terms will be published on this page with a revised date. Continued use of the platform after an update will be subject to the revised terms to the extent permitted by law.",

      "16. Governing Law and Disputes: These terms are governed by the laws of India. Disputes will be handled by the competent courts and authorities having jurisdiction under applicable law, subject to any mandatory consumer protection rights.",

      "17. Contact Us: For questions, complaints, or assistance, contact LEAPFLOWX PRIVATE LIMITED at support@sevenspirit.in or visit https://sevenspirit.in. Registered Office: 3rd Floor, Plot No. 6-A, Okay Plus Big Benn Swag Farm, New Sanganer Road, Sundar Singh Bhandari Nagar, Ganesh Nagar, Ramnagar, Jaipur, Rajasthan – 302019, India.",
    ],
  ],

  privacy: [
    "Privacy Policy",
    [
      "Last Updated: 19 October 2026",

      'SevenSpirit (https://sevenspirit.in) is operated by LEAPFLOWX PRIVATE LIMITED ("Company", "we", "us", or "our"). This Privacy Policy explains how we collect, use, store, and protect personal information when you use our astrology consultation platform.',

      "1. Information We Collect: We may collect your name, email address, mobile number, account details, astrologer booking history, consultation duration, chat messages, transaction references, payment status, IP address, device information, and cookies, as necessary to provide our services.",

      "2. How We Use Information: We use your information to create and manage accounts, facilitate astrology consultations by chat or call, maintain consultation records, process payments and refunds, respond to support requests, improve our services, prevent fraud, and comply with applicable laws.",

      "3. Consultation Records: Chat messages and consultation history may be stored so users can review their records where the feature is available. Access to these records is restricted to authorized personnel and service providers who need the information to provide or support the service. Call-related metadata may also be processed where applicable.",

      "4. Payment Information: Payments are processed through third-party payment gateway providers, such as Razorpay or another provider enabled on the platform. LEAPFLOWX PRIVATE LIMITED does not intentionally store complete card numbers, CVV numbers, UPI PINs, or net banking passwords on its own servers. Transaction references and payment status may be retained for verification, refunds, and accounting.",

      "5. Sharing of Information: We do not sell your personal information. We may share relevant information with astrologers, payment gateway providers, hosting providers, technology partners, customer support providers, and legal authorities when necessary to deliver our services or comply with applicable law.",

      "6. Cookies and Security: We may use cookies to maintain login sessions, remember preferences, improve website functionality, and protect against fraud. We take reasonable technical and organizational measures to protect personal information, but no internet-based system can be guaranteed to be completely secure.",

      "7. Data Retention: We retain personal information for as long as reasonably necessary to provide services, maintain transaction records, resolve disputes, prevent fraud, and meet legal or regulatory requirements. Information may be deleted or anonymized when it is no longer required, subject to applicable law.",

      "8. Your Rights: Subject to applicable law, you may request access to, correction of, or deletion of your personal information or account by contacting our support team. Some records may need to be retained for legal, accounting, security, or dispute-resolution purposes.",

      "9. Third-Party Services: Payment gateways and other third-party services may process information under their own privacy policies and terms. Please review those policies when using their services.",

      "10. Children: SevenSpirit is not intended for individuals below the minimum age permitted under applicable law. We do not knowingly collect children’s personal information in violation of applicable legal requirements.",

      "11. Policy Updates: We may update this Privacy Policy from time to time. Changes will be published on this page with an updated revision date.",

      "12. Contact Us: LEAPFLOWX PRIVATE LIMITED, Website: https://sevenspirit.in, Email: support@sevenspirit.in. Registered Office: 3rd Floor, Plot No. 6-A, Okay Plus Big Benn Swag Farm, New Sanganer Road, Sundar Singh Bhandari Nagar, Ganesh Nagar, Ramnagar, Jaipur, Rajasthan – 302019, India.",
    ],
  ],

  refund: [
    "Refund & Cancellation Policy",
    [
      "Last Updated: 19 October 2026",

      '1. Introduction: This Refund & Cancellation Policy applies to astrology consultation services provided through SevenSpirit (https://sevenspirit.in), operated by LEAPFLOWX PRIVATE LIMITED ("Company", "we", "us", or "our"). By purchasing a consultation, you agree to this policy, subject to applicable law.',

      "2. Consultation Payments: Users may purchase astrology consultations through chat or voice calls at the prices displayed on the platform. Please review the selected astrologer, consultation duration, service details, and total amount before completing payment.",

      "3. Cancellation Before Consultation: If a consultation has not started, you may contact our support team to request cancellation. Refund eligibility will depend on the booking status, service availability, applicable terms, and consumer protection laws. Where a refund is approved, it will be processed according to this policy.",

      "4. Consultation Not Started: If your payment is successful but the consultation does not start because of a technical issue, platform error, or astrologer unavailability, please contact our support team. We will review the booking and transaction records and, where appropriate, offer a refund or another suitable resolution.",

      "5. Interrupted Consultations: If a consultation is interrupted due to a technical problem or ends before the purchased duration is delivered, contact support with your booking details and payment reference. We will investigate the issue and determine an appropriate resolution, which may include a full or partial refund or service credit, subject to applicable law and the circumstances of the case.",

      "6. Completed Consultations: Once a consultation has been successfully delivered, it is generally not eligible for a refund merely because the user is dissatisfied with an astrologer’s interpretation or prediction. This restriction does not affect any refund or remedy required by applicable law, or claims involving a service not delivered as promised.",

      "7. Duplicate or Incorrect Payments: If you are charged more than once for the same booking, or the payment amount is incorrect due to a verified technical or processing error, please contact support. After verification, eligible excess or duplicate payments will be refunded.",

      "8. Refund Processing Time: Once a refund is approved, we will initiate it through the original payment method or the relevant payment provider’s refund process. Refunds are generally expected within 5–7 working days after initiation, but the actual time may vary depending on the bank, payment gateway, or payment method. We will share available transaction or refund references where applicable.",

      "9. How to Request a Refund: Email support@sevenspirit.in with your registered name, registered mobile number or email address, booking details, transaction ID or payment reference, payment date, and a brief description of the issue. Please do not send your full card number, CVV, UPI PIN, or banking password.",

      "10. Review and Resolution: Our support team may review payment records, booking status, consultation logs, and relevant communications to assess a request. We may ask for additional information reasonably necessary to investigate the issue. Each request will be assessed fairly and in accordance with applicable law.",

      "11. Payment Gateway Delays: Refund initiation and final credit are separate processes. Once initiated, the credit may take additional time to appear in your account. If the expected period has passed, contact us with your refund reference so we can assist with verification.",

      "12. Contact Information: For refund, cancellation, or payment-related questions, contact LEAPFLOWX PRIVATE LIMITED at support@sevenspirit.in. Website: https://sevenspirit.in. Registered Office: 3rd Floor, Plot No. 6-A, Okay Plus Big Benn Swag Farm, New Sanganer Road, Sundar Singh Bhandari Nagar, Ganesh Nagar, Ramnagar, Jaipur, Rajasthan – 302019, India.",
    ],
  ],

  cancellation: [
    "Cancellation Policy",
    [
      "Last Updated: 19 October 2026",

      '1. Introduction: This Cancellation Policy applies to services offered on SevenSpirit (https://sevenspirit.in), operated by LEAPFLOWX PRIVATE LIMITED ("Company", "we", "us", or "our"). It explains how users can request cancellation of astrology consultations booked through our platform.',

      "2. Cancellation Before Consultation: Users may request cancellation before their scheduled or purchased consultation begins by contacting our support team or using the cancellation option available on the platform, where provided. Cancellation eligibility will depend on the booking status and applicable service terms.",

      "3. Consultation Already Started: Once a chat or call consultation has started, cancellation may not be available for the remaining session time. However, if the consultation cannot be completed because of a technical issue, astrologer unavailability, or another service-related problem, users may contact support for review.",

      "4. Astrologer Unavailable: If the selected astrologer is unavailable and the consultation cannot begin within the applicable booking period, users may request cancellation. Depending on the circumstances, we may offer rescheduling, an alternative astrologer with the user’s consent, or a refund in accordance with our Refund Policy and applicable law.",

      "5. Technical Issues: If a technical problem prevents a user from connecting to an astrologer or interrupts a consultation, the user should contact support with the booking details and transaction reference. We will review the issue and determine an appropriate resolution, which may include cancellation, rescheduling, a partial refund, or a full refund, as applicable.",

      "6. Cancellation by SevenSpirit: We reserve the right to cancel or discontinue a consultation when necessary due to astrologer unavailability, technical problems, security concerns, suspected fraudulent activity, or other legitimate operational reasons. Where payment has been collected for a service that is not delivered, we will assess the appropriate refund or alternative resolution under our Refund Policy and applicable law.",

      "7. No-Show and User Availability: Users are responsible for providing accurate contact details and being available to start their consultation at the applicable time. If a user does not join or respond when required, cancellation and refund eligibility will depend on the booking terms disclosed before purchase and applicable law.",

      "8. Refunds Following Cancellation: Cancellation does not automatically guarantee a refund. Any eligible refund will be processed in accordance with our Refund Policy. Approved refunds will generally be initiated within 5–7 working days, subject to the actual processing timeline of the payment gateway, bank, and payment method.",

      "9. How to Request Cancellation: To request cancellation or assistance, email support@sevenspirit.in with your registered name, registered mobile number or email address, booking details, transaction reference, and reason for cancellation. Do not share your full card number, CVV, UPI PIN, or banking password.",

      "10. Policy Updates: LEAPFLOWX PRIVATE LIMITED may update this Cancellation Policy from time to time. The latest version will be published on this page with a revised update date.",

      "11. Contact Us: For cancellation-related questions, contact LEAPFLOWX PRIVATE LIMITED at support@sevenspirit.in or visit https://sevenspirit.in. Registered Office: 3rd Floor, Plot No. 6-A, Okay Plus Big Benn Swag Farm, New Sanganer Road, Sundar Singh Bhandari Nagar, Ganesh Nagar, Ramnagar, Jaipur, Rajasthan – 302019, India.",
    ],
  ],

  disclaimer: [
    "Disclaimer",
    [
      "Astrology is a belief-based practice. Guidance given on SevenSpirit is for personal reflection and entertainment and is not a guarantee of any outcome.",
      "It is not a substitute for professional medical, legal, psychological or financial advice. Please consult a qualified professional for such matters.",
    ],
  ],
};

export function Legal({ kind }) {
  const [title, paras] = LEGAL[kind];
  return (
    <>
      <Seo
        title={title}
        path={`/${kind}`}
        description={`${title} for SevenSpirit.`}
      />
      <Hero title={title} />
      <section className="container-x max-w-3xl space-y-4 py-14 leading-relaxed text-slate-700">
        {paras.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Template text: have it reviewed by a legal professional and update
          business details before launch.
        </p>
      </section>
    </>
  );
}

export function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <Seo title="Page not found" noindex />
      <h1 className="text-6xl font-bold text-royal-900">404</h1>
      <p className="mt-2 text-slate-600">We could not find that page.</p>
      <Link to="/" className="btn-royal mt-6">
        Back to home
      </Link>
    </div>
  );
}
