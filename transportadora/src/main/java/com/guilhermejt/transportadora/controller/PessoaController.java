package com.guilhermejt.transportadora.controller;


import com.guilhermejt.transportadora.model.Pessoa;
import com.guilhermejt.transportadora.service.PessoaService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/usuario")
public class PessoaController {

    private final PessoaService service;

    public PessoaController(PessoaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> salvarUsuario (@RequestBody Pessoa pessoa){
        service.salvarUsuario(pessoa);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Pessoa>> getUsuarios(){
        return ResponseEntity.ok(service.buscarUsuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pessoa> buscarUsuario(@PathVariable Integer id){
        return ResponseEntity.ok(service.buscarUsuarioId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Integer id){
        service.deletarUsuario(id);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUsuario(@PathVariable Integer id, @RequestBody Pessoa pessoa){
        service.atualizarUsuario(id, pessoa);
        return ResponseEntity.ok().build();
    }
}
