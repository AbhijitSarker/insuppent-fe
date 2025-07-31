import { RouterProvider } from "react-router-dom";

//  ---------- ROUTES & CONTEXTS  ----------
import { router } from "./routes";

function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App;
