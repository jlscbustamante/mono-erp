import { RecetaFinalBuilder } from "./components/RecetaFinalBuilder";

export default function CreateRecipePage() {
    return (
        <div className="w-full flex flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">Crear receta</h1>
            <RecetaFinalBuilder  />
        </div>
    )
}