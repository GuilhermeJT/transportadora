package com.guilhermejt.transportadora.controller;


import com.guilhermejt.transportadora.model.Fazenda;
import com.guilhermejt.transportadora.service.FazendaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fazenda")
public class FazendaController {

    private final FazendaService service;

    public FazendaController(FazendaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Fazenda> createFazenda(@RequestBody Fazenda fazenda){
        Fazenda faz = service.saveFazenda(fazenda);
        return ResponseEntity.ok(faz);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fazenda> getFazenda(@PathVariable Integer id){
        return ResponseEntity.ok(service.getFazenda(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFazenda(@PathVariable Integer id){
        service.deleteFazenda(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fazenda> updateFazenda(@PathVariable Integer id, @RequestBody Fazenda dadosNovos){
        Fazenda faz = service.updateFazenda(id, dadosNovos);
        return ResponseEntity.ok(faz);
    }
}
