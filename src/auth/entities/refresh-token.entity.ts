import { Column, Entity } from 'typeorm';

@Entity()
export class RefreshToken {
  @Column()
  value: string;

  @Column()
  userId: string;

  @Column({ type: 'time' })
  expiresAt: string;
}
