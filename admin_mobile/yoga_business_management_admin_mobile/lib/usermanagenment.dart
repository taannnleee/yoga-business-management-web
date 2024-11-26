import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'config.dart';
import 'storage.dart';

class UserManagement extends StatefulWidget {
  const UserManagement({Key? key}) : super(key: key);

  @override
  _UserManagementState createState() => _UserManagementState();
}

class _UserManagementState extends State<UserManagement> {
  bool loading = false;
  int page = 1;
  int totalPage = 0;
  List<User> users = [];
  List<int> selectedUsers = [];

  // Replace with your backend URL
  final String apiUrl = '${Config.apiUrl}/api/admin/getAllUser';


  @override
  void initState() {
    super.initState();
    getAllUser();
  }

  Future<void> getAllUser() async {
    setState(() {
      loading = true;
    });

    try {
      String? accessToken = await getToken();

      final response = await http.get(
        Uri.parse(apiUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $accessToken',
        },
      );

      if (response.statusCode == 200) {

        final data = json.decode(response.body);
        print("tantan0");
        print(data);
        setState(() {
          print("tantan1");
          users = List<User>.from(data['data'].map((x) => User.fromJson(x)));
          print("tantan2");
          print(users);
          totalPage = data['totalPage'];
        });
      }
    } catch (error) {
      print('Error fetching users: $error');
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  Future<void> handleActivateUser(String id) async {
    try {
      String? accessToken = await getToken();
      final response = await http.put(
        Uri.parse('$apiUrl/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $accessToken',
        },
        body: json.encode({'isActive': true}),
      );

      if (response.statusCode == 200) {
        setState(() {
          getAllUser();
        });
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('User activated')));
      }
    } catch (e) {
      print('Error activating user: $e');
    }
  }

  Future<void> handleDeactivateUser(String id) async {
    try {
      String? accessToken = await getToken();
      final response = await http.put(
        Uri.parse('$apiUrl/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $accessToken',
        },
        body: json.encode({'isActive': false}),
      );

      if (response.statusCode == 200) {
        setState(() {
          getAllUser();
        });
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('User deactivated')));
      }
    } catch (e) {
      print('Error deactivating user: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('User Management')),
      body: loading
          ? Center(child: CircularProgressIndicator())
          : Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("User List", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                Row(
                  children: [
                    IconButton(
                      icon: Icon(Icons.arrow_back),
                      onPressed: page > 1
                          ? () {
                        setState(() {
                          page--;
                        });
                        getAllUser();
                      }
                          : null,
                    ),
                    Text("$page"),
                    IconButton(
                      icon: Icon(Icons.arrow_forward),
                      onPressed: page < totalPage
                          ? () {
                        setState(() {
                          page++;
                        });
                        getAllUser();
                      }
                          : null,
                    ),
                  ],
                )
              ],
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                columns: [
                  DataColumn(label: Text('ID')),
                  DataColumn(label: Text('Username')),
                  DataColumn(label: Text('Email')),
                  DataColumn(label: Text('Role')),
                  DataColumn(label: Text('Status')),
                  DataColumn(label: Text('Actions')),
                ],
                rows: users.map((user) {
                  return DataRow(
                    selected: selectedUsers.contains(user.id),
                    onSelectChanged: (isSelected) {
                      setState(() {
                        if (isSelected ?? false) {
                          selectedUsers.add(user.id as int);
                        } else {
                          selectedUsers.remove(user.id);
                        }
                      });
                    },
                    cells: [
                      DataCell(Text(user.id.toString())),
                      DataCell(Text(user.username)),
                      DataCell(Text(user.email)),
                      DataCell(Text(user.roles)),
                      DataCell(Text(user.isActive ? 'Active' : 'Inactive')),
                      DataCell(
                        Row(
                          children: [
                            IconButton(
                              icon: Icon(Icons.toggle_on),
                              onPressed: user.isActive
                                  ? () => handleDeactivateUser(user.id as String )
                                  : () => handleActivateUser(user.id as String),
                            ),
                          ],
                        ),
                      ),
                    ],
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class User {
  final int id; // Thay String thành int
  final String username;
  final String email;
  final String roles;
  final bool isActive;

  User({
    required this.id,
    required this.username,
    required this.email,
    required this.roles,
    required this.isActive,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? 0, // Gán giá trị mặc định nếu null
      username: json['username'] ?? '', // Gán chuỗi rỗng nếu null
      email: json['email'] ?? '', // Gán chuỗi rỗng nếu null
      roles: json['roles'] ?? '', // Gán chuỗi rỗng nếu null
      isActive: json['isActive'] ?? false, // Gán false nếu null
    );
  }
}