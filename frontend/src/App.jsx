import './App.css'
import React, { useState } from 'react';
import HomePage from './HomePage';
import ErrorPage from './ErrorPage';
import Garage from './Garage';
import MyErrorBoundary from './MyErrorBoundary';
import Navbar from './Navbar';
import MarketPlace from './MarketPlace';
import Footer from './footer';
import Race from './Race';
import SignUp from './SignUp';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import UserList from './UserList';

function App() {

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
      path: "/test",
      element: <UserList />,
    },
    {
      path: "/inscription",
      element: <SignUp />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

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
