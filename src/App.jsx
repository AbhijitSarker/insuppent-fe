
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { routes } from "./routes";

function App() {
  // Create router with routes configuration
  const router = createBrowserRouter(routes);

  return (
    <AuthProvider>
      <AdminAuthProvider>
        <RouterProvider router={router} />
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
