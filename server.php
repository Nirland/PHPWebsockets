<?php    
    use Ratchet\Server\IoServer;
    use Ratchet\Http\HttpServer;
    use Ratchet\WebSocket\WsServer;   

    require __DIR__ . '/bootstrap.php';

    $server = IoServer::factory(
        new HttpServer(
            new WsServer(
                new SocketImpl()
            )
        ),
        8080
    );

    $server->run();