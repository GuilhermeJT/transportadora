package com.guilhermejt.transportadora.controller;


import com.guilhermejt.transportadora.model.Usuario;
import com.guilhermejt.transportadora.service.UsuarioExcelService;
import com.guilhermejt.transportadora.service.UsuarioService;
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
public class UsuarioController {

    private final UsuarioService service;
    private final UsuarioExcelService excelService;

    public UsuarioController(UsuarioService service, UsuarioExcelService excelService) {
        this.service = service;
        this.excelService = excelService;
    }


    @PostMapping
    public ResponseEntity<Void> salvarUsuario (@RequestBody Usuario usuario){
        service.salvarUsuario(usuario);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> getUsuarios(){
        return ResponseEntity.ok(service.buscarUsuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarUsuario(@PathVariable Integer id){
        return ResponseEntity.ok(service.buscarUsuarioId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Integer id){
        service.deletarUsuario(id);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUsuario(@PathVariable Integer id, @RequestBody Usuario usuario){
        service.atualizarUsuario(id, usuario);
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
