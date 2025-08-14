<?php

namespace App\Modules\Compras\Http\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InventoryResource;
use App\Models\Inventory;

class InventoryApiController extends Controller
{
    public function __construct() {}

    /**
     * list model Display a listing of the resource.
     */
    public function index()
    {
        return InventoryResource::collection(Inventory::paginate());
    }

    /**
     * list model Display a listing of the resource.
     */
    public function list() {}
}
