package com.guilhermejt.transportadora.repository;

import com.guilhermejt.transportadora.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

}
