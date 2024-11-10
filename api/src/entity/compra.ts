import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ItensCompra } from "./itensCompra";

@Entity()
export class Compra {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    data_compra: Date

    @Column()
    fornecedor: String

    @Column()
    n_nota: String    

    @Column()
    total_compra: number 

    @OneToMany(() => ItensCompra, itensCompra => itensCompra.compra, { cascade: true })
    itensCompras: ItensCompra[];
}