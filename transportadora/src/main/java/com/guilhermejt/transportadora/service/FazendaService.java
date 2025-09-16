package com.guilhermejt.transportadora.service;


import com.guilhermejt.transportadora.model.Fazenda;
import com.guilhermejt.transportadora.repository.FazendaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FazendaService {
    private final FazendaRepository repository;

    public FazendaService(FazendaRepository repository) {
        this.repository = repository;
    }

    public Fazenda saveFazenda(Fazenda fazenda){
        return repository.save(fazenda);
    }

    public List<Fazenda> getFazendas(){
        return repository.findAll();
    }

    public Fazenda getFazenda(Integer id){
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Fazenda não encontrada"));
    }

    public void deleteFazenda(Integer id){
        repository.deleteById(id);
    }

    public Fazenda updateFazenda(Integer id, Fazenda dadosNovos){
        Fazenda faz = repository.findById(id).orElseThrow(() -> new RuntimeException("Fazenda não encontrada"));

        if(dadosNovos.getNome_fazenda() != null){
            faz.setNome_fazenda(dadosNovos.getNome_fazenda());
        }

        if(dadosNovos.getDono() != null){
            faz.setDono(dadosNovos.getDono());
        }

        if(dadosNovos.getMunicipio() != null){
            faz.setMunicipio(dadosNovos.getMunicipio());
        }

        return repository.save(faz);
    }
}
