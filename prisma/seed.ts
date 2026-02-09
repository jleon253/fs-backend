import { prisma } from "../src/lib/prisma";

async function main() {
  // Crear 2 clientes (customers)
  const customer1 = await prisma.customers.create({
    data: {
      document_type: 'CC',
      document_number: '1234567890',
      full_name: 'Juan García López',
      email: 'juan.garcia@example.com',
    },
  });

  const customer2 = await prisma.customers.create({
    data: {
      document_type: 'CE',
      document_number: '9876543210',
      full_name: 'María Rodríguez Martínez',
      email: 'maria.rodriguez@example.com',
    },
  });

  // Crear 2 cuentas (accounts)
  const account1 = await prisma.accounts.create({
    data: {
      account_number: 0,
      status: 'ACTIVE',
      customer_id: customer1.id,
    },
  });

  const account2 = await prisma.accounts.create({
    data: {
      account_number: 0,
      status: 'ACTIVE',
      customer_id: customer2.id,
    },
  });

  console.log('Seed completado exitosamente:', {
    customer1,
    customer2,
    account1,
    account2,
  });
} 

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect()
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
