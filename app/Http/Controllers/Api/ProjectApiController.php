<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;

class ProjectApiController extends Controller
{
    public function __construct() {}

    /**
     * list model Display a listing of the resource.
     */
    public function index()
    {
        return ProjectResource::collection(Project::paginate());
    }

    /**
     * list model Display a listing of the resource.
     */
    public function list() {}
}
