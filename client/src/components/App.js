import {BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './Layout';

import RamMonitor from '../pages/RamMonitor';
import OneDose from '../pages/OneDose';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/ram-monitor" element={<RamMonitor/>} />
          <Route path="/one-dose" element={<OneDose />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
