import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../../auth/entities/role.entity';

const roles = [
  { id: uuidv4(), name: 'admin' },
  { id: uuidv4(), name: 'moderator' },
  { id: uuidv4(), name: 'user' },
  { id: uuidv4(), name: 'guest' },
];

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Role);

    for (const role of roles) {
      const existing = await repository.findOneBy({ name: role.name });

      if (!existing) {
        const newRole = repository.create(role);
        await repository.save(newRole);
      }
    }
  }
}
