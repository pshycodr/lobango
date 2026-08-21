import { useAdminAuth } from "@/hooks/useAdminAuth";
import type { AdminLoginReq } from "@lobango/contracts/admin";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Loader from "../Common/Loader";
import InputField from "./Input";
import SignInButton from "./SignInButton";

export function SignInForm() {
  const [formData, setFormData] = useState<AdminLoginReq>({
    username: "",
    password: "",
  });

  const { isLoading, error, login, verifyAuth } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const isAuthenticated = await verifyAuth();
      if (isAuthenticated) {
        navigate({ to: "/" });
      }
    };

    checkAuthStatus();
  }, [navigate, verifyAuth]);

  const handleSubmit = async () => {
    if (!formData.username.trim() || !formData.password) return;

    const success = await login(formData);
    if (success) {
      navigate({ to: "/" });
    }
  };

  const isFormValid = Boolean(formData.username.trim() && formData.password);

  return (
    <div className="mx-auto w-full max-w-md">
      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-center text-sm font-medium text-red-400">
              {error}
            </div>
          )}

          <InputField
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, username: value }))
            }
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, password: value }))
            }
          />

          <div className="mt-8">
            <SignInButton
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default SignInForm;
