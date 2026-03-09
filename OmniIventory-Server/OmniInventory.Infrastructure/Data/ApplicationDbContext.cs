using Microsoft.EntityFrameworkCore;
using OmniInventory.Domain.Entities;

namespace OmniInventory.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Movement> Movements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Product Rules (Unchanged)
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Marca).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Modelo).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Nome).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Sku).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.Sku).IsUnique();
            });

            // Movement Rules (Updated with new Torra fields)
            modelBuilder.Entity<Movement>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne<Product>().WithMany().HasForeignKey(e => e.ProductId).OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.Localidade).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Regiao).HasMaxLength(100);
                entity.Property(e => e.StatusEquipamento).HasMaxLength(100);
                entity.Property(e => e.SerialNumber).HasMaxLength(100);
                entity.Property(e => e.Patrimonio).HasMaxLength(100); // New
                entity.Property(e => e.Ticket).HasMaxLength(50);
                entity.Property(e => e.NotaFiscal).HasMaxLength(100); // New
                entity.Property(e => e.Observacao).HasMaxLength(500); // New, allows longer text
            });
        }
    }
}