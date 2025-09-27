import React from "react";
import ProfileCard from "./profileCard"; // Assuming ProfileCard is in the same directory

const Team = () => {
  const founders = [
    {
      name: "Akshath Rajkumar",
      title: "Founder", 
      linkedinHandle: "akshath-rajkumar-223ba5289",
      contactText: "LinkedIn",
      avatarUrl: "akshath.jpg", 
      showUserInfo: true,
      enableTilt: true,
      narrativeTitle: "A Mission Forged in Reality",
      narrativeText: [
          "I am a founder of GenReal, a company dedicated to AI detection across videos, code, and other digital content. ",
          "Our mission is to help individuals and organizations maintain authenticity and trust. I am currently a student at VIT Vellore (Roll Number: 23BAI0059), where I combine academic knowledge with hands-on innovation in AI and deep learning"
          
      ]
    },
    {
      name: "Vishwajith P",
      title: "Co-Founder",
      linkedinHandle: "vishwajith-p", // Just the LinkedIn username
      contactText: "LinkedIn",
      avatarUrl: "vishwajeet.jpg", // Replace with actual image path
      showUserInfo: true,
      enableTilt: true,
      narrativeTitle: "Redefining Online Authenticity",
      narrativeText: [
          "We’re building more than just algorithms—we’re creating the foundation for online trust. Our detection models are designed to be not only accurate, but also fast and scalable for real-world use. ",
          "By pioneering new neural network architectures and developing resilient systems, we stay ahead of the rapidly evolving threat of synthetic media. This is one of the most challenging and meaningful problems of our time, and solving it is at the core of our mission."
      ]
    },
  ];

  // Function to handle LinkedIn redirect
  const handleLinkedInClick = (linkedinHandle) => {
    window.open(`https://linkedin.com/in/${linkedinHandle}`, '_blank');
  };

  return (
    <div className="bg-black text-white px-4 py-12 md:px-6 md:py-16 lg:py-24" id="team">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">
            Meet Our <span className="text-cyan-400">Founders</span>
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-300 max-w-3xl mx-auto px-2">
            "We didn't just see a problem; we saw a responsibility. We combined our AI expertise to build the defense our digital world desperately needed."
          </p>
        </div>

        {/* Founder Sections - Mapped with Alternating Layout */}
        <div className="space-y-12 md:space-y-20 lg:space-y-28">
          {founders.map((founder, index) => (
            <div
              key={founder.linkedinHandle}
              className={`
                flex flex-col items-center justify-center gap-6 md:gap-10 lg:gap-16 xl:gap-20
                md:flex-row
                ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}
              `}
            >
              {/* Profile Card - Smaller on Mobile */}
              <div className="w-full max-w-xs md:max-w-none md:w-5/12 flex-shrink-0">
                <ProfileCard
                  name={founder.name}
                  title={founder.title}
                  avatarUrl={founder.avatarUrl}
                  contactText={founder.contactText}
                  showUserInfo={founder.showUserInfo}
                  enableTilt={founder.enableTilt}
                  onContactClick={() => handleLinkedInClick(founder.linkedinHandle)}
                />
              </div>

              {/* Narrative Text */}
              <div className="w-full md:w-7/12 text-center md:text-left px-2 md:px-0">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-cyan-400 mb-3 md:mb-4">
                  {founder.narrativeTitle}
                </h3>
                <div className="space-y-3 md:space-y-4 text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed">
                  {founder.narrativeText.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Team;