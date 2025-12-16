import React from "react";
import GlassyRippleButton from "@/components/GlassyRippleButton";

function Home() {
  return (
    <section className="min-h-[90vh] pt-5 md:pt-0 pb-15 md:pb-0  flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white px-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <span className="inline-block px-4 py-1 text-sm rounded-full bg-white/10 backdrop-blur border border-white/20">
            🎓 Modern Learning Management System
          </span>

          <h1 className="text-xl md:text-5xl font-bold leading-tight">
            Learn Skills That <br /> Actually Get You Hired
          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-xl">
            A practical LMS where instructors build real-world courses and
            students learn through structured content, progress tracking,
            and certifications.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="/explore"
              style={{color:"white"}}
              className="px-6 py-3 rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-300 transition"
            >
              Explore Courses
            </a>

            <a
              href="/signup"
              className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur hover:bg-white/20 transition"
            >
              Get started
            </a>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
          
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold">
              Why Choose This LMS?
            </h3>

            <ul className="space-y-3 text-sm text-gray-300">
              <li>✔ Structured Courses with Progress Tracking</li>
              <li>✔ Secure Payments & Course Enrollment</li>
              <li>✔ Instructor Dashboard & Analytics</li>
              <li>✔ Scalable Backend Architecture</li>
            </ul>

            <GlassyRippleButton />
          </div>
        </div>

      </div>
    </section>
  );
}

export default Home;
