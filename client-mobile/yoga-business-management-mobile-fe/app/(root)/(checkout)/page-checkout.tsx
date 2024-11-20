import React, { useState, useEffect } from 'react';

import { BASE_URL } from "@/api/config";
import {
    Alert,
    RadioButton,
    Button,
    Modal,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import AddressSelection from './AddressSelection';
import { getJwt } from "@/jwt/get-jwt";
import { router } from 'expo-router';

interface IProduct {
    id: string;
    title: string;
    quantity: number;
    price: number;
    currentVariant: any;
}

const Checkout: React.FC = () => {
    const [addressId, setAddressId] = useState<string>(''); // Store address ID
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [products, setProducts] = useState<IProduct[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false); // Loading state when placing an order

    const handlePaymentChange = (value: string) => {
        setPaymentMethod(value);
    };

    const fetchCart = async () => {
        try {
            const token = await getJwt();
            const response = await fetch(`${BASE_URL}/api/cart/show-cart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) throw new Error('Failed to fetch cart');

            const data = await response.json();
            setProducts(
                data.data.cartItem.map((item: any) => ({
                    id: item.product.id,
                    title: item.product.title,
                    quantity: item.quantity,
                    price: item.product.price,
                    currentVariant: item.currentVariant,
                }))
            );
            setTotalPrice(data.data.totalPrice);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentVNPay = async () => {
        const token = localStorage.getItem('accessToken');
        setOrderLoading(true);
        const orderData = {
            addressId,
            paymentMethod,
        };

        try {
            const response = await fetch(`http://localhost:8080/api/payment/vn-pay?amount=${totalPrice}&bankCode=NCB`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) throw new Error('Failed to initiate VNPay payment');

            const data = await response.json();
            const paymentUrl = data.data.paymentUrl;
            setOrderLoading(false);

        } catch (error: any) {
            console.error('Error initiating VNPay payment:', error.message);
            setError(error.message);
            Alert.alert('Error', 'Error initiating VNPay payment');
        }
    };

    const handleSubmit = async () => {
        if (paymentMethod === 'vnpay') {
            await handlePaymentVNPay();
        } else {
            await createOrder();
        }
    };

    const createOrder = async () => {
        const token = await getJwt();
        setOrderLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/order/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    addressId,
                    paymentMethod,
                    products: products.map((product) => ({
                        id: product.id,
                        quantity: product.quantity,
                        variant: product.currentVariant,
                    })),
                }),
            });

            if (!response.ok) throw new Error('Failed to create order');

            const data = await response.json();
            setOrderLoading(false);
            setOpenConfirmDialog(false);
            router.replace("/(root)/(tabs)/activity");
        } catch (error: any) {
            console.error('Error creating order:', error.message);
            setError(error.message);
            Alert.alert('Error', 'Error creating order');
        } finally {
            setOrderLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleOpenConfirmDialog = () => setOpenConfirmDialog(true);
    const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Checkout</Text>
            <View style={styles.checkoutContainer}>
                <View style={styles.leftSection}>
                    <AddressSelection selectedAddressId={addressId} setSelectedAddressId={setAddressId} />
                    <View style={styles.paymentMethodContainer}>
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                        {['creditCard', 'vnpay', 'paypal', 'cash'].map(method => (
                            <TouchableOpacity
                                key={method}
                                style={styles.paymentOption}
                                onPress={() => handlePaymentChange(method)}
                            >
                                <Text style={styles.paymentText}>
                                    {paymentMethod === method ? '✔ ' : ''} {method === 'creditCard' ? 'Credit/Debit Card' : method === 'vnpay' ? 'VNPAY' : method === 'paypal' ? 'PayPal' : 'Cash on Delivery (COD)'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.rightSection}>
                    <View style={styles.orderSummary}>
                        <Text style={styles.orderSummaryTitle}>Order Summary</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : error ? (
                            <Text style={styles.errorText}>Error: {error}</Text>
                        ) : products.length > 0 ? (
                            <FlatList
                                data={products}
                                renderItem={({ item }) => (
                                    <View style={styles.productItem}>
                                        <Text>{item.title} (x{item.quantity})</Text>
                                        <Text>{(item.price * item.quantity).toLocaleString()} VND</Text>
                                    </View>
                                )}
                                keyExtractor={(item) => item.id}
                            />
                        ) : (
                            <Text style={styles.emptyCartText}>Cart is empty</Text>
                        )}
                        <Text style={styles.totalPrice}>
                            Total: {totalPrice.toLocaleString()} VND
                        </Text>
                        <TouchableOpacity
                            onPress={handleOpenConfirmDialog}
                            disabled={orderLoading}
                            style={styles.placeOrderButton}
                        >
                            <Text style={styles.placeOrderButtonText}>
                                {orderLoading ? 'Loading...' : 'Place Order'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Modal visible={openConfirmDialog} onRequestClose={handleCloseConfirmDialog}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Are you sure you want to place this order?</Text>
                    <View style={styles.modalActions}>
                        {/* Cancel Button */}
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]} // Kết hợp các style của Cancel button
                            onPress={handleCloseConfirmDialog}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        {/* Place Order Button */}
                        <TouchableOpacity
                            style={[styles.modalButton, styles.placeOrderButton]} // Kết hợp các style của Place Order button
                            onPress={handleSubmit}
                            disabled={orderLoading}
                        >
                            <Text style={styles.placeOrderButtonText}>
                                {orderLoading ? 'Loading...' : 'Place Order'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    checkoutContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftSection: {
        flex: 1,
        paddingRight: 15,
    },
    rightSection: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    paymentMethodContainer: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    paymentOption: {
        marginBottom: 15,
    },
    paymentText: {
        fontSize: 16,
        color: '#555',
    },
    orderSummary: {
        marginTop: 20,
    },
    orderSummaryTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    emptyCartText: {
        fontSize: 18,
        fontStyle: 'italic',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
    },
    modalContent: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    removeButton: {
        marginTop: 8,
        backgroundColor: "#d32f2f",
        paddingVertical: 5, // Reduced vertical padding for the button to make it shorter
        paddingHorizontal: 10, // Reduced horizontal padding for the button to make it narrower
        width: 100, // Set a fixed width for the button
        alignSelf: "flex-start", // Align the button to the left (or wherever you want)
    },
    removeButtonText: {
        fontSize: 12, // Smaller font size for the button text
    },
    placeOrderButton: {
        backgroundColor: '#4CAF50', // Màu xanh lá cây sáng
        paddingVertical: 12, // Tăng chiều cao để nút dễ nhấn
        paddingHorizontal: 25, // Tăng chiều rộng để chữ rõ ràng
        borderRadius: 8, // Bo góc để tạo cảm giác mềm mại
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3, // Tạo bóng đổ nhẹ dưới nút
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        marginTop: 20, // Đặt khoảng cách phía trên
        width: '100%', // Đảm bảo nút chiếm hết chiều rộng container (có thể điều chỉnh nếu cần)
    },
    placeOrderButtonText: {
        color: '#fff', // Màu chữ trắng
        fontSize: 18, // Kích thước chữ lớn hơn cho dễ đọc
        fontWeight: 'bold', // Chữ đậm để dễ nhận diện
    },
    modalContent: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center', // Đảm bảo văn bản ở giữa
    },
    // ... Các style khác
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Đặt các nút cách nhau
        width: '100%', // Đảm bảo cả hai nút không bị co lại
    },
    modalButton: {
        paddingVertical: 12, // Tăng chiều cao của nút
        paddingHorizontal: 25, // Tăng chiều rộng của nút
        borderRadius: 8, // Bo góc nút để mềm mại hơn
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1, // Đảm bảo cả hai nút có cùng chiều rộng
        marginHorizontal: 5, // Khoảng cách giữa các nút
        elevation: 3, // Tạo bóng đổ nhẹ dưới nút
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    // Nút Cancel
    cancelButton: {
        backgroundColor: '#d32f2f', // Màu đỏ cho nút Cancel
    },
    cancelButtonText: {
        color: '#fff', // Chữ trắng cho nút Cancel
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // Nút Place Order
    placeOrderButton: {
        backgroundColor: '#4CAF50', // Màu xanh cho nút Place Order
    },
    placeOrderButtonText: {
        color: '#fff', // Chữ trắng cho nút Place Order
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Checkout;
