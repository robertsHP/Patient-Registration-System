<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AdminController
{
    public function register(Request $request, Response $response, $args)
    {
        // Handle user registration logic
        $data = ['message' => 'User registered successfully'];
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function login(Request $request, Response $response, $args)
    {
        // Handle user login logic
        $data = ['message' => 'User logged in successfully'];
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function logout(Request $request, Response $response, $args)
    {
        // Handle user logout logic
        $data = ['message' => 'User logged out successfully'];
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function checkLogin(Request $request, Response $response, $args)
    {
        // Check if the user is logged in
        $data = ['logged_in' => true];
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
