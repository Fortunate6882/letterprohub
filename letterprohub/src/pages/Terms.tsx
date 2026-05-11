import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const LegalPage = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-navy-900 mb-2">{title}</h1>
        <p className="text-gray-500 text-sm font-body mb-8">Last updated: January 1, 2026</p>
        <div className="prose prose-gray max-w-none space-y-6 font-body text-gray-700 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
    <Footer />
  </div>
)

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="text-xl font-heading font-bold text-navy-900 mb-3">{title}</h2>
    <div className="text-gray-600 space-y-2">{children}</div>
  </div>
)

export const Terms = () => (
  <LegalPage title="Terms of Service">
    <Section title="1. Account Registration">
      <p>By registering on LetterProHub, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials.</p>
    </Section>
    <Section title="2. Platform Usage">
      <p>LetterProHub grants you a limited, non-exclusive, non-transferable license to use the platform for personal earning purposes. You may not use the platform for any unlawful purpose.</p>
    </Section>
    <Section title="3. Letter Writing Rules">
      <p>All letters must be original, professional, and submitted by the deadline assigned. Plagiarized or low-quality submissions will be rejected without payment.</p>
    </Section>
    <Section title="4. Earnings and Payments">
      <p>Payment amounts are determined by the admin for each letter assignment. Earnings are credited to your account balance upon approval. The $15 welcome bonus is non-withdrawable.</p>
    </Section>
    <Section title="5. Withdrawals">
      <p>Withdrawals require a valid Swift Code provided by our team. Minimum withdrawal amounts may apply. All withdrawals are processed via BTC.</p>
    </Section>
    <Section title="6. Prohibited Activities">
      <p>Users may not create multiple accounts, submit fraudulent work, attempt to hack the platform, or engage in any activity that violates applicable law.</p>
    </Section>
    <Section title="7. Termination">
      <p>LetterProHub reserves the right to terminate accounts that violate these terms without prior notice.</p>
    </Section>
    <Section title="8. Governing Law">
      <p>These terms are governed by the laws of the United States of America.</p>
    </Section>
  </LegalPage>
)

export const Privacy = () => (
  <LegalPage title="Privacy Policy">
    <Section title="1. Information We Collect">
      <p>We collect information you provide during registration including name, email, phone number, and country. We also collect usage data and transaction history.</p>
    </Section>
    <Section title="2. How We Use Your Information">
      <p>Your information is used solely to operate the platform, process payments, verify identity, and provide customer support.</p>
    </Section>
    <Section title="3. Data Storage and Security">
      <p>All data is stored securely using Supabase with industry-standard encryption. We implement appropriate security measures to protect your information.</p>
    </Section>
    <Section title="4. Third Party Sharing">
      <p>We do not sell, trade, or share your personal information with third parties except as required by law.</p>
    </Section>
    <Section title="5. Cookies Policy">
      <p>We use only functional cookies necessary for platform operation. No advertising or tracking cookies are used.</p>
    </Section>
    <Section title="6. User Rights">
      <p>You have the right to access, correct, or delete your personal data. Contact us at support@letterprohub.com to exercise these rights.</p>
    </Section>
    <Section title="7. Data Retention">
      <p>We retain your data for as long as your account is active. Upon account deletion, data is removed within 90 days.</p>
    </Section>
  </LegalPage>
)

export const Cookies = () => (
  <LegalPage title="Cookie Policy">
    <Section title="1. What Cookies We Use">
      <p>LetterProHub uses essential session cookies to keep you logged in and remember your preferences. We do not use advertising or tracking cookies.</p>
    </Section>
    <Section title="2. Why We Use Them">
      <p>Cookies are necessary for the platform to function correctly, including maintaining your login session and securing your account.</p>
    </Section>
    <Section title="3. How to Control Cookies">
      <p>You can control cookies through your browser settings. Disabling essential cookies may affect platform functionality.</p>
    </Section>
    <Section title="4. Third Party Cookies">
      <p>Smartsupp live chat may set cookies for chat functionality. These are subject to Smartsupp's own privacy policy.</p>
    </Section>
  </LegalPage>
)

export default Terms
