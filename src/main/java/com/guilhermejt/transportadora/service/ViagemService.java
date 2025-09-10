package com.guilhermejt.transportadora.service;


import com.guilhermejt.transportadora.model.Viagem;
import com.guilhermejt.transportadora.repository.ViagemRepository;
import org.springframework.stereotype.Service;

@Service
public class ViagemService {
    private final ViagemRepository repository;

    public ViagemService(ViagemRepository repository) {
        this.repository = repository;
    }

    public Viagem saveViagem(Viagem viagem){
        return repository.save(viagem);
    }

    public Viagem getViagem(Integer id){
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Viagem não encontrada"));
    }

    public void deleteViagem(Integer id){
        repository.deleteById(id);
    }

    public Viagem updateViagem(Integer id, Viagem dadosNovos){
        Viagem viagem = repository.findById(id).orElseThrow(() -> new RuntimeException("Viagem não encontrada"));

        if(dadosNovos.getMotorista() != null){
            viagem.setMotorista(dadosNovos.getMotorista());
        }

        if(dadosNovos.getVeiculo() != null){
            viagem.setVeiculo(dadosNovos.getVeiculo());
        }

        if(dadosNovos.getOrigem() != null){
            viagem.setOrigem(dadosNovos.getOrigem());
        }

        if(dadosNovos.getDestino() != null){
            viagem.setDestino(dadosNovos.getDestino());
        }

        if(dadosNovos.getAnimal() != null){
            viagem.setAnimal(dadosNovos.getAnimal());
        }


        if(dadosNovos.getData() != null){
            viagem.setData(dadosNovos.getData());
        }

        if(dadosNovos.getKm() != null){
            viagem.setKm(dadosNovos.getKm());
        }

        if(dadosNovos.getValorPorKm() != null){
            viagem.setValorPorKm(dadosNovos.getValorPorKm());
        }

        if(dadosNovos.getValorGastoPegadio() != null){
            viagem.setValorGastoPegadio(dadosNovos.getValorGastoPegadio());
        }

        if(dadosNovos.getQtdAnimais() != null){
            viagem.setQtdAnimais(dadosNovos.getQtdAnimais());
        }

        return repository.save(viagem);


    }
}
