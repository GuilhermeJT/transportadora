package com.guilhermejt.transportadora.repository;

import com.guilhermejt.transportadora.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {
}
