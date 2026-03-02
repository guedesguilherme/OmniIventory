import * as z from "zod";

export const movementFormSchema = z.object({
    marca: z.string().optional(),
    modelo: z.string().optional(),
    itemId: z.string().min(1, "Selecione um item."),
    quantidade: z.number({ message: "Deve ser número" }).min(1, "A quantidade mínima é 1."),
    data: z.date({ message: "A data é obrigatória." }),
    natureza: z.string().min(1, "Selecione a natureza da movimentação."),
    status: z.string().min(1, "Selecione o status."),
    nf: z.string().optional(),
    fornecedor: z.string().optional(),
    localidade: z.string().min(1, "A localidade é obrigatória."),
    serialNumber: z.string().optional(),
    patrimonio: z.string().optional(),
    destino: z.string().optional(),
    tipoFinanceiro: z.enum(["CapEx", "OpEx"], { message: "Selecione CapEx ou OpEx" }),
});

export type MovementFormValues = z.infer<typeof movementFormSchema>;
