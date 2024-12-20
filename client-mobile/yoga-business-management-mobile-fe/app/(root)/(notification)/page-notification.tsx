import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import { getJwt } from "@/jwt/get-jwt";
import { BASE_URL, SOCKET_URL } from "@/api/config";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import * as Notifications from "expo-notifications";
// Define các kiểu dữ liệu
interface User {
  id: number;
  username: string;
  email: string;
  fullname: string;
  phone: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  user: User;
}
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });
const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [socketNotification, setSocketNotification] = useState<string>("");
  // useEffect(() => {
  //   // Yêu cầu quyền thông báo khi mở ứng dụng lần đầu
  //   const requestPermissions = async () => {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     if (status !== "granted") {
  //       alert("Permission for notifications was denied");
  //     }
  //   };
  //
  //   requestPermissions();
  // }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Tạo client STOMP
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`), // Endpoint WebSocket server
      debug: (msg) => console.log("STOMP Debug: ", msg), // Debug log
      reconnectDelay: 5000, // Tự động reconnect sau 5 giây nếu mất kết nối
    });

    // Xử lý khi kết nối thành công
    stompClient.onConnect = () => {
      console.log("WebSocket connected!");

      // Đăng ký vào topic "/topic/admin"
      stompClient.subscribe("/topic/admin", async (message) => {
        console.log("Received message:", message.body); // Hiển thị tin nhắn nhận được
        fetchNotifications();
      });
    };

    // Kết nối và xử lý lỗi
    stompClient.onStompError = (frame) => {
      console.error("Broker error:", frame.headers["message"]);
    };

    // Kích hoạt kết nối
    stompClient.activate();

    // Cleanup khi component bị hủy
    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
      console.log("WebSocket connection closed on unmount");
    };
  }, []); // Empty dependency array to ensure effect only runs once
  const fetchNotifications = async () => {
    try {
      const token = await getJwt();
      const response = await fetch(
        `${BASE_URL}/api/notification/get-all-of-user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      console.log("Fetched notifications:", data.data); // Thêm dòng log này
      setNotifications(data.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Không thể tải thông báo. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  const renderNotification = ({ item }: { item: Notification }) => {
    return (
      <TouchableOpacity onPress={() => handleNotificationPress(item)}>
        <View style={styles.notificationItem}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.message}</Text>
          <View style={styles.footer}>
            <Text style={styles.date}>
              Ngày: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <Text style={styles.status}>
              Trạng thái: {item.read ? "Đã đọc" : "Chưa đọc"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleNotificationPress = async (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalVisible(true);

    // Gọi API để thay đổi trạng thái của thông báo khi nó được mở
    try {
      const token = await getJwt();
      const response = await fetch(
        `${BASE_URL}/api/notification/change-status/${notification.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to change notification status");
      }

      // Cập nhật trạng thái "Đã đọc" trong danh sách thông báo
      setNotifications((prevNotifications) =>
        prevNotifications.map((item) =>
          item.id === notification.id ? { ...item, read: true } : item,
        ),
      );
    } catch (error) {
      setError("Không thể thay đổi trạng thái thông báo. Vui lòng thử lại.");
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedNotification(null);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Modal hiển thị thông tin chi tiết thông báo */}
      {selectedNotification && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>
                {selectedNotification.title}
              </Text>
              <Text style={styles.modalMessage}>
                {selectedNotification.message}
              </Text>
              <Text style={styles.modalDate}>
                Ngày:{" "}
                {new Date(selectedNotification.createdAt).toLocaleDateString()}
              </Text>
              {/* Hiển thị thông báo từ WebSocket */}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  listContainer: {
    padding: 20,
  },
  notificationItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 14,
    color: "#777",
  },
  status: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "bold",
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },

  // Styles cho Modal
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    position: "relative", // Thêm thuộc tính này để căn chỉnh nút đóng
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
  },
  modalDate: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  modalStatus: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 30,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default NotificationPage;
