import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Venda } from "./venda";
import { Estoque } from "./estoque";

@Entity()
export class ItensVenda {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Venda, venda => venda.itensVendas)
    venda: Venda;

    @ManyToOne(() => Estoque, estoque => estoque.itensVendas)
    estoque: Estoque;

    @Column()
    quantidade: number;

    @Column('decimal', { precision: 10, scale: 2 })
    preco_venda: number;
}
