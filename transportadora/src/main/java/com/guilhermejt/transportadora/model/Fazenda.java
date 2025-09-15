package com.guilhermejt.transportadora.model;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "fazenda")
public class Fazenda {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;


    private String nome_fazenda;

    @ManyToOne
    @JoinColumn(name = "dono")
    private Usuario dono;


    @ManyToOne
    @JoinColumn(name = "municipio")
    private Municipio municipio;



}
