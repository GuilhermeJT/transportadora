package com.guilhermejt.transportadora.controller;


import com.guilhermejt.transportadora.model.Despesa;
import com.guilhermejt.transportadora.service.DespesaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/despesa")
public class DespesaController {

    private final DespesaService service;

    public DespesaController(DespesaService service) {this.service = service;}

    @PostMapping
    public ResponseEntity<Void> salvarDespesa(@RequestBody Despesa despesa){
        service.saveDespesa(despesa);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Despesa> getDespesas(@PathVariable Integer id){
        return ResponseEntity.ok(service.getDespesa(id));
    }

    @GetMapping
    public ResponseEntity<List<Despesa>> getDespesa(){
        return ResponseEntity.ok(service.getDespesas());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDespesa(@PathVariable Integer id){
        service.deletarDespesa(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateDespesa(@PathVariable Integer id, @RequestBody Despesa despesa){
        service.updateDespesa(id, despesa);
        return ResponseEntity.ok().build();



    }


}
