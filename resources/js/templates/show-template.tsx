import React from 'react';
import { PageProps } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import DetailView, { DetailField, DetailTab, DetailAction } from '@/components/app/detail-view';
import ActivityFeed, { ActivityItem } from '@/components/app/activity-feed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building,
  Hash,
  Calendar,
  User,
  MessageSquare,
  BarChart3,
  Trash2,
  Copy,
  Mail,
  Phone
} from 'lucide-react';

// TODO: Substituir pelos tipos corretos do seu modelo
interface YourModel {
  id: number;
  name: string;
  // Adicione outros campos aqui
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface ShowProps extends PageProps {
  yourModel: YourModel; // TODO: Renomear para o nome do seu modelo
  activities?: ActivityItem[];
}

const YourModelShow: React.FC<ShowProps> = ({ yourModel, activities = [] }) => {
  // TODO: Configurar os campos que serão exibidos
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
    // TODO: Adicionar mais campos conforme necessário
    // Exemplos de diferentes tipos de campos:
    // {
    //   key: 'email',
    //   label: 'E-mail',
    //   type: 'text',
    //   icon: <Mail className="h-4 w-4" />
    // },
    // {
    //   key: 'phone',
    //   label: 'Telefone',
    //   type: 'text',
    //   icon: <Phone className="h-4 w-4" />
    // },
    // {
    //   key: 'status',
    //   label: 'Status',
    //   type: 'badge'
    // },
    // {
    //   key: 'price',
    //   label: 'Preço',
    //   type: 'currency'
    // },
    // {
    //   key: 'is_active',
    //   label: 'Ativo',
    //   type: 'boolean'
    // },
    // {
    //   key: 'birth_date',
    //   label: 'Data de Nascimento',
    //   type: 'date'
    // },
    // {
    //   key: 'custom_field',
    //   label: 'Campo Customizado',
    //   type: 'custom',
    //   render: (value) => <span className="font-bold">{value}</span>
    // }
  ];

  // TODO: Configurar as abas adicionais (opcional)
  const tabs: DetailTab[] = [
    // Exemplo de aba com conteúdo customizado
    // {
    //   id: 'related_items',
    //   label: 'Itens Relacionados',
    //   icon: <BarChart3 className="h-4 w-4" />,
    //   badge: 0, // TODO: Substituir pelo número real
    //   content: (
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Itens Relacionados</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <p className="text-muted-foreground text-center py-8">
    //           Nenhum item relacionado encontrado.
    //         </p>
    //       </CardContent>
    //     </Card>
    //   )
    // },

    // Aba de atividades (sempre incluir se houver sistema de comentários/logs)
    {
      id: 'activity',
      label: 'Atividades',
      icon: <MessageSquare className="h-4 w-4" />,
      badge: activities.length,
      content: (
        <ActivityFeed
          activities={activities}
          canAddComment={true}
          onAddComment={(content) => {
            // TODO: Implementar lógica para adicionar comentário
            console.log('Adicionar comentário:', content);
          }}
          onEditActivity={(id, content) => {
            // TODO: Implementar lógica para editar atividade
            console.log('Editar atividade:', id, content);
          }}
          onDeleteActivity={(id) => {
            // TODO: Implementar lógica para excluir atividade
            console.log('Excluir atividade:', id);
          }}
        />
      )
    }
  ];

  // TODO: Configurar as ações disponíveis
  const actions: DetailAction[] = [
    {
      label: 'Duplicar',
      icon: <Copy className="h-4 w-4 mr-2" />,
      variant: 'outline',
      onClick: () => {
        // TODO: Implementar lógica de duplicação
        console.log('Duplicar registro');
      }
    },
    {
      label: 'Excluir',
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      variant: 'destructive',
      onClick: () => {
        if (confirm('Tem certeza que deseja excluir este registro?')) {
          // TODO: Substituir pela rota correta
          router.delete(route('your-model.destroy', yourModel.id));
        }
      }
    }
  ];

  return (
    <AppLayout>
      <Head title={`Seu Modelo - ${yourModel.name}`} /> {/* TODO: Ajustar título */}

      <DetailView
        title={yourModel.name}
        subtitle={`Registro #${yourModel.id}`} {/* TODO: Ajustar subtítulo */}
        backUrl={route('your-model.index')} {/* TODO: Substituir pela rota correta */}
        editUrl={route('your-model.edit', yourModel.id)} {/* TODO: Substituir pela rota correta */}
        data={yourModel}
        fields={fields}
        tabs={tabs}
        actions={actions}
        status={{
          label: yourModel.deleted_at ? 'Inativo' : 'Ativo',
          variant: yourModel.deleted_at ? 'destructive' : 'default'
        }}
        metadata={{
          createdAt: yourModel.created_at,
          updatedAt: yourModel.updated_at
        }}
      />
    </AppLayout>
  );
};

export default YourModelShow;
