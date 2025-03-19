import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Import pages here
import Home from './pages/Home'
import About from './pages/About'
import Blog from './pages/Blog'
import CollegeDetails from './pages/CollegeDetails'
import Colleges from './pages/Colleges'
import Faq from './pages/Faq'
import IncidentDetails from './pages/IncidentDetails'
import InterviewDetails from './pages/InterviewDetails'
import Petition from './pages/Petition'
import Resources from './pages/Resources'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/colleges",
    element: <Colleges />,
  },
  {
    path: "/colleges/:id",
    element: <CollegeDetails />,
  },
  {
    path: "/faq",
    element: <Faq />,
  },
  {
    path: "/petition",
    element: <Petition />,
  },
  {
    path: "/resources",
    element: <Resources />,
  },
  {
    path: "/incident/:id",
    element: <IncidentDetails />,
  },
  {
    path: "/interview/:id",
    element: <InterviewDetails />,
  },
]);

function App() {
  const { isUser } = useAuth();

  useEffect(() => {
    isUser();
    // eslint-disable-next-line
  }, [])

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
