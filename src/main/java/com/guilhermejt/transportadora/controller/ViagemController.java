package com.guilhermejt.transportadora.controller;


import com.guilhermejt.transportadora.model.Viagem;
import com.guilhermejt.transportadora.service.ViagemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/viagem")
public class ViagemController {
    private final ViagemService service;


    public ViagemController(ViagemService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Viagem> createViagem(@RequestBody Viagem viagem){
        Viagem via = service.saveViagem(viagem);
        return ResponseEntity.ok(via);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Viagem> getViagem(@PathVariable Integer id){
        return ResponseEntity.ok(service.getViagem(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteViagem(@PathVariable Integer id){
        service.deleteViagem(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Viagem> updateViagem(@PathVariable Integer id, @RequestBody Viagem dadosNovos){
        Viagem viagem = service.updateViagem(id, dadosNovos);
        return ResponseEntity.ok(viagem);
    }
}
