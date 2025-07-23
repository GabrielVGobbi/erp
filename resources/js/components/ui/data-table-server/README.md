# Data Table Server

Uma implementação de tabela de dados com recursos avançados e integração com API para React, baseada em Shadcn UI e TanStack Table.

## Recursos

- 🔄 **Integração com API**: Carrega dados dinamicamente do servidor
- 🔍 **Filtragem avançada**: Pesquisa por texto, filtros facetados, e reset de filtros
- 📊 **Ordenação**: Ordena qualquer coluna
- 📱 **Responsivo**: Adaptável para diferentes tamanhos de tela
- ✅ **Seleção de linhas**: Seleciona uma ou múltiplas linhas
- 📄 **Paginação**: Controles de navegação e seleção de tamanho de página
- 🎛️ **Personalização de colunas**: Visibilidade de colunas, formatação personalizada
- 💾 **Persistência de estado**: Salva preferências do usuário no localStorage

## Componentes

- `DataTableServer`: Componente principal para a tabela
- `DataTableServerToolbar`: Barra de ferramentas com pesquisa e filtros
- `DataTableServerPagination`: Controles de paginação
- Helpers para colunas:
  - `createSelectionColumn`: Adiciona checkbox para seleção
  - `createSortableColumn`: Adiciona ordenação a uma coluna
  - `createActionsColumn`: Adiciona menu de ações (visualizar, editar, excluir)
  - `createBadgeColumn`: Formata valores como badges coloridos
  - `createDateColumn`: Formata valores de data

## Uso Básico

```tsx
import { 
    DataTableServer, 
    createSelectionColumn, 
    createSortableColumn 
} from '@/components/ui/data-table-server';

// Definir colunas
const columns = [
    createSelectionColumn(),
    createSortableColumn('Nome', 'name'),
    createSortableColumn('Email', 'email'),
];

// Definir filtros
const filterableColumns = [
    {
        id: 'role',
        title: 'Papel',
        options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Usuário', value: 'user' },
        ],
    },
];

// Usar na sua página
<DataTableServer
    columns={columns}
    data={initialData}
    pageCount={1}
    apiEndpoint="/api/users"
    searchColumn="name"
    filterableColumns={filterableColumns}
/>
```

## Persistência no LocalStorage

Para salvar as preferências do usuário (como filtros, paginação, e visibilidade de colunas) entre sessões, você pode ativar o suporte ao localStorage:

```tsx
<DataTableServer
    columns={columns}
    data={initialData}
    apiEndpoint="/api/users"
    
    // Configurações para persistência
    storageKey="users-table" // Identificador único para esta tabela
    enableLocalStorage={true} // Ativar persistência
/>
```

Os seguintes estados serão salvos no localStorage:
- Paginação atual (página e tamanho da página)
- Ordenação (coluna e direção)
- Filtros ativos (tanto de colunas quanto customizados)
- Visibilidade das colunas

Cada tabela que usa localStorage deve ter uma chave única (`storageKey`) para evitar conflitos entre diferentes tabelas na aplicação.

## Props

### DataTableServer

| Prop | Tipo | Descrição |
|------|------|-----------|
| `columns` | `ColumnDef<TData, TValue>[]` | Definição das colunas |
| `data` | `TData[]` | Dados iniciais |
| `pageCount` | `number` | Número total de páginas |
| `apiEndpoint` | `string` | URL da API para buscar dados |
| `searchColumn?` | `string` | Nome da coluna para pesquisa de texto |
| `filterableColumns?` | `object[]` | Colunas que podem ser filtradas |
| `customFilters?` | `CustomFilter[]` | Filtros independentes que não correspondem a colunas |
| `onRowClick?` | `(row: TData) => void` | Função chamada ao clicar em uma linha |
| `defaultPageSize?` | `number` | Tamanho padrão da página (default: 10) |
| `defaultFilters?` | `Record<string, any>` | Filtros padrão |
| `initialPageIndex?` | `number` | Índice inicial da página (default: 0) |
| `extraParams?` | `Record<string, any>` | Parâmetros extras para a API |
| `transformResponse?` | `(data: any) => { data: TData[], meta: { total: number, last_page: number } }` | Função para transformar a resposta da API |
| `onDataLoaded?` | `(data: TData[]) => void` | Callback quando os dados são carregados |
| `storageKey?` | `string` | Chave única para identificar esta tabela no localStorage |
| `enableLocalStorage?` | `boolean` | Se verdadeiro, ativa a persistência no localStorage (padrão: false) |

## Formato da API

Por padrão, a tabela espera que a API retorne dados no seguinte formato:

```json
{
    "data": [...],  // Array de registros
    "meta": {
        "total": 100,  // Total de registros
        "last_page": 10,  // Último número de página
        "current_page": 1,  // Página atual
        "per_page": 10  // Registros por página
    }
}
```

Se sua API usa um formato diferente, use a prop `transformResponse` para converter os dados para o formato esperado.

## Parâmetros da API

A tabela envia os seguintes parâmetros para a API:

- `page`: Número da página (começa em 1)
- `per_page`: Registros por página
- `search`: Termo de busca (se searchColumn estiver definido)
- `sort_by`: Campo para ordenação
- `sort_direction`: Direção da ordenação ('asc' ou 'desc')
- Parâmetros de filtro: Um parâmetro para cada filtro ativo, incluindo filtros customizados 