import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled, { keyframes } from "styled-components";
import Image from "next/image";
import {
  FiUser,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
} from "react-icons/fi";
import {
  FaPlane,
  FaHotel,
  FaWifi,
  FaParking,
  FaCoffee,
  FaSwimmingPool,
  FaDumbbell,
} from "react-icons/fa";
import LiveOffers from "../pages/components/LiveOffers";
import PopularFlights from "../pages/components/PopularFlights";
import ShareTrip from "../pages/components/ShareTrip";
import WishlistButton from "../pages/components/WishlistButton";

const PageWrapper = styled.div`
  padding-top: 70px;
  background: #f5f7fa;
  width: 100%;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto 4rem;
  padding: 0 1rem;

  @media (max-width: 600px) {
    margin: 1rem auto 3rem;
  }
`;

const Title = styled.h1`
  font-size: 2.75rem;
  text-align: center;
  margin: 1.5rem 0 3rem;
  background: linear-gradient(135deg, #0070f3, #28a745);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.25rem;
    margin: 1rem 0 2rem;
  }
  @media (max-width: 480px) {
    font-size: 1.9rem;
  }
`;

const SuggestionChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  justify-content: center;

  @media (max-width: 600px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    justify-content: flex-start;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
`;

const Chip = styled.button`
  background: white;
  border: 1px solid #e5e7eb;
  padding: 0.6rem 1.2rem;
  border-radius: 9999px;
  font-size: 0.95rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    border-color: #3b82f6;
    color: #3b82f6;
  }

  @media (max-width: 600px) {
    flex: 0 0 auto;
  }
`;

const SearchSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.25rem 0.75rem;
  transition: all 0.2s;

  &:focus-within {
    border-color: #3b82f6;
    background: white;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1.05rem;
  padding: 0.85rem 0.5rem;
  outline: none;
  color: #1f2937;
  font-weight: 500;

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }

  @media (max-width: 600px) {
    font-size: 0.95rem;
    padding: 0.75rem 0.5rem;
  }
`;

const FindButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

// Trip Card Styles
const TripCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  background: #f9fafb;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const PriceLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const Price = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;

  span {
    font-size: 0.875rem;
    font-weight: 400;
    color: #6b7280;
  }
`;

const ActionButtonsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const LoginButton = styled.button`
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const InfoSection = styled.div`
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.25rem;
`;

const InfoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;

  svg {
    color: #3b82f6;
  }
`;

const InfoContent = styled.div`
  color: #4b5563;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const DetailRow = styled.div`
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const HotelAmenities = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
`;

const Amenity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #6b7280;
  font-size: 0.8rem;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const LiveDataSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding: 1.5rem;
  background: #fafbfc;
`;

const SectionHeader = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

// Weather Mini Display
const WeatherMini = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`;

const WeatherDay = styled.div`
  text-align: center;
  padding: 0.75rem 0.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  .day {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }

  .icon {
    font-size: 1.5rem;
    margin: 0.25rem 0;
  }

  .temp {
    font-size: 0.875rem;
    color: #111827;
    font-weight: 500;
  }
`;

// Other styles remain the same...
const PassengersButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background: none;
  margin-left: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  color: #1f2937;
  font-weight: 500;

  &:hover {
    background: #f3f4f6;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 110%;
  right: 6rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  width: 240px;
  padding: 1rem;
  z-index: 10;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  font-size: 1rem;
  color: #111827;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CircleBtn = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid #d1d5db;
  border-radius: 50%;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid #fecaca;
`;

const plane = keyframes`
  0% { transform: translateX(-10px) rotate(-5deg); }
  50% { transform: translateX(10px) rotate(5deg); }
  100% { transform: translateX(-10px) rotate(-5deg); }
`;

const LoadingWrapper = styled.div`
  text-align: center;
  margin-top: 3rem;
`;

const PlaneIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 0.75rem;
  animation: ${plane} 1.8s infinite ease-in-out;
`;

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [passOpen, setPassOpen] = useState(false);
  const [tripPackages, setTripPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inc = (k) => setPassengers((p) => ({ ...p, [k]: p[k] + 1 }));
  const dec = (k) =>
    setPassengers((p) => ({
      ...p,
      [k]: Math.max(k === "adults" ? 1 : 0, p[k] - 1),
    }));

  const handleGenerate = async () => {
    if (!query.trim()) {
      setError("Please enter a travel request");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Server error: ${res.status}`);
      }
      const { result } = await res.json();
      const parsed = typeof result === "string" ? JSON.parse(result) : result;

      const today = new Date();
      const withExtras = parsed.map((trip) => {
        let year = today.getFullYear();
        let mStart = new Date(`${trip.Month} 1, ${year}`);
        if (mStart < today) {
          year++;
          mStart = new Date(`${trip.Month} 1, ${year}`);
        }
        const days = parseInt(trip.Duration, 10) || 5;
        const iso = (d) => d.toISOString().split("T")[0];
        const StartDate = iso(mStart);
        const end = new Date(mStart);
        end.setDate(mStart.getDate() + days - 1);
        const EndDate = iso(end);
        const basePrice = parseInt(trip.Price.replace(/[^0-9]/g, ""), 10);
        return {
          ...trip,
          StartDate,
          EndDate,
          basePrice,
          availableActivities: trip.AvailableActivities || [],
        };
      });
      setTripPackages(withExtras);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  };

  const suggestions = [
    "5-day romantic trip to Paris in spring",
    "Adventure trip to Tokyo for 7 days",
    "Family vacation to Rome with kids",
    "Weekend getaway to Barcelona",
    "Cultural tour of London for a week",
  ];

  const handleSuggestion = (s) => setQuery(s);

  const handleViewDetails = (i) => {
    localStorage.setItem("selectedTrip", JSON.stringify(tripPackages[i]));
    router.push(`/trip/${i}`);
  };

  // Mock weather data for display
  const getWeatherData = () => [
    { day: "Today", icon: "☀️", temp: "13°" },
    { day: "Wed", icon: "☁️", temp: "18°" },
    { day: "Thu", icon: "☀️", temp: "21°" },
    { day: "Fri", icon: "☁️", temp: "19°" },
    { day: "Sat", icon: "🌧️", temp: "25°" },
    { day: "Sun", icon: "⛅", temp: "20°" },
    { day: "Mon", icon: "🌧️", temp: "21°" },
  ];

  return (
    <PageWrapper>
      <Container>
        <Title>✈️ AI Travel Planner</Title>

        <SuggestionChips>
          {suggestions.map((s, i) => (
            <Chip key={i} onClick={() => handleSuggestion(s)}>
              {s}
            </Chip>
          ))}
        </SuggestionChips>

        <SearchSection>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Where to next? Describe your dream trip..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
            />

            <PassengersButton onClick={() => setPassOpen(!passOpen)}>
              <FiUser size={20} style={{ marginRight: 4 }} />
              {passengers.adults}A {passengers.children}C {passengers.infants}I
              {passOpen ? <FiChevronUp /> : <FiChevronDown />}
            </PassengersButton>

            {passOpen && (
              <Dropdown>
                {[
                  { key: "adults", label: "Adults", min: 1 },
                  { key: "children", label: "Children", min: 0 },
                  { key: "infants", label: "Infants", min: 0 },
                ].map(({ key, label, min }) => (
                  <Row key={key}>
                    <Label>{label}</Label>
                    <Controls>
                      <CircleBtn
                        onClick={() => dec(key)}
                        disabled={passengers[key] <= min}
                      >
                        −
                      </CircleBtn>
                      <span>{passengers[key]}</span>
                      <CircleBtn onClick={() => inc(key)}>+</CircleBtn>
                    </Controls>
                  </Row>
                ))}
              </Dropdown>
            )}

            <FindButton onClick={handleGenerate}>Search</FindButton>
          </SearchContainer>
        </SearchSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {loading && (
          <LoadingWrapper>
            <PlaneIcon>✈️</PlaneIcon>
            <p>Creating the perfect itinerary for you...</p>
          </LoadingWrapper>
        )}

        {tripPackages.map((trip, idx) => (
          <TripCard key={`${trip.Destination}-${idx}`}>
            <CardHeader>
              <HeaderRow>
                <PriceSection>
                  <PriceLabel>Total Price</PriceLabel>
                  <Price>
                    ${trip.basePrice}
                    <span>/person</span>
                  </Price>
                </PriceSection>
                <ActionButtonsRow>
                  <WishlistButton
                    trip={{
                      id: idx.toString(),
                      destination: trip.Destination,
                      startDate: trip.StartDate,
                      endDate: trip.EndDate,
                      duration: trip.Duration,
                      hotel: trip.Hotel,
                      price: trip.basePrice,
                      image: trip.DestinationImage,
                    }}
                  />
                  <ShareTrip
                    tripData={{
                      id: idx.toString(),
                      destination: trip.Destination,
                      startDate: trip.StartDate,
                      endDate: trip.EndDate,
                      duration: trip.Duration,
                      hotel: trip.Hotel,
                      price: trip.basePrice,
                      image: trip.DestinationImage,
                    }}
                  />
                  <LoginButton onClick={() => handleViewDetails(idx)}>
                    Login to Book
                  </LoginButton>
                </ActionButtonsRow>
              </HeaderRow>
            </CardHeader>

            <InfoSection>
              <InfoCard>
                <InfoTitle>
                  <FiCalendar /> Travel Dates
                </InfoTitle>
                <InfoContent>
                  <DetailRow>
                    {new Date(trip.StartDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    —{" "}
                    {new Date(trip.EndDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </DetailRow>
                  <DetailRow style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                    {trip.Duration}
                  </DetailRow>
                </InfoContent>
              </InfoCard>

              <InfoCard>
                <InfoTitle>
                  <FaPlane /> Flight Details
                </InfoTitle>
                <InfoContent>
                  <DetailRow>
                    <strong>Outbound:</strong>
                    <br />
                    {trip.Flight.Outbound} +1 day
                  </DetailRow>
                  <DetailRow>
                    <strong>Return:</strong>
                    <br />
                    {trip.Flight.Return}
                  </DetailRow>
                </InfoContent>
              </InfoCard>

              <InfoCard>
                <InfoTitle>
                  <FaHotel /> Accommodation
                </InfoTitle>
                <InfoContent>
                  <DetailRow>
                    <strong>{trip.Hotel}</strong>
                  </DetailRow>
                  <HotelAmenities>
                    <Amenity>
                      <FaWifi /> Free WiFi
                    </Amenity>
                    <Amenity>
                      <FaSwimmingPool /> Pool
                    </Amenity>
                    <Amenity>
                      <FaDumbbell /> Gym
                    </Amenity>
                    <Amenity>
                      <FaCoffee /> Breakfast
                    </Amenity>
                  </HotelAmenities>
                </InfoContent>
              </InfoCard>
            </InfoSection>

            <LiveDataSection>
              <SectionHeader>🔍 Live Data for {trip.Destination}</SectionHeader>

              <div style={{ marginBottom: "1.5rem" }}>
                <h4
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    marginBottom: "0.75rem",
                  }}
                >
                  7-Day Weather Forecast:
                </h4>
                <WeatherMini>
                  {getWeatherData().map((day, i) => (
                    <WeatherDay key={i}>
                      <div className="day">{day.day}</div>
                      <div className="icon">{day.icon}</div>
                      <div className="temp">{day.temp}</div>
                    </WeatherDay>
                  ))}
                </WeatherMini>
              </div>

              <div style={{ textAlign: "center", paddingTop: "1rem" }}>
                <LoginButton
                  onClick={() => handleViewDetails(idx)}
                  style={{ width: "100%", maxWidth: "300px" }}
                >
                  View Full Details & Book
                </LoginButton>
              </div>
            </LiveDataSection>
          </TripCard>
        ))}
      </Container>

      <PopularFlights />
    </PageWrapper>
  );
}
