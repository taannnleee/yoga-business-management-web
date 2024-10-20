package org.example.yogabusinessmanagementweb.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartItemResponse;
import org.example.yogabusinessmanagementweb.dto.request.cart.CartCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.CartItemRepository;
import org.example.yogabusinessmanagementweb.repositories.CartRepository;
import org.example.yogabusinessmanagementweb.service.CartService;
import org.example.yogabusinessmanagementweb.service.JwtService;
import org.example.yogabusinessmanagementweb.service.ProductService;
import org.example.yogabusinessmanagementweb.service.UserService;
import org.example.yogabusinessmanagementweb.common.Enum.ETokenType;
import org.example.yogabusinessmanagementweb.common.entities.Cart;
import org.example.yogabusinessmanagementweb.common.entities.CartItem;
import org.example.yogabusinessmanagementweb.common.entities.User;
import org.example.yogabusinessmanagementweb.common.mapper.Mappers;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class CartServiceImpl implements CartService {
    UserService userService;
    ProductService productService;
    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    JwtService jwtService;

    @Override
    public CartResponse addToCart(CartCreationRequest cartCreationRequest, HttpServletRequest request) {

        String authorizationHeader = request.getHeader("Authorization");
        String token = authorizationHeader.substring(7);

        // Giải mã token để lấy userId
        String userName = jwtService.extractUsername(token, ETokenType.ACCESSTOKEN);

        User user = userService.findUserByUserName(userName);
        Optional<Cart> cartResponse = cartRepository.findCartByUser(user);
        Cart cart = cartResponse.get();

        // Kiểm tra xem sản phẩm đã có trong cart chưa
        CartItem existingItem = null;

        for (CartItem item : cart.getCartItems()) {
            if (item.getProduct().getId().equals(Long.parseLong(cartCreationRequest.getProductId()))) {
                existingItem = item;
                break;
            }
        }

        if (existingItem != null) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng
            existingItem.setQuantity(existingItem.getQuantity() + cartCreationRequest.getQuantity());

            BigDecimal price = existingItem.getProduct().getPrice(); // Giá sản phẩm
            int quantity = existingItem.getQuantity();

            BigDecimal totalPrice = price.multiply(BigDecimal.valueOf(quantity));
            existingItem.setTotalPrice(totalPrice);
        } else {
            // Nếu sản phẩm chưa tồn tại, tạo CartItem mới
            CartItem newItem = new CartItem();
            newItem.setProduct(productService.getProductById(cartCreationRequest.getProductId())); // Tìm sản phẩm
            newItem.setQuantity(1);
            newItem.setTotalPrice(newItem.getProduct().getPrice());

            // Thêm CartItem vào cart
            cart.getCartItems().add(newItem);
        }

        // Cập nhật tổng số mặt hàng và tổng giá
        cart.setTotalItem(cart.getCartItems().size());

        BigDecimal totalPrice = BigDecimal.ZERO;
        for (CartItem item : cart.getCartItems()) {
            totalPrice = totalPrice.add(item.getTotalPrice());
        }
        cart.setTotalPrice(totalPrice);

        // Lưu lại cart
        cartRepository.save(cart);
        // Trả về response
        List<CartItemResponse> itemDTOS = Mappers.mapperEntityToDto(cart.getCartItems(), CartItemResponse.class);

        CartResponse response  = Mappers.convertToDto(cart, CartResponse.class);
        response.setCartItem(itemDTOS);
        return response;
    }

    @Override
    public CartResponse showCart(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        String token = authorizationHeader.substring(7);

        // Giải mã token để lấy userId
        String userName = jwtService.extractUsername(token, ETokenType.ACCESSTOKEN);

        User user = userService.findUserByUserName(userName);
        Optional<Cart> cartOptional = cartRepository.findCartByUser(user);


        // Nếu không tìm thấy giỏ hàng, có thể trả về null hoặc một thông điệp lỗi tùy theo yêu cầu
        if (cartOptional.isEmpty()) {
            throw new AppException(ErrorCode.CART_NOT_FOUND);
        }

        Cart cart = cartOptional.get();

        List<CartItemResponse> itemDTOS = Mappers.mapperEntityToDto(cart.getCartItems(), CartItemResponse.class);

        CartResponse response  = Mappers.convertToDto(cart, CartResponse.class);
        response.setCartItem(itemDTOS);
        return response;
    }


    @Override
    public CartResponse removeFromCart(CartCreationRequest cartCreationRequest) {
        return null;
    }

    @Override
    public CartResponse subtractFromCartItem(CartCreationRequest cartCreationRequest,HttpServletRequest request) {

        String authorizationHeader = request.getHeader("Authorization");
        String token = authorizationHeader.substring(7);

        // Giải mã token để lấy userId
        String userName = jwtService.extractUsername(token, ETokenType.ACCESSTOKEN);

        User user = userService.findUserByUserName(userName);
        Optional<Cart> cartResponse = cartRepository.findCartByUser(user);
        Cart cart = cartResponse.get();

        // Kiểm tra xem sản phẩm đã có trong cart chưa
        CartItem existingItem = null;

        for (CartItem item : cart.getCartItems()) {
            if (item.getProduct().getId().equals(Long.parseLong(cartCreationRequest.getProductId()))) {
                existingItem = item;
                break;
            }
        }

        if (existingItem != null) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng
            existingItem.setQuantity(cartCreationRequest.getQuantity());

            BigDecimal price = existingItem.getProduct().getPrice(); // Giá sản phẩm
            int quantity = existingItem.getQuantity();

            BigDecimal totalPrice = price.multiply(BigDecimal.valueOf(quantity));
            existingItem.setTotalPrice(totalPrice);
        } else {
            // Nếu sản phẩm chưa tồn tại, tạo CartItem mới
            CartItem newItem = new CartItem();
            newItem.setProduct(productService.getProductById(cartCreationRequest.getProductId())); // Tìm sản phẩm
            newItem.setQuantity(1);
            newItem.setTotalPrice(newItem.getProduct().getPrice());

            // Thêm CartItem vào cart
            cart.getCartItems().add(newItem);
        }

        // Cập nhật tổng số mặt hàng và tổng giá
        cart.setTotalItem(cart.getCartItems().size());

        BigDecimal totalPrice = BigDecimal.ZERO;
        for (CartItem item : cart.getCartItems()) {
            totalPrice = totalPrice.add(item.getTotalPrice());
        }
        cart.setTotalPrice(totalPrice);

        // Lưu lại cart
        cartRepository.save(cart);
        // Trả về response
        List<CartItemResponse> itemDTOS = Mappers.mapperEntityToDto(cart.getCartItems(), CartItemResponse.class);

        CartResponse response  = Mappers.convertToDto(cart, CartResponse.class);
        response.setCartItem(itemDTOS);
        return response;
    }
//
//    @Override
//    public CartResponse removeFromCart(CartCreationRequest cartCreationRequest) {
//        User user = userService.findUserById(cartCreationRequest.getUserId());
//        Optional<Cart> cartResponse = cartRepository.findCartByUser(user);
//
//        // Kiểm tra xem cart có tồn tại không
//        Cart cart;
//        if (cartResponse.isEmpty()) {
//            // Tạo mới nếu không có cart
//            cart = new Cart();
//            cart.setUser(user);
//            cart.setCartItems(new ArrayList<>());
//            cartRepository.save(cart);
//        } else {
//            // Sử dụng cart đã tồn tại
//            cart = cartResponse.get();
//        }
//
//        // Kiểm tra xem sản phẩm đã có trong cart chưa
//        CartItem existingItem = null;
//
//        for (CartItem item : cart.getCartItems()) {
//            if (item.getProduct().getId().equals(Long.parseLong(cartCreationRequest.getProductId()))) {
//                existingItem = item;
//                break;
//            }
//        }
//
//        if (existingItem != null) {
//            cart.getCartItems().remove(existingItem);
//            cartItemRepository.delete(existingItem);
//
//            // Cập nhật tổng số mặt hàng và tổng giá
//            cart.setTotalItem(cart.getCartItems().size());
//
//            BigDecimal totalPrice = BigDecimal.ZERO;
//            for (CartItem item : cart.getCartItems()) {
//                totalPrice = totalPrice.add(item.getTotalPrice());
//            }
//            cart.setTotalPrice(totalPrice);
//            cartRepository.save(cart);
//
//            List<CartItemDTO> itemDTOS = Mappers.mapperEntityToDto(cart.getCartItems(), CartItemDTO.class);
//
//            CartResponse response  = Mappers.convertToDto(cart, CartResponse.class);
//            response.setCartItem(itemDTOS);
//            return response;
//        }else {
//            throw new AppException(ErrorCode.PRODUCT_NOT_EXISTS);
//        }
//    }
}
