using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OmniInventory.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTorraFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NotaFiscal",
                table: "Movements",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Observacao",
                table: "Movements",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Patrimonio",
                table: "Movements",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Regiao",
                table: "Movements",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StatusEquipamento",
                table: "Movements",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotaFiscal",
                table: "Movements");

            migrationBuilder.DropColumn(
                name: "Observacao",
                table: "Movements");

            migrationBuilder.DropColumn(
                name: "Patrimonio",
                table: "Movements");

            migrationBuilder.DropColumn(
                name: "Regiao",
                table: "Movements");

            migrationBuilder.DropColumn(
                name: "StatusEquipamento",
                table: "Movements");
        }
    }
}
