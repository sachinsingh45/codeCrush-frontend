import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBlog, FaComments, FaUserFriends, FaArrowRight, FaUserPlus } from "react-icons/fa";

const features = [
  {
    icon: <FaBlog className="text-3xl text-primary" />,
    title: "Share Blogs",
    desc: "Write, publish, and discover insightful blogs from fellow developers.",
  },
  {
    icon: <FaComments className="text-3xl text-secondary" />,
    title: "Real-time Chat",
    desc: "Message friends and peers instantly, share blogs in chat, and enjoy a WhatsApp-like experience.",
  },
  {
    icon: <FaUserFriends className="text-3xl text-accent" />,
    title: "Build Connections",
    desc: "Grow your network, send and receive connection requests, and collaborate on projects.",
  },
  {
    icon: <FaUserPlus className="text-3xl text-info" />,
    title: "Discover Developers",
    desc: "Find new developers, see trending blogs, and get inspired by the community.",
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

const useStaggeredFade = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    animationDelay: `${0.2 + i * 0.12}s`,
  }));
};

const LandingPage = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const [testimonialIdx, setTestimonialIdx] = React.useState(0);
  const featureFadeStyles = useStaggeredFade(features.length);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((idx) => (idx + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("hero-bg-parallax");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-base-600 font-sans transition-colors overflow-x-hidden">
      {/* Hero Section */}
      <section
        id="hero-bg-parallax"
        className="relative overflow-hidden bg-base py-24"
        style={{
          background: "linear-gradient(120deg, var(--p)/10 0%, var(--s)/10 100%)",
          backgroundAttachment: "fixed",
          width: '100%',
          minWidth: '0',
          position: 'relative',
        }}
        aria-label="Hero section"
      >
        {/* Animated SVG Wave Background */}
        <svg
          className="absolute top-0 left-0 w-full h-32 md:h-48 z-0"
          style={{ width: '100%', minWidth: 0, maxWidth: '100%', left: 0 }}
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
            <h2 className="text-xl md:text-2xl text-base-content mb-4 font-light">
              Where Developers Connect, Blog, and Grow Together
            </h2>
            <p className="text-lg md:text-xl text-base-content max-w-xl mb-8">
              Your one-stop platform for <span className="text-primary font-semibold">blogs</span>,{" "}
              <span className="text-primary font-semibold">real-time chat</span>, and{" "}
              <span className="text-primary font-semibold">developer networking</span>.
            </p>
            <div className="flex gap-4 mt-4">
              {!user && (
                <button
                  className="btn btn-secondary btn-lg rounded-full shadow-md animate-bounce-once focus:outline-none focus:ring-2 focus:ring-primary text-secondary-content"
                  onClick={() => navigate("/login")}
                  aria-label="Get Started"
                >
                  Get Started <FaArrowRight />
                </button>
              )}
              <button
                className="btn btn-outline btn-primary btn-lg rounded-full shadow hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary text-primary-content"
                onClick={() => navigate("/blogs")}
                aria-label="View Blogs"
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
      </section>

      {/* Features */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-20 relative bg-base">
        <div className="absolute inset-0 pointer-events-none z-0" style={{background: "radial-gradient(circle at 80% 20%, var(--s)/10 0%, transparent 70%)"}} />
        <h2 className="text-4xl font-extrabold text-center text-base-content mb-12 font-serif animate-gradient-shimmer-text">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 z-10 relative">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card card-bordered bg-base text-base-content transition-all duration-300 hover:scale-110 hover:shadow-2xl rounded-xl p-8 text-center animate-stagger-fade group focus-within:ring-2 focus-within:ring-primary"
              style={featureFadeStyles[i]}
              tabIndex={0}
              aria-label={f.title}
            >
              <div className="mb-4 text-primary group-hover:scale-125 transition-transform duration-300">{f.icon}</div>
              <h3 className="text-lg font-semibold text-primary-content mb-2 animate-gradient-x">{f.title}</h3>
              <p className="text-sm text-base-content leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-16 bg-base">
        <h2 className="text-3xl font-extrabold text-center mb-10 text-base-content font-serif animate-gradient-shimmer-text">How It Works</h2>
        <ol className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 relative">
          <li className="flex flex-col items-center flex-1 relative">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-content text-2xl font-bold shadow-lg mb-2 border-4 border-base"><span>1</span></div>
            <p className="text-base-content text-center">Sign up and personalize your profile.</p>
            <div className="hidden md:block absolute right-0 top-1/2 w-16 h-1 bg-primary -translate-y-1/2" />
          </li>
          <li className="flex flex-col items-center flex-1 relative">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-secondary-content text-2xl font-bold shadow-lg mb-2 border-4 border-base"><span>2</span></div>
            <p className="text-base-content text-center">Connect with developers and grow your tech circle.</p>
            <div className="hidden md:block absolute right-0 top-1/2 w-16 h-1 bg-secondary -translate-y-1/2" />
          </li>
          <li className="flex flex-col items-center flex-1">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-content text-2xl font-bold shadow-lg mb-2 border-4 border-base"><span>3</span></div>
            <p className="text-base-content text-center">Start blogging, chatting, and collaborating — all in real-time.</p>
          </li>
        </ol>
      </section>

      {/* Testimonials */}
      <section className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-16 bg-base">
        <h2 className="text-3xl font-extrabold text-center text-primary mb-10 font-serif animate-gradient-shimmer-text">What Our Users Say</h2>
        <div className="card bg-base p-10 rounded-xl shadow-2xl transition-all duration-700 animate-testimonial-fade border-l-4 border-primary flex flex-col items-center relative">
          {/* User avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content text-2xl font-bold mb-4 shadow-lg">
            {testimonials[testimonialIdx].name.split(' ')[0][0]}
          </div>
          <p className="text-base-content italic mb-4 text-center text-lg">
            "{testimonials[testimonialIdx].text}"
          </p>
          <div className="text-sm font-bold text-primary">— {testimonials[testimonialIdx].name}</div>
          {/* Carousel arrows */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-base hover:bg-primary/20 rounded-full p-2 shadow focus:outline-none"
            onClick={() => setTestimonialIdx((testimonialIdx - 1 + testimonials.length) % testimonials.length)}
            aria-label="Previous testimonial"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 17l-5-5 5-5"/></svg>
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-base hover:bg-primary/20 rounded-full p-2 shadow focus:outline-none"
            onClick={() => setTestimonialIdx((testimonialIdx + 1) % testimonials.length)}
            aria-label="Next testimonial"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 7l5 5-5 5"/></svg>
          </button>
        </div>
        <div className="flex justify-center mt-4 gap-2">
          {testimonials.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                idx === testimonialIdx ? "bg-primary scale-125" : "bg-base-content/30"
              }`}
              onClick={() => setTestimonialIdx(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-20">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-primary bg-gradient-to-br from-primary via-secondary to-primary p-1">
          <div className="relative bg-base bg-opacity-90 rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Soft Glow Overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{boxShadow: '0 0 80px 10px var(--primary)', opacity: 0.15, zIndex: 1}} />
            <div className="z-10 flex-1">
              <h3 className="text-4xl font-extrabold mb-2 text-primary-content drop-shadow-lg">Join the CodeCrush Community</h3>
              <p className="text-lg mb-6 text-primary-content/90">Create your dev profile, start sharing, and connect today!</p>
              <div className="flex gap-4 mt-2 flex-wrap">
                {!user && (
                  <button
                    className="btn btn-secondary rounded-full px-8 py-3 font-semibold text-lg shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-secondary text-secondary-content border-2 border-secondary"
                    onClick={() => navigate("/login")}
                    aria-label="Get Started"
                  >
                    Get Started
                  </button>
                )}
                <button
                  className="btn btn-primary rounded-full px-8 py-3 font-semibold text-lg shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary text-primary-content border-2 border-primary"
                  onClick={() => navigate("/blogs")}
                  aria-label="View Blogs"
                >
                  View Blogs
                </button>
                <button
                  className="btn btn-secondary rounded-full px-8 py-3 font-semibold text-lg shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-base text-secondary-content border-2 border-base"
                  onClick={() => navigate("/discover")}
                  aria-label="See Trending Developers"
                >
                  See Trending Developers
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
        .animate-wave-slide {
          animation: waveSlide 12s linear infinite;
        }
        @keyframes waveSlide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-120px); }
        }
        .animate-gradient-shimmer {
          background: linear-gradient(90deg, var(--p), var(--a), var(--s));
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .animate-gradient-x {
          background: linear-gradient(90deg, var(--p), var(--a), var(--s));
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s ease-in-out infinite;
        }
        .animate-gradient-shimmer-text {
          background: linear-gradient(90deg, var(--a), var(--p), var(--s), var(--a));
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerText 4s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes shimmerText {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
