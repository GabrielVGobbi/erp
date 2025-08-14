<?php

namespace App\Modules\Compras\Http\Api;

use App\Http\Controllers\Controller;
use App\Modules\Compras\Http\PurchaseRequisition\PurchaseRequisition\UpdatePurchaseRequisitionRequest;
use App\Modules\Compras\Models\PurchaseRequisition;
use App\Modules\Compras\Requests\PurchaseRequisition\StorePurchaseRequisitionRequest;
use App\Modules\Compras\Requests\PurchaseRequisition\UpdateStatusRequest;
use App\Modules\Compras\Resources\PurchaseRequisitionResource;
use App\Modules\Compras\Services\PurchaseRequisitionService;
use App\Modules\Compras\Services\PurchaseRequisitionStatusService;
use App\Modules\Compras\Supports\Enums\Purchases\PurchaseRequisitionStatus;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PurchaseRequisitionApiController extends Controller
{
    public function __construct() {}

    /**
     * list model Display a listing of the resource.
     */
    public function index()
    {
        return PurchaseRequisitionResource::collection(PurchaseRequisition::paginate());
    }

    /**
     * list model Display a listing of the resource.
     */
    public function list() {}

    /**
     * Store a newly created resource in storage.
     * @param StorePurchaseRequisitionRequest $request
     */
    public function store(StorePurchaseRequisitionRequest $request)
    {
        $purchaseRequisition = PurchaseRequisition::create($request->validated());
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

        return view('admin.purchaseRequisition.show', [
            'purchaseRequisition' => $purchaseRequisition,
        ]);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param UpdatePurchaseRequisitionRequest $request
     * @param PurchaseRequisition $purchaseRequisition
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdatePurchaseRequisitionRequest $request,  $purchaseRequisitionId)
    {
        $purchaseRequisition = PurchaseRequisition::findOrFail($purchaseRequisitionId);

        return redirect()
            ->route('admin.purchaseRequisition.show', $purchaseRequisition->id)
            ->with('success', 'PurchaseRequisition atualizado com sucesso!');
    }

    /**
     * Update the status of the specified purchase requisition.
     *
     * @param UpdateStatusRequest $request
     * @param int $id
     * @param PurchaseRequisitionService $purchaseRequisitionService
     * @param PurchaseRequisitionStatusService $statusService
     * @return JsonResponse
     */
    public function updateStatus(UpdateStatusRequest $request, int $id, PurchaseRequisitionService $purchaseRequisitionService, PurchaseRequisitionStatusService $statusService): JsonResponse
    {
        $purchaseRequisition = PurchaseRequisition::findOrFail($id);

        $newStatus = PurchaseRequisitionStatus::from($request->validated()['status']);

        $updatedRequisition = $purchaseRequisitionService->updateStatus($purchaseRequisition, $newStatus);

        return response()->json([
            'message' => 'Status atualizado com sucesso!',
            'data' => new PurchaseRequisitionResource($updatedRequisition),
            'available_transitions' => $statusService->getAvailableTransitions($newStatus)
        ], 200);
    }

    /**
     * Get available status transitions for a purchase requisition.
     *
     * @param int $id
     * @param PurchaseRequisitionStatusService $statusService
     * @return JsonResponse
     */
    public function getAvailableTransitions(int $id, PurchaseRequisitionStatusService $statusService): JsonResponse
    {
        try {
            $purchaseRequisition = PurchaseRequisition::findOrFail($id);
            $availableTransitions = $statusService->getAvailableTransitions($purchaseRequisition->status);

            return response()->json([
                'current_status' => [
                    'value' => $purchaseRequisition->status->value,
                    'label' => $purchaseRequisition->status->getLabelText(),
                    'color' => $purchaseRequisition->status->getLabelColor(),
                ],
                'available_transitions' => $availableTransitions
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Requisição de compra não encontrada.'
            ], 404);
        }
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
