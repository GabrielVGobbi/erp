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
     *  --requests   Gera FormRequest de Store e Update em pasta conforme nome
     *  --observer   Gera Observer e registra no AppServiceProvider
     *  --resources  Gera API Resources (Resource e ResourceCollection) em pasta conforme nome
     */
    protected $signature = 'make:crud {name} {--requests} {--observer} {--resources}';
    protected $description = 'Gera um CRUD completo para um modelo, incluindo Requests, Observer e API Resources';

    public function handle()
    {
        $inputName = $this->argument('name');
        $nameSegments = array_map('ucfirst', explode('/', $inputName));
        $name = end($nameSegments);
        $variable = lcfirst($name);
        $nameSingular = __singular($name);
        $variableSingular = lcfirst($nameSingular);
        $namePlural = __plural($name);
        $variablePlural = lcfirst($namePlural);

        $generateRequests  = $this->option('requests');
        $generateObserver  = $this->option('observer');
        $generateResources = $this->option('resources');

        $this->info("Gerando CRUD para o modelo: {$nameSingular}");

        // 1. Model, Migration e Factory
        Artisan::call("make:model {$inputName} -mf");
        $this->info("Model, migration e factory criados para {$nameSingular}.");

        // 2. Seeder
        Artisan::call("make:seeder {$nameSingular}Seeder");
        $this->info("Seeder criado para {$nameSingular}.");

        // 3. Requests em subpasta conforme input
        $requestPath      = implode('/', $nameSegments);
        $requestNamespace = implode('\\', $nameSegments);
        if ($generateRequests) {
            Artisan::call("make:request {$requestPath}/Store{$nameSingular}Request");
            Artisan::call("make:request {$requestPath}/Update{$nameSingular}Request");
            $this->info("FormRequests criados em App/Http/Requests/{$requestPath}.");
        }

        // 4. API Resources em subpasta conforme input
        if ($generateResources) {
            $resourcePath      = implode('/', $nameSegments);
            $resourceNamespace = implode('\\', $nameSegments);
            Artisan::call("make:resource {$resourcePath}/{$name}Resource");
            Artisan::call("make:resource {$resourcePath}/{$name}Resource --collection");
            $this->info("API Resources criados em App/Http/Resources/{$resourcePath}.");
        }

        // 5. Controller
        $this->createController(
            $nameSegments,
            $nameSingular,
            $variableSingular,
            $generateRequests,
            $requestNamespace,
            $generateResources,
            $resourceNamespace
        );

        // 6. Observer
        if ($generateObserver) {
            $this->createObserver($nameSingular);
        }

        // 7. Routes
        $this->createRoute($variablePlural, $nameSingular);

        // 8. Views React
        $this->createReactViews($nameSingular, $variableSingular, $namePlural, $variablePlural);

        $this->info("CRUD completo gerado com sucesso para {$nameSingular}!");
    }

    private function createController(
        array $segments,
        $name,
        $variable,
        $withRequests = false,
        $reqNs = '',
        $withResources = false,
        $resNs = ''
    ) {
        $filesystem  = new Filesystem();
        $stubPath    = base_path('stubs/controller.stub');
        $subPath     = implode('/', $segments);
        $namespaceSub = implode('\\', $segments);
        $namespace    = 'App\\Http\\Controllers' . ($namespaceSub ? '\\' . $namespaceSub : '');
        $controllerDir = app_path("Http/Controllers");
        $controllerPath = "{$controllerDir}/{$name}Controller.php";

        if (!$filesystem->exists($stubPath)) {
            return $this->error("Stub do Controller não encontrado em {$stubPath}.");
        }
        $stub = $filesystem->get($stubPath);

        // Requests
        $rqBase = $reqNs ? "App\\Http\\Requests\\{$reqNs}\\" : '';
        $storeRequest  = $withRequests ? $rqBase."Store{$name}Request" : "Illuminate\\Http\\Request";
        $updateRequest = $withRequests ? $rqBase."Update{$name}Request" : "Illuminate\\Http\\Request";

        // Resources
        $resBase = $resNs ? "App\\Http\\Resources\\{$resNs}\\" : '';
        $resource       = $withResources ? $resBase."{$name}Resource" : '';
        $resourceColl   = $withResources ? $resBase."{$name}ResourceCollection" : '';

        $namePlural      = __plural($name);
        $variablePlural  = __plural(lcfirst($name));

        $replacements = [
            'namespace'            => $namespace,
            'namespacedModel'      => "App\\Models\\{$name}",
            'useStoreRequest'      => $storeRequest,
            'useUpdateRequest'     => $updateRequest,
            'useResource'          => $resource,
            'useResourceCollection'=> $resourceColl,
            'class'                => "{$name}Controller",
            'model'                => $name,
            'variable'             => $variable,
            'modelPlural'          => $namePlural,
            'variablePlural'       => $variablePlural,
        ];

        foreach ($replacements as $key => $val) {
            $stub = preg_replace(
                '/\{\{\s*' . preg_quote($key, '/') . '\s*\}\}/',
                $val,
                $stub
            );
        }
        $stub = preg_replace('/;{2,}/', ';', $stub);

        // Certifica diretório
        if (! $filesystem->exists($controllerDir)) {
            $filesystem->makeDirectory($controllerDir, 0755, true);
        }
        $filesystem->put($controllerPath, $stub);
        $this->info("Controller {$name}Controller criado em {$controllerPath}.");
    }

    private function createObserver($name)
    {
        Artisan::call("make:observer {$name}Observer --model={$name}");
        $this->info("Observer {$name}Observer criado.");

        $providerPath = app_path('Providers/AppServiceProvider.php');
        $filesystem   = new Filesystem();
        $content      = $filesystem->get($providerPath);

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
        $content   = $filesystem->get($routeFile);

        $resourceRoute = "Route::resource('{$route}', '{$controller}Controller');";
        if (strpos($content, $resourceRoute) === false) {
            $filesystem->append($routeFile, "\n{$resourceRoute}\n");
            $this->info("Rota resource '{$route}' adicionada em routes/web.php.");
        }
    }

    private function createViews($name, $variable)
    {
        $filesystem = new Filesystem();
        $viewDir    = resource_path("views/{$variable}");
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
                $stub = preg_replace('/\{\{\s*'.preg_quote($key,'/').'\s*\}\}/', $val, $stub);
            }

            $filesystem->put($viewPath, $stub);
            $this->info("View '{$stubType}' criada em {$viewPath}.");
        }
    }

    private function createReactViews($nameSingular, $variableSingular, $namePlural, $variablePlural)
    {
        $filesystem = new Filesystem();
        $templateDir = resource_path('js/templates/crud-views');
        $viewDir = resource_path("js/pages/app/{$variablePlural}");

        // Criar diretório das views se não existir
        if (!$filesystem->exists($viewDir)) {
            $filesystem->makeDirectory($viewDir, 0755, true);
            $this->info("Diretório de views React criado em: {$viewDir}");
        }

        // Definir os replacements para os templates
        $kebabCaseName = strtolower(preg_replace('/([a-z])([A-Z])/', '$1-$2', $nameSingular));
        $mainField = 'name'; // Campo principal padrão - pode ser customizado
        $mainFieldLabel = 'Nome';
        $mainFieldLabelLower = 'nome';
        $iconImport = 'Package'; // Ícone padrão - pode ser customizado
        $moduleName = ucfirst($variablePlural);
        $routePrefix = $variablePlural;
        $tableName = $variablePlural;

        $replacements = [
            '{{MODEL_NAME}}' => $nameSingular,
            '{{VARIABLE_NAME}}' => $variableSingular,
            '{{VARIABLE_NAME_PLURAL}}' => $variablePlural,
            '{{PLURAL_NAME}}' => $namePlural,
            '{{PLURAL_NAME_LOWER}}' => strtolower($namePlural),
            '{{SINGULAR_NAME}}' => $nameSingular,
            '{{SINGULAR_NAME_LOWER}}' => strtolower($nameSingular),
            '{{KEBAB_CASE_NAME}}' => $kebabCaseName,
            '{{MAIN_FIELD}}' => $mainField,
            '{{MAIN_FIELD_LABEL}}' => $mainFieldLabel,
            '{{MAIN_FIELD_LABEL_LOWER}}' => $mainFieldLabelLower,
            '{{ICON_IMPORT}}' => $iconImport,
            '{{MODULE_NAME}}' => $moduleName,
            '{{ROUTE_PREFIX}}' => $routePrefix,
            '{{TABLE_NAME}}' => $tableName,
        ];

        // Templates a serem criados
        $templates = [
            'index.tsx.template' => 'index.tsx',
            'create.tsx.template' => 'create.tsx',
            'edit.tsx.template' => 'edit.tsx',
            'show.tsx.template' => 'show.tsx',
            'form.tsx.template' => "{$kebabCaseName}-form.tsx",
        ];

        foreach ($templates as $templateFile => $outputFile) {
            $templatePath = "{$templateDir}/{$templateFile}";
            $outputPath = "{$viewDir}/{$outputFile}";

            if (!$filesystem->exists($templatePath)) {
                $this->error("Template '{$templateFile}' não encontrado em {$templatePath}.");
                continue;
            }

            // Ler o template
            $content = $filesystem->get($templatePath);

            // Aplicar os replacements
            foreach ($replacements as $placeholder => $replacement) {
                $content = str_replace($placeholder, $replacement, $content);
            }

            // Salvar o arquivo
            $filesystem->put($outputPath, $content);
            $this->info("View React '{$outputFile}' criada em {$outputPath}.");
        }

        // Criar informações adicionais para o usuário
        $this->line('');
        $this->info('📝 Views React criadas com sucesso!');
        $this->line('');
        $this->comment('🔧 Próximos passos para personalizar:');
        $this->line("1. Edite o arquivo '{$kebabCaseName}-form.tsx' para adicionar os campos específicos do modelo");
        $this->line("2. Atualize os templates conforme necessário (campo principal, ícone, etc.)");
        $this->line("3. Adicione as rotas no arquivo de rotas apropriado");
        $this->line("4. Crie o endpoint da API para a tabela em TablesApiController");
        $this->line('');
        $this->comment('📁 Arquivos criados:');
        foreach ($templates as $templateFile => $outputFile) {
            $this->line("   - {$outputFile}");
        }
    }
}
