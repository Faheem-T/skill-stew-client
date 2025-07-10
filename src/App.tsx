import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {Toaster} from "react-hot-toast"
import { RouterProvider } from "react-router";
import { router } from "./router";

function App() {
  return (
  <>
    <QueryClientProvider client={new QueryClient()}>
      <Toaster position="bottom-left"/>
      <RouterProvider router={router}/>
    </QueryClientProvider>
  </>
  )
}

export default App;
