import React from 'react';
import { useParams } from 'react-router-dom';
import { DataHubDashboard } from '../components/d/DataHubDashboard';

export const DataHubPage = () => {
  const { id } = useParams<{ id?: string }>();
  
  return <DataHubDashboard />;
};

export default DataHubPage;