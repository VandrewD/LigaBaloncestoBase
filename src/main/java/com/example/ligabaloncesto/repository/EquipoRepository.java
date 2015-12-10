package com.example.ligabaloncesto.repository;

import com.example.ligabaloncesto.domain.Equipo;
import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Equipo entity.
 */
public interface EquipoRepository extends JpaRepository<Equipo,Long> {

}
