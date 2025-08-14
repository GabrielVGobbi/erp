<?php

namespace App\Modules\Compras\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ComprasController extends Controller
{
    public function __construct()
    {
        // Aplicar middleware de permissões
        $this->middleware(['can:compras.view'], ['only' => ['index', 'show']]);
        $this->middleware(['can:compras.create'], ['only' => ['create', 'store']]);
        $this->middleware(['can:compras.edit'], ['only' => ['edit', 'update']]);
        $this->middleware(['can:compras.delete'], ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Usuário já passou pela verificação de permissão no middleware
        return view('compras.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('compras.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Verificação adicional se necessário
        if (!$request->user()->can('compras.create')) {
            abort(403, 'Você não tem permissão para criar compras.');
        }

        // Lógica para criar compra
        return redirect()->route('compras.index')
            ->with('success', 'Compra criada com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return view('compras.show', compact('id'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('compras.edit', compact('id'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Lógica para atualizar compra
        return redirect()->route('compras.index')
            ->with('success', 'Compra atualizada com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Verificação adicional para ações críticas
        if (!auth()->user()->can('compras.delete')) {
            return response()->json(['error' => 'Sem permissão'], 403);
        }

        // Lógica para excluir compra
        return redirect()->route('compras.index')
            ->with('success', 'Compra excluída com sucesso!');
    }

    /**
     * Exemplo de método com verificação de role
     */
    public function relatorioGerencial()
    {
        // Apenas admins podem acessar relatórios gerenciais
        if (!auth()->user()->hasRole('admin')) {
            abort(403, 'Acesso restrito a administradores.');
        }

        return view('compras.relatorio-gerencial');
    }

    /**
     * Exemplo de método com múltiplas verificações
     */
    public function aprovarCompra($id)
    {
        $user = auth()->user();

        // Verificar se tem permissão específica OU é admin
        if (!$user->can('compras.approve') && !$user->hasRole('admin')) {
            abort(403, 'Você não tem permissão para aprovar compras.');
        }

        // Lógica para aprovar compra
        return response()->json(['message' => 'Compra aprovada com sucesso!']);
    }
}
