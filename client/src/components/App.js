import {BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './Layout';

import RamMonitor from '../pages/RamMonitor';
import OneDose from '../pages/OneDose';
import TwoDose from '../pages/TwoDose';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/ram-monitor" element={<RamMonitor/>} />
          <Route path="/one-dose" element={<OneDose />} />
          <Route path="/two-dose" element={<TwoDose />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
