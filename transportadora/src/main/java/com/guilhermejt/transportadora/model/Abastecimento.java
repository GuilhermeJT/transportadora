package com.guilhermejt.transportadora.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "abastecimento")
public class Abastecimento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "data")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate data;

    @ManyToOne
    @JoinColumn(name = "empresa")
    private Empresa empresa;

    @Column(name = "nf")
    private Integer nf;

    @ManyToOne
    @JoinColumn(name = "veiculo")
    private Veiculo veiculo;

    private Integer kmOdometro;

    private BigDecimal  litros;

    private BigDecimal valorUni;

    private BigDecimal desconto;

    private BigDecimal total;

    private BigDecimal media;

    public void calcularTotal(){
        this.total = litros
                .multiply(valorUni)
                .subtract(desconto);
    }





}
