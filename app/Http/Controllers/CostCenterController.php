<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CostCenter\StoreApproversRequest;
use App\Http\Requests\CostCenter\UpdateCostCenterRequest;
use App\Http\Resources\ApprovalAssignmentResource;
use App\Http\Resources\CostCenterResource;
use App\Http\Resources\OrganizationResource;
use App\Http\Resources\UserResource;
use App\Models\CostCenter;
use App\Models\Organization;
use App\Models\User;
use App\Modules\ACL\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CostCenterController extends Controller
{
    public function __construct() {}

    /**
     * list model Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('app/cost_centers/index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function create()
    {
        return view('admin.costCenter.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreUpdateCostCenter $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreUpdateCostCenter $request)
    {
        $costCenter = CostCenter::create($request->validated());

        return redirect()
            ->route('admin.costCenter.index')
            ->with('success', 'CostCenter criado com sucesso!');
    }

    /**
     * Display a listing of the resource.
     *
     * @param  string|int  $id
     */
    public function show($id)
    {
        if (!$costCenter = CostCenter::find($id)) {
            return redirect()
                ->route('cost-centers.index')
                ->with('message', 'Registro não encontrado!');
        }

        // Carregue as atribuições de aprovação com as relações 'user' e 'role'
        $approvalAssignments = $costCenter->approvers()->with(['user', 'role'])->get();

        return Inertia::render('app/cost_centers/show', [
            'costCenterData' => new CostCenterResource($costCenter),
            'approvalAssignments' => ApprovalAssignmentResource::collection($approvalAssignments),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param CostCenter $costCenter
     */
    public function edit(CostCenter $costCenter)
    {
        return Inertia::render('app/cost_centers/edit', [
            'costCenterData' => new CostCenterResource($costCenter),
            'organizationsData' =>  OrganizationResource::collection(Organization::get()),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateCostCenterRequest $request
     * @param CostCenter $costCenter
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateCostCenterRequest $request, CostCenter $costCenter)
    {
        $costCenter->update($request->validated());

        return redirect()
            ->route('cost-centers.show', $costCenter->id)
            ->with('success', 'CostCenter atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param CostCenter $costCenter
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(CostCenter $costCenter)
    {
        $costCenter->delete();

        return redirect()
            ->route('admin.costCenter.index')
            ->with('success', 'CostCenter removido com sucesso!');
    }

    public function manageApprovers($id)
    {
        if (!$costCenter = CostCenter::find($id)) {
            return redirect()
                ->route('cost-centers.index')
                ->with('message', 'Registro não encontrado!');
        }

        // Carregue as atribuições de aprovação com as relações 'user' e 'role'
        $approvalAssignments = $costCenter->approvers()->with(['user', 'role'])->get();

        return Inertia::render('app/cost_centers/manage-approvers', [
            'costCenterData' => new CostCenterResource($costCenter),
            'approvalAssignments' => ApprovalAssignmentResource::collection($approvalAssignments),
            'users' => UserResource::collection(User::get()),
            'approvalRoles' => Role::approves()->get(),
        ]);
    }

    public function updateManageApprovers(StoreApproversRequest $request, $costCenter)
    {
        $protectedRoleIds = [1, 2];

        $costCenter = CostCenter::find($costCenter);
        if (!$costCenter) {
            return redirect()->back()->with('error', 'Centro de Custo não encontrado.');
        }

        DB::transaction(function () use ($request, $costCenter, $protectedRoleIds) {
            $costCenter->approvers()->delete();

            $costCenter->approvers()
                ->whereNotIn('role_id', $protectedRoleIds)
                ->delete();


            foreach ($request->input('assignments') as $assignment) {
                if (isset($assignment['role_id']) && isset($assignment['user_id'])) {
                    $costCenter->approvers()->create([
                        'user_id' => $assignment['user_id'],
                        'role_id' => $assignment['role_id'],
                    ]);
                }
            }
        });

        return redirect()->back()->with('success', 'Atribuições de aprovação atualizadas com sucesso!');
    }
}
