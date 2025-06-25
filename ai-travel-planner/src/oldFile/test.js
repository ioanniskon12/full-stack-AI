import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled, { keyframes } from "styled-components";
import Image from "next/image";
import { FiUser, FiChevronDown, FiChevronUp } from "react-icons/fi";
import LiveOffers from "../pages/components/LiveOffers";
import PopularFlights from "../pages/components/PopularFlights";
import ShareTrip from "../pages/components/ShareTrip";
import WishlistButton from "../pages/components/WishlistButton";

const PageWrapper = styled.div`
  padding-top: 70px;
  background: #f5f7fa;
  width: 100%;
`;

const Container = styled.div`
  max-width: 1140px;
  margin: 2rem auto 4rem;
  padding: 0 1rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

  @media (max-width: 600px) {
    margin: 1rem auto 3rem;
    border-radius: 12px;
  }
`;

const Title = styled.h1`
  font-size: 2.75rem;
  text-align: center;
  margin: 1.5rem 0;
  background: linear-gradient(135deg, #0070f3, #28a745);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.25rem;
    margin: 1rem 0;
  }
  @media (max-width: 480px) {
    font-size: 1.9rem;
    margin: 0.75rem 0;
  }
`;

const SuggestionChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.75rem;

  @media (max-width: 600px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
`;

const Chip = styled.button`
  background: #e2e8f0;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 9999px;
  font-size: 0.95rem;
  color: #1f2937;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition:
    background 0.2s,
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    background: #cbd5e0;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 600px) {
    flex: 0 0 auto;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #d1d5db;
  border-radius: 9999px;
  padding: 0 0.75rem;
  margin-bottom: 1.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;

  &:focus-within {
    border-color: #0070f3;
    box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.15);
    background: #fbfcfd;
  }

  @media (max-width: 480px) {
    padding: 0 0.5rem;
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
    color: #6b7280;
    font-weight: 400;
  }

  @media (max-width: 600px) {
    font-size: 0.95rem;
    padding: 0.75rem 0.5rem;
  }
`;

const FindButton = styled.button`
  background: linear-gradient(135deg, #28a745, #0070f3);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  font-weight: 500;
  margin-left: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    background 0.3s;

  &:hover {
    background: linear-gradient(135deg, #1f8a2d, #005cc9);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 600px) {
    padding: 0.65rem 1rem;
    font-size: 0.9rem;
    margin-left: 0.3rem;
  }
`;

const PassengersButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background: none;
  margin-left: 0.5rem;
  padding: 0.5rem;
  border-radius: 9999px;
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
  background: #fed7d7;
  color: #c53030;
  padding: 0.9rem 1rem;
  border-radius: 8px;
  margin: 1rem 0 1.75rem;
  border: 1px solid #feb2b2;
  font-size: 0.95rem;

  @media (max-width: 600px) {
    font-size: 0.9rem;
    margin: 0.75rem 0 1rem;
  }
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

const TripCard = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  margin-top: 2rem;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border: 3px solid transparent;
  background-origin: border-box;
  background-clip: padding-box, border-box;
  background-image:
    linear-gradient(#fff, #fff), linear-gradient(135deg, #0070f3, #28a745);

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 260px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    width: 40%;
    margin-bottom: 0;
    margin-right: 1.5rem;
    height: auto;
  }
`;

const Details = styled.div`
  flex: 1;
`;

const TripHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const TripTitle = styled.h2`
  font-size: 1.5rem;
  color: #1f2937;
  margin: 0;
  @media (max-width: 600px) {
    font-size: 1.35rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const TripDetail = styled.p`
  margin: 0.35rem 0;
  color: #4b5563;
  line-height: 1.6;

  strong {
    color: #111827;
  }

  @media (max-width: 600px) {
    font-size: 0.94rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
  }
`;

const GenerateButton = styled.button`
  background: ${(p) =>
    p.disabled ? "#9ca3af" : "linear-gradient(135deg,#0070f3,#28a745)"};
  color: white;
  font-size: 1rem;
  padding: 0.75rem 1.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 600px) {
    width: 100%;
    text-align: center;
    font-size: 0.95rem;
    padding: 0.85rem 1rem;
  }
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

  // default stub
  const defaultTrip = {
    Destination: "London, UK",
    DestinationImage: "https://source.unsplash.com/600x400/?london",
    Month: "May",
    Duration: "5 days",
    Reason: "Ideal weather and vibrant culture",
    Flight: {
      Outbound: "JFK→LHR, 9:00 AM - 9:00 PM",
      Return: "LHR→JFK, 12:00 PM - 4:00 PM",
    },
    Hotel: "The May Fair Hotel",
    Price: "$2,200",
    StartDate: "2025-05-31",
    EndDate: "2025-06-05",
    basePrice: 2200,
    availableActivities: [],
  };

  useEffect(() => {
    if (tripPackages.length === 0) {
      setTripPackages([defaultTrip]);
    }
  }, [tripPackages]);

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

      // never allow past dates
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

        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Describe your dream trip…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />

          <PassengersButton onClick={() => setPassOpen(!passOpen)}>
            <FiUser size={20} style={{ marginRight: 4 }} />
            {passengers.adults}A&nbsp;{passengers.children}C&nbsp;
            {passengers.infants}I&nbsp;
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
                    <CircleBtn onClick={() => inc(key)}>＋</CircleBtn>
                  </Controls>
                </Row>
              ))}
            </Dropdown>
          )}

          <FindButton onClick={handleGenerate}>Find It</FindButton>
        </SearchContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {loading && (
          <LoadingWrapper>
            <PlaneIcon>✈️</PlaneIcon>
            <p>Creating the perfect itinerary for you…</p>
          </LoadingWrapper>
        )}

        {tripPackages.map((trip, idx) => (
          <TripCard key={`${trip.Destination}-${idx}`}>
            <ImageContainer>
              <Image
                src={trip.DestinationImage}
                alt={`Image of ${trip.Destination}`}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width:768px) 100vw, 40vw"
              />
            </ImageContainer>
            <Details>
              <TripHeader>
                <TripTitle>🌍 Trip to {trip.Destination}</TripTitle>
                <ActionButtons>
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
                </ActionButtons>
              </TripHeader>

              <TripDetail>
                <strong>📅 Dates:</strong> {trip.StartDate} — {trip.EndDate}
              </TripDetail>
              <TripDetail>
                <strong>🧠 Why:</strong> {trip.Reason}
              </TripDetail>
              <TripDetail>
                <strong>✈️ Flight:</strong> Out – {trip.Flight.Outbound} |
                Return – {trip.Flight.Return}
              </TripDetail>
              <TripDetail>
                <strong>🏨 Hotel:</strong> {trip.Hotel}
              </TripDetail>
              <TripDetail>
                <strong>💸 Starting Price:</strong> ${trip.basePrice}
              </TripDetail>

              <LiveOffers
                destination={trip.Destination}
                startDate={trip.StartDate}
                endDate={trip.EndDate}
              />

              <ButtonRow>
                <GenerateButton onClick={() => handleViewDetails(idx)}>
                  View Details & Book
                </GenerateButton>
              </ButtonRow>
            </Details>
          </TripCard>
        ))}
      </Container>

      <PopularFlights />
    </PageWrapper>
  );
}
