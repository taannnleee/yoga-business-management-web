package org.example.yogabusinessmanagementweb.authentication.service.Impl;

import org.example.yogabusinessmanagementweb.authentication.repositories.AddressRepository;
import org.example.yogabusinessmanagementweb.authentication.service.AddressService;
import org.example.yogabusinessmanagementweb.common.entities.Address;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AddressServiceImpl implements AddressService {
    @Autowired
    AddressRepository addressRepository;

    @Override
    public Address findAddressByUser(User user) {
        Optional<Address> address =   addressRepository.findAddressByUser(user);
        if(address.isPresent()){
            return address.get();
        }
        return null;
    }
}
