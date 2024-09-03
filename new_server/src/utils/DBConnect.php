<?php

    class DBConnect {
        private static $instance = null;
        private $connection;

        private function __construct() {
            $this->connection = pg_connect(
                "host=" . $_ENV['POSTGRES_HOST'] . 
                " port=" . $_ENV['POSTGRES_PORT'] . 
                " dbname=" . $_ENV['POSTGRES_DB'] . 
                " user=" . $_ENV['POSTGRES_USER'] . 
                " password=" . $_ENV['POSTGRES_PASSWORD']
            );
            
            if (!$this->connection) {
                throw new Exception("Connection failed");
            }
        }

        public static function getInstance() {
            if (!self::$instance) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        public function getConnection() {
            return $this->connection;
        }
    }

?>