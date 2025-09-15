package com.guilhermejt.transportadora.service;

import com.guilhermejt.transportadora.model.Usuario;
import com.guilhermejt.transportadora.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public void salvarUsuario(Usuario usuario){
        String senhaCriptografada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(senhaCriptografada);
        repository.save(usuario);
    }

    public List<Usuario> buscarUsuarios(){
        return repository.findAll();
    }

    public Usuario buscarUsuarioId(Integer id){
        return repository.findById(id).orElseThrow(
                () -> new RuntimeException("Usuário não encontrado")
        );
    }

    public void deletarUsuario(Integer id){
        repository.deleteById(id);
    }

    public void atualizarUsuario(Integer id, Usuario novosDados){
        Usuario usuario = repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if(novosDados.getNome() != null){
            usuario.setNome(novosDados.getNome());
        }

        if(novosDados.getPassword() != null){
            usuario.setPassword(passwordEncoder.encode(novosDados.getPassword()));
        }

        repository.save(usuario);

    }

}
