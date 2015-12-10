package com.example.ligabaloncesto.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.example.ligabaloncesto.domain.Equipo;
import com.example.ligabaloncesto.repository.EquipoRepository;
import com.example.ligabaloncesto.web.rest.util.HeaderUtil;
import com.example.ligabaloncesto.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * REST controller for managing Equipo.
 */
@RestController
@RequestMapping("/api")
public class EquipoResource {

    private final Logger log = LoggerFactory.getLogger(EquipoResource.class);

    @Inject
    private EquipoRepository equipoRepository;

    /**
     * POST  /equipos -> Create a new equipo.
     */
    @RequestMapping(value = "/equipos",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Equipo> create(@RequestBody Equipo equipo) throws URISyntaxException {
        log.debug("REST request to save Equipo : {}", equipo);
        if (equipo.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new equipo cannot already have an ID").body(null);
        }
        Equipo result = equipoRepository.save(equipo);
        return ResponseEntity.created(new URI("/api/equipos/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert("equipo", result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /equipos -> Updates an existing equipo.
     */
    @RequestMapping(value = "/equipos",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Equipo> update(@RequestBody Equipo equipo) throws URISyntaxException {
        log.debug("REST request to update Equipo : {}", equipo);
        if (equipo.getId() == null) {
            return create(equipo);
        }
        Equipo result = equipoRepository.save(equipo);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert("equipo", equipo.getId().toString()))
                .body(result);
    }

    /**
     * GET  /equipos -> get all the equipos.
     */
    @RequestMapping(value = "/equipos",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Equipo>> getAll(@RequestParam(value = "page" , required = false) Integer offset,
                                  @RequestParam(value = "per_page", required = false) Integer limit, @RequestParam(required = false) String filter)
        throws URISyntaxException {
        if ("jugador-is-null".equals(filter)) {
            log.debug("REST request to get all Equipos where jugador is null");
            return new ResponseEntity<>(StreamSupport
                .stream(equipoRepository.findAll().spliterator(), false)
                .filter(equipo -> equipo.getJugador() == null)
                .collect(Collectors.toList()), HttpStatus.OK);
        }
        
        Page<Equipo> page = equipoRepository.findAll(PaginationUtil.generatePageRequest(offset, limit));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/equipos", offset, limit);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /equipos/:id -> get the "id" equipo.
     */
    @RequestMapping(value = "/equipos/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Equipo> get(@PathVariable Long id) {
        log.debug("REST request to get Equipo : {}", id);
        return Optional.ofNullable(equipoRepository.findOne(id))
            .map(equipo -> new ResponseEntity<>(
                equipo,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /equipos/:id -> delete the "id" equipo.
     */
    @RequestMapping(value = "/equipos/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.debug("REST request to delete Equipo : {}", id);
        equipoRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("equipo", id.toString())).build();
    }
}
