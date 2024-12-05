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
  final List<_ChartData> barChartDataMonth = [
    _ChartData('1', 25000000.0),
    _ChartData('2', 30000000.0),
    _ChartData('3', 3500000.0),
    _ChartData('4', 4000000.0),
    _ChartData('5', 4500000.0),
    _ChartData('6', 5000000.0),
    _ChartData('7', 5500000.0),
    _ChartData('8', 6000000.0),
    _ChartData('9', 6500000.0),
    _ChartData('10', 7000000.0),
    _ChartData('11', 7500000.0),
    _ChartData('12', 8000000.0),
    _ChartData('13', 6000000.0),
    _ChartData('14', 9000000.0),
    _ChartData('15', 9500000.0),
    _ChartData('16', 10000000.0),
    _ChartData('17', 10500000.0),
    _ChartData('18', 11000000.0),
    _ChartData('19', 11500000.0),
    _ChartData('20', 12000000.0),
    _ChartData('21', 12500000.0),
    _ChartData('22', 1000000.0),
    _ChartData('23', 13500000.0),
    _ChartData('24', 40000000.0),
    _ChartData('25', 14500000.0),
    _ChartData('26', 15000000.0),
    _ChartData('27', 15500000.0),
    _ChartData('28', 1200000.0),
    _ChartData('29', 16500000.0),
    _ChartData('30', 17000000.0),
  ];
  final List<_ChartData> barChartDataYear = [
    _ChartData('2022', 800000000),
    _ChartData('2023', 600000000),
    _ChartData('2024', 900000000),
  ];

  @override
  void initState() {
    super.initState();
    // Gán cứng dữ liệu khi khởi tạo cho ngày đầu tiên
    barChartDataDay = [
      _ChartData('Ngày 1', 100),
      _ChartData('Ngày 2', 200),
      _ChartData('Ngày 3', 150),
    ];
    totalPriceForDay = 450; // Tổng doanh thu cho 3 ngày
  }

  // Lấy access token
  Future<String?> _getAccessToken() async {
    return await getToken();
  }

  // Fetch dữ liệu từ API theo ngày (chưa cần dùng nữa)
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

      // Gọi API với ngày đã chọn (không cần nữa vì giờ sử dụng dữ liệu cứng)
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

              // Biểu đồ theo ngày
              if (selectedTab == 0) _buildDayChart(),

              // Biểu đồ theo tháng
              if (selectedTab == 1) _buildMonthChart(),

              // Biểu đồ theo năm
              if (selectedTab == 2) _buildYearChart(),
            ],
          ),
        ),
      ),
    );
  }

  // Biểu đồ doanh thu theo ngày
  Widget _buildDayChart() {
    return Expanded(
      child: Column(
        children: [
          Text(
            'Biểu đồ doanh thu mua hàng theo ngày',
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: loading
                ? const Center(child: CircularProgressIndicator())
                : error != null
                ? Center(child: Text('Lỗi: $error'))
                : SfCartesianChart(
              primaryXAxis: CategoryAxis(),
              series: <ChartSeries>[
                ColumnSeries<_ChartData, String>(
                  dataSource: barChartDataDay,
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
    );
  }

  // Biểu đồ doanh thu theo tháng (biểu đồ miền)
  Widget _buildMonthChart() {
    return Expanded(
      child: Column(
        children: [
          Text(
            'Biểu đồ doanh thu mua hàng theo tháng',
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: loading
                ? const Center(child: CircularProgressIndicator())
                : error != null
                ? Center(child: Text('Lỗi: $error'))
                : SfCartesianChart(
              primaryXAxis: CategoryAxis(),
              series: <ChartSeries>[
                AreaSeries<_ChartData, String>(
                  dataSource: barChartDataMonth,
                  xValueMapper: (_ChartData data, _) => data.label,
                  yValueMapper: (_ChartData data, _) => data.value,
                  color: Colors.blue.withOpacity(0.3),
                  borderColor: Colors.blue,
                  borderWidth: 2,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Biểu đồ doanh thu theo năm
  Widget _buildYearChart() {
    return Expanded(
      child: Column(
        children: [
          Text(
            'Biểu đồ doanh thu mua hàng theo năm',
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: loading
                ? const Center(child: CircularProgressIndicator())
                : error != null
                ? Center(child: Text('Lỗi: $error'))
                : SfCartesianChart(
              primaryXAxis: CategoryAxis(),
              series: <ChartSeries>[
                ColumnSeries<_ChartData, String>(
                  dataSource: barChartDataYear,
                  xValueMapper: (_ChartData data, _) => data.label,
                  yValueMapper: (_ChartData data, _) => data.value,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// Định nghĩa dữ liệu biểu đồ
class _ChartData {
  final String label;
  final double value;
  _ChartData(this.label, this.value);
}

// Mẫu Order để hiển thị doanh thu (giả sử model này có trong ứng dụng của bạn)
class Order {
  final double totalPrice;
  Order({required this.totalPrice});

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      totalPrice: json['totalPrice'],
    );
  }
}
