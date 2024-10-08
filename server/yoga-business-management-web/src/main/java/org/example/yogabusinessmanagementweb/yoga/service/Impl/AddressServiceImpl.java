package org.example.yogabusinessmanagementweb.yoga.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.yoga.service.AddressService;
import org.springframework.stereotype.Service;

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
