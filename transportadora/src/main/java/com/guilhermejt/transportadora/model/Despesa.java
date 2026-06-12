package com.guilhermejt.transportadora.model;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "despesa_geral")
public class Despesa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "data_despesa")
    private LocalDate dataDespesa;

    @ManyToOne
    @JoinColumn(name = "veiculo")
    private Veiculo veiculo;

    @ManyToOne
    @JoinColumn(name = "motorista")
    private Pessoa motorista;


    @Column(name = "descricao")
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "empresa")
    private Empresa empresa;

    private Integer nf;

    private BigDecimal valor;



}
