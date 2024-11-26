import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'package:yoga_business_management_admin_mobile/importproductform.dart';
import 'dart:convert';
import 'storage.dart';
import 'config.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class OrderManagement extends StatefulWidget {
  const OrderManagement({Key? key}) : super(key: key);
  @override
  _OrderManagementState createState() => _OrderManagementState();
}

class _OrderManagementState extends State<OrderManagement> {
  List<Order> orders = [];
  bool loading = true;
  String? error;
  WebSocketChannel? channel;

  @override
  void initState() {
    super.initState();
    fetchOrders();
    setupWebSocket();
  }

  @override
  void dispose() {
    channel?.sink.close();
    super.dispose();
  }

  // Fetch orders from API
  Future<void> fetchOrders() async {
    try {
      final accessToken = await _getAccessToken();
      final response = await http.get(
        Uri.parse('${Config.apiUrl}/api/admin/get-all-order-of-user'),
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
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch orders';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  // WebSocket setup
  void setupWebSocket() {
    final socketUrl = 'ws://${Config.apiUrl}/ws';
    channel = WebSocketChannel.connect(Uri.parse(socketUrl));
    // ScaffoldMessenger.of(context).showSnackBar(
    //   SnackBar(content: Text('Đăng kí web socket thành công')),
    // );
    channel?.stream.listen((message) {
      final updatedOrder = Order.fromJson(json.decode(message));
      setState(() {
        final index = orders.indexWhere((order) => order.id == updatedOrder.id);
        if (index >= 0) {
          orders[index] = updatedOrder;
        } else {
          orders.add(updatedOrder);
        }
      });
    });
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
      } else {
        throw Exception('Failed to update order status');
      }
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    }
  }

  // Get access token
  Future<String?> _getAccessToken() async {
    return await getToken();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Order Management'),
      ),
      body: loading
          ? Center(child: CircularProgressIndicator())
          : error != null
          ? Center(child: Text('Error: $error'))
          : Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Search bar
            TextField(
              decoration: InputDecoration(
                hintText: 'Search...',
                suffixIcon: Icon(Icons.search),
              ),
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: orders.length,
                itemBuilder: (context, index) {
                  final order = orders[index];
                  return Card(
                    margin: EdgeInsets.symmetric(vertical: 8),
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
                        items: ['PROCESSING', 'COMPLETED', 'CANCELLED', 'DELIVERING']
                            .map((status) => DropdownMenuItem<String>(
                          value: status,
                          child: Text(status),
                        ))
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
