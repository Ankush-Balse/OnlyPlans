import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/common/Logo.jsx";

const LoginPage = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Get the return URL from location state or default to home
	const from = location.state?.from?.pathname || "/";

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = async (data) => {
		setIsLoading(true);
		try {
			const success = await login(data);
			if (success) {
				navigate(from, { replace: true });
			}
		} finally {
			setIsLoading(false);
		}
	};

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-800 py-12 px-4 sm:px-6 lg:px-8">
			<div className="card max-w-md w-full p-8 animate-fade-in">
				<div className="flex flex-col items-center justify-center mb-8">
					<Logo className="h-12 w-12 mb-4" />
					<h2 className="text-3xl font-bold text-gray-900 dark:text-white">
						Welcome back
					</h2>
					<p className="mt-2 text-center text-gray-600 dark:text-gray-300">
						Sign in to your OnlyPlans account
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* Email Field */}
					<div>
						<label htmlFor="email" className="label">
							Email Address
						</label>
						<input
							id="email"
							type="email"
							autoComplete="email"
							className={`input ${
								errors.email
									? "border-error-500 focus:border-error-500 focus:ring-error-500"
									: ""
							}`}
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: "Invalid email address",
								},
							})}
						/>
						{errors.email && (
							<p className="mt-1 text-sm text-error-600 dark:text-error-400">
								{errors.email.message}
							</p>
						)}
					</div>

					{/* Password Field */}
					<div>
						<label htmlFor="password" className="label">
							Password
						</label>
						<div className="relative">
							<input
								id="password"
								type={showPassword ? "text" : "password"}
								autoComplete="current-password"
								className={`input pr-10 ${
									errors.password
										? "border-error-500 focus:border-error-500 focus:ring-error-500"
										: ""
								}`}
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 6,
										message:
											"Password must be at least 6 characters",
									},
								})}
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
								onClick={toggleShowPassword}
							>
								{showPassword ? (
									<EyeOff size={20} />
								) : (
									<Eye size={20} />
								)}
							</button>
						</div>
						{errors.password && (
							<p className="mt-1 text-sm text-error-600 dark:text-error-400">
								{errors.password.message}
							</p>
						)}
					</div>

					{/* Remember me and Forgot password */}
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:focus:ring-primary-800 dark:bg-dark-700"
							/>
							<label
								htmlFor="remember-me"
								className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
							>
								Remember me
							</label>
						</div>

						<div className="text-sm">
							<Link
								to="/forgot-password"
								className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
							>
								Forgot your password?
							</Link>
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full btn btn-primary flex justify-center items-center"
						disabled={isLoading}
					>
						{isLoading ? (
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
						) : (
							<>
								<LogIn size={16} className="mr-2" />
								Sign In
							</>
						)}
					</button>
				</form>

				{/* Sign up link */}
				<div className="mt-6 text-center">
					<p className="text-gray-600 dark:text-gray-300">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
						>
							Sign up now
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
