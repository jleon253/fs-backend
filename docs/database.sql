-- 1. Crear la tabla de Clientes
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type VARCHAR(3) NOT NULL CHECK (document_type IN ('CC', 'CE', 'PAS')),
    document_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crear la tabla de Cuentas
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    account_number INTEGER UNIQUE,
    status VARCHAR(10) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Regla de negocio: No permite crear cuenta si el cliente no existe
    CONSTRAINT fk_customer FOREIGN KEY(customer_id) 
        REFERENCES customers(id) 
        ON DELETE CASCADE
);

-- función de generación aleatoria para el número de cuenta, asegurando que sea único y de 7 dígitos
CREATE OR REPLACE FUNCTION generate_unique_account_number() 
RETURNS trigger AS $$
DECLARE
    new_acc_number INTEGER;
    exists_acc BOOLEAN;
BEGIN
    LOOP
        -- Generar un número aleatorio de 7 dígitos
        new_acc_number := floor(random() * (9999999 - 1000000 + 1) + 1000000);
        
        -- Verificar si ya existe en la tabla
        SELECT EXISTS(SELECT 1 FROM accounts WHERE account_number = new_acc_number) INTO exists_acc;
        
        -- Si no existe, salir del bucle
        EXIT WHEN NOT exists_acc;
    END LOOP;
    
    -- Asignar el número generado al nuevo registro
    NEW.account_number := new_acc_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que ejecute esa función automáticamente antes de cada inserción en la tabla accounts
CREATE TRIGGER trg_assign_account_number
BEFORE INSERT ON accounts
FOR EACH ROW
EXECUTE FUNCTION generate_unique_account_number();

-- Ajuste en tabla accounts
ALTER TABLE accounts ALTER COLUMN account_number TYPE INTEGER;
-- Quitamos el valor por defecto del SERIAL para que no choque con el trigger
ALTER TABLE accounts ALTER COLUMN account_number DROP DEFAULT;