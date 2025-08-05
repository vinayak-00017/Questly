// "use client";

// import React, { useState, useEffect, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Shield,
//   Key,
//   ArrowRight,
//   ArrowLeft,
//   CheckCircle,
//   AlertTriangle,
//   Eye,
//   EyeOff,
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

// function ResetPasswordContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const tokenParam = searchParams.get("token");
//     if (!tokenParam) {
//       toast.error("Invalid reset link", {
//         description: "The password reset link is invalid or has expired.",
//         icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
//       });
//       router.push("/forgot-password");
//       return;
//     }
//     setToken(tokenParam);
//   }, [searchParams, router]);

//   const handleResetPassword = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!token) {
//       toast.error("Invalid reset token", {
//         description: "The password reset link is invalid.",
//         icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
//       });
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords don't match", {
//         description: "Please make sure both password fields match.",
//         icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
//       });
//       return;
//     }

//     if (password.length < 8) {
//       toast.error("Password too weak", {
//         description: "Password must be at least 8 characters long.",
//         icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await authClient.resetPassword({
//         token,
//         password,
//       });

//       setIsSuccess(true);
//       toast.success("Password reset successful!", {
//         description: "Your password has been updated. You can now sign in.",
//         icon: <CheckCircle className="h-4 w-4 text-green-500" />,
//       });
//     } catch (err: any) {
//       console.error("Reset password error:", err);
//       toast.error("Password reset failed", {
//         description:
//           "The reset link may have expired. Please try requesting a new one.",
//         icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isSuccess) {
//     return (
//       <div className="relative min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <AuthBackground variant="amber" />

//         <div className="z-10 w-full max-w-md">
//           <AuthHeader
//             icon={<CheckCircle className="h-12 w-12 text-green-400" />}
//             title="Password Reset Complete!"
//             subtitle="Your new key has been forged successfully"
//             variant="amber"
//           />

//           <AuthFormCard variant="amber">
//             <div className="text-center space-y-4">
//               <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
//                 <p className="text-sm text-green-400">
//                   Your password has been successfully updated. You can now sign
//                   in with your new password.
//                 </p>
//               </div>

//               <Link href="/login">
//                 <Button className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white border-none shadow-lg shadow-amber-900/20 transition-all duration-300 group">
//                   <span>Continue to Login</span>
//                   <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//               </Link>
//             </div>
//           </AuthFormCard>
//         </div>
//       </div>
//     );
//   }

//   if (!token) {
//     return (
//       <div className="relative min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <AuthBackground variant="amber" />

//         <div className="z-10 w-full max-w-md">
//           <AuthHeader
//             icon={<AlertTriangle className="h-12 w-12 text-red-400" />}
//             title="Invalid Reset Link"
//             subtitle="The password reset link is invalid or has expired"
//             variant="amber"
//           />

//           <AuthFormCard variant="amber">
//             <div className="text-center space-y-4">
//               <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
//                 <p className="text-sm text-red-400">
//                   This password reset link is invalid or has expired. Please
//                   request a new one.
//                 </p>
//               </div>

//               <div className="flex flex-col gap-3">
//                 <Link href="/forgot-password">
//                   <Button className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white border-none shadow-lg shadow-amber-900/20 transition-all duration-300">
//                     Request New Reset Link
//                   </Button>
//                 </Link>

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
//           icon={<Shield className="h-12 w-12 text-amber-400" />}
//           title="Forge New Key"
//           subtitle="Create a new password for your account"
//           variant="amber"
//         />

//         {/* Reset password form card */}
//         <AuthFormCard variant="amber">
//           <form onSubmit={handleResetPassword} className="space-y-6">
//             <FormInput
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               required
//               icon={<Key className="h-4 w-4 text-zinc-500" />}
//               label="New Password"
//               showPassword={showPassword}
//               setShowPassword={setShowPassword}
//             />

//             <FormInput
//               type={showConfirmPassword ? "text" : "password"}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="••••••••"
//               required
//               icon={<Key className="h-4 w-4 text-zinc-500" />}
//               label="Confirm New Password"
//               showPassword={showConfirmPassword}
//               setShowPassword={setShowConfirmPassword}
//             />

//             <div className="text-xs text-zinc-400 space-y-1">
//               <p>Password requirements:</p>
//               <ul className="list-disc list-inside space-y-1 ml-2">
//                 <li className={password.length >= 8 ? "text-green-400" : ""}>
//                   At least 8 characters long
//                 </li>
//                 <li
//                   className={
//                     password === confirmPassword && password
//                       ? "text-green-400"
//                       : ""
//                   }
//                 >
//                   Both passwords match
//                 </li>
//               </ul>
//             </div>

//             <div className="space-y-4">
//               <Button
//                 type="submit"
//                 disabled={
//                   isLoading ||
//                   password !== confirmPassword ||
//                   password.length < 8
//                 }
//                 className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white border-none shadow-lg shadow-amber-900/20 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? (
//                   "Forging new key..."
//                 ) : (
//                   <>
//                     <span>Reset Password</span>
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

// export default function ResetPasswordPage() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <ResetPasswordContent />
//     </Suspense>
//   );
// }
