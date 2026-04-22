import { APP_NAME } from "@/shared/config/constants";
import type React from "react";
import { Link } from "react-router";
import { RoutePath } from "@/shared/config/routes";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-border border-t py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-20">
        <div className="grid md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt={APP_NAME} className="h-8 w-8 object-contain" />
              <span className="text-lg font-semibold text-foreground">{APP_NAME}</span>
            </div>
            <p className="text-muted-foreground mt-4 max-w-sm leading-relaxed">
              A learning platform connecting you with verified domain experts
              through live, cohort-based workshops. Built for completion, not
              just signups.
            </p>
          </div>

          <div>
            <h4 className="text-muted-foreground mb-4 text-[11px] font-medium uppercase tracking-[0.08em]">
              Platform
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to={RoutePath.Login} className="text-muted-foreground hover:text-foreground transition-colors">Log In</Link>
              </li>
              <li>
                <Link to={RoutePath.Register} className="text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link>
              </li>
              <li>
                <Link to={RoutePath.ExpertApplication} className="text-muted-foreground hover:text-foreground transition-colors">Become an Expert</Link>
              </li>
              <li>
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              </li>
              <li>
                <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-muted-foreground mb-4 text-[11px] font-medium uppercase tracking-[0.08em]">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Twitter</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">LinkedIn</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
