package com.guilhermejt.transportadora.controller;


import com.guilhermejt.transportadora.model.Empresa;
import com.guilhermejt.transportadora.service.EmpresaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empresa")
public class EmpresaController {

    private final EmpresaService service;

    public EmpresaController(EmpresaService service) {
        this.service = service;
    }


    @PostMapping
    public ResponseEntity<Void> salvarEmpresa(@RequestBody Empresa empresa){
        service.salvarEmpresa(empresa);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Empresa>> buscarEmpresas(){
        return ResponseEntity.ok(service.getEmpresas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empresa> buscarEmpresa(@PathVariable Integer id){
        return ResponseEntity.ok(service.getEmpresa(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletaEmpresa(@PathVariable Integer id){
        service.excluirEmpresa(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> atualizarEmpresa(@PathVariable Integer id, @RequestBody Empresa empresa){
        service.atualizarEmpresa(id, empresa);
        return ResponseEntity.ok().build();
    }
}
