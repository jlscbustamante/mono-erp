import { Input, InputNumber, InputNumberProps, InputProps } from 'antd'

export function RecetaPruebaPage() {

    const cambioTecla = () => {
        console.log('Cambio de tecla');
    }

    return <div>
        <Input placeholder="Nombre de receta base" onChange={cambioTecla} />

        
    </div>
}