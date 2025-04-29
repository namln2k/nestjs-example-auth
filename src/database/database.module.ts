import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => ({
        type: 'sqlite',
        host: configService.get<string>('DATABASE_HOST') || 'localhost',
        port: configService.get<number>('DATABASE_PORT') || 5432,
        username: configService.get<string>('DATABASE_USERNAME') || 'root',
        password: configService.get<string>('DATABASE_PASSWORD') || 'root',
        database: configService.get<string>('DATABASE_NAME') || 'db',
        migrations: ['src/migrations/*{.ts}'],
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
