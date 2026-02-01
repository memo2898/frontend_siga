import { TransaccionMultiStep } from "../../features/transacciones/multi-step"



function EntradaSalida() {
  return (
   <>
   
   <TransaccionMultiStep
  contexto={{
    tipo: 'GLOBAL', // o 'MODULO' o 'DEVOLUCION'
   // moduloId: 5,
   // categorias: [12, 15],
  }}
  onComplete={(transaccion) => console.log('Creada:', transaccion)}
  onCancel={() => console.log('Cancelado')}
/>
   </>
  )
}


export default EntradaSalida