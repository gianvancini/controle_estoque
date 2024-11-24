import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Cliente } from "./cliente";
import { Vendedor } from "./vendedor";
import { ItensVenda } from "./itensVenda";

@Entity()
export class Venda {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    data_venda: Date;

    @ManyToOne(() => Cliente, cliente => cliente.vendas)
    cliente: Cliente;

    @ManyToOne(() => Vendedor, vendedor => vendedor.vendas)
    vendedor: Vendedor;

    @Column('decimal', { precision: 10, scale: 2 })
    total_venda: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    desconto: number;

    @OneToMany(() => ItensVenda, itensVendas => itensVendas.venda, { cascade: true })
    itensVendas: ItensVenda[];
}
