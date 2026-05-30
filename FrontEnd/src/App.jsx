// import FaceExpression from './features/Expression/components/FaceExpression'
import { RouterProvider } from 'react-router'
import { router } from  "./app.routes"
import "./features/shared/styles/globle.scss"
import { AuthProvider } from './auth.context.jsx'

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router}>
        

    </RouterProvider>
    </AuthProvider>

  )
}

export default App
// <FaceExpression/>