import { Link } from "react-router-dom";

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-gold text-sm hover:text-gold-light transition-colors">&larr; Back to Home</Link>
        <h1 className="font-serif text-4xl text-white mt-6 mb-2">Accessibility Statement</h1>
        <p className="text-white/40 text-sm mb-12">Last Updated: April 13, 2026</p>

        <div className="space-y-8 text-white/70 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">My Commitment</h2>
            <p>Justin D. Leigh, PLLC, d/b/a Law Office of Justin D. Leigh, is committed to ensuring digital accessibility for people with disabilities, in accordance with the Americans with Disabilities Act (ADA) and applicable state and federal accessibility requirements. I continually improve the user experience for everyone and apply relevant accessibility standards to ensure I provide equal access to all users.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Conformance Standard</h2>
            <p>This website strives to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. While I have implemented the accessibility features listed below, I recognize that some content may not yet fully conform and I am actively working to address any gaps. These guidelines explain how to make web content more accessible to people with a wide array of disabilities, including visual, auditory, physical, speech, cognitive, language, learning, and neurological disabilities.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Accessibility Features</h2>
            <p className="mb-3">This website includes the following accessibility features:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Skip-to-main-content navigation link for keyboard users</li>
              <li>Semantic HTML structure with proper heading hierarchy</li>
              <li>ARIA labels on navigation landmarks and interactive elements</li>
              <li>Keyboard-accessible navigation and interactive components</li>
              <li>Visible focus indicators for keyboard navigation</li>
              <li>Color contrast ratios meeting WCAG AA standards (minimum 4.5:1 for text)</li>
              <li>Alternative text on all meaningful images</li>
              <li>Properly labeled form fields with associated labels</li>
              <li>Error messages announced to screen readers via ARIA live regions</li>
              <li>Reduced motion support for users with vestibular disorders (respects prefers-reduced-motion)</li>
              <li>Responsive design for various screen sizes and devices</li>
              <li>Text content that can be selected and copied</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Known Limitations</h2>
            <p className="mb-3">The following areas may have limited accessibility:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="text-white/90 font-medium">PDF documents:</span> PDF documents provided through my website or client portal may not be fully accessible to screen readers. I will provide alternative formats upon request.</li>
              <li><span className="text-white/90 font-medium">Third-party content:</span> Content embedded on my site (such as the Google Maps widget on my contact page) is subject to the accessibility of those third-party services, which is outside my direct control.</li>
              <li><span className="text-white/90 font-medium">Client portal uploads:</span> Documents uploaded to the client portal are provided in the format received and may not conform to WCAG standards.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Evaluation Methodology</h2>
            <p>This website's accessibility is evaluated through a combination of automated testing tools, manual testing with keyboard navigation and screen readers, and ongoing monitoring during development. I review my accessibility practices regularly and address identified issues as promptly as possible.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Feedback</h2>
            <p className="mb-3">I welcome your feedback on the accessibility of my website. If you encounter any accessibility barriers or have suggestions for improvement, please contact me:</p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <p className="text-white font-medium">Justin D. Leigh, Attorney at Law</p>
              <p>Law Office of Justin D. Leigh</p>
              <p>601 W. 1st Ave., Ste. 1400</p>
              <p>PMB #17389612</p>
              <p>Spokane, WA 99201</p>
              <p className="mt-2">Phone: <a href="tel:5094264415" className="text-gold hover:text-gold-light transition-colors">(509) 426-4415</a></p>
              <p>Email: <a href="mailto:justindleigh@gmail.com" className="text-gold hover:text-gold-light transition-colors">justindleigh@gmail.com</a></p>
            </div>
            <p className="mt-3">I aim to respond to accessibility feedback within 5 business days and to resolve issues as promptly as possible.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Assessment and Review</h2>
            <p>I assess the accessibility of this website on an ongoing basis. This statement was last reviewed and updated on April 13, 2026.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
