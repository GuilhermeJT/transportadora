package com.guilhermejt.transportadora.controller;

import com.guilhermejt.transportadora.model.Animal;
import com.guilhermejt.transportadora.service.AnimalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/animal")
public class AnimalController {

    private final AnimalService service;

    public AnimalController(AnimalService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> salvarAnimal(@RequestBody Animal animalNovo){
        service.salvarAnimalNovo(animalNovo);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Animal>> getAnimais(){
        return ResponseEntity.ok(service.getAnimais());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Animal> buscarAnimalId(@PathVariable Integer id){
        return ResponseEntity.ok(service.buscarAnimal(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAnimal(@PathVariable Integer id){
        service.deletarAnimal(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateAnimal (@PathVariable Integer id, @RequestBody Animal dadosNovos){
        service.modificarAnimal(id, dadosNovos);
        return ResponseEntity.ok().build();
    }

}
