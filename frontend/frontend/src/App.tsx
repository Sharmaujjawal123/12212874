// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ShortenerForm from './component/ShortenerForm';
import StatsViewer from './component/StatsViewer';
import { Container, Button } from '@mui/material';

function App() {
  return (
    <BrowserRouter>
      <Container>
        <Button component={Link} to="/">Home</Button>
        <Button component={Link} to="/stats">Stats</Button>
        <Routes>
          <Route path="/" element={<ShortenerForm />} />
          <Route path="/stats" element={<StatsViewer />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
