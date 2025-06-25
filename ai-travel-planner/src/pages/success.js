// pages/success.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled, { keyframes } from "styled-components";
import { FiCheck, FiCalendar, FiMapPin, FiMail } from "react-icons/fi";
import { FaPlane } from "react-icons/fa";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const checkmark = keyframes`
  0% { stroke-dashoffset: 50; }
  100% { stroke-dashoffset: 0; }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const SuccessCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  animation: ${fadeIn} 0.6s ease-out;
`;

const CheckmarkCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  svg {
    width: 40px;
    height: 40px;
    stroke: white;
    stroke-width: 3;
    fill: none;
    stroke-dasharray: 50;
    stroke-dashoffset: 50;
    animation: ${checkmark} 0.6s ease-out 0.3s forwards;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
`;

const BookingDetails = styled.div`
  background: #f9fafb;
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: left;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #4b5563;

  &:last-child {
    margin-bottom: 0;
  }

  svg {
    color: #667eea;
    font-size: 1.25rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: #667eea;
  border-color: #667eea;

  &:hover {
    background: #f3f4f6;
  }
`;

export default function Success() {
  const router = useRouter();
  const { session_id, booking_id } = router.query;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (booking_id) {
      fetchBookingDetails();
    }
  }, [booking_id]);

  const fetchBookingDetails = async () => {
    try {
      const res = await fetch(`/api/bookings?id=${booking_id}`);
      if (res.ok) {
        const bookings = await res.json();
        const foundBooking = bookings.find((b) => b._id === booking_id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <SuccessCard>
        <CheckmarkCircle>
          <svg viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </CheckmarkCircle>

        <Title>Booking Confirmed!</Title>
        <Subtitle>
          Your dream trip is all set. We have sent a confirmation email with all
          the details.
        </Subtitle>

        {booking && (
          <BookingDetails>
            <DetailRow>
              <FiMapPin />
              <div>
                <strong>Destination:</strong> {booking.destination}
              </div>
            </DetailRow>
            <DetailRow>
              <FiCalendar />
              <div>
                <strong>Duration:</strong> {booking.duration} in {booking.month}
              </div>
            </DetailRow>
            <DetailRow>
              <FaPlane />
              <div>
                <strong>Dates:</strong>{" "}
                {new Date(booking.startDate).toLocaleDateString()} -{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </div>
            </DetailRow>
            <DetailRow>
              <FiMail />
              <div>
                <strong>Confirmation sent to:</strong> {booking.email}
              </div>
            </DetailRow>
          </BookingDetails>
        )}

        <ButtonGroup>
          <PrimaryButton onClick={() => router.push("/my-trips")}>
            View My Trips
          </PrimaryButton>
          <SecondaryButton onClick={() => router.push("/")}>
            Plan Another Trip
          </SecondaryButton>
        </ButtonGroup>
      </SuccessCard>
    </PageWrapper>
  );
}
