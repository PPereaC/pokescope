import { Routes, Route, HashRouter } from 'react-router-dom'
import Index from './views/Index'
import Detalle from './views/Detalle'

function App() {

  return (
    <>
      
      <HashRouter>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/pokemon/:id' element={<Detalle />} />
        </Routes>
      </HashRouter>

    </>
  )
}

export default App
