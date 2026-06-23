package com.guilhermejt.transportadora.repository;

import com.guilhermejt.transportadora.model.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DespesaRepository extends JpaRepository<Despesa, Integer> {

    @Query("""
        SELECT d FROM Despesa d
        WHERE d.dataDespesa BETWEEN :inicio AND :fim
          AND (:motorista = '' OR LOWER(d.motorista.nome) LIKE LOWER(CONCAT('%', :motorista, '%')))
          AND (:placa = '' OR LOWER(d.veiculo.placa) LIKE LOWER(CONCAT('%', :placa, '%')))
        ORDER BY d.dataDespesa ASC
    """)
    List<Despesa> filtrar(@Param("inicio") LocalDate inicio,
                          @Param("fim") LocalDate fim,
                          @Param("motorista") String motorista,
                          @Param("placa") String placa);
}