package org.example.yogabusinessmanagementweb.common.mapper;

import org.example.yogabusinessmanagementweb.common.entities.Address;
import org.example.yogabusinessmanagementweb.common.entities.CartItem;
import org.example.yogabusinessmanagementweb.dto.request.address.AddressRequest;
import org.example.yogabusinessmanagementweb.dto.request.cartitem.CartItemCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.address.AddressResponse;
import org.example.yogabusinessmanagementweb.dto.response.cartitem.CartItemResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CartItemMapper {
    CartItemResponse toCartItemResponse(CartItem cartItem);
    CartItem toCartItem(CartItemCreationRequest cartItemCreationRequest);

}
