import 'package:flutter/material.dart';
import 'package:yoga_business_management_admin_mobile/categorymanagement.dart';
import 'package:yoga_business_management_admin_mobile/productmanagement.dart';
import 'layouts/main_layout.dart';

class Product extends StatelessWidget {
  const Product({super.key});

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      content: const ProductManagement(),
      title: 'Product Management',
    );
  }
}
