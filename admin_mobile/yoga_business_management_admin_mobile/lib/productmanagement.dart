import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'package:yoga_business_management_admin_mobile/importproductform.dart';
import 'dart:convert';
import 'storage.dart';
import 'config.dart';

class ProductManagement extends StatefulWidget {
  const ProductManagement({Key? key}) : super(key: key);

  @override
  _ProductManagementState createState() => _ProductManagementState();
}

class _ProductManagementState extends State<ProductManagement> {
  bool isLoading = false;
  bool openUpdateModal = false;
  List<Map<String, dynamic>> products = [];
  List<Map<String, dynamic>> subcategories = [];
  Map<String, dynamic>? currentSubCategory;
  int page = 1;
  int totalPages = 0;

  // Lấy token từ storage
  Future<String?> _getAccessToken() async {
    return await getToken();
  }

  // Lấy danh sách sản phẩm từ API
  Future<void> getAllProducts() async {
    setState(() {
      isLoading = true;
    });

    try {
      String? accessToken = await _getAccessToken();
      final response = await http.get(
        Uri.parse('${Config.apiUrl}/api/admin/get-all-product?page=$page&size=10'),
        headers: {
          'Authorization': 'Bearer $accessToken',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          products = List<Map<String, dynamic>>.from(data['data']['content']);
          totalPages = data['data']['totalPages'];
        });
      } else {
        Fluttertoast.showToast(msg: 'Không thể tải danh sách sản phẩm.');
      }
    } catch (error) {
      Fluttertoast.showToast(msg: 'Lỗi khi tải danh sách sản phẩm.');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  // Lấy danh sách loại sản phẩm từ API
  Future<void> getAllSubCategories() async {
    try {
      String? accessToken = await _getAccessToken();
      final response = await http.get(
        Uri.parse('${Config.apiUrl}/api/admin/get-all-subcategory'),
        headers: {
          'Authorization': 'Bearer $accessToken',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          subcategories = List<Map<String, dynamic>>.from(data['data']);
          currentSubCategory = subcategories.isNotEmpty ? subcategories[0] : null;
        });
      } else {
        Fluttertoast.showToast(msg: 'Không thể tải danh sách loại sản phẩm.');
      }
    } catch (error) {
      Fluttertoast.showToast(msg: 'Lỗi khi tải danh sách loại sản phẩm.');
    }
  }

  @override
  void initState() {
    super.initState();
    getAllProducts();
    getAllSubCategories();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Danh sách sản phẩm"),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Dropdown để chọn loại sản phẩm
                DropdownButton<Map<String, dynamic>>(
                  value: currentSubCategory,
                  hint: const Text("Chọn loại sản phẩm"),
                  onChanged: (Map<String, dynamic>? newValue) {
                    setState(() {
                      currentSubCategory = newValue;
                    });
                  },
                  items: subcategories
                      .map<DropdownMenuItem<Map<String, dynamic>>>((
                      Map<String, dynamic> subcategory) {
                    return DropdownMenuItem<Map<String, dynamic>>(
                      value: subcategory,
                      child: Text(subcategory['name']),
                    );
                  }).toList(),
                ),
                // Nút để nhập sản phẩm mới
                ElevatedButton(
                  onPressed: () {
                    if (currentSubCategory != null) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ImportProductForm(
                            open: true,
                            onClose: () {
                              setState(() {
                                openUpdateModal = false;
                              });
                            },
                            subId: currentSubCategory!['id'],  // Truyền subcategoryId
                            onImportSuccess: () {
                              Fluttertoast.showToast(msg: "Nhập sản phẩm thành công");
                              getAllProducts();  // Refresh lại sản phẩm
                            },
                          ),
                        ),
                      );
                    } else {
                      Fluttertoast.showToast(msg: 'Vui lòng chọn loại sản phẩm.');
                    }
                  },
                  child: Row(
                    children: const [
                      Icon(Icons.add),
                      SizedBox(width: 8),
                      Text("Nhập sản phẩm"),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Hiển thị danh sách sản phẩm hoặc thông báo khi đang tải
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : Expanded(
            child: ListView.builder(
              itemCount: products.length,
              itemBuilder: (context, index) {
                final product = products[index];
                return ListTile(
                  title: Text(product['title']),
                  subtitle: Text('${product['price']} VND'),
                  trailing: IconButton(
                    icon: const Icon(Icons.edit),
                    onPressed: () {
                      // Logic cho việc cập nhật sản phẩm
                      setState(() {
                        openUpdateModal = true;
                      });
                    },
                  ),
                );
              },
            ),
          ),
          // Phân trang
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: page > 1
                    ? () {
                  setState(() {
                    page--;
                  });
                  getAllProducts();
                }
                    : null,
              ),
              Text('Trang $page / $totalPages'),
              IconButton(
                icon: const Icon(Icons.arrow_forward),
                onPressed: page < totalPages
                    ? () {
                  setState(() {
                    page++;
                  });
                  getAllProducts();
                }
                    : null,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
