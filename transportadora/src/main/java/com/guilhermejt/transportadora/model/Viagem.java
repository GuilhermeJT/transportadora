package com.guilhermejt.transportadora.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.math.BigDecimal;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "viagem")
public class Viagem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "responsavel")
    private Usuario responsavel;

    @ManyToOne
    @JoinColumn(name = "transportadora")
    private Empresa transportadora;


    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataEmbarque;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataDesembarque;

    private Integer km;

    private BigDecimal valorPorKm;

    private BigDecimal valorGastoPedagio;

    private Integer quantidadeAnimais;

    private BigDecimal adiantamento;

    private BigDecimal total;

    @ManyToOne
    @JoinColumn(name = "motorista_id")
    private Usuario motorista;

    @ManyToOne
    @JoinColumn(name = "veiculo_id")
    private Veiculo veiculo;

    @ManyToOne
    @JoinColumn(name = "fazenda_origem")
    private Fazenda origem;

    @ManyToOne
    @JoinColumn(name = "fazenda_destino")
    private Fazenda destino;


    public void calcularTotal(){

        BigDecimal kmValue = BigDecimal.valueOf(km);

        this.total = valorPorKm
                .multiply(kmValue)
                .add(valorGastoPedagio)
                .subtract(adiantamento);
    }



}
