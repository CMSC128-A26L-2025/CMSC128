import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from './pages/LandingPage'
import { MainPage } from './pages/MainPage'
import "./index.css"

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       {
        
//       <MainPage></MainPage>
      
//      }
//     </>
//   )
// }

function App() {
  const router = createBrowserRouter([
    // {
    //   path: "/",
    //   element: (
    //     <LandingPage />
    //   ),
    // },
    {
      path: "/",
      element: (
        <MainPage />
      )
    },
    {
      path: "/home",
      element: (
        <MainPage />
      )
    },
    {
      path: "/jobs",
      element: (
        <LandingPage />
      )
    },
    {
      path: "/book-event",
      element: (
        <LandingPage />
      )
    },
    {
      path: "/search-alumni",
      element: (
        <LandingPage />
      )
    }
  ]);

  return (
    <div className="h-full w-full bg-base0">
      <RouterProvider router={router} />
    </div>
  );
}

export default App