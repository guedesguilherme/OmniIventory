import { getProducts } from "@/services/api";
import { ProductTable } from "@/components/produtos/ProductTable";
import { Input } from "@/components/ui/input";
import { AddProductSheet } from "@/components/produtos/AddProductSheet";

export default async function ProdutosPage() {
    const products = await getProducts();

    return (
        <div className="flex-1 p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Produtos em Estoque</h1>
            </div>

            <div className="flex items-center justify-between mb-6 space-x-4">
                <div className="w-full max-w-sm">
                    <Input
                        type="search"
                        placeholder="Pesquisar item..."
                        className="bg-slate-900 border-sidebar-border text-slate-100 placeholder:text-slate-500 focus-visible:ring-primary"
                    />
                </div>
                <AddProductSheet />
            </div>

            <ProductTable products={products} />
        </div>
    );
}
