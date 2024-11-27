import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'storage.dart';
import 'config.dart';
import 'package:stomp_dart_client/stomp_dart_client.dart';

class OrderManagement extends StatefulWidget {
  const OrderManagement({Key? key}) : super(key: key);

  @override
  _OrderManagementState createState() => _OrderManagementState();
}

class _OrderManagementState extends State<OrderManagement> {
  List<Order> orders = [];
  bool loading = true;
  String? error;
  String selectedStatus = 'ALL'; // Default status
  final List<String> statuses = ['ALL', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'DELIVERING'];
  late StompClient stompClient; // WebSocket client
  late String socketUrl;

  @override
  void initState() {
    super.initState();
    fetchOrdersByStatus(selectedStatus);

    // Ensure WebSocket URL is correctly formatted (replace http with ws)
    socketUrl = 'ws://localhost:8080';
    // socketUrl = "ws://192.168.1.46:8080/ws";
    connectWebSocket();
  }

  // Connect to WebSocket
  void connectWebSocket() {
    stompClient = StompClient(
      config: StompConfig(
        url: socketUrl, // WebSocket URL
        onConnect: (StompFrame frame) {
          // Subscribe to receive messages from "/topic/admin"
          stompClient.subscribe(
            destination: '/topic/admin', // Listen to admin topic
            callback: (StompFrame frame) {
              String message = frame.body ?? "New order created!";
              showNotification(message); // Show toast notification when a message is received
            },
          );
        },
        onDisconnect: (_) {
          print("Disconnected from WebSocket");
        },
        onWebSocketError: (error) {
          print("WebSocket Error: $error");
        },
      ),
    );
    stompClient.activate(); // Activate WebSocket connection
  }

  // Show notification when new order message is received
  void showNotification(String message) {
    Fluttertoast.showToast(
      msg: message,
      toastLength: Toast.LENGTH_LONG,
    );
  }

  // Fetch orders by status from API
  Future<void> fetchOrdersByStatus(String status) async {
    setState(() {
      loading = true;
      error = null;
    });

    try {
      final accessToken = await _getAccessToken();
      final response = await http.get(
        Uri.parse('${Config.apiUrl}/api/admin/get-all-order-of-user-by-status/$status?sortBy=createdAt&sortDir=desc'),
        headers: {
          'Authorization': 'Bearer $accessToken',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          orders = (data['data'] as List)
              .map((item) => Order.fromJson(item))
              .toList();
        });
      } else {
        throw Exception('Failed to fetch orders');
      }
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  // Get access token
  Future<String?> _getAccessToken() async {
    return await getToken();
  }

  @override
  void dispose() {
    stompClient.deactivate(); // Close WebSocket connection when widget is disposed
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Order Management'),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
          ? Center(child: Text('Error: $error'))
          : Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Dropdown for status
            DropdownButton<String>(
              value: selectedStatus,
              onChanged: (value) {
                if (value != null) {
                  setState(() {
                    selectedStatus = value;
                  });
                  fetchOrdersByStatus(value);
                }
              },
              items: statuses.map((status) {
                return DropdownMenuItem(
                  value: status,
                  child: Text(status),
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
            // Search bar
            const TextField(
              decoration: InputDecoration(
                hintText: 'Search...',
                suffixIcon: Icon(Icons.search),
              ),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: orders.length,
                itemBuilder: (context, index) {
                  final order = orders[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    child: ListTile(
                      title: Text('Order ID: ${order.id}'),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Customer: ${order.createdBy}'),
                          Text('Date: ${order.createdAt}'),
                          Text('Total Price: ${order.totalPrice}'),
                          Text('Payment Status: ${order.epaymentStatus}'),
                        ],
                      ),
                      trailing: DropdownButton<String>(
                        value: order.estatusOrder,
                        onChanged: (newStatus) {
                          // You can handle the status change here if needed
                        },
                        items: statuses
                            .where((status) => status != 'ALL') // Exclude 'ALL' from dropdown
                            .map(
                              (status) => DropdownMenuItem<String>(
                            value: status,
                            child: Text(status),
                          ),
                        )
                            .toList(),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class Order {
  final int id;
  final double totalPrice;
  final int totalItem;
  final String createdBy;
  final String createdAt;
  final String paymentMethod;
  String estatusOrder;
  final String epaymentStatus;

  Order({
    required this.id,
    required this.totalPrice,
    required this.totalItem,
    required this.createdBy,
    required this.createdAt,
    required this.paymentMethod,
    required this.estatusOrder,
    required this.epaymentStatus,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      totalPrice: json['totalPrice'],
      totalItem: json['totalItem'],
      createdBy: json['createdBy'],
      createdAt: json['createdAt'],
      paymentMethod: json['paymentMethod'],
      estatusOrder: json['estatusOrder'],
      epaymentStatus: json['epaymentStatus'],
    );
  }
}
