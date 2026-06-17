package com.guilhermejt.transportadora.model;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "condicao")
public class Condicao {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String status;
}
