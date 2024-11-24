import 'package:flutter/material.dart';

class MainLayout extends StatefulWidget {
  final Widget content;
  final String title;

  const MainLayout({Key? key, required this.content, required this.title}) : super(key: key);

  @override
  _MainLayoutState createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  bool isSidebarOpen = true;
  bool isOverviewExpanded = false;
  bool isCourseManagementExpanded = false;

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
      body: Row(
        children: [
          // Sidebar
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            width: isSidebarOpen ? 280 : 80,
            color: Colors.grey[900],
            child: Column(
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
                          isSidebarOpen ? Icons.chevron_left : Icons.chevron_right,
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
                // Menu List
                Expanded(
                  child: ListView(
                    children: [
                      // Overview Section
                      ExpansionTile(
                        leading: const Icon(Icons.home, color: Colors.white),
                        title: Text(
                          "Tổng quan",
                          style: TextStyle(color: isSidebarOpen ? Colors.white : Colors.transparent),
                        ),
                        trailing: isSidebarOpen
                            ? Icon(
                          isOverviewExpanded ? Icons.expand_less : Icons.expand_more,
                          color: Colors.white,
                        )
                            : null,
                        children: [
                          _buildSubMenu("Báo cáo doanh thu", "/home/revenue-report"),
                          _buildSubMenu("Phân tích khách hàng", "/home/customer-analysis"),
                          _buildSubMenu("Dự đoán xu hướng", "/home/trend-forecast"),
                        ],
                        onExpansionChanged: (value) {
                          setState(() {
                            isOverviewExpanded = value;
                          });
                        },
                      ),
                      // Course Management Section
                      ExpansionTile(
                        leading: const Icon(Icons.school, color: Colors.white),
                        title: Text(
                          "Quản lý khóa học",
                          style: TextStyle(color: isSidebarOpen ? Colors.white : Colors.transparent),
                        ),
                        trailing: isSidebarOpen
                            ? Icon(
                          isCourseManagementExpanded ? Icons.expand_less : Icons.expand_more,
                          color: Colors.white,
                        )
                            : null,
                        children: [
                          _buildSubMenu("Khóa học", "/course-management/courses"),
                          _buildSubMenu("Giảng viên", "/course-management/teachers"),
                          _buildSubMenu("Chủ đề", "/course-management/topics"),
                        ],
                        onExpansionChanged: (value) {
                          setState(() {
                            isCourseManagementExpanded = value;
                          });
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Content Area
          Expanded(
            child: widget.content,
          ),
        ],
      ),
    );
  }

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
