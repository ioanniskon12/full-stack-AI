// import React, { useState, useEffect } from "react";
// import styled, { createGlobalStyle, keyframes, css } from "styled-components";
// import {
//   Menu,
//   X,
//   Rocket,
//   Palette,
//   Code,
//   Megaphone,
//   Mail,
//   Phone,
//   MapPin,
//   Send,
//   Users,
//   Target,
//   Lightbulb,
//   ChevronRight,
//   Star,
//   Globe,
//   Smartphone,
//   BarChart,
//   Zap,
//   Heart,
//   Shield,
//   Award,
//   Clock,
//   CheckCircle,
//   ArrowRight,
//   Play,
//   TrendingUp,
//   Briefcase,
//   Coffee,
//   Sparkles,
//   Calendar,
//   DollarSign,
//   MessageCircle,
//   Headphones,
//   FileText,
//   Settings,
//   Camera,
//   Video,
// } from "lucide-react";

// // Global Styles
// const GlobalStyle = createGlobalStyle`
//   * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//   }

//   body {
//     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
//     overflow-x: hidden;
//     background: #0f0f23;
//   }

//   ::-webkit-scrollbar {
//     width: 10px;
//   }

//   ::-webkit-scrollbar-track {
//     background: rgba(255, 255, 255, 0.1);
//   }

//   ::-webkit-scrollbar-thumb {
//     background: #fde047;
//     border-radius: 5px;
//   }
// `;

// // Animations
// const float = keyframes`
//   0%, 100% { transform: translateY(0px) rotate(0deg); }
//   50% { transform: translateY(-20px) rotate(2deg); }
// `;

// const pulse = keyframes`
//   0% { transform: scale(1); opacity: 0.5; }
//   50% { transform: scale(1.1); opacity: 0.3; }
//   100% { transform: scale(1); opacity: 0.5; }
// `;

// const slideIn = keyframes`
//   from {
//     opacity: 0;
//     transform: translateY(30px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `;

// const rotate = keyframes`
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// `;

// // Base Styled Components
// const AppContainer = styled.div`
//   min-height: 100vh;
//   background: linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #6366f1 100%);
//   position: relative;
//   overflow: hidden;
// `;

// const BackgroundPattern = styled.div`
//   position: fixed;
//   inset: 0;
//   opacity: 0.1;
//   background-image:
//     radial-gradient(circle at 20% 50%, #fde047 0%, transparent 50%),
//     radial-gradient(circle at 80% 80%, #a855f7 0%, transparent 50%),
//     radial-gradient(circle at 40% 20%, #3b82f6 0%, transparent 50%);
//   z-index: 0;
// `;

// const NavBar = styled.nav`
//   position: fixed;
//   top: 0;
//   width: 100%;
//   z-index: 50;
//   background: rgba(147, 51, 234, 0.9);
//   backdrop-filter: blur(10px);
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//   transition: all 0.3s ease;
// `;

// const NavContainer = styled.div`
//   max-width: 1280px;
//   margin: 0 auto;
//   padding: 0 2rem;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   height: 4rem;
// `;

// const Logo = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   cursor: pointer;

//   svg {
//     width: 2rem;
//     height: 2rem;
//     color: #fde047;
//     animation: ${rotate} 10s linear infinite;
//   }

//   span {
//     color: white;
//     font-weight: bold;
//     font-size: 1.25rem;
//   }
// `;

// const DesktopNav = styled.div`
//   display: none;
//   gap: 2rem;

//   @media (min-width: 768px) {
//     display: flex;
//   }
// `;

// const NavButton = styled.button`
//   background: none;
//   border: none;
//   color: ${(props) => (props.active ? "#fde047" : "white")};
//   cursor: pointer;
//   font-size: 1rem;
//   position: relative;
//   transition: color 0.3s ease;

//   &:after {
//     content: "";
//     position: absolute;
//     bottom: -5px;
//     left: 0;
//     width: ${(props) => (props.active ? "100%" : "0")};
//     height: 2px;
//     background: #fde047;
//     transition: width 0.3s ease;
//   }

//   &:hover {
//     color: #fde047;

//     &:after {
//       width: 100%;
//     }
//   }
// `;

// const MobileMenuButton = styled.button`
//   display: block;
//   background: none;
//   border: none;
//   color: white;
//   cursor: pointer;

//   @media (min-width: 768px) {
//     display: none;
//   }
// `;

// const MobileMenu = styled.div`
//   display: ${(props) => (props.open ? "block" : "none")};
//   background: rgba(124, 58, 237, 0.95);
//   backdrop-filter: blur(10px);
//   padding: 1rem;

//   @media (min-width: 768px) {
//     display: none;
//   }
// `;

// const MobileNavItem = styled.button`
//   display: block;
//   width: 100%;
//   text-align: left;
//   background: none;
//   border: none;
//   color: ${(props) => (props.active ? "#fde047" : "white")};
//   padding: 0.75rem 1rem;
//   cursor: pointer;
//   transition: color 0.3s ease;

//   &:hover {
//     color: #fde047;
//   }
// `;

// const PageContainer = styled.div`
//   padding-top: 4rem;
//   min-height: 100vh;
//   position: relative;
//   z-index: 1;
// `;

// const Section = styled.section`
//   padding: 4rem 1rem;
//   max-width: 1280px;
//   margin: 0 auto;
//   animation: ${slideIn} 0.6s ease;
// `;

// const SectionTitle = styled.h2`
//   font-size: clamp(2rem, 5vw, 3.5rem);
//   font-weight: bold;
//   color: white;
//   text-align: center;
//   margin-bottom: 1rem;
// `;

// const SectionSubtitle = styled.p`
//   font-size: clamp(1rem, 2vw, 1.25rem);
//   color: #e9d5ff;
//   text-align: center;
//   margin-bottom: 3rem;
//   max-width: 600px;
//   margin-left: auto;
//   margin-right: auto;
// `;

// const Grid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(
//     auto-fit,
//     minmax(${(props) => props.minWidth || "300px"}, 1fr)
//   );
//   gap: ${(props) => props.gap || "2rem"};
//   margin-top: ${(props) => props.marginTop || "2rem"};
// `;

// const Card = styled.div`
//   background: ${(props) =>
//     props.transparent
//       ? "rgba(255, 255, 255, 0.1)"
//       : "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)"};
//   backdrop-filter: blur(10px);
//   border-radius: 1.5rem;
//   padding: ${(props) => props.padding || "2rem"};
//   border: 1px solid rgba(255, 255, 255, 0.2);
//   transition: all 0.3s ease;
//   position: relative;
//   overflow: hidden;

//   ${(props) =>
//     props.hoverable &&
//     css`
//       &:hover {
//         transform: translateY(-5px);
//         box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
//         border-color: #fde047;
//       }
//     `}

//   ${(props) =>
//     props.clickable &&
//     css`
//       cursor: pointer;
//     `}
// `;

// const IconBox = styled.div`
//   width: ${(props) => props.size || "4rem"};
//   height: ${(props) => props.size || "4rem"};
//   background: ${(props) =>
//     props.gradient || "linear-gradient(135deg, #fde047 0%, #fbbf24 100%)"};
//   border-radius: ${(props) => (props.round ? "50%" : "1rem")};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin-bottom: ${(props) => props.marginBottom || "1.5rem"};

//   svg {
//     width: ${(props) => props.iconSize || "2rem"};
//     height: ${(props) => props.iconSize || "2rem"};
//     color: ${(props) => props.iconColor || "#7c3aed"};
//   }
// `;

// const Button = styled.button`
//   background: ${(props) =>
//     props.variant === "outline" ? "transparent" : "#fde047"};
//   color: ${(props) => (props.variant === "outline" ? "#fde047" : "#7c3aed")};
//   border: ${(props) =>
//     props.variant === "outline" ? "2px solid #fde047" : "none"};
//   padding: ${(props) =>
//     props.size === "large" ? "1rem 2.5rem" : "0.75rem 2rem"};
//   border-radius: 9999px;
//   font-weight: bold;
//   font-size: ${(props) => (props.size === "large" ? "1.1rem" : "1rem")};
//   cursor: pointer;
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   gap: 0.5rem;
//   transition: all 0.3s ease;

//   &:hover {
//     background: ${(props) =>
//       props.variant === "outline" ? "#fde047" : "#fde68a"};
//     color: #7c3aed;
//     transform: translateY(-2px);
//     box-shadow: 0 10px 20px rgba(253, 224, 71, 0.3);
//   }

//   &:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
// `;

// const Badge = styled.span`
//   background: ${(props) => props.color || "#fde047"};
//   color: ${(props) => props.textColor || "#7c3aed"};
//   padding: 0.25rem 0.75rem;
//   border-radius: 9999px;
//   font-size: 0.875rem;
//   font-weight: 600;
//   display: inline-block;
// `;

// // Page-specific components
// const HeroSection = styled.section`
//   text-align: center;
//   padding: 6rem 1rem 4rem;
//   position: relative;
//   min-height: 80vh;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
// `;

// const HeroTitle = styled.h1`
//   font-size: clamp(3rem, 8vw, 7rem);
//   font-weight: bold;
//   color: white;
//   margin-bottom: 1.5rem;
//   line-height: 1.1;
// `;

// const HeroSubtitle = styled.p`
//   font-size: clamp(1.5rem, 3vw, 2rem);
//   color: #e9d5ff;
//   margin-bottom: 3rem;
// `;

// const FloatingElement = styled.div`
//   position: absolute;
//   animation: ${float} ${(props) => props.duration || "6s"} ease-in-out infinite;
//   animation-delay: ${(props) => props.delay || "0s"};
// `;

// const GlowBg = styled.div`
//   position: absolute;
//   width: ${(props) => props.size || "300px"};
//   height: ${(props) => props.size || "300px"};
//   background: ${(props) => props.color || "#fde047"};
//   border-radius: 50%;
//   opacity: 0.2;
//   filter: blur(60px);
//   animation: ${pulse} 4s ease-in-out infinite;
// `;

// const StatCard = styled(Card)`
//   text-align: center;
//   background: rgba(255, 255, 255, 0.05);
// `;

// const StatNumber = styled.h3`
//   font-size: 3rem;
//   font-weight: bold;
//   color: #fde047;
//   margin-bottom: 0.5rem;
// `;

// const StatLabel = styled.p`
//   color: #e9d5ff;
//   font-size: 1.1rem;
// `;

// const TestimonialCard = styled(Card)`
//   position: relative;
//   padding: 2.5rem;

//   &:before {
//     content: '"';
//     position: absolute;
//     top: 1rem;
//     left: 1.5rem;
//     font-size: 4rem;
//     color: #fde047;
//     opacity: 0.3;
//   }
// `;

// const TestimonialText = styled.p`
//   color: white;
//   font-size: 1.1rem;
//   line-height: 1.8;
//   margin-bottom: 1.5rem;
//   font-style: italic;
// `;

// const TestimonialAuthor = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
// `;

// const AuthorAvatar = styled.div`
//   width: 50px;
//   height: 50px;
//   background: linear-gradient(135deg, #fde047 0%, #a855f7 100%);
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const AuthorInfo = styled.div`
//   h4 {
//     color: white;
//     font-size: 1.1rem;
//     margin-bottom: 0.25rem;
//   }

//   p {
//     color: #fde047;
//     font-size: 0.9rem;
//   }
// `;

// const TimelineContainer = styled.div`
//   position: relative;
//   max-width: 800px;
//   margin: 0 auto;

//   &:before {
//     content: "";
//     position: absolute;
//     left: 50%;
//     transform: translateX(-50%);
//     width: 2px;
//     height: 100%;
//     background: #fde047;

//     @media (max-width: 768px) {
//       left: 2rem;
//     }
//   }
// `;

// const TimelineItem = styled.div`
//   position: relative;
//   padding: 2rem 0;

//   &:nth-child(even) {
//     text-align: right;

//     > div {
//       margin-left: auto;
//       margin-right: 4rem;
//     }

//     @media (max-width: 768px) {
//       text-align: left;

//       > div {
//         margin-left: 4rem;
//         margin-right: 0;
//       }
//     }
//   }

//   &:nth-child(odd) {
//     > div {
//       margin-right: auto;
//       margin-left: 4rem;
//     }
//   }
// `;

// const TimelineDot = styled.div`
//   position: absolute;
//   left: 50%;
//   top: 2.5rem;
//   transform: translateX(-50%);
//   width: 1.5rem;
//   height: 1.5rem;
//   background: #fde047;
//   border-radius: 50%;
//   border: 4px solid #7c3aed;

//   @media (max-width: 768px) {
//     left: 2rem;
//   }
// `;

// const TimelineContent = styled(Card)`
//   max-width: 400px;

//   h3 {
//     color: #fde047;
//     margin-bottom: 0.5rem;
//   }

//   p {
//     color: white;
//     line-height: 1.6;
//   }
// `;

// const PricingCard = styled(Card)`
//   text-align: center;
//   position: relative;
//   padding: 3rem 2rem;

//   ${(props) =>
//     props.featured &&
//     css`
//       border: 2px solid #fde047;
//       transform: scale(1.05);

//       @media (max-width: 768px) {
//         transform: scale(1);
//       }
//     `}
// `;

// const PricingBadge = styled(Badge)`
//   position: absolute;
//   top: -0.75rem;
//   left: 50%;
//   transform: translateX(-50%);
// `;

// const PricingTitle = styled.h3`
//   color: white;
//   font-size: 1.75rem;
//   margin-bottom: 1rem;
// `;

// const PricingPrice = styled.div`
//   margin: 2rem 0;

//   span {
//     font-size: 3rem;
//     font-weight: bold;
//     color: #fde047;
//   }

//   small {
//     color: #e9d5ff;
//     font-size: 1rem;
//   }
// `;

// const PricingFeatures = styled.ul`
//   list-style: none;
//   margin: 2rem 0;

//   li {
//     color: white;
//     padding: 0.75rem 0;
//     display: flex;
//     align-items: center;
//     gap: 0.5rem;

//     svg {
//       color: #fde047;
//       width: 1.25rem;
//       height: 1.25rem;
//     }
//   }
// `;

// const ProcessStep = styled.div`
//   text-align: center;
//   position: relative;

//   &:not(:last-child):after {
//     content: "";
//     position: absolute;
//     top: 2rem;
//     left: 60%;
//     width: calc(100% - 4rem);
//     height: 2px;
//     background: linear-gradient(90deg, #fde047 0%, transparent 100%);

//     @media (max-width: 768px) {
//       display: none;
//     }
//   }
// `;

// const StepNumber = styled.div`
//   width: 4rem;
//   height: 4rem;
//   background: #fde047;
//   color: #7c3aed;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 1.5rem;
//   font-weight: bold;
//   margin: 0 auto 1.5rem;
// `;

// const ContactForm = styled.form`
//   max-width: 600px;
//   margin: 0 auto;
// `;

// const FormGroup = styled.div`
//   margin-bottom: 1.5rem;
// `;

// const Label = styled.label`
//   display: block;
//   color: #fde047;
//   margin-bottom: 0.5rem;
//   font-weight: 500;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 0.75rem;
//   background: rgba(255, 255, 255, 0.1);
//   border: 1px solid rgba(255, 255, 255, 0.2);
//   border-radius: 0.5rem;
//   color: white;
//   font-size: 1rem;
//   transition: all 0.3s ease;

//   &:focus {
//     outline: none;
//     border-color: #fde047;
//     background: rgba(255, 255, 255, 0.15);
//   }

//   &::placeholder {
//     color: rgba(255, 255, 255, 0.5);
//   }
// `;

// const TextArea = styled.textarea`
//   width: 100%;
//   padding: 0.75rem;
//   background: rgba(255, 255, 255, 0.1);
//   border: 1px solid rgba(255, 255, 255, 0.2);
//   border-radius: 0.5rem;
//   color: white;
//   font-size: 1rem;
//   min-height: 150px;
//   resize: vertical;
//   transition: all 0.3s ease;

//   &:focus {
//     outline: none;
//     border-color: #fde047;
//     background: rgba(255, 255, 255, 0.15);
//   }

//   &::placeholder {
//     color: rgba(255, 255, 255, 0.5);
//   }
// `;

// const FAQItem = styled.div`
//   margin-bottom: 1rem;
// `;

// const FAQQuestion = styled.button`
//   width: 100%;
//   text-align: left;
//   background: rgba(255, 255, 255, 0.1);
//   border: 1px solid rgba(255, 255, 255, 0.2);
//   border-radius: 0.5rem;
//   padding: 1.5rem;
//   color: white;
//   font-size: 1.1rem;
//   font-weight: 500;
//   cursor: pointer;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   transition: all 0.3s ease;

//   &:hover {
//     background: rgba(255, 255, 255, 0.15);
//     border-color: #fde047;
//   }

//   svg {
//     transition: transform 0.3s ease;
//     transform: ${(props) => (props.open ? "rotate(180deg)" : "rotate(0)")};
//   }
// `;

// const FAQAnswer = styled.div`
//   max-height: ${(props) => (props.open ? "300px" : "0")};
//   overflow: hidden;
//   transition: max-height 0.3s ease;

//   p {
//     padding: 1.5rem;
//     color: #e9d5ff;
//     line-height: 1.6;
//   }
// `;

// const Footer = styled.footer`
//   background: rgba(0, 0, 0, 0.3);
//   padding: 3rem 1rem 1rem;
//   margin-top: 4rem;
// `;

// const FooterContent = styled.div`
//   max-width: 1280px;
//   margin: 0 auto;
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//   gap: 2rem;
//   margin-bottom: 2rem;
// `;

// const FooterSection = styled.div`
//   h4 {
//     color: #fde047;
//     margin-bottom: 1rem;
//   }

//   p,
//   a {
//     color: #e9d5ff;
//     line-height: 1.8;
//     text-decoration: none;
//     display: block;
//     margin-bottom: 0.5rem;
//     transition: color 0.3s ease;

//     &:hover {
//       color: white;
//     }
//   }
// `;

// const SocialLinks = styled.div`
//   display: flex;
//   gap: 1rem;
//   margin-top: 1rem;
// `;

// const SocialIcon = styled.a`
//   width: 2.5rem;
//   height: 2.5rem;
//   background: rgba(255, 255, 255, 0.1);
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   transition: all 0.3s ease;

//   svg {
//     width: 1.25rem;
//     height: 1.25rem;
//     color: white;
//   }

//   &:hover {
//     background: #fde047;

//     svg {
//       color: #7c3aed;
//     }
//   }
// `;

// const Copyright = styled.div`
//   text-align: center;
//   padding-top: 2rem;
//   border-top: 1px solid rgba(255, 255, 255, 0.1);
//   color: #e9d5ff;
// `;

// // Main Component
// const MarketingAgency = () => {
//   const [currentPage, setCurrentPage] = useState("home");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [openFAQ, setOpenFAQ] = useState(null);

//   const navigation = [
//     { name: "Home", id: "home" },
//     { name: "Services", id: "services" },
//     { name: "About Us", id: "about" },
//     { name: "Portfolio", id: "portfolio" },
//     { name: "Pricing", id: "pricing" },
//     { name: "Contact", id: "contact" },
//   ];

//   const services = [
//     {
//       icon: <Palette />,
//       title: "Brand Design",
//       description:
//         "Create a unique visual identity that captures your brand essence and resonates with your audience.",
//       features: [
//         "Logo Design",
//         "Brand Guidelines",
//         "Visual Identity",
//         "Brand Strategy",
//       ],
//     },
//     {
//       icon: <Globe />,
//       title: "Digital Marketing",
//       description:
//         "Reach your target audience through strategic online campaigns across multiple platforms.",
//       features: [
//         "Social Media Marketing",
//         "PPC Advertising",
//         "Email Marketing",
//         "Content Strategy",
//       ],
//     },
//     {
//       icon: <Code />,
//       title: "Web Development",
//       description:
//         "Build stunning, responsive websites that convert visitors into customers.",
//       features: [
//         "Custom Websites",
//         "E-commerce",
//         "Web Applications",
//         "CMS Development",
//       ],
//     },
//     {
//       icon: <Smartphone />,
//       title: "Mobile Solutions",
//       description:
//         "Develop mobile-first experiences that engage users on any device.",
//       features: [
//         "Mobile Apps",
//         "Responsive Design",
//         "PWA Development",
//         "App Store Optimization",
//       ],
//     },
//     {
//       icon: <BarChart />,
//       title: "Analytics & SEO",
//       description:
//         "Data-driven strategies to improve your search rankings and online visibility.",
//       features: [
//         "SEO Optimization",
//         "Performance Analytics",
//         "Conversion Tracking",
//         "Competitor Analysis",
//       ],
//     },
//     {
//       icon: <Video />,
//       title: "Video Production",
//       description:
//         "Compelling video content that tells your story and drives engagement.",
//       features: [
//         "Corporate Videos",
//         "Product Demos",
//         "Animation",
//         "Social Media Videos",
//       ],
//     },
//   ];

//   const portfolioItems = [
//     {
//       title: "TechStart Launch",
//       category: "Brand Design",
//       description: "Complete brand identity for a tech startup",
//       image: "🚀",
//     },
//     {
//       title: "EcoShop Platform",
//       category: "Web Development",
//       description: "E-commerce platform for sustainable products",
//       image: "🌱",
//     },
//     {
//       title: "FitLife App",
//       category: "Mobile Solutions",
//       description: "Fitness tracking app with social features",
//       image: "💪",
//     },
//     {
//       title: "Global Campaign",
//       category: "Digital Marketing",
//       description: "Multi-channel marketing campaign",
//       image: "🌍",
//     },
//     {
//       title: "DataViz Dashboard",
//       category: "Analytics",
//       description: "Real-time analytics dashboard",
//       image: "📊",
//     },
//     {
//       title: "Brand Story Video",
//       category: "Video Production",
//       description: "Emotional brand storytelling video",
//       image: "🎬",
//     },
//   ];

//   const pricingPlans = [
//     {
//       name: "Starter",
//       price: "$999",
//       period: "/month",
//       features: [
//         "Brand Design Basics",
//         "Social Media Setup",
//         "Basic Website",
//         "Monthly Reports",
//         "Email Support",
//       ],
//     },
//     {
//       name: "Growth",
//       price: "$2,499",
//       period: "/month",
//       featured: true,
//       badge: "Most Popular",
//       features: [
//         "Everything in Starter",
//         "Advanced Marketing",
//         "Custom Development",
//         "Weekly Reports",
//         "Priority Support",
//         "Analytics Dashboard",
//       ],
//     },
//     {
//       name: "Enterprise",
//       price: "$4,999",
//       period: "/month",
//       features: [
//         "Everything in Growth",
//         "Dedicated Team",
//         "Custom Solutions",
//         "Daily Reports",
//         "24/7 Support",
//         "Advanced Analytics",
//         "Video Production",
//       ],
//     },
//   ];

//   const testimonials = [
//     {
//       text: "CreativeFlow transformed our online presence. Our traffic increased by 300% in just 6 months!",
//       author: "Sarah Johnson",
//       role: "CEO, TechStart",
//       rating: 5,
//     },
//     {
//       text: "The team's creativity and professionalism exceeded our expectations. Highly recommended!",
//       author: "Mike Chen",
//       role: "Marketing Director, EcoShop",
//       rating: 5,
//     },
//     {
//       text: "Best investment we made for our business. The ROI has been incredible.",
//       author: "Emma Davis",
//       role: "Founder, FitLife",
//       rating: 5,
//     },
//   ];

//   const faqs = [
//     {
//       question: "How long does a typical project take?",
//       answer:
//         "Project timelines vary based on scope and complexity. A basic website typically takes 4-6 weeks, while comprehensive marketing campaigns can run 3-6 months. We'll provide a detailed timeline during our initial consultation.",
//     },
//     {
//       question: "Do you work with small businesses?",
//       answer:
//         "Absolutely! We work with businesses of all sizes, from startups to enterprises. Our Starter package is specifically designed for small businesses looking to establish their online presence.",
//     },
//     {
//       question: "Can I see examples of your work?",
//       answer:
//         "Of course! Check out our Portfolio section for case studies and examples. We're also happy to share relevant examples during our consultation based on your specific industry and needs.",
//     },
//     {
//       question: "What makes CreativeFlow different?",
//       answer:
//         "We combine creative excellence with data-driven strategies. Our integrated approach means all your marketing efforts work together seamlessly. Plus, our team stays ahead of the latest trends and technologies.",
//     },
//     {
//       question: "How do you measure success?",
//       answer:
//         "We establish clear KPIs at the project start, including metrics like traffic growth, conversion rates, engagement, and ROI. You'll receive regular reports showing progress toward your goals.",
//     },
//   ];

//   const process = [
//     {
//       number: "01",
//       title: "Discovery",
//       description: "We learn about your business, goals, and target audience.",
//     },
//     {
//       number: "02",
//       title: "Strategy",
//       description: "Develop a customized plan to achieve your objectives.",
//     },
//     {
//       number: "03",
//       title: "Creation",
//       description:
//         "Bring your vision to life with stunning designs and development.",
//     },
//     {
//       number: "04",
//       title: "Launch",
//       description: "Deploy your project and ensure everything runs smoothly.",
//     },
//     {
//       number: "05",
//       title: "Growth",
//       description: "Monitor, optimize, and scale for continuous improvement.",
//     },
//   ];

//   const team = [
//     { name: "Sarah Johnson", role: "Creative Director", icon: <Palette /> },
//     { name: "Mike Chen", role: "Marketing Strategist", icon: <Target /> },
//     { name: "Emma Davis", role: "Lead Developer", icon: <Code /> },
//     { name: "Alex Rodriguez", role: "Content Manager", icon: <Megaphone /> },
//   ];

//   const stats = [
//     { number: "500+", label: "Projects Completed" },
//     { number: "98%", label: "Client Satisfaction" },
//     { number: "10+", label: "Years Experience" },
//     { number: "50+", label: "Team Members" },
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Thank you for your message! We'll get back to you within 24 hours.");
//   };

//   // Page Components
//   const HomePage = () => (
//     <>
//       <HeroSection>
//         <FloatingElement style={{ top: "10%", left: "10%" }}>
//           <Sparkles size={40} color="#fde047" />
//         </FloatingElement>
//         <FloatingElement style={{ bottom: "20%", right: "15%" }} delay="2s">
//           <Star size={35} color="#a855f7" />
//         </FloatingElement>

//         <HeroTitle>Take Off</HeroTitle>
//         <HeroSubtitle>CreativeFlow = Smart Marketing</HeroSubtitle>

//         <div
//           style={{ position: "relative", maxWidth: "600px", margin: "0 auto" }}
//         >
//           <GlowBg
//             style={{
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//             }}
//           />
//           <Card padding="3rem">
//             <IconBox size="6rem" iconSize="3rem" marginBottom="2rem">
//               <Rocket />
//             </IconBox>
//             <h2
//               style={{ color: "white", fontSize: "2rem", marginBottom: "1rem" }}
//             >
//               Launch Your Brand
//             </h2>
//             <p
//               style={{
//                 color: "#e9d5ff",
//                 marginBottom: "2rem",
//                 lineHeight: "1.6",
//               }}
//             >
//               We help businesses soar to new heights with innovative marketing
//               strategies that drive growth and engagement.
//             </p>
//             <Button size="large" onClick={() => setCurrentPage("services")}>
//               Explore Services
//               <ChevronRight size={20} />
//             </Button>
//           </Card>
//         </div>
//       </HeroSection>

//       <Section>
//         <Grid>
//           {stats.map((stat, index) => (
//             <StatCard key={index} hoverable>
//               <StatNumber>{stat.number}</StatNumber>
//               <StatLabel>{stat.label}</StatLabel>
//             </StatCard>
//           ))}
//         </Grid>
//       </Section>

//       <Section>
//         <SectionTitle>What Our Clients Say</SectionTitle>
//         <SectionSubtitle>Real results from real businesses</SectionSubtitle>
//         <Grid>
//           {testimonials.map((testimonial, index) => (
//             <TestimonialCard key={index} transparent hoverable>
//               <TestimonialText>{testimonial.text}</TestimonialText>
//               <TestimonialAuthor>
//                 <AuthorAvatar>
//                   <Users size={24} color="white" />
//                 </AuthorAvatar>
//                 <AuthorInfo>
//                   <h4>{testimonial.author}</h4>
//                   <p>{testimonial.role}</p>
//                 </AuthorInfo>
//               </TestimonialAuthor>
//               <div style={{ marginTop: "1rem" }}>
//                 {[...Array(testimonial.rating)].map((_, i) => (
//                   <Star
//                     key={i}
//                     size={16}
//                     fill="#fde047"
//                     color="#fde047"
//                     style={{ marginRight: "0.25rem" }}
//                   />
//                 ))}
//               </div>
//             </TestimonialCard>
//           ))}
//         </Grid>
//       </Section>

//       <Section style={{ textAlign: "center" }}>
//         <SectionTitle>Ready to Transform Your Business?</SectionTitle>
//         <SectionSubtitle>
//           Let's create something amazing together
//         </SectionSubtitle>
//         <Button size="large" onClick={() => setCurrentPage("contact")}>
//           Get Started Today
//           <ArrowRight size={20} />
//         </Button>
//       </Section>
//     </>
//   );

//   const ServicesPage = () => (
//     <>
//       <HeroSection>
//         <HeroTitle>Our Services</HeroTitle>
//         <HeroSubtitle>Everything you need to succeed online</HeroSubtitle>
//       </HeroSection>

//       <Section>
//         <Grid>
//           {services.map((service, index) => (
//             <Card key={index} transparent hoverable>
//               <IconBox>{service.icon}</IconBox>
//               <h3
//                 style={{
//                   color: "white",
//                   fontSize: "1.5rem",
//                   marginBottom: "1rem",
//                 }}
//               >
//                 {service.title}
//               </h3>
//               <p
//                 style={{
//                   color: "#e9d5ff",
//                   marginBottom: "1.5rem",
//                   lineHeight: "1.6",
//                 }}
//               >
//                 {service.description}
//               </p>
//               <ul style={{ listStyle: "none" }}>
//                 {service.features.map((feature, i) => (
//                   <li
//                     key={i}
//                     style={{
//                       color: "white",
//                       padding: "0.5rem 0",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "0.5rem",
//                     }}
//                   >
//                     <CheckCircle size={16} color="#fde047" />
//                     {feature}
//                   </li>
//                 ))}
//               </ul>
//             </Card>
//           ))}
//         </Grid>
//       </Section>

//       <Section>
//         <SectionTitle>Our Process</SectionTitle>
//         <SectionSubtitle>How we bring your vision to life</SectionSubtitle>
//         <Grid minWidth="200px">
//           {process.map((step, index) => (
//             <ProcessStep key={index}>
//               <StepNumber>{step.number}</StepNumber>
//               <h3
//                 style={{
//                   color: "white",
//                   fontSize: "1.25rem",
//                   marginBottom: "0.5rem",
//                 }}
//               >
//                 {step.title}
//               </h3>
//               <p style={{ color: "#e9d5ff" }}>{step.description}</p>
//             </ProcessStep>
//           ))}
//         </Grid>
//       </Section>
//     </>
//   );

//   const AboutPage = () => (
//     <>
//       <HeroSection>
//         <HeroTitle>About Us</HeroTitle>
//         <HeroSubtitle>Passionate about your success</HeroSubtitle>
//       </HeroSection>

//       <Section>
//         <Card padding="3rem">
//           <h2
//             style={{
//               color: "white",
//               fontSize: "2.5rem",
//               marginBottom: "2rem",
//               textAlign: "center",
//             }}
//           >
//             We're CreativeFlow
//           </h2>
//           <p
//             style={{
//               color: "#e9d5ff",
//               fontSize: "1.1rem",
//               lineHeight: "1.8",
//               textAlign: "center",
//               maxWidth: "800px",
//               margin: "0 auto",
//             }}
//           >
//             Founded in 2014, CreativeFlow has grown from a small team of
//             passionate creators to a full-service digital agency. We believe in
//             the power of creativity combined with strategic thinking to deliver
//             exceptional results. Our mission is to help businesses thrive in the
//             digital age through innovative solutions and dedicated partnership.
//           </p>
//         </Card>
//       </Section>

//       <Section>
//         <SectionTitle>Meet Our Team</SectionTitle>
//         <SectionSubtitle>
//           The creative minds behind your success
//         </SectionSubtitle>
//         <Grid minWidth="250px">
//           {team.map((member, index) => (
//             <Card
//               key={index}
//               transparent
//               hoverable
//               style={{ textAlign: "center" }}
//             >
//               <IconBox size="8rem" iconSize="4rem" round marginBottom="1.5rem">
//                 {member.icon}
//               </IconBox>
//               <h3
//                 style={{
//                   color: "white",
//                   fontSize: "1.5rem",
//                   marginBottom: "0.5rem",
//                 }}
//               >
//                 {member.name}
//               </h3>
//               <p style={{ color: "#fde047" }}>{member.role}</p>
//             </Card>
//           ))}
//         </Grid>
//       </Section>

//       <Section>
//         <SectionTitle>Our Journey</SectionTitle>
//         <TimelineContainer>
//           <TimelineItem>
//             <TimelineDot />
//             <TimelineContent transparent>
//               <h3>2014 - The Beginning</h3>
//               <p>Started with a vision to help businesses grow online</p>
//             </TimelineContent>
//           </TimelineItem>
//           <TimelineItem>
//             <TimelineDot />
//             <TimelineContent transparent>
//               <h3>2017 - Rapid Growth</h3>
//               <p>Expanded team and services, reached 100+ clients</p>
//             </TimelineContent>
//           </TimelineItem>
//           <TimelineItem>
//             <TimelineDot />
//             <TimelineContent transparent>
//               <h3>2020 - Innovation</h3>
//               <p>Launched AI-powered marketing tools and analytics</p>
//             </TimelineContent>
//           </TimelineItem>
//           <TimelineItem>
//             <TimelineDot />
//             <TimelineContent transparent>
//               <h3>2025 - Today</h3>
//               <p>500+ successful projects and counting</p>
//             </TimelineContent>
//           </TimelineItem>
//         </TimelineContainer>
//       </Section>
//     </>
//   );

//   const PortfolioPage = () => (
//     <>
//       <HeroSection>
//         <HeroTitle>Portfolio</HeroTitle>
//         <HeroSubtitle>Our latest work and success stories</HeroSubtitle>
//       </HeroSection>

//       <Section>
//         <Grid>
//           {portfolioItems.map((item, index) => (
//             <Card key={index} transparent hoverable clickable>
//               <div
//                 style={{
//                   fontSize: "4rem",
//                   marginBottom: "1rem",
//                   textAlign: "center",
//                 }}
//               >
//                 {item.image}
//               </div>
//               <Badge style={{ marginBottom: "1rem" }}>{item.category}</Badge>
//               <h3
//                 style={{
//                   color: "white",
//                   fontSize: "1.5rem",
//                   marginBottom: "0.5rem",
//                 }}
//               >
//                 {item.title}
//               </h3>
//               <p style={{ color: "#e9d5ff" }}>{item.description}</p>
//               <Button
//                 variant="outline"
//                 style={{ marginTop: "1.5rem", width: "100%" }}
//               >
//                 View Case Study
//                 <ArrowRight size={16} />
//               </Button>
//             </Card>
//           ))}
//         </Grid>
//       </Section>
//     </>
//   );

//   const PricingPage = () => (
//     <>
//       <HeroSection>
//         <HeroTitle>Pricing Plans</HeroTitle>
//         <HeroSubtitle>Transparent pricing for every budget</HeroSubtitle>
//       </HeroSection>

//       <Section>
//         <Grid>
//           {pricingPlans.map((plan, index) => (
//             <PricingCard key={index} transparent featured={plan.featured}>
//               {plan.badge && <PricingBadge>{plan.badge}</PricingBadge>}
//               <PricingTitle>{plan.name}</PricingTitle>
//               <PricingPrice>
//                 <span>{plan.price}</span>
//                 <small>{plan.period}</small>
//               </PricingPrice>
//               <PricingFeatures>
//                 {plan.features.map((feature, i) => (
//                   <li key={i}>
//                     <CheckCircle size={20} />
//                     {feature}
//                   </li>
//                 ))}
//               </PricingFeatures>
//               <Button
//                 variant={plan.featured ? "primary" : "outline"}
//                 style={{ width: "100%" }}
//                 onClick={() => setCurrentPage("contact")}
//               >
//                 Get Started
//               </Button>
//             </PricingCard>
//           ))}
//         </Grid>
//       </Section>

//       <Section>
//         <SectionTitle>Frequently Asked Questions</SectionTitle>
//         <div style={{ maxWidth: "800px", margin: "0 auto" }}>
//           {faqs.map((faq, index) => (
//             <FAQItem key={index}>
//               <FAQQuestion
//                 open={openFAQ === index}
//                 onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
//               >
//                 {faq.question}
//                 <ChevronRight size={20} />
//               </FAQQuestion>
//               <FAQAnswer open={openFAQ === index}>
//                 <p>{faq.answer}</p>
//               </FAQAnswer>
//             </FAQItem>
//           ))}
//         </div>
//       </Section>
//     </>
//   );

//   const ContactPage = () => (
//     <>
//       <HeroSection>
//         <HeroTitle>Get In Touch</HeroTitle>
//         <HeroSubtitle>Let's create something amazing together</HeroSubtitle>
//       </HeroSection>

//       <Section>
//         <Grid gap="3rem">
//           <div>
//             <Card transparent>
//               <h3
//                 style={{
//                   color: "white",
//                   fontSize: "1.75rem",
//                   marginBottom: "2rem",
//                 }}
//               >
//                 Send Us a Message
//               </h3>
//               <ContactForm onSubmit={handleSubmit}>
//                 <FormGroup>
//                   <Label>Your Name</Label>
//                   <Input type="text" placeholder="John Doe" required />
//                 </FormGroup>

//                 <FormGroup>
//                   <Label>Email Address</Label>
//                   <Input type="email" placeholder="john@example.com" required />
//                 </FormGroup>

//                 <FormGroup>
//                   <Label>Phone Number</Label>
//                   <Input type="tel" placeholder="+357 22 123456" />
//                 </FormGroup>

//                 <FormGroup>
//                   <Label>Project Type</Label>
//                   <Input as="select" required style={{ cursor: "pointer" }}>
//                     <option value="">Select a service</option>
//                     <option value="brand">Brand Design</option>
//                     <option value="web">Web Development</option>
//                     <option value="marketing">Digital Marketing</option>
//                     <option value="mobile">Mobile Solutions</option>
//                     <option value="other">Other</option>
//                   </Input>
//                 </FormGroup>

//                 <FormGroup>
//                   <Label>Message</Label>
//                   <TextArea
//                     placeholder="Tell us about your project..."
//                     required
//                   />
//                 </FormGroup>

//                 <Button type="submit" style={{ width: "100%" }}>
//                   Send Message
//                   <Send size={20} />
//                 </Button>
//               </ContactForm>
//             </Card>
//           </div>

//           <div>
//             <Card transparent>
//               <h3
//                 style={{
//                   color: "white",
//                   fontSize: "1.75rem",
//                   marginBottom: "2rem",
//                 }}
//               >
//                 Contact Information
//               </h3>
//               <div style={{ marginBottom: "2rem" }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "1rem",
//                     marginBottom: "1.5rem",
//                   }}
//                 >
//                   <IconBox size="3rem" iconSize="1.5rem">
//                     <Mail />
//                   </IconBox>
//                   <div>
//                     <p style={{ color: "#fde047", fontWeight: "600" }}>Email</p>
//                     <p style={{ color: "white" }}>hello@creativeflow.com</p>
//                   </div>
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "1rem",
//                     marginBottom: "1.5rem",
//                   }}
//                 >
//                   <IconBox size="3rem" iconSize="1.5rem">
//                     <Phone />
//                   </IconBox>
//                   <div>
//                     <p style={{ color: "#fde047", fontWeight: "600" }}>Phone</p>
//                     <p style={{ color: "white" }}>+357 22 123456</p>
//                   </div>
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "1rem",
//                     marginBottom: "1.5rem",
//                   }}
//                 >
//                   <IconBox size="3rem" iconSize="1.5rem">
//                     <MapPin />
//                   </IconBox>
//                   <div>
//                     <p style={{ color: "#fde047", fontWeight: "600" }}>
//                       Address
//                     </p>
//                     <p style={{ color: "white" }}>
//                       123 Business Center
//                       <br />
//                       Nicosia, Cyprus
//                     </p>
//                   </div>
//                 </div>

//                 <div
//                   style={{ display: "flex", alignItems: "center", gap: "1rem" }}
//                 >
//                   <IconBox size="3rem" iconSize="1.5rem">
//                     <Clock />
//                   </IconBox>
//                   <div>
//                     <p style={{ color: "#fde047", fontWeight: "600" }}>
//                       Business Hours
//                     </p>
//                     <p style={{ color: "white" }}>
//                       Mon - Fri: 9:00 - 18:00
//                       <br />
//                       Sat - Sun: Closed
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </Card>

//             <Card transparent style={{ marginTop: "2rem" }}>
//               <h3
//                 style={{
//                   color: "white",
//                   fontSize: "1.75rem",
//                   marginBottom: "1.5rem",
//                 }}
//               >
//                 Follow Us
//               </h3>
//               <SocialLinks>
//                 <SocialIcon href="#" aria-label="Facebook">
//                   <MessageCircle />
//                 </SocialIcon>
//                 <SocialIcon href="#" aria-label="Twitter">
//                   <Globe />
//                 </SocialIcon>
//                 <SocialIcon href="#" aria-label="LinkedIn">
//                   <Briefcase />
//                 </SocialIcon>
//                 <SocialIcon href="#" aria-label="Instagram">
//                   <Camera />
//                 </SocialIcon>
//               </SocialLinks>
//             </Card>
//           </div>
//         </Grid>
//       </Section>
//     </>
//   );

//   const renderPage = () => {
//     switch (currentPage) {
//       case "home":
//         return <HomePage />;
//       case "services":
//         return <ServicesPage />;
//       case "about":
//         return <AboutPage />;
//       case "portfolio":
//         return <PortfolioPage />;
//       case "pricing":
//         return <PricingPage />;
//       case "contact":
//         return <ContactPage />;
//       default:
//         return <HomePage />;
//     }
//   };

//   return (
//     <>
//       <GlobalStyle />
//       <AppContainer>
//         <BackgroundPattern />

//         <NavBar>
//           <NavContainer>
//             <Logo onClick={() => setCurrentPage("home")}>
//               <Zap />
//               <span>CreativeFlow</span>
//             </Logo>

//             <DesktopNav>
//               {navigation.map((item) => (
//                 <NavButton
//                   key={item.id}
//                   active={currentPage === item.id}
//                   onClick={() => setCurrentPage(item.id)}
//                 >
//                   {item.name}
//                 </NavButton>
//               ))}
//             </DesktopNav>

//             <MobileMenuButton
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </MobileMenuButton>
//           </NavContainer>

//           <MobileMenu open={mobileMenuOpen}>
//             {navigation.map((item) => (
//               <MobileNavItem
//                 key={item.id}
//                 active={currentPage === item.id}
//                 onClick={() => {
//                   setCurrentPage(item.id);
//                   setMobileMenuOpen(false);
//                 }}
//               >
//                 {item.name}
//               </MobileNavItem>
//             ))}
//           </MobileMenu>
//         </NavBar>

//         <PageContainer>{renderPage()}</PageContainer>

//         <Footer>
//           <FooterContent>
//             <FooterSection>
//               <Logo>
//                 <Zap />
//                 <span>CreativeFlow</span>
//               </Logo>
//               <p style={{ marginTop: "1rem" }}>
//                 Your partner in digital success. We create, you grow.
//               </p>
//               <SocialLinks>
//                 <SocialIcon href="#" aria-label="Facebook">
//                   <MessageCircle />
//                 </SocialIcon>
//                 <SocialIcon href="#" aria-label="Twitter">
//                   <Globe />
//                 </SocialIcon>
//                 <SocialIcon href="#" aria-label="LinkedIn">
//                   <Briefcase />
//                 </SocialIcon>
//               </SocialLinks>
//             </FooterSection>

//             <FooterSection>
//               <h4>Quick Links</h4>
//               <a
//                 href="#"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   setCurrentPage("about");
//                 }}
//               >
//                 About Us
//               </a>
//               <a
//                 href="#"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   setCurrentPage("services");
//                 }}
//               >
//                 Services
//               </a>
//               <a
//                 href="#"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   setCurrentPage("portfolio");
//                 }}
//               >
//                 Portfolio
//               </a>
//               <a
//                 href="#"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   setCurrentPage("pricing");
//                 }}
//               >
//                 Pricing
//               </a>
//             </FooterSection>

//             <FooterSection>
//               <h4>Services</h4>
//               <a href="#">Brand Design</a>
//               <a href="#">Web Development</a>
//               <a href="#">Digital Marketing</a>
//               <a href="#">Mobile Solutions</a>
//             </FooterSection>

//             <FooterSection>
//               <h4>Contact</h4>
//               <p>hello@creativeflow.com</p>
//               <p>+357 22 123456</p>
//               <p>
//                 123 Business Center
//                 <br />
//                 Nicosia, Cyprus
//               </p>
//             </FooterSection>
//           </FooterContent>

//           <Copyright>
//             <p>&copy; 2025 CreativeFlow. All rights reserved.</p>
//           </Copyright>
//         </Footer>
//       </AppContainer>
//     </>
//   );
// };

// export default MarketingAgency;
// //
