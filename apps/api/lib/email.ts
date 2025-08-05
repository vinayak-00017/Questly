// // import nodemailer from 'nodemailer';

// interface EmailOptions {
//   to: string;
//   subject: string;
//   html: string;
//   text?: string;
// }

// interface EmailService {
//   sendEmail(options: EmailOptions): Promise<void>;
// }

// // Nodemailer implementation (works with Gmail, Outlook, custom SMTP)
// class NodemailerService implements EmailService {
//   private transporter: nodemailer.Transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransporter({
//       host: process.env.SMTP_HOST || 'smtp.gmail.com',
//       port: parseInt(process.env.SMTP_PORT || '587'),
//       secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });
//   }

//   async sendEmail(options: EmailOptions): Promise<void> {
//     await this.transporter.sendMail({
//       from: process.env.SMTP_FROM || process.env.SMTP_USER,
//       to: options.to,
//       subject: options.subject,
//       html: options.html,
//       text: options.text,
//     });
//   }
// }

// // Resend implementation (modern email service)
// class ResendService implements EmailService {
//   private apiKey: string;

//   constructor() {
//     this.apiKey = process.env.RESEND_API_KEY || '';
//   }

//   async sendEmail(options: EmailOptions): Promise<void> {
//     const response = await fetch('https://api.resend.com/emails', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${this.apiKey}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         from: process.env.RESEND_FROM || 'noreply@questly.me',
//         to: [options.to],
//         subject: options.subject,
//         html: options.html,
//         text: options.text,
//       }),
//     });

//     if (!response.ok) {
//       const error = await response.text();
//       throw new Error(`Failed to send email: ${error}`);
//     }
//   }
// }

// // Console implementation for development
// class ConsoleService implements EmailService {
//   async sendEmail(options: EmailOptions): Promise<void> {
//     console.log('📧 Email would be sent:');
//     console.log(`To: ${options.to}`);
//     console.log(`Subject: ${options.subject}`);
//     console.log(`HTML: ${options.html}`);
//     if (options.text) {
//       console.log(`Text: ${options.text}`);
//     }
//     console.log('---');
//   }
// }

// // Factory function to create the appropriate email service
// function createEmailService(): EmailService {
//   const provider = process.env.EMAIL_PROVIDER || 'console';

//   switch (provider) {
//     case 'nodemailer':
//       return new NodemailerService();
//     case 'resend':
//       return new ResendService();
//     case 'console':
//     default:
//       return new ConsoleService();
//   }
// }

// // Email templates
// export function createPasswordResetEmail(resetUrl: string, userEmail: string): { html: string; text: string; subject: string } {
//   const subject = '🔑 Reset Your Questly Password';

//   const html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Reset Your Password</title>
//       <style>
//         body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #0a0a0a; color: #ffffff; }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { text-align: center; padding: 40px 0; }
//         .logo { font-size: 32px; font-weight: bold; color: #f59e0b; margin-bottom: 10px; }
//         .subtitle { color: #9ca3af; font-size: 16px; }
//         .content { background: linear-gradient(135deg, #1f2937 0%, #111827 100%); border-radius: 12px; padding: 40px; margin: 20px 0; border: 1px solid #374151; }
//         .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #f59e0b; }
//         .message { font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #d1d5db; }
//         .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; }
//         .button:hover { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); }
//         .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
//         .warning { background: #7f1d1d; border: 1px solid #dc2626; border-radius: 8px; padding: 16px; margin: 20px 0; }
//         .warning-title { font-weight: bold; color: #fca5a5; margin-bottom: 8px; }
//         .warning-text { color: #fecaca; font-size: 14px; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <div class="logo">⚔️ Questly</div>
//           <div class="subtitle">Your Epic Quest Management Platform</div>
//         </div>

//         <div class="content">
//           <div class="title">🔑 Forge a New Key</div>
//           <div class="message">
//             Greetings, brave adventurer!<br><br>

//             We received a request to reset the password for your Questly account (<strong>${userEmail}</strong>).
//             If you made this request, click the button below to create a new password and continue your epic journey.
//           </div>

//           <div style="text-align: center;">
//             <a href="${resetUrl}" class="button">Reset My Password</a>
//           </div>

//           <div class="warning">
//             <div class="warning-title">⚠️ Security Notice</div>
//             <div class="warning-text">
//               This link will expire in 1 hour for your security. If you didn't request this password reset,
//               you can safely ignore this email - your account remains secure.
//             </div>
//           </div>
//         </div>

//         <div class="footer">
//           <p>This email was sent from Questly. If you have any questions, please contact our support team.</p>
//           <p style="font-size: 12px; color: #4b5563;">
//             If the button doesn't work, copy and paste this link into your browser:<br>
//             <span style="word-break: break-all;">${resetUrl}</span>
//           </p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;

//   const text = `
// 🔑 Reset Your Questly Password

// Greetings, brave adventurer!

// We received a request to reset the password for your Questly account (${userEmail}).

// To reset your password, visit this link:
// ${resetUrl}

// ⚠️ Security Notice:
// - This link will expire in 1 hour for your security
// - If you didn't request this password reset, you can safely ignore this email

// If you have any questions, please contact our support team.

// ---
// Questly - Your Epic Quest Management Platform
//   `;

//   return { html, text, subject };
// }

// // Main email service instance
// export const emailService = createEmailService();

// // Helper function to send password reset email
// export async function sendPasswordResetEmail(userEmail: string, resetUrl: string): Promise<void> {
//   const { html, text, subject } = createPasswordResetEmail(resetUrl, userEmail);

//   await emailService.sendEmail({
//     to: userEmail,
//     subject,
//     html,
//     text,
//   });
// }
