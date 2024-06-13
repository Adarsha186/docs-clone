import TextEditor from "./components/TextEditor";
import { v4 as uuidV4 } from 'uuid'
import HomePage from './components/HomePage'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" exact element={<Navigate to={`/documents/${uuidV4()}`} />}/>
        <Route path="/documents/:id" element={<TextEditor/>}/>
      </Routes>
    </Router>
  );
}

export default App;
