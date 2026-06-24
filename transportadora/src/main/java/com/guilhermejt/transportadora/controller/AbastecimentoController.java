package com.guilhermejt.transportadora.controller;


import com.guilhermejt.transportadora.model.Abastecimento;
import com.guilhermejt.transportadora.service.AbastecimentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

import java.util.List;

@RestController
@RequestMapping("/abastecimento")
public class AbastecimentoController {

    private final AbastecimentoService service;

    public AbastecimentoController(AbastecimentoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> createAbastecimento(@RequestBody Abastecimento abastetimento){
        service.saveAbastecimento(abastetimento);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Abastecimento>> buscarAbastecimentos(){
        return ResponseEntity.ok(service.getAbastecimentos());
    }

    @GetMapping("/filtro")
    public ResponseEntity<List<Abastecimento>> filtroAbastecimentos(
            @RequestParam LocalDate inicio,
            @RequestParam LocalDate fim,
            @RequestParam(required = false) String placa){
        return ResponseEntity.ok(service.filtroAbastecimentos(inicio, fim, placa));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Abastecimento> buscarAbastecimento(@PathVariable Integer id){
        return  ResponseEntity.ok(service.getAbastecimento(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarVeiculo(@PathVariable Integer id){
        service.deleteAbastecimento(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateVeiculo(@PathVariable Integer id, @RequestBody Abastecimento abastecimento){
        service.updateAbastecimento(id, abastecimento);
        return ResponseEntity.ok().build();
    }
}
