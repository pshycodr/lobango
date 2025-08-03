import { createRouter, RouterProvider } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

function App() {

  const router = createRouter({ routeTree })

  // declare module "@tanstack"

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
