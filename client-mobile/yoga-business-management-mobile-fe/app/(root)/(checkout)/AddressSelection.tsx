import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { BASE_URL } from "@/api/config";
import { getJwt } from "@/jwt/get-jwt";

// import MyListAddressModal from "@/app/(main)/checkout/MyListAddressModal";
interface Address {
  id: string;
  fullName: string;
  phone: string;
  additionalInfo: string;
  street: string;
  district: string;
  city: string;
  isDefault: boolean;
}

interface AddressSelectionProps {
  addresses: Address[];
  loading: boolean;
  setShippingInfo: React.Dispatch<React.SetStateAction<any>>;
  addNewAddress: (address: Address) => void;
  selectedAddressId: string;
  setSelectedAddressId: React.Dispatch<React.SetStateAction<string>>;
}

const AddressSelection: React.FC<AddressSelectionProps> = ({
  addresses,
  loading,
  setShippingInfo,
  selectedAddressId,
  setSelectedAddressId,
  addNewAddress,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [shippingInfo, setShippingInfoState] = useState<any>(null);

  const openAddModal = () => {
    setIsModalOpen(true);
    setIsListModalOpen(false);
  };

  const openListModal = () => {
    setIsListModalOpen(true);
    setIsModalOpen(false);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleAddressSelect = (address: Address) => {
    setShippingInfoState({
      fullName: address.fullName,
      phone: address.phone,
      address: {
        id: address.id,
        houseNumber: address.street,
        street: address.street,
        district: address.district,
        city: address.city,
        additionalInfo: address.additionalInfo,
      },
    });
    setSelectedAddressId(shippingInfo.address.id);
    setIsListModalOpen(false);
  };

  // Fetch the default address when component mounts
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const accessToken = await getJwt(); // Get token from localStorage
        if (!accessToken) {
          console.error("No access token found.");
          return;
        }

        const response = await fetch(
          `${BASE_URL}/api/user/get-user-address-default`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`, // Pass the token in the Authorization header
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();
        if (data.status === 200) {
          const {
            id,
            houseNumber,
            street,
            district,
            city,
            nameDelivery,
            phoneNumberDelivery,
          } = data.data;
          setShippingInfoState({
            fullName: nameDelivery,
            phone: phoneNumberDelivery,
            address: {
              id: id,
              houseNumber,
              street,
              district,
              city,
              additionalInfo: "",
            },
          });
          setSelectedAddressId(id);
        } else {
          console.error("Failed to fetch address:", data.message);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchDefaultAddress();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <LocationOnIcon style={styles.icon} /> */}
        <Text>Địa chỉ nhận</Text>
      </View>

      {loading || !shippingInfo ? (
        <View style={styles.loadingContainer}>
          {/* <Skeleton variant="text" width="60%" height={30} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="rectangular" width="100%" height={60} /> */}
        </View>
      ) : (
        <View>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              {shippingInfo.fullName} {shippingInfo.phone}
            </Text>
            {shippingInfo.address.houseNumber && (
              <Text style={styles.defaultLabel}>Mặc định</Text>
            )}
          </View>
          <Text style={styles.addressDetails}>
            {shippingInfo.address.additionalInfo},{" "}
            {shippingInfo.address.houseNumber} {shippingInfo.address.street},{" "}
            {shippingInfo.address.district}, {shippingInfo.address.city}
          </Text>
        </View>
      )}

      {/* <TouchableOpacity onPress={openListModal} style={styles.button}>
                <Text style={styles.buttonText}>Chọn địa chỉ</Text>
            </TouchableOpacity> */}

      {/* {isModalOpen && (
                <AddAddressModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    addNewAddress={addNewAddress}
                />
            )} */}

      {/* {isListModalOpen && (
                <MyListAddressModal
                    addresses={addresses}
                    isModalOpen={isListModalOpen}
                    closeModal={() => setIsListModalOpen(false)}
                    onAddressSelect={handleAddressSelect}
                    openAddAddressModal={openAddModal}
                />
            )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 24,
    color: "#ee4d2d",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#ff6f00",
  },
  loadingContainer: {
    marginTop: 10,
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  addressText: {
    fontWeight: "bold",
  },
  defaultLabel: {
    borderColor: "#ee4d2d",
    borderWidth: 1,
    borderRadius: 3,
    color: "#ee4d2d",
    fontSize: 10,
    padding: 4,
    marginRight: 2,
  },
  addressDetails: {
    marginTop: 10,
    fontSize: 14,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#9e9e9e",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddressSelection;
