package com.gameHub.app.presentation.controller;

import com.gameHub.app.presentation.dto.ClienteDto;
import com.gameHub.app.service.implementation.ClienteResponseDto;
import com.gameHub.app.service.interfaces.ClienteService;

import jakarta.validation.Valid;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/clientes")
public class ClienteController {

    private ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping("/{page}/{size}")
    public ResponseEntity<List<ClienteResponseDto>> getAllPageable(@PathVariable Integer page,
            @PathVariable Integer size) {

        Pageable pageable = PageRequest.of(page, size);

        return ResponseEntity.ok(clienteService.findAllPageable(pageable));
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponseDto>> getAll() {

        return ResponseEntity.ok(clienteService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDto> getById(@PathVariable Integer id) {

        ClienteResponseDto clienteDto = clienteService.findById(id).orElseThrow();
        return ResponseEntity.ok(clienteDto);

    }

    @PostMapping
    public ResponseEntity<ClienteResponseDto> create(@RequestBody @Valid ClienteDto clienteDto) {

        return new ResponseEntity<>(clienteService.save(clienteDto), HttpStatus.CREATED);

    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDto> update(@PathVariable Integer id,
            @RequestBody @Valid ClienteDto clienteDto) {

        ClienteResponseDto cliente = clienteService.findById(id).orElseThrow();

        clienteDto.setCedula(cliente.getCedula());

        return ResponseEntity.ok(clienteService.save(clienteDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {

        clienteService.delete(id);
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Cliente Id '" + id + "' eliminado con exito!");
        return ResponseEntity.ok(response);

    }
}
