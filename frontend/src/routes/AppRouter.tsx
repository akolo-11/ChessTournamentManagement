import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import TournamentsListPage from '../pages/TournamentsListPage';
import TournamentPage from '../pages/TournamentPage/TournamentPage';
import SummaryTab from '../pages/TournamentPage/tabs/Summary';
import PlayersTab from '../pages/TournamentPage/tabs/PlayersTab';
import ResultsTab from '../pages/TournamentPage/tabs/ResultsTab';
import RoundTab from '../pages/TournamentPage/tabs/RoundTab';
import CreateTournamentPage from '../pages/admin/CreateTournamentPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<TournamentsListPage />} />

          <Route path="/tournaments/:id" element={<TournamentPage />}>
            <Route index element={<SummaryTab />} />
            <Route path="players" element={<PlayersTab />} />
            <Route path="results" element={<ResultsTab />} />
            <Route path="rounds/:roundNumber" element={<RoundTab />} />
          </Route>

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin/tournaments/create" element={<CreateTournamentPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}