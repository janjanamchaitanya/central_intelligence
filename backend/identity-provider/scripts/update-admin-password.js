const bcrypt = require('bcrypt');
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

async function updateAdminPassword() {
  try {
    const newPassword = 'admin123';  // 8 characters minimum
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db('users')
      .where({ username: 'admin' })
      .update({ password_digest: hashedPassword });

    console.log('✅ Admin password updated successfully!');
    console.log('   Username: admin');
    console.log('   Password: admin123');

    await db.destroy();
  } catch (error) {
    console.error('❌ Error updating admin password:', error.message);
    await db.destroy();
    process.exit(1);
  }
}

updateAdminPassword();
