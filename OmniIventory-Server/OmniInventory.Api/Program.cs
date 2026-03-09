using Microsoft.EntityFrameworkCore;
using OmniInventory.Api.Services;
using OmniInventory.Application.Interfaces;
using OmniInventory.Infrastructure.Data;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// --- 1. CONFIGURING CORS (The Bouncer) ---
// We explicitly tell the API to allow Next.js (port 3000) to talk to us.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // The exact Next.js URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// --- 2. HIRING THE TRANSLATOR (Dependency Injection) ---
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<ICurrentUserService, DummyCurrentUserService>();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// --- 3. CONFIGURING THE RESTAURANT (HTTP Pipeline) ---
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// CRUCIAL: We must tell the app to actually USE the CORS policy we built above!
app.UseCors("AllowNextJs");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Open the doors!
app.Run();