import { Module, Global, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex, knex } from 'knex';
import { Model } from 'objection';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: KNEX_CONNECTION,
      useFactory: async (configService: ConfigService): Promise<Knex> => {
        const config = configService.get<Knex.Config>('database');
        const knexInstance = knex(config);

        // Bind Objection.js to Knex instance
        Model.knex(knexInstance);

        return knexInstance;
      },
      inject: [ConfigService],
    },
  ],
  exports: [KNEX_CONNECTION],
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(KNEX_CONNECTION) private readonly knexConnection: Knex) {}

  async onModuleInit() {
    try {
      await this.knexConnection.raw('SELECT 1');
      console.log('✅ Database connection established successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.knexConnection.destroy();
    console.log('🔌 Database connection closed');
  }
}
