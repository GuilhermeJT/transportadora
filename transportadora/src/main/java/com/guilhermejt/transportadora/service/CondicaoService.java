package com.guilhermejt.transportadora.service;


import com.guilhermejt.transportadora.model.Condicao;
import com.guilhermejt.transportadora.repository.CondicaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CondicaoService {
    private final CondicaoRepository repository;

    public CondicaoService(CondicaoRepository repository) {
        this.repository = repository;
    }

    public Condicao saveCondicao(Condicao condicao){
        return repository.save(condicao);
    }

    public Condicao getCondicao(Integer id){
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Condição não encontrada"));
    }

    public void deletarCondicao(Integer id){
        repository.deleteById(id);
    }

}
