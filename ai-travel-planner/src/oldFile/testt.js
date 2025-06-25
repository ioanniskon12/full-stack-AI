// pages/refine-search.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled, { keyframes } from "styled-components";
import Head from "next/head";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiX,
  FiRefreshCw,
  FiChevronRight,
  FiInfo,
  FiStar,
  FiDollarSign,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiHeart,
  FiActivity,
} from "react-icons/fi";
import {
  FaPlane,
  FaMagic,
  FaLightbulb,
  FaCompass,
  FaRocket,
} from "react-icons/fa";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Page Wrapper
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
`;

// Hero Section
const HeroSection = styled.div`
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
  padding: 3rem 0 4rem;
  position: relative;
  overflow: hidden;

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

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const HeroContent = styled.div`
  text-align: center;
  color: white;
  animation: ${fadeIn} 0.8s ease-out;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

// Main Content
const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  margin-top: -2rem;
  position: relative;
  z-index: 10;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

// Current Results Section
const ResultsSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.8s ease-out 0.2s both;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: #667eea;
  }
`;

const CurrentPrompt = styled.div`
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 2px solid #e5e7eb;
`;

const PromptLabel = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PromptText = styled.p`
  font-size: 1.125rem;
  color: #1f2937;
  font-weight: 500;
  line-height: 1.6;
`;

// Trip Preview Cards
const TripGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const TripPreview = styled.div`
  background: ${(props) =>
    props.selected
      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)"
      : "white"};
  border: 2px solid ${(props) => (props.selected ? "#667eea" : "#e5e7eb")};
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  animation: ${slideIn} 0.6s ease-out ${(props) => props.delay || "0s"} both;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
  }
`;

const TripHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const TripDestination = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #667eea;
  }
`;

const TripPrice = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #667eea;
`;

const TripDetails = styled.div`
  display: flex;
  gap: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  flex-wrap: wrap;

  span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

// Refinement Section
const RefinementSection = styled.div`
  position: sticky;
  top: 2rem;
  height: fit-content;
`;

const RefinementCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.8s ease-out 0.3s both;
`;

const RefineForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s;
  background: #f9fafb;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

// Suggestion Pills
const SuggestionContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const SuggestionTitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
  font-weight: 600;
`;

const SuggestionPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SuggestionPill = styled.button`
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: transparent;
    transform: translateY(-2px);
  }

  svg {
    font-size: 1rem;
  }
`;

// Buttons
const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 1rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 2px solid transparent;

  svg {
    font-size: 1.125rem;
  }
`;

const RefineButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  animation: ${pulse} 2s ease-in-out infinite;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    animation: none;
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: #6b7280;
  border-color: #e5e7eb;

  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: transparent;
  }
`;

// History Section
const HistorySection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
`;

const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.05) 0%,
      rgba(118, 75, 162, 0.05) 100%
    );
  }

  svg {
    color: #9ca3af;
  }

  p {
    font-size: 0.875rem;
    color: #6b7280;
    flex: 1;
  }
`;

// Tips Card
const TipsCard = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 2rem;
  border: 2px solid #fbbf24;
`;

const TipsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
  color: #92400e;

  svg {
    color: #f59e0b;
  }
`;

const TipsList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  color: #92400e;
  font-size: 0.875rem;
  line-height: 1.6;
`;

// Loading State
const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);

  svg {
    font-size: 3rem;
    color: #667eea;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.125rem;
    color: #4b5563;
    margin: 0;
  }
`;

// Main Component
export default function RefineSearchPage() {
  const router = useRouter();
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [currentTrips, setCurrentTrips] = useState([]);
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [refinementPrompt, setRefinementPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get data from localStorage or router query
    const storedPrompt = localStorage.getItem("lastPrompt");
    const storedTrips = localStorage.getItem("lastTrips");

    if (storedPrompt) setOriginalPrompt(storedPrompt);
    if (storedTrips) {
      const trips = JSON.parse(storedTrips);
      setCurrentTrips(trips);
      // Select all trips by default
      setSelectedTrips(trips.map((_, index) => index));
    }
  }, []);

  const suggestions = [
    { icon: <FiDollarSign />, text: "Lower budget options" },
    { icon: <FiStar />, text: "More luxury experiences" },
    { icon: <FiUsers />, text: "Family-friendly activities" },
    { icon: <FiHeart />, text: "Romantic settings" },
    { icon: <FiActivity />, text: "More adventure activities" },
    { icon: <FiCalendar />, text: "Different dates" },
  ];

  const handleSuggestionClick = (suggestion) => {
    setRefinementPrompt((prev) =>
      prev ? `${prev} ${suggestion}` : suggestion
    );
  };

  const toggleTripSelection = (index) => {
    setSelectedTrips((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleRefineSearch = async (e) => {
    e.preventDefault();
    if (!refinementPrompt.trim() || selectedTrips.length === 0) return;

    setLoading(true);
    setPromptHistory((prev) => [...prev, refinementPrompt]);

    try {
      // Get selected trips data
      const tripsToRefine = selectedTrips.map((index) => currentTrips[index]);

      const response = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalPrompt,
          refinementPrompt,
          selectedTrips: tripsToRefine,
          previousPrompts: promptHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refine search");
      }

      const { refinedTrips } = await response.json();

      // Update trips and save to localStorage
      setCurrentTrips(refinedTrips);
      localStorage.setItem("lastTrips", JSON.stringify(refinedTrips));
      localStorage.setItem(
        "lastPrompt",
        `${originalPrompt} - ${refinementPrompt}`
      );

      // Clear refinement prompt
      setRefinementPrompt("");

      // Select all new trips by default
      setSelectedTrips(refinedTrips.map((_, index) => index));
    } catch (error) {
      console.error("Error refining search:", error);
      alert("Failed to refine search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    localStorage.removeItem("lastPrompt");
    localStorage.removeItem("lastTrips");
    router.push("/");
  };

  const handleContinueToResults = () => {
    // Save refined results and go back to main page
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>Refine Your Search – AI Travel Planner</title>
      </Head>

      <PageWrapper>
        <HeroSection>
          <Container>
            <HeroContent>
              <HeroTitle>
                <FaMagic style={{ marginRight: "0.5rem" }} />
                Refine Your Travel Search
              </HeroTitle>
              <HeroSubtitle>
                Let s make your trip even more perfect with additional
                preferences
              </HeroSubtitle>
            </HeroContent>
          </Container>
        </HeroSection>

        <Container>
          <MainContent>
            {/* Current Results */}
            <ResultsSection>
              <SectionHeader>
                <SectionTitle>
                  <FaCompass />
                  Current Results
                </SectionTitle>
                <SecondaryButton onClick={handleContinueToResults}>
                  <FiChevronRight />
                  Use These Results
                </SecondaryButton>
              </SectionHeader>

              <CurrentPrompt>
                <PromptLabel>Your Original Search</PromptLabel>
                <PromptText>{originalPrompt || "Loading..."}</PromptText>
              </CurrentPrompt>

              <TripGrid>
                {currentTrips.map((trip, index) => (
                  <TripPreview
                    key={index}
                    delay={`${index * 0.1}s`}
                    selected={selectedTrips.includes(index)}
                    onClick={() => toggleTripSelection(index)}
                  >
                    <TripHeader>
                      <TripDestination>
                        <FiMapPin />
                        {trip.Destination}
                      </TripDestination>
                      <TripPrice>{trip.Price}</TripPrice>
                    </TripHeader>
                    <TripDetails>
                      <span>
                        <FiCalendar />
                        {trip.Month} • {trip.Duration}
                      </span>
                      <span>
                        <FaPlane />
                        {trip.Flight?.Outbound?.split("-")[0] ||
                          "Direct Flight"}
                      </span>
                    </TripDetails>
                  </TripPreview>
                ))}
              </TripGrid>
            </ResultsSection>

            {/* Refinement Panel */}
            <RefinementSection>
              <RefinementCard>
                <SectionTitle style={{ marginBottom: "1.5rem" }}>
                  <FiFilter />
                  Refine Your Search
                </SectionTitle>

                <RefineForm onSubmit={handleRefineSearch}>
                  <SuggestionContainer>
                    <SuggestionTitle>Quick Refinements</SuggestionTitle>
                    <SuggestionPills>
                      {suggestions.map((suggestion, index) => (
                        <SuggestionPill
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion.text)}
                        >
                          {suggestion.icon}
                          {suggestion.text}
                        </SuggestionPill>
                      ))}
                    </SuggestionPills>
                  </SuggestionContainer>

                  <div>
                    <TextArea
                      value={refinementPrompt}
                      onChange={(e) => setRefinementPrompt(e.target.value)}
                      placeholder="Tell me more about what you're looking for... For example: 'I prefer beach destinations with water sports' or 'I need wheelchair accessible hotels'"
                    />
                  </div>

                  <ButtonGroup>
                    <RefineButton
                      type="submit"
                      disabled={
                        !refinementPrompt.trim() ||
                        selectedTrips.length === 0 ||
                        loading
                      }
                    >
                      <FiRefreshCw />
                      Refine Selected Trips
                    </RefineButton>
                    <SecondaryButton type="button" onClick={handleStartOver}>
                      <FiX />
                      Start Over
                    </SecondaryButton>
                  </ButtonGroup>
                </RefineForm>

                {promptHistory.length > 0 && (
                  <HistorySection>
                    <SuggestionTitle>Your Refinement History</SuggestionTitle>
                    {promptHistory.map((prompt, index) => (
                      <HistoryItem key={index}>
                        <FiSearch />
                        <p>{prompt}</p>
                      </HistoryItem>
                    ))}
                  </HistorySection>
                )}

                <TipsCard>
                  <TipsHeader>
                    <FaLightbulb />
                    Pro Tips
                  </TipsHeader>
                  <TipsList>
                    <li>Select the trips you want to refine</li>
                    <li>Be specific about your preferences</li>
                    <li>You can refine multiple times</li>
                    <li>Try different combinations for best results</li>
                  </TipsList>
                </TipsCard>
              </RefinementCard>
            </RefinementSection>
          </MainContent>
        </Container>

        {loading && (
          <LoadingOverlay>
            <LoadingCard>
              <FaRocket />
              <p>Refining your travel options...</p>
            </LoadingCard>
          </LoadingOverlay>
        )}
      </PageWrapper>
    </>
  );
}
