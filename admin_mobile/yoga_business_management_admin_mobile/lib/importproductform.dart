import 'package:flutter/material.dart';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:image_picker/image_picker.dart';
import 'storage.dart';
import 'config.dart';

class ImportProductForm extends StatefulWidget {
  final bool open;
  final VoidCallback onClose;
  final int subId;
  final VoidCallback onImportSuccess;

  const ImportProductForm({
    required this.open,
    required this.onClose,
    required this.subId,
    required this.onImportSuccess,
    Key? key,
  }) : super(key: key);

  @override
  State<ImportProductForm> createState() => _ImportProductFormState();
}

class _ImportProductFormState extends State<ImportProductForm> {
  // State lưu thông tin sản phẩm
  String title = '';
  String imagePath = '';
  double price = 0;
  double averageRating = 0;
  String code = '';
  String brand = '';
  String description = '';
  Map<String, Map<String, String>> variants = {
    'size': {},
    'color': {},
    'thin': {},
  };
  Map<String, String> uploadedImages = {};

  bool loading = false;

  final colors = ["#2196F3", "#FF5722", "#FFEB3B"];
  final sizes = ["S", "M", "L", "XL"];
  final thins = ["Thin", "Medium", "Thick"];

  // Hàm tải ảnh lên
  Future<void> uploadImage(File file, String color) async {
    setState(() => loading = true);
    try {
      final uri = Uri.parse('${Config.apiUrl}/api/image/upload');
      final request = http.MultipartRequest('POST', uri);
      String? accessToken = await getToken();
      request.headers['Authorization'] = 'Bearer $accessToken';
      request.files.add(await http.MultipartFile.fromPath('file', file.path));

      final response = await request.send();
      if (response.statusCode == 200) {
        final responseData = json.decode(await response.stream.bytesToString());
        final uploadedImageUrl = responseData['data']['url'];
        setState(() {
          variants['color']![color] = uploadedImageUrl;
          uploadedImages[color] = uploadedImageUrl;
        });
        _showSnackBar('Tải ảnh lên thành công!');
      } else {
        throw Exception('Failed to upload image');
      }
    } catch (error) {
      _showSnackBar('Đã có lỗi khi tải ảnh lên: $error');
    } finally {
      setState(() => loading = false);
    }
  }

  // Hàm thêm sản phẩm
  Future<void> importProduct() async {
    setState(() => loading = true);
    try {
      final productData = {
        "title": title,
        "subCategoryId": widget.subId,
        "imagePath": imagePath,
        "price": price,
        "averageRating": averageRating,
        "code": code,
        "brand": brand,
        "description": description,
        "variants": variants,
      };

      String? accessToken = await getToken();
      final response = await http.post(
        Uri.parse('${Config.apiUrl}/api/admin/add-product'),
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer $accessToken',
        },
        body: json.encode(productData),
      );

      if (response.statusCode == 200) {
        _showSnackBar('Sản phẩm đã được thêm vào cửa hàng!');
        widget.onClose();
        widget.onImportSuccess();
      } else {
        throw Exception('Failed to add product');
      }
    } catch (error) {
      _showSnackBar('Lỗi khi thêm sản phẩm: $error');
    } finally {
      setState(() => loading = false);
    }
  }

  // Hàm chọn ảnh từ thư viện
  Future<void> pickImage(String color) async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      uploadImage(File(pickedFile.path), color);
    }
  }

  // Hiển thị thông báo
  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.open) return const SizedBox.shrink();

    return Scaffold(
      appBar: AppBar(title: const Text("Thêm sản phẩm")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildTextField('Tên sản phẩm', (value) => title = value),
              _buildTextField('Giá', (value) => price = double.tryParse(value) ?? 0, isNumber: true),
              _buildTextField('Url ảnh', (value) => imagePath = value),
              _buildTextField('Đánh giá trung bình', (value) => averageRating = double.tryParse(value) ?? 0, isNumber: true),
              _buildTextField('Mã sản phẩm', (value) => code = value),
              _buildTextField('Thương hiệu', (value) => brand = value),
              _buildTextField('Mô tả', (value) => description = value),
              const SizedBox(height: 16),

              // Thêm trường cho size
              const Text("Chọn kích thước:"),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: sizes.map((size) {
                  return Column(
                    children: [
                      GestureDetector(
                        onTap: () => setState(() {
                          variants['size']![size] = size;
                        }),
                        child: Container(
                          width: 60,
                          height: 60,
                          decoration: BoxDecoration(
                            color: Colors.grey,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: variants['size']!.containsKey(size)
                                  ? Colors.green
                                  : Colors.grey,
                            ),
                          ),
                          child: Center(child: Text(size)),
                        ),
                      ),
                    ],
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),

              // Thêm trường cho thin
              const Text("Chọn độ mỏng:"),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: thins.map((thin) {
                  return Column(
                    children: [
                      GestureDetector(
                        onTap: () => setState(() {
                          variants['thin']![thin] = thin;
                        }),
                        child: Container(
                          width: 60,
                          height: 60,
                          decoration: BoxDecoration(
                            color: Colors.grey,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: variants['thin']!.containsKey(thin)
                                  ? Colors.green
                                  : Colors.grey,
                            ),
                          ),
                          child: Center(child: Text(thin)),
                        ),
                      ),
                    ],
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),

              // Thêm trường cho màu sắc
              const Text("Chọn ảnh theo màu:"),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: colors.map((color) {
                  return Column(
                    children: [
                      GestureDetector(
                        onTap: () => pickImage(color),
                        child: Container(
                          width: 60,
                          height: 60,
                          decoration: BoxDecoration(
                            color: Color(int.parse(color.replaceAll('#', '0xFF'))),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: uploadedImages.containsKey(color)
                                  ? Colors.green
                                  : Colors.grey,
                            ),
                          ),
                        ),
                      ),
                      if (uploadedImages.containsKey(color))
                        Image.network(uploadedImages[color]!, width: 60, height: 60),
                    ],
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),

              loading
                  ? const Center(child: CircularProgressIndicator())
                  : ElevatedButton(
                onPressed: importProduct,
                child: const Text("Thêm vào cửa hàng"),
              ),
              OutlinedButton(
                onPressed: widget.onClose,
                child: const Text("Hủy"),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Hàm tạo TextField
  Widget _buildTextField(String label, ValueChanged<String> onChanged, {bool isNumber = false}) {
    return TextField(
      decoration: InputDecoration(labelText: label),
      keyboardType: isNumber ? TextInputType.number : TextInputType.text,
      onChanged: onChanged,
    );
  }
}
