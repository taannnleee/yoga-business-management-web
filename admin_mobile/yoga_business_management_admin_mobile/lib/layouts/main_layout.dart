import 'package:flutter/material.dart';

class MainLayout extends StatefulWidget {
  final Widget content;
  final String title;

  const MainLayout({Key? key, required this.content, required this.title}) : super(key: key);

  @override
  _MainLayoutState createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  bool isSidebarOpen = true; // Điều khiển trạng thái Sidebar

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
      body: Stack( // Sử dụng Stack để có thể vẽ FloatingActionButton trên mọi thành phần khác
        children: [
          Row(
            children: [
              // Sidebar
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                width: isSidebarOpen ? 280 : 0, // Sidebar sẽ ẩn khi isSidebarOpen = false
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
                          if (isSidebarOpen)
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
                              isSidebarOpen
                                  ? Icons.chevron_left
                                  : Icons.chevron_right,
                              color: Colors.white,
                            ),
                            onPressed: () {
                              setState(() {
                                isSidebarOpen = !isSidebarOpen;
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                    // Menu List (Hiển thị luôn các mục con mà không cần mở rộng)
                    Expanded(
                      child: ListView(
                        children: [
                          _buildMenuItem("Tổng quan", [

                          ]),
                          _buildMenuItem("Quản lý danh mục", [

                          ]),
                          _buildMenuItem("Quản lý sản phẩm", [

                          ]),
                          _buildMenuItem("Quản lý đơn hàng", [

                          ]),
                        ],
                      ),
                    ),
                  ],
                )
                    : null, // Không hiển thị nội dung khi Sidebar bị ẩn
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
              left: 16, // Điều chỉnh vị trí nút ra ngoài góc trái trên cùng
              top: 16, // Điều chỉnh vị trí nút ra ngoài góc trái trên cùng
              child: FloatingActionButton(
                onPressed: () {
                  setState(() {
                    isSidebarOpen = true;
                  });
                },
                child: Icon(Icons.chevron_right),
                backgroundColor: Colors.grey[800],
              ),
            ),
        ],
      ),
    );
  }

  // Hàm tạo menu chính (không mở rộng, luôn hiển thị)
  Widget _buildMenuItem(String title, List<Widget> subMenus) {
    return Column(
      children: [
        ListTile(
          title: Text(title, style: const TextStyle(color: Colors.white)),
        ),
        ...subMenus,
      ],
    );
  }

  // Hàm tạo submenu
  Widget _buildSubMenu(String title, String route) {
    return ListTile(
      contentPadding: const EdgeInsets.only(left: 40),
      title: Text(title, style: const TextStyle(color: Colors.white)),
      onTap: () {
        Navigator.pushNamed(context, route);
      },
    );
  }
}
