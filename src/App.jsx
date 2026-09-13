import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./routes/router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </>
  );
}

export default App;
