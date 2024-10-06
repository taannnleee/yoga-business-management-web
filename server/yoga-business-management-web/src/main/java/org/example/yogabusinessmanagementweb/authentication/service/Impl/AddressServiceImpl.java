package org.example.yogabusinessmanagementweb.authentication.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.authentication.exception.AppException;
import org.example.yogabusinessmanagementweb.authentication.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.authentication.repositories.AddressRepository;
import org.example.yogabusinessmanagementweb.authentication.service.AddressService;
import org.example.yogabusinessmanagementweb.common.entities.Address;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class AddressServiceImpl implements AddressService {
//    AddressRepository addressRepository;
//
//    @Override
//    public Address findAddressByUser(User user) {
//        return addressRepository.findAddressByUser(user)
//                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
//    }
}
