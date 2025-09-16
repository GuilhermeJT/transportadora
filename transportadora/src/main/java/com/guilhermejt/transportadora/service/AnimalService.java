package com.guilhermejt.transportadora.service;


import com.guilhermejt.transportadora.model.Animal;
import com.guilhermejt.transportadora.repository.AnimalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnimalService {

    private final AnimalRepository repository;

    public AnimalService (AnimalRepository repository){
        this.repository = repository;
    }

    public void salvarAnimalNovo(Animal animal){
        repository.save(animal);
    }

    public List<Animal> getAnimais(){
        return repository.findAll();
    }

    public Animal buscarAnimal(Integer id){
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Usuario não encontrado"));
    }

    public void deletarAnimal(Integer id){
        repository.deleteById(id);
    }

    public void modificarAnimal(Integer id, Animal dadosNovos){
        Animal animal = buscarAnimal(id);

        if(dadosNovos.getNomeAnimal() != null){
            animal.setNomeAnimal(dadosNovos.getNomeAnimal());
        }

        repository.save(animal);
    }

}
