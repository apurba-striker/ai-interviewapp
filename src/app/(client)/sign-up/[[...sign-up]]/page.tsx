"use client";

import { SignUp } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Users, Zap, Shield, Waves } from "lucide-react";

function SignUpPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Dark Background with Content */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
          {/* Abstract gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-pink-600/20"></div>
          
          {/* Animated background elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-500/30 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-500/30 rounded-full blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Wave Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isLoaded ? 1 : 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl"
            >
              <Waves className="h-6 w-6 text-white" />
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-tight">
                Join AI Interview{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  Mocker
                </span>
              </h1>
              
              {/* Lotus Flower Icon */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🌸</span>
                </div>
                <span className="text-pink-400 font-medium">FoloUp</span>
              </div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 leading-relaxed max-w-md"
            >
              Start your journey with AI-powered interviews. Get insights that drive better hiring decisions and transform your recruitment process.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span className="text-gray-300">Free Trial with 10 Interviews</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Instant Setup & Configuration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-gray-300">Advanced AI Analytics</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isLoaded ? 1 : 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl mb-4"
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create your account
              </h2>
              <p className="text-gray-600">
                Start your journey with AI-powered interviews
              </p>
            </div>

            <div className="space-y-6">
              <SignUp 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none bg-transparent",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "w-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors rounded-xl py-3 px-4 flex items-center justify-center gap-3",
                    formButtonPrimary: "w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2",
                    formFieldInput: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200",
                    formFieldLabel: "text-gray-700 font-medium mb-2 block",
                    footerActionLink: "text-indigo-600 hover:text-indigo-700 font-medium",
                    dividerLine: "bg-gray-300",
                    dividerText: "text-gray-500 bg-white px-4",
                    formFieldLabelRow: "mb-2",
                    formFieldInputShowPasswordButton: "text-gray-500 hover:text-gray-700",
                    formResendCodeLink: "text-indigo-600 hover:text-indigo-700",
                    formFieldAction: "text-indigo-600 hover:text-indigo-700",
                    footerAction: "text-center",
                    formFieldRow: "space-y-4",
                    formField: "space-y-2",
                  },
                  variables: {
                    colorPrimary: "#374151",
                    colorText: "#374151",
                    colorTextSecondary: "#6b7280",
                    colorBackground: "transparent",
                    colorInputBackground: "transparent",
                    colorInputText: "#374151",
                    borderRadius: "0.75rem",
                    fontFamily: "Inter, sans-serif",
                  }
                }}
              />
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Secured by{" "}
                <span className="font-semibold text-gray-700">Clerk</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Message */}
      <div className="lg:hidden fixed inset-0 bg-white z-50 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Join Folo<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">Up</span>
          </h1>
          <p className="text-gray-600 mb-6">
            Mobile version is coming soon! Please sign up using a desktop for the best experience.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4">
            <p className="text-sm text-gray-700">
              🚧 Mobile app under construction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
