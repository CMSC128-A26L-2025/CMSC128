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
import ViewAnnouncementDetails from './components/sections/ViewAnnouncement'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import { Admin_main } from './components/sections/Admin_main'
import { Results_page_accounts} from './components/sections/Results_accounts'
import { Results_page_accounts_admin} from './components/sections/Results_accounts_admin'
import { Results_page_jobs } from './components/sections/Results_job'
import { Unauthorized_jobs_results_page } from './components/sections/Unauthorized_jobs_results'
import Inbox from './components/sections/Inbox'
import { CreateEvent } from './components/sections/CreateEvent'
import { Post_Job } from './components/sections/JobPost'

import { Results_page_events } from './components/sections/Results_event'
import { AuthProvider } from './auth/AuthContext'
import { RoleRoute } from './auth/ProtectedRoutes'
import ProfilePage from './components/sections/ProfilePage'
import TransactionPage from './components/sections/TransactionPage'
import { CreateAnnouncement } from './components/sections/Create_announcement'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            <Route path="/guest_jobs" element={<Unauthorized_jobs_results_page/>} />

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
              <Route path="/announcement-details/:id" element={<ViewAnnouncementDetails/>} />
              <Route path="/search-alumni" element={<Results_page_accounts/>} />
              <Route path="/create_event" element={<CreateEvent/>} />
              <Route path="/post_job" element={<Post_Job/>} />
              <Route path="/profile/:id" element={<ProfilePage/>} />
              <Route path='/donate/:id' element={<TransactionPage/>}/>
              <Route path='/create_announcement' element={<CreateAnnouncement/>}/>
              <Route path='/inbox' element={<Inbox/>}/>
            </Route>

          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
        </AuthProvider>

      </BrowserRouter>
     }
    </>
  )
}

export default App
