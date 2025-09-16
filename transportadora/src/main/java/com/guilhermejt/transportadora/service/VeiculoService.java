package com.guilhermejt.transportadora.service;

import com.guilhermejt.transportadora.model.Veiculo;
import com.guilhermejt.transportadora.repository.VeiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VeiculoService {

    private final VeiculoRepository repository;

    public VeiculoService(VeiculoRepository repository) {
        this.repository = repository;
    }


    public void salvarVeiculo(Veiculo veiculo){
        repository.save(veiculo);
    }

    public List<Veiculo> getVeiculos(){
        return repository.findAll();
    }

    public Veiculo buscarVeiculo(Integer id){
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public void excluirVeiculo(Integer id){
        repository.deleteById(id);
    }

    public void atualizarVeiculo(Integer id, Veiculo dadosNovos){
        Veiculo veiculo = repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if(dadosNovos.getTipoVeiculo() != null){
            veiculo.setTipoVeiculo(dadosNovos.getTipoVeiculo());
        }

        if(dadosNovos.getPlaca() != null){
            veiculo.setPlaca(dadosNovos.getPlaca());
        }

        repository.save(veiculo);

    }
}
