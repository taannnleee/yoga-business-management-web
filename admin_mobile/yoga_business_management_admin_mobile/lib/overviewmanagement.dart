import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';
import 'package:intl/intl.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'storage.dart';
import 'config.dart';

class OverViewManagement extends StatefulWidget {
  const OverViewManagement({Key? key}) : super(key: key);

  @override
  _StatisticalScreenState createState() => _StatisticalScreenState();
}

class _StatisticalScreenState extends State<OverViewManagement> {
  double totalPriceForDay = 0.0;
  int selectedTab = 0; // Quản lý tab đang chọn
  DateTime selectedDate = DateTime.now(); // Quản lý ngày chọn

  List<Order> orders = [];
  bool loading = true;
  String? error;

  List<_ChartData> barChartDataDay = [];

  @override
  void initState() {
    super.initState();
    // Format ngày ban đầu
    String formattedDate = DateFormat('yyyy-MM-dd').format(selectedDate);
    fetchOrdersByStatus(formattedDate);
  }

  // Lấy access token
  Future<String?> _getAccessToken() async {
    return await getToken();
  }

  // Fetch dữ liệu từ API theo ngày
  Future<void> fetchOrdersByStatus(String date) async {
    setState(() {
      loading = true;
      error = null;
    });

    try {
      final accessToken = await _getAccessToken();
      final response = await http.get(
        Uri.parse('${Config.apiUrl}/api/admin/get-daily-revenue?updatedAt=$date'),
        headers: {
          'Authorization': 'Bearer $accessToken',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          orders = (data['data'] as List)
              .map((item) => Order.fromJson(item))
              .toList();

          // Tính tổng giá cho "Theo ngày"
          totalPriceForDay = orders.fold(0.0, (sum, order) => sum + order.totalPrice);

          // Cập nhật dữ liệu biểu đồ cột
          barChartDataDay = [
            _ChartData('Ngày', totalPriceForDay),
          ];
        });
      } else {
        throw Exception('Failed to fetch orders');
      }
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      setState(() {
        loading = false;
      });
    }
  }
  

  // Tabs hiển thị các chế độ xem
  final List<String> tabs = ["Theo ngày", "Theo tháng", "Theo năm"];

  final List<_ChartData> barChartDataMonth = [
    for (int i = 1; i <= 12; i++) _ChartData('$i', (i * 5.0 + 20.0)),
  ];

  final List<_ChartData> barChartDataYear = [
    _ChartData('2021', 80),
    _ChartData('2022', 60),
    _ChartData('2023', 90),
  ];

  // Hàm chọn ngày
  void _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );
    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
      });

      // Gọi API với ngày đã chọn
      String formattedDate = DateFormat('yyyy-MM-dd').format(selectedDate);
      fetchOrdersByStatus(formattedDate);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Thống kê'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              // Tab buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: tabs.asMap().entries.map((entry) {
                  int index = entry.key;
                  String tab = entry.value;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        selectedTab = index;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
                      decoration: BoxDecoration(
                        border: Border(
                          bottom: BorderSide(
                            color: selectedTab == index ? Colors.blue : Colors.transparent,
                            width: 2.0,
                          ),
                        ),
                      ),
                      child: Text(
                        tab,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),

              const SizedBox(height: 16),

              // Hiển thị Date picker chỉ khi chọn tab "Theo ngày"
              if (selectedTab == 0)
                GestureDetector(
                  onTap: () => _selectDate(context),
                  child: Text(
                    'Chọn ngày: ${DateFormat('dd/MM/yyyy').format(selectedDate)}',
                    style: const TextStyle(fontSize: 16, color: Colors.blue),
                  ),
                ),

              const SizedBox(height: 16),

              // Hiển thị biểu đồ
              Expanded(
                child: Column(
                  children: [
                    Text(
                      selectedTab == 0
                          ? 'Biểu đồ doanh thu mua hàng theo ngày'
                          : selectedTab == 1
                          ? 'Biểu đồ doanh thu mua hàng theo tháng'
                          : 'Biểu đồ doanh thu mua hàng theo năm',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),

                    const SizedBox(height: 16),

                    // Biểu đồ cột với nhãn trên đỉnh mỗi cột
                    Expanded(
                      child: loading
                          ? const Center(child: CircularProgressIndicator())
                          : error != null
                          ? Center(child: Text('Lỗi: $error'))
                          : SfCartesianChart(
                        primaryXAxis: CategoryAxis(),
                        series: <ChartSeries>[
                          ColumnSeries<_ChartData, String>(
                            dataSource: selectedTab == 0
                                ? barChartDataDay
                                : selectedTab == 1
                                ? barChartDataMonth
                                : barChartDataYear,
                            xValueMapper: (_ChartData data, _) => data.label,
                            yValueMapper: (_ChartData data, _) => data.value,
                            color: Colors.blue,
                            dataLabelSettings: const DataLabelSettings(
                              isVisible: true,
                              labelAlignment: ChartDataLabelAlignment.top,
                              textStyle: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ChartData {
  final String label;
  final double value;

  _ChartData(this.label, this.value);
}

class Order {
  final int id;
  final double totalPrice;
  final int totalItem;
  final String createdBy;
  final String createdAt;
  final String paymentMethod;
  String estatusOrder;
  final String epaymentStatus;

  Order({
    required this.id,
    required this.totalPrice,
    required this.totalItem,
    required this.createdBy,
    required this.createdAt,
    required this.paymentMethod,
    required this.estatusOrder,
    required this.epaymentStatus,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      totalPrice: json['totalPrice'],
      totalItem: json['totalItem'],
      createdBy: json['createdBy'],
      createdAt: json['createdAt'],
      paymentMethod: json['paymentMethod'],
      estatusOrder: json['estatusOrder'],
      epaymentStatus: json['epaymentStatus'],
    );
  }
}
