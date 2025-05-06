import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const config: ConfigService = new ConfigService();

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'sqlite',
  database: config.get<string>('DATABASE_NAME') || 'sqlite.db',
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/database/migrations/*.{ts,js}'],
  seeds: ['dist/database/seeds/*.{ts,js}'],
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export default new DataSource(dataSourceOptions);
