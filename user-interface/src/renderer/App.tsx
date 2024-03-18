import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Accordion from '../components/Accordion';
import './App.css';

function Hello() {
  return (
    <div>
      <h1>
        <Accordion />
      </h1>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
