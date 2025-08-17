import "../index.css";
import { useForm } from "react-hook-form";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import {
  phoneValidation,
  emailValidation,
  passwordValidation,
  usernameValidation,
} from "../components/Validation";

function SignUpPage() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      if (res.status === 201) {
        localStorage.setItem("accessToken", res.data.accessToken);

        const { user_id, email, phone, username } = res.data.user;
        setUser({ user_id, email, phone, username });

        axiosInstance.post("/user-info", { user_id }).catch(() => {
          /* non-fatal – ignore */
        });

        navigate("/");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Error signing up. Please check your details and try again.";
      setError("root", { message: msg });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <img
            className="mx-auto h-32 w-auto"
            src="/assets/DevSphere-Logo-main.png"
            alt="DevSphere Logo"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Join DevSphere
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Create your account and start connecting with developers
          </p>
        </div>

        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Username
                </label>
                <input
                  {...register("username", usernameValidation)}
                  type="text"
                  id="username"
                  className="input-field"
                  placeholder="Choose a username"
                />
                {errors.username && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Phone Number
                </label>
                <input
                  {...register("phone", phoneValidation)}
                  type="tel"
                  id="phone"
                  className="input-field"
                  placeholder="1234567890"
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  {...register("email", emailValidation)}
                  type="email"
                  id="email"
                  className="input-field"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  {...register("password", passwordValidation)}
                  type="password"
                  id="password"
                  className="input-field"
                  placeholder="Create a strong password"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3 text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {errors.root && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                {errors.root.message}
              </div>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/login"
                className="font-medium text-primary-400 hover:text-primary-300 transition-colors duration-200"
              >
                Sign in here
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
