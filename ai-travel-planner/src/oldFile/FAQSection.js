import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi"; // you'll need `npm install react-icons`
import styled from "styled-components";

const Container = styled.div`
  max-width: 1140px;
  margin: 2rem auto 4rem;
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  @media (max-width: 600px) {
    margin: 1rem auto 3rem;
    border-radius: 12px;
  }
`;

const FAQHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const FAQBadge = styled.span`
  display: inline-block;
  background: #e2d9f7;
  color: #6b21a8;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.5rem;
`;

const FAQTitle = styled.h2`
  font-size: 2.25rem;
  margin: 0.5rem 0;
  color: #111827;
`;

const FAQSub = styled.p`
  color: #4b5563;
  font-size: 1rem;
`;

const FAQList = styled.div`
  margin-top: 1.5rem;
`;

const FAQItem = styled.div`
  border-top: 1px solid #e5e7eb;
  &:last-child {
    border-bottom: 1px solid #e5e7eb;
  }
`;

const QuestionRow = styled.button`
  width: 100%;
  padding: 1rem 0;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const QuestionText = styled.span`
  font-size: 1.125rem;
  color: #1f2937;
  text-align: left;
`;

const Answer = styled.div`
  padding: 0.5rem 0 1rem;
  color: #4b5563;
  font-size: 1rem;
  line-height: 1.5;
`;

// --- inside your Home() render, just after <Title> … -->
const faqs = [
  {
    q: "How does it generate responses?",
    a: "Our AI uses a combination of travel data APIs and machine-learning models to craft personalized itineraries.",
  },
  {
    q: "Can I create templates or chat bots?",
    a: "Yes! You can save your own itinerary templates and integrate with our chatbot builder under the “My Tools” section.",
  },
  {
    q: "Should I buy a regular or extended license?",
    a: "For personal use, the regular license is sufficient. If you’re embedding this in a product sold to others, please choose the extended license.",
  },
  {
    q: "Can I translate the script into another language?",
    a: "Absolutely—just go to Settings → Language and select from our supported list.",
  },
  {
    q: "Is there a mobile app for AI Travel Planner?",
    a: "Yes, you can download our iOS and Android apps from the App Store or Google Play Store.",
  },
];

export default function FAQSection() {
  // …
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <Container>
      <div>
        {/* ─── FAQ SECTION ───────────────────────────────────────────── */}

        <FAQHeader>
          <FAQBadge>FAQ • Help Center</FAQBadge>
          <FAQTitle>Have a question?</FAQTitle>
          <FAQSub>
            Our support team will get assistance from AI-powered suggestions,
            making it quicker than ever to handle support requests.
          </FAQSub>
        </FAQHeader>
        <FAQList>
          {faqs.map((item, i) => (
            <FAQItem key={i}>
              <QuestionRow onClick={() => toggleFAQ(i)}>
                <QuestionText>{item.q}</QuestionText>
                {openIndex === i ? (
                  <FiMinus size={20} color="#6b7280" />
                ) : (
                  <FiPlus size={20} color="#6b7280" />
                )}
              </QuestionRow>
              {openIndex === i && <Answer>{item.a}</Answer>}
            </FAQItem>
          ))}
        </FAQList>

        {/* ─── rest of your homepage… suggestion chips, search bar, trips, etc. */}
      </div>
    </Container>
  );
}
