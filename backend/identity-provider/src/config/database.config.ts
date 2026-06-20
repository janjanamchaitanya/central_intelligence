import { registerAs } from '@nestjs/config';
import { Knex } from 'knex';

export default registerAs(
  'database',
  (): Knex.Config => ({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'identity_provider',
    },
    pool: {
      min: parseInt(process.env.DB_POOL_MIN, 10) || 2,
      max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: 'knex_migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/database/seeds',
      extension: 'ts',
    },
    debug: process.env.NODE_ENV === 'development',
  }),
);
