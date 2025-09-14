
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { routes } from "./routes";

function App() {
  // Create router with routes configuration
  const router = createBrowserRouter(routes);

  return (
      <AdminAuthProvider>
        <RouterProvider router={router} />
      </AdminAuthProvider>
  );
}

export default App;
