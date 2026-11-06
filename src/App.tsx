
import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import Campanhas from './pages/Campanhas'
import Analises from './pages/Analises'
import Relatorios from './pages/Relatorios'

function App() {
  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#183B70] md:flex">
      {/* MENU LATERAL */}
     <Sidebar />


      {/* CONTEÚDO DAS PÁGINAS */}
      <main className="min-w-0 flex-1 p-6 md:p-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/campanhas" element={<Campanhas />} />

          
          <Route path="/analises" element={<Analises />} />


          
          <Route path="/relatorios" element={<Relatorios />} />

        </Routes>

        <p className="mt-8 text-xs text-slate-400">
          ÁRIA — Ambiente demonstrativo com dados fictícios.
        </p>
      </main>
    </div>
  )
}

export default App
