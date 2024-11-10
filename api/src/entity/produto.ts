import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ItensCompra } from "./itensCompra"

@Entity()
export class Produto {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    marca: String

    @Column()
    modelo: String

    @Column()
    capacidade: String

    @Column()
    estado: String
    
    @Column('decimal', { precision: 10, scale: 2 })
    preco_venda: number

    @OneToMany(() => ItensCompra, itensCompra => itensCompra.produto)
    itensCompras: ItensCompra[];
}