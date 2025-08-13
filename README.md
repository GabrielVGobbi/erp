# Sistema ERP - Módulo de Compras

## Visão Geral

Este é um sistema ERP (Enterprise Resource Planning) desenvolvido em Laravel com React, focado inicialmente no módulo de **Compras**. O sistema utiliza uma arquitetura modular que permite escalabilidade e manutenibilidade, com cada módulo de negócio organizado de forma independente.

## Tecnologias Utilizadas

### Backend
- **Laravel 12.0** - Framework PHP principal
- **PHP 8.2+** - Linguagem de programação
- **Inertia.js** - Bridge entre Laravel e React
- **Laravel Sanctum** - Autenticação API
- **Spatie Activity Log** - Log de atividades do sistema

### Frontend
- **React 19.0** - Biblioteca JavaScript para UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4.0** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis
- **Tanstack Table** - Tabelas avançadas
- **Vite** - Build tool e dev server

### Ferramentas de Desenvolvimento
- **ESLint** - Linting JavaScript/TypeScript
- **Prettier** - Formatação de código
- **PHPUnit** - Testes PHP
- **Laravel Pint** - Code style PHP

## Arquitetura do Sistema

### Estrutura Modular

O sistema segue uma arquitetura modular onde cada módulo de negócio é organizado em `app/Modules/`. Atualmente implementado:

```
app/Modules/
└── Compras/                    # Módulo de Compras
    ├── Http/                   # Controllers
    │   ├── Api/               # API Controllers
    │   └── Web/               # Web Controllers
    ├── Models/                # Modelos Eloquent
    ├── Services/              # Lógica de negócio
    ├── Requests/              # Form Requests (Validação)
    ├── Resources/             # API Resources
    ├── Observers/             # Model Observers
    ├── Supports/              # Classes de apoio
    │   ├── Enums/            # Enumerações
    │   └── Traits/           # Traits reutilizáveis
    ├── Jobs/                  # Background Jobs
    └── Exceptions/            # Exceções específicas
```

### Padrões Arquiteturais

- **Repository Pattern** - Abstração de acesso a dados
- **Service Layer** - Lógica de negócio centralizada
- **Observer Pattern** - Eventos de modelo
- **Enum Pattern** - Estados e categorias tipados
- **Resource Pattern** - Transformação de dados para API

## Módulo de Compras

### Funcionalidades Principais

#### 1. Requisições de Compra (Purchase Requisitions)
- **Criação** de requisições com informações detalhadas
- **Gestão de Status** com workflow definido
- **Categorização** por tipo (Materiais, Serviços, Locação)
- **Controle de Aprovação** com múltiplos níveis
- **Rastreamento** de prazos e entregas

#### 2. Workflow de Status
O sistema implementa um workflow rigoroso para requisições:

```
DRAFT (Rascunho)
    ↓
SUBMITTED_FOR_APPROVAL (Enviado para Aprovação)
    ↓
APPROVED (Aprovado) ←→ REJECTED (Recusado)
    ↓
UNDER_NEGOTIATION (Em Negociação)
    ↓
CLOSED (Fechado)

CANCELED (Cancelado) - Pode ser acessado de qualquer status
```

#### 3. Categorias de Compra
- **MATERIAIS** - Aquisição de materiais e insumos
- **SERVICOS** - Contratação de serviços de terceiros  
- **LOCACAO** - Locação de equipamentos e recursos

### Modelos de Dados

#### PurchaseRequisition
```php
- id: UUID
- user_id: ID do requisitante
- responsible_buyer_id: ID do comprador responsável
- order: Número sequencial
- order_number: Número formatado (ex: 0001)
- observations: Observações gerais
- terms_and_conditions: Termos e condições
- category: Categoria (enum)
- status: Status atual (enum)
- at: Data de criação
- delivery_forecast: Previsão de entrega
- order_request: Pedido realizado
- under_negotiation_at: Data início negociação
```

### APIs Disponíveis

#### Endpoints Principais
```
GET    /api/purchase-requisitions          # Listar requisições
POST   /api/purchase-requisitions          # Criar requisição
GET    /api/purchase-requisitions/{id}     # Visualizar requisição
PUT    /api/purchase-requisitions/{id}     # Atualizar requisição
DELETE /api/purchase-requisitions/{id}     # Excluir requisição

# Gestão de Status
PUT    /api/purchase-requisitions/{id}/status           # Atualizar status
GET    /api/purchase-requisitions/{id}/transitions      # Transições disponíveis

# Inventário
GET    /api/inventory                      # Listar inventário
```

### Validações e Regras de Negócio

#### Transições de Status
- Implementadas via enum `PurchaseRequisitionStatus`
- Validação automática de transições permitidas
- Campos específicos atualizados conforme status

#### Validações de Formulário
- **StorePurchaseRequisitionRequest** - Criação
- **UpdatePurchaseRequisitionRequest** - Atualização
- **UpdateStatusRequest** - Mudança de status

### Observadores (Observers)

#### PurchaseRequisitionObserver
Monitora eventos do modelo para:
- Log de atividades
- Notificações automáticas
- Sincronização de dados
- Auditoria de mudanças

## Configuração e Instalação

### Pré-requisitos
- PHP 8.2+
- Node.js 18+
- Composer
- NPM/Yarn

### Instalação

1. **Clone o repositório**
```bash
git clone [repository-url]
cd app_erp
```

2. **Instale dependências PHP**
```bash
composer install
```

3. **Instale dependências Node.js**
```bash
npm install
```

4. **Configure ambiente**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configure banco de dados**
```bash
# Edite .env com suas configurações de DB
php artisan migrate
```

6. **Inicie o desenvolvimento**
```bash
# Opção 1: Comando integrado
composer run dev

# Opção 2: Separadamente
php artisan serve
npm run dev
```

### Scripts Disponíveis

#### PHP/Laravel
```bash
composer run dev          # Servidor + Queue + Vite
composer run dev:ssr      # Com Server-Side Rendering
composer run test         # Executar testes
```

#### Frontend
```bash
npm run dev              # Desenvolvimento
npm run build            # Build produção
npm run build:ssr        # Build com SSR
npm run lint             # Linting
npm run format           # Formatação
npm run types            # Verificação TypeScript
```

## Estrutura de Arquivos

### Configurações
- `composer.json` - Dependências e scripts PHP
- `package.json` - Dependências e scripts Node.js
- `vite.config.ts` - Configuração Vite
- `tailwind.config.js` - Configuração Tailwind
- `tsconfig.json` - Configuração TypeScript
- `eslint.config.js` - Configuração ESLint

### Diretórios Principais
- `app/` - Código da aplicação Laravel
- `resources/` - Views, assets e componentes React
- `routes/` - Definições de rotas
- `database/` - Migrations, seeders e factories
- `tests/` - Testes automatizados
- `public/` - Assets públicos
- `storage/` - Arquivos de storage
- `config/` - Configurações Laravel

## Padrões de Desenvolvimento

### Nomenclatura
- **Classes**: PascalCase
- **Métodos**: camelCase  
- **Variáveis**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Arquivos**: kebab-case ou PascalCase

### Organização de Código
- Services para lógica de negócio
- Requests para validação
- Resources para transformação de dados
- Observers para eventos de modelo
- Enums para estados e categorias

### Boas Práticas
- Tipagem forte com TypeScript
- Validação rigorosa de dados
- Tratamento de erros consistente
- Logs de auditoria
- Testes automatizados
- Documentação inline

## Próximos Módulos Planejados

O sistema está preparado para expansão com novos módulos:
- **Financeiro** - Gestão financeira e contábil
- **Estoque** - Controle de inventário
- **Vendas** - Gestão de vendas e CRM
- **RH** - Recursos humanos
- **Produção** - Controle de produção

## Contribuição

### Adicionando Novos Módulos
1. Criar estrutura em `app/Modules/[NomeModulo]/`
2. Seguir padrão arquitetural existente
3. Implementar testes
4. Documentar APIs
5. Atualizar este README

### Padrões de Commit
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes

## Licença

MIT License - Veja arquivo LICENSE para detalhes.

---

**Desenvolvido com ❤️ usando Laravel + React**