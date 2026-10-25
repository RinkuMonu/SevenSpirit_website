import { useEffect, useState } from "react";

import {

  Link,

  useLocation,

  useNavigate,

  useSearchParams,

} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { useForm } from "react-hook-form";

import { Sparkles } from "lucide-react";

import api, { errMsg } from "../api/axios.js";

import {

  fetchMe,

  register as registerThunk,

} from "../store/authSlice.js";

import Seo from "../components/Seo.jsx";

function Shell({ title, subtitle, children, notice }) {

  return (

    <div className="sky flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">

      <Seo title={title} path="" noindex />

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">

        <div className="mb-5 text-center">

          <Sparkles className="mx-auto text-gold-500" />

          <h1 className="mt-2 text-4xl font-bold text-royal-900">{title}</h1>

          {subtitle && (

            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>

          )}

        </div>

        {notice && (

          <p className="mb-4 rounded-lg bg-royal-50 p-3 text-center text-sm font-medium text-royal-800">

            {notice}

          </p>

        )}

        {children}

      </div>

    </div>

  );

}

const Field = ({ label, error, children }) => (

  <div>

    <label className="label">{label}</label>

    {children}

    {error && (

      <p className="field-error" role="alert">

        {error.message}

      </p>

    )}

  </div>

);

function useAfterAuth() {

  const { state } = useLocation();

  const navigate = useNavigate();

  const from = state?.from;

  return () => {

    const destination =

      from?.pathname?.startsWith("/") &&

      !from.pathname.startsWith("//")

        ? `${from.pathname}${from.search || ""}${from.hash || ""}`

        : "/";

    navigate(destination, { replace: true });

  };

}

export function Login() {

  const { state } = useLocation();

  const dispatch = useDispatch();

  const { loading } = useSelector((s) => s.auth);

  const afterAuth = useAfterAuth();

  const [error, setError] = useState("");

  const [otpState, setOtpState] = useState({

    email: "",

    sent: false,

    sending: false,

    countdown: 0,

    message: "",

  });

  const {

    register,

    handleSubmit,

    getValues,

    formState: { errors },

  } = useForm();

  const sendOtp = async (email) => {

    const validEmail = (email || "").trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(validEmail)) return;

    setOtpState((prev) => ({

      ...prev,

      email: validEmail,

      sending: true,

      sent: false,

      message: "Sending OTP…",

    }));

    try {

      await api.post("/auth/resend-email-otp", { email: validEmail });

      setOtpState((prev) => ({

        ...prev,

        email: validEmail,

        sent: true,

        sending: false,

        countdown: 60,

        message: "OTP sent to your email. Enter the 6-digit code below.",

      }));

    } catch (e) {

      setOtpState((prev) => ({

        ...prev,

        sending: false,

        sent: false,

        message: errMsg(e),

      }));

    }

  };

  useEffect(() => {

    if (otpState.countdown <= 0) return undefined;

    const timer = setInterval(() => {

      setOtpState((prev) => ({

        ...prev,

        countdown: Math.max(0, prev.countdown - 1),

      }));

    }, 1000);

    return () => clearInterval(timer);

  }, [otpState.countdown]);

  const onSubmit = async (v) => {
    const email = (v.email || "").trim().toLowerCase();
    const otp = (v.otp || "").trim();
    setError("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit OTP sent to your email");
      return;
    }

    try {
      const res = await api.post("/auth/verify-email-otp", { email, otp });
      const token =
        res?.data?.token ||
        res?.data?.data?.token ||
        res?.data?.accessToken;

      if (!token) {
        throw new Error(
          res?.data?.message ||
            "OTP verified, but the server did not return a login token."
        );
      }

      localStorage.setItem("token", token);
      await dispatch(fetchMe()).unwrap();
      afterAuth();
    } catch (e) {
      setError(typeof e === "string" ? e : errMsg(e));
    }
  };

  const intent = state?.intent;

  return (

    <Shell

      title="Welcome back"

      subtitle="Log in to your account"

      notice={

        intent

          ? "Login to continue with your consultation."

          : state?.expired

            ? "Your session expired. Please log in again."

            : ""

      }

    >

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

        <Field label="Email" error={errors.email}>

          <input

            type="email"

            className="input"

            autoComplete="email"

            {...register("email", {

              required: "Enter your email",

              pattern: {

                value: /^\S+@\S+\.\S+$/,

                message: "Enter a valid email",

              },

            })}

            onBlur={(e) => {

              const email = e.target.value.trim().toLowerCase();

              if (

                email &&

                /^\S+@\S+\.\S+$/.test(email) &&

                email !== otpState.email

              ) {

                sendOtp(email);

              }

            }}

          />

        </Field>

        <div className="flex items-center justify-between gap-2">

          <p className="text-xs text-slate-600">

            {otpState.message || "OTP will be sent to your email"}

          </p>

          <button

            type="button"

            className="text-xs font-semibold text-royal-700 hover:underline disabled:text-slate-400"

            disabled={otpState.sending || otpState.countdown > 0}

            onClick={() => sendOtp(getValues("email"))}

          >

            {otpState.countdown > 0

              ? `Resend in ${otpState.countdown}s`

              : "Send OTP"}

          </button>

        </div>

        <Field label="OTP" error={errors.otp}>

          <input

            type="text"

            inputMode="numeric"

            maxLength={6}

            className="input"

            autoComplete="one-time-code"

            placeholder="Enter 6-digit OTP"

            {...register("otp", {

              required: "Enter the 6-digit OTP",

              pattern: { value: /^\d{6}$/, message: "Enter the 6-digit OTP" },

            })}

          />

        </Field>

        {error && (

          <p

            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"

            role="alert"

          >

            {error}

          </p>

        )}

        <button

          className="btn-gold w-full"

          disabled={loading || otpState.sending}

        >

          {loading

            ? "Logging in…"

            : otpState.sending

              ? "Sending OTP…"

              : "Login with OTP"}

        </button>

        <div className="flex justify-between text-sm">

          <Link

            to="/forgot-password"

            className="text-royal-700 hover:underline"

          >

            Forgot password?

          </Link>

        </div>

      </form>

      <div className="mt-5 border-t pt-5 text-center text-sm text-slate-600">

        New here?

        <Link to="/register" state={state} className="btn-outline mt-2 w-full">

          Create Account

        </Link>

      </div>

    </Shell>

  );

}

export function Register() {

  const { state } = useLocation();

  const dispatch = useDispatch();

  const { loading } = useSelector((s) => s.auth);

  const afterAuth = useAfterAuth();

  const [error, setError] = useState("");

  const {

    register,

    handleSubmit,

    formState: { errors },

  } = useForm();

const onSubmit = async (v) => {

  setError("");

  const payload = {

    name: (v.name || "").trim(),

    email: (v.email || "").trim().toLowerCase(),

    mobile: (v.mobile || "").trim(),

    password: v.password,

  };

  try {

    const result = await dispatch(registerThunk(payload)).unwrap();

    if (result?.token) {

      localStorage.setItem("token", result.token);

      await dispatch(fetchMe()).unwrap();

      afterAuth();

    } else {

      throw new Error("Registration succeeded without a login token.");

    }

  } catch (e) {

    setError(typeof e === "string" ? e : errMsg(e));

  }

};

  return (

    <Shell

      title="Create account"

      subtitle="It takes less than a minute"

      notice={

        state?.intent

          ? "Create an account to continue with your consultation."

          : ""

      }

    >

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

        <Field label="Full name" error={errors.name}>

          <input

            className="input"

            autoComplete="name"

            {...register("name", {

              required: "Enter your name",

              minLength: { value: 2, message: "Name is too short" },

            })}

          />

        </Field>

        <Field label="Email" error={errors.email}>

          <input

            type="email"

            className="input"

            autoComplete="email"

            {...register("email", {

              required: "Enter your email",

              pattern: {

                value: /^\S+@\S+\.\S+$/,

                message: "Enter a valid email",

              },

            })}

          />

        </Field>

        <Field label="Mobile" error={errors.mobile}>

          <input

            inputMode="numeric"

            maxLength={10}

            className="input"

            autoComplete="tel"

            placeholder="10-digit number"

            {...register("mobile", {

              required: "Enter your mobile number",

              pattern: {

                value: /^[6-9]\d{9}$/,

                message: "Enter a valid 10-digit mobile number",

              },

            })}

          />

        </Field>

        <Field label="Password" error={errors.password}>

          <input

            type="password"

            className="input"

            autoComplete="new-password"

            {...register("password", {

              required: "Choose a password",

              minLength: { value: 8, message: "Use at least 8 characters" },

            })}

          />

        </Field>

        {error && (

          <p

            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"

            role="alert"

          >

            {error}

          </p>

        )}

        <button className="btn-gold w-full" disabled={loading}>

          {loading ? "Creating…" : "Create Account"}

        </button>

      </form>

      <p className="mt-5 border-t pt-5 text-center text-sm text-slate-600">

        Already registered?{" "}

        <Link

          to="/login"

          state={state}

          className="font-semibold text-royal-700 hover:underline"

        >

          Login

        </Link>

      </p>

    </Shell>

  );

}

export function ForgotPassword() {

  const [msg, setMsg] = useState("");

  const [error, setError] = useState("");

  const {

    register,

    handleSubmit,

    formState: { errors, isSubmitting },

  } = useForm();

  const onSubmit = async (v) => {

    setError("");

    try {

      setMsg(

        (await api.post("/auth/forgot-password", { email: v.email })).data

          .message,

      );

    } catch (e) {

      setError(errMsg(e));

    }

  };

  return (

    <Shell title="Forgot password" subtitle="We will email you a reset link">

      {msg ? (

        <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">

          {msg}

        </p>

      ) : (

        <form

          onSubmit={handleSubmit(onSubmit)}

          className="space-y-4"

          noValidate

        >

          <Field label="Email" error={errors.email}>

            <input

              type="email"

              className="input"

              {...register("email", {

                required: "Enter your email",

                pattern: {

                  value: /^\S+@\S+\.\S+$/,

                  message: "Enter a valid email",

                },

              })}

            />

          </Field>

          {error && (

            <p

              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"

              role="alert"

            >

              {error}

            </p>

          )}

          <button className="btn-gold w-full" disabled={isSubmitting}>

            Send reset link

          </button>

        </form>

      )}

      <p className="mt-5 text-center text-sm">

        <Link to="/login" className="text-royal-700 hover:underline">

          Back to login

        </Link>

      </p>

    </Shell>

  );

}

export function ResetPassword() {

  const [params] = useSearchParams();

  const navigate = useNavigate();

  const token = params.get("token") || "";

  const [error, setError] = useState("");

  const {

    register,

    handleSubmit,

    watch,

    formState: { errors, isSubmitting },

  } = useForm();

  const onSubmit = async (v) => {

    setError("");

    try {

      await api.post("/auth/reset-password", { token, password: v.password });

      navigate("/login", { replace: true });

    } catch (e) {

      setError(errMsg(e));

    }

  };

  return (

    <Shell title="Reset password" subtitle="Choose a new password">

      {!token ? (

        <p className="text-center text-sm text-red-700">

          This reset link is incomplete. Request a new one.

        </p>

      ) : (

        <form

          onSubmit={handleSubmit(onSubmit)}

          className="space-y-4"

          noValidate

        >

          <Field label="New password" error={errors.password}>

            <input

              type="password"

              className="input"

              autoComplete="new-password"

              {...register("password", {

                required: "Choose a password",

                minLength: { value: 8, message: "Use at least 8 characters" },

              })}

            />

          </Field>

          <Field label="Confirm password" error={errors.confirm}>

            <input

              type="password"

              className="input"

              autoComplete="new-password"

              {...register("confirm", {

                validate: (v) =>

                  v === watch("password") || "Passwords do not match",

              })}

            />

          </Field>

          {error && (

            <p

              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"

              role="alert"

            >

              {error}

            </p>

          )}

          <button className="btn-gold w-full" disabled={isSubmitting}>

            Update password

          </button>

        </form>

      )}

      <p className="mt-5 text-center text-sm">

        <Link to="/forgot-password" className="text-royal-700 hover:underline">

          Request a new link

        </Link>

      </p>

    </Shell>

  );

}
