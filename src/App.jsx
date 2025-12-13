import { Routes, Route, BrowserRouter } from 'react-router-dom'
import index from './views'
import Detalle from './views/Detalle'

function App() {

  return (
    <>
      
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<index />} />
          <Route path='/pokemon/:id' element={<Detalle />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
