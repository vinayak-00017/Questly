import React from "react";

export default function TermsOfUsePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-neutral-800 dark:text-neutral-200">
            Terms of Use
          </h1>

          <div className="space-y-6 text-neutral-700 dark:text-neutral-300">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Acceptance of Terms
              </h2>
              <p>
                By accessing and using Questly, you accept and agree to be bound
                by the terms and provision of this agreement. If you do not
                agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Description of Service
              </h2>
              <p>
                Questly is a quest and goal management platform that helps users
                track their personal and professional objectives. Our service
                includes features for creating, managing, and tracking various
                types of quests and goals.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                User Accounts
              </h2>
              <p className="mb-4">
                To use certain features of our service, you must create an
                account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Acceptable Use
              </h2>
              <p className="mb-4">You agree not to use the service to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Upload malicious code or content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>
                  Use the service for any commercial purpose without permission
                </li>
                <li>Harass, abuse, or harm other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Content Ownership
              </h2>
              <p className="mb-4">
                You retain ownership of any content you create or upload to
                Questly. However, by using our service, you grant us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  A license to use, store, and display your content as necessary
                  to provide the service
                </li>
                <li>The right to backup and restore your data</li>
                <li>
                  Permission to analyze usage patterns to improve our service
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Service Availability
              </h2>
              <p>
                We strive to maintain high availability of our service, but we
                do not guarantee uninterrupted access. We may temporarily
                suspend the service for maintenance, updates, or other
                operational reasons.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Limitation of Liability
              </h2>
              <p>
                Questly is provided "as is" without any warranties. We shall not
                be liable for any indirect, incidental, special, or
                consequential damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Termination
              </h2>
              <p className="mb-4">
                We may terminate or suspend your account at any time for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violation of these terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Extended periods of inactivity</li>
              </ul>
              <p className="mt-4">
                You may also terminate your account at any time by contacting us
                or using the account deletion feature.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Privacy
              </h2>
              <p>
                Your privacy is important to us. Please review our Privacy
                Policy to understand how we collect, use, and protect your
                information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. We will
                notify users of significant changes via email or through the
                service. Continued use of the service after changes constitutes
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Governing Law
              </h2>
              <p>
                These terms shall be governed by and construed in accordance
                with applicable laws. Any disputes shall be resolved through
                binding arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Contact Information
              </h2>
              <p>
                If you have any questions about these terms, please contact us
                at legal@questly.me
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
