package org.example.yogabusinessmanagementweb.authentication.service.Impl;

import org.example.yogabusinessmanagementweb.authentication.dto.request.order.OrderCreationRequest;
import org.example.yogabusinessmanagementweb.authentication.dto.response.order.OrderCreationResponse;
import org.example.yogabusinessmanagementweb.authentication.exception.AppException;
import org.example.yogabusinessmanagementweb.authentication.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.authentication.repositories.CartItemRepository;
import org.example.yogabusinessmanagementweb.authentication.repositories.CartRepository;
import org.example.yogabusinessmanagementweb.authentication.repositories.OrderRepository;
import org.example.yogabusinessmanagementweb.authentication.service.OrderService;
import org.example.yogabusinessmanagementweb.authentication.service.ProductService;
import org.example.yogabusinessmanagementweb.authentication.service.UserService;
import org.example.yogabusinessmanagementweb.common.entities.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {
    UserService userService;
    ProductService productService;
    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    OrderRepository orderRepository;

    @Override
    public OrderCreationResponse createOrder(OrderCreationRequest orderCreationRequest) {
        User user = userService.findUserById(orderCreationRequest.getUserId());

        Optional<Cart> cartResponse = cartRepository.findCartByUser(user);

        if (!cartResponse.isPresent() || cartResponse.get().getCartItems().isEmpty()) {
            throw new AppException(ErrorCode.CART_NOT_FOUND);
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

        // Lưu Order và OrderItem vào cơ sở dữ liệu
        orderRepository.save(order);

        // Cập nhật giỏ hàng
        cart.setTotalItem(0);
        cart.setTotalPrice(BigDecimal.valueOf(0.0));
        cartRepository.save(cart);

        // Xóa các item trong cart (nếu cần)
        cartItemRepository.deleteAll(cart.getCartItems());

        OrderCreationResponse orderCreationResponse = new OrderCreationResponse();
        return orderCreationResponse;
    }
}
