import { LoginForm } from '../features/auth/components/LoginForm';
import BotonInicio from '../components/BotonInicio';


export default function LoginPage() {
  return (
    // CAMBIO IMPORTANTE: Este es el contenedor principal de la página.
    // Usamos 'bg-white' para crear el fondo que actuará como borde.
    // Usamos 'p-2' (móvil) y 'md:p-4' (escritorio) para definir un margen sutil.
    // Usamos 'box-border' para que el padding no afecte el tamaño total.
    <div className="min-h-screen bg-white p-2 md:p-4 box-border">
      
      {/* Este es el contenedor oscuro principal.
        Le damos esquinas redondeadas para que flote elegantemente en el medio.
        'relative' para ubicar las líneas decorativas y la pestaña.
        'flex items-center justify-center' para centrar el formulario.
      */}
      <div className="relative w-full min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-2rem)] bg-[#0f111a] rounded-[2rem] flex items-center justify-center  shadow-2xl">
        
        {/* Las líneas curvas azules de fondo */}


        {/* Tu pestaña superior derecha (se anclará a la esquina de este contenedor) */}
        <BotonInicio texto="Volver al inicio" />

        {/* Tu formulario de login centrado (que ahora es solo la tarjeta blanca) */}
        <LoginForm />

      </div>
      
    </div>
  );
}