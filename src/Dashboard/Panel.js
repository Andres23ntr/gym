// src/components/DashboardContainer.js
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import StatsCards from './StatsCard';
import ChartsSection from './ChartsSection';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
`;

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/'); // Redirige al inicio de sesión si no hay token
    }
  }, [navigate, token]);

  return (
    <DashboardContainer>
      <StatsCards />
      <ChartsSection />
    </DashboardContainer>
  );
}

export default Dashboard;
