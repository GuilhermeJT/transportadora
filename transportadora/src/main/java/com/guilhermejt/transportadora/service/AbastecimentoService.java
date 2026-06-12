package com.guilhermejt.transportadora.service;

import com.guilhermejt.transportadora.model.Abastecimento;
import com.guilhermejt.transportadora.repository.AbastecimentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AbastecimentoService {
    private final AbastecimentoRepository repository;

    public AbastecimentoService(AbastecimentoRepository repository) {
        this.repository = repository;
    }

    public Abastecimento saveAbastecimento(Abastecimento abastecimento){
        abastecimento.calcularTotal();

        Integer veiculoId = abastecimento.getVeiculo().getId();

        var ultimoAbastecimentoOpt = repository.findTopByVeiculoIdOrderByDataDescIdDesc(veiculoId);

        if(ultimoAbastecimentoOpt.isPresent()){
            Abastecimento ultimo = ultimoAbastecimentoOpt.get();
            abastecimento.calcularMedia(ultimo.getKmOdometro());
        } else {
            abastecimento.setMedia(0.0);
        }

        return repository.save(abastecimento);
    }

    public List<Abastecimento> getAbastecimentos(){
        return repository.findAll();
    }

    public Abastecimento getAbastecimento(Integer id){
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Abastecimento não encontrado"));
    }

    public void deleteAbastecimento(Integer id){
        repository.deleteById(id);
    }

    public Abastecimento updateAbastecimento(Integer id, Abastecimento dadosNovos){
        Abastecimento abastecimento = repository.findById(id).orElseThrow(() -> new RuntimeException("Abastecimento não encontrado"));

        if(dadosNovos.getData() != null){
            abastecimento.setData(dadosNovos.getData());
        }

        if(dadosNovos.getEmpresa() != null){
            abastecimento.setEmpresa(dadosNovos.getEmpresa());
        }

        if(dadosNovos.getNf() != null){
            abastecimento.setNf(dadosNovos.getNf());
        }

        if(dadosNovos.getVeiculo() != null){
            abastecimento.setVeiculo(dadosNovos.getVeiculo());
        }

        if(dadosNovos.getKmOdometro() != null){
            abastecimento.setKmOdometro(dadosNovos.getKmOdometro());
        }

        if(dadosNovos.getLitros() != null){
            abastecimento.setLitros(dadosNovos.getLitros());
        }

        if(dadosNovos.getValorUni() != null){
            abastecimento.setValorUni(dadosNovos.getValorUni());
        }

        if(dadosNovos.getDesconto() != null){
            abastecimento.setDesconto(dadosNovos.getDesconto());
        }

        abastecimento.calcularTotal();


        return repository.save(abastecimento);
    }


}
