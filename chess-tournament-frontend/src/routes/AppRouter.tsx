import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import TournamentsListPage from '../pages/TournamentsListPage';
import TournamentPage from '../pages/TournamentPage/TournamentPage';
import SummaryTab from '../pages/TournamentPage/tabs/Summary';
import PlayersTab from '../pages/TournamentPage/tabs/PlayersTab';
import ResultsTab from '../pages/TournamentPage/tabs/ResultsTab';
import RoundTab from '../pages/TournamentPage/tabs/RoundTab';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TournamentsListPage />} />

          <Route path="/tournaments/:id" element={<TournamentPage />}>
            <Route index element={<SummaryTab />} />
            <Route path="players" element={<PlayersTab />} />
            <Route path="results" element={<ResultsTab />} />
            <Route path="rounds/:roundNumber" element={<RoundTab />} />
          </Route>

          <Route path="/admin/tournaments/create" element={<div>Создание (TODO)</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}