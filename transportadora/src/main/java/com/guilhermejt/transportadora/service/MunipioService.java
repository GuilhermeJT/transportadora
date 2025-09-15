package com.guilhermejt.transportadora.service;


import com.guilhermejt.transportadora.model.Municipio;
import com.guilhermejt.transportadora.model.Veiculo;
import com.guilhermejt.transportadora.repository.MunicipioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MunipioService {

    private final MunicipioRepository repository;

    public MunipioService(MunicipioRepository repository) {
        this.repository = repository;
    }

    public void salvarMunicipio(Municipio municipio){
        repository.save(municipio);
    }

    public List<Municipio> buscarMunicipios(){
        return repository.findAll();
    }

    public Municipio buscarMunicipio(Integer id){
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    }

    public void deletarMunicipio(Integer id){
        repository.deleteById(id);
    }

    public void atualizarMunicipio(Integer id, Municipio dadosNovos){
        Municipio municipio = repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if(dadosNovos.getNome() != null){
            municipio.setNome(dadosNovos.getNome());
        }

        if(dadosNovos.getEstado() != null){
            municipio.setEstado(dadosNovos.getEstado());
        }

        repository.save(municipio);

    }
}
