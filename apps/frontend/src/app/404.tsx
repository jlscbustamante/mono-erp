import { PATHS } from '@/const/paths'
import { useNavigate } from 'react-router'

export const NotFound = () => {
  const navigate = useNavigate()

  const handleRedirect = () => {
    navigate(PATHS.erp.modulos.home)
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="mt-4 text-xl text-gray-600">
          La página que buscas no existe.
        </p>
        <button
          onClick={handleRedirect}
          className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-600 transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}
