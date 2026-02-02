import { APP_NAME } from "@/shared/config/constants";
import type React from "react";
import { Link } from "react-router";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-white py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" className="h-8 w-8 object-contain" />
              <span className="font-semibold text-lg">{APP_NAME}</span>
            </div>
            <p className="mt-4 text-stone-400 max-w-sm leading-relaxed">
              Connect with people who have the skills you need, and share your
              expertise in return. Learn, teach, and grow together.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider text-stone-400 mb-4">
              Platform
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/login"
                  className="text-stone-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-stone-300 hover:text-white transition-colors"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-stone-300 hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-stone-300 hover:text-white transition-colors"
                >
                  How it Works
                </a>
              </li>
            </ul>
          </div>

          {/* More links */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider text-stone-400 mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-stone-300 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-300 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-sm">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-stone-500 hover:text-white transition-colors text-sm"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-stone-500 hover:text-white transition-colors text-sm"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-stone-500 hover:text-white transition-colors text-sm"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
