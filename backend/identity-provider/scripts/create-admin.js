const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'identity_provider',
  },
});

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existing = await db('users').where({ username: 'admin' }).first();

    if (existing) {
      console.log('✅ Admin user already exists');
      console.log('   Username: admin');
      console.log('   Email:', existing.email);
      await db.destroy();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin', 10);

    // Create admin user
    const userId = uuidv4();
    const idpId = uuidv4(); // Identity provider ID

    await db('users').insert({
      id: userId,
      username: 'admin',
      email: 'admin@paymentbrain.com',
      password_digest: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      mobile_no: '1234567890',
      mobile_country_code: '+1',
      idp_id: idpId,
      country: 'US',
      currency: 'USD',
      status: 'active',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    console.log('✅ Admin user created successfully!');
    console.log('   Username: admin');
    console.log('   Password: admin');
    console.log('   Email: admin@paymentbrain.com');

    await db.destroy();
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    await db.destroy();
    process.exit(1);
  }
}

createAdminUser();
