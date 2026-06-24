package com.guilhermejt.transportadora.repository;

import com.guilhermejt.transportadora.model.Abastecimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.time.LocalDate;
import java.util.List;


public interface AbastecimentoRepository extends JpaRepository<Abastecimento, Integer> {
    Optional<Abastecimento> findTopByVeiculoIdOrderByDataDescIdDesc(Integer veiculoId);

    @Query("""
        SELECT a FROM Abastecimento a
        WHERE a.data BETWEEN :inicio AND :fim
          AND (:placa = '' OR LOWER(a.veiculo.placa) LIKE LOWER(CONCAT('%', :placa, '%')))
        ORDER BY a.data ASC
    """)
    List<Abastecimento> filtrar(@Param("inicio") LocalDate inicio,
                                @Param("fim") LocalDate fim,
                                @Param("placa") String placa);
}
