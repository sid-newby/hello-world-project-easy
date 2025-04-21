import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Header from './components/Header' // Import the Header
import MainLayout from './components/MainLayout' // Import the MainLayout
import ProjectDashboard from './components/ProjectDashboard' // Import the dashboard
import { useAuth } from './context/AuthProvider' // Import useAuth hook
import LoginPage from './pages/LoginPage' // Import LoginPage
import DeckEditorPage from './pages/DeckEditorPage' // Import DeckEditorPage

function App() {
  const { session, loading } = useAuth() // Get session and loading state

  // Show loading indicator or null while checking auth state
  if (loading) {
    // TODO: Replace with a proper loading component/spinner
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <BrowserRouter>
      {!session ? (
        // If no session, show only the LoginPage, allow any path to render it
        <Routes>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      ) : (
        // If session exists, show the main app layout
        <>
          <Header /> {/* Render the Header only when logged in */}
          <Routes>
            {/* Wrap main content routes in the MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<ProjectDashboard />} /> {/* Use ProjectDashboard */}
              <Route path="/deck/:deckId" element={<DeckEditorPage />} /> {/* Add route for deck editor */}
              {/* Add other protected routes that should use the sidebar layout here */}
              {/* Example: <Route path="/settings" element={<SettingsPage />} /> */}
            </Route>
            {/* Add other protected routes that should NOT use the sidebar layout here */}

            {/* Redirect any other path to the dashboard if logged in */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  )
}

export default App
