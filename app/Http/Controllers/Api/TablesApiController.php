<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AccountingEntriesResource;
use App\Http\Resources\BranchResource;
use App\Http\Resources\CostCenterResource;
use App\Http\Resources\OrganizationResource;
use App\Http\Resources\SupplierResource;
use App\Models\AccountingEntries;
use App\Models\Branch;
use App\Models\CostCenter;
use App\Models\Organization;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Carbon\Carbon;

class TablesApiController extends Controller
{
    protected $limit, $offset, $order, $search, $sort, $filter, $filters;

    public function __construct(Request $request)
    {
        $this->limit = $request->input('pageSize') ?? '30';
        $this->order = $request->input('order') ?? 'asc';
        $this->offset = $request->input('offset') ?? 0;
        $this->search = $request->input('search') ?? '';
        $this->sort = $request->input('sort') ?? 'id';
        $this->filter = $request->input('filter') ?? [];
        $this->filters = $request->input('filters') ?? [];
    }

    /**
     * Display a listing of the resource.
     */
    public function costCenters()
    {
        $costCenter = new CostCenter();

        $costCenter = $costCenter->with(['parent', 'organization'])->orderBy($this->sort, $this->order);

        $costCenter = $this->limit == 'all' ? $costCenter->get() : $costCenter->paginate($this->limit);

        return CostCenterResource::collection($costCenter);
    }

    /**
     * Display a listing of the resource.
     */
    public function accountingEntries()
    {
        $accountingEntries = new AccountingEntries();

        $accountingEntries = $accountingEntries->orderBy($this->sort, $this->order);

        $accountingEntries = $this->limit == 'all' ? $accountingEntries->get() : $accountingEntries->paginate($this->limit);

        return AccountingEntriesResource::collection($accountingEntries);
    }

    /**
     * Display a listing of the resource.
     */
    public function suppliers()
    {
        $suppliers = new Supplier();

        $suppliers = $suppliers->orderBy($this->sort, $this->order);

        $suppliers = $this->limit == 'all' ? $suppliers->get() : $suppliers->paginate($this->limit);

        return SupplierResource::collection($suppliers);
    }

    /**
     * Display a listing of the resource.
     */
    public function organizations()
    {
        $organizations = new Organization();

        $organizations = $organizations->orderBy($this->sort, $this->order);

        $organizations = $this->limit == 'all' ? $organizations->get() : $organizations->paginate($this->limit);

        return OrganizationResource::collection($organizations);
    }

    /**
     * Display a listing of the resource.
     */
    public function branches()
    {
        $branches = new Branch();

        $branches = $branches->with('organization')->orderBy($this->sort, $this->order);

        $branches = $this->limit == 'all' ? $branches->get() : $branches->paginate($this->limit);

        return BranchResource::collection($branches);
    }

    /**
     * Display query for DB.
     * @param  array  $searchColumns colunas que podem ser pesquisadas
     * @param  array  $withCount
     */
    private function get(Model $model, $with = [], $where = [], $whereHas = [])
    {
        if ($this->sort == 'idi') {
            $this->sort = 'id';
        }

        $this->filter = array_merge(['search' => $this->search], $this->filter);

        $model = $model
            ->filtered($this->filter)
            ->orderBy($this->sort, $this->order);

        if (!empty($with)) {
            $model->with($with);
        }

        if (!empty($where)) {
            foreach ($where as $w => $value) {
                $model->where($w, $value);
            }
        }

        if (!empty($whereHas)) {
            foreach ($whereHas as $w) {
                $model->whereHas($w);
            }
        }

        #dd([$model->toSql(), $model->getBindings()]);

        return $this->limit == 'all' ? $model->get() : $model->paginate($this->limit);
    }
}
