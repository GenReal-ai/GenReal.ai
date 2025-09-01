import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NewsTimeline = () => {
  const sectionRef = useRef(null);
  const horizontalRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const newsItems = [
    // ... newsItems array ...
    {
      title: "Facebook expands deepfake rules, but no full ban",
      image: "/News/news1.webp",
      date: "June 2025",
      summary:
        "Facebook introduces new policies to combat deepfakes while stopping short of implementing a complete ban, raising questions about platform responsibility.",
      link: "https://www.cbsnews.com/video/facebook-expands-rules-on-deepfakes-but-falls-short-of-total-ban/",
    },
    {
      title: "Meteorologist fights sextortion deepfake scams",
      image: "/News/news2.png",
      date: "May 2025",
      summary:
        "Weather forecaster Bree Smith battles criminals using AI-generated explicit images of her in sophisticated sextortion schemes targeting victims.",
      link: "https://www.cbsnews.com/news/deepfakes-meteorologist-bree-smith-image-doctored-sextortion-scams/",
    },
    {
      title: "Meta fails to stop sexualized AI deepfakes",
      image: "/News/news3.png",
      date: "May 2025",
      summary:
        "Investigation reveals Meta's platforms continue to host and spread sexualized AI-generated celebrity images despite policy promises.",
      link: "https://www.cbsnews.com/news/meta-facebook-sexualized-ai-deepfake-celebrity-images-spread/",
    },
    {
      title: "Ripple CTO warns of XRP deepfake CEO scam",
      image: "/News/news4.png",
      date: "May 2025",
      summary:
        "Ripple's Chief Technology Officer alerts community about fraudulent deepfake videos featuring fake CEO endorsements targeting cryptocurrency investors.",
      link: "https://example.com/ripple-scam",
    },
    {
      title: "Elon Musk deepfakes cause billions in fraud",
      image: "/News/news5.png",
      date: "April 2025",
      summary:
        "AI-generated videos of Elon Musk promoting fake investment schemes have defrauded victims of billions, highlighting deepfake crime's growing impact.",
      link: "https://www.cbsnews.com/news/deepfakes-ai-fraud-elon-musk/",
    },
    {
      title: "California fights AI deepfake abuse & bias",
      image: "/News/news6.jpg",
      date: "April 2025",
      summary:
        "California lawmakers advance comprehensive legislation targeting AI discrimination and sexually abusive deepfakes in landmark regulatory move.",
      link: "https://www.pbs.org/newshour/politics/california-advances-measures-targeting-ai-discrimination-and-sexually-abusive-deepfakes",
    },
    {
      title: "Call for ban on AI apps making child nudes",
      image: "/News/news7.webp",
      date: "April 2025",
      summary:
        "Child safety advocates demand immediate prohibition of AI applications capable of generating explicit imagery of minors as abuse cases surge.",
      link: "https://www.bbc.com/news/articles/cr78pd7p42ro",
    },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ROBUST useEffect HOOK
  useEffect(() => {
    if (isMobile) return;

    const section = sectionRef.current;
    const horizontal = horizontalRef.current;
    if (!section || !horizontal) return;
    gsap.set(section, { height: section.offsetHeight });
    const ctx = gsap.context(() => {
      gsap.to(horizontal, {
        x: () => `-${horizontal.scrollWidth - window.innerWidth}px`,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${horizontal.scrollWidth - window.innerWidth}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile]);


  const handleCardClick = (link) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      ref={sectionRef}
      className="relative z-0 w-full bg-black text-white overflow-hidden"
      id="news"
    >
      {/* Header */}
      <div
        className="flex flex-col items-center justify-center w-full text-center px-4 pt-16 pb-8"
        id="news"
      >
        <h2
          className={`font-bold text-center mb-2 ${
            isMobile ? "text-2xl" : "text-5xl"
          }`}
        >
          Latest <span className="text-cyan-400">Discoveries</span>
        </h2>
        <p className={`text-sm w-full text-center text-gray-400 ${isMobile ? '' : 'text-lg'}`}>
          Exploring the Digital Frontier
        </p>
      </div>

      {isMobile ? (
        <div className="relative w-full flex flex-col items-center px-4 pt-8 pb-16">
    {/* Card */}
    <div
      className="w-full max-w-sm bg-[#1a1a1a] text-white rounded-2xl shadow-md p-6 flex flex-col justify-between text-center border border-gray-800"
      onClick={() => handleCardClick(newsItems[currentIndex].link)}
    >
      <div>
        <img
          src={newsItems[currentIndex].image}
          alt={newsItems[currentIndex].title}
          className="w-full h-56 object-cover rounded-lg mb-4"
        />
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {newsItems[currentIndex].title}
        </h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-4">
          {newsItems[currentIndex].summary}
        </p>
      </div>
      <div className="flex flex-col items-center space-y-3">
        <p className="text-xs text-gray-500">{newsItems[currentIndex].date}</p>
        <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium py-2.5 px-6 rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all duration-300">
          Read More
        </button>
      </div>
    </div>

    {/* Navigation Arrows */}
    <div className="flex justify-between items-center w-full max-w-sm mt-6">
      <button
        onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : newsItems.length - 1))}
        className="p-2 bg-gray-800 rounded-full hover:bg-cyan-500 transition"
      >
        ←
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev < newsItems.length - 1 ? prev + 1 : 0))}
        className="p-2 bg-gray-800 rounded-full hover:bg-cyan-500 transition"
      >
        →
      </button>
    </div>

    {/* Progress Bar */}
    <div className="flex justify-center space-x-2 mt-4">
      {newsItems.map((_, idx) => (
        <span
          key={idx}
          className={`w-2.5 h-2.5 rounded-full transition-all ${
            idx === currentIndex ? "bg-cyan-500 scale-125" : "bg-gray-600"
          }`}
        />
      ))}
    </div>
  </div>
      ) : (
        <div
          ref={horizontalRef}
          className="flex items-start w-max space-x-8 sm:space-x-12 lg:space-x-16 px-4 sm:px-8 lg:px-24 py-8 sm:py-12"
        >
          {newsItems.map((item, index) => (
            <div
              key={index}
              className="group w-[85vw] sm:w-[320px] md:w-[400px] lg:w-[480px] h-auto min-h-[400px] bg-[#1a1a1a] text-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col justify-between text-center border border-gray-800 cursor-pointer transition-all duration-300 ease-in-out hover:!border-cyan-400 hover:-translate-y-3 hover:shadow-2xl hover:shadow-cyan-500/20"
              onClick={() => handleCardClick(item.link)}
            >
              <div>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full aspect-[4/3] object-cover rounded-lg mb-4 transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
                <h3 className="text-lg md:text-xl font-semibold mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-4">
                  {item.summary}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                <p className="text-xs text-gray-500">{item.date}</p>
                <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium py-2 px-5 sm:py-2.5 sm:px-6 rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform group-hover:scale-105">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>

      )}
    </section>
  );
};

export default NewsTimeline;