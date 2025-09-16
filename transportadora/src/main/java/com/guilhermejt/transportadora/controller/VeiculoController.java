package com.guilhermejt.transportadora.controller;


import com.guilhermejt.transportadora.model.Veiculo;
import com.guilhermejt.transportadora.service.VeiculoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/veiculo")
public class VeiculoController {

    private final VeiculoService service;

    public VeiculoController(VeiculoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> salvarVeiculo(@RequestBody Veiculo veiculo){
        service.salvarVeiculo(veiculo);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Veiculo>> buscarVeiculos(){
        return ResponseEntity.ok(service.getVeiculos());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Veiculo> buscarVeiculo(@PathVariable Integer id){

        return ResponseEntity.ok(service.buscarVeiculo(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarVeiculo(@PathVariable Integer id){
        service.excluirVeiculo(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateVeiculo(@PathVariable Integer id, @RequestBody Veiculo veiculo){
        service.atualizarVeiculo(id, veiculo);
        return ResponseEntity.ok().build();
    }
}
