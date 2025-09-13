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
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  handleResize();
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

useEffect(() => {
  if (isMobile) return;
  const section = sectionRef.current;
  const horizontal = horizontalRef.current;
  if (!section || !horizontal) return;

  let scrollTriggerInstance;

  const initScroll = () => {
    // Kill the old one if it exists
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
      scrollTriggerInstance = null;
    }

    const sectionWidth = window.innerWidth;
    const totalWidth = horizontal.scrollWidth;

    const lastCard = horizontal.lastElementChild;
    const lastCardWidth = lastCard ? lastCard.offsetWidth : 0;

    const scrollDistance = totalWidth - sectionWidth + lastCardWidth * 0.2;
    if (scrollDistance <= 0) return;

    gsap.set(horizontal, { x: 0 });

    scrollTriggerInstance = gsap.to(horizontal, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    }).scrollTrigger;
  };

  initScroll();

  window.addEventListener("resize", initScroll);

  return () => {
    window.removeEventListener("resize", initScroll);
    if (scrollTriggerInstance) scrollTriggerInstance.kill();
  };
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
    {/* Header (centered, larger, tighter spacing) */}
    <div className="flex flex-col items-center justify-center w-full text-center px-6 pt-16 pb-6">
      <h2 className="font-bold mb-1 text-[clamp(1.7rem,4vw,3rem)] leading-tight">
        Latest <span className="text-cyan-400">Discoveries</span>
      </h2>
      <p className="text-gray-400 text-[clamp(0.9rem,1.2vw,1.4rem)]">
        Exploring the Digital Frontier
      </p>
    </div>


      {isMobile ? (
        // MOBILE VIEW
        <div className="relative w-full flex flex-col items-center px-4 pt-8 pb-16">
          <div
            className="w-full max-w-sm bg-[#1a1a1a] text-white rounded-2xl shadow-md p-4 flex flex-col justify-between border border-gray-800"
            onClick={() => handleCardClick(newsItems[currentIndex].link)}
          >
            <div className="flex-1 flex flex-col">
              <img
                src={newsItems[currentIndex].image}
                alt={newsItems[currentIndex].title}
                loading="eager"
                decoding="async"
                className="w-full aspect-video object-cover rounded-lg mb-3"
              />
              <h3 className="text-[clamp(1rem,2.5vw,1.4rem)] font-semibold mb-2 line-clamp-2">
                {newsItems[currentIndex].title}
              </h3>
              <p className="text-gray-400 text-[clamp(0.85rem,2vw,1rem)] mb-4 line-clamp-4">
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
        </div>
      ) : (
        // DESKTOP VIEW
        <div
          ref={horizontalRef}
          className="flex items-center w-max space-x-16 py-4 px-4 pr-[10vw]" 
        >
          {newsItems.map((item, index) => (
            <div
              key={index}
              className="group flex-shrink-0
                w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[28vw] xl:w-[24vw]
                aspect-[3/4] max-h-[600px]
                bg-[#1a1a1a] text-white rounded-2xl shadow-md 
                p-4 md:p-5 lg:p-6 xl:p-7
                flex flex-col justify-between text-center 
                border border-gray-800 cursor-pointer 
                transition-all duration-300 ease-in-out 
                hover:!border-cyan-400 hover:-translate-y-2 lg:hover:-translate-y-3 
                hover:shadow-2xl hover:shadow-cyan-500/20 
                overflow-hidden"
              onClick={() => handleCardClick(item.link)}
            >
              {/* Image */}
              <div className="h-[40%] w-full mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>

              {/* Text */}
              <div className="flex-1 flex flex-col">
                <h3 className="font-semibold mb-2 line-clamp-2 leading-tight text-[clamp(1rem,1.2vw,1.5rem)]">
                  {item.title}
                </h3>
                <p className="text-gray-400 mb-3 line-clamp-4 flex-grow leading-relaxed text-[clamp(0.85rem,1vw,1.1rem)]">
                  {item.summary}
                </p>
              </div>

              {/* Footer */}
              <div className="flex flex-col items-center space-y-2 mt-2">
                <p className="text-xs text-gray-500">{item.date}</p>
                <button className="bg-gradient-to-r from-cyan-500 to-blue-600 
                  text-white font-medium rounded-full
                  hover:from-cyan-600 hover:to-blue-700 
                  transition-all duration-300 transform group-hover:scale-105
                  text-[clamp(0.8rem,1vw,1rem)] py-2 px-5">
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
