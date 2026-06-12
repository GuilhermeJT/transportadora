package com.guilhermejt.transportadora.controller;


import com.guilhermejt.transportadora.model.Condicao;
import com.guilhermejt.transportadora.model.Despesa;
import com.guilhermejt.transportadora.service.CondicaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/condicao")
public class CondicaoController {

    private final CondicaoService service;

    public CondicaoController(CondicaoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> salvarCondicao(@RequestBody Condicao condicao){
        service.saveCondicao(condicao);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Condicao> getCondicao(@PathVariable Integer id){
        return ResponseEntity.ok(service.getCondicao(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCondicao(@PathVariable Integer id){
        service.deletarCondicao(id);
        return ResponseEntity.ok().build();
    }
}
