package com.guilhermejt.transportadora.repository;

import com.guilhermejt.transportadora.model.Viagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ViagemRepository extends JpaRepository<Viagem, Integer> {

    @Query("""
    SELECT v FROM Viagem v
    WHERE v.dataEmbarque BETWEEN :inicio AND :fim
      AND (:motorista = '' OR LOWER(v.motorista.nome) LIKE LOWER(CONCAT('%', :motorista, '%')))
      AND (:placa = '' OR LOWER(v.veiculo.placa) LIKE LOWER(CONCAT('%', :placa, '%')))
    ORDER BY v.dataEmbarque ASC
""")
    List<Viagem> filtrar(@Param("inicio") LocalDate inicio,
                         @Param("fim") LocalDate fim,
                         @Param("motorista") String motorista,
                         @Param("placa") String placa);
}



