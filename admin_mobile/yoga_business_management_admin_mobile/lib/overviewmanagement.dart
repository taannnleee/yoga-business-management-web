import 'package:flutter/material.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';
import 'package:flutter_swiper_plus/flutter_swiper_plus.dart';
import 'package:intl/intl.dart';

class OverViewManagement extends StatefulWidget {
  const OverViewManagement({Key? key}) : super(key: key);

  @override
  _StatisticalScreenState createState() => _StatisticalScreenState();
}

class _StatisticalScreenState extends State<OverViewManagement> {
  int selectedTab = 0; // Quản lý tab đang chọn
  DateTime selectedDate = DateTime.now(); // Quản lý ngày chọn

  final List<String> tabs = ["Theo ngày", "Theo tháng", "Theo năm"];

  // Dữ liệu cho biểu đồ cột
  final List<_ChartData> barChartData = [
    _ChartData('January', 20),
    _ChartData('February', 45),
    _ChartData('March', 28),
    _ChartData('April', 80),
    _ChartData('May', 99),
    _ChartData('June', 43),
  ];

  // Dữ liệu cho biểu đồ tròn
  final List<_PieData> pieChartData1 = [
    _PieData('Đơn thành công', 12, Colors.blue),
    _PieData('Đơn huỷ', 11, Colors.red),
    _PieData('Đơn đang xử lý', 13, Colors.green),
    _PieData('Đơn đang giao', 15, Colors.orange),
  ];

  final List<_PieData> pieChartData2 = [
    _PieData('Thảm', 12, Colors.blue),
    _PieData('Giày', 11, Colors.red),
    _PieData('Quần áo', 13, Colors.green),
    _PieData('Gối', 15, Colors.orange),
  ];

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
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Thống kê'),
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
                      padding: EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
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
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),

              SizedBox(height: 16),

              // Date picker button
              GestureDetector(
                onTap: () => _selectDate(context),
                child: Text(
                  'Chọn ngày: ${DateFormat('dd/MM/yyyy').format(selectedDate)}',
                  style: TextStyle(fontSize: 16, color: Colors.blue),
                ),
              ),

              SizedBox(height: 16),

              // Swiper for charts
              Expanded(
                child: Swiper(
                  loop: true,
                  itemCount: 2,
                  pagination: SwiperPagination(),
                  itemBuilder: (context, index) {
                    if (index == 0) {
                      // First group of charts
                      return Column(
                        children: [
                          Text(
                            'Biểu đồ tần suất mua hàng',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          Expanded(
                            child: SfCircularChart(
                              series: <CircularSeries>[
                                PieSeries<_PieData, String>(
                                  dataSource: pieChartData1,
                                  xValueMapper: (_PieData data, _) => data.category,
                                  yValueMapper: (_PieData data, _) => data.value,
                                  pointColorMapper: (_PieData data, _) => data.color,
                                  dataLabelSettings: DataLabelSettings(isVisible: true),
                                )
                              ],
                            ),
                          ),
                        ],
                      );
                    } else {
                      // Second group of charts
                      return Column(
                        children: [
                          Text(
                            'Biểu đồ dòng tiền mua hàng',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          Expanded(
                            child: SfCartesianChart(
                              primaryXAxis: CategoryAxis(),
                              series: <ChartSeries>[
                                ColumnSeries<_ChartData, String>(
                                  dataSource: barChartData,
                                  xValueMapper: (_ChartData data, _) => data.label,
                                  yValueMapper: (_ChartData data, _) => data.value,
                                  color: Colors.blue,
                                )
                              ],
                            ),
                          ),
                        ],
                      );
                    }
                  },
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

class _PieData {
  final String category;
  final double value;
  final Color color;

  _PieData(this.category, this.value, this.color);
}