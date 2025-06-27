// import React, { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/router";
// import { useSession } from "next-auth/react";
// import styled, { keyframes } from "styled-components";
// import {
//   FiCalendar,
//   FiMapPin,
//   FiDollarSign,
//   FiRefreshCw,
//   FiEdit3,
//   FiStar,
//   FiClock,
//   FiUsers,
//   FiActivity,
//   FiHeart,
//   FiLoader,
//   FiCheck,
//   FiX,
//   FiChevronLeft,
//   FiInfo,
//   FiSearch,
//   FiSun,
//   FiCloud,
//   FiCloudRain,
// } from "react-icons/fi";
// import {
//   FaPlane,
//   FaHotel,
//   FaWifi,
//   FaCoffee,
//   FaSwimmingPool,
//   FaParking,
//   FaUtensils,
//   FaSpa,
//   FaConciergeBell,
//   FaDumbbell,
//   FaMagic,
//   FaLightbulb,
//   FaCompass,
//   FaBaby,
//   FaChild,
//   FaCheck,
// } from "react-icons/fa";
// import { MdFlightTakeoff, MdFlightLand, MdChildCare } from "react-icons/md";
// import AuthModal from "./components/modals/AuthModal";
// import WishlistButton from "./components/WishlistButton";

// // Animations
// const fadeIn = keyfram`
//   from { opacity: 0; transform: translateY(30px); }
//   to { opacity: 1; transform: translateY(0); }
// `;

// const slideIn = keyfram`
//   from { transform: translateX(-100%); opacity: 0; }
//   to { transform: translateX(0); opacity: 1; }
// `;

// const pulse = keyfram`
//   0% { transform: scale(1); }
//   50% { transform: scale(1.05); }
//   100% { transform: scale(1); }
// `;

// const gradient = keyfram`
//   0% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
//   100% { background-position: 0% 50%; }
// `;

// const spin = keyframe`
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// `;

// const shimmer = keyframe`
//   0% { background-position: -200% 0; }
//   100% { background-position: 200% 0; }
// `;

// const float = keyframe`
//   0%, 100% { transform: translateY(0px); }
//   50% { transform: translateY(-10px); }
// `;

// const glow = keyframe`
//   0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
//   50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
// `;

// // Page Wrapper
// const PageWrapper = styled.div`
//   min-height: 100vh;
//   background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
//   position: relative;

//   &::before {
//     content: "";
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M20 20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm0-20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z'/%3E%3C/g%3E%3C/svg%3E");
//     z-index: -1;
//   }
// `;

// // Header with destination image background
// const Header = styled.div`
//   background:
//     linear-gradient(
//       135deg,
//       rgba(102, 126, 234, 0.9) 0%,
//       rgba(118, 75, 162, 0.9) 25%,
//       rgba(240, 147, 251, 0.9) 50%,
//       rgba(79, 172, 254, 0.9) 75%,
//       rgba(102, 126, 234, 0.9) 100%
//     ),
//     ${(props) =>
//       props.destinationImage ? `url(${props.destinationImage})` : "none"};
//   background-size:
//     400% 400%,
//     cover;
//   background-position: center, center;
//   animation: ${gradient} 15s ease infinite;
//   padding: 3rem 0;
//   position: relative;
//   overflow: hidden;
//   border-bottom: 5px solid rgba(255, 255, 255, 0.2);

//   &::after {
//     content: "";
//     position: absolute;
//     top: -50%;
//     left: -50%;
//     width: 200%;
//     height: 200%;
//     background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
//     z-index: 0;
//     animation: ${float} 20s ease-in-out infinite;
//   }
// `;

// const HeaderContent = styled.div`
//   max-width: 1200px;
//   margin: 0 auto;
//   padding: 0 2rem;
//   position: relative;
//   z-index: 1;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;

//   @media (max-width: 768px) {
//     padding: 0 1rem;
//     flex-direction: column;
//     gap: 1rem;
//   }
// `;

// const BackButton = styled.button`
//   background: rgba(255, 255, 255, 0.15);
//   backdrop-filter: blur(20px);
//   border: 2px solid rgba(255, 255, 255, 0.3);
//   color: white;
//   padding: 1rem 2rem;
//   border-radius: 50px;
//   font-weight: 600;
//   cursor: pointer;
//   transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   font-size: 1rem;
//   box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

//   &:hover {
//     background: rgba(255, 255, 255, 0.25);
//     transform: translateY(-3px);
//     box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
//   }
// `;

// const HeaderTitleSection = styled.div`
//   text-align: center;
//   flex: 1;

//   @media (max-width: 768px) {
//     order: -1;
//   }
// `;

// const PageTitle = styled.h1`
//   font-size: 2.5rem;
//   font-weight: 900;
//   color: white;
//   text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
//   margin-bottom: 0.75rem;
//   letter-spacing: -0.5px;

//   @media (max-width: 768px) {
//     font-size: 2rem;
//   }
// `;

// const SearchDisplay = styled.div`
//   background: rgba(255, 255, 255, 0.15);
//   backdrop-filter: blur(20px);
//   border: 2px solid rgba(255, 255, 255, 0.3);
//   color: white;
//   padding: 0.75rem 1.5rem;
//   border-radius: 50px;
//   font-size: 0.95rem;
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   font-weight: 500;
//   box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

//   svg {
//     font-size: 1.1rem;
//   }
// `;

// // Main Container
// const Container = styled.div`
//   max-width: 1200px;
//   margin: 0 auto;
//   padding: 4rem 2rem;
//   display: grid;
//   grid-template-columns: 1fr 400px;
//   gap: 3rem;
//   animation: ${fadeIn} 1s ease-out;

//   @media (max-width: 968px) {
//     grid-template-columns: 1fr;
//     padding: 3rem 1rem;
//     gap: 2rem;
//   }
// `;

// // Loading State
// // const LoadingCard = styled.div`
// //   background: white;
// //   border-radius: 32px;
// //   padding: 5rem;
// //   text-align: center;
// //   box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
// //   border: 1px solid rgba(255, 255, 255, 0.8);

// //   svg {
// //     font-size: 4rem;
// //     color: #667eea;
// //     animation: ${spin} 1s linear infinite;
// //     margin-bottom: 2rem;
// //   }

// //   p {
// //     font-size: 1.25rem;
// //     color: #4b5563;
// //     margin: 0;
// //     font-weight: 500;
// //   }
// // `;

// // Main Trip Card with glassmorphism
// const TripCard = styled.div`
//   background: rgba(255, 255, 255, 0.95);
//   backdrop-filter: blur(20px);
//   border-radius: 32px;
//   box-shadow: 0 25px 80px rgba(0, 0, 0, 0.1);
//   overflow: hidden;
//   animation: ${slideIn} 0.8s ease-out;
//   border: 1px solid rgba(255, 255, 255, 0.8);
//   position: relative;

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     height: 2px;
//     background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #4facfe);
//     background-size: 200% 200%;
//     animation: ${gradient} 3s ease infinite;
//   }
// `;

// const TripHeader = styled.div`
//   background:
//     linear-gradient(
//       135deg,
//       rgba(102, 126, 234, 0.95) 0%,
//       rgba(118, 75, 162, 0.95) 100%
//     ),
//     ${(props) =>
//       props.destinationImage ? `url(${props.destinationImage})` : "none"};
//   background-size: cover;
//   background-position: center;
//   color: white;
//   padding: 3rem;
//   position: relative;
//   overflow: hidden;

//   &::before {
//     content: "${(props) => (props.hasChildren ? "👶" : "✈️")}";
//     position: absolute;
//     right: -40px;
//     top: -40px;
//     font-size: 180px;
//     opacity: 0.1;
//     transform: rotate(20deg);
//     animation: ${float} 6s ease-in-out infinite;
//   }

//   &::after {
//     content: "";
//     position: absolute;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     height: 100px;
//     background: linear-gradient(
//       to top,
//       rgba(0, 0, 0, 0.3) 0%,
//       transparent 100%
//     );
//   }
// `;

// const Destination = styled.h2`
//   font-size: 3rem;
//   font-weight: 900;
//   margin-bottom: 1rem;
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   position: relative;
//   z-index: 1;
//   text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
//   letter-spacing: -1px;

//   svg {
//     font-size: 2.5rem;
//     filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
//   }

//   @media (max-width: 768px) {
//     font-size: 2.5rem;
//   }
// `;

// const TripMeta = styled.div`
//   display: flex;
//   gap: 2.5rem;
//   margin-top: 1.5rem;
//   flex-wrap: wrap;
//   position: relative;
//   z-index: 1;
// `;

// const MetaItem = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   font-size: 1.2rem;
//   font-weight: 500;
//   background: rgba(255, 255, 255, 0.15);
//   backdrop-filter: blur(10px);
//   padding: 0.75rem 1.5rem;
//   border-radius: 50px;
//   border: 1px solid rgba(255, 255, 255, 0.2);

//   svg {
//     font-size: 1.4rem;
//     filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.2));
//   }
// `;

// const FamilyBadge = styled.div`
//   background: rgba(255, 255, 255, 0.2);
//   backdrop-filter: blur(15px);
//   border: 2px solid rgba(255, 255, 255, 0.3);
//   padding: 0.75rem 1.5rem;
//   border-radius: 50px;
//   font-size: 1rem;
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   margin-left: auto;
//   font-weight: 600;
//   animation: ${pulse} 3s ease-in-out infinite;
// `;

// // Content Sections
// const ContentSection = styled.div`
//   padding: 2.5rem;
//   border-bottom: 1px solid rgba(229, 231, 235, 0.5);
//   position: relative;

//   &:last-child {
//     border-bottom: none;
//   }

//   &:hover {
//     background: rgba(102, 126, 234, 0.02);
//     transition: all 0.3s ease;
//   }
// `;

// const SectionTitle = styled.h3`
//   font-size: 1.75rem;
//   font-weight: 800;
//   color: #1f2937;
//   margin-bottom: 2rem;
//   display: flex;
//   align-items: center;
//   gap: 1rem;

//   svg {
//     color: #667eea;
//     filter: drop-shadow(2px 2px 4px rgba(102, 126, 234, 0.2));
//     font-size: 2rem;
//   }
// `;

// // Weather Section with enhanced visuals
// const WeatherContainer = styled.div`
//   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//   border-radius: 24px;
//   padding: 2rem;
//   color: white;
//   margin-bottom: 2rem;
//   position: relative;
//   overflow: hidden;
//   box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);

//   &::before {
//     content: "";
//     position: absolute;
//     top: -50%;
//     right: -50%;
//     width: 200%;
//     height: 200%;
//     background: radial-gradient(
//       circle,
//       rgba(255, 255, 255, 0.1) 0%,
//       transparent 70%
//     );
//     animation: ${float} 8s ease-in-out infinite;
//   }
// `;

// const WeatherHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1.5rem;
//   position: relative;
//   z-index: 1;

//   h4 {
//     font-size: 1.5rem;
//     font-weight: 800;
//     margin: 0;
//     display: flex;
//     align-items: center;
//     gap: 0.75rem;
//   }

//   .live-badge {
//     background: rgba(255, 255, 255, 0.2);
//     padding: 0.5rem 1rem;
//     border-radius: 50px;
//     font-size: 0.8rem;
//     font-weight: 700;
//     border: 1px solid rgba(255, 255, 255, 0.3);
//     animation: ${glow} 2s ease-in-out infinite;
//   }
// `;

// const WeatherGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
//   gap: 1.25rem;
//   margin-bottom: 1.5rem;
//   position: relative;
//   z-index: 1;
// `;

// const WeatherDay = styled.div`
//   background: rgba(255, 255, 255, 0.15);
//   backdrop-filter: blur(15px);
//   border-radius: 16px;
//   padding: 1.5rem;
//   text-align: center;
//   border: 2px solid rgba(255, 255, 255, 0.2);
//   transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//   position: relative;
//   overflow: hidden;

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: -100%;
//     width: 100%;
//     height: 100%;
//     background: linear-gradient(
//       90deg,
//       transparent,
//       rgba(255, 255, 255, 0.1),
//       transparent
//     );
//     transition: left 0.5s;
//   }

//   &:hover {
//     transform: translateY(-5px);
//     background: rgba(255, 255, 255, 0.25);
//     box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

//     &::before {
//       left: 100%;
//     }
//   }

//   .date {
//     font-size: 0.8rem;
//     opacity: 0.9;
//     margin-bottom: 0.75rem;
//     font-weight: 600;
//   }

//   .icon {
//     font-size: 2.5rem;
//     margin: 0.75rem 0;
//     filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
//   }

//   .temp {
//     font-size: 1.3rem;
//     font-weight: 800;
//     margin-bottom: 0.5rem;
//   }

//   .condition {
//     font-size: 0.8rem;
//     opacity: 0.9;
//     font-weight: 500;
//   }
// `;

// const WeatherSummary = styled.div`
//   background: rgba(255, 255, 255, 0.1);
//   border-radius: 12px;
//   padding: 1.5rem;
//   font-size: 0.95rem;
//   position: relative;
//   z-index: 1;
//   border: 1px solid rgba(255, 255, 255, 0.2);

//   .summary {
//     margin-bottom: 0.75rem;
//     font-weight: 600;
//   }

//   .advice {
//     opacity: 0.9;
//     font-style: italic;
//     font-weight: 500;
//   }
// `;

// // Boarding Pass Style Flight Section
// const FlightContainer = styled.div`
//   display: grid;
//   gap: 2rem;
// `;

// const BoardingPass = styled.div`
//   background: white;
//   border-radius: 16px;
//   overflow: hidden;
//   box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
//   border: 2px solid #e5e7eb;
//   position: relative;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 16px 48px rgba(0, 0, 0, 0.16);
//   }

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     height: 4px;
//     background: linear-gradient(90deg, #1e40af, #3b82f6, #06b6d4);
//   }
// `;

// const BoardingPassHeader = styled.div`
//   background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
//   padding: 1.5rem 2rem;
//   border-bottom: 2px dashed #cbd5e1;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;

//   .airline {
//     font-size: 1.2rem;
//     font-weight: 800;
//     color: #1e293b;
//     text-transform: uppercase;
//     letter-spacing: 2px;
//   }

//   .boarding-pass-label {
//     display: flex;
//     align-items: center;
//     gap: 0.5rem;
//     font-size: 0.875rem;
//     font-weight: 600;
//     color: #64748b;
//     text-transform: uppercase;
//     letter-spacing: 1px;
//   }
// `;

// const BoardingPassContent = styled.div`
//   padding: 2rem;
//   display: grid;
//   grid-template-columns: 1fr auto 1fr;
//   gap: 2rem;
//   align-items: center;
//   position: relative;

//   @media (max-width: 600px) {
//     grid-template-columns: 1fr;
//     gap: 1.5rem;
//     text-align: center;
//   }
// `;

// const FlightEndpoint = styled.div`
//   text-align: ${(props) => props.align || "left"};

//   .airport-code {
//     font-size: 3rem;
//     font-weight: 900;
//     color: #1e293b;
//     margin-bottom: 0.25rem;
//     letter-spacing: -2px;
//     line-height: 1;
//   }

//   .city-name {
//     font-size: 1rem;
//     color: #64748b;
//     font-weight: 600;
//     margin-bottom: 0.75rem;
//     text-transform: uppercase;
//     letter-spacing: 1px;
//   }

//   .time {
//     font-size: 1.5rem;
//     font-weight: 700;
//     color: #1e293b;
//     margin-bottom: 0.25rem;
//   }

//   .date {
//     font-size: 0.875rem;
//     color: #3b82f6;
//     font-weight: 600;
//     text-transform: uppercase;
//   }
// `;

// const FlightConnector = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   position: relative;

//   .flight-path {
//     width: 120px;
//     height: 2px;
//     background: linear-gradient(90deg, #cbd5e1, #94a3b8, #cbd5e1);
//     border-radius: 1px;
//     position: relative;
//     margin: 1rem 0;

//     &::before {
//       content: "";
//       position: absolute;
//       left: 0;
//       top: -3px;
//       width: 8px;
//       height: 8px;
//       border-radius: 50%;
//       background: #3b82f6;
//     }

//     &::after {
//       content: "";
//       position: absolute;
//       right: 0;
//       top: -3px;
//       width: 8px;
//       height: 8px;
//       border-radius: 50%;
//       background: #3b82f6;
//     }
//   }

//   .plane-icon {
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     color: #3b82f6;
//     font-size: 1.5rem;
//     background: white;
//     padding: 0.5rem;
//     border-radius: 50%;
//     box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
//   }

//   .flight-duration {
//     font-size: 0.75rem;
//     color: #64748b;
//     font-weight: 600;
//     text-transform: uppercase;
//     letter-spacing: 1px;
//     margin-top: 0.5rem;
//   }

//   @media (max-width: 600px) {
//     .flight-path {
//       width: 80px;
//     }
//   }
// `;

// const BoardingPassFooter = styled.div`
//   background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
//   padding: 1.5rem 2rem;
//   border-top: 2px dashed #cbd5e1;
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
//   gap: 1.5rem;

//   @media (max-width: 600px) {
//     grid-template-columns: repeat(2, 1fr);
//     gap: 1rem;
//   }
// `;

// const BoardingInfo = styled.div`
//   text-align: center;

//   .label {
//     font-size: 0.75rem;
//     color: #64748b;
//     font-weight: 600;
//     text-transform: uppercase;
//     letter-spacing: 1px;
//     margin-bottom: 0.25rem;
//   }

//   .value {
//     font-size: 1rem;
//     color: #1e293b;
//     font-weight: 700;
//   }
// `;

// const FlightStatus = styled.div`
//   position: absolute;
//   top: 1rem;
//   right: 1rem;
//   background: linear-gradient(135deg, #10b981 0%, #059669 100%);
//   color: white;
//   padding: 0.5rem 1rem;
//   border-radius: 50px;
//   font-size: 0.75rem;
//   font-weight: 700;
//   text-transform: uppercase;
//   letter-spacing: 1px;
//   box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
// `;

// // Helper function to get airport code from city
// const getAirportCode = (location) => {
//   const codes = {
//     London: "LHR",
//     Paris: "CDG",
//     Tokyo: "NRT",
//     "New York": "JFK",
//     Rome: "FCO",
//     Barcelona: "BCN",
//     Amsterdam: "AMS",
//     Dubai: "DXB",
//     Sydney: "SYD",
//     "Your Location": "XXX",
//   };

//   const city = location.split(",")[0].trim();
//   return codes[city] || city.substring(0, 3).toUpperCase();
// };

// // Activities Section with images
// const ActivitiesGrid = styled.div`
//   display: grid;
//   gap: 1.5rem;
// `;

// const ActivityCard = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 0;
//   background: ${(props) =>
//     props.selected
//       ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//       : "white"};
//   border: 3px solid ${(props) => (props.selected ? "#667eea" : "#e5e7eb")};
//   border-radius: 20px;
//   cursor: pointer;
//   transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//   position: relative;
//   overflow: hidden;
//   box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
//   min-height: 120px;

//   ${(props) =>
//     props.childFriendly &&
//     `
//     &::after {
//       content: "👶";
//       position: absolute;
//       top: 1rem;
//       right: 1rem;
//       font-size: 1.75rem;
//       opacity: 0.8;
//       z-index: 2;
//     }
//   `}

//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
//     border-color: #667eea;
//   }
// `;

// const ActivityImage = styled.div`
//   width: 120px;
//   height: 120px;
//   background: ${(props) =>
//     props.image
//       ? `url(${props.image})`
//       : "linear-gradient(135deg, #667eea, #764ba2)"};
//   background-size: cover;
//   background-position: center;
//   position: relative;
//   flex-shrink: 0;

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background: ${(props) =>
//       props.selected ? "rgba(102, 126, 234, 0.3)" : "rgba(0, 0, 0, 0.1)"};
//   }
// `;

// const ActivityContent = styled.div`
//   flex: 1;
//   padding: 1.5rem;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;

//   .info {
//     flex: 1;

//     .name {
//       font-weight: 700;
//       font-size: 1.1rem;
//       color: ${(props) => (props.selected ? "white" : "#1f2937")};
//       margin-bottom: 0.5rem;
//     }

//     .description {
//       font-size: 0.9rem;
//       color: ${(props) =>
//         props.selected ? "rgba(255, 255, 255, 0.9)" : "#6b7280"};
//       margin-bottom: 0.25rem;
//     }

//     .child-note {
//       font-size: 0.8rem;
//       color: ${(props) =>
//         props.selected ? "rgba(255, 255, 255, 0.8)" : "#f59e0b"};
//       font-weight: 600;
//     }
//   }

//   .price {
//     font-weight: 800;
//     color: ${(props) => (props.selected ? "white" : "#667eea")};
//     font-size: 1.4rem;
//     background: ${(props) =>
//       props.selected
//         ? "rgba(255, 255, 255, 0.15)"
//         : "rgba(102, 126, 234, 0.1)"};
//     padding: 0.75rem 1.25rem;
//     border-radius: 50px;
//     border: 2px solid
//       ${(props) =>
//         props.selected
//           ? "rgba(255, 255, 255, 0.3)"
//           : "rgba(102, 126, 234, 0.2)"};
//   }
// `;

// // Enhanced Hotel Section
// const HotelContainer = styled.div`
//   background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
//   border-radius: 20px;
//   padding: 2rem;
//   border: 2px solid #e5e7eb;
//   position: relative;
//   overflow: hidden;

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     height: 3px;
//     background: linear-gradient(90deg, #667eea, #764ba2);
//   }
// `;

// const HotelImageSection = styled.div`
//   width: 100%;
//   height: 200px;
//   background: ${(props) =>
//     props.image
//       ? `url(${props.image})`
//       : "linear-gradient(135deg, #667eea, #764ba2)"};
//   background-size: cover;
//   background-position: center;
//   border-radius: 16px;
//   margin-bottom: 1.5rem;
//   position: relative;
//   overflow: hidden;

//   &::after {
//     content: "";
//     position: absolute;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     height: 50%;
//     background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
//   }
// `;

// const HotelName = styled.h4`
//   font-size: 1.5rem;
//   font-weight: 700;
//   color: #1f2937;
//   margin-bottom: 1rem;
// `;

// const Rating = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   margin-bottom: 1.5rem;

//   .stars {
//     display: flex;
//     gap: 0.25rem;
//     color: #fbbf24;
//     filter: drop-shadow(1px 1px 2px rgba(251, 191, 36, 0.3));
//   }

//   .text {
//     color: #6b7280;
//     font-size: 1rem;
//     font-weight: 600;
//   }
// `;

// const Amenities = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 1rem;
// `;

// const Amenity = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   background: white;
//   padding: 0.75rem 1.25rem;
//   border-radius: 50px;
//   font-size: 0.9rem;
//   color: #4b5563;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
//   font-weight: 500;
//   border: 1px solid rgba(102, 126, 234, 0.1);
//   transition: all 0.3s ease;

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
//     border-color: #667eea;
//   }

//   svg {
//     color: #667eea;
//     font-size: 1.1rem;
//   }
// `;

// // Child-Friendly Features Section
// const ChildFriendlyContainer = styled.div`
//   background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
//   border-radius: 20px;
//   padding: 2rem;
//   border: 2px solid #fbbf24;
//   margin-top: 2rem;
//   position: relative;
//   overflow: hidden;

//   &::before {
//     content: "👶";
//     position: absolute;
//     top: -20px;
//     right: -20px;
//     font-size: 100px;
//     opacity: 0.1;
//     transform: rotate(15deg);
//   }
// `;

// const ChildFriendlyGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//   gap: 1.25rem;
// `;

// const ChildFeature = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   color: #92400e;
//   font-size: 0.95rem;
//   font-weight: 600;
//   background: rgba(255, 255, 255, 0.5);
//   padding: 0.75rem 1rem;
//   border-radius: 12px;

//   svg {
//     color: #f59e0b;
//     font-size: 1.2rem;
//   }
// `;

// // Enhanced Sidebar
// const Sidebar = styled.div`
//   position: sticky;
//   top: 2rem;
//   height: fit-content;
// `;

// const RefinementCard = styled.div`
//   background: rgba(255, 255, 255, 0.95);
//   backdrop-filter: blur(20px);
//   border-radius: 24px;
//   padding: 2.5rem;
//   box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
//   margin-bottom: 2rem;
//   border: 1px solid rgba(255, 255, 255, 0.8);
//   position: relative;
//   overflow: hidden;

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     height: 3px;
//     background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
//     background-size: 200% 200%;
//     animation: ${gradient} 3s ease infinite;
//   }
// `;

// const RefinementHeader = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   margin-bottom: 2rem;
//   padding-bottom: 1.5rem;
//   border-bottom: 2px solid rgba(229, 231, 235, 0.5);

//   h3 {
//     font-size: 1.75rem;
//     font-weight: 800;
//     color: #1f2937;
//     margin: 0;
//   }

//   svg {
//     font-size: 2rem;
//     color: #667eea;
//     filter: drop-shadow(2px 2px 4px rgba(102, 126, 234, 0.2));
//   }
// `;

// const RefinementForm = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 2rem;
// `;

// const TextArea = styled.textarea`
//   width: 100%;
//   padding: 1.5rem;
//   border: 2px solid #e5e7eb;
//   border-radius: 16px;
//   font-size: 1rem;
//   font-family: inherit;
//   resize: vertical;
//   min-height: 120px;
//   transition: all 0.3s ease;
//   background: rgba(249, 250, 251, 0.8);
//   backdrop-filter: blur(10px);

//   &:focus {
//     outline: none;
//     border-color: #667eea;
//     background: white;
//     box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
//     transform: translateY(-2px);
//   }

//   &::placeholder {
//     color: #9ca3af;
//   }
// `;

// const SuggestionPills = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.75rem;
//   margin-bottom: 1.5rem;
// `;

// const SuggestionPill = styled.button`
//   background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
//   border: 2px solid #e5e7eb;
//   padding: 0.75rem 1.25rem;
//   border-radius: 50px;
//   font-size: 0.9rem;
//   color: #4b5563;
//   cursor: pointer;
//   transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   font-weight: 600;

//   &:hover {
//     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//     color: white;
//     border-color: transparent;
//     transform: translateY(-3px);
//     box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
//   }

//   svg {
//     font-size: 1.1rem;
//   }
// `;

// const RefineButton = styled.button`
//   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//   color: white;
//   padding: 1.25rem;
//   border: none;
//   border-radius: 50px;
//   font-weight: 700;
//   font-size: 1.1rem;
//   cursor: pointer;
//   transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 0.75rem;
//   box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
//   animation: ${pulse} 2s ease-in-out infinite;

//   &:hover:not(:disabled) {
//     transform: translateY(-3px);
//     box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
//   }

//   &:disabled {
//     opacity: 0.6;
//     cursor: not-allowed;
//     animation: none;
//   }

//   svg {
//     animation: ${(props) => (props.loading ? spin : "none")} 1s linear infinite;
//     font-size: 1.2rem;
//   }
// `;

// // Enhanced Price Card
// const PriceCard = styled.div`
//   background: rgba(255, 255, 255, 0.95);
//   backdrop-filter: blur(20px);
//   border-radius: 24px;
//   padding: 2.5rem;
//   box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
//   border: 1px solid rgba(255, 255, 255, 0.8);
//   position: relative;
//   overflow: hidden;

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     height: 3px;
//     background: linear-gradient(90deg, #10b981, #059669);
//   }
// `;

// const PriceBreakdown = styled.div`
//   margin: 2rem 0;
//   padding: 2rem 0;
//   border-top: 1px solid rgba(229, 231, 235, 0.5);
//   border-bottom: 1px solid rgba(229, 231, 235, 0.5);
// `;

// const PriceRow = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1rem;
//   color: ${(props) => (props.total ? "#1f2937" : "#6b7280")};
//   font-weight: ${(props) => (props.total ? "800" : "500")};
//   font-size: ${(props) => (props.total ? "1.4rem" : "1rem")};
//   padding: ${(props) => (props.total ? "1rem" : "0.5rem")} 0;
//   background: ${(props) =>
//     props.total ? "rgba(102, 126, 234, 0.05)" : "transparent"};
//   border-radius: ${(props) => (props.total ? "12px" : "0")};
//   padding-left: ${(props) => (props.total ? "1rem" : "0")};
//   padding-right: ${(props) => (props.total ? "1rem" : "0")};

//   &:last-child {
//     margin-bottom: 0;
//     border-top: ${(props) => (props.total ? "2px solid #667eea" : "none")};
//     padding-top: ${(props) => (props.total ? "1.5rem" : "0.5rem")};
//     margin-top: ${(props) => (props.total ? "1rem" : "0")};
//   }
// `;

// const BookButton = styled.button`
//   width: 100%;
//   background: linear-gradient(135deg, #10b981 0%, #059669 100%);
//   color: white;
//   border: none;
//   border-radius: 16px;
//   padding: 1.5rem;
//   font-size: 1.2rem;
//   font-weight: 700;
//   cursor: pointer;
//   transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 0.75rem;
//   box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);

//   &:hover:not(:disabled) {
//     transform: translateY(-3px);
//     box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4);
//   }

//   &:disabled {
//     opacity: 0.6;
//     cursor: not-allowed;
//   }

//   svg {
//     font-size: 1.3rem;
//   }
// `;

// // Enhanced Tips Card
// const TipsCard = styled.div`
//   background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
//   border-radius: 20px;
//   padding: 2rem;
//   margin-top: 2rem;
//   border: 2px solid #fbbf24;
//   position: relative;
//   overflow: hidden;

//   &::before {
//     content: "💡";
//     position: absolute;
//     top: -15px;
//     right: -15px;
//     font-size: 80px;
//     opacity: 0.1;
//     transform: rotate(15deg);
//   }
// `;

// const TipsHeader = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   margin-bottom: 1rem;
//   font-weight: 800;
//   color: #92400e;
//   font-size: 1.1rem;

//   svg {
//     color: #f59e0b;
//     font-size: 1.4rem;
//     filter: drop-shadow(1px 1px 2px rgba(245, 158, 11, 0.3));
//   }
// `;

// const TipsList = styled.ul`
//   margin: 0;
//   padding-left: 2rem;
//   color: #92400e;
//   font-size: 0.95rem;
//   line-height: 1.8;
//   font-weight: 500;

//   li {
//     margin-bottom: 0.5rem;
//   }
// `;

// // Helper function to generate activity images
// const getActivityImage = (activityName, destination) => {
//   const activity = activityName.toLowerCase();
//   const dest = destination.split(",")[0].toLowerCase().replace(/\s+/g, "");

//   if (activity.includes("museum") || activity.includes("art")) {
//     return `https://source.unsplash.com/400x300/?museum,${dest}`;
//   } else if (activity.includes("tour") || activity.includes("walk")) {
//     return `https://source.unsplash.com/400x300/?tour,${dest}`;
//   } else if (
//     activity.includes("food") ||
//     activity.includes("dining") ||
//     activity.includes("restaurant")
//   ) {
//     return `https://source.unsplash.com/400x300/?food,${dest}`;
//   } else if (activity.includes("beach") || activity.includes("water")) {
//     return `https://source.unsplash.com/400x300/?beach,${dest}`;
//   } else if (activity.includes("adventure") || activity.includes("hiking")) {
//     return `https://source.unsplash.com/400x300/?adventure,${dest}`;
//   } else if (activity.includes("shopping") || activity.includes("market")) {
//     return `https://source.unsplash.com/400x300/?market,${dest}`;
//   } else if (
//     activity.includes("child") ||
//     activity.includes("family") ||
//     activity.includes("kid")
//   ) {
//     return `https://source.unsplash.com/400x300/?family,children,${dest}`;
//   } else {
//     return `https://source.unsplash.com/400x300/?${dest},tourism`;
//   }
// };

// export default function TripBuilder() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [loading, setLoading] = useState(false);
//   const [trip, setTrip] = useState(null);
//   const [selectedActivities, setSelectedActivities] = useState([]);
//   const [refinementText, setRefinementText] = useState("");
//   const [refining, setRefining] = useState(false);
//   const [authOpen, setAuthOpen] = useState(false);
//   const [bookingLoading, setBookingLoading] = useState(false);
//   const [searchData, setSearchData] = useState(null);

//   const generateInitialTrip = useCallback(async () => {
//     const searchQuery = localStorage.getItem("searchQuery");
//     const passengers = localStorage.getItem("passengers");

//     if (!searchQuery) {
//       router.push("/");
//       return;
//     }

//     const parsedPassengers = passengers
//       ? JSON.parse(passengers)
//       : { adults: 2, children: 0, infants: 0 };

//     setLoading(true);

//     try {
//       const res = await fetch("/api/generate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           prompt: searchQuery,
//           passengers: parsedPassengers,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to generate trip");
//       }

//       const { result } = await res.json();
//       const trips = typeof result === "string" ? JSON.parse(result) : result;

//       // Get the first trip and enhance it
//       const firstTrip = trips[0];
//       const today = new Date();
//       let year = today.getFullYear();
//       let mStart = new Date(`${firstTrip.Month} 1, ${year}`);
//       if (mStart < today) {
//         year++;
//         mStart = new Date(`${firstTrip.Month} 1, ${year}`);
//       }
//       const days = parseInt(firstTrip.Duration, 10) || 5;
//       const iso = (d) => d.toISOString().split("T")[0];
//       const StartDate = iso(mStart);
//       const end = new Date(mStart);
//       end.setDate(mStart.getDate() + days - 1);
//       const EndDate = iso(end);
//       const basePrice = parseInt(firstTrip.Price.replace(/[^0-9]/g, ""), 10);

//       // Generate specific dates for weather forecast
//       const weatherDates = [];
//       for (let i = 0; i < days; i++) {
//         const date = new Date(mStart);
//         date.setDate(mStart.getDate() + i);
//         weatherDates.push(date.toISOString().split("T")[0]);
//       }

//       // Update weather forecast with specific dates if available
//       if (firstTrip.Weather && firstTrip.Weather.forecast) {
//         firstTrip.Weather.forecast = firstTrip.Weather.forecast.map(
//           (day, index) => ({
//             ...day,
//             date: weatherDates[index] || day.date,
//           })
//         );
//       }

//       setTrip({
//         ...firstTrip,
//         StartDate,
//         EndDate,
//         basePrice,
//         availableActivities: firstTrip.AvailableActivities || [],
//         passengers: parsedPassengers,
//       });
//     } catch (error) {
//       console.error("Error generating trip:", error);
//       // } finally {
//       //   setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     // Load search data and generate initial trip
//     const savedSearchData = localStorage.getItem("searchData");
//     if (savedSearchData) {
//       setSearchData(JSON.parse(savedSearchData));
//     }
//     generateInitialTrip();
//   }, [generateInitialTrip]);

//   const handleRefine = async (e) => {
//     e.preventDefault();
//     if (!refinementText.trim() || !trip) return;

//     setRefining(true);
//     try {
//       const res = await fetch("/api/refine", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           originalPrompt: localStorage.getItem("searchQuery"),
//           refinementPrompt: refinementText,
//           selectedTrips: [trip],
//           previousPrompts: [],
//         }),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to refine trip");
//       }

//       const { refinedTrips } = await res.json();
//       setTrip({
//         ...refinedTrips[0],
//         passengers: trip.passengers, // Preserve passenger info
//       });
//       setRefinementText("");
//       setSelectedActivities([]); // Reset selected activities
//     } catch (error) {
//       console.error("Error refining trip:", error);
//     } finally {
//       setRefining(false);
//     }
//   };

//   const toggleActivity = (activity) => {
//     setSelectedActivities((prev) => {
//       const exists = prev.find((a) => a.name === activity.name);
//       if (exists) {
//         return prev.filter((a) => a.name !== activity.name);
//       } else {
//         return [...prev, activity];
//       }
//     });
//   };

//   const getTotalPrice = () => {
//     const activitiesTotal = selectedActivities.reduce(
//       (sum, a) => sum + (a.price || 0),
//       0
//     );
//     return (trip?.basePrice || 0) + activitiesTotal;
//   };

//   // Final handleBook function for trip-builder.js

//   const handleBook = async () => {
//     if (!session?.user?.email) {
//       setAuthOpen(true);
//       return;
//     }

//     console.log("🔥 Starting booking process...");
//     setBookingLoading(true);

//     try {
//       const payload = {
//         trip: {
//           ...trip,
//           selectedActivities,
//           Price: `$${getTotalPrice()}`,
//           basePrice: trip?.basePrice || 0,
//           destinationImage: getDestinationImage(trip.Destination),
//         },
//         email: session.user.email,
//       };

//       console.log("🔥 Booking payload:", JSON.stringify(payload, null, 2));

//       const res = await fetch("/api/book-trip", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       console.log("🔥 Response status:", res.status);

//       const contentType = res.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         const text = await res.text();
//         console.error("❌ Response is not JSON:", text);
//         throw new Error(`Server error: ${res.status}`);
//       }

//       const body = await res.json();
//       console.log("🔥 Response body:", body);

//       if (!res.ok) {
//         throw new Error(body.error || body.message || `HTTP ${res.status}`);
//       }

//       if (body.success) {
//         console.log("✅ Booking API successful!");

//         // Store booking data locally as backup
//         if (body.booking) {
//           localStorage.setItem(
//             "lastBooking",
//             JSON.stringify({
//               id: body.bookingId,
//               ...body.booking,
//               ...payload.trip,
//             })
//           );
//         }

//         if (body.url) {
//           // Redirect to Stripe checkout
//           console.log("💳 Redirecting to Stripe:", body.url);
//           window.location.href = body.url;
//         } else if (body.testMode) {
//           // Test mode - direct success
//           console.log("🧪 Test mode - redirecting to success");
//           router.push(`/success?booking_id=${body.bookingId}`);
//         } else {
//           // Fallback
//           router.push(`/success?booking_id=${body.bookingId}`);
//         }
//       } else {
//         throw new Error("Booking response indicates failure");
//       }
//     } catch (error) {
//       console.error("❌ Booking error:", error);
//       alert(
//         `❌ Booking failed: ${error.message}\n\nPlease try again or contact support.`
//       );
//     } finally {
//       setBookingLoading(false);
//     }
//   };

//   // Helper function to get destination image
//   const getDestinationImage = (destination) => {
//     if (!destination) return null;
//     const city = destination
//       .split(",")[0]
//       .trim()
//       .toLowerCase()
//       .replace(/\s+/g, "");
//     return `https://source.unsplash.com/800x600/?${city},travel,destination`;
//   };

//   const hasChildren =
//     trip?.passengers &&
//     (trip.passengers.children > 0 || trip.passengers.infants > 0);
//   const totalChildren = hasChildren
//     ? trip.passengers.children + trip.passengers.infants
//     : 0;

//   const refinementSuggestions = [
//     { icon: <FiDollarSign />, text: "Lower budget" },
//     { icon: <FiStar />, text: "More luxury" },
//     { icon: <FiUsers />, text: "Family-friendly" },
//     { icon: <FiHeart />, text: "Romantic" },
//     { icon: <FiActivity />, text: "More activities" },
//     { icon: <FiCalendar />, text: "Different dates" },
//     ...(hasChildren
//       ? [
//           { icon: <FaBaby />, text: "More baby amenities" },
//           { icon: <FaChild />, text: "Kid-friendly restaurants" },
//         ]
//       : []),
//   ];

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   // Generate destination image URL

//   const getHotelImage = (hotel, destination) => {
//     const dest = destination.split(",")[0].toLowerCase().replace(/\s+/g, "");
//     return `https://source.unsplash.com/800x400/?hotel,luxury,${dest}`;
//   };

//   // if (loading) {
//   //   return (
//   //     <PageWrapper>
//   //       <Header>
//   //         <HeaderContent>
//   //           <BackButton onClick={() => router.push("/")}>
//   //             <FiChevronLeft />
//   //             Back
//   //           </BackButton>
//   //           <HeaderTitleSection>
//   //             <PageTitle>Trip Builder</PageTitle>
//   //           </HeaderTitleSection>
//   //           <div />
//   //         </HeaderContent>
//   //       </Header>
//   //       <Container style={{ gridTemplateColumns: "1fr" }}>
//   //         <LoadingCard>
//   //           <FiLoader />
//   //           <p>Creating your perfect trip...</p>
//   //         </LoadingCard>
//   //       </Container>
//   //     </PageWrapper>
//   //   );
//   // }

//   if (!trip) {
//     return (
//       <PageWrapper>
//         <Container>
//           <p>No trip data found. Please search again.</p>
//         </Container>
//       </PageWrapper>
//     );
//   }

//   return (
//     <>
//       <PageWrapper>
//         <Header destinationImage={getDestinationImage(trip.Destination)}>
//           <HeaderContent>
//             <BackButton onClick={() => router.push("/")}>
//               <FiChevronLeft />
//               New Search
//             </BackButton>
//             <HeaderTitleSection>
//               <PageTitle>Your AI Trip Builder</PageTitle>
//               {searchData && (
//                 <SearchDisplay>
//                   <FiSearch />
//                   {searchData.query}
//                 </SearchDisplay>
//               )}
//             </HeaderTitleSection>
//             {hasChildren && (
//               <FamilyBadge>
//                 <MdChildCare />
//                 {totalChildren} child{totalChildren > 1 ? "ren" : ""}
//               </FamilyBadge>
//             )}
//           </HeaderContent>
//         </Header>

//         <Container>
//           <TripCard>
//             <TripHeader
//               hasChildren={hasChildren}
//               destinationImage={getDestinationImage(trip.Destination)}
//             >
//               <Destination>
//                 <FiMapPin />
//                 {trip.Destination}
//               </Destination>
//               <TripMeta>
//                 <MetaItem>
//                   <FiCalendar />
//                   {formatDate(trip.StartDate)} - {formatDate(trip.EndDate)}
//                 </MetaItem>
//                 <MetaItem>
//                   <FiClock />
//                   {trip.Duration}
//                 </MetaItem>
//                 <MetaItem>
//                   <FiDollarSign />
//                   Starting from ${trip.basePrice}
//                 </MetaItem>
//               </TripMeta>
//             </TripHeader>

//             {trip.Weather && (
//               <ContentSection>
//                 <WeatherContainer>
//                   <WeatherHeader>
//                     <h4>
//                       <FiSun />
//                       Weather Forecast
//                     </h4>
//                     <div className="live-badge">LIVE</div>
//                   </WeatherHeader>

//                   <WeatherGrid>
//                     {trip.Weather.forecast?.map((day, index) => (
//                       <WeatherDay key={index}>
//                         <div className="date">{formatDate(day.date)}</div>
//                         <div className="icon">{day.icon}</div>
//                         <div className="temp">{day.temp}</div>
//                         <div className="condition">{day.condition}</div>
//                       </WeatherDay>
//                     ))}
//                   </WeatherGrid>

//                   <WeatherSummary>
//                     <div className="summary">
//                       <strong>Average: {trip.Weather.averageTemp}</strong> -{" "}
//                       {trip.Weather.bestConditions}
//                     </div>
//                     <div className="advice">{trip.Weather.clothingAdvice}</div>
//                   </WeatherSummary>
//                 </WeatherContainer>
//               </ContentSection>
//             )}

//             <ContentSection>
//               <SectionTitle>
//                 <FaPlane />
//                 Flight Details
//               </SectionTitle>
//               <FlightContainer>
//                 <BoardingPass>
//                   <BoardingPassHeader>
//                     <div className="airline">✈️ DREAMLINE AIRWAYS</div>
//                     <div className="boarding-pass-label">
//                       <MdFlightTakeoff />
//                       BOARDING PASS
//                     </div>
//                   </BoardingPassHeader>

//                   <FlightStatus>CONFIRMED</FlightStatus>

//                   <BoardingPassContent>
//                     <FlightEndpoint>
//                       <div className="airport-code">
//                         {getAirportCode("Your Location")}
//                       </div>
//                       <div className="city-name">Your Location</div>
//                       <div className="time">
//                         {trip.Flight?.Outbound?.split(",")[1]?.trim() ||
//                           "9:00 AM"}
//                       </div>
//                       <div className="date">{formatDate(trip.StartDate)}</div>
//                     </FlightEndpoint>

//                     <FlightConnector>
//                       <div className="flight-path">
//                         <div className="plane-icon">
//                           <MdFlightTakeoff />
//                         </div>
//                       </div>
//                       <div className="flight-duration">13H 30M</div>
//                     </FlightConnector>

//                     <FlightEndpoint align="right">
//                       <div className="airport-code">
//                         {getAirportCode(trip.Destination)}
//                       </div>
//                       <div className="city-name">
//                         {trip.Destination.split(",")[0]}
//                       </div>
//                       <div className="time">+1 day</div>
//                       <div className="date">{formatDate(trip.StartDate)}</div>
//                     </FlightEndpoint>
//                   </BoardingPassContent>

//                   <BoardingPassFooter>
//                     <BoardingInfo>
//                       <div className="label">Passenger</div>
//                       <div className="value">TRAVELER</div>
//                     </BoardingInfo>
//                     <BoardingInfo>
//                       <div className="label">Flight</div>
//                       <div className="value">DL 4571</div>
//                     </BoardingInfo>
//                     <BoardingInfo>
//                       <div className="label">Seat</div>
//                       <div className="value">14A</div>
//                     </BoardingInfo>
//                     <BoardingInfo>
//                       <div className="label">Gate</div>
//                       <div className="value">B12</div>
//                     </BoardingInfo>
//                     <BoardingInfo>
//                       <div className="label">Terminal</div>
//                       <div className="value">2</div>
//                     </BoardingInfo>
//                     <BoardingInfo>
//                       <div className="label">Class</div>
//                       <div className="value">ECONOMY</div>
//                     </BoardingInfo>
//                   </BoardingPassFooter>
//                 </BoardingPass>

//                 <BoardingPass>
//                   <BoardingPassHeader>
//                     <div className="airline">✈️ DREAMLINE AIRWAYS</div>
//                     <div className="boarding-pass-label">
//                       <MdFlightLand />
//                       BOARDING PASS
//                     </div>
//                   </BoardingPassHeader>

//                   <FlightStatus>CONFIRMED</FlightStatus>

//                   <BoardingPassContent>
//                     <FlightEndpoint>
//                       <div className="airport-code">
//                         {getAirportCode(trip.Destination)}
//                       </div>
//                       <div className="city-name">
//                         {trip.Destination.split(",")[0]}
//                       </div>
//                       <div className="time">
//                         {trip.Flight?.Return?.split(",")[1]?.trim() ||
//                           "12:00 PM"}
//                       </div>
//                       <div className="date">{formatDate(trip.EndDate)}</div>
//                     </FlightEndpoint>

//                     <FlightConnector>
//                       <div className="flight-path">
//                         <div className="plane-icon">
//                           <MdFlightLand />
//                         </div>
//                       </div>
//                       <div className="flight-duration">13H 30M</div>
//                     </FlightConnector>

//                     <FlightEndpoint align="right">
//                       <div className="airport-code">
//                         {getAirportCode("Your Location")}
//                       </div>
//                       <div className="city-name">Your Location</div>
//                       <div className="time">Same day</div>
//                       <div className="date">{formatDate(trip.EndDate)}</div>
//                     </FlightEndpoint>
//                   </BoardingPassContent>

//                   <BoardingPassFooter>
//                     <BoardingInfo>
//                       <div className="label">Passenger</div>
//                       <div className="value">TRAVELER</div>
//                     </BoardingInfo>
//                     <BoardingInfo>
//                       <div className="label">Flight</div>
//                       <div className="value">DL 8294</div>
//                     </BoardingInfo>
//                     <BoardingInfo>
//                       <div className="label">Seat</div>
//                       <div className="value">14A</div>
//                     </BoardingInfo>
//                     <BoardingInfo>
//                       <div className="label">Gate</div>
//                       <div className="value">A08</div>
//                     </BoardingInfo>
//                     <BoardingInfo>
//                       <div className="label">Terminal</div>
//                       <div className="value">1</div>
//                     </BoardingInfo>
//                     <BoardingInfo>
//                       <div className="label">Class</div>
//                       <div className="value">ECONOMY</div>
//                     </BoardingInfo>
//                   </BoardingPassFooter>
//                 </BoardingPass>
//               </FlightContainer>
//             </ContentSection>

//             <ContentSection>
//               <SectionTitle>
//                 <FaHotel />
//                 Accommodation
//               </SectionTitle>
//               <HotelContainer>
//                 <HotelImageSection
//                   image={getHotelImage(trip.Hotel, trip.Destination)}
//                 />
//                 <HotelName>{trip.Hotel}</HotelName>
//                 <Rating>
//                   <div className="stars">
//                     {[...Array(5)].map((_, i) => (
//                       <FiStar key={i} fill="#fbbf24" />
//                     ))}
//                   </div>
//                   <span className="text">
//                     5.0 {hasChildren ? "Family-Friendly" : "Luxury"} Hotel
//                   </span>
//                 </Rating>
//                 <Amenities>
//                   <Amenity>
//                     <FaWifi /> Free WiFi
//                   </Amenity>
//                   <Amenity>
//                     <FaSwimmingPool /> Pool
//                   </Amenity>
//                   <Amenity>
//                     <FaDumbbell /> Gym
//                   </Amenity>
//                   <Amenity>
//                     <FaCoffee /> Breakfast
//                   </Amenity>
//                   <Amenity>
//                     <FaParking /> Parking
//                   </Amenity>
//                   <Amenity>
//                     <FaSpa /> Spa
//                   </Amenity>
//                   <Amenity>
//                     <FaUtensils /> Restaurant
//                   </Amenity>
//                   <Amenity>
//                     <FaConciergeBell /> 24/7 Service
//                   </Amenity>
//                 </Amenities>

//                 {hasChildren && trip.ChildFriendlyFeatures && (
//                   <ChildFriendlyContainer>
//                     <SectionTitle
//                       style={{ marginBottom: "1.5rem", fontSize: "1.3rem" }}
//                     >
//                       <FaBaby />
//                       Family Features
//                     </SectionTitle>
//                     <ChildFriendlyGrid>
//                       {trip.ChildFriendlyFeatures.map((feature, index) => (
//                         <ChildFeature key={index}>
//                           <FaCheck />
//                           {feature}
//                         </ChildFeature>
//                       ))}
//                     </ChildFriendlyGrid>
//                   </ChildFriendlyContainer>
//                 )}
//               </HotelContainer>
//             </ContentSection>

//             <ContentSection>
//               <SectionTitle>
//                 <FiActivity />
//                 Activities & Experiences
//                 {hasChildren && (
//                   <span
//                     style={{
//                       fontSize: "1rem",
//                       color: "#f59e0b",
//                       marginLeft: "1rem",
//                       background: "rgba(245, 158, 11, 0.1)",
//                       padding: "0.5rem 1rem",
//                       borderRadius: "50px",
//                       fontWeight: "600",
//                     }}
//                   >
//                     👶 = Child-friendly
//                   </span>
//                 )}
//               </SectionTitle>
//               <ActivitiesGrid>
//                 {trip.availableActivities?.map((activity) => {
//                   const isSelected = selectedActivities.find(
//                     (a) => a.name === activity.name
//                   );
//                   const isChildFriendly = activity.childFriendly;

//                   return (
//                     <ActivityCard
//                       key={activity.name}
//                       selected={isSelected}
//                       childFriendly={isChildFriendly}
//                       onClick={() => toggleActivity(activity)}
//                     >
//                       <ActivityImage
//                         image={getActivityImage(
//                           activity.name,
//                           trip.Destination
//                         )}
//                         selected={isSelected}
//                       />
//                       <ActivityContent selected={isSelected}>
//                         <div className="info">
//                           <div className="name">{activity.name}</div>
//                           <div className="description">
//                             Experience the best of {trip.Destination}
//                           </div>
//                           {isChildFriendly && (
//                             <div className="child-note">
//                               Perfect for families with children
//                             </div>
//                           )}
//                         </div>
//                         <div className="price">+${activity.price}</div>
//                       </ActivityContent>
//                     </ActivityCard>
//                   );
//                 })}
//               </ActivitiesGrid>
//             </ContentSection>

//             <ContentSection>
//               <SectionTitle>
//                 <FiInfo />
//                 Why Visit {trip.Destination}?
//               </SectionTitle>
//               <div
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
//                   padding: "2rem",
//                   borderRadius: "16px",
//                   border: "1px solid #e2e8f0",
//                   position: "relative",
//                 }}
//               >
//                 <p
//                   style={{
//                     color: "#475569",
//                     lineHeight: "1.8",
//                     fontSize: "1.1rem",
//                     margin: 0,
//                     fontWeight: "500",
//                   }}
//                 >
//                   {trip.Reason}
//                 </p>
//               </div>
//             </ContentSection>
//           </TripCard>

//           <Sidebar>
//             <RefinementCard>
//               <RefinementHeader>
//                 <FaMagic />
//                 <h3>Refine Your Trip</h3>
//               </RefinementHeader>

//               <RefinementForm onSubmit={handleRefine}>
//                 <div>
//                   <p
//                     style={{
//                       fontSize: "1rem",
//                       color: "#6b7280",
//                       marginBottom: "1rem",
//                       fontWeight: "500",
//                     }}
//                   >
//                     Quick refinements:
//                   </p>
//                   <SuggestionPills>
//                     {refinementSuggestions.map((suggestion, index) => (
//                       <SuggestionPill
//                         key={index}
//                         type="button"
//                         onClick={() => setRefinementText(suggestion.text)}
//                       >
//                         {suggestion.icon}
//                         {suggestion.text}
//                       </SuggestionPill>
//                     ))}
//                   </SuggestionPills>
//                 </div>

//                 <TextArea
//                   value={refinementText}
//                   onChange={(e) => setRefinementText(e.target.value)}
//                   placeholder={
//                     hasChildren
//                       ? "Tell me how to improve this family trip... (e.g., 'Add more baby facilities' or 'Need quieter activities')"
//                       : "Tell me how to improve this trip... (e.g., 'I prefer beach hotels' or 'Add more cultural activities')"
//                   }
//                 />

//                 <RefineButton
//                   type="submit"
//                   disabled={!refinementText.trim() || refining}
//                   loading={refining}
//                 >
//                   <FiRefreshCw />
//                   {refining ? "Refining..." : "Refine Trip"}
//                 </RefineButton>
//               </RefinementForm>

//               <TipsCard>
//                 <TipsHeader>
//                   <FaLightbulb />
//                   {hasChildren ? "Family Travel Tips" : "Pro Tips"}
//                 </TipsHeader>
//                 <TipsList>
//                   <li>Be specific about your preferences</li>
//                   <li>You can refine multiple times</li>
//                   <li>Select activities before booking</li>
//                   {hasChildren && (
//                     <>
//                       <li>Look for 👶 child-friendly activities</li>
//                       <li>Hotel includes family amenities</li>
//                       <li>Pack extra clothes and snacks</li>
//                     </>
//                   )}
//                 </TipsList>
//               </TipsCard>
//             </RefinementCard>

//             <PriceCard>
//               <RefinementHeader>
//                 <FiDollarSign />
//                 <h3>Price Summary</h3>
//               </RefinementHeader>

//               <PriceBreakdown>
//                 <PriceRow>
//                   <span>Base Package</span>
//                   <span>${trip.basePrice}</span>
//                 </PriceRow>
//                 {selectedActivities.map((activity) => (
//                   <PriceRow key={activity.name}>
//                     <span>{activity.name}</span>
//                     <span>${activity.price}</span>
//                   </PriceRow>
//                 ))}
//                 <PriceRow total>
//                   <span>Total Price</span>
//                   <span>${getTotalPrice()}</span>
//                 </PriceRow>
//               </PriceBreakdown>

//               {session ? (
//                 <BookButton onClick={handleBook} disabled={bookingLoading}>
//                   {bookingLoading ? (
//                     <>
//                       <FiLoader />
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <FiCheck />
//                       Book This Trip
//                     </>
//                   )}
//                 </BookButton>
//               ) : (
//                 <BookButton onClick={() => setAuthOpen(true)}>
//                   <FiUsers />
//                   Login to Book
//                 </BookButton>
//               )}
//             </PriceCard>
//           </Sidebar>
//         </Container>
//       </PageWrapper>

//       {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
//     </>
//   );
// }

// pages/trip-builder.js - Fixed Enhanced Trip Builder
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import styled, { keyframes } from "styled-components";
import {
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiStar,
  FiEdit,
  FiShare2,
  FiBookmark,
  FiArrowLeft,
  FiMoreHorizontal,
  FiDollarSign,
  FiClock,
  FiHeart,
  FiRefreshCw,
} from "react-icons/fi";
import { FaPlane, FaHotel, FaCamera } from "react-icons/fa";
import { MdChildCare } from "react-icons/md";

// Enhanced Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Main Container
const TripBuilderContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  padding: 0;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

// Modern Trip Overview Card
const TripOverviewCard = styled.div`
  max-width: 420px;
  margin: 2rem auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;

  @media (max-width: 768px) {
    margin: 1rem;
    max-width: calc(100% - 2rem);
    border-radius: 20px;
  }
`;

// Header with navigation
const TripHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e2e8f0;
    color: #334155;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    color: #334155;
  }
`;

// Trip Info Section
const TripInfo = styled.div`
  text-align: center;
  padding: 2rem 1.5rem 1rem;
  animation: ${slideUp} 0.6s ease-out 0.2s both;
`;

const TripTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  line-height: 1.2;
`;

const TripDates = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
  font-weight: 500;
`;

const PassengerInfo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  padding: 0.75rem 1.25rem;
  border-radius: 25px;
  font-size: 0.9rem;
  color: #475569;
  font-weight: 600;

  svg {
    color: #3b82f6;
  }
`;

// Enhanced Map Section
const MapContainer = styled.div`
  position: relative;
  height: 220px;
  margin: 1.5rem 1.5rem;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%);
  animation: ${slideUp} 0.6s ease-out 0.4s both;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
`;

const MapImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 30%;
    left: 10%;
    right: 10%;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #f59e0b, #10b981);
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const MapSteps = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const MapStep = styled.div`
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${(props) => props.color || "#334155"};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: ${(props) => props.delay || "0s"};
  border: 2px solid ${(props) => props.color || "#334155"};
  max-width: 140px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.4rem 0.8rem;
    max-width: 120px;
  }
`;

const MapMarkers = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const MapMarker = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  background: ${(props) => props.color || "#3b82f6"};
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: ${pulse} 2s ease-in-out infinite;
  animation-delay: ${(props) => props.delay || "0s"};

  ${(props) =>
    props.position &&
    `
    left: ${props.position.left};
    top: ${props.position.top};
  `}
`;

// Trip Total Section
const TripTotal = styled.div`
  text-align: center;
  padding: 1.5rem;
  animation: ${slideUp} 0.6s ease-out 0.6s both;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  margin: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
`;

const TotalLabel = styled.p`
  font-size: 0.9rem;
  color: #92400e;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const TotalAmount = styled.h2`
  font-size: 2.5rem;
  font-weight: 900;
  color: #92400e;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const ModifyButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  margin-top: 1rem;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
`;

// Steps Section
const StepsContainer = styled.div`
  padding: 1.5rem;
`;

const StepsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const StepTabs = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const StepTab = styled.button`
  background: none;
  border: none;
  font-size: 0.9rem;
  font-weight: 700;
  color: ${(props) => (props.active ? "#3b82f6" : "#64748b")};
  cursor: pointer;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid
    ${(props) => (props.active ? "#3b82f6" : "transparent")};
  transition: all 0.3s;
  position: relative;

  &:hover {
    color: #3b82f6;
  }

  ${(props) =>
    props.active &&
    `
    &::after {
      content: "";
      position: absolute;
      bottom: -3px;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      border-radius: 2px;
    }
  `}
`;

// Enhanced Accommodation Cards
const AccommodationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  animation: ${slideUp} 0.6s ease-out 0.8s both;
`;

const AccommodationCard = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    border-color: #3b82f6;
  }
`;

const AccommodationImage = styled.div`
  height: 90px;
  background-image: ${(props) => `url(${props.image})`};
  background-size: cover;
  background-position: center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
  }
`;

const AccommodationInfo = styled.div`
  padding: 1rem 0.75rem;
`;

const AccommodationName = styled.h4`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
`;

const AccommodationPrice = styled.p`
  font-size: 0.8rem;
  color: #3b82f6;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
`;

const AccommodationRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 1px;
`;

const Star = styled.span`
  color: ${(props) => (props.active !== false ? "#fbbf24" : "#e5e7eb")};
  font-size: 0.75rem;
`;

const RatingText = styled.span`
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 500;
`;

// Step indicators on images
const StepNumber = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  width: 1.75rem;
  height: 1.75rem;
  background: ${(props) => props.color || "#3b82f6"};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 2px solid white;
`;

// Phase Toggle
const PhaseToggle = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  z-index: 1000;

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    padding: 0.75rem;
  }
`;

const PhaseButton = styled.button`
  background: ${(props) =>
    props.active
      ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
      : "#f1f5f9"};
  color: ${(props) => (props.active ? "white" : "#64748b")};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  margin: 0 0.25rem;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
  }
`;

// Refinement Section
const RefinementSection = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
`;

const RefinementForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const RefinementInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const RefinementButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BookButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(220, 38, 38, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Additional styled components for phase 2+ content
const DetailCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  animation: ${slideUp} 0.6s ease-out;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: #1e293b;
  }
`;

const FlightInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FlightSegment = styled.div`
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
`;

const FlightRoute = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const FlightTime = styled.div`
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const FlightAirline = styled.div`
  color: #3b82f6;
  font-size: 0.8rem;
  font-weight: 600;
`;

const HotelInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HotelName = styled.h4`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
`;

const HotelRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
`;

const HotelAddress = styled.div`
  color: #64748b;
  font-size: 0.9rem;
`;

const AmenitiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const AmenityTag = styled.span`
  background: #e2e8f0;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const WeatherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const WeatherDay = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 12px;
`;

const WeatherIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const WeatherTemp = styled.div`
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const WeatherCondition = styled.div`
  font-size: 0.75rem;
  color: #64748b;
`;

const WeatherAdvice = styled.div`
  background: #e0f2fe;
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #0c4a6e;
  line-height: 1.5;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FeatureItem = styled.div`
  color: #92400e;
  font-size: 0.9rem;
  font-weight: 500;
`;

// Main Component
export default function TripBuilder() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [refinementText, setRefinementText] = useState("");
  const [refining, setRefining] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [activeStep, setActiveStep] = useState("Step 1");
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    // Load search data and generate initial trip
    const savedSearchData = localStorage.getItem("searchData");
    if (savedSearchData) {
      setSearchData(JSON.parse(savedSearchData));
    }
    generateInitialTrip();
  }, []);

  const generateInitialTrip = async () => {
    const searchQuery = localStorage.getItem("searchQuery");
    const passengers = localStorage.getItem("passengers");

    if (!searchQuery) {
      router.push("/");
      return;
    }

    const parsedPassengers = passengers ? JSON.parse(passengers) : null;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: searchQuery,
          passengers: parsedPassengers,
          phase: phase,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate trip");
      }

      const { result } = await res.json();
      const trips = typeof result === "string" ? JSON.parse(result) : result;

      // Get the first trip and enhance it
      const firstTrip = trips[0];
      const today = new Date();
      let year = today.getFullYear();
      let mStart = new Date(`${firstTrip.Month} 1, ${year}`);
      if (mStart < today) {
        year++;
        mStart = new Date(`${firstTrip.Month} 1, ${year}`);
      }
      const days = parseInt(firstTrip.Duration, 10) || 5;
      const iso = (d) => d.toISOString().split("T")[0];
      const StartDate = iso(mStart);
      const end = new Date(mStart);
      end.setDate(mStart.getDate() + days - 1);
      const EndDate = iso(end);
      const basePrice = parseInt(firstTrip.Price.replace(/[^0-9]/g, ""), 10);

      setTrip({
        ...firstTrip,
        StartDate,
        EndDate,
        basePrice,
        availableActivities: firstTrip.AvailableActivities || [],
        passengers: parsedPassengers,
      });
    } catch (error) {
      console.error("Error generating trip:", error);
    }
  };

  const handleRefine = async (e) => {
    e.preventDefault();
    if (!refinementText.trim() || !trip) return;

    setRefining(true);
    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalPrompt: localStorage.getItem("searchQuery"),
          refinementPrompt: refinementText,
          selectedTrips: [trip],
          previousPrompts: [],
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to refine trip");
      }

      const { refinedTrips } = await res.json();
      setTrip({
        ...refinedTrips[0],
        passengers: trip.passengers,
      });
      setRefinementText("");
      setSelectedActivities([]);
    } catch (error) {
      console.error("Error refining trip:", error);
    } finally {
      setRefining(false);
    }
  };

  const handleBook = async () => {
    if (!session?.user?.email) {
      setAuthOpen(true);
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        trip: {
          ...trip,
          selectedActivities,
          Price: `$${getTotalPrice()}`,
          phase: phase,
        },
        email: session.user.email,
      };

      const res = await fetch("/api/book-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || "Booking failed");
      }

      if (body.url) {
        window.location.href = body.url;
      } else {
        router.push(`/booking/success?bookingId=${body.bookingId}`);
      }
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setBookingLoading(false);
    }
  };

  const getTotalPrice = () => {
    const activitiesTotal = selectedActivities.reduce(
      (sum, a) => sum + (a.price || 0),
      0
    );
    return (trip?.basePrice || 0) + activitiesTotal;
  };

  const hasChildren =
    trip?.passengers &&
    (trip.passengers.children > 0 || trip.passengers.infants > 0);
  const totalPassengers = trip?.passengers
    ? trip.passengers.adults +
      trip.passengers.children +
      trip.passengers.infants
    : 2;

  // Mock accommodations for the multi-step display
  const accommodations = [
    {
      name: trip?.Hotel?.name || trip?.Hotel || "Historic Hotel",
      price: "$350",
      rating: 4.8,
      reviews: 94,
      image: "https://source.unsplash.com/300x200/?hotel,luxury",
      step: 1,
      color: "#3b82f6",
    },
    {
      name: "City Center Apartment",
      price: "$280",
      rating: 4.6,
      reviews: 128,
      image: "https://source.unsplash.com/300x200/?apartment,modern",
      step: 2,
      color: "#f59e0b",
    },
    {
      name: "Boutique Resort",
      price: "$420",
      rating: 4.9,
      reviews: 67,
      image: "https://source.unsplash.com/300x200/?resort,boutique",
      step: 3,
      color: "#10b981",
    },
  ];

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "Dates TBD";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startMonth = start.toLocaleDateString("en-US", { month: "short" });
    const endMonth = end.toLocaleDateString("en-US", { month: "short" });

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}-${end.getDate()}`;
    } else {
      return `${startMonth} ${start.getDate()}-${endMonth} ${end.getDate()}`;
    }
  };

  if (!trip) {
    return (
      <TripBuilderContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <FiRefreshCw
              size={48}
              style={{
                animation: `${spin} 1s linear infinite`,
                color: "#3b82f6",
              }}
            />
            <p
              style={{
                marginTop: "1rem",
                color: "#64748b",
                fontSize: "1.1rem",
              }}
            >
              Generating your perfect trip...
            </p>
          </div>
        </div>
      </TripBuilderContainer>
    );
  }

  return (
    <TripBuilderContainer>
      {/* Phase Toggle */}
      <PhaseToggle>
        <div
          style={{
            fontSize: "0.8rem",
            color: "#64748b",
            marginBottom: "0.5rem",
            fontWeight: 600,
          }}
        >
          Experience Level
        </div>
        {[1, 2, 3].map((p) => (
          <PhaseButton key={p} active={phase === p} onClick={() => setPhase(p)}>
            Phase {p}
          </PhaseButton>
        ))}
      </PhaseToggle>

      {/* Modern Trip Overview Card */}
      <TripOverviewCard>
        {/* Header */}
        <TripHeader>
          <BackButton onClick={() => router.push("/")}>
            <FiArrowLeft />
          </BackButton>
          <HeaderActions>
            <ActionButton>
              <FiBookmark />
            </ActionButton>
            <ActionButton>
              <FiMoreHorizontal />
            </ActionButton>
          </HeaderActions>
        </TripHeader>

        {/* Trip Info */}
        <TripInfo>
          <TripTitle>Trip Overview</TripTitle>
          <TripDates>{formatDateRange(trip.StartDate, trip.EndDate)}</TripDates>
          <PassengerInfo>
            <FiUsers size={16} />
            {totalPassengers} guest{totalPassengers !== 1 ? "s" : ""}
            {hasChildren && <MdChildCare size={16} />}
          </PassengerInfo>
        </TripInfo>

        {/* Enhanced Map */}
        <MapContainer>
          <MapImage />
          <MapMarkers>
            <MapMarker
              color="#3b82f6"
              position={{ left: "15%", top: "40%" }}
              delay="0s"
            />
            <MapMarker
              color="#f59e0b"
              position={{ left: "50%", top: "35%" }}
              delay="0.5s"
            />
            <MapMarker
              color="#10b981"
              position={{ left: "80%", top: "45%" }}
              delay="1s"
            />
          </MapMarkers>
          <MapSteps>
            <MapStep color="#3b82f6" delay="0s">
              Day 1-2 • {trip.Destination?.split(",")[0]} 🌟
            </MapStep>
            <MapStep color="#f59e0b" delay="0.5s">
              Day 3-4 • City Center 🏛️
            </MapStep>
            <MapStep color="#10b981" delay="1s">
              Day 5 • Local Area 🌿
            </MapStep>
          </MapSteps>
        </MapContainer>

        {/* Trip Total */}
        <TripTotal>
          <TotalLabel>Trip Total:</TotalLabel>
          <TotalAmount>${getTotalPrice().toLocaleString()}</TotalAmount>
          <ModifyButton
            onClick={() => setRefinementText("Make this trip more luxurious")}
          >
            Modify Bookings →
          </ModifyButton>
        </TripTotal>

        {/* Steps Section */}
        <StepsContainer>
          <StepsHeader>
            <StepTabs>
              {["Step 1", "Step 2", "Step 3"].map((step) => (
                <StepTab
                  key={step}
                  active={activeStep === step}
                  onClick={() => setActiveStep(step)}
                >
                  {step}
                </StepTab>
              ))}
            </StepTabs>
          </StepsHeader>

          {/* Accommodation Cards */}
          <AccommodationGrid>
            {accommodations.map((accommodation, index) => (
              <AccommodationCard key={index}>
                <AccommodationImage image={accommodation.image}>
                  <StepNumber color={accommodation.color}>
                    {accommodation.step}
                  </StepNumber>
                </AccommodationImage>
                <AccommodationInfo>
                  <AccommodationName>{accommodation.name}</AccommodationName>
                  <AccommodationPrice>{accommodation.price}</AccommodationPrice>
                  <AccommodationRating>
                    <RatingStars>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i}>★</Star>
                      ))}
                    </RatingStars>
                    <RatingText>
                      {accommodation.rating} ({accommodation.reviews})
                    </RatingText>
                  </AccommodationRating>
                </AccommodationInfo>
              </AccommodationCard>
            ))}
          </AccommodationGrid>
        </StepsContainer>

        {/* Refinement Section */}
        <RefinementSection>
          <h4
            style={{
              margin: "0 0 1rem 0",
              color: "#1e293b",
              fontSize: "1.1rem",
              fontWeight: 700,
            }}
          >
            ✨ Refine Your Trip
          </h4>
          <RefinementForm onSubmit={handleRefine}>
            <RefinementInput
              type="text"
              placeholder="Make it more luxurious, add family activities, change dates..."
              value={refinementText}
              onChange={(e) => setRefinementText(e.target.value)}
              disabled={refining}
            />
            <RefinementButton
              type="submit"
              disabled={refining || !refinementText.trim()}
            >
              {refining ? "Refining..." : "Refine"}
            </RefinementButton>
          </RefinementForm>

          <BookButton onClick={handleBook} disabled={bookingLoading}>
            {bookingLoading
              ? "Processing..."
              : `Book Trip • ${getTotalPrice().toLocaleString()}`}
          </BookButton>
        </RefinementSection>
      </TripOverviewCard>

      {/* Additional Trip Details (Phase-based content) */}
      {phase >= 2 && (
        <div
          style={{ maxWidth: "420px", margin: "2rem auto", padding: "0 1rem" }}
        >
          <DetailCard>
            <DetailHeader>
              <FaPlane style={{ color: "#3b82f6", fontSize: "1.5rem" }} />
              <h3>Flight Details</h3>
            </DetailHeader>
            <FlightInfo>
              <FlightSegment>
                <FlightRoute>
                  {trip.Flight?.Outbound?.route || trip.Flight?.Outbound}
                </FlightRoute>
                <FlightTime>
                  {trip.Flight?.Outbound?.departure || "Departure TBD"} -{" "}
                  {trip.Flight?.Outbound?.arrival || "Arrival TBD"}
                </FlightTime>
                {trip.Flight?.Outbound?.airline && (
                  <FlightAirline>
                    {trip.Flight.Outbound.airline} •{" "}
                    {trip.Flight.Outbound.flightNumber}
                  </FlightAirline>
                )}
              </FlightSegment>

              <FlightSegment>
                <FlightRoute>
                  {trip.Flight?.Return?.route || trip.Flight?.Return}
                </FlightRoute>
                <FlightTime>
                  {trip.Flight?.Return?.departure || "Departure TBD"} -{" "}
                  {trip.Flight?.Return?.arrival || "Arrival TBD"}
                </FlightTime>
                {trip.Flight?.Return?.airline && (
                  <FlightAirline>
                    {trip.Flight.Return.airline} •{" "}
                    {trip.Flight.Return.flightNumber}
                  </FlightAirline>
                )}
              </FlightSegment>
            </FlightInfo>
          </DetailCard>

          <DetailCard>
            <DetailHeader>
              <FaHotel style={{ color: "#10b981", fontSize: "1.5rem" }} />
              <h3>Accommodation</h3>
            </DetailHeader>
            <HotelInfo>
              <HotelName>{trip.Hotel?.name || trip.Hotel}</HotelName>
              {trip.Hotel?.rating && (
                <HotelRating>
                  <RatingStars>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} active={i < Math.floor(trip.Hotel.rating)}>
                        ★
                      </Star>
                    ))}
                  </RatingStars>
                  <span>{trip.Hotel.rating}/5</span>
                </HotelRating>
              )}
              {trip.Hotel?.address && (
                <HotelAddress>📍 {trip.Hotel.address}</HotelAddress>
              )}
              {trip.Hotel?.amenities && (
                <AmenitiesList>
                  {trip.Hotel.amenities.slice(0, 4).map((amenity, index) => (
                    <AmenityTag key={index}>{amenity}</AmenityTag>
                  ))}
                </AmenitiesList>
              )}
            </HotelInfo>
          </DetailCard>

          {phase >= 3 && trip.Weather && (
            <DetailCard>
              <DetailHeader>
                <span style={{ fontSize: "1.5rem" }}>🌤️</span>
                <h3>Weather Forecast</h3>
              </DetailHeader>
              <WeatherGrid>
                {trip.Weather.forecast?.slice(0, 5).map((day, index) => (
                  <WeatherDay key={index}>
                    <WeatherIcon>{day.icon}</WeatherIcon>
                    <WeatherTemp>{day.temp}</WeatherTemp>
                    <WeatherCondition>{day.condition}</WeatherCondition>
                  </WeatherDay>
                ))}
              </WeatherGrid>
              {trip.Weather.clothingAdvice && (
                <WeatherAdvice>
                  💡 <strong>Packing tip:</strong> {trip.Weather.clothingAdvice}
                </WeatherAdvice>
              )}
            </DetailCard>
          )}

          {hasChildren && trip.ChildFriendlyFeatures && (
            <DetailCard
              style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                border: "2px solid #f59e0b",
              }}
            >
              <DetailHeader>
                <MdChildCare style={{ color: "#f59e0b", fontSize: "1.5rem" }} />
                <h3>Family-Friendly Features</h3>
              </DetailHeader>
              <FeaturesList>
                {trip.ChildFriendlyFeatures.map((feature, index) => (
                  <FeatureItem key={index}>👶 {feature}</FeatureItem>
                ))}
              </FeaturesList>
            </DetailCard>
          )}
        </div>
      )}
    </TripBuilderContainer>
  );
}
