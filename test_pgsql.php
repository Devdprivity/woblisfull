<?php
try {
    echo "Intentando conectar a PostgreSQL...\n";
    $pdo = new PDO('pgsql:host=localhost;port=5432;dbname=woblis_db', 'woblis_user', 'woblis_password');
    echo "¡Conexión exitosa!\n";
    echo "Versión de PostgreSQL: " . $pdo->query('SELECT version()')->fetchColumn() . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Código de error: " . $e->getCode() . "\n";
}

echo "\nDrivers PDO disponibles: " . implode(', ', PDO::getAvailableDrivers()) . "\n";
