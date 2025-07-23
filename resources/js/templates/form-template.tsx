import React from 'react';
import { PageProps } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import FormView, { FormSection } from '@/components/app/form-view';

// TODO: Substituir pelos tipos corretos do seu modelo
interface YourModel {
  id?: number;
  name: string;
  // Adicione outros campos aqui
}

// TODO: Adicionar outros tipos relacionados se necessário
interface RelatedModel {
  id: number;
  name: string;
}

interface FormProps extends PageProps {
  yourModel?: YourModel; // TODO: Renomear para o nome do seu modelo
  relatedModels?: RelatedModel[]; // TODO: Adicionar modelos relacionados se necessário
  isEdit?: boolean;
}

const YourModelForm: React.FC<FormProps> = ({
  yourModel,
  relatedModels = [],
  isEdit = false
}) => {
  // TODO: Configurar as seções do formulário
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
          colSpan: 2 // Ocupa 2 colunas no grid
        },
        // TODO: Adicionar mais campos conforme necessário
        // Exemplos de diferentes tipos de campos:

        // Campo de texto simples
        // {
        //   name: 'description',
        //   label: 'Descrição',
        //   type: 'textarea',
        //   placeholder: 'Digite a descrição',
        //   colSpan: 3 // Ocupa toda a linha
        // },

        // Campo de email
        // {
        //   name: 'email',
        //   label: 'E-mail',
        //   type: 'email',
        //   placeholder: 'Digite o e-mail',
        //   required: true
        // },

        // Campo de número
        // {
        //   name: 'price',
        //   label: 'Preço',
        //   type: 'number',
        //   placeholder: '0,00',
        //   validation: {
        //     min: 0,
        //     message: 'O preço deve ser maior que zero'
        //   }
        // },

        // Campo de data
        // {
        //   name: 'birth_date',
        //   label: 'Data de Nascimento',
        //   type: 'date',
        //   required: true
        // },

        // Campo de seleção
        // {
        //   name: 'status',
        //   label: 'Status',
        //   type: 'select',
        //   required: true,
        //   options: [
        //     { value: 'active', label: 'Ativo' },
        //     { value: 'inactive', label: 'Inativo' },
        //     { value: 'pending', label: 'Pendente' }
        //   ]
        // },

        // Campo de seleção com dados relacionados
        // {
        //   name: 'related_model_id',
        //   label: 'Modelo Relacionado',
        //   type: 'select',
        //   options: relatedModels.map(model => ({
        //     value: model.id,
        //     label: model.name
        //   }))
        // },

        // Campo de checkbox
        // {
        //   name: 'is_active',
        //   label: 'Ativo',
        //   type: 'checkbox',
        //   description: 'Marque para ativar o registro'
        // },

        // Campo customizado
        // {
        //   name: 'custom_field',
        //   label: 'Campo Customizado',
        //   type: 'custom',
        //   render: (field, value, onChange, error) => (
        //     <div>
        //       <input
        //         type="text"
        //         value={value || ''}
        //         onChange={(e) => onChange(e.target.value)}
        //         className="w-full p-2 border rounded"
        //       />
        //       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        //     </div>
        //   )
        // }
      ]
    },

    // TODO: Adicionar mais seções se necessário
    // {
    //   title: 'Configurações Avançadas',
    //   description: 'Configurações adicionais do registro',
    //   fields: [
    //     // Campos da segunda seção
    //   ]
    // }
  ];

  // TODO: Configurar os dados iniciais
  const initialData = yourModel || {
    name: '',
    // Adicione valores padrão para outros campos
  };

  return (
    <AppLayout>
      <Head title={isEdit ? `Editar - ${yourModel?.name}` : 'Novo Registro'} /> {/* TODO: Ajustar título */}

      <FormView
        title={isEdit ? 'Editar Registro' : 'Novo Registro'} {/* TODO: Ajustar título */}
        subtitle={isEdit ? `Editando: ${yourModel?.name}` : 'Criar um novo registro'} {/* TODO: Ajustar subtítulo */}
        backUrl={route('your-model.index')} {/* TODO: Substituir pela rota correta */}
        submitUrl={isEdit ? route('your-model.update', yourModel!.id) : route('your-model.store')} {/* TODO: Substituir pelas rotas corretas */}
        method={isEdit ? 'put' : 'post'}
        initialData={initialData}
        sections={sections}
        onSuccess={() => {
          // Redirecionar após sucesso será tratado pelo backend
          // Ou você pode adicionar lógica customizada aqui
        }}
        onError={(errors) => {
          // Lógica customizada para tratar erros (opcional)
          console.error('Erros de validação:', errors);
        }}
        submitLabel={isEdit ? 'Atualizar' : 'Criar'}
      />
    </AppLayout>
  );
};

export default YourModelForm;
