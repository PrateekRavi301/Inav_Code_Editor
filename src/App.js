import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Home from './Pages/home'
import EditorPage from './Pages/editorPage'

function App() {
  return (
    <>
      <div>
        <Toaster position='top-center' toastOptions={{ success: { theme: { primary: '#d7a40e' } } }}></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>//Route for home page
          <Route path="/ide/:roomId" element={<EditorPage />}></Route>//Route for ide page
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
