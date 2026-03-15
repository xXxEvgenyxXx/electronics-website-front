import { MainLayout } from "@/widgets"
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { routes } from "./routes";

function App() {

  return (
    <Router>
      <MainLayout>
        <Routes>
          {routes.map((route) => (
            <Route path={route.path} element={<route.element/>} />
          ))}
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
