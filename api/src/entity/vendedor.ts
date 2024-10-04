import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vendedor {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nome: String

    @Column()
    email: String

    @Column({unique: true})
    cpf: String

    @Column()
    data_adm: Date

    @Column()
    comissao: number
}