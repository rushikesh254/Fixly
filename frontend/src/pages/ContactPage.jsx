import { useForm } from "react-hook-form";
import { CiCircleQuestion, CiMail, CiPhone } from "react-icons/ci";
import { LuMapPin } from "react-icons/lu";
import { Link } from "react-router-dom";
import PageHero from "../components/home/PageHero";

import PrimaryBtn from "../components/ui/PrimaryBtn";

function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    reset();
  };

  return (
    <div>
      <PageHero
        img="https://images.unsplash.com/photo-1528747045269-390fe33c19f2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        title="Contact Us"
        subtitle="Contact"
        position="45%"
      />
      <section className="relative w-full overflow-hidden bg-slate-50 px-6 py-14 md:px-10 md:py-20 lg:px-20">
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl"></div>
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blue-300/50 blur-3xl"></div>

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl shadow-blue-100/40 md:p-8">
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-[0.25em] mb-3 text-blue-700">
                GET IN TOUCH
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Send us a message
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
              <div className="grid gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-slate-800"
                >
                  Full name
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  id="name"
                  type="text"
                  spellCheck="false"
                  placeholder="Your full name"
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-800"
                >
                  Email address
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  spellCheck="false"
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none "
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="message"
                  className="text-sm font-semibold text-slate-800"
                >
                  Message
                </label>
                <textarea
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message should be at least 10 characters",
                    },
                  })}
                  id="message"
                  placeholder="Tell us how we can help you"
                  rows={6}
                  className="resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none "
                  spellCheck="false"
                ></textarea>
                {errors.message && (
                  <p className="text-xs text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <PrimaryBtn
                btn={isSubmitting ? "Sending..." : "Send Message"}
                className="mt-2 w-full md:w-auto"
              />
            </form>
          </div>

          <aside className="lg:col-span-2 rounded-3xl border border-gray-300 bg-linear-to-br from-gray-50 to-gray-100 p-6 text-gray-900 shadow-xl shadow-gray-200/50 md:p-8">
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-[0.25em] text-gray-600 mb-2">
                REACH OUT
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                Get in Touch
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-700 md:text-base">
                We are here to help! Available Monday to Saturday, 9:00 AM to
                8:00 PM.
              </p>
            </div>
            <div>
              <ul className="space-y-6 text-sm text-gray-700">
                <li className="flex items-center gap-3">
                  <LuMapPin className="w-5 h-5 text-gray-500" />
                  <span>123 Main Street, Prayagraj, Uttar Pradesh, India</span>
                </li>
                <li className="flex items-center gap-3">
                  <CiMail className="w-5 h-5 text-gray-500" />
                  <span>
                    <Link to="mailto:info@fixly.com">info@fixly.com</Link>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CiPhone className="w-5 h-5 text-gray-500" />
                  <span>
                    <Link to="tel:+11234567890">+1 (123) 456-7890</Link>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span>
                    <CiCircleQuestion className="w-5 h-5 text-gray-500" />
                  </span>
                  Online Support 24/7 - Any Question on any time
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
