import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'package:yoga_business_management_admin_mobile/importproductform.dart';
import 'dart:convert';
import 'storage.dart';
import 'config.dart';

class OrderManagement extends StatefulWidget {
  const OrderManagement({Key? key}) : super(key: key);
  @override
  _OrderManagementState createState() => _OrderManagementState();
}

class _OrderManagementState extends State<OrderManagement> {
  List<Order> orders = [];
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchOrders();
  }

  Future<void> fetchOrders() async {
    final accessToken = await _getAccessToken();
    final url = '${Config.apiUrl}/api/admin/get-all-order-of-user';

    try {
      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $accessToken',
          'Content-Type': 'application/json',
        },
      );


      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          orders = (data['data'] as List).map((e) => Order.fromJson(e)).toList();
          isLoading = false;
        });
      } else {
        throw Exception("HTTP error: ${response.statusCode}");
      }
    } catch (e) {
      setState(() {
        error = e.toString();
        isLoading = false;
      });
    }
  }

  Future<void> updateOrderStatus(int orderId, String newStatus) async {
    final accessToken = await _getAccessToken();
    final url = '${Config.apiUrl}/api/admin/update-order-status/$orderId';

    try {
      final response = await http.patch(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $accessToken',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'status': newStatus}),
      );

      if (response.statusCode == 200) {
        setState(() {
          orders = orders.map((order) {
            if (order.id == orderId) {
              return order.copyWith(estatusOrder: newStatus);
            }
            return order;
          }).toList();
        });
      } else {
        throw Exception("Failed to update order status");
      }
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    }
  }

  Future<String?> _getAccessToken() async {
    return await getToken();
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (error != null) {
      return Center(
        child: Text(
          error!,
          style: TextStyle(color: Colors.red),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text("Order Management"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            // Search bar
            Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      hintText: 'Search...',
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: () {},
                  child: const Text("Search"),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Order table
            Expanded(
              child: ListView.builder(
                itemCount: orders.length,
                itemBuilder: (context, index) {
                  final order = orders[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    child: ListTile(
                      title: Text("Order ID: ${order.id}"),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text("Customer: ${order.createdBy}"),
                          Text("Date: ${order.createdAt}"),
                          Text("Total: \$${order.totalPrice}"),
                          Text("Payment: ${order.payment.nameMethod}"),
                          DropdownButton<String>(
                            value: order.estatusOrder,
                            items: const [
                              DropdownMenuItem(
                                value: "PROCESSING",
                                child: Text("Processing"),
                              ),
                              DropdownMenuItem(
                                value: "COMPLETED",
                                child: Text("Completed"),
                              ),
                              DropdownMenuItem(
                                value: "CANCELLED",
                                child: Text("Cancelled"),
                              ),
                              DropdownMenuItem(
                                value: "DELIVERING",
                                child: Text("Delivering"),
                              ),
                            ],
                            onChanged: (newStatus) {
                              if (newStatus != null) {
                                updateOrderStatus(order.id, newStatus);
                              }
                            },
                          ),
                        ],
                      ),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            onPressed: () {},
                            icon: const Icon(Icons.edit),
                          ),
                          IconButton(
                            onPressed: () {},
                            icon: const Icon(Icons.delete),
                            color: Colors.red,
                          ),
                        ],
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

// Models
class Order {
  final int id;
  final String createdBy;
  final String createdAt;
  final double totalPrice;
  final String estatusOrder;
  final Payment payment;

  Order({
    required this.id,
    required this.createdBy,
    required this.createdAt,
    required this.totalPrice,
    required this.estatusOrder,
    required this.payment,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      createdBy: json['createdBy'],
      createdAt: json['createdAt'],
      totalPrice: json['totalPrice'].toDouble(),
      estatusOrder: json['estatusOrder'],
      payment: Payment.fromJson(json['payment']),
    );
  }

  Order copyWith({String? estatusOrder}) {
    return Order(
      id: id,
      createdBy: createdBy,
      createdAt: createdAt,
      totalPrice: totalPrice,
      estatusOrder: estatusOrder ?? this.estatusOrder,
      payment: payment,
    );
  }
}

class Payment {
  final String nameMethod;

  Payment({required this.nameMethod});

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(nameMethod: json['nameMethod']);
  }
}
