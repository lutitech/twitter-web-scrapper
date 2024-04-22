/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column('simple-array')
  image: string[];

  @Column({ nullable: true })
  video: string;
}

