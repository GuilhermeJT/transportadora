package com.guilhermejt.transportadora.repository;

import com.guilhermejt.transportadora.model.Viagem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViagemRepository extends JpaRepository<Viagem, Integer> {
}
