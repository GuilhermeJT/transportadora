package com.guilhermejt.transportadora.service;


import com.guilhermejt.transportadora.model.Despesa;
import com.guilhermejt.transportadora.repository.DespesaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.data.domain.Sort;
import java.time.LocalDate;

@Service
public class DespesaService {

    private final DespesaRepository repository;

    public DespesaService(DespesaRepository repository) {this.repository = repository;}


    public Despesa saveDespesa(Despesa despesa){
        return repository.save(despesa);
    }

    public List<Despesa> filtroDespesas(LocalDate inicio, LocalDate fim, String motorista, String placa){
        String m = (motorista != null) ? motorista.trim() : "";
        String p = (placa != null) ? placa.trim() : "";
        return repository.filtrar(inicio, fim, m, p);
    }

    public List<Despesa> getDespesas(){
        return repository.findAll(Sort.by("dataDespesa").ascending());
    }

    public Despesa getDespesa(Integer id){
        return repository.findById(id).orElseThrow(()-> new RuntimeException("Despesa não encontrada")) ;
    }

    public void deletarDespesa(Integer id){
        repository.deleteById(id);
    }

    public Despesa updateDespesa(Integer id, Despesa dadosNovos){
        Despesa des = repository.findById(id).orElseThrow(()-> new RuntimeException("Despesa não encontrada"));

        if(dadosNovos.getDataDespesa() != null){
            des.setDataDespesa(dadosNovos.getDataDespesa());
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

        if(dadosNovos.getCondicao() != null){
            des.setCondicao(dadosNovos.getCondicao());
        }

        return repository.save(des);


    }
}
