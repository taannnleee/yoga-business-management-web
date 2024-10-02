package org.example.yogabusinessmanagementweb.authentication.repositories;

import org.example.yogabusinessmanagementweb.common.entities.HealthyInformation;
import org.example.yogabusinessmanagementweb.common.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
}
