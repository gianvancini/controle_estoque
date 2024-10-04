import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Produto {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nome: String

    @Column()
    marca: String

    @Column()
    modelo: String

    @Column()
    cor: String

    @Column()
    capacidade: String

    @Column()
    observacoes: String
    
    @Column()
    preco_venda: number

}