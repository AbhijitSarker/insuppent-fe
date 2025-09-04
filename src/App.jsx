
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BrandColorProvider } from "./contexts/BrandColorContext";
import { router } from "./routes";


function App() {
  return (
    <BrandColorProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </BrandColorProvider>
  );
}

export default App;
