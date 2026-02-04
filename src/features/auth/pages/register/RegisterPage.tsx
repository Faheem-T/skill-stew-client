import { useNavigate } from "react-router";
import { RegisterForm } from "../../components/RegisterForm";
import { APP_NAME } from "@/shared/config/constants";
import { Sparkles } from "lucide-react";

export const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/15 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.png" className="h-12 w-12 object-contain" />
            <span className="text-2xl font-bold">{APP_NAME}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Join our community</h1>
          <p className="text-lg text-white/80 max-w-md">
            Start your skill exchange journey today. Connect with learners and
            experts ready to share their knowledge.
          </p>
          <div className="mt-8 flex items-center gap-2 text-white/60">
            <Sparkles className="w-5 h-5" />
            <span>Learn, teach, and grow together</span>
          </div>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Sign in link - desktop */}
          <div className="hidden sm:block text-center mb-6 text-sm text-slate-600">
            Already have an account?{" "}
            <span
              className="font-semibold text-primary hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Sign in
            </span>
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img src="/logo.png" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-primary">{APP_NAME}</span>
          </div>

          <RegisterForm />

          <p className="text-center text-sm text-slate-500 mt-6">
            By signing up, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
