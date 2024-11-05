package org.example.yogabusinessmanagementweb.common.mapper;

import javax.annotation.processing.Generated;
import org.example.yogabusinessmanagementweb.common.entities.Address;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.example.yogabusinessmanagementweb.dto.response.address.AddressResponse;
import org.example.yogabusinessmanagementweb.dto.response.checkout.UserAddressDefaultResponse;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-11-04T11:30:35+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserAddressDefaultResponse toUserAddressDefaultResponse(User user, Address address) {
        if ( user == null && address == null ) {
            return null;
        }

        UserAddressDefaultResponse userAddressDefaultResponse = new UserAddressDefaultResponse();

        if ( user != null ) {
            userAddressDefaultResponse.setPhone( user.getPhone() );
            userAddressDefaultResponse.setFullname( user.getFullname() );
        }
        userAddressDefaultResponse.setAddress( addressToAddressResponse( address ) );

        return userAddressDefaultResponse;
    }

    protected AddressResponse addressToAddressResponse(Address address) {
        if ( address == null ) {
            return null;
        }

        AddressResponse addressResponse = new AddressResponse();

        addressResponse.setId( address.getId() );
        addressResponse.setHouseNumber( address.getHouseNumber() );
        addressResponse.setStreet( address.getStreet() );
        addressResponse.setDistrict( address.getDistrict() );
        addressResponse.setCity( address.getCity() );
        addressResponse.setStatus( address.getStatus() );
        addressResponse.setNameDelivery( address.getNameDelivery() );
        addressResponse.setPhoneNumberDelivery( address.getPhoneNumberDelivery() );

        return addressResponse;
    }
}
