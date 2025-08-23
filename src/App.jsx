
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { router } from "./routes";
import SSOAuthWrapper from "./components/SSOAuthWrapper";


function App() {
  return (
    <SSOAuthWrapper>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </SSOAuthWrapper>
  );
}

export default App;
