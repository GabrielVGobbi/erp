{{-- Exemplo de view usando o sistema de permissões --}}
@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1>Compras</h1>

                {{-- Botão criar apenas para quem tem permissão --}}
                @permission('compras.create')
                    <a href="{{ route('compras.create') }}" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Nova Compra
                    </a>
                @endpermission
            </div>

            {{-- Menu de ações baseado em roles --}}
            <div class="mb-3">
                @role('admin')
                    <div class="alert alert-info">
                        <strong>Modo Administrador:</strong> Você tem acesso total ao sistema.
                        <a href="{{ route('compras.relatorio-gerencial') }}" class="btn btn-sm btn-outline-primary ms-2">
                            Relatório Gerencial
                        </a>
                    </div>
                @endrole

                {{-- Filtros disponíveis baseados em permissões --}}
                <div class="btn-group" role="group">
                    @can('compras.view')
                        <button type="button" class="btn btn-outline-secondary active">Todas</button>
                    @endcan

                    @can('compras.approve')
                        <button type="button" class="btn btn-outline-warning">Pendentes Aprovação</button>
                    @endcan

                    @role('admin')
                        <button type="button" class="btn btn-outline-danger">Canceladas</button>
                    @endrole
                </div>
            </div>

            {{-- Tabela de compras --}}
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fornecedor</th>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($compras ?? [] as $compra)
                            <tr>
                                <td>{{ $compra->id ?? '#001' }}</td>
                                <td>{{ $compra->fornecedor ?? 'Fornecedor Exemplo' }}</td>
                                <td>{{ $compra->data ?? '2025-08-13' }}</td>
                                <td>R$ {{ number_format($compra->valor ?? 1500.00, 2, ',', '.') }}</td>
                                <td>
                                    <span class="badge bg-{{ $compra->status_color ?? 'warning' }}">
                                        {{ $compra->status ?? 'Pendente' }}
                                    </span>
                                </td>
                                <td>
                                    <div class="btn-group btn-group-sm">
                                        {{-- Visualizar sempre disponível para quem tem acesso à listagem --}}
                                        @can('compras.view')
                                            <a href="{{ route('compras.show', $compra->id ?? 1) }}"
                                               class="btn btn-outline-info" title="Visualizar">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                        @endcan

                                        {{-- Editar apenas com permissão --}}
                                        @can('compras.edit')
                                            <a href="{{ route('compras.edit', $compra->id ?? 1) }}"
                                               class="btn btn-outline-primary" title="Editar">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                        @endcan

                                        {{-- Aprovar apenas com permissão específica --}}
                                        @if(auth()->user()->can('compras.approve') || auth()->user()->hasRole('admin'))
                                            @if(($compra->status ?? 'Pendente') === 'Pendente')
                                                <button type="button"
                                                        class="btn btn-outline-success"
                                                        onclick="aprovarCompra({{ $compra->id ?? 1 }})"
                                                        title="Aprovar">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                            @endif
                                        @endif

                                        {{-- Excluir apenas com permissão --}}
                                        @can('compras.delete')
                                            <button type="button"
                                                    class="btn btn-outline-danger"
                                                    onclick="excluirCompra({{ $compra->id ?? 1 }})"
                                                    title="Excluir">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        @endcan
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="text-center">
                                    <p class="mb-0">Nenhuma compra encontrada.</p>
                                    @permission('compras.create')
                                        <a href="{{ route('compras.create') }}" class="btn btn-primary mt-2">
                                            Criar primeira compra
                                        </a>
                                    @endpermission
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            {{-- Informações de permissões para debug (remover em produção) --}}
            @if(config('app.debug'))
                <div class="mt-4">
                    <div class="card">
                        <div class="card-header">
                            <h5>Debug - Permissões do Usuário</h5>
                        </div>
                        <div class="card-body">
                            <p><strong>Roles:</strong>
                                @foreach(auth()->user()->roles as $role)
                                    <span class="badge bg-secondary">{{ $role->name }}</span>
                                @endforeach
                            </p>

                            <p><strong>Permissões de Compras:</strong></p>
                            <ul class="list-unstyled">
                                <li>
                                    <i class="fas fa-{{ auth()->user()->can('compras.view') ? 'check text-success' : 'times text-danger' }}"></i>
                                    compras.view
                                </li>
                                <li>
                                    <i class="fas fa-{{ auth()->user()->can('compras.create') ? 'check text-success' : 'times text-danger' }}"></i>
                                    compras.create
                                </li>
                                <li>
                                    <i class="fas fa-{{ auth()->user()->can('compras.edit') ? 'check text-success' : 'times text-danger' }}"></i>
                                    compras.edit
                                </li>
                                <li>
                                    <i class="fas fa-{{ auth()->user()->can('compras.delete') ? 'check text-success' : 'times text-danger' }}"></i>
                                    compras.delete
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            @endif
        </div>
    </div>
</div>

<script>
function aprovarCompra(id) {
    if (confirm('Tem certeza que deseja aprovar esta compra?')) {
        fetch(`/compras/${id}/aprovar`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                location.reload();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao aprovar compra');
        });
    }
}

function excluirCompra(id) {
    if (confirm('Tem certeza que deseja excluir esta compra? Esta ação não pode ser desfeita.')) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/compras/${id}`;

        const methodInput = document.createElement('input');
        methodInput.type = 'hidden';
        methodInput.name = '_method';
        methodInput.value = 'DELETE';

        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = '_token';
        tokenInput.value = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        form.appendChild(methodInput);
        form.appendChild(tokenInput);
        document.body.appendChild(form);
        form.submit();
    }
}
</script>
@endsection
