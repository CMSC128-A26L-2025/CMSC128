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
import { Results_page_jobs } from './components/sections/Results_job'
import { Results_page_events } from './components/sections/Results_event'
import { AuthProvider } from './AuthContext'
import { RoleRoute } from './ProtectedRoutes'
import { CreateJobPosting } from './components/sections/JobPosting_create'

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <>
      {
      <BrowserRouter>
        <AuthProvider>
          <Routes>

            <Route path="/" element={<Landing_page/>} /> 
            <Route path="/reg" element={<Registration/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/job-postings/create" element={<CreateJobPosting />} />
            <Route element={<RoleRoute allowedRoles={['Admin']}/>}>
              <Route path="/admin_main/:user_id" element={<Admin_main/>} />
            </Route>

            <Route element={<RoleRoute allowedRoles={['Admin', 'Alumni']}/>}>
              <Route path="/home/:user_id" element={<MainPage/>} />
              <Route path="/jobs/:user_id" element={<Results_page_jobs/>} />
              <Route path="/job-details/:id/:user_id" element={<ViewJobDetails/>} />
              <Route path="/events/:user_id" element={<Results_page_events/>} />
              <Route path="/event-details/:id/:user_id" element={<ViewEventDetails/>} />
              <Route path="/search-alumni/:id/:user_id" element={<Results_page_accounts/>} />
            </Route>

          </Routes>
        </AuthProvider>
      </BrowserRouter>
     }
    </>
  )
}

export default App
