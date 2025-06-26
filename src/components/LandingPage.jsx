import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBlog, FaComments, FaUserFriends, FaArrowRight, FaUserPlus, FaCode } from "react-icons/fa";

const features = [
  {
    icon: <FaBlog className="text-4xl text-primary" />,
    title: "Share Blogs",
    desc: "Write, publish, and discover insightful blogs from fellow developers.",
    route: "/blogs",
  },
  {
    icon: <FaComments className="text-4xl text-secondary" />,
    title: "Real-time Chat",
    desc: "Message friends and peers instantly, share blogs in chat, and enjoy a WhatsApp-like experience.",
    route: "/chat",
  },
  {
    icon: <FaUserFriends className="text-4xl text-accent" />,
    title: "Build Connections",
    desc: "Grow your network, send and receive connection requests, and collaborate on projects.",
    route: "/connections",
  },
  {
    icon: <FaUserPlus className="text-4xl text-info" />,
    title: "Discover Developers",
    desc: "Find new developers, see trending blogs, and get inspired by the community.",
    route: "/discover",
  },
  {
    icon: <FaCode className="text-4xl text-success drop-shadow-lg" />,
    title: "Code Review & AI Summary",
    desc: "Submit code for peer review, get AI-powered summaries.",
    route: "/code-review",
  },
];

const testimonials = [
  {
    name: "Aarav S.",
    text: "CodeCrush helped me connect with amazing devs and share my journey. The chat and blog features are top-notch!",
  },
  {
    name: "Priya K.",
    text: "I love the clean UI and how easy it is to find trending blogs. The community is super friendly!",
  },
  {
    name: "Rahul M.",
    text: "The mobile experience is fantastic. I can chat and blog on the go!",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user.user);
  const [testimonialIdx, setTestimonialIdx] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((idx) => (idx + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Hero Section */}
      <section
        id="hero-bg-parallax"
        className="relative overflow-hidden bg-base py-24"
        style={{
          background: "linear-gradient(120deg, var(--p)/10 0%, var(--s)/10 100%)",
          backgroundAttachment: "fixed",
          width: '100vw',
          minWidth: '100vw',
          position: 'relative',
        }}
        aria-label="Hero section"
      >
        {/* Animated SVG Wave Background */}
        <svg
          className="absolute top-0 left-0 w-full h-32 md:h-48 z-0"
          style={{ width: '100vw', minWidth: '100vw', maxWidth: '100vw', left: 0 }}
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#waveGradient)"
            fillOpacity="0.3"
            d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--p)" />
              <stop offset="100%" stopColor="var(--s)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Floating Circles */}
        <div className="absolute -top-28 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float z-10" />
        <div className="absolute -bottom-28 right-0 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-float-reverse z-10" />
        <div className="relative z-20 flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-bold text-primary font-serif mb-4">
              Welcome to <span className="text-primary-content">CodeCrush</span>
            </h1>
            <p className="py-4 text-lg md:text-xl text-base-content">
              Empowering developers with <span className="text-primary font-semibold">blogs</span>, <span className="text-primary font-semibold">real-time chat</span>, <span className="text-primary font-semibold">networking</span>, <span className="text-primary font-semibold">code review</span>, and <span className="text-primary font-semibold">AI summaries</span> of the best reviews — all in one place.
            </p>
            <div className="flex gap-4 mt-6">
              {!user && (
                <button
                  className="btn btn-secondary btn-lg rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-primary text-secondary-content"
                  onClick={() => navigate("/login")}
                >
                  Get Started <FaArrowRight />
                </button>
              )}
              <button
                className="btn btn-outline btn-primary btn-lg rounded-full shadow hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary text-primary-content"
                onClick={() => navigate("/blogs")}
              >
                View Blogs
              </button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="/logo.png"
              alt="CodeCrush Logo"
              className="w-48 h-48 md:w-60 md:h-60 rounded-xl border border-base-200 bg-base p-4 animate-logo-float-rotate shadow-xl"
            />
          </div>
        </div>
        {/* Scroll Down Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center opacity-80 animate-bounce-once">
          <span className="text-base-content text-xs mb-1">Scroll Down</span>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary animate-bounce" aria-hidden="true"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </div>
        {/* Animations */}
        <style>{`
          .animate-logo-float-rotate {
            animation: logoFloatRotate 4s ease-in-out infinite;
          }
          @keyframes logoFloatRotate {
            0%, 100% { transform: translateY(0) rotate(-4deg); }
            50% { transform: translateY(-14px) rotate(4deg); }
          }
          .animate-bounce-once {
            animation: bounceOnce 1.2s 1;
          }
          @keyframes bounceOnce {
            0% { transform: translateY(0); }
            30% { transform: translateY(-16px); }
            50% { transform: translateY(0); }
            100% { transform: translateY(0); }
          }
          .animate-float {
            animation: floatUpDown 7s ease-in-out infinite;
          }
          .animate-float-reverse {
            animation: floatDownUp 8s ease-in-out infinite;
          }
          @keyframes floatUpDown {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-32px); }
          }
          @keyframes floatDownUp {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(32px); }
          }
        `}</style>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-base-100">
        <h2 className="text-4xl font-extrabold text-center text-base-content mb-12 font-serif">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto px-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card bg-base-200 shadow-xl hover:scale-105 transition-transform border-t-4 border-primary flex flex-col items-center justify-center cursor-pointer group"
              tabIndex={0}
              role="button"
              onClick={() => navigate(user ? f.route : "/login")}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(user ? f.route : "/login"); }}
              aria-label={f.title}
            >
              <div className="card-body items-center text-center p-6">
                <div className="mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">{f.icon}</div>
                <h3 className="card-title text-lg font-semibold text-primary-content mb-2">{f.title}</h3>
                <p className="text-base-content text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Code Review & AI Summary Highlight Section */}
      <section className="py-16 bg-gradient-to-br from-success/10 via-base-100 to-info/10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 px-4">
          {/* Left: Info */}
          <div className="flex-1 flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
            <h3 className="text-3xl font-extrabold text-secondary-content mb-2">Code Review Platform</h3>
            <ul className="list-disc ml-6 text-base-content text-lg mb-2 text-left">
              <li>Submit code snippets for review in any language</li>
              <li>Receive peer reviews and upvotes</li>
              <li>AI generates a summary of the top reviews for your code</li>
            </ul>
            <div className="flex flex-wrap gap-4 mt-2 justify-center lg:justify-start">
              <button
                className="btn btn-success rounded-full px-8 py-3 font-semibold text-lg shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-success text-success-content border-2 border-success"
                onClick={() => navigate("/code-review")}
              >
                Try Code Review
              </button>
            </div>
          </div>
          {/* Right: Visual mockup */}
          <div className="flex-1 flex justify-center w-full">
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-success flex flex-col items-center">
              <div className="card-body w-full p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-accent badge-outline text-xs">python</span>
                  <span className="badge badge-info text-xs">AI Summary</span>
                </div>
                <pre className="rounded p-2 text-xs overflow-x-auto max-h-32 mb-2 bg-base-200 border border-base-300 font-mono text-left">def add(a, b):\n    return a + b</pre>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="badge badge-primary text-xs">#function</span>
                  <span className="badge badge-primary text-xs">#python</span>
                </div>
                <div className="alert alert-info p-2 mb-2 text-xs">
                  <span className="font-bold">AI Summary:</span> Simple function to add two numbers. Consider adding input validation.
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-secondary font-bold">Upvotes: 5</span>
                  <span className="badge badge-outline text-xs">Reviews: 4</span>
                </div>
                <div className="text-xs text-base-content">"Great use of Python functions!"</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-base-200">
        <h2 className="text-3xl font-extrabold text-center mb-10 text-base-content font-serif">How It Works</h2>
        <div className="flex justify-center">
          <ul className="steps steps-vertical md:steps-horizontal w-full max-w-4xl">
            <li className="step step-primary text-base-content" data-content="1">
              <span className="font-semibold">Sign up and personalize your profile.</span>
            </li>
            <li className="step step-secondary text-base-content" data-content="2">
              <span className="font-semibold">Connect with developers and grow your tech circle.</span>
            </li>
            <li className="step step-primary text-base-content" data-content="3">
              <span className="font-semibold">Start blogging, chatting, and collaborating — all in real-time.</span>
            </li>
            <li className="step step-success text-base-content" data-content="4">
              <span className="font-semibold">Submit code for review and get AI-powered feedback.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Why CodeCrush for Code Review Section */}
      <section className="py-16 bg-gradient-to-br from-info/10 via-base-100 to-success/10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 px-4">
          <div className="flex-1 flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
            <h3 className="text-2xl font-extrabold text-info mb-2">Why CodeCrush for Code Review?</h3>
            <ul className="list-disc ml-6 text-base-content text-lg mb-2 text-left">
              <li>Modern, interactive code review experience</li>
              <li>AI-powered summaries for quick insights</li>
              <li>Share reviews in chat and collaborate instantly</li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center w-full mt-8 lg:mt-0">
            <div className="stats shadow bg-base-200 w-full max-w-md">
              <div className="stat">
                <div className="stat-title">Code Reviews</div>
                <div className="stat-value text-info">1,200+</div>
                <div className="stat-desc">Peer-reviewed snippets</div>
              </div>
              <div className="stat">
                <div className="stat-title">AI Summaries</div>
                <div className="stat-value text-success">500+</div>
                <div className="stat-desc">AI-powered feedback</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-base-100">
        <h2 className="text-3xl font-extrabold text-center text-primary mb-10 font-serif">What Our Users Say</h2>
        <div className="flex justify-center items-center w-full">
          <div className="w-full max-w-lg flex flex-col items-center">
            <div className="w-full flex flex-col items-center justify-center">
              <div className="card bg-base-200 shadow-xl border border-primary rounded-2xl px-8 py-10 flex flex-col items-center min-h-[320px] transition-all duration-500">
                <div className="flex w-full justify-center items-center mb-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-4 border-primary bg-gradient-to-br from-primary/80 via-secondary/60 to-info/60 text-white text-5xl font-extrabold select-none">
                    {testimonials[testimonialIdx].name && testimonials[testimonialIdx].name.trim() ? testimonials[testimonialIdx].name.trim()[0] : (
                      <svg className="w-10 h-10 text-white opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20c0-2.2 3.6-4 6-4s6 1.8 6 4"/></svg>
                    )}
                  </div>
                </div>
                <p className="italic text-lg text-base-content text-center mb-6 max-w-md">"{testimonials[testimonialIdx].text}"</p>
                <div className="text-base font-bold text-primary text-center">— {testimonials[testimonialIdx].name}</div>
              </div>
            </div>
            {/* Carousel controls */}
            <div className="flex justify-center gap-4 mt-8 items-center">
              <button
                className="btn btn-circle btn-outline btn-primary"
                onClick={() => setTestimonialIdx((testimonialIdx - 1 + testimonials.length) % testimonials.length)}
                aria-label="Previous testimonial"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
              </button>
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  className={`btn btn-xs btn-circle ${idx === testimonialIdx ? "bg-primary scale-125" : "bg-base-content/30"}`}
                  onClick={() => setTestimonialIdx(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
              <button
                className="btn btn-circle btn-outline btn-primary"
                onClick={() => setTestimonialIdx((testimonialIdx + 1) % testimonials.length)}
                aria-label="Next testimonial"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <div className="py-20 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="max-w-3xl mx-auto card bg-base-200 shadow-2xl border-2 border-primary rounded-3xl">
          <div className="card-body flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-4xl font-extrabold mb-2 text-primary-content drop-shadow-lg">Join the CodeCrush Community</h3>
              <p className="text-lg mb-6 text-primary-content/90">Create your dev profile, start sharing, and connect today!</p>
              <div className="flex gap-4 mt-2 flex-wrap">
                {!user && (
                  <button
                    className="btn btn-secondary rounded-full px-8 py-3 font-semibold text-lg shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-secondary text-secondary-content border-2 border-secondary"
                    onClick={() => navigate("/login")}
                  >
                    Get Started
                  </button>
                )}
                <button
                  className="btn btn-primary rounded-full px-8 py-3 font-semibold text-lg shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary text-primary-content border-2 border-primary"
                  onClick={() => navigate("/blogs")}
                >
                  View Blogs
                </button>
                <button
                  className="btn btn-secondary rounded-full px-8 py-3 font-semibold text-lg shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-base text-secondary-content border-2 border-base"
                  onClick={() => navigate("/discover")}
                >
                  See Trending Developers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
