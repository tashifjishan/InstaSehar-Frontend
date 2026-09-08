import { FaInstagram as Instagram, FaFacebookF as Facebook, FaApple as Apple } from "react-icons/fa";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {

  async function handleLogin(data){
    try {
      let response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(data),
        credentials: "include"
      });

      const respOk = response.ok;
      console.log(response.text);
      response = await response.json();
      if(!respOk)
          throw new Error(response.message);
      
      alert("Logged in!");
          
    } catch (error) {
      alert(error.message);
    }
  }

  function submitHandler(e){
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    const cred = {email, password};
    handleLogin(cred);
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-violet-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-black flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-zinc-900">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-12 text-white relative overflow-hidden">

          <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <Instagram size={50} />
            <h1 className="text-5xl font-bold mt-6">
              Connect.
              <br />
              Share.
              <br />
              Inspire.
            </h1>

            <p className="mt-6 text-white/80 text-lg leading-relaxed">
              Discover amazing creators and connect with your friends in one
              beautiful place.
            </p>
          </div>

          <div className="relative flex gap-3">
            <img
              src="https://i.pravatar.cc/60?img=1"
              className="rounded-full border-4 border-white"
            />
            <img
              src="https://i.pravatar.cc/60?img=2"
              className="rounded-full border-4 border-white -ml-4"
            />
            <img
              src="https://i.pravatar.cc/60?img=3"
              className="rounded-full border-4 border-white -ml-4"
            />
            <span className="ml-4 text-white/80 self-center">
              Join 50k+ creators
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-14">

          <div className="text-center mb-10">
            <Instagram
              className="mx-auto text-pink-500"
              size={42}
            />

            <h2 className="text-3xl font-bold mt-4">
              Welcome Back
            </h2>

            <p className="text-gray-500 mt-2">
              Sign in to continue
            </p>
          </div>

          <form className="space-y-5" onSubmit={submitHandler}>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-12 pr-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:bg-zinc-800 dark:border-zinc-700"
              />
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-12 pr-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:bg-zinc-800 dark:border-zinc-700"
              />
            </div>

            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                className="text-pink-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 py-3 font-semibold text-white transition hover:scale-[1.02] active:scale-95">
              Sign In
            </button>

          </form>

          <div className="flex items-center my-8">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="px-4 text-gray-500 text-sm">
              OR
            </span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <div className="space-y-3">

            <button className="flex w-full items-center justify-center gap-3 rounded-xl border py-3 hover:bg-gray-100 dark:hover:bg-zinc-800">
              <Facebook size={20} />
              Continue with Facebook
            </button>

            <button className="flex w-full items-center justify-center gap-3 rounded-xl border py-3 hover:bg-gray-100 dark:hover:bg-zinc-800">
              <Apple size={20} />
              Continue with Apple
            </button>

          </div>

          <p className="mt-8 text-center text-gray-500">
            Don't have an account?
            <button className="ml-2 font-semibold text-pink-500 hover:underline">
              Sign Up
            </button>
          </p>

        </div>

      </div>
    </div>
  );
}