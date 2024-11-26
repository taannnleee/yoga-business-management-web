import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Button, Card } from "react-native-paper";
import { BASE_URL } from "@/api/config";
import { getJwt } from "@/jwt/get-jwt";
import { router } from "expo-router";

interface Address {
  id: number;
  houseNumber: string;
  street: string;
  district: string;
  city: string;
  status: string;
  nameDelivery: string;
  phoneNumberDelivery: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  fullname: string;
  phone: string;
  addresses: Address[];
}

interface Product {
  id: number;
  imagePath: string;
  price: number;
  title: string;
  averageRating: number;
  brand: string;
  description: string;
}

interface WishListItem {
  id: number;
  user: User;
  product: Product;
}

const WishList: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getJwt();
        const response = await fetch(
          `${BASE_URL}/api/wishlist/get-wishlist-of-user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (data.status === 200) {
          setWishlist(data.data);
        } else {
          throw new Error("Failed to load wishlist");
        }
      } catch (error: any) {
        setError(
          error.message || "An error occurred while fetching the wishlist.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (id: number) => {
    try {
      const token = await getJwt();
      const response = await fetch(
        `${BASE_URL}/api/wishlist/delete-wishlist-of-user/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setWishlist((prevWishlist) =>
          prevWishlist.filter((item) => item.id !== id),
        );
      } else {
        throw new Error("Failed to remove item from wishlist");
      }
    } catch (error) {
      setError("Error removing item from wishlist.");
    }
  };

  const formatPrice = (price: number) => {
    return price
      .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      .replace("₫", "đ");
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card
              style={styles.card}
              onPress={() =>
                router.push(`/(root)/(product)/${item.product.id}`)
              }
            >
              <View style={styles.cardContent}>
                <Card.Cover
                  source={{ uri: item.product.imagePath }}
                  style={styles.cardImage}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.product.title}</Text>
                  {/*<Text style={styles.description}>*/}
                  {/*  {item.product.description}*/}
                  {/*</Text>*/}
                  <Text style={styles.price}>
                    Price: {formatPrice(item.product.price)}
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => removeFromWishlist(item.id)}
                    style={styles.removeButton}
                    labelStyle={styles.removeButtonText}
                  >
                    Xóa
                  </Button>
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  card: {
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "row",
  },
  cardImage: {
    width: 120,
    height: 120,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    color: "#f44336",
  },
  removeButton: {
    marginTop: 8,
    backgroundColor: "#d32f2f",
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: 100,
    alignSelf: "flex-start",
  },
  removeButtonText: {
    fontSize: 12,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});

export default WishList;
