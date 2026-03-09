using System;

namespace OmniInventory.Domain.Entities
{
    // The Dictionaries
    public enum MovementType { Entrada = 1, Saida = 2, Transferencia = 3 }
    public enum FinancialType { CapEx = 1, OpEx = 2 }

    public class Movement
    {
        public Guid Id { get; private set; }
        public Guid ProductId { get; private set; }
        public int Quantidade { get; private set; }
        public MovementType TipoMovimento { get; private set; }
        public FinancialType TipoFinanceiro { get; private set; }
        public string Localidade { get; private set; }

        // --- NEW LOJAS TORRA FIELDS ---
        public string? Regiao { get; private set; }
        public string? StatusEquipamento { get; private set; }
        public string? Patrimonio { get; private set; }
        public string? NotaFiscal { get; private set; }
        public string? Observacao { get; private set; }
        public string? SerialNumber { get; private set; }
        public string? Ticket { get; private set; }
        public DateTime DataMovimento { get; private set; }

        // The Factory
        public Movement(Guid productId, int quantidade, MovementType tipoMovimento, FinancialType tipoFinanceiro,
                        string localidade, string? regiao, string? statusEquipamento, string? serialNumber,
                        string? patrimonio, string? ticket, string? notaFiscal, string? observacao)
        {
            if (quantidade <= 0)
                throw new ArgumentException("A quantidade movimentada deve ser maior que zero.");

            // THE GOLDEN RULE: If it has a Serial Number OR a Patrimônio, quantity is locked to 1.
            bool hasTrackingCode = !string.IsNullOrWhiteSpace(serialNumber) || !string.IsNullOrWhiteSpace(patrimonio);
            if (hasTrackingCode && quantidade != 1)
                throw new InvalidOperationException("Equipamentos com Número de Série ou Patrimônio (CapEx) devem ter a quantidade cravada em 1.");

            Id = Guid.NewGuid();
            ProductId = productId;
            Quantidade = quantidade;
            TipoMovimento = tipoMovimento;
            TipoFinanceiro = tipoFinanceiro;
            Localidade = localidade;
            Regiao = regiao;
            StatusEquipamento = statusEquipamento;
            SerialNumber = serialNumber;
            Patrimonio = patrimonio;
            Ticket = ticket;
            NotaFiscal = notaFiscal;
            Observacao = observacao;
            DataMovimento = DateTime.UtcNow;
        }
    }
}