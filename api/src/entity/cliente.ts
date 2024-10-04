import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cliente {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nome: String

    @Column({unique: true})
    cpf: String

    @Column()
    email: String

    @Column()
    telefone: String

    @Column()
    endereco: String

    @Column()
    cidade: String

    @Column()
    uf: String

    @Column()
    data_nascimento: Date
}