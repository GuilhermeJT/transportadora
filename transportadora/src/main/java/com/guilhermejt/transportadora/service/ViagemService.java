package com.guilhermejt.transportadora.service;


import com.guilhermejt.transportadora.model.Viagem;
import com.guilhermejt.transportadora.repository.ViagemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Sort;

@Service
public class ViagemService {
    private final ViagemRepository repository;

    public ViagemService(ViagemRepository repository) {
        this.repository = repository;
    }

    public Viagem saveViagem(Viagem viagem){
        viagem.calcularTotal();
        return repository.save(viagem);
    }

    public List<Viagem> filtroViagens(LocalDate inicio, LocalDate fim, String motorista, String placa){
        String m = (motorista != null) ? motorista.trim() : "";
        String p = (placa != null) ? placa.trim() : "";
        return repository.filtrar(inicio, fim, m, p);
    }

    public List<Viagem> getViagens(){
        return repository.findAll(Sort.by("dataEmbarque").ascending());
    }

    public Viagem getViagem(Integer id){
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Viagem não encontrada"));
    }

    public void deleteViagem(Integer id){
        repository.deleteById(id);
    }

    public Viagem updateViagem(Integer id, Viagem dadosNovos){
        Viagem viagem = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Viagem não encontrada"));

        if(dadosNovos.getResponsavel() != null){
            viagem.setResponsavel(dadosNovos.getResponsavel());
        }

        if(dadosNovos.getTransportadora() != null){
            viagem.setTransportadora(dadosNovos.getTransportadora());
        }

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

        if(dadosNovos.getQuantidadeAnimais() != null) {
            viagem.setQuantidadeAnimais(dadosNovos.getQuantidadeAnimais());
        }

        if(dadosNovos.getDataEmbarque() != null){
            viagem.setDataEmbarque(dadosNovos.getDataEmbarque());
        }

        if(dadosNovos.getDataDesembarque() != null){
            viagem.setDataDesembarque(dadosNovos.getDataDesembarque());
        }

        if(dadosNovos.getKm() != null){
            viagem.setKm(dadosNovos.getKm());
        }

        if(dadosNovos.getValorPorKm() != null){
            viagem.setValorPorKm(dadosNovos.getValorPorKm());
        }

        if(dadosNovos.getValorGastoPedagio() != null){
            viagem.setValorGastoPedagio(dadosNovos.getValorGastoPedagio());
        }

        if(dadosNovos.getAdiantamento() != null){
            viagem.setAdiantamento(dadosNovos.getAdiantamento());
        }

        if(dadosNovos.getCondicao() != null){
            viagem.setCondicao(dadosNovos.getCondicao());
        }
        
        viagem.calcularTotal();

        return repository.save(viagem);
    }
}
