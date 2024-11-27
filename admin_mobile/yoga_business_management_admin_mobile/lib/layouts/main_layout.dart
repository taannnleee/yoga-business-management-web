import 'package:flutter/material.dart';
import 'package:yoga_business_management_admin_mobile/category.dart';
import 'package:yoga_business_management_admin_mobile/overview.dart';
import 'package:yoga_business_management_admin_mobile/order.dart';
import 'package:yoga_business_management_admin_mobile/product.dart';
import 'package:yoga_business_management_admin_mobile/user.dart';

class MainLayout extends StatefulWidget {
  final Widget content;
  final String title;

  const MainLayout({Key? key, required this.content, required this.title}) : super(key: key);

  @override
  _MainLayoutState createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  bool isSidebarOpen = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: Colors.grey[800],
        actions: [
          IconButton(
            icon: const Icon(Icons.account_circle),
            onPressed: () {
              // Mở menu người dùng
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          Row(
            children: [
              // Sidebar
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                width: isSidebarOpen ? 280 : 0,
                color: Colors.grey[900],
                child: isSidebarOpen
                    ? Column(
                  children: [
                    // Header Sidebar
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      height: 60,
                      color: Colors.grey[800],
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            "YOGA",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          IconButton(
                            icon: Icon(
                              Icons.chevron_left,
                              color: Colors.white,
                            ),
                            onPressed: () {
                              setState(() {
                                isSidebarOpen = false;
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                    // Menu List
                    Expanded(
                      child: ListView(
                        children: [
                          _buildMenuItem("Tổng quan", () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const Overview(),
                              ),
                            );
                          }),
                          _buildMenuItem("Quản lý người dùng", () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const User(),
                              ),
                            );
                          }),
                          _buildMenuItem("Quản lý danh mục", () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const Category(),
                              ),
                            );
                          }),
                          _buildMenuItem("Quản lý sản phẩm", () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const Product(),
                              ),
                            );
                          }),
                          _buildMenuItem("Quản lý đơn hàng", () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const Order(),
                              ),
                            );
                          }),
                        ],
                      ),
                    ),
                  ],
                )
                    : null,
              ),
              // Content Area
              Expanded(
                child: widget.content,
              ),
            ],
          ),
          // Nút bấm hiển thị lại Sidebar khi bị ẩn
          if (!isSidebarOpen)
            Positioned(
              left: 16,
              top: 16,
              child: FloatingActionButton(
                onPressed: () {
                  setState(() {
                    isSidebarOpen = true;
                  });
                },
                child: const Icon(Icons.chevron_right),
                backgroundColor: Colors.grey[800],
              ),
            ),
        ],
      ),
    );
  }

  // Hàm tạo menu chính
  Widget _buildMenuItem(String title, VoidCallback onTap) {
    return ListTile(
      title: Text(
        title,
        style: const TextStyle(color: Colors.white),
      ),
      onTap: onTap,
    );
  }
}
