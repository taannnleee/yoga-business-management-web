import 'package:flutter/material.dart';
import '../layouts/main_layout.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      title: "Trang chủ",
      content: Center(
        child: Text(
          "Chào mừng bạn đến với trang chủ!",
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}
