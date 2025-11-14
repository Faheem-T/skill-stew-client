// import { Carousel } from "@/shared/components/ui/Carousel";
import { useNavigate } from "react-router";
import { RegisterForm } from "../../components/RegisterForm";

export const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between h-full bg-primary">
      {/* <div className="w-2/3 h-screen text-background flex flex-col">
        <div className="p-8">
          <img src="logo.png" className="w-12" />
          <h1 className="text-xl ">Welcome to SkillStew</h1>
        </div>
        <Carousel />
      </div> */}
      <div className="flex flex-col items-start text-foreground justify-center p-48 w-full rounded-tl-4xl bg-background">
        <div className="fixed right-8 top-8">
          Have an account?{" "}
          <span
            className="font-bold underline hover:cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};
