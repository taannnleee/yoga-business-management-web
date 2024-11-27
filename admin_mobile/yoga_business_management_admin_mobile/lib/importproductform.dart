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
    setState(() => loading = true); // Show loading indicator during upload
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
          uploadedImages[color] = uploadedImageUrl;
          if (color == 'product_image') {
            imagePath = uploadedImageUrl; // Set the product image URL
          } else {
            variants['color']![color] = uploadedImageUrl;
          }
        });
        _showSnackBar('Tải ảnh lên thành công!');
      } else {
        throw Exception('Failed to upload image');
      }
    } catch (error) {
      _showSnackBar('Đã có lỗi khi tải ảnh lên: $error');
    } finally {
      setState(() => loading = false); // Hide loading indicator after upload
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
        // Clear all fields after successfully importing the product
        _clearFormFields();
      } else {
        throw Exception('Failed to add product');
      }
    } catch (error) {
      _showSnackBar('Lỗi khi thêm sản phẩm: $error');
    } finally {
      setState(() => loading = false); // Hide loading indicator after product is imported
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

  // Reset form fields after successful product import
  void _clearFormFields() {
    setState(() {
      title = '';
      imagePath = '';
      price = 0;
      averageRating = 0;
      code = '';
      brand = '';
      description = '';
      variants = {
        'size': {},
        'color': {},
        'thin': {},
      };
      uploadedImages = {};
    });
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
              // Chọn ảnh sản phẩm
              const Text('Chọn ảnh sản phẩm:'),
              GestureDetector(
                onTap: () => pickImage('product_image'),  // Chọn ảnh sản phẩm
                child: CircleAvatar(
                  radius: 50,
                  backgroundColor: Colors.grey[200],
                  child: uploadedImages.containsKey('product_image')
                      ? Image.network(uploadedImages['product_image']!, width: 80, height: 80, fit: BoxFit.cover)
                      : const Icon(Icons.add_a_photo, size: 40, color: Colors.black),
                ),
              ),
              _buildTextField('Đánh giá trung bình', (value) => averageRating = double.tryParse(value) ?? 0, isNumber: true),
              _buildTextField('Mã sản phẩm', (value) => code = value),
              _buildTextField('Thương hiệu', (value) => brand = value),
              _buildTextField('Mô tả', (value) => description = value),
              const SizedBox(height: 16),

              // Thêm trường cho size
              const Text("Chọn kích thước:"),
              Wrap(
                spacing: 16,
                children: sizes.map((size) {
                  return ChoiceChip(
                    label: Text(size),
                    selected: variants['size']!.containsKey(size),
                    onSelected: (selected) {
                      setState(() {
                        if (selected) {
                          variants['size']![size] = size;
                        } else {
                          variants['size']!.remove(size);
                        }
                      });
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),

              // Thêm trường cho thin
              const Text("Chọn độ mỏng:"),
              Wrap(
                spacing: 16,
                children: thins.map((thin) {
                  return ChoiceChip(
                    label: Text(thin),
                    selected: variants['thin']!.containsKey(thin),
                    onSelected: (selected) {
                      setState(() {
                        if (selected) {
                          variants['thin']![thin] = thin;
                        } else {
                          variants['thin']!.remove(thin);
                        }
                      });
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),

              // Thêm trường cho màu sắc
              const Text("Chọn ảnh theo màu:"),
              Wrap(
                spacing: 16,
                children: colors.map((color) {
                  return Column(
                    children: [
                      GestureDetector(
                        onTap: () => pickImage(color),
                        child: CircleAvatar(
                          radius: 30,
                          backgroundColor: Color(int.parse(color.replaceAll('#', '0xFF'))),
                          child: uploadedImages.containsKey(color)
                              ? Image.network(uploadedImages[color]!, width: 50, height: 50)
                              : const SizedBox.shrink(),
                        ),
                      ),
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
