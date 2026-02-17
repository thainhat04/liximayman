import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateEnvelope from './pages/CreateEnvelope';
import ViewEnvelope from './pages/ViewEnvelope';
import EditEnvelope from './pages/EditEnvelope';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateEnvelope />} />
        <Route path="/view/:id" element={<ViewEnvelope />} />
        <Route path="/edit/:id" element={<EditEnvelope />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
