# Templates Modulares para Views

Este diretório contém templates reutilizáveis para criar rapidamente páginas de visualização e formulários seguindo as melhores práticas e padrões de design do projeto.

## 🎯 Componentes Disponíveis

### 1. DetailView (`@/components/app/detail-view.tsx`)
Componente modular para páginas de visualização de registros com:
- Header com título, subtítulo e ações
- Campos organizados em cards
- Sistema de abas
- Metadados (criado em, atualizado em)
- Status badges
- Ações customizáveis

### 2. FormView (`@/components/app/form-view.tsx`)
Componente modular para formulários com:
- Seções organizadas
- Múltiplos tipos de campos
- Validação integrada
- Layout responsivo
- Ações de salvar/cancelar

### 3. ActivityFeed (`@/components/app/activity-feed.tsx`)
Componente para exibir atividades/comentários com:
- Timeline de atividades
- Comentários editáveis
- Diferentes tipos de atividade
- Sistema de avatares

## 🚀 Como Usar os Templates

### Para criar uma nova página de visualização:

1. **Copie o arquivo template:**
   ```bash
   cp resources/js/templates/show-template.tsx resources/js/pages/app/your_model/show.tsx
   ```

2. **Substitua os TODOs:**
   - Renomeie `YourModel` para o nome do seu modelo
   - Configure os campos em `fields`
   - Adicione abas em `tabs` se necessário
   - Configure as ações em `actions`
   - Ajuste as rotas

3. **Exemplo de configuração de campos:**
   ```typescript
   const fields: DetailField[] = [
     {
       key: 'id',
       label: 'ID',
       type: 'text',
       icon: <Hash className="h-4 w-4" />
     },
     {
       key: 'name',
       label: 'Nome',
       type: 'text',
       icon: <Building className="h-4 w-4" />
     },
     {
       key: 'email',
       label: 'E-mail',
       type: 'text',
       icon: <Mail className="h-4 w-4" />
     },
     {
       key: 'status',
       label: 'Status',
       type: 'badge'
     },
     {
       key: 'price',
       label: 'Preço',
       type: 'currency'
     },
     {
       key: 'is_active',
       label: 'Ativo',
       type: 'boolean'
     }
   ];
   ```

### Para criar uma nova página de formulário:

1. **Copie o arquivo template:**
   ```bash
   cp resources/js/templates/form-template.tsx resources/js/pages/app/your_model/form.tsx
   ```

2. **Configure as seções e campos:**
   ```typescript
   const sections: FormSection[] = [
     {
       title: 'Informações Básicas',
       description: 'Dados principais do registro',
       fields: [
         {
           name: 'name',
           label: 'Nome',
           type: 'text',
           placeholder: 'Digite o nome',
           required: true,
           colSpan: 2
         },
         {
           name: 'email',
           label: 'E-mail',
           type: 'email',
           required: true
         },
         {
           name: 'status',
           label: 'Status',
           type: 'select',
           options: [
             { value: 'active', label: 'Ativo' },
             { value: 'inactive', label: 'Inativo' }
           ]
         }
       ]
     }
   ];
   ```

## 📋 Tipos de Campos Disponíveis

### DetailView Fields:
- `text` - Texto simples
- `date` - Data formatada (DD/MM/YYYY)
- `datetime` - Data e hora formatadas
- `currency` - Valor monetário (R$ 0,00)
- `boolean` - Badge Sim/Não
- `badge` - Badge customizado
- `custom` - Renderização customizada

### FormView Fields:
- `text` - Input de texto
- `email` - Input de email
- `password` - Input de senha
- `number` - Input numérico
- `textarea` - Área de texto
- `select` - Seleção dropdown
- `checkbox` - Checkbox
- `date` - Seletor de data
- `datetime-local` - Seletor de data e hora
- `custom` - Campo customizado

## 🎨 Propriedades de Layout

### Campos (colSpan):
- `colSpan: 1` - 1 coluna (padrão)
- `colSpan: 2` - 2 colunas
- `colSpan: 3` - Linha inteira

### Grid responsivo:
- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 3 colunas

## 🔧 Customizações Avançadas

### Aba customizada:
```typescript
{
  id: 'custom_tab',
  label: 'Minha Aba',
  icon: <Icon className="h-4 w-4" />,
  badge: 5,
  content: (
    <Card>
      <CardContent>
        {/* Seu conteúdo customizado */}
      </CardContent>
    </Card>
  )
}
```

### Campo customizado:
```typescript
{
  name: 'custom_field',
  label: 'Campo Customizado',
  type: 'custom',
  render: (field, value, onChange, error) => (
    <div>
      {/* Sua implementação customizada */}
    </div>
  )
}
```

### Ação customizada:
```typescript
{
  label: 'Minha Ação',
  icon: <Icon className="h-4 w-4 mr-2" />,
  variant: 'outline',
  onClick: () => {
    // Sua lógica customizada
  }
}
```

## 📝 Exemplo Completo

Veja o arquivo `resources/js/pages/app/cost_centers/show.tsx` para um exemplo completo de implementação usando os templates.

## 🎯 Benefícios

- ✅ **Consistência**: Todas as páginas seguem o mesmo padrão visual
- ✅ **Rapidez**: Criação rápida de novas páginas
- ✅ **Manutenibilidade**: Mudanças centralizadas nos componentes base
- ✅ **Responsividade**: Layout adaptável para todos os dispositivos
- ✅ **Acessibilidade**: Componentes seguem padrões de acessibilidade
- ✅ **Tipagem**: TypeScript para maior segurança
- ✅ **Modularidade**: Componentes reutilizáveis e extensíveis
