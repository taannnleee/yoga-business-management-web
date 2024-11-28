import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'storage.dart';
import 'config.dart';
import 'package:stomp_dart_client/stomp_dart_client.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
class OrderManagement extends StatefulWidget {
  const OrderManagement({Key? key}) : super(key: key);

  @override
  _OrderManagementState createState() => _OrderManagementState();
}

class _OrderManagementState extends State<OrderManagement> {
  List<Order> orders = [];
  bool loading = true;
  late StompClient stompClient;
  bool connected = false;
  String statusMessage = "Connecting socket...";
  String? error;
  String selectedStatus = 'ALL'; // Default status
  final List<String> statuses = ['ALL', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'DELIVERING'];
  @override
  void initState() {
    super.initState();
    fetchOrdersByStatus(selectedStatus);
    _connectWebSocket();
  }
  // Connect to WebSocket and STOMP server


  void _connectWebSocket() {
    print("hehe");
    stompClient = StompClient(
      config: StompConfig.sockJS(
        url: '${Config.apiUrl}/ws', // Replace with your WebSocket URL
        onConnect: (StompFrame frame) {
          setState(() {
            connected = true;
            statusMessage = "Connected to WebSocket!";
          });

          // Subscribe to the '/topic/admin' destination
          stompClient.subscribe(
            destination: '/topic/admin', // Topic you're subscribing to
            callback: (StompFrame frame) {
              print("Received message: ${frame.body}"); // Handle the received message
              fetchOrdersByStatus(selectedStatus); // Call your function to fetch orders
            },
          );
        },
        onWebSocketError: (error) {
          setState(() {
            statusMessage = "WebSocket Error: $error";
          });
        },
        reconnectDelay: Duration(seconds: 5), // Automatically reconnect after 5 seconds if disconnected
      ),
    );

    stompClient.activate(); // Activate WebSocket connection
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

  // Update order status
  Future<void> handleStatusChange(int orderId, String newStatus) async {
    try {
      final accessToken = await _getAccessToken();
      final response = await http.patch(
        Uri.parse('${Config.apiUrl}/api/admin/update-order-status/$orderId'),
        headers: {
          'Authorization': 'Bearer $accessToken',
          'Content-Type': 'application/json',
        },
        body: json.encode({'status': newStatus}),
      );

      if (response.statusCode == 200) {
        setState(() {
          final index = orders.indexWhere((order) => order.id == orderId);
          if (index >= 0) {
            orders[index].estatusOrder = newStatus;
          }
        });
        Fluttertoast.showToast(
          msg: "Order status updated successfully",
          toastLength: Toast.LENGTH_SHORT,
        );
      } else {
        throw Exception('Failed to update order status');
      }
    } catch (e) {
      Fluttertoast.showToast(
        msg: "Error: $e",
        toastLength: Toast.LENGTH_SHORT,
      );
    }
  }

  // Get access token
  Future<String?> _getAccessToken() async {
    return await getToken();
  }

  // Handle pull to refresh
  Future<void> _onRefresh() async {
    fetchOrdersByStatus(selectedStatus); // Reload orders
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
            Text(statusMessage),
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
            // Wrap ListView with RefreshIndicator
            Expanded(
              child: RefreshIndicator(
                onRefresh: _onRefresh,
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
                            if (newStatus != null) {
                              handleStatusChange(order.id, newStatus);
                            }
                          },
                          items: statuses
                              .where((status) => status != 'ALL') // Loại bỏ 'ALL'
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
