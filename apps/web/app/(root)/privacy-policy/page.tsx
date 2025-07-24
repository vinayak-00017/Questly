import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-neutral-800 dark:text-neutral-200">
            Privacy Policy
          </h1>
          
          <div className="space-y-6 text-neutral-700 dark:text-neutral-300">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Information We Collect
              </h2>
              <p className="mb-4">
                At Questly, we collect information you provide directly to us, such as when you create an account, 
                update your profile, or use our quest management features.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (email, username, profile details)</li>
                <li>Quest data (goals, progress, completion status)</li>
                <li>Usage information (how you interact with our platform)</li>
                <li>Device information (browser type, operating system)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                How We Use Your Information
              </h2>
              <p className="mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns to enhance user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Information Sharing
              </h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                except as described in this policy. We may share information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>In connection with a business transfer</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Data Security
              </h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Your Rights
              </h2>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data</li>
                <li>Opt out of certain communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Cookies and Tracking
              </h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our platform. 
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Changes to This Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting 
                the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Contact Us
              </h2>
              <p>
                If you have any questions about this privacy policy, please contact us at privacy@questly.com
              </p>
            </section>

            <div className="mt-8 pt-4 border-t border-neutral-300 dark:border-neutral-600">
              <p className="text-sm text-neutral-500">
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}