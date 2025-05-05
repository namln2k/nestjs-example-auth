import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

const config: ConfigService = new ConfigService();

export default new DataSource({
  type: 'sqlite',
  database: config.get<string>('DATABASE_NAME') || 'sqlite.db',
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/database/migrations/*.{ts,js}'],
});
