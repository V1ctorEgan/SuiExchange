import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/Landingpage";
import Rootlayout from "../pages/Rootlayout";
import Dashboardlayout from "../pages/Dashboardlayout";
import Home from "../pages/dashboard/Home";
import Marketplace from "../pages/dashboard/Marketplace";
import Messages from "../pages/dashboard/Messages";
import Portfolio from "../pages/dashboard/Portfolio";
import Settings from "../pages/dashboard/Settings";
import Edit from "../pages/dashboard/Edit";
import ProfileInfo from "../pages/dashboard/ProfileInfo";
import RoleSelection from "../pages/RoleSelection";
import ClientOnboarding from "../pages/ClientOnboarding";
import FreelancerOnboarding from "../pages/FreelancerOnboarding";



export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    children: [
      { path: "/", element: <LandingPage/> },
    ],
  },
  {
    path: '/onboarding',
    children: [
      { path: '/onboarding/role', element: <RoleSelection /> },
      { path: '/onboarding/client', element: <ClientOnboarding /> },
      { path: '/onboarding/freelancer', element: <FreelancerOnboarding /> },
    ],
  },
  {
    path:'/dashboard',
    element:<Dashboardlayout/>,
    children:[
      // {path:'/dashboard', element:<Home/>},
      {path:'/dashboard/marketplace', element:<Marketplace/>},
      {path:'/dashboard/profile/:talentId', element:<ProfileInfo/>},
      {path:'/dashboard/messages', element:<Messages/>},
      {path:'/dashboard/portfolio', element:<Portfolio/>},
      {path:'/dashboard/edit', element:<Edit/>},
      {path:'/dashboard/settings', element:<Settings/>},
    ]
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
