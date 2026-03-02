import { MovementForm } from "@/components/movimentacoes/MovementForm";

export default function TriagemPage() {
    return (
        <div className="flex-1 p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Registrar Triagem</h1>
            </div>

            <div className="max-w-4xl p-6 bg-slate-900/50 rounded-lg border border-slate-800">
                <MovementForm isTriage={true} />
            </div>
        </div>
    );
}
