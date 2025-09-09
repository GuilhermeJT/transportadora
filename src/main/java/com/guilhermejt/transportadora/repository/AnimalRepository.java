package com.guilhermejt.transportadora.repository;

import com.guilhermejt.transportadora.model.Animal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnimalRepository extends JpaRepository<Animal, Integer> {
}
