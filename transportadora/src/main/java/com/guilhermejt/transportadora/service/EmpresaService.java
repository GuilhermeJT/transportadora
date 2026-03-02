package com.guilhermejt.transportadora.service;


import com.guilhermejt.transportadora.model.Empresa;
import com.guilhermejt.transportadora.repository.EmpresaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpresaService {

    private final EmpresaRepository repository;

    public EmpresaService(EmpresaRepository repository) {
        this.repository = repository;
    }


    public void salvarEmpresa(Empresa empresa){
        repository.save(empresa);
    }


    public List<Empresa> getEmpresas(){
        return repository.findAll();
    }

    public Empresa getEmpresa(Integer id){
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Empresa não encontrado"));
    }

    public void excluirEmpresa(Integer id){
        repository.deleteById(id);
    }

    public void atualizarEmpresa(Integer id, Empresa dadosNovos){
        Empresa empresa = repository.findById(id).orElseThrow(() -> new RuntimeException("Empresa não encontrado"));

        if(dadosNovos.getCnpj() != null){
            empresa.setCnpj(dadosNovos.getCnpj());
        }

        if(dadosNovos.getNomeEmpresa() != null){
            empresa.setNomeEmpresa(dadosNovos.getNomeEmpresa());
        }

        repository.save(empresa);
    }

}
