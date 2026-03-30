import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { routes, protectedRoutes, adminRoutes } from "./routes";
import { ProtectedRoute, AdminRoute } from '@/widgets';

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
          {adminRoutes.map((route)=> (
            <Route path={route.path} element={
              <AdminRoute>
                <route.element/>
              </AdminRoute>
            }/>
          ))}
        </Routes>
      </div>
    </Router>
  )
}

export default App
