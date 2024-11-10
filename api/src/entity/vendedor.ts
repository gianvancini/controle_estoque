import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Venda } from "./venda";

@Entity()
export class Vendedor {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    email: string;

    @Column()
    cpf: string;

    @Column()
    data_adm: Date;

    @Column('decimal', { precision: 5, scale: 2 })
    comissao: number;

    @OneToMany(() => Venda, venda => venda.vendedor)
    vendas: Venda[];
}