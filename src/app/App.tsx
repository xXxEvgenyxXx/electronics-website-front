import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { routes } from "./routes";
import { ProtectedRoute } from '@/widgets';
import { protectedRoutes } from './routes';

function App() {

  return (
    <Router>
      <div>
        <Routes>
          {routes.map((route) => (
            <Route path={route.path} element={<route.element/>} />
          ))}
          {protectedRoutes.map((route) =>(
            <Route path={route.path} element={
              <ProtectedRoute>
                <route.element/>
              </ProtectedRoute>
            } />
          ))}
        </Routes>
      </div>
    </Router>
  )
}

export default App
