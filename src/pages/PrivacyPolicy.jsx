import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-gold text-sm hover:text-gold-light transition-colors">&larr; Back to Home</Link>
        <h1 className="font-serif text-4xl text-white mt-6 mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-12">Last Updated: April 13, 2026</p>

        <div className="space-y-8 text-white/70 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">1. Introduction</h2>
            <p>The Law Office of Justin D. Leigh ("we," "us," or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website justindleigh.com, our client portal at portal.justindleigh.com, or use any of our online services.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following categories of personal information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="text-white/90 font-medium">Contact Information:</span> Name, email address, phone number</li>
              <li><span className="text-white/90 font-medium">Case Information:</span> Subject matter of inquiry, description of legal matter, opposing party names, court case numbers, whether a real estate inquiry</li>
              <li><span className="text-white/90 font-medium">Referral Information:</span> How you heard about our office</li>
              <li><span className="text-white/90 font-medium">Consultation Preferences:</span> Preferred date and time for consultation</li>
              <li><span className="text-white/90 font-medium">Client Portal Data:</span> Documents you upload, case status information, messages between you and our office</li>
              <li><span className="text-white/90 font-medium">Technical Data:</span> IP address, browser type, device information, pages visited, session duration, and approximate location collected automatically through Google Analytics and server logs when you visit our site</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">3. How We Collect Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Directly from you when you submit a contact form, consultation request, or AI inquiry form</li>
              <li>Through our client portal when you upload documents or communicate with our office</li>
              <li>Through Google Local Service Ads when you contact us via a Google LSA listing (note: Google may record these calls; see Section 9)</li>
              <li>Through our phone system when you call our office (calls may be recorded for quality and documentation purposes)</li>
              <li>Automatically through Google Analytics, cookies, and similar technologies when you browse our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">4. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To respond to your inquiries and provide legal services</li>
              <li>To evaluate potential conflicts of interest before establishing representation</li>
              <li>To communicate with you about your legal matter</li>
              <li>To manage your account on our client portal</li>
              <li>To send you important notices regarding your case or our services</li>
              <li>To analyze website usage and improve our services (via Google Analytics)</li>
              <li>To comply with legal and ethical obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">5. How We Store and Protect Your Information</h2>
            <p className="mb-3">Your information is stored using Supabase, a SOC 2 Type II certified cloud database platform with encryption at rest and in transit. Our website and client portal are served over HTTPS with TLS encryption. Access to client data is restricted to authorized personnel only through role-based access controls and multi-factor authentication.</p>
            <p>While we implement commercially reasonable security measures, no method of electronic storage or transmission is 100% secure. We cannot guarantee absolute security of your information.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">6. Third-Party Service Providers</h2>
            <p className="mb-3">We use the following third-party services that may process your personal information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="text-white/90 font-medium">Supabase:</span> Database hosting, authentication, and file storage. Processes all personal information submitted through forms and the client portal.</li>
              <li><span className="text-white/90 font-medium">Vercel:</span> Website and client portal hosting. Processes HTTP requests and may log IP addresses.</li>
              <li><span className="text-white/90 font-medium">Resend:</span> Transactional email delivery. Processes email addresses and message content for emails sent from our office (hello@justindleigh.com).</li>
              <li><span className="text-white/90 font-medium">Google:</span> Analytics (anonymized usage data including pages visited, session duration, and approximate location), Maps (embedded map on contact page), Calendar (appointment scheduling), OAuth (portal login authentication), and Local Service Ads.</li>
              <li><span className="text-white/90 font-medium">Quo (formerly OpenPhone):</span> Phone system with call recording and AI-powered transcription.</li>
            </ul>
            <p className="mt-3">We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">7. Cookies and Tracking Technologies</h2>
            <p className="mb-3">Our website uses Google Analytics (ID: G-6QB7N65Z8X) to collect anonymized usage data, including pages visited, session duration, general geographic location, and device information. This helps us understand how visitors use our site and improve our services. Google Analytics may set cookies to distinguish users. We do not use cookies for advertising or targeted behavioral profiling.</p>
            <p className="mb-3">Our website also uses the Google Maps embed on our contact page, which may set its own cookies subject to Google's privacy policies.</p>
            <p>You can opt out of Google Analytics using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light underline">Google Analytics Opt-out Browser Add-on</a>. Your browser settings also allow you to manage or disable cookies.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">8. Your Rights</h2>
            <p className="mb-3">Residents of Washington, California, and other jurisdictions may have the following rights regarding their personal information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="text-white/90 font-medium">Access:</span> Request a copy of the personal information we hold about you</li>
              <li><span className="text-white/90 font-medium">Correction:</span> Request correction of inaccurate personal information</li>
              <li><span className="text-white/90 font-medium">Deletion:</span> Request deletion of your personal information, subject to legal and ethical retention obligations</li>
              <li><span className="text-white/90 font-medium">Portability:</span> Request your data in a portable format</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, please contact us using the information in Section 14. We will respond to your request within 45 days.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">9. Google Local Service Ads</h2>
            <p className="mb-3">If you contact us through a Google Local Service Ad, please be aware that Google may record the phone call. These recordings are stored by Google and are subject to Google's own privacy policies. <span className="text-white/90 font-medium">Call recordings made by Google through Local Service Ads are not protected by attorney-client privilege.</span> An attorney-client relationship is not established through an initial contact via Google Local Service Ads.</p>
            <p>Google typically retains LSA call recordings for approximately 60 to 70 days. Google's Terms of Service govern the storage, use, and deletion of these recordings, and Google retains certain rights over LSA-related content under those terms. If you wish to communicate confidential information, please contact our office directly after a formal engagement has been established.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">10. Consumer Health Data Privacy Policy (Washington State)</h2>
            <p className="mb-3 text-white/90 font-medium">This section constitutes our Consumer Health Data Privacy Policy as required by the Washington My Health My Data Act (RCW 19.373).</p>
            <p className="mb-3"><span className="text-white/90 font-medium">Categories of Health Data Collected:</span> Information submitted through our intake forms may include consumer health data such as descriptions of injuries, disabilities, medical conditions, mental health status, or other health-related information relevant to your legal matter (including but not limited to personal injury claims, disability discrimination matters, family law proceedings, and workers' compensation cases).</p>
            <p className="mb-3"><span className="text-white/90 font-medium">Purpose of Collection:</span> We collect consumer health data solely to evaluate and provide legal services that you have requested or inquired about.</p>
            <p className="mb-3"><span className="text-white/90 font-medium">Third Parties:</span> Consumer health data may be stored by Supabase (our database provider) as part of your case records. We do not sell consumer health data to any third party.</p>
            <p className="mb-3"><span className="text-white/90 font-medium">Your Rights:</span> You have the right to: (1) confirm whether we are collecting or sharing your consumer health data; (2) access your consumer health data; (3) withdraw consent for future collection of health data not necessary to provide legal services; and (4) request deletion of your consumer health data, subject to our legal and ethical retention obligations.</p>
            <p><span className="text-white/90 font-medium">How to Exercise Your Rights:</span> Contact Justin D. Leigh directly at (509) 426-4415 or justindleigh@gmail.com to exercise any rights under the My Health My Data Act. We will respond within 45 days.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">11. Data Breach Notification</h2>
            <p>In the event of a data breach affecting your personal information, we will notify you in accordance with applicable state and federal law, including Washington's data breach notification statute (RCW 19.255.010), in the most expedient time possible and without unreasonable delay.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">12. Children's Privacy</h2>
            <p>Our website and services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly. If you believe a child under 13 has provided us with personal information, please contact us immediately.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">13. Data Retention</h2>
            <p>We retain personal information for as long as necessary to fulfill the purposes for which it was collected, to comply with our legal and ethical obligations (including bar association record-keeping requirements), to resolve disputes, and to enforce our agreements. For prospective clients who do not engage our services, we generally retain contact information for conflict-checking purposes as required by the Washington Rules of Professional Conduct.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">14. Contact Us</h2>
            <p className="mb-3">If you have questions about this Privacy Policy, wish to exercise your rights, or have concerns about our data practices, please contact:</p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <p className="text-white font-medium">Justin D. Leigh, Attorney at Law</p>
              <p>Law Office of Justin D. Leigh</p>
              <p>601 W. 1st Ave., Ste. 1400</p>
              <p>PMB #17389612</p>
              <p>Spokane, WA 99201</p>
              <p className="mt-2">Phone: <a href="tel:5094264415" className="text-gold hover:text-gold-light transition-colors">(509) 426-4415</a></p>
              <p>Email: <a href="mailto:justindleigh@gmail.com" className="text-gold hover:text-gold-light transition-colors">justindleigh@gmail.com</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">15. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. Your continued use of our website after any changes constitutes acceptance of the revised policy.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
