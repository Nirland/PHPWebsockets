<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class SocketImpl implements MessageComponentInterface {
    protected $clients;
    private $lastcoords;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->lastcoords = json_encode(['left'=> 0, 'top' => 0]);
    }

    public function onOpen(ConnectionInterface $conn) {        
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
                
        $conn->send($this->lastcoords);
    }

    public function onMessage(ConnectionInterface $from, $msg) {        

        $this->lastcoords = $msg;
        
        foreach ($this->clients as $client) {                       
            $client->send($msg);           
        }
    }

    public function onClose(ConnectionInterface $conn) {        
        $this->clients->detach($conn);        
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {        
        $conn->close();
    }
}