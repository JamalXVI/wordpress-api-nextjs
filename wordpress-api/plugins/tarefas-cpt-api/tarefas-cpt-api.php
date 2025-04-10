<?php
/*
Plugin Name: Tarefas CPT e API
Description: Cria o CPT Tarefas com os campos customizados Status e Deadline e expõe endpoints REST CRUD.
Version: 1.0
Author: Henrique Arantes Tiraboschi
*/

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

function register_cpt_tasks() {
    $labels = array(
        'name'               => 'Tarefas',
        'singular_name'      => 'Tarefa',
        'menu_name'          => 'Tarefas',
        'name_admin_bar'     => 'Tarefa',
        'add_new'            => 'Adicionar Nova',
        'add_new_item'       => 'Adicionar Nova Tarefa',
        'new_item'           => 'Nova Tarefa',
        'edit_item'          => 'Editar Tarefa',
        'view_item'          => 'Ver Tarefa',
        'all_items'          => 'Todas as Tarefas',
        'search_items'       => 'Buscar Tarefas',
        'not_found'          => 'Nenhuma Tarefa encontrada.',
        'not_found_in_trash' => 'Nenhuma Tarefa encontrada na lixeira.'
    );

    $args = array(
        'labels'           => $labels,
        'public'           => true,
        'has_archive'      => true,
        'show_in_rest'     => true, // Habilita a REST API para esse CPT
        'supports'         => array('title', 'editor'),
        'menu_icon'        => 'dashicons-list-view',
    );

    register_post_type('tasks', $args);
}
add_action('init', 'register_cpt_tasks');

function register_meta_tasks() {
    register_post_meta('tasks', 'status', array(
        'type'         => 'string',
        'description'  => 'Status da Tarefa (incomplete, in progress, complete)',
        'single'       => true,
        'show_in_rest' => array(
            'schema' => array(
                'type' => 'string',
                'enum' => array('incomplete', 'in progress', 'complete'),
            ),
        ),
    ));

    register_post_meta('tasks', 'deadline', array(
        'type'         => 'string',
        'description'  => 'Data de Deadline (formato YYYY-MM-DD)',
        'single'       => true,
        'show_in_rest' => true,
    ));
}
add_action('init', 'register_meta_tasks');

function authenticator_callback() {
    $headers = getallheaders();
    if ( ! isset( $headers['Authorization'] ) ) {
        return new WP_Error('jwt_auth_no_auth_header', 'Authorization header not found', array('status' => 403));
    }

    $auth_header = $headers['Authorization'];
    if (strpos($auth_header, 'Bearer ') !== 0) {
        return new WP_Error('jwt_auth_bad_auth_header', 'Authorization header malformed', array('status' => 403));
    }

    $token = substr($auth_header, 7);
    $secret_key = defined('JWT_AUTH_SECRET_KEY') ? JWT_AUTH_SECRET_KEY : '';
    if ( empty($secret_key) ) {
        return new WP_Error('jwt_auth_no_secret', 'JWT secret key not defined', array('status' => 500));
    }
    try {
        $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
        return true;
    } catch (Exception $e) {
        return new WP_Error('jwt_auth_invalid_token', $e->getMessage(), array('status' => 403));
    }
}


add_action('rest_api_init', function () {
    register_rest_route('task/v1', '/secure', array(
        'methods'  => 'GET',
        'callback' => 'task_callback',
        'permission_callback' => function () {
            $auth = authenticator_callback();
            if ( is_wp_error( $auth ) ) {
                return $auth;
            }
            return true;
        },
    ));
});

function task_callback( WP_REST_Request $request ) {
    return rest_ensure_response( array('message' => 'Acesso garantido com JWT válido.') );
}
