package org.example.yogabusinessmanagementweb.authentication.repositories;

import org.example.yogabusinessmanagementweb.common.entities.Temp;
import org.example.yogabusinessmanagementweb.common.entities.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TempRepository extends JpaRepository<Temp, Long> {

}
