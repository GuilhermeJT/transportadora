package com.guilhermejt.transportadora.repository;

import com.guilhermejt.transportadora.model.Fazenda;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FazendaRepository extends JpaRepository<Fazenda, Integer> {
}
