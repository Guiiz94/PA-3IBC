import './App.css'
import React from 'react';
import HomePage from './HomePage';
import Card from './Card';
import ErrorPage from './ErrorPage';
import MyErrorBoundary from './MyErrorBoundary';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/garage",
    element: <Card />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

function App() {
  return (
    <div className="App">
      <div className='background'/>
      <MyErrorBoundary>
        <RouterProvider router={router}/>
      </MyErrorBoundary>
    </div>
  );
}

export default App;
