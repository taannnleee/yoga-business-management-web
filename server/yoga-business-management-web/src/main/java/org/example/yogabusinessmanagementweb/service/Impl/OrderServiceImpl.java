package org.example.yogabusinessmanagementweb.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.Enum.EPaymentStatus;
import org.example.yogabusinessmanagementweb.common.Enum.EStatusOrder;
import org.example.yogabusinessmanagementweb.common.mapper.GenericMapper;
import org.example.yogabusinessmanagementweb.common.mapper.OrderItemMapper;
import org.example.yogabusinessmanagementweb.common.mapper.OrderMapper;
import org.example.yogabusinessmanagementweb.common.util.JwtUtil;
import org.example.yogabusinessmanagementweb.dto.request.order.OrderCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.ListDto;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderCommentResponse;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderCreationResponse;
import org.example.yogabusinessmanagementweb.dto.response.order.OrderResponse;
import org.example.yogabusinessmanagementweb.dto.response.orderItem.OrderItemResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.CartItemRepository;
import org.example.yogabusinessmanagementweb.repositories.CartRepository;
import org.example.yogabusinessmanagementweb.repositories.OrderItemRepository;
import org.example.yogabusinessmanagementweb.repositories.OrderRepository;
import org.example.yogabusinessmanagementweb.service.*;
import org.example.yogabusinessmanagementweb.common.entities.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
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
    OrderItemRepository orderItemRepository;
    CommentService commentService;
    OrderItemMapper orderItemMapper;
    OrderMapper orderMapper;
    @Override
    public OrderResponse createOrder(HttpServletRequest request, OrderCreationRequest orderRequest) {

        User user = jwtUtil.getUserFromRequest(request);

        Optional<Cart> cartResponse = cartRepository.findCartByUser(user);

        if (!cartResponse.isPresent() ) {
            throw new AppException(ErrorCode.CART_NOT_FOUND);
        }

        Cart cart = cartResponse.get();

        // Tạo đối tượng Order
        Order order = new Order();
        order.setUser(user);
        order.setEStatusOrder(EStatusOrder.PROCESSING);
        order.setOrderItems(new ArrayList<>());

        // Chuyển đổi CartItem sang OrderItem
        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setCurrentVariant(cartItem.getCurrentVariant());
            orderItem.setTotalPrice(cartItem.getTotalPrice());

            // Thêm OrderItem vào danh sách Order
            order.getOrderItems().add(orderItem);

        }

        order.setTotalItem(cart.getTotalItem());
        order.setTotalPrice(cart.getTotalPrice());
        Address address = addressService.getAddressByid(String.valueOf(orderRequest.getAddressId()));

        order.setAddress(address);

        Payment payment = new Payment();
        payment.setNameMethod(orderRequest.getPaymentMethod());
        payment.setEPaymentStatus(EPaymentStatus.PAID);
        order.setPayment(payment);
        // Lưu Order và OrderItem vào cơ sở dữ liệu
        orderRepository.save(order);

        // Cập nhật giỏ hàng
        cart.setTotalItem(0);
        cart.setTotalPrice(BigDecimal.valueOf(0));

//        cartItemRepository.deleteAll(cart.getCartItems());  // Xóa tất cả CartItem trong giỏ hàng

        for (Iterator<CartItem> iterator = cart.getCartItems().iterator(); iterator.hasNext();) {
            CartItem cartItem = iterator.next();
            iterator.remove();  // Xóa phần tử hiện tại
            cartItemRepository.delete(cartItem);
        }
        cartRepository.save(cart);

        OrderResponse orderResponse =  orderMapper.toOrderResponse(order);
        orderResponse.setEPaymentStatus(payment.getEPaymentStatus());
        return orderResponse;
    }


    @Override
    public List<OrderResponse> showOrderOfUser(HttpServletRequest request) {
        List<OrderResponse> orderResponseList = new ArrayList<>();
        List<Order> list = orderRepository.findAll();
        for (Order order : list) {
            OrderResponse orderResponse = orderMapper.toOrderResponse(order);
            orderResponse.setEPaymentStatus(order.getPayment().getEPaymentStatus());
            orderResponseList.add(orderResponse);
        }
        return orderResponseList;
    }

    @Override
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        EStatusOrder statusEnum = EStatusOrder.valueOf(status);
        // Cập nhật trạng thái đơn hàng
        order.setEStatusOrder(statusEnum);
        return orderRepository.save(order);
    }

    @Override
    public ListDto<List<Order>> getAllOrderByStatus(HttpServletRequest request, String status, Pageable pageable) {
//        EStatusOrder statusEnum = EStatusOrder.valueOf(status);
        User user = jwtUtil.getUserFromRequest(request);
        Page<Order> listOrder;
        if("ALL".equals(status)){
            listOrder = orderRepository.findAllByUser(user, pageable);
        }
        else {
            listOrder= orderRepository.findAllByStatusAndUser(EStatusOrder.valueOf(status), user, pageable);
        }
        return GenericMapper.toListDto(listOrder.getContent(), listOrder);
    }

    public OrderItem findById(String id) {
        OrderItem orderItem = orderItemRepository.findById(Long.valueOf(id)).orElseThrow(
                () -> new AppException(ErrorCode.WISHLIST_NOT_FOUND)
        );
        return orderItem;
    }
    public OrderCommentResponse updateCommentInOrderItem(Long orderItemId, Long commentId) {
        // Fetch OrderItem by orderItemId
        OrderItem orderItem = findById(String.valueOf(orderItemId));
        Comment comment = commentService.findById(String.valueOf(commentId));
        // Update the OrderItem with the new Comment
        orderItem.setComment(comment);
        // Save the updated OrderItem
        return orderItemMapper.toOrderCommentResponse(orderItemRepository.save(orderItem));
    }


    public BigDecimal getTotalAmountByStatus(User user, EStatusOrder status) {
        // Lọc đơn hàng của user theo trạng thái và tính tổng giá trị
        List<Order> orders = orderRepository.findAllByStatusAndUser(status,user);
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (Order order : orders) {
            totalAmount = totalAmount.add(order.getTotalPrice());
        }

        return totalAmount;
    }

    public BigDecimal getTotalPendingAmount(User user) {
        return getTotalAmountByStatus(user, EStatusOrder.PROCESSING);
    }

    public BigDecimal getTotalShippingAmount(User user) {
        return getTotalAmountByStatus(user, EStatusOrder.DELIVERING);
    }

    public BigDecimal getTotalDeliveredAmount(User user) {
        return getTotalAmountByStatus(user, EStatusOrder.COMPLETED);
    }

    // Phương thức tính tổng số tiền của tất cả các trạng thái đơn hàng
    public BigDecimal getTotalAmountByUser(User user) {
        BigDecimal totalPending = getTotalPendingAmount(user);
        BigDecimal totalShipping = getTotalShippingAmount(user);
        BigDecimal totalDelivered = getTotalDeliveredAmount(user);

        return totalPending.add(totalShipping).add(totalDelivered);
    }
}
