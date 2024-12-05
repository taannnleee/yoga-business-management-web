// import 'package:awesome_notifications/awesome_notifications.dart';
import 'package:flutter/material.dart';
import 'package:stomp_dart_client/stomp_dart_client.dart';
import 'package:yoga_business_management_admin_mobile/category.dart';
import 'package:yoga_business_management_admin_mobile/overview.dart';
import 'package:yoga_business_management_admin_mobile/order.dart';
import 'package:yoga_business_management_admin_mobile/product.dart';
import 'package:yoga_business_management_admin_mobile/user.dart';
import '../config.dart';

class MainLayout extends StatefulWidget {
  final Widget content;
  final String title;

  const MainLayout({Key? key, required this.content, required this.title})
      : super(key: key);

  @override
  _MainLayoutState createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  late StompClient stompClient;
  bool isSidebarOpen = false;

  @override
  void initState() {
    super.initState();
    // AwesomeNotifications().isNotificationAllowed().then((isAllowed) {
    //   if (!isAllowed) {
    //     // This is just a basic example. For real apps, you must show some
    //     // friendly dialog box before call the request method.
    //     // This is very important to not harm the user experience
    //     AwesomeNotifications().requestPermissionToSendNotifications();
    //   }
    // });
    // // Khởi tạo thông báo
    // AwesomeNotifications().initialize(
    //   'resource://drawable/res_app_icon',
    //   [
    //     NotificationChannel(
    //       channelGroupKey: 'basic_channel_group',
    //       channelKey: 'basic_channel',
    //       channelName: 'Basic notifications',
    //       channelDescription: 'Notification channel for basic tests',
    //       defaultColor: Color(0xFF9D50DD),
    //       ledColor: Colors.white,
    //     ),
    //   ],
    //   channelGroups: [
    //     NotificationChannelGroup(
    //       channelGroupKey: 'basic_channel_group',
    //       channelGroupName: 'Basic group',
    //     ),
    //   ],
    //   debug: true,
    // );
    // print("object");
    // Kết nối WebSocket
    _connectWebSocket();
  }

  // Kết nối WebSocket và đăng ký vào topic
  void _connectWebSocket() {
    print("Connecting to WebSocket...");
    stompClient = StompClient(
      config: StompConfig.sockJS(
        url: '${Config.apiUrl}/ws', // Thay thế bằng URL WebSocket của bạn
        onConnect: (StompFrame frame) {
          print("WebSocket Connected!");
          // Đăng ký vào topic '/topic/admin'
          stompClient.subscribe(
            destination: '/topic/admin', // Topic bạn muốn đăng ký
            callback: (StompFrame frame) {
              print("Received message: ${frame.body}"); // Xử lý tin nhắn nhận được
              // Gửi thông báo khi nhận được tin nhắn
              // AwesomeNotifications().createNotification(
              //   content: NotificationContent(
              //     id: 0,
              //     channelKey: 'basic_channel', // Đảm bảo tên channel này trùng với channel đã khai báo
              //     title: 'New Message from Admin',
              //     body: frame.body.toString(),
              //     notificationLayout: NotificationLayout.Default,
              //   ),
              // );
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Đơn hàng mới, cần bạn xác nhận ngay')),
              );
            },
          );
        },
        onWebSocketError: (error) {
          print("WebSocket Error: $error");
        },
        reconnectDelay: Duration(seconds: 5), // Tự động reconnect sau 5 giây nếu mất kết nối
      ),
    );

    stompClient.activate(); // Kích hoạt kết nối WebSocket
  }

  @override
  void dispose() {
    stompClient.deactivate(); // Đảm bảo ngắt kết nối khi widget bị hủy
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: Colors.grey[800],
        actions: [
          IconButton(
            icon: const Icon(Icons.account_circle),
            onPressed: () {
              // Mở menu người dùng
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          Row(
            children: [
              // Sidebar
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                width: isSidebarOpen ? 280 : 0,
                color: Colors.grey[900],
                child: isSidebarOpen
                    ? Column(
                  children: [
                    // Header Sidebar
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      height: 60,
                      color: Colors.grey[800],
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            "YOGA",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          IconButton(
                            icon: Icon(
                              Icons.chevron_left,
                              color: Colors.white,
                            ),
                            onPressed: () {
                              setState(() {
                                isSidebarOpen = false;
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                    // Menu List
                    Expanded(
                      child: ListView(
                        children: [
                          _buildMenuItem("Tổng quan", () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const Overview(),
                              ),
                            );
                          }),
                          _buildMenuItem("Quản lý người dùng", () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const User(),
                              ),
                            );
                          }),
                          _buildMenuItem("Quản lý danh mục", () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const Category(),
                              ),
                            );
                          }),
                          _buildMenuItem("Quản lý sản phẩm", () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const Product(),
                              ),
                            );
                          }),
                          _buildMenuItem("Quản lý đơn hàng", () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const Order(),
                              ),
                            );
                          }),
                        ],
                      ),
                    ),
                  ],
                )
                    : null,
              ),
              // Content Area
              Expanded(
                child: widget.content,
              ),
            ],
          ),
          // Nút bấm hiển thị lại Sidebar khi bị ẩn
          if (!isSidebarOpen)
            Positioned(
              left: 16,
              top: 16,
              child: FloatingActionButton(
                onPressed: () {
                  setState(() {
                    isSidebarOpen = true;
                  });
                },
                child: const Icon(Icons.chevron_right),
                backgroundColor: Colors.grey[800],
              ),
            ),
        ],
      ),
    );
  }

  // Hàm tạo menu chính
  Widget _buildMenuItem(String title, VoidCallback onTap) {
    return ListTile(
      title: Text(
        title,
        style: const TextStyle(color: Colors.white),
      ),
      onTap: onTap,
    );
  }
}
