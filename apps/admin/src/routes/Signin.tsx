import Header from "@/components/SignIn/Header";
import SignInForm from "@/components/SignIn/SignInForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/Signin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--smoky-black-1) p-6">
      <div className="w-full max-w-lg">
        <Header />
        <SignInForm />
      </div>
    </div>
  );
}

export default RouteComponent;
