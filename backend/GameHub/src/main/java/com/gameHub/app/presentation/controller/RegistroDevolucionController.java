package com.gameHub.app.presentation.controller;

import com.gameHub.app.presentation.dto.RegistroDevolucionDto;
import com.gameHub.app.service.exception.ResourceNotFoundException;
import com.gameHub.app.service.interfaces.RegistroDevolucionService;

import jakarta.validation.Valid;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/registro-devoluciones")
public class RegistroDevolucionController {

    private RegistroDevolucionService registroDevolucionService;

    public RegistroDevolucionController(RegistroDevolucionService registroDevolucionService) {
        this.registroDevolucionService = registroDevolucionService;
    }

    @GetMapping
    public ResponseEntity<List<RegistroDevolucionDto>> getAll() {

        return ResponseEntity.ok(registroDevolucionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroDevolucionDto> getById(@PathVariable Integer id) {

        RegistroDevolucionDto registroDevolucionDto = registroDevolucionService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro devolucion", "Id", id));
        return ResponseEntity.ok(registroDevolucionDto);

    }

    @GetMapping("/filter")
    public ResponseEntity<List<RegistroDevolucionDto>> filtrar(@RequestParam String cedula,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {

        List<RegistroDevolucionDto> resultados = registroDevolucionService.filtrar(cedula, fromDate, toDate);

        return ResponseEntity.ok(resultados);
    }

    @PostMapping
    public ResponseEntity<RegistroDevolucionDto> create(
            @RequestBody @Valid RegistroDevolucionDto registroDevolucionDto) {

        return new ResponseEntity<>(registroDevolucionService.save(registroDevolucionDto), HttpStatus.CREATED);

    }

    @PutMapping("/{id}")
    public ResponseEntity<RegistroDevolucionDto> update(@PathVariable Integer id,
            @RequestBody @Valid RegistroDevolucionDto reg) {

        RegistroDevolucionDto registroDevolucionDto = registroDevolucionService.findById(id).orElseThrow();

        reg.setId(registroDevolucionDto.getId());

        return ResponseEntity.ok(registroDevolucionService.save(reg));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {

        registroDevolucionService.delete(id);
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Resgistro devolucion Id '" + id + "' eliminado con exito!");
        return ResponseEntity.ok(response);

    }
}
