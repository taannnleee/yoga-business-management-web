import 'package:flutter/material.dart';
import 'package:yoga_business_management_admin_mobile/categorymanagement.dart';
import 'layouts/main_layout.dart';

class Category extends StatelessWidget {
  const Category({super.key});

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      content: const CategoryManagement(),
      title: 'Category Management',
    );
  }
}
