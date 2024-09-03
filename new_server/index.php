<?php

    // Enable error reporting for development
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    // require_once dirname(__FILE__) . '/src/utils/DBConnect.php';


    require_once dirname(__FILE__) . '/vendor/autoload.php';

    use Slim\App;
    use Slim\Http\Request;
    use Slim\Http\Response;
    use Slim\Middleware\TokenAuthentication;
    use \Slim\Middleware\Session;
    use \Slim\Factory\AppFactory;
    use Tuupola\Middleware\JwtAuthentication;

    $app = AppFactory::create();

    $app->options('/{routes:.+}', function ($request, $response, $args) {
        return $response;
    });

    $app->add(function ($req, $res, $next) {
        $response = $next($req, $res);
        return $response
            ->withHeader('Access-Control-Allow-Origin', 'http://localhost:' . $_ENV['CLIENT_PORT'])
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
            ->withHeader(
                'Access-Control-Allow-Headers', 
                'X-Requested-With, Content-Type, Accept, Origin, Authorization'
            )
            ->withHeader('Access-Control-Allow-Credentials', 'true');
    });

    // JSON Middleware
    $app->addBodyParsingMiddleware();

    // Session Middleware
    $app->add(new Session([
        'name' => 'session',
        'autorefresh' => true,
        'lifetime' => '1 hour',
        // 'secure' => false, // Use true if running over HTTPS
        'secret' => bin2hex(random_bytes(32))
    ]));

    // Routes
    $app->get('/', function ($request, $response) {
        $response->getBody()->write('Server is running...');
        return $response;
    });

    $app->get('/api', function ($request, $response) {
        $response->getBody()->write('API is running...');
        return $response;
    });

    // Include your routes
    // require __DIR__ . '/src/routes/globalRoutes.php';
    // require __DIR__ . '/src/routes/calendarPageRoutes.php';
    // require __DIR__ . '/src/routes/adminRoutes.php';
    // require __DIR__ . '/src/routes/sessionRoutes.php';

    // Error handling middleware (Slim handles errors by default)
    // $app->add(ErrorMiddleware::class);

    $app->run();

?>
