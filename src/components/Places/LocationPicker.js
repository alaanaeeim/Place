import {useState} from 'react';
import { View, StyleSheet, Alert, Image } from "react-native";
import { Colors } from "../../constants/colors";
import OutlineButton from "../UI/OutlineButton";
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from "expo-location";
import { getMapPreview } from '../../utils/location';

const LocationPicker = () => {

    const [locationPermissionInformation, requestPermission] = useForegroundPermissions();
    const [pickedLocation, setPickedLocation] = useState();


    const verifyPermissions = async () => {
        
        if (locationPermissionInformation.status === (PermissionStatus.UNDETERMINED || PermissionStatus.DENIED)) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
          }
      
          if (locationPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
              "Insufficient permissions",
              "You need to grant Location permissions to use this feature",
              [{ text: "Okay" }]
            );
            return false;
          }
      
          return true;
    }

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const location = await getCurrentPositionAsync();
    setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      })
    console.log(location);
  };


//   const location = await getCurrentPositionAsync();
//   console.log('location from function ------------------> ', location);
//   setPickedLocation({
//     lat: location.coords.latitude,
//     lng: location.coords.longitude,
//   })
  console.log("pickedLocation --------------> ", pickedLocation);

  const pickImageHandler = () => {};

  return (
    <View>
      {pickedLocation && <View style={styles.mapPreview}>
        <Image source={{uri: getMapPreview(pickedLocation.lat, pickedLocation.lng) }} width="200" height="100" />
      </View>}
      <View style={styles.actions}>
        <OutlineButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlineButton>
        <OutlineButton icon="map" onPress={pickImageHandler}>
          Pick On Map
        </OutlineButton>
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
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
