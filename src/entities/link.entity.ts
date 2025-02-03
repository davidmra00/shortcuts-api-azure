import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'main_link' })
  mainLink: string;
  @Column({ name: 'short_link' , nullable: true })
  shortLink: string;
}
