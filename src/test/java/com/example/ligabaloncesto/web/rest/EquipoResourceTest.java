package com.example.ligabaloncesto.web.rest;

import com.example.ligabaloncesto.Application;
import com.example.ligabaloncesto.domain.Equipo;
import com.example.ligabaloncesto.repository.EquipoRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import org.joda.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the EquipoResource REST controller.
 *
 * @see EquipoResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class EquipoResourceTest {

    private static final String DEFAULT_NOMBRE = "SAMPLE_TEXT";
    private static final String UPDATED_NOMBRE = "UPDATED_TEXT";

    private static final LocalDate DEFAULT_FECHA_CREACION = new LocalDate(0L);
    private static final LocalDate UPDATED_FECHA_CREACION = new LocalDate();
    private static final String DEFAULT_LOCALIDAD = "SAMPLE_TEXT";
    private static final String UPDATED_LOCALIDAD = "UPDATED_TEXT";

    @Inject
    private EquipoRepository equipoRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    private MockMvc restEquipoMockMvc;

    private Equipo equipo;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        EquipoResource equipoResource = new EquipoResource();
        ReflectionTestUtils.setField(equipoResource, "equipoRepository", equipoRepository);
        this.restEquipoMockMvc = MockMvcBuilders.standaloneSetup(equipoResource).setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        equipo = new Equipo();
        equipo.setNombre(DEFAULT_NOMBRE);
        equipo.setFechaCreacion(DEFAULT_FECHA_CREACION);
        equipo.setLocalidad(DEFAULT_LOCALIDAD);
    }

    @Test
    @Transactional
    public void createEquipo() throws Exception {
        int databaseSizeBeforeCreate = equipoRepository.findAll().size();

        // Create the Equipo

        restEquipoMockMvc.perform(post("/api/equipos")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(equipo)))
                .andExpect(status().isCreated());

        // Validate the Equipo in the database
        List<Equipo> equipos = equipoRepository.findAll();
        assertThat(equipos).hasSize(databaseSizeBeforeCreate + 1);
        Equipo testEquipo = equipos.get(equipos.size() - 1);
        assertThat(testEquipo.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testEquipo.getFechaCreacion()).isEqualTo(DEFAULT_FECHA_CREACION);
        assertThat(testEquipo.getLocalidad()).isEqualTo(DEFAULT_LOCALIDAD);
    }

    @Test
    @Transactional
    public void getAllEquipos() throws Exception {
        // Initialize the database
        equipoRepository.saveAndFlush(equipo);

        // Get all the equipos
        restEquipoMockMvc.perform(get("/api/equipos"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(equipo.getId().intValue())))
                .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE.toString())))
                .andExpect(jsonPath("$.[*].fechaCreacion").value(hasItem(DEFAULT_FECHA_CREACION.toString())))
                .andExpect(jsonPath("$.[*].localidad").value(hasItem(DEFAULT_LOCALIDAD.toString())));
    }

    @Test
    @Transactional
    public void getEquipo() throws Exception {
        // Initialize the database
        equipoRepository.saveAndFlush(equipo);

        // Get the equipo
        restEquipoMockMvc.perform(get("/api/equipos/{id}", equipo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(equipo.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE.toString()))
            .andExpect(jsonPath("$.fechaCreacion").value(DEFAULT_FECHA_CREACION.toString()))
            .andExpect(jsonPath("$.localidad").value(DEFAULT_LOCALIDAD.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingEquipo() throws Exception {
        // Get the equipo
        restEquipoMockMvc.perform(get("/api/equipos/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEquipo() throws Exception {
        // Initialize the database
        equipoRepository.saveAndFlush(equipo);

		int databaseSizeBeforeUpdate = equipoRepository.findAll().size();

        // Update the equipo
        equipo.setNombre(UPDATED_NOMBRE);
        equipo.setFechaCreacion(UPDATED_FECHA_CREACION);
        equipo.setLocalidad(UPDATED_LOCALIDAD);
        

        restEquipoMockMvc.perform(put("/api/equipos")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(equipo)))
                .andExpect(status().isOk());

        // Validate the Equipo in the database
        List<Equipo> equipos = equipoRepository.findAll();
        assertThat(equipos).hasSize(databaseSizeBeforeUpdate);
        Equipo testEquipo = equipos.get(equipos.size() - 1);
        assertThat(testEquipo.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testEquipo.getFechaCreacion()).isEqualTo(UPDATED_FECHA_CREACION);
        assertThat(testEquipo.getLocalidad()).isEqualTo(UPDATED_LOCALIDAD);
    }

    @Test
    @Transactional
    public void deleteEquipo() throws Exception {
        // Initialize the database
        equipoRepository.saveAndFlush(equipo);

		int databaseSizeBeforeDelete = equipoRepository.findAll().size();

        // Get the equipo
        restEquipoMockMvc.perform(delete("/api/equipos/{id}", equipo.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Equipo> equipos = equipoRepository.findAll();
        assertThat(equipos).hasSize(databaseSizeBeforeDelete - 1);
    }
}
