import {
  getCurrentPositionAsync,
  PermissionStatus,
  useForegroundPermissions,
} from "expo-location";
import { useState } from "react";
import { View, StyleSheet, Alert, Image, Text } from "react-native";
import { Colors } from "../../constants/colors";
import { getMapPreview } from "../../utils/location";
import OutlinedButton from "../UI/OutlineButton";

const LocationPicker = () => {
  const [pickedLocation, setPickedLocation] = useState();
  const [locationPermissionInformation, requestPermission] = useForegroundPermissions();

  const verifyPermission = async () => {
    console.log("first line in verifyPermission function ", locationPermissionInformation.status);
    if (
      locationPermissionInformation.status !== 'granted'
    ) {
      console.log("UNDETERMINED Status ");

      const permissionResponse = await requestPermission();
      console.log(
        "UNDETERMINED Status ==================> ",
        permissionResponse
      );

      return permissionResponse.granted;
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permission !",
        "You need to grant location permission to this App"
      );
      return false;
    }

    return true;
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      return;
    }

    const location = await getCurrentPositionAsync();
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude
    })
    console.log("location =======================> ", pickedLocation);
  };

  const pickMapHandler = () => {};

  let locationPreview = <Text style={styles.noImageText}>No Location Picked Yet!</Text>

  if(pickedLocation) {
    locationPreview = (
      <Image style={styles.image} source={{uri: getMapPreview(pickedLocation)}} />
    )
  }

  return (
    <View>
      <View style={styles.mapPreview}>
        {locationPreview}
      </View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
};

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4
  },
  noImageText: {
    fontSize: 16,
    color: Colors.primary500,
    textAlign: "center",
    marginVertical: 10,
  },
});
