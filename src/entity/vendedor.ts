import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vendedor {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nome: String

    @Column({unique: true})
    cpf: String

    @Column()
    data_adm: Date

    @Column()
    comissao: number
}