package com.guilhermejt.transportadora.service;

import com.guilhermejt.transportadora.model.Pessoa;
import com.guilhermejt.transportadora.repository.PessoaRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PessoaService {

    private final PessoaRepository repository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public PessoaService(PessoaRepository repository) {
        this.repository = repository;
    }

    public void salvarUsuario(Pessoa pessoa){
//        String senhaCriptografada = passwordEncoder.encode(usuario.getPassword());
//        usuario.setPassword(senhaCriptografada);
        repository.save(pessoa);
    }

    public List<Pessoa> buscarUsuarios(){
        return repository.findAll();
    }

    public Pessoa buscarUsuarioId(Integer id){
        return repository.findById(id).orElseThrow(
                () -> new RuntimeException("Usuário não encontrado")
        );
    }

    public void deletarUsuario(Integer id){
        repository.deleteById(id);
    }

    public void atualizarUsuario(Integer id, Pessoa novosDados){
        Pessoa pessoa = repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if(novosDados.getNome() != null){
            pessoa.setNome(novosDados.getNome());
        }

//        if(novosDados.getPassword() != null){
//            usuario.setPassword(passwordEncoder.encode(novosDados.getPassword()));
//        }

        repository.save(pessoa);

    }

}
