package com.gameHub.app.presentation.controller;

import com.gameHub.app.persistence.entity.Transaccion;
import com.gameHub.app.presentation.dto.TransaccionRequestDto;
import com.gameHub.app.presentation.dto.TransaccionResponseDto;
import com.gameHub.app.service.exception.ResourceNotFoundException;
import com.gameHub.app.service.interfaces.ClienteService;
import com.gameHub.app.service.interfaces.TransaccionService;
import com.gameHub.app.presentation.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
// @CrossOrigin
@RequestMapping("/api/transacciones")
public class TransaccionController {

    private TransaccionService transaccionService;
    private ClienteService clienteService;

    public TransaccionController(TransaccionService transaccionService, ClienteService clienteService) {
        this.transaccionService = transaccionService;
        this.clienteService = clienteService;
    }

    @GetMapping
    public ResponseEntity<List<TransaccionResponseDto>> getAll() {

        return ResponseEntity.ok(transaccionService.findAll());
    }

    @GetMapping("/transjuegos")
    public ResponseEntity<List<Transaccion>> getAllWithTransjuego() {

        return ResponseEntity.ok(transaccionService.findAllWithTransJuego());
    }

    @GetMapping("/ordered")
    public ResponseEntity<List<TransaccionResponseDto>> getAllOrderByIdDesc() {

        return ResponseEntity.ok(transaccionService.findAllOrderByIdDesc());
    }

    @GetMapping("/cliente/{id}")
    public ResponseEntity<List<TransaccionResponseDto>> getByClienteId(@PathVariable Integer id) {

        clienteService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cliente", "Id", id));

        return ResponseEntity.ok(transaccionService.findByIdCliente(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransaccionResponseDto> getById(@PathVariable Integer id) {

        TransaccionResponseDto transaccionDto = transaccionService.findById(id).orElseThrow();
        return ResponseEntity.ok(transaccionDto);

    }

    @GetMapping("/total-active-transaccions")
    public ResponseEntity<ApiResponse<Long>> totalActiveAlquilerTransaccions() {

        Long total = transaccionService.totalActiveAlquilerTransaccions();
        ApiResponse<Long> response = new ApiResponse<>(
                "Total active alquiler transacciones retrieved successfully",
                total);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/total-sales-today")
    public ResponseEntity<ApiResponse<Long>> totalSalesToday() {

        Long total = transaccionService.totalSalesToday();
        ApiResponse<Long> response = new ApiResponse<>(
                "Total sales today retrieved successfully",
                total);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/type/{tipo}")
    public ResponseEntity<ApiResponse<?>> findByTipo(@PathVariable String tipo,
            @RequestParam(required = false) LocalDate fecha) {

        ApiResponse<List<TransaccionResponseDto>> response = new ApiResponse<>("Data retrieved seccessfully",
                transaccionService.findByTipo(tipo, fecha));

        return ResponseEntity.ok(response);

    }

    @GetMapping("/alquiler/{estado}")
    public ResponseEntity<ApiResponse<?>> findAlquilerByEstado(@PathVariable String estado,
            @RequestParam(required = false) LocalDate fecha) {

        ApiResponse<List<TransaccionResponseDto>> response = new ApiResponse<>("Data retrieved seccessfully",
                transaccionService.findAlquilerByEstado(estado, fecha));

        return ResponseEntity.ok(response);

    }

    @PostMapping
    public ResponseEntity<TransaccionResponseDto> create(@RequestBody @Valid TransaccionRequestDto transaccion) {

        return new ResponseEntity<>(transaccionService.save(transaccion), HttpStatus.CREATED);

    }

    @PutMapping("/{id}")
    public ResponseEntity<TransaccionResponseDto> update(@PathVariable Integer id,
            @RequestBody @Valid TransaccionRequestDto transaccionDto) {

        TransaccionResponseDto transaccion = transaccionService.findById(id).orElseThrow();

        transaccionDto.setId(transaccion.getId());

        return ResponseEntity.ok(transaccionService.save(transaccionDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {

        transaccionService.delete(id);
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Transaccion Id '" + id + "' eliminada con exito!");
        return ResponseEntity.ok(response);

    }
}
