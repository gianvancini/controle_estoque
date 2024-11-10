import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Produto } from "./produto";
import { ItensVenda } from "./itensVenda";

@Entity()
export class Estoque {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Produto, produto => produto.itensCompras)
    produto: Produto;

    @Column()
    n_serie: string;

    @Column()
    cor: String

    @Column()
    quantidade_disponivel: number;

    @Column('decimal', { precision: 10, scale: 2 })
    preco_custo: number; 

    @OneToMany(() => ItensVenda, itensVenda => itensVenda.estoque)
    itensVendas: ItensVenda[];
}
