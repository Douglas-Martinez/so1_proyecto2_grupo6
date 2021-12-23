import {BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './Layout';

import RamMonitor from '../pages/RamMonitor';
import { ProcessInfo } from '../pages/ProcessInfo';
import CpuMonitor from '../pages/CpuMonitor';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/ram-monitor" element={<RamMonitor/>} />
          <Route path="/process-info" element={<ProcessInfo/>} />
          <Route path="/cpu-monitor" element={<CpuMonitor/>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
