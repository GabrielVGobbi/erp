<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AccountingEntriesResource;
use App\Http\Resources\BranchResource;
use App\Http\Resources\BusinessUnitResource;
use App\Http\Resources\CostCenterResource;
use App\Http\Resources\InventoryResource;
use App\Http\Resources\OrganizationResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\SupplierResource;
use App\Models\AccountingEntries;
use App\Models\Branch;
use App\Models\BusinessUnit;
use App\Models\CostCenter;
use App\Models\Inventory;
use App\Models\Organization;
use App\Models\Project;
use App\Models\Supplier;
use App\Modules\Compras\Models\PurchaseRequisition;
use App\Modules\Compras\Resources\PurchaseRequisitionResource;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Carbon\Carbon;

class TablesApiController extends Controller
{
    protected $limit, $order, $search, $sort, $filters;

    // Define a map for available tables, their models, and resources
    // This centralizes all the necessary information
    protected $tableMap = [
        'business-units' => [
            'model' => BusinessUnit::class,
            'resource' => BusinessUnitResource::class,
            'with' => [],
        ],
        'purchase-requisitions' => [
            'model' => PurchaseRequisition::class,
            'resource' => PurchaseRequisitionResource::class,
            'with' => ['requisitor'],
        ],
        'projects' => [
            'model' => Project::class,
            'resource' => ProjectResource::class,
            'with' => [],
        ],
        'inventories' => [
            'model' => Inventory::class,
            'resource' => InventoryResource::class,
            'with' => [],
        ],
        'cost-centers' => [
            'model' => CostCenter::class,
            'resource' => CostCenterResource::class,
            'with' => ['parent', 'organization'],
        ],
        'accounting-entries' => [
            'model' => AccountingEntries::class,
            'resource' => AccountingEntriesResource::class,
            'with' => [],
        ],
        'suppliers' => [
            'model' => Supplier::class,
            'resource' => SupplierResource::class,
            'with' => [],
        ],
        'organizations' => [
            'model' => Organization::class,
            'resource' => OrganizationResource::class,
            'with' => [],
        ],
        'branches' => [
            'model' => Branch::class,
            'resource' => BranchResource::class,
            'with' => ['organization'],
        ],
    ];

    public function __construct(Request $request)
    {
        $this->limit = $request->input('per_page') ?? 30;
        $this->order = $request->input('order') ?? 'asc';
        $this->search = $request->input('search') ?? '';
        $this->sort = $request->input('sort') ?? 'id';
        $this->filters = $request->input('filters') ?? [];
    }

    /**
     * Display a listing of the specified resource.
     * @param string $tableName
     */
    public function index(string $tableName)
    {
        // 1. Validate if the requested table exists in the map
        if (!array_key_exists($tableName, $this->tableMap)) {
            return response()->json(['error' => 'Table not found.'], 404);
        }

        $config = $this->tableMap[$tableName];
        $model = new $config['model'];

        // 2. Build the query dynamically
        $query = $model::query();

        // Eager load relationships if any are defined
        if (!empty($config['with'])) {
            $query->with($config['with']);
        }

        // Apply search if a term is provided
        if ($this->search) {
            // You'll need to add a 'searchable' scope to your models
            // For example: `public function scopeSearchable($query, $term) { ... }`
            $query->searchable($this->search);
        }

        // Apply filters
        if (!empty($this->filters)) {
            foreach ($this->filters as $column => $value) {
                if ($value !== null && $value !== '') {
                    $query->where($column, $value);
                }
            }
        }

        // Apply sorting
        $query->orderBy($this->sort, $this->order);

        $results = ($this->limit === 'all')
            ? $query->get()
            : $query->paginate($this->limit)->appends([
                'sort' => $this->sort,
                'order' => $this->order,
                'search' => $this->search,
                'filters' => $this->filters,
            ]);

        // 4. Use the correct Resource class to transform the data
        $resourceClass = $config['resource'];

        return $resourceClass::collection($results);
    }
}
