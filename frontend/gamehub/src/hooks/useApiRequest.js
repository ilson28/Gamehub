import { useState } from "react";


export function useApiRequest() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const sendRequest = async (peticion) => {
      setLoading(true);
      setError(null);
      try {
        const response = await peticion(); 
     
        // console.log("Respuesta del servidor:", result);
        return response;
      } catch (err) {
        setError(err);
        console.error("Error en la petición:", err);
      } finally {
        setLoading(false);

      }
    };
    const clearError = () => setError(null);
    return { sendRequest, loading, error, clearError };
  }
  