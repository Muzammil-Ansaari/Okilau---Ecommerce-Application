import { useState } from "react";
import { MapPin, Mail, Clock } from "lucide-react";
import Button from "../components/UI/Button";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.email.includes("@")) newErrors.email = "Enter a valid email";
    if (!form.message) newErrors.message = "Message is required";
    return newErrors;
  };

  // handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.log(error);
      setErrors({ message: "Failed to send message. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen">
      {/* ── Hero Banner ── */}
      <div className="flex h-48 items-center justify-center bg-[#F5F5F5] sm:h-80">
        <div className="text-center">
          <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
            Get In Touch
          </p>
          <h1 className="font-['Anton'] text-4xl uppercase tracking-widest text-black sm:text-6xl">
            Contact Us
          </h1>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="px-4 py-20 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* ── Left — Contact Info ── */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-['Anton'] text-2xl uppercase tracking-widest text-black">
                We'd Love to Hear From You
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Have a question about your order, a product, or just want to say
                hello? Fill out the form and we'll get back to you as soon as
                possible.
              </p>
            </div>

            {/* Info Cards */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 bg-[#F5F5F5] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-black text-white">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Our Store</p>
                  <p className="mt-1 text-sm text-gray-500">
                    123 Fashion Street, Gulberg III
                    <br />
                    Lahore, Punjab, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-[#F5F5F5] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-black text-white">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Email Us</p>
                  <p className="mt-1 text-sm text-gray-500">
                    support@okilau.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-[#F5F5F5] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-black text-white">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">
                    Working Hours
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Monday – Saturday: 10am – 8pm
                    <br />
                    Sunday: 12pm – 6pm
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right — Contact Form ── */}
          <div>
            {submitted ? (
              // Success state
              <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#F5F5F5] p-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
                  <Mail size={28} />
                </div>
                <h3 className="font-['Anton'] text-xl uppercase tracking-widest text-black">
                  Message Sent!
                </h3>
                <p className="text-sm text-gray-500">
                  Thank you for reaching out. We'll get back to you within 24
                  hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                  className="text-xs text-gray-400 underline underline-offset-4 hover:text-black"
                >
                  Send another message
                </button>
              </div>
            ) : (
              // Form
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium uppercase tracking-widest text-gray-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`border px-4 py-3 text-sm outline-none transition-colors focus:border-black ${
                      errors.name ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium uppercase tracking-widest text-gray-500">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`border px-4 py-3 text-sm outline-none transition-colors focus:border-black ${
                      errors.email ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium uppercase tracking-widest text-gray-500">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    rows={6}
                    className={`resize-none border px-4 py-3 text-sm outline-none transition-colors focus:border-black ${
                      errors.message ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="black"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
