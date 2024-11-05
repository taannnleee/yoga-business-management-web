package org.example.yogabusinessmanagementweb.common.mapper;

import javax.annotation.processing.Generated;
import org.example.yogabusinessmanagementweb.common.entities.Address;
import org.example.yogabusinessmanagementweb.dto.request.address.AddressRequest;
import org.example.yogabusinessmanagementweb.dto.response.address.AddressResponse;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-11-04T11:30:36+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Oracle Corporation)"
)
@Component
public class AddressMapperImpl implements AddressMapper {

    @Override
    public AddressResponse toAddressResponse(Address address) {
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

    @Override
    public Address toAddress(AddressRequest address) {
        if ( address == null ) {
            return null;
        }

        Address.AddressBuilder address1 = Address.builder();

        address1.houseNumber( address.getHouseNumber() );
        address1.street( address.getStreet() );
        address1.district( address.getDistrict() );
        address1.city( address.getCity() );
        address1.nameDelivery( address.getNameDelivery() );
        address1.phoneNumberDelivery( address.getPhoneNumberDelivery() );

        return address1.build();
    }

    @Override
    public void updateAddress(Address address, AddressRequest addressRequest) {
        if ( addressRequest == null ) {
            return;
        }

        address.setHouseNumber( addressRequest.getHouseNumber() );
        address.setStreet( addressRequest.getStreet() );
        address.setDistrict( addressRequest.getDistrict() );
        address.setCity( addressRequest.getCity() );
        address.setNameDelivery( addressRequest.getNameDelivery() );
        address.setPhoneNumberDelivery( addressRequest.getPhoneNumberDelivery() );
    }
}
