package org.example.yogabusinessmanagementweb.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.mapper.Mappers;
import org.example.yogabusinessmanagementweb.common.util.JwtUtil;
import org.example.yogabusinessmanagementweb.dto.request.order.OrderCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartItemResponse;
import org.example.yogabusinessmanagementweb.dto.response.cart.CartResponse;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderCreationResponse;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.AddressRepository;
import org.example.yogabusinessmanagementweb.repositories.CartItemRepository;
import org.example.yogabusinessmanagementweb.repositories.CartRepository;
import org.example.yogabusinessmanagementweb.repositories.OrderRepository;
import org.example.yogabusinessmanagementweb.service.AddressService;
import org.example.yogabusinessmanagementweb.service.OrderService;
import org.example.yogabusinessmanagementweb.service.ProductService;
import org.example.yogabusinessmanagementweb.service.UserService;
import org.example.yogabusinessmanagementweb.common.entities.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class OrderServiceImpl implements OrderService {
    JwtUtil jwtUtil;
    UserService userService;
    ProductService productService;
    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    OrderRepository orderRepository;
    AddressService addressService;

    @Override
    public OrderCreationResponse createOrder(HttpServletRequest request, OrderCreationRequest orderRequest) {

        User user = jwtUtil.getUserFromRequest(request);

        Optional<Cart> cartResponse = cartRepository.findCartByUser(user);

        if (!cartResponse.isPresent() ) {
            throw new AppException(ErrorCode.CART_NOT_FOUND);
        }
        if(cartResponse.get().getCartItems().isEmpty()){
            throw new AppException(ErrorCode.CART_ITEM_EMPTY);
        }
        Cart cart = cartResponse.get();

        // Tạo đối tượng Order
        Order order = new Order();
        order.setUser(user);
        order.setOrderItems(new ArrayList<>());

        // Chuyển đổi CartItem sang OrderItem
        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());

            // Thêm OrderItem vào danh sách Order
            order.getOrderItems().add(orderItem);

        }

        order.setTotalItem(cart.getTotalItem());
        order.setTotalPrice(cart.getTotalPrice());
        order.setAddress(addressService.getAddressByid(String.valueOf(orderRequest.getShippingInfo().getAddress().getId())));

        Payment payment = new Payment();
        payment.setNameMethod(orderRequest.getPaymentMethod());
        List<Payment> payments = new ArrayList<>();
        payments.add(payment);
        order.setPayment(payments);
        // Lưu Order và OrderItem vào cơ sở dữ liệu
        orderRepository.save(order);

        // Cập nhật giỏ hàng
        cart.setTotalItem(0);
        cart.setTotalPrice(BigDecimal.valueOf(0));


        // Xóa các item trong cart
        cart.getCartItems().clear();

        //lưu cart và cart item sẽ tự lưu
        cartRepository.save(cart);

        OrderCreationResponse orderCreationResponse = new OrderCreationResponse();
        return orderCreationResponse;
    }

    @Override
    public OrderResponse showOrder(HttpServletRequest request) {
        User user = jwtUtil.getUserFromRequest(request);
        Optional<Cart> cartOptional = cartRepository.findCartByUser(user);


        // Nếu không tìm thấy giỏ hàng, có thể trả về null hoặc một thông điệp lỗi tùy theo yêu cầu
        if (cartOptional.isEmpty()) {
            throw new AppException(ErrorCode.CART_NOT_FOUND);
        }

        Cart cart = cartOptional.get();

        List<CartItemResponse> itemDTOS = Mappers.mapperEntityToDto(cart.getCartItems(), CartItemResponse.class);

        CartResponse response  = Mappers.convertToDto(cart, CartResponse.class);
        response.setCartItem(itemDTOS);
//        return response;
        OrderResponse cartResponse = new OrderResponse();
        return  cartResponse;
    }
}
