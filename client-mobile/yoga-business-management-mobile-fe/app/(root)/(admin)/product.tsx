import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import { addProduct } from "@/api/product";
import { getJwt } from "@/jwt/get-jwt";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    image: "", // Bạn có thể thêm trường hình ảnh nếu cần
  });

  const handleSave = async () => {
    const token = await getJwt();
    if (!token) {
      Alert.alert("Error", "Token not found!");
      return;
    }

    // const response = await addProduct(token, productData);
    // if (response.success) {
    //     Alert.alert("Success", "Product added successfully");

    //     setProductData({ title: "", description: "", price: "", image: "" });
    // } else {
    //     Alert.alert("Error", response.error || "Failed to add product");
    // }
  };

  return (
    <View style={styles.container}>
      <View style={styles.productContainer}>
        <Text style={styles.label}>Title:</Text>
        <TextInput
          style={styles.input}
          value={productData.title}
          onChangeText={(text) =>
            setProductData({ ...productData, title: text })
          }
        />

        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          value={productData.description}
          onChangeText={(text) =>
            setProductData({ ...productData, description: text })
          }
        />

        <Text style={styles.label}>Price:</Text>
        <TextInput
          style={styles.input}
          value={productData.price}
          keyboardType="numeric" // Chỉ cho phép nhập số
          onChangeText={(text) =>
            setProductData({ ...productData, price: text })
          }
        />

        <Text style={styles.label}>Image URL:</Text>
        <TextInput
          style={styles.input}
          value={productData.image}
          onChangeText={(text) =>
            setProductData({ ...productData, image: text })
          }
        />

        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Add Product</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  productContainer: {
    marginTop: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    padding: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#5995fd",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default AddProduct;
