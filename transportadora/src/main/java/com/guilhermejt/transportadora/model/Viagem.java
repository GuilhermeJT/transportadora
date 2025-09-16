package com.guilhermejt.transportadora.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

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
    @JoinColumn(name = "motorista_id")
    private Usuario motorista;


    @ManyToOne
    @JoinColumn(name = "veiculo_id")
    private Veiculo veiculo;

    @ManyToOne
    @JoinColumn(name = "origem")
    private Fazenda origem;

    @ManyToOne
    @JoinColumn(name = "destino")
    private Fazenda destino;


    @ManyToOne
    @JoinColumn(name = "animal")
    private Animal animal;

    private Integer qtdAnimais;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate data;

    private Integer km;

    private Double valorPorKm;

    private Double valorGastoPegadio;






}
