using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OmniInventory.Application.Interfaces;
using OmniInventory.Domain.Entities;
using OmniInventory.Infrastructure.Data;

namespace OmniInventory.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovementsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public MovementsController(ApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }


        [HttpGet]
        public async Task<IActionResult> GetMovements()
        {
            try
            {
                // We fetch all movements and sort them so the newest ones are at the top
                var movements = await _context.Movements
                    .OrderByDescending(m => m.DataMovimento)
                    .ToListAsync();

                return Ok(movements);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno ao buscar movimentações.", detalhe = ex.Message });
            }
        }
        // POST: api/movements/bulk
        // This is the Senior-level Bulk Insert endpoint!
        [HttpPost("bulk")]
        public async Task<IActionResult> CreateBulkMovements([FromBody] CreateBulkMovementRequest request)
        {
            try
            {
                // 1. Get the product to check its rules
                var product = await _context.Products.FindAsync(request.ProductId);
                if (product == null)
                    return NotFound(new { message = "Produto não encontrado no sistema." });

                var movementsToAdd = new List<Movement>();

                // 2. The Enterprise Fork in the Road
                if (product.ControlaSerial)
                {
                    // SCENARIO A: Laptops/Printers (Requires tracking)
                    if (request.ItensLidos == null || !request.ItensLidos.Any())
                        return BadRequest(new { message = "Este produto exige a leitura de Números de Série/Patrimônio." });

                    foreach (var item in request.ItensLidos)
                    {
                        var movement = new Movement(
                            productId: request.ProductId,
                            quantidade: 1, // Always 1 for tracked items
                            tipoMovimento: request.TipoMovimento,
                            tipoFinanceiro: request.TipoFinanceiro,
                            localidade: request.Localidade,
                            regiao: request.Regiao,
                            statusEquipamento: request.StatusEquipamento,
                            serialNumber: item.SerialNumber,
                            patrimonio: item.Patrimonio,
                            ticket: request.Ticket,
                            notaFiscal: request.NotaFiscal,
                            observacao: request.Observacao
                        );
                        movementsToAdd.Add(movement);
                    }
                }
                else
                {
                    // SCENARIO B: Mice/Cables (Tracked by volume)
                    if (request.QuantidadeTotal <= 0)
                        return BadRequest(new { message = "Informe uma quantidade válida maior que zero." });

                    var movement = new Movement(
                        productId: request.ProductId,
                        quantidade: request.QuantidadeTotal, // Save "50" in a single row
                        tipoMovimento: request.TipoMovimento,
                        tipoFinanceiro: request.TipoFinanceiro,
                        localidade: request.Localidade,
                        regiao: request.Regiao,
                        statusEquipamento: request.StatusEquipamento,
                        serialNumber: null, // Cables don't have these
                        patrimonio: null,
                        ticket: request.Ticket,
                        notaFiscal: request.NotaFiscal,
                        observacao: request.Observacao
                    );
                    movementsToAdd.Add(movement);
                }

                _context.Movements.AddRange(movementsToAdd);
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Movimentação de {movementsToAdd.Sum(m => m.Quantidade)} item(ns) registrada com sucesso!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    public class CreateBulkMovementRequest
    {
        public Guid ProductId { get; set; }
        public MovementType TipoMovimento { get; set; }
        public FinancialType TipoFinanceiro { get; set; }
        public string Localidade { get; set; } = string.Empty;

        // NEW: Used ONLY if the product does NOT track serials (e.g., 50 cables)
        public int QuantidadeTotal { get; set; }

        public string? Regiao { get; set; }
        public string? StatusEquipamento { get; set; }
        public string? Ticket { get; set; }
        public string? NotaFiscal { get; set; }
        public string? Observacao { get; set; }

        // Used ONLY if the product tracks serials
        public List<MovementItemDto> ItensLidos { get; set; } = new();
    }

    public class MovementItemDto
    {
        public string? SerialNumber { get; set; }
        public string? Patrimonio { get; set; }
    }
}