import React from 'react';
import { useParams } from 'react-router-dom';

const TestComponent = () => {
  const { id } = useParams();
  console.log("TestComponent ID:", id);
  return <div>ID: {id}</div>;
};

export default TestComponent;
