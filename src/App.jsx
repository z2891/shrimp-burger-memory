import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { DataProvider } from './contexts/DataContext.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Layout from './components/layout/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import DiaryPage from './pages/DiaryPage.jsx';
import PhotosPage from './pages/PhotosPage.jsx';
import FirstsPage from './pages/FirstsPage.jsx';
import SecretGardenPage from './pages/SecretGardenPage.jsx';
import PhotoUploadPage from './pages/PhotoUploadPage.jsx';
import MailboxPage from './pages/MailboxPage.jsx';
import LettersPage from './pages/LettersPage.jsx';
import LetterWritePage from './pages/LetterWritePage.jsx';
import ExpressionsPage from './pages/ExpressionsPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import VouchersPage from './pages/VouchersPage.jsx';
import CountdownsPage from './pages/CountdownsPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes with Layout */}
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<HomePage />} />
              <Route path="/diary" element={<DiaryPage />} />
              <Route path="/photos" element={<PhotosPage />} />
              <Route path="/firsts" element={<FirstsPage />} />
              <Route path="/photos/secret" element={<SecretGardenPage />} />
              <Route path="/photos/upload" element={<PhotoUploadPage />} />
              <Route path="/mailbox" element={<MailboxPage />} />
              <Route path="/letters" element={<LettersPage />} />
              <Route path="/letters/write" element={<LetterWritePage />} />
              <Route path="/expressions" element={<ExpressionsPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/vouchers" element={<VouchersPage />} />
              <Route path="/countdowns" element={<CountdownsPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
