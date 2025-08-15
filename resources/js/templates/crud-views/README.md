# Templates CRUD para Views React

Este diretório contém templates reutilizáveis para gerar rapidamente views React completas para operações CRUD.

## 🎯 Templates Disponíveis

### 1. `index.tsx.template`
- **Propósito**: Listagem com DataTable
- **Funcionalidades**: 
  - Paginação server-side
  - Filtros customizáveis
  - Ações avançadas (visualizar, editar, excluir)
  - Busca em tempo real
  - Seleção múltipla

### 2. `create.tsx.template`
- **Propósito**: Formulário de criação
- **Funcionalidades**:
  - Formulário com validação
  - Botão "Criar e Adicionar Novo"
  - Navegação contextual
  - Estados de loading

### 3. `edit.tsx.template`
- **Propósito**: Formulário de edição
- **Funcionalidades**:
  - Formulário pré-preenchido
  - Validação de dados
  - Navegação contextual
  - Estados de loading

### 4. `show.tsx.template`
- **Propósito**: Visualização detalhada
- **Funcionalidades**:
  - Tabs modernas (shadcn/ui)
  - Cards informativos
  - Ações contextuais
  - Design responsivo

### 5. `form.tsx.template`
- **Propósito**: Componente de formulário reutilizável
- **Funcionalidades**:
  - Campos com validação
  - Suporte a diferentes tipos de input
  - Estados de erro
  - Reutilizável entre create/edit

## 🚀 Como Usar

### Geração Automática via Comando
```bash
php artisan make:crud NomeDoModelo
```

Este comando irá:
1. Criar o modelo, migration e factory
2. Gerar todas as views React baseadas nos templates
3. Criar o controller
4. Adicionar as rotas
5. Configurar tudo automaticamente

### Geração Manual (Copiar e Colar)
1. Copie os templates desejados
2. Renomeie os arquivos removendo `.template`
3. Substitua os placeholders pelos valores corretos
4. Personalize conforme necessário

## 🔧 Placeholders Disponíveis

### Nomes e Variáveis
- `{{MODEL_NAME}}` - Nome do modelo (ex: User)
- `{{VARIABLE_NAME}}` - Variável singular (ex: user)
- `{{VARIABLE_NAME_PLURAL}}` - Variável plural (ex: users)
- `{{PLURAL_NAME}}` - Nome plural (ex: Users)
- `{{SINGULAR_NAME}}` - Nome singular (ex: User)
- `{{KEBAB_CASE_NAME}}` - Nome em kebab-case (ex: user-profile)

### Campos e Labels
- `{{MAIN_FIELD}}` - Campo principal (ex: name)
- `{{MAIN_FIELD_LABEL}}` - Label do campo (ex: Nome)
- `{{MAIN_FIELD_LABEL_LOWER}}` - Label em minúsculo (ex: nome)

### Configurações
- `{{ICON_IMPORT}}` - Ícone do Lucide React (ex: Package)
- `{{MODULE_NAME}}` - Nome do módulo (ex: Produtos)
- `{{ROUTE_PREFIX}}` - Prefixo das rotas (ex: products)
- `{{TABLE_NAME}}` - Nome da tabela para API (ex: products)

## 📝 Personalização

### 1. Campos do Formulário
Edite o arquivo `*-form.tsx` para adicionar campos específicos:

```tsx
// Exemplo de campo adicional
<div className="space-y-2">
    <Label htmlFor="description">Descrição</Label>
    <Textarea
        id="description"
        value={data.description || ''}
        onChange={(e) => setData('description', e.target.value)}
        className={errors.description ? 'border-red-500' : ''}
        placeholder="Digite a descrição"
    />
    {errors.description && (
        <p className="text-sm text-red-600">{errors.description}</p>
    )}
</div>
```

### 2. Colunas da Tabela
Edite o arquivo `index.tsx` para adicionar colunas específicas:

```tsx
// Exemplo de coluna adicional
createSortableColumn<ModelData>('Status', 'status'),
{
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
            {row.original.status}
        </Badge>
    ),
},
```

### 3. Tabs Personalizadas
Edite o arquivo `show.tsx` para adicionar tabs específicas:

```tsx
<TabsTrigger value="custom" className="flex items-center space-x-2">
    <CustomIcon className="w-4 h-4" />
    <span>Tab Personalizada</span>
</TabsTrigger>
```

### 4. Filtros Customizados
Adicione filtros específicos no `index.tsx`:

```tsx
const customFilters: CustomFilter[] = [
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { label: 'Ativo', value: 'active' },
            { label: 'Inativo', value: 'inactive' },
        ]
    }
];
```

## 🎨 Design System

### Cores e Variantes
- **Primary**: Azul para ações principais
- **Secondary**: Cinza para ações secundárias
- **Destructive**: Vermelho para ações de exclusão
- **Success**: Verde para confirmações

### Ícones Padrão
- **Package**: Ícone genérico para produtos/itens
- **Users**: Para usuários
- **Settings**: Para configurações
- **Shield**: Para permissões/segurança

### Componentes Utilizados
- **shadcn/ui**: Tabs, Cards, Buttons, Badges
- **Lucide React**: Ícones consistentes
- **DataTableServer**: Tabelas avançadas
- **Inertia.js**: Navegação SPA

## 🔄 Fluxo de Trabalho

### 1. Desenvolvimento Rápido
```bash
# Gerar CRUD completo
php artisan make:crud Product

# Personalizar campos no form
# Adicionar validações no controller
# Testar funcionalidades
```

### 2. Customização Avançada
1. Editar templates base conforme necessário
2. Adicionar novos placeholders se necessário
3. Atualizar o comando GenerateCrud
4. Regenerar views existentes

## 📚 Exemplos de Uso

### Produto Simples
```bash
php artisan make:crud Product
```
Gera: products/index.tsx, create.tsx, edit.tsx, show.tsx, product-form.tsx

### Módulo Complexo
```bash
php artisan make:crud Inventory/Product
```
Gera views no diretório products/ com namespace Inventory

## 🛠️ Manutenção

### Atualizando Templates
1. Edite os arquivos `.template` conforme necessário
2. Teste com um modelo de exemplo
3. Documente as mudanças
4. Comunique à equipe

### Adicionando Novos Templates
1. Crie o arquivo `.template` no diretório
2. Adicione os placeholders necessários
3. Atualize o comando GenerateCrud
4. Documente o novo template

## 🎯 Benefícios

- ✅ **Produtividade**: Geração automática de views completas
- ✅ **Consistência**: Padrão visual e funcional unificado
- ✅ **Manutenibilidade**: Templates centralizados e reutilizáveis
- ✅ **Flexibilidade**: Fácil personalização e extensão
- ✅ **Qualidade**: Código testado e otimizado
- ✅ **Rapidez**: De 0 a CRUD completo em segundos

Este sistema de templates acelera significativamente o desenvolvimento de CRUDs mantendo alta qualidade e consistência no código! 🚀
