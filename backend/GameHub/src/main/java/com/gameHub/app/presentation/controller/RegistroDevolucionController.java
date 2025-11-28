package com.gameHub.app.presentation.controller;

import com.gameHub.app.presentation.dto.RegistroDevolucionDto;
import com.gameHub.app.service.exception.ResourceNotFoundException;
import com.gameHub.app.service.interfaces.RegistroDevolucionService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
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
    public ResponseEntity<Page<RegistroDevolucionDto>> getAll(
            @RequestParam(required = false) String cedula,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            @PageableDefault(page = 0, size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable

    ) {

        Page<RegistroDevolucionDto> resultados = registroDevolucionService.findAll(cedula, fromDate, toDate, pageable);
        return ResponseEntity.ok(resultados);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroDevolucionDto> getById(@PathVariable Integer id) {

        RegistroDevolucionDto registroDevolucionDto = registroDevolucionService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro devolucion", "Id", id));
        return ResponseEntity.ok(registroDevolucionDto);

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
