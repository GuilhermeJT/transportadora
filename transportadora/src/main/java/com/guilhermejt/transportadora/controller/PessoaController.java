package com.guilhermejt.transportadora.controller;


import com.guilhermejt.transportadora.model.Pessoa;
import com.guilhermejt.transportadora.service.UsuarioExcelService;
import com.guilhermejt.transportadora.service.PessoaService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/usuario")
public class PessoaController {

    private final PessoaService service;
    private final UsuarioExcelService excelService;

    public PessoaController(PessoaService service, UsuarioExcelService excelService) {
        this.service = service;
        this.excelService = excelService;
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

    @GetMapping("/excel")
    public ResponseEntity<byte[]> exportUsuariosExcel() throws IOException {
        ByteArrayInputStream in = excelService.exportUsuarios();

        byte[] bytes = in.readAllBytes();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=usuarios.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(bytes);
    }
}
