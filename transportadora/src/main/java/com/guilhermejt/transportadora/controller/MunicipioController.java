package com.guilhermejt.transportadora.controller;


import com.guilhermejt.transportadora.model.Municipio;
import com.guilhermejt.transportadora.service.MunipioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/municipio")
public class MunicipioController {
    private final MunipioService service;

    public MunicipioController(MunipioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> salvarMunicipio(@RequestBody Municipio municipio){
        service.salvarMunicipio(municipio);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Municipio>> buscarMunicipios(){
        return ResponseEntity.ok(service.buscarMunicipios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Municipio> buscarMunicipioId(@PathVariable Integer id){
        return  ResponseEntity.ok(service.buscarMunicipio(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMunicipio(@PathVariable Integer id){
        service.deletarMunicipio(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateMunicipio (@PathVariable Integer id, @RequestBody Municipio municipio){
        service.atualizarMunicipio(id, municipio);
        return ResponseEntity.ok().build();
    }
}
