import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Product, FinancialType } from "@/types";

export function ProductTable({ products }: { products: Product[] }) {
    const getCategoryName = (categoryId: number) => {
        switch (categoryId) {
            case 1:
                return "Hardware";
            case 2:
                return "Periféricos";
            case 3:
                return "Acessórios";
            default:
                return "Outros";
        }
    };

    const getFinancialTypeName = (type: FinancialType) => {
        return type === FinancialType.CapEx ? "CapEx" : "OpEx";
    };

    return (
        <div className="rounded-md border border-sidebar-border overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-800/50">
                    <TableRow className="border-sidebar-border hover:bg-transparent">
                        <TableHead className="text-slate-200 font-semibold">Marca</TableHead>
                        <TableHead className="text-slate-200 font-semibold">Modelo</TableHead>
                        <TableHead className="text-slate-200 font-semibold">Item</TableHead>
                        <TableHead className="text-slate-200 font-semibold">SKU</TableHead>
                        <TableHead className="text-slate-200 font-semibold">Categoria</TableHead>
                        <TableHead className="text-slate-200 font-semibold">Tipo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow
                            key={product.id}
                            className="border-sidebar-border hover:bg-slate-800/30 transition-colors"
                        >
                            <TableCell className="font-medium text-slate-100">{product.brand}</TableCell>
                            <TableCell className="text-slate-300">{product.model}</TableCell>
                            <TableCell className="text-slate-300">{product.name}</TableCell>
                            <TableCell className="text-slate-400 font-mono text-sm">{product.sku}</TableCell>
                            <TableCell className="text-slate-300">{getCategoryName(product.categoryId)}</TableCell>
                            <TableCell className="text-slate-300">
                                <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.type === FinancialType.CapEx
                                            ? "bg-blue-500/10 text-blue-400"
                                            : "bg-emerald-500/10 text-emerald-400"
                                        }`}
                                >
                                    {getFinancialTypeName(product.type)}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                    {products.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-slate-400">
                                Nenhum produto encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
