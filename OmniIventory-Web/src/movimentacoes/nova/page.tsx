"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Save } from "lucide-react";

// 1. The Dictionaries (Cascading Logic)
const LOCATIONS_INTERNAL = ["CD Embu", "Matriz", "Loja Osasco", "Loja Paulista"];
const LOCATIONS_EXTERNAL = ["Revenda Alto Valor", "Revenda Baixo Valor", "Descarte", "Garantia Fornecedor"];

// The Form Structure Blueprint
type FormValues = {
  productId: string;
  tipoMovimento: number;
  tipoFinanceiro: number;
  localidade: string;
  itens: { serialNumber: string; patrimonio: string }[];
};

export default function NovaMovimentacaoPage() {
  // 2. Initializing React Hook Form
  const { register, control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      tipoMovimento: 1, // Default to Entrada
      tipoFinanceiro: 1, // Default to CapEx
      localidade: "CD Embu",
      itens: [{ serialNumber: "", patrimonio: "" }], // Start with 1 empty row
    },
  });

  // 3. The "Bulk Receive" Engine (useFieldArray)
  const { fields, append, remove } = useFieldArray({
    control,
    name: "itens",
  });

  // 4. The "Watcher" for our Cascading Dropdown
  const selectedTipoMovimento = watch("tipoMovimento");
  
  // Decide which list to show based on the Movement Type
  // 1 = Entrada, 3 = Transferência (Internal). 2 = Saída (External).
  const availableLocations = selectedTipoMovimento == 2 ? LOCATIONS_EXTERNAL : LOCATIONS_INTERNAL;

  // If the user changes to "Saída", force the location to clear so they don't accidentally save an invalid combo
  useEffect(() => {
    setValue("localidade", availableLocations[0]);
  }, [selectedTipoMovimento, availableLocations, setValue]);

  // 5. The Submit Function (Talking to the Waiter)
  const onSubmit = async (data: FormValues) => {
    // We format the React data to match our C# DTO perfectly
    const payload = {
      productId: data.productId, // We will hardcode a valid Guid for testing shortly
      tipoMovimento: Number(data.tipoMovimento),
      tipoFinanceiro: Number(data.tipoFinanceiro),
      localidade: data.localidade,
      itensLidos: data.itens, // The array of scanned items!
    };

    console.log("Enviando para a API:", payload);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movements/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Sucesso! Lote registrado no banco de dados.");
      } else {
        const error = await response.json();
        alert("Erro: " + error.message);
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Lote de Movimentação</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        
        {/* SECTION 1: Master Data (Applies to all items) */}
        <div className="grid grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Produto ID (Para teste)</label>
            <input 
              {...register("productId")} 
              placeholder="Cole o ID de um produto do seu BD aqui..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo Financeiro</label>
            <select {...register("tipoFinanceiro")} className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50">
              <option value={1}>CapEx (Ativo Imobilizado)</option>
              <option value={2}>OpEx (Despesa)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Natureza da Movimentação</label>
            <select {...register("tipoMovimento")} className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50">
              <option value={1}>Entrada</option>
              <option value={2}>Saída (Baixa/Descarte)</option>
              <option value={3}>Transferência</option>
            </select>
          </div>

          {/* THE CASCADING DROPDOWN */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Localidade / Destino</label>
            <select {...register("localidade")} className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50">
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* SECTION 2: The Bulk Receive Engine */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">Equipamentos Lidos</h2>
            
            {/* THE DYNAMIC COUNTER */}
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold text-sm">
              Total: {fields.length} item(s)
            </div>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="w-8 text-center text-slate-400 font-bold">{index + 1}</div>
                
                <input
                  {...register(`itens.${index}.serialNumber`)}
                  placeholder="Serial Number (S/N)"
                  className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                
                <input
                  {...register(`itens.${index}.patrimonio`)}
                  placeholder="Patrimônio Torra"
                  className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Remove Line Button */}
                <button 
                  type="button" 
                  onClick={() => remove(index)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Line Button (+) */}
          <button
            type="button"
            onClick={() => append({ serialNumber: "", patrimonio: "" })}
            className="mt-4 flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition"
          >
            <Plus size={20} /> Adicionar Leitura
          </button>
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          type="submit" 
          className="w-full bg-slate-900 text-white font-bold p-4 rounded-xl hover:bg-slate-800 transition flex justify-center items-center gap-2"
        >
          <Save size={20} /> Processar Lote no Banco de Dados
        </button>
      </form>
    </div>
  );
}