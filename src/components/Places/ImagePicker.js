import { View, Text, StyleSheet, Alert, Image } from "react-native";
import {
  launchCameraAsync,
  PermissionStatus,
  useCameraPermissions,
} from "expo-image-picker";
import { Colors } from "../../constants/colors";
import { useState } from "react";
import OutlinedButton from "../UI/OutlineButton";

const ImagePicker = () => {
  const [image, setImage] = useState(null);

  const [cameraPermissionInformation, requestPermission] = useCameraPermissions();

  const verifyPermission = async () => {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permission !",
        "You need to grant camera permission to this App"
      );
      return false;
    }

    return true;
  };

  const takeImageHandler = async () => {
   const hasPermission = await verifyPermission();

   if(!hasPermission) {
    return
   }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    setImage(image.uri);
  };

  let imagePreview = <Text style={styles.noImageText}>No Image Taken Yey.</Text>

  if(image) {
    imagePreview = <Image style={styles.image} source={{uri: image}} />
  }
  return (
    <View>
      <View style={styles.imagePreview}>
        {imagePreview}
      </View>
      <OutlinedButton  onPress={takeImageHandler} icon="camera"> Take Image </OutlinedButton>
    </View>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary500,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  image: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.primary100,
    borderWidth: 2,
    borderRadius: 7,
    resizeMode: "cover",
    marginVertical: 8,
  },
  noImageText: {
    fontSize: 16,
    color: Colors.primary500,
    textAlign: "center",
    marginVertical: 10,
  },
});
