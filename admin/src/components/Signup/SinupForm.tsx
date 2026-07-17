import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "../../lib/axios";
import Loader from "../Common/Loader";
import InputField from "./Input";
import SignInButton from "./SignInButton";

const SignInForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate()

    useEffect(() => {
        const checkAdmin = async () => {
            const res = await api.get("/api/v1/admin/verify")
            if (res.data.success) {
                navigate({ to: "/" })
            }
        }

        checkAdmin()
        
    }, [])

    const handleSubmit = async () => {
        if (!isFormValid) return;

        setLoading(true);
        try {
            console.log(formData);

            const res = await api.post("/api/v1/admin/login", formData);
            if (!res.data.success) {
                alert("Signin failed");
            } else {
                navigate({ to: "/" });
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = formData.username && formData.password;

    return (
        <div className="w-full max-w-md mx-auto">
            {loading ? (
                <div className="flex justify-center items-center h-60">
                    <Loader />
                </div>
            ) : (
                <>
                    <InputField
                        label="Username"
                        type="text"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={(value) => setFormData(prev => ({ ...prev, username: value }))}
                    />

                    <InputField
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                    />

                    <div className="mt-8">
                        <SignInButton
                            onClick={handleSubmit}
                            disabled={!isFormValid}
                        />
                    </div>
                </>
            )}
        </div>
    );
};


export default SignInForm