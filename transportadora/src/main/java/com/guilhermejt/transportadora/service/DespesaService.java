package com.guilhermejt.transportadora.service;


import com.guilhermejt.transportadora.model.Despesa;
import com.guilhermejt.transportadora.repository.DespesaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DespesaService {

    private final DespesaRepository repository;

    public DespesaService(DespesaRepository repository) {this.repository = repository;}


    public Despesa saveDespesa(Despesa despesa){
        return repository.save(despesa);
    }

    public List<Despesa> getDespesas(){
        return repository.findAll();

    }

    public Despesa getDespesa(Integer id){
        return repository.findById(id).orElseThrow(()-> new RuntimeException("Despesa não encontrada")) ;
    }

    public void deletarDespesa(Integer id){
        repository.deleteById(id);
    }

    public Despesa updateDespesa(Integer id, Despesa dadosNovos){
        Despesa des = repository.findById(id).orElseThrow(()-> new RuntimeException("Despesa não encontrada"));

        if(dadosNovos.getData() != null){
            des.setData(dadosNovos.getData());
        }

        if(dadosNovos.getVeiculo() != null){
            des.setVeiculo(dadosNovos.getVeiculo());
        }

        if(dadosNovos.getMotorista() != null){
            des.setMotorista(dadosNovos.getMotorista());
        }

        if(dadosNovos.getDescricao() != null){
            des.setDescricao(dadosNovos.getDescricao());
        }

        if(dadosNovos.getEmpresa() != null){
            des.setEmpresa(dadosNovos.getEmpresa());
        }

        if(dadosNovos.getNf() != null){
            des.setNf(dadosNovos.getNf());
        }

        if(dadosNovos.getValor() != null){
            des.setValor(dadosNovos.getValor());
        }

        return repository.save(des);


    }
}
