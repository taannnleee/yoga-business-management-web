import React, { useState, useEffect } from "react";
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
} from "react-native";
import AddressSelection from "./AddressSelection";
import { getJwt } from "@/jwt/get-jwt";
import { router } from "expo-router";

interface IProduct {
  id: string;
  title: string;
  quantity: number;
  price: number;
  currentVariant: any;
}

const Checkout: React.FC = () => {
  const [addressId, setAddressId] = useState<string>(""); // Store address ID
  const [paymentMethod, setPaymentMethod] = useState("cash");
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
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch cart");

      const data = await response.json();
      setProducts(
        data.data.cartItem.map((item: any) => ({
          id: item.product.id,
          title: item.product.title,
          quantity: item.quantity,
          price: item.product.price,
          currentVariant: item.currentVariant,
        })),
      );
      setTotalPrice(data.data.totalPrice);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentVNPay = async () => {
    const token = localStorage.getItem("accessToken");
    setOrderLoading(true);
    const orderData = {
      addressId,
      paymentMethod,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/payment/vn-pay?amount=${totalPrice}&bankCode=NCB`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        },
      );

      if (!response.ok) throw new Error("Failed to initiate VNPay payment");

      const data = await response.json();
      const paymentUrl = data.data.paymentUrl;
      setOrderLoading(false);
    } catch (error: any) {
      console.error("Error initiating VNPay payment:", error.message);
      setError(error.message);
      Alert.alert("Error", "Error initiating VNPay payment");
    }
  };

  const handleSubmit = async () => {
    if (paymentMethod === "vnpay") {
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

      if (!response.ok) throw new Error("Failed to create order");

      const data = await response.json();
      // Alert.alert('Success', 'Order placed successfully');
      setOrderLoading(false);
      setOpenConfirmDialog(false);
      router.replace("/(root)/(tabs)/activity");
    } catch (error: any) {
      console.error("Error creating order:", error.message);
      setError(error.message);
      Alert.alert("Error", "Error creating order");
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
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Checkout
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <View style={{ flex: 1, paddingRight: 20 }}>
          <AddressSelection
            selectedAddressId={addressId}
            setSelectedAddressId={setAddressId}
          />
          <View>
            <Text> Phương thức thanh toán</Text>
            <TouchableOpacity onPress={() => handlePaymentChange("creditCard")}>
              <Text style={{ fontSize: 18 }}>
                {paymentMethod === "creditCard" ? "✔ " : ""} Credit/Debit Card
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePaymentChange("vnpay")}>
              <Text style={{ fontSize: 18 }}>
                {paymentMethod === "vnpay" ? "✔ " : ""} VNPAY
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePaymentChange("paypal")}>
              <Text style={{ fontSize: 18 }}>
                {paymentMethod === "paypal" ? "✔ " : ""} PayPal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePaymentChange("cash")}>
              <Text style={{ fontSize: 18 }}>
                {paymentMethod === "cash" ? "✔ " : ""} Cash on Delivery (COD)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ padding: 20 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Order Summary
            </Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
              <Text>Error: {error}</Text>
            ) : products.length > 0 ? (
              <FlatList
                data={products}
                renderItem={({ item }) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <Text>
                      {item.title} (x{item.quantity})
                    </Text>
                    <Text>
                      {(item.price * item.quantity).toLocaleString()} VND
                    </Text>
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <Text>Cart is empty</Text>
            )}
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
              Total: {totalPrice.toLocaleString()} VND
            </Text>
            <Button
              title={orderLoading ? "Loading..." : "Place Order"}
              onPress={handleOpenConfirmDialog}
              disabled={orderLoading}
            />
          </View>
        </View>
      </View>

      <Modal
        visible={openConfirmDialog}
        onRequestClose={handleCloseConfirmDialog}
      >
        <View style={{ padding: 20 }}>
          <Text>Are you sure you want to place this order?</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Button title="Cancel" onPress={handleCloseConfirmDialog} />
            <Button
              title={orderLoading ? "Loading..." : "Place Order"}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Checkout;
