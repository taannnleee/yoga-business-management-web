import 'package:flutter/material.dart';
import 'package:yoga_business_management_admin_mobile/ordermanagement.dart';
import 'package:yoga_business_management_admin_mobile/overviewmanagement.dart';
import '../layouts/main_layout.dart';

class Overview extends StatelessWidget {
  const Overview({super.key});

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      content: const OverViewManagement(),
      title: 'Over view management',
    );
  }
}
