import 'package:flutter/material.dart';
import 'package:yoga_business_management_admin_mobile/categorymanagement.dart';
import 'package:yoga_business_management_admin_mobile/ordermanagement.dart';
import 'package:yoga_business_management_admin_mobile/productmanagement.dart';
import 'layouts/main_layout.dart';

class Order extends StatelessWidget {
  const Order({super.key});

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      content: const OrderManagement(),
      title: 'Order Management',
    );
  }
}
