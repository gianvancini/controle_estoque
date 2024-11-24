import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Taxa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    vezes: number;

    @Column('decimal', { precision: 5, scale: 2 })
    percentual: number;
}
