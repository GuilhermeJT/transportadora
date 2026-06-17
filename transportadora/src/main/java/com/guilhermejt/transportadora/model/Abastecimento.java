package com.guilhermejt.transportadora.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

    private Double kmOdometro;

    private BigDecimal  litros;

    private BigDecimal valorUni;

    private BigDecimal desconto;

    private BigDecimal total;

    private double media;

    public void calcularTotal(){
        this.total = litros
                .multiply(valorUni)
                .subtract(desconto);
    }

    public void calcularMedia(Double kmAnterior){
        if(kmAnterior == null || litros == null || litros.doubleValue() == 0){
            this.media = 0.0;
            return;
        }

        double resultado = (kmOdometro - kmAnterior) / litros.doubleValue();

        this.media = BigDecimal.valueOf(resultado)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    @ManyToOne
    @JoinColumn(name = "condicao")
    private Condicao condicao;





}
