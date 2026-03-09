using System;

namespace OmniInventory.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; private set; }
        public string Marca { get; private set; }
        public string Modelo { get; private set; }
        public string Nome { get; private set; }
        public string Sku { get; private set; }
        public string Categoria { get; private set; }

        // --- NEW ENTERPRISE RULE ---
        // If true: Must use the + button and scan serials. (Laptops, Printers)
        // If false: Just type a quantity like "50". (Cables, Mice)
        public bool ControlaSerial { get; private set; }

        public DateTime DataCadastro { get; private set; }

        public Product(string marca, string modelo, string nome, string sku, string categoria, bool controlaSerial)
        {
            if (string.IsNullOrWhiteSpace(nome))
                throw new ArgumentException("O nome do produto é obrigatório.");

            Id = Guid.NewGuid();
            Marca = marca;
            Modelo = modelo;
            Nome = nome;
            Sku = sku;
            Categoria = categoria;
            ControlaSerial = controlaSerial; // Saving the rule
            DataCadastro = DateTime.UtcNow;
        }
    }
}