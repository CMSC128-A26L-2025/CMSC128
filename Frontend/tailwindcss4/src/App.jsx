import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Landing_page } from './components/sections/Landing_page'
import { MainPage } from './components/sections/MainPage'
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
    //     <Landing_page />
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
        <Landing_page />
      )
    },
    {
      path: "/book-event",
      element: (
        <Landing_page />
      )
    },
    {
      path: "/search-alumni",
      element: (
        <Landing_page />
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