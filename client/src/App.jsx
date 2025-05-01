import { useState } from 'react'

import './App.css'
import { Landing_page } from './components/sections/Landing_page'
import "./index.css"
import ReactDOM from 'react-dom/client'
import Login from './components/sections/Login'
import Registration from './components/sections/Registration'
import MainPage from './components/sections/MainPage'
import ViewEventDetails from './components/sections/ViewEvent'
import ViewJobDetails from './components/sections/ViewJobPosting'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import { Admin_main } from './components/sections/Admin_main'
import { Results_page_accounts} from './components/sections/Results_accounts'
import { Results_page_accounts_admin} from './components/sections/Results_accounts_admin'
import { Results_page_jobs } from './components/sections/Results_job'

import { Create_Event } from './components/sections/Create_event'
import { Post_Job } from './components/sections/Post_job'

import { Results_page_events } from './components/sections/Results_event'
import { AuthProvider } from './AuthContext'
import { RoleRoute } from './ProtectedRoutes'
import ProfilePage from './components/sections/ProfilePage'


function App() {
  const [count, setCount] = useState(0)
  const [theme, setTheme] = useState("dark");
  return (
    <>
      {
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing_page/>} /> 
            <Route path="/reg" element={<Registration/>} />
            <Route path="/login" element={<Login/>} />

            <Route element={<RoleRoute allowedRoles={['Admin']}/>}>
              <Route path="/admin_main" element={<Admin_main/>} />
              <Route path="/admin_search-alumni" element={<Results_page_accounts_admin/>} />
            </Route>

            <Route element={<RoleRoute allowedRoles={['Admin', 'Alumni']}/>}>
              <Route path="/home" element={<MainPage/>} />
              <Route path="/jobs" element={<Results_page_jobs/>} />
              <Route path="/job-details/:id" element={<ViewJobDetails/>} />
              <Route path="/events" element={<Results_page_events/>} />
              <Route path="/event-details/:id" element={<ViewEventDetails/>} />
              <Route path="/search-alumni" element={<Results_page_accounts/>} />
              <Route path="/create_event" element={<Create_Event/>} />
              <Route path="/post_job" element={<Post_Job/>} />
              <Route path="/profile" element={<ProfilePage/>} />
            </Route>

          </Routes>
        </AuthProvider>

      </BrowserRouter>
     }
    </>
  )
}

export default App
