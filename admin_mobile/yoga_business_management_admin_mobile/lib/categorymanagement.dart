import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'config.dart';
import 'storage.dart';

class CategoryManagement extends StatefulWidget {
  const CategoryManagement({Key? key}) : super(key: key);

  @override
  _CategoryManagementState createState() => _CategoryManagementState();
}

class _CategoryManagementState extends State<CategoryManagement> {
  final TextEditingController _categoryController = TextEditingController();
  final TextEditingController _subcategoryController = TextEditingController();

  List<Map<String, dynamic>> categories = [];
  bool isLoading = false;
  int currentPage = 0;
  int rowsPerPage = 5;
  String? selectedCategoryName;
  int? selectedCategoryId;

  @override
  void initState() {
    super.initState();
  }

  Future<List<Map<String, dynamic>>> fetchCategories() async {
    try {
      final url = Uri.parse(
          '${Config.apiUrl}/api/admin/get-all-category');
      String? accessToken = await getToken();
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer ${accessToken}',
        },
      );

      if (response.statusCode == 200) {
        final data = utf8.decode(response.bodyBytes);
        final jsonData = json.decode(data);

        return List<Map<String, dynamic>>.from(jsonData['data']);
      } else {
        showError('Failed to fetch categories.');
        return [];
      }
    } catch (e) {
      showError('Failed to fetch categories.');
      return [];
    }
  }

  Future<void> createCategory() async {
    if (_categoryController.text.isEmpty) {
      showError('Category name is required.');
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      final url = Uri.parse('${Config.apiUrl}/api/admin/add-category');
      String? accessToken = await getToken();
      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer ${accessToken}',
          'Content-Type': 'application/json',
        },
        body: json.encode({'name': _categoryController.text}),
      );

      if (response.statusCode == 200) {
        showSuccess('Category created successfully!');
        _categoryController.clear();
        setState(() {});
      } else {
        showError('Failed to create category.');
      }
    } catch (e) {
      showError('Failed to create category.');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> createSubcategory() async {
    if (_subcategoryController.text.isEmpty || selectedCategoryId == null) {
      showError('Please select a category and enter a subcategory name.');
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      final url = Uri.parse('${Config.apiUrl}/api/admin/add-subcategory');
      String? accessToken = await getToken();
      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer ${accessToken}',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'name': _subcategoryController.text,
          'categoryId': selectedCategoryId
        }),
      );

      if (response.statusCode == 200) {
        showSuccess('Subcategory created successfully!');
        _subcategoryController.clear();
        Navigator.pop(context);
        setState(() {});
      } else {
        showError('Failed to create subcategory.');
      }
    } catch (e) {
      showError('Failed to create subcategory.');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }


  void showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message), backgroundColor: Colors.red));
  }

  void showSuccess(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message), backgroundColor: Colors.green));
  }

  void openDialog(int id, String name) {
    setState(() {
      selectedCategoryId = id;
      selectedCategoryName = name;
    });

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text('Add Subcategory for $name'),
        content: TextField(
          controller: _subcategoryController,
          decoration: const InputDecoration(labelText: 'Subcategory Name'),
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel')),
          ElevatedButton(onPressed: createSubcategory, child: const Text('Create')),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Category Management'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: FutureBuilder<List<Map<String, dynamic>>>(
          future: fetchCategories(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snapshot.hasError) {
              return Center(
                  child: Text(
                      'An error occurred while fetching categories: ${snapshot.error}'));
            }

            categories = snapshot.data ?? [];
            return SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextField(
                    controller: _categoryController,
                    decoration: const InputDecoration(labelText: 'Category Name'),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton(
                    onPressed: isLoading ? null : createCategory,
                    child: const Text('Create Category'),
                  ),
                  const SizedBox(height: 20),
                  categories.isEmpty
                      ? const Center(child: Text('No categories available'))
                      : DataTable(
                    columns: const [
                      DataColumn(label: Text('ID')),
                      DataColumn(label: Text('Name')),
                      DataColumn(label: Text('Actions')),
                    ],
                    rows: categories
                        .map(
                          (category) => DataRow(
                        cells: [
                          DataCell(Text(category['id'].toString())),
                          DataCell(Text(category['name'])),
                          DataCell(
                            ElevatedButton(
                              onPressed: () => openDialog(
                                  category['id'], category['name']),
                              child: const Text('Add Subcategory'),
                            ),
                          ),
                        ],
                      ),
                    )
                        .toList(),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
