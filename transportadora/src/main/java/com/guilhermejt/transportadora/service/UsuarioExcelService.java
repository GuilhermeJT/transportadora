package com.guilhermejt.transportadora.service;

import com.guilhermejt.transportadora.model.Usuario;
import com.guilhermejt.transportadora.repository.UsuarioRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class UsuarioExcelService {

    private final UsuarioRepository repository;

    public UsuarioExcelService(UsuarioRepository repository) {
        this.repository = repository;
    }


    public ByteArrayInputStream exportUsuarios() throws IOException {
        String[] colunas = {"ID", "Nome", "Senha"};

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Usuarios");

            // Cabeçalho
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < colunas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(colunas[i]);
            }

            // Dados
            List<Usuario> usuarios = repository.findAll();
            int rowIdx = 1;
            for (Usuario u : usuarios) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(u.getId());
                row.createCell(1).setCellValue(u.getNome());
                row.createCell(2).setCellValue(u.getPassword());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}

