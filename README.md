# OmniInventory 📦

> Enterprise IT Asset & Inventory Management System

OmniInventory is a full-stack, modular monolith designed to replace chaotic spreadsheets and manual tracking for enterprise IT departments. It provides strict data governance, real-time visibility, and streamlined logistical workflows for hardware (CapEx) and consumables (OpEx).

## 🚀 The Tech Stack

**Frontend (Client)**
* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Dark/Futurist Enterprise Theme)
* **Components:** Shadcn/ui
* **State & Forms:** React Hook Form + Zod Validation

**Backend (API)**
* **Framework:** .NET 9 Web API (C# 13)
* **Architecture:** Clean Architecture / Modular Monolith
* **Pattern:** CQRS (MediatR)
* **ORM & Database:** Entity Framework Core 9 + PostgreSQL

## ✨ Key Features

* **RMA Routing & Triage:** Dedicated workflows for receiving items and routing them to Stock, Scrap, or Maintenance.
* **External Dispatch Tracking:** Strict enforcement of Vendor and Invoice (NF) data before items leave the facility for external repair.
* **Transactional Financial Typing:** Dynamic classification of items as CapEx (locking serial number quantities to 1) or OpEx at the moment of movement.
* **Immutable Audit Trail:** A strictly append-only ledger for all inventory movements to ensure absolute compliance.
* **Role-Based Access Control (RBAC):** UI and API segregation for Viewers, Operators, and Administrators.

## 🛠️ Getting Started

### Prerequisites
* [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
* [Node.js (v20+)](https://nodejs.org/)
* [PostgreSQL](https://www.postgresql.org/)

### Running the System
*(Include startup scripts here as the project evolves)*

---

# OmniInventory 📦 (Versão PT-BR)

> Sistema Enterprise para Gestão de Estoque e Ativos de TI

O OmniInventory é um sistema full-stack (monolito modular) projetado para substituir planilhas caóticas e controles manuais em departamentos de TI corporativos. Ele fornece governança estrita de dados, visibilidade em tempo real e fluxos logísticos otimizados para hardware (CapEx) e suprimentos (OpEx).

## 🚀 Tecnologias Utilizadas

**Frontend (Cliente)**
* **Framework:** Next.js 16 (App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS (Tema Dark Enterprise)
* **Componentes:** Shadcn/ui
* **Formulários:** React Hook Form + Validação com Zod

**Backend (API)**
* **Framework:** .NET 9 Web API (C# 13)
* **Arquitetura:** Clean Architecture / Monolito Modular
* **Padrão:** CQRS (MediatR)
* **Banco de Dados:** Entity Framework Core 9 + PostgreSQL

## ✨ Principais Funcionalidades

* **Triagem e Fluxo de RMA:** Fluxos dedicados para recebimento e roteamento de equipamentos (Estoque, Sucata ou Manutenção).
* **Controle de Manutenção Externa:** Exigência de Fornecedor e Nota Fiscal (NF) antes que equipamentos deixem o prédio para reparo.
* **Classificação Financeira Transacional:** Definição dinâmica de itens como CapEx (travando a quantidade em 1 por Serial Number) ou OpEx no momento da movimentação.
* **Histórico Imutável:** Registro de movimentações estritamente incremental (append-only) para garantir conformidade em auditorias.
* **Controle de Acesso (RBAC):** Segregação de interface e permissões para Visualizadores, Operadores e Administradores.

## 🛠️ Como Executar

### Pré-requisitos
* [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
* [Node.js (v20+)](https://nodejs.org/)
* [PostgreSQL](https://www.postgresql.org/)

### Iniciando o Sistema
*(Instruções de inicialização serão adicionadas conforme a evolução do projeto)*