import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { getJwt } from "@/jwt/get-jwt";
import { BASE_URL } from "@/api/config";

const ShoppingCartPage = () => {
    const [carts, setCarts] = useState(null); // Giỏ hàng
    const [loading, setLoading] = useState(true); // Trạng thái đang tải
    const [error, setError] = useState(null); // Lỗi khi gọi API
    const navigation = useNavigation(); // Để sử dụng điều hướng

    // Hàm gọi API để lấy giỏ hàng
    const fetchCart = async () => {
        try {
            const token = await getJwt();
            const response = await fetch(`${BASE_URL}/api/cart/show-cart`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch cart");
            }

            const data = await response.json();
            const { totalPrice, totalItem, cartItem } = data.data;
            const formattedCartItems = cartItem.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                currentVariant: item.currentVariant,
                product: {
                    id: item.product.id,
                    title: item.product.title,
                    price: item.product.price,
                    variants: item.product.variants,
                    imagePath: item.product.imagePath,
                    subCategory: item.product.subCategory.name,
                },
            }));
            setCarts({ id: data.data.id, totalPrice, totalItem, cartItem: formattedCartItems });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Hàm xử lý khi xóa sản phẩm khỏi giỏ hàng
    const handleRemoveProduct = async (productId) => {
        setLoading(true);
        setError(null);

        try {
            const token = await getJwt();
            const response = await fetch(`${BASE_URL}/api/cart/remove-from-cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: productId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to remove product from cart");
            }

            const data = await response.json();
            console.log(data);
            fetchCart();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // API call for updating cart quantity (sử dụng hàm này để cập nhật số lượng sản phẩm)
    const updateCart = async (cartItemId, productId, newQuantity) => {
        const id = cartItemId;
        setLoading(true);
        setError(null);

        try {

            const token = await getJwt(); // Lấy token từ localStorage hoặc theo cách bạn lấy token
            const response = await fetch(`${BASE_URL}/api/cart/increase-to-cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id,  // ID của item trong giỏ hàng
                    productId,   // ID của sản phẩm
                    quantity: newQuantity, // Số lượng mới
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to increase product quantity");
            }

            const data = await response.json();
            console.log(data);
            fetchCart(); // Cập nhật giỏ hàng sau khi thay đổi
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Tính tổng tiền giỏ hàng
    const calculateTotalPrice = () => {
        return carts?.cartItem.reduce((total, item) => total + item.totalPrice, 0) ?? 0;
    };

    // Hàm xử lý khi chuyển đến trang thanh toán
    const handleCheckout = () => {
        Alert.alert("Thanh toán", "Bạn đã sẵn sàng để thanh toán.");
        navigation.navigate("Checkout"); // Điều hướng đến trang thanh toán
    };

    // Hàm để thay đổi số lượng sản phẩm trong giỏ hàng
    const handleChangeQuantity = (cartItemId, productId, action) => {
        if (carts) {
            const updatedCartItems = carts.cartItem.map(item => {
                let newQuantity = item.quantity;
                if (action === 'increase') {
                    newQuantity++;
                    updateCart(item.id, item.product.id, newQuantity); // Gọi API để cập nhật
                }
                if (action === 'decrease' && newQuantity > 1) {
                    newQuantity--;
                    updateCart(item.id, item.product.id, newQuantity); // Gọi API để cập nhật
                }
                return {
                    ...item,
                    quantity: newQuantity,
                    totalPrice: newQuantity * item.product.price, // Cập nhật lại giá sản phẩm
                };
            });

            setCarts({ ...carts, cartItem: updatedCartItems });
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Giỏ hàng của bạn</Text>

            {loading ? (
                <Text>Loading...</Text>
            ) : error ? (
                <Text>Error: {error}</Text>
            ) : carts && carts.cartItem.length > 0 ? (
                <FlatList
                    data={carts.cartItem}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.cartItem} key={item.id}>
                            <View style={styles.itemHeader}>
                                <View style={styles.productInfo}>
                                    <Text style={styles.productTitle}>{item.product.title}</Text>
                                    <Text style={styles.itemPrice}>Giá: {item.totalPrice.toLocaleString()} VND</Text>
                                </View>
                                <View style={styles.quantityControl}>
                                    <Text>Số lượng: </Text>
                                    <TouchableOpacity onPress={() => handleChangeQuantity(item.id, item.product.id, 'decrease')}>
                                        <Text style={styles.quantityButton}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.quantity}>{item.quantity}</Text>
                                    <TouchableOpacity onPress={() => handleChangeQuantity(item.id, item.product.id, 'increase')}>
                                        <Text style={styles.quantityButton}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.row}>
                                <Image source={{ uri: item.product.imagePath }} style={styles.itemImage} />
                                <View style={styles.details}>
                                    <Text>Danh mục: {item.product.subCategory}</Text>
                                    <View style={styles.variantContainer}>
                                        <Text style={styles.variantTitle}>Màu sắc: {item.currentVariant.color.value}</Text>
                                        <Text style={styles.variantTitle}>Size: {item.currentVariant.size.value}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => handleRemoveProduct(item.product.id)}  // Gọi hàm handleRemoveProduct và truyền productId
                                >
                                    <Text style={styles.removeButtonText}>Xóa</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    )}
                    ListEmptyComponent={<Text>Không có sản phẩm nào trong giỏ hàng</Text>}
                />
            ) : (
                <Text>Không có sản phẩm nào trong giỏ hàng</Text>
            )}

            {carts?.cartItem.length > 0 && (
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>
                        Tổng tiền thanh toán: {calculateTotalPrice().toLocaleString()} VND
                    </Text>
                    <Button title="Tiến hành thanh toán" onPress={handleCheckout} />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    cartItem: {
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "#ddd",
        backgroundColor: "#fff",
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productInfo: {
        flex: 1,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    itemPrice: {
        color: "green",
        fontWeight: "bold",
    },
    quantityControl: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantityButton: {
        fontSize: 18,
        fontWeight: "bold",
        padding: 10,
    },
    quantity: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    row: {
        flexDirection: "row",
        marginTop: 10,
        alignItems: "center",
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 16,
    },
    details: {
        flex: 1,
        justifyContent: "center",
    },
    variantContainer: {
        marginVertical: 8,
    },
    variantTitle: {
        fontSize: 14,
        color: "#333",
    },
    removeButton: {
        backgroundColor: "red",
        padding: 8,
        borderRadius: 5,
        marginLeft: 10,
    },
    removeButtonText: {
        color: "white",
        textAlign: "center",
    },
    totalContainer: {
        marginTop: 20,
        alignItems: "flex-end",
    },
    totalText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
});

export default ShoppingCartPage;
