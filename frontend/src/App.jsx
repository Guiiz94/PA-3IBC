import './App.css'
import React from 'react';
import HomePage from './HomePage';
import ErrorPage from './ErrorPage';
import Garage from './Garage';
import MyErrorBoundary from './MyErrorBoundary';
import Navbar from './Navbar';
import MarketPlace from './MarketPlace';
import Footer from './footer';

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
    element: <Garage />,
  },
  {
    path: "/marketplace",
    element: <MarketPlace />,
  },
  {
    path: "/race",
    element: <ErrorPage />,
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
      <Navbar />
      <div className="content">
        <MyErrorBoundary>
          <RouterProvider router={router}/>
        </MyErrorBoundary>        
      </div>
        <Footer/>
    </div>
  );
}

export default App;
