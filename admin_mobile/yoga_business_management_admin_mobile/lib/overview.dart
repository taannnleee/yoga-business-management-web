import 'package:flutter/material.dart';
import '../layouts/main_layout.dart';

class Overview extends StatelessWidget {
  const Overview({super.key});

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
