import 'package:flutter/material.dart';
import 'package:yoga_business_management_admin_mobile/usermanagenment.dart';
import 'layouts/main_layout.dart';

class User extends StatelessWidget {
  const User({super.key});

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      content: const UserManagement(),
      title: 'User Management',
    );
  }
}
