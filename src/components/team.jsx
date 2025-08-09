import React from "react";
import ProfileCard from "./profileCard"; // Assuming ProfileCard is in the same directory

const Team = () => {
  const founders = [
    {
      name: "Akshath Rajkumar",
      title: "Founder", 
      linkedinHandle: "Akshath Rajkumar", // Just the LinkedIn username
      contactText: "LinkedIn",
      avatarUrl: "vishwajeet.jpg", // Replace with actual image path
      showUserInfo: true,
      enableTilt: true,
      narrativeTitle: "A Mission Forged in Reality",
      narrativeText: [
        "In the pivotal year of 2023, the digital landscape felt like a battlefield. Witnessing deepfakes systematically manipulate public opinion during major elections wasn't just an academic problem—it was a personal call to action. It became clear that the tools of AI, which I had helped develop at Meta, were being weaponized.",
        "That moment was the genesis of our mission. We couldn't stand by while digital trust eroded. We decided to combine our deep expertise in AI and computer vision to build the defense our world desperately needed—a shield against the rising tide of digital deception."
      ]
    },
    {
      name: "Vishwajith P",
      title: "Co-Founder",
      linkedinHandle: "Vishwajith P", // Just the LinkedIn username
      contactText: "LinkedIn",
      avatarUrl: "vishwajeet.jpg", // Replace with actual image path
      showUserInfo: true,
      enableTilt: true,
      narrativeTitle: "The Architect's Blueprint",
      narrativeText: [
        "Coming from a background of building massive, scalable AI systems after a PhD at Stanford, the challenge was clear: detection models had to be not only incredibly accurate but also fast enough to work in the real world. The theory was sound, but the engineering had to be flawless.",
        "We're not just building another algorithm. We're architecting a new foundation for online authenticity. This involves pioneering new neural network structures and creating a system robust enough to stay ahead of the constantly evolving threat of synthetic media. It's the most challenging and meaningful problem I've ever worked on."
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