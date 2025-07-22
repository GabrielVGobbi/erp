<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Filesystem\Filesystem;

class GenerateCrud extends Command
{
    /**
     * Nome do comando Artisan: gera o CRUD completo
     * Opções:
     *  --requests  Gera FormRequest de Store e Update em pasta conforme nome
     *  --observer  Gera Observer e registra no AppServiceProvider
     */
    protected $signature = 'make:crud {name} {--requests} {--observer}';
    protected $description = 'Gera um CRUD completo para um modelo, incluindo Requests e Observers';

     public function handle()
    {
        $inputName = $this->argument('name');
        $segments = array_map('ucfirst', explode('/', $inputName));
        $modelName = end($segments);
        $variable = lcfirst($modelName);

        $singular = __singular($modelName);
        $singVar = lcfirst($singular);
        $plural = __plural($modelName);
        $varPlural = lcfirst($plural);

        $makeRequests = $this->option('requests');
        $makeObserver = $this->option('observer');

        $this->info("Iniciando CRUD para: {$singular}");

        // 1. Model, Migration e Factory
        Artisan::call("make:model {$inputName} -mf");
        $this->info("Model, migration e factory criados para {$singular}.");

        // 2. Seeder
        Artisan::call("make:seeder {$singular}Seeder");
        $this->info("Seeder criado: {$singular}Seeder.");

        // 3. FormRequests
        $requestPath = implode('/', $segments);
        $requestNs = implode('\\', $segments);
        if ($makeRequests) {
            Artisan::call("make:request {$requestPath}/Store{$singular}Request");
            Artisan::call("make:request {$requestPath}/Update{$singular}Request");
            $this->info("FormRequests criados em App/Http/Requests/{$requestPath}/");
        }

        // 4. Controller
        $this->createController($segments, $singular, $singVar, $makeRequests, $requestNs);

        // 5. Observer
        if ($makeObserver) {
            $this->createObserver($singular);
        }

        // 6. Route
        $this->createRoute($varPlural, $singular);

        // 7. Views
        $this->createViews($singular, $singVar);

        $this->info("CRUD completo gerado para {$singular}.");
    }

    private function createController(array $segments, $name, $variable, $withRequests = false, $reqNs = '')
    {
        $filesystem = new Filesystem();
        $stubPath = base_path('stubs/controller.stub');
        $subPath = implode('/', $segments);
        $namespaceSub = implode('\\', $segments);
        $namespace = 'App\\Http\\Controllers' . ($namespaceSub ? '\\' . $namespaceSub : '');
        $controllerPath = app_path("Http/Controllers/{$name}Controller.php");

        if (! $filesystem->exists($stubPath)) {
            return $this->error("Stub do Controller não encontrado em {$stubPath}.");
        }
        $stub = $filesystem->get($stubPath);

        $rqBase = $reqNs ? "App\\Http\\Requests\\{$reqNs}\\" : '';
        $storeRequest = $withRequests
            ? $rqBase . "Store{$name}Request"
            : "Illuminate\\Http\\Request";
        $updateRequest = $withRequests
            ? $rqBase . "Update{$name}Request"
            : "Illuminate\\Http\\Request";

        $namePlural = __plural($name);
        $variablePlural = __plural(lcfirst($name));

        $replacements = [
            'namespace'        => $namespace,
            'namespacedModel'  => "App\\Models\\{$name}",
            'useStoreRequest'  => $storeRequest,
            'useUpdateRequest' => $updateRequest,
            'class'            => "{$name}Controller",
            'model'            => $name,
            'variable'         => $variable,
            'modelPlural'      => $namePlural,
            'variablePlural'   => $variablePlural,
        ];

        foreach ($replacements as $key => $val) {
            $stub = preg_replace('/\{\{\s*' . preg_quote($key, '/') . '\s*\}\}/', $val, $stub);
        }

        $stub = preg_replace('/;{2,}/', ';', $stub);

        // Certifica diretório existe
        $dir = dirname($controllerPath);
        if (! $filesystem->exists($dir)) {
            $filesystem->makeDirectory($dir, 0755, true);
        }

        $filesystem->put($controllerPath, $stub);
        $this->info("Controller {$name}Controller criado em {$controllerPath}.");
    }

    private function createObserver($name)
    {
        Artisan::call("make:observer {$name}Observer --model={$name}");
        $this->info("Observer {$name}Observer criado.");

        $providerPath = app_path('Providers/AppServiceProvider.php');
        $filesystem = new Filesystem();
        $content = $filesystem->get($providerPath);

        $registerLine = "\\App\\Models\\{$name}::observe(\\App\\Observers\\{$name}Observer::class);";

        if (strpos($content, $registerLine) === false) {
            $content = preg_replace(
                '/public function boot\(\)\s*\{/',
                "public function boot()\n        {$registerLine}",
                $content,
                1
            );
            $filesystem->put($providerPath, $content);
            $this->info("Observer registrado em AppServiceProvider.");
        }
    }

    private function createRoute($route, $controller)
    {
        $routeFile = base_path('routes/web.php');
        $filesystem = new Filesystem();
        $content = $filesystem->get($routeFile);

        $resourceRoute = "Route::resource('{$route}', '{$controller}Controller');";
        if (strpos($content, $resourceRoute) === false) {
            $filesystem->append($routeFile, "\n{$resourceRoute}\n");
            $this->info("Rota resource '{$route}' adicionada em routes/web.php.");
        }
    }

    private function createViews($name, $variable)
    {
        $filesystem = new Filesystem();
        $viewDir = resource_path("views/{$variable}");
        if (! $filesystem->exists($viewDir)) {
            $filesystem->makeDirectory($viewDir, 0755, true);
            $this->info("Diretório de views criado em: {$viewDir}");
        }

        $stubs = ['index', 'create', 'edit', 'show', 'form'];
        foreach ($stubs as $stubType) {
            $stubPath = base_path("stubs/view-{$stubType}.stub");
            $viewPath = "{$viewDir}/{$stubType}.blade.php";

            if (! $filesystem->exists($stubPath)) {
                $this->error("Stub de view '{$stubType}' não encontrado em {$stubPath}.");
                continue;
            }

            $stub = $filesystem->get($stubPath);
            foreach ([
                'model'           => $name,
                'variable'        => $variable,
                'modelPlural'     => __plural($name),
                'variablePlural'  => __plural($variable),
            ] as $key => $val) {
                $stub = preg_replace('/\{\{\s*'.$key.'\s*\}\}/', $val, $stub);
            }

            $filesystem->put($viewPath, $stub);
            $this->info("View '{$stubType}' criada em {$viewPath}.");
        }
    }
}
