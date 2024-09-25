import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { proFile } from "@/api/profile";
const Profile = () => {
  const [profileData, setProfileData] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    city: "",
    street: "",
    state: "",
  });
  const [updatedData, setUpdatedData] = useState({ ...profileData });
  const handleSave = async () => {
    const response = await proFile(profileData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.label}>Full Name:</Text>
        <TextInput
          style={styles.input}
          value={updatedData.fullname}
          onChangeText={(text) =>
            setUpdatedData({ ...updatedData, fullname: text })
          }
        />

        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={updatedData.username}
          onChangeText={(text) =>
            setUpdatedData({ ...updatedData, username: text })
          }
        />

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={updatedData.email}
          onChangeText={(text) =>
            setUpdatedData({ ...updatedData, email: text })
          }
        />

        <Text style={styles.label}>Phone:</Text>
        <TextInput
          style={styles.input}
          value={updatedData.phone}
          onChangeText={(text) =>
            setUpdatedData({ ...updatedData, phone: text })
          }
        />

        <Text style={styles.label}>City:</Text>
        <TextInput
          style={styles.input}
          value={updatedData.city}
          onChangeText={(text) =>
            setUpdatedData({ ...updatedData, city: text })
          }
        />

        <Text style={styles.label}>Street:</Text>
        <TextInput
          style={styles.input}
          value={updatedData.street}
          onChangeText={(text) =>
            setUpdatedData({ ...updatedData, street: text })
          }
        />

        <Text style={styles.label}>State:</Text>
        <TextInput
          style={styles.input}
          value={updatedData.state}
          onChangeText={(text) =>
            setUpdatedData({ ...updatedData, state: text })
          }
        />

        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileContainer: {
    marginTop: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    padding: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#5995fd",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default Profile;
