import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

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

import AdminBlogs from './pages/admin/Blogs/Blogs'
import AdminBlogNew from './pages/admin/Blogs/BlogNew'
import AdminBlogDetails from './pages/admin/Blogs/BlogDetails'

import AdminColleges from './pages/admin/Colleges/Colleges'
import AdminCollegeDetails from './pages/admin/Colleges/CollegeDetails.jsx'
import AdminCollegeNew from './pages/admin/Colleges/CollegeNew.jsx'

import AdminIncidents from './pages/admin/Incidents/index'

import AdminInterviews from './pages/admin/Interviews/index';
import AdminCreateEditInterview from './pages/admin/Interviews/CreateEditInterview';
import AdminQuestionsPage from './pages/admin/Interviews/QuestionsPage'


import AdminLogin from './pages/admin/Login'
import AdminMain from './pages/admin/Main'
import AdminPetition from './pages/admin/Petition/index'
import AdminResources from './pages/admin/Resources'

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
  {
    path: "/admin/blogs",
    element: <AdminBlogs />
  },
  {
    path: "/admin/blog/new",
    element: <AdminBlogNew />
  },
  {
    path: "/admin/blog/:id",
    element: <AdminBlogDetails />
  },
  {
    path: "/admin/colleges",
    element: <AdminColleges />
  },
  {
    path: "/admin/college/new",
    element: <AdminCollegeNew />
  },
  {
    path: "/admin/college/:id",
    element: <AdminCollegeDetails />
  },
  {
    path: "/admin/incidents",
    element: <AdminIncidents />
  },
  {
    path: "/admin/interviews",
    element: <AdminInterviews />
  },
  {
    path: "/admin/interviews/create",
    element: <AdminCreateEditInterview />
  },
  {
    path: "/admin/interviews/edit/:id",
    element: <AdminCreateEditInterview />
  },
  {
    path: "/admin/interviews/:id/questions",
    element: <AdminQuestionsPage />
  },
  {
    path: "/admin/login",
    element: <AdminLogin />
  },
  {
    path: "/admin/",
    element: <AdminMain />
  },
  {
    path: "/admin/petition",
    element: <AdminPetition />
  },
  {
    path: "/admin/resources",
    element: <AdminResources />
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
