package com.guilhermejt.transportadora.model;


import jakarta.persistence.*;
import lombok.*;


@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "empresa")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "cnpj", unique = true)
    private String cnpj;

    @Column(name = "nome_empresa")
    private String nomeEmpresa;



}
