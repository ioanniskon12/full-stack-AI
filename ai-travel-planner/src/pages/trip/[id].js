// pages/trip/[id].js - Updated to work with actual bookings
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import styled, { keyframes } from "styled-components";
import Link from "next/link";
import {
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiCheck,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiClock,
  FiStar,
  FiWifi,
  FiCoffee,
  FiShield,
  FiAward,
  FiPrinter,
  FiShare2,
  FiDownload,
  FiEdit3,
} from "react-icons/fi";
import {
  FaPlane,
  FaHotel,
  FaSwimmingPool,
  FaDumbbell,
  FaParking,
  FaSpa,
  FaUtensils,
  FaConciergeBell,
  FaChevronLeft,
} from "react-icons/fa";
import { MdFlight, MdFlightTakeoff, MdFlightLand } from "react-icons/md";

// All your existing animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
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

// All your existing styled components
const HeroSection = styled.div`
  height: 400px;
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 25%,
    #f093fb 50%,
    #4facfe 75%,
    #667eea 100%
  );
  background-size: 400% 400%;
  animation: ${gradient} 15s ease infinite;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: 0;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  animation: ${fadeIn} 1s ease-out;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const Destination = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const DateRange = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const PageWrapper = styled.div`
  background: #f5f7fa;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: -80px auto 0;
  padding: 0 2rem 4rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    margin-top: -60px;
    padding: 0 1rem 3rem;
  }
`;

// Quick Actions Bar
const QuickActions = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  animation: ${fadeIn} 0.6s ease-out 0.1s both;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${(props) =>
    props.primary
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "white"};
  color: ${(props) => (props.primary ? "white" : "#6b7280")};
  border: 2px solid ${(props) => (props.primary ? "transparent" : "#e5e7eb")};
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    ${(props) =>
      !props.primary &&
      `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: transparent;
    `}
  }

  svg {
    font-size: 1.125rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  animation: ${fadeIn} 0.8s ease-out 0.2s both;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f2f5;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  svg {
    font-size: 1.75rem;
    color: #667eea;
  }
`;

const FlightCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "✈️";
    position: absolute;
    right: -20px;
    bottom: -20px;
    font-size: 120px;
    opacity: 0.1;
    transform: rotate(-15deg);
  }
`;

const FlightDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 2rem;
  margin-top: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FlightEndpoint = styled.div`
  text-align: ${(props) => props.align || "left"};

  .label {
    font-size: 0.875rem;
    opacity: 0.9;
    margin-bottom: 0.25rem;
  }

  .time {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .airport {
    font-size: 1rem;
    opacity: 0.9;
  }
`;

const FlightDuration = styled.div`
  text-align: center;
  position: relative;

  .duration {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .line {
    width: 100px;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    margin: 0 auto;
    position: relative;

    &::after {
      content: "✈️";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.5rem;
    }
  }

  @media (max-width: 600px) {
    margin: 1rem 0;
  }
`;

const HotelInfo = styled.div`
  display: grid;
  gap: 1rem;
`;

const HotelName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1rem;

  svg {
    color: #fbbf24;
    fill: #fbbf24;
  }
`;

const Amenities = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Amenity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  color: #4b5563;

  svg {
    color: #667eea;
  }
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ActivityItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  color: #4b5563;

  svg {
    color: #667eea;
    font-size: 1.25rem;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

const Sidebar = styled.div`
  position: sticky;
  top: 2rem;
  height: fit-content;
`;

const InfoCard = styled(Card)`
  background: white;
  border: 2px solid #e5e7eb;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  color: #4b5563;

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }

  .label {
    font-weight: 500;
  }

  .value {
    font-weight: 600;
    color: #1f2937;
  }
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${(props) =>
    props.status === "confirmed"
      ? "#d1fae5"
      : props.status === "pending"
        ? "#fef3c7"
        : "#fee2e2"};
  color: ${(props) =>
    props.status === "confirmed"
      ? "#065f46"
      : props.status === "pending"
        ? "#92400e"
        : "#dc2626"};
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.875rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #6b7280;

  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: ${spin} 1s linear infinite;
    color: #667eea;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin: 1rem 0;
  border: 1px solid #fecaca;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${slideIn} 0.3s ease-out;

  svg {
    font-size: 1.25rem;
  }
`;

export default function TripDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      // First try to get from API
      const res = await fetch(
        `/api/bookings?email=${session?.user?.email || ""}`
      );
      if (res.ok) {
        const bookings = await res.json();
        const foundBooking = bookings.find((b) => b._id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        } else {
          // Fallback to localStorage for non-authenticated users
          const stored = localStorage.getItem("selectedTrip");
          if (stored) {
            setBooking(JSON.parse(stored));
          } else {
            setError("Trip not found");
          }
        }
      }
    } catch (err) {
      console.error("Error fetching booking:", err);
      setError("Failed to load trip details");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Trip to ${booking.destination || booking.Destination}`,
      text: `Check out my upcoming trip to ${booking.destination || booking.Destination}!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Date TBD";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <PageWrapper>
        <HeroSection />
        <Container>
          <LoadingContainer>
            <FiLoader />
            <p>Loading your trip details...</p>
          </LoadingContainer>
        </Container>
      </PageWrapper>
    );
  }

  if (error || !booking) {
    return (
      <PageWrapper>
        <HeroSection />
        <Container>
          <ErrorMessage>
            <FiAlertCircle />
            {error || "Trip not found"}
          </ErrorMessage>
        </Container>
      </PageWrapper>
    );
  }

  // Handle both old and new data structures
  const destination = booking.destination || booking.Destination;
  const startDate = booking.startDate || booking.StartDate;
  const endDate = booking.endDate || booking.EndDate;
  const hotel = booking.hotel || booking.Hotel;
  const price = booking.price || booking.Price;
  const month = booking.month || booking.Month;
  const duration = booking.duration || booking.Duration;
  const activities = booking.activities || booking.Activities || [];
  const flight = booking.flight || booking.Flight || {};

  return (
    <PageWrapper>
      <HeroSection>
        <BackButton href="/my-trips">
          <FaChevronLeft />
          Back to My Trips
        </BackButton>
        <HeroContent>
          <Destination>
            <FiMapPin />
            {destination}
          </Destination>
          <DateRange>
            <FiCalendar />
            {formatDate(startDate)} — {formatDate(endDate)}
          </DateRange>
        </HeroContent>
      </HeroSection>

      <Container>
        <QuickActions>
          <ActionGroup>
            <ActionButton onClick={handlePrint}>
              <FiPrinter />
              Print Itinerary
            </ActionButton>
            <ActionButton onClick={handleShare}>
              <FiShare2 />
              Share Trip
            </ActionButton>
            <ActionButton>
              <FiDownload />
              Download PDF
            </ActionButton>
          </ActionGroup>
          <ActionButton as={Link} href="/my-trips" primary>
            <FiEdit3 />
            Request Changes
          </ActionButton>
        </QuickActions>

        <ContentGrid>
          <MainContent>
            {/* Flight Details */}
            <FlightCard>
              <CardHeader
                style={{ borderBottom: "2px solid rgba(255, 255, 255, 0.2)" }}
              >
                <MdFlight />
                <h2>Flight Details</h2>
              </CardHeader>

              <FlightDetails>
                <FlightEndpoint>
                  <div className="label">Departure</div>
                  <div className="time">
                    {flight.outbound || flight.Outbound || "TBD"}
                  </div>
                  <div className="airport">Your Location</div>
                </FlightEndpoint>

                <FlightDuration>
                  <div className="duration">Direct Flight</div>
                  <div className="line"></div>
                </FlightDuration>

                <FlightEndpoint align="right">
                  <div className="label">Arrival</div>
                  <div className="time">+1 day</div>
                  <div className="airport">{destination}</div>
                </FlightEndpoint>
              </FlightDetails>

              <FlightDetails
                style={{
                  marginTop: "2rem",
                  paddingTop: "2rem",
                  borderTop: "2px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <FlightEndpoint>
                  <div className="label">Return</div>
                  <div className="time">
                    {flight.return || flight.Return || "TBD"}
                  </div>
                  <div className="airport">{destination}</div>
                </FlightEndpoint>

                <FlightDuration>
                  <div className="duration">Direct Flight</div>
                  <div className="line"></div>
                </FlightDuration>

                <FlightEndpoint align="right">
                  <div className="label">Arrival</div>
                  <div className="time">Same day</div>
                  <div className="airport">Your Location</div>
                </FlightEndpoint>
              </FlightDetails>
            </FlightCard>

            {/* Hotel Information */}
            <Card>
              <CardHeader>
                <FaHotel />
                <h2>Accommodation</h2>
              </CardHeader>

              <HotelInfo>
                <div>
                  <HotelName>{hotel}</HotelName>
                  <Rating>
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} />
                    ))}
                    <span style={{ marginLeft: "0.5rem", color: "#6b7280" }}>
                      5.0 Luxury Hotel
                    </span>
                  </Rating>
                </div>

                <Amenities>
                  <Amenity>
                    <FiWifi /> Free WiFi
                  </Amenity>
                  <Amenity>
                    <FaSwimmingPool /> Pool
                  </Amenity>
                  <Amenity>
                    <FaDumbbell /> Fitness Center
                  </Amenity>
                  <Amenity>
                    <FiCoffee /> Breakfast
                  </Amenity>
                  <Amenity>
                    <FaParking /> Free Parking
                  </Amenity>
                  <Amenity>
                    <FaSpa /> Spa
                  </Amenity>
                  <Amenity>
                    <FaUtensils /> Restaurant
                  </Amenity>
                  <Amenity>
                    <FaConciergeBell /> 24/7 Service
                  </Amenity>
                </Amenities>
              </HotelInfo>
            </Card>

            {/* Activities */}
            {activities.length > 0 && (
              <Card>
                <CardHeader>
                  <FiStar />
                  <h2>Your Activities</h2>
                </CardHeader>

                <ActivityList>
                  {activities.map((activity, index) => (
                    <ActivityItem key={index}>
                      <FiCheck />
                      {typeof activity === "string" ? activity : activity.name}
                    </ActivityItem>
                  ))}
                </ActivityList>
              </Card>
            )}
          </MainContent>

          <Sidebar>
            <InfoCard>
              <CardHeader>
                <FiAlertCircle />
                <h2>Trip Information</h2>
              </CardHeader>

              <InfoRow>
                <span className="label">Booking Status</span>
                <StatusBadge status="confirmed">
                  <FiCheck />
                  Confirmed
                </StatusBadge>
              </InfoRow>

              <InfoRow>
                <span className="label">Destination</span>
                <span className="value">{destination}</span>
              </InfoRow>

              <InfoRow>
                <span className="label">Duration</span>
                <span className="value">{duration}</span>
              </InfoRow>

              <InfoRow>
                <span className="label">Travel Month</span>
                <span className="value">{month}</span>
              </InfoRow>

              <InfoRow>
                <span className="label">Total Price</span>
                <span
                  className="value"
                  style={{ fontSize: "1.25rem", color: "#667eea" }}
                >
                  {price}
                </span>
              </InfoRow>

              {booking._id && (
                <InfoRow>
                  <span className="label">Booking ID</span>
                  <span className="value" style={{ fontSize: "0.875rem" }}>
                    {booking._id}
                  </span>
                </InfoRow>
              )}
            </InfoCard>

            <Card style={{ marginTop: "1rem" }}>
              <CardHeader>
                <FiShield />
                <h2>Travel Protection</h2>
              </CardHeader>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#4b5563",
                  }}
                >
                  <FiCheck style={{ color: "#10b981" }} />
                  Free cancellation up to 24 hours
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#4b5563",
                  }}
                >
                  <FiCheck style={{ color: "#10b981" }} />
                  Travel insurance included
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#4b5563",
                  }}
                >
                  <FiCheck style={{ color: "#10b981" }} />
                  24/7 customer support
                </div>
              </div>
            </Card>
          </Sidebar>
        </ContentGrid>
      </Container>
    </PageWrapper>
  );
}
