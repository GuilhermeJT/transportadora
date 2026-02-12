package com.guilhermejt.transportadora.repository;

import com.guilhermejt.transportadora.model.Viagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ViagemRepository extends JpaRepository<Viagem, Integer> {

    List<Viagem>  findByDataEmbarqueBetween(LocalDate inicio, LocalDate fim);
}



