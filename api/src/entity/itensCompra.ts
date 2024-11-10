import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Compra } from "./compra";
import { Produto } from "./produto";

@Entity()
export class ItensCompra {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Compra, compra => compra.itensCompras)
    compra: Compra;

    @ManyToOne(() => Produto, produto => produto.itensCompras)
    produto: Produto;

    @Column()
    n_serie: string;

    @Column()
    cor: String

    @Column()
    quantidade: number;

    @Column('decimal', { precision: 10, scale: 2 })
    preco_custo: number;
}
