using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OmniInventory.Application.Interfaces;
using OmniInventory.Domain.Entities;
using OmniInventory.Infrastructure.Data;

namespace OmniInventory.Api.Controllers
{
    [ApiController] // Tells .NET this is an API Waiter, not a web page
    [Route("api/[controller]")] // The URL will be: localhost:xxxx/api/products
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        // The Waiter's Constructor (Dependency Injection)
        // The Manager hands the Waiter the Database Connection and the ID Scanner.
        public ProductsController(ApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        // GET: api/products
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            // We tell the database to go get all the products and turn them into a list.
            var products = await _context.Products.ToListAsync();
            return Ok(products); // Returns HTTP 200 (Success) with the data
        }

        // POST: api/products
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
        {
            try
            {
                // 1. Check who is doing this (Just to prove our scanner works!)
                var userName = _currentUserService.UserName;
                Console.WriteLine($"Usuário {userName} está tentando criar um produto.");

                // 2. Use our Blueprint Factory to create a valid Product
                var newProduct = new Product(
                    marca: request.Marca,
                    modelo: request.Modelo,
                    nome: request.Nome,
                    sku: request.Sku,
                    categoria: request.Categoria,
                    controlaSerial: request.ControlaSerial
                );

                // 3. Add to the Database Tracking and Save
                _context.Products.Add(newProduct);
                await _context.SaveChangesAsync();

                // 4. Return HTTP 201 (Created)
                return CreatedAtAction(nameof(GetProducts), new { id = newProduct.Id }, newProduct);
            }
            catch (ArgumentException ex)
            {
                // If our Domain rules (like "Name cannot be empty") fail, we return a 400 Bad Request
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    // A simple DTO (Data Transfer Object). 
    // This is the "Order Slip" the Waiter expects the React frontend to fill out.
    public class CreateProductRequest
    {
        public string Marca { get; set; } = string.Empty;
        public string Modelo { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public bool ControlaSerial { get; set; }
    }
}