<?php

namespace App\Modules\Compras\Http;

use App\Http\Controllers\Controller;
use App\Modules\Compras\Models\PurchaseRequisition;
use App\Modules\Compras\Requests\PurchaseRequisition\StorePurchaseRequisitionRequest;
use App\Modules\Compras\Requests\PurchaseRequisition\UpdatePurchaseRequisitionRequest;
use App\Modules\Compras\Resources\PurchaseRequisitionResource;
use App\Modules\Compras\Services\PurchaseRequisitionService;
use App\Modules\Compras\Supports\Enums\Purchases\PurchaseRequisitionStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseRequisitionController extends Controller
{
    public function __construct(
        private readonly PurchaseRequisitionService $purchaseRequisitionService
    ) {}

    /**
     * list model Display a listing of the resource.
     *
     */
    public function index()
    {
        return Inertia::render('app/purchase_requisitions/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('app/purchase_requisitions/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StorePurchaseRequisitionRequest $request
     */
    public function store(StorePurchaseRequisitionRequest $request)
    {
        $purchaseRequisition = PurchaseRequisition::create($request->validated());
        $purchaseRequisition->refresh();

        $this->purchaseRequisitionService->updateStatus(
            $purchaseRequisition,
            PurchaseRequisitionStatus::SUBMITTED_FOR_APPROVAL
        );

        return redirect()
            ->route('purchase-requisitions.index')
            ->with('success', 'Requisição de compra criado com sucesso!');
    }

    /**
     * Display a listing of the resource.
     *
     * @param  string|int  $id
     */
    public function show($id)
    {
        if (!$purchaseRequisition = PurchaseRequisition::find($id)) {
            return redirect()
                ->route('admin.purchaseRequisition.index')
                ->with('message', 'Registro não encontrado!');
        }

        return Inertia::render('app/purchase_requisitions/show', [
            'purchaseRequisitionData' => new PurchaseRequisitionResource($purchaseRequisition)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param PurchaseRequisition $purchaseRequisition
     * @return \Illuminate\Contracts\View\View
     */
    public function edit(PurchaseRequisition $purchaseRequisition)
    {
        return view('admin.purchaseRequisition.edit', compact('purchaseRequisition'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdatePurchaseRequisitionRequest $request
     * @param PurchaseRequisition $purchaseRequisition
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdatePurchaseRequisitionRequest $request, PurchaseRequisition $purchaseRequisition)
    {
        $validated = $request->validated();

        // Verifica se há mudança de status e se a transição é válida
        if (isset($validated['status']) && $validated['status'] !== $purchaseRequisition->status->value) {
            $newStatus = PurchaseRequisitionStatus::from($validated['status']);

            if (!$purchaseRequisition->canUpdate($newStatus)) {
                return back()->with([
                    'error' => 'Transição de status não permitida.'
                ]);
            }

            $this->purchaseRequisitionService->updateStatus(
                $purchaseRequisition,
                $newStatus
            );
        }

        $purchaseRequisition->update($validated);

        return redirect()
            ->route('purchase-requisitions.show', $purchaseRequisition->id)
            ->with('success', 'Requisição de compra atualizada com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param PurchaseRequisition $purchaseRequisition
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(PurchaseRequisition $purchaseRequisition)
    {
        $purchaseRequisition->delete();

        return redirect()
            ->route('admin.purchaseRequisition.index')
            ->with('success', 'PurchaseRequisition removido com sucesso!');
    }
}
