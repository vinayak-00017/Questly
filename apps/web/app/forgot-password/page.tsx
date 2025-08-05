// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   KeyRound,
//   Mail,
//   ArrowRight,
//   ArrowLeft,
//   CheckCircle,
//   AlertTriangle,
// } from "lucide-react";
// import { authClient } from "@/lib/auth-client";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import {
//   AuthBackground,
//   AuthFormCard,
//   AuthHeader,
//   FormInput,
// } from "@/components/auth";
// import { toast } from "sonner";

// export default function ForgotPasswordPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isEmailSent, setIsEmailSent] = useState(false);

//   const handleForgotPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       await authClient.forgotPassword({
//         email,
//         redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
//       });

//       setIsEmailSent(true);
//       toast.success("Magic scroll dispatched!", {
//         description: "Check your email for the password reset link",
//         icon: <CheckCircle className="h-4 w-4 text-green-500" />,
//       });
//     } catch (err: any) {
//       console.error("Forgot password error:", err);
//       toast.error("Scroll delivery failed", {
//         description: "Unable to send reset instructions. Please try again.",
//         icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isEmailSent) {
//     return (
//       <div className="relative min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <AuthBackground variant="amber" />

//         <div className="z-10 w-full max-w-md">
//           <AuthHeader
//             icon={<CheckCircle className="h-12 w-12 text-green-400" />}
//             title="Magic Scroll Sent!"
//             subtitle="Check your email for password reset instructions"
//             variant="amber"
//           />

//           <AuthFormCard variant="amber">
//             <div className="text-center space-y-4">
//               <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
//                 <p className="text-sm text-green-400">
//                   We've sent a password reset link to <strong>{email}</strong>
//                 </p>
//               </div>

//               <p className="text-xs text-zinc-400">
//                 Didn't receive the email? Check your spam folder or try again in a few minutes.
//               </p>

//               <div className="flex flex-col gap-3 pt-4">
//                 <Button
//                   onClick={() => setIsEmailSent(false)}
//                   variant="outline"
//                   className="w-full border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
//                 >
//                   Send Another Email
//                 </Button>

//                 <Link href="/login">
//                   <Button
//                     variant="outline"
//                     className="w-full border-zinc-700 text-zinc-400 hover:bg-zinc-800"
//                   >
//                     <ArrowLeft className="h-4 w-4 mr-2" />
//                     Back to Login
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </AuthFormCard>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       {/* Background with particles */}
//       <AuthBackground variant="amber" />

//       <div className="z-10 w-full max-w-md">
//         {/* Header with title and icon */}
//         <AuthHeader
//           icon={<KeyRound className="h-12 w-12 text-amber-400" />}
//           title="Lost Your Key?"
//           subtitle="Enter your email to receive reset instructions"
//           variant="amber"
//         />

//         {/* Forgot password form card */}
//         <AuthFormCard variant="amber">
//           <form onSubmit={handleForgotPassword} className="space-y-6">
//             <FormInput
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="your-email@realm.com"
//               required
//               icon={<Mail className="h-4 w-4 text-zinc-500" />}
//               label="Your Scroll (Email)"
//             />

//             <div className="space-y-4">
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white border-none shadow-lg shadow-amber-900/20 transition-all duration-300 group"
//               >
//                 {isLoading ? (
//                   "Dispatching magic scroll..."
//                 ) : (
//                   <>
//                     <span>Send Reset Instructions</span>
//                     <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
//                   </>
//                 )}
//               </Button>

//               <Link href="/login">
//                 <Button
//                   variant="outline"
//                   className="w-full border-zinc-700 text-zinc-400 hover:bg-zinc-800"
//                 >
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Back to Login
//                 </Button>
//               </Link>
//             </div>
//           </form>
//         </AuthFormCard>

//         {/* Additional help */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.7, duration: 0.5 }}
//           className="mt-6 text-center"
//         >
//           <p className="text-zinc-400 text-sm">
//             Remember your password?{" "}
//             <Link
//               href="/login"
//               className="text-amber-500 hover:text-amber-400 transition-colors font-medium"
//             >
//               Sign in instead
//             </Link>
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
