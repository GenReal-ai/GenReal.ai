import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Send, MessageCircle, Linkedin } from 'lucide-react';

// Reusable Floating Label Input Component
const FloatingLabelInput = ({ name, label, type = 'text', value, onChange }) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value.length > 0;

    return (
        <motion.div className="relative" layout>
            <motion.label
                htmlFor={name}
                className="absolute left-3 text-gray-400 cursor-text pointer-events-none"
                animate={{
                    y: isFocused || hasValue ? -24 : 0,
                    scale: isFocused || hasValue ? 0.85 : 1,
                    color: isFocused ? '#22d3ee' : '#9ca3af',
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ originX: 0 }}
            >
                {label}
            </motion.label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required={name !== 'phone'} // Phone can be optional
                className="w-full px-3 py-3 bg-transparent border-b-2 text-white transition-colors duration-300 outline-none focus:border-cyan-400 border-gray-600"
            />
        </motion.div>
    );
};

// Reusable Floating Label Textarea Component with Autosize
const FloatingLabelTextarea = ({ name, label, value, onChange }) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value.length > 0;
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    return (
        <motion.div className="relative" layout>
            <motion.label
                htmlFor={name}
                className="absolute left-3 text-gray-400 cursor-text pointer-events-none"
                animate={{
                    y: isFocused || hasValue ? -24 : 0,
                    scale: isFocused || hasValue ? 0.85 : 1,
                    color: isFocused ? '#22d3ee' : '#9ca3af',
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ originX: 0 }}
            >
                {label}
            </motion.label>
            <textarea
                ref={textareaRef}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
                rows={1}
                className="w-full px-3 py-3 bg-transparent border-b-2 text-white transition-colors duration-300 outline-none focus:border-cyan-400 border-gray-600 resize-none overflow-hidden"
            />
        </motion.div>
    );
};

// New Gradient Contact Panel inspired by the image
const GradientContactPanel = ({ variants }) => {
  const contactDetails = [
    {
      title: "Visit us",
      lines: ["Come say hello at our office HQ.", "VIT Vellore, Tamil Nadu, India"]
    },
    {
      title: "Chat to us",
      lines: ["Our friendly team is here to help.", "genreal.ai@gmail.com"]
    },
  ];

  const socialLinks = [
    { href: "mailto:genreal.ai@gmail.com", icon: <Mail/> },
    { href: "https://www.linkedin.com/company/genreal-ai/", icon: <Linkedin/> },
    { href: "#", icon: <MapPin/> },
  ];

  return (
    <motion.div
      variants={variants}
      className="hidden lg:flex lg:order-2 flex-col justify-between bg-gradient-to-b from-cyan-900/50 via-[#0e152b]/80 to-[#0e152b] border border-cyan-500/20 rounded-3xl p-8 backdrop-blur-sm text-white"
    >
      <div>
        <h2 className="text-3xl font-bold mb-8">Get in touch</h2>
        <div className="space-y-6">
          {contactDetails.map((item, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg text-cyan-400 mb-1">{item.title}</h3>
              {item.lines.map((line, lineIndex) => (
                <p key={lineIndex} className="text-gray-300 leading-relaxed">{line}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg text-cyan-400 mb-3">Social media</h3>
        <div className="flex space-x-4">
          {socialLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-300 transition-colors"
              whileHover={{ scale: 1.2, y: -3 }}
              transition={{type: 'spring', stiffness: 300}}
            >
              {link.icon}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};


const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({
      name: '', email: '', phone: '', subject: '', message: ''
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };
  
  const successVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-black px-4 sm:px-8 py-12 flex items-center" id="contact-us">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-[160px]"
          animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/20 rounded-full blur-[160px]"
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-cyan-500/5 rounded-full blur-[160px]"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 22, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
      </div>

      <motion.div 
        className="relative max-w-7xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Get In <span className="text-cyan-400">Touch</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
            Have a question or want to work together? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          <GradientContactPanel variants={itemVariants} />

          {/* Form */}
          <motion.div className="col-span-3 lg:col-span-2 lg:order-1" variants={itemVariants}>
            <div className="bg-[#0e152b]/50 border border-cyan-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-sm h-full">
              <div className="flex items-center space-x-3 mb-8">
                <MessageCircle className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Send us a message</h2>
              </div>
              
              <AnimatePresence>
                {submitted && (
                  <motion.div 
                    className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-center"
                    variants={successVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <p className="text-green-300 font-medium">Message sent! We'll be in touch soon.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-8">
                <FloatingLabelInput name="name" label="Name" value={formData.name} onChange={handleChange} />
                <div className="grid sm:grid-cols-2 gap-8">
                  <FloatingLabelInput name="email" label="Email" type="email" value={formData.email} onChange={handleChange} />
                  <FloatingLabelInput name="phone" label="Phone (Optional)" type="tel" value={formData.phone} onChange={handleChange} />
                </div>
                <FloatingLabelInput name="subject" label="Subject" value={formData.subject} onChange={handleChange} />
                <FloatingLabelTextarea name="message" label="Message" value={formData.message} onChange={handleChange} />

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-600 to-cyan-400 text-white font-semibold py-3 px-8 rounded-xl flex items-center justify-center space-x-3 text-base"
                  whileHover={{ scale: 1.03, boxShadow: '0px 5px 20px rgba(0, 255, 255, 0.25)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 17 }}
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactForm;

