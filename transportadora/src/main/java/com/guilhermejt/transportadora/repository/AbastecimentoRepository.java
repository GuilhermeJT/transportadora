package com.guilhermejt.transportadora.repository;

import com.guilhermejt.transportadora.model.Abastecimento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AbastecimentoRepository extends JpaRepository<Abastecimento, Integer> {
    Optional<Abastecimento> findTopByVeiculoIdOrderByDataDescIdDesc(Integer veiculoId);
}
