import './App.css'
import AppRouter from './AppRouter';
import './services/axiosInterceptor'; // Importa el interceptor de Axios para que se configure al iniciar la aplicación
import GlobalProviders from './providers/GlobalProviders';


function App() {


  return (
    <div className='font-roboto bg-gray-50 min-h-screen'>

      <GlobalProviders>
        <AppRouter />
      </GlobalProviders>
    </div>
  )
}

export default App
