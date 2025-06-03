import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPanel from './AdminPanel/MainPanel';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPanel />}>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
