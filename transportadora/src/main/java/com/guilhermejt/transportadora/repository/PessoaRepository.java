package com.guilhermejt.transportadora.repository;

import com.guilhermejt.transportadora.model.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PessoaRepository extends JpaRepository<Pessoa, Integer> {

}
