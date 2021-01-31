import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import firebase from "firebase";
import db from "../config";
import { Icon } from "react-native-elements";

export default class CustomSideBarMenu extends Component {
  state = {
    userId: firebase.auth().currentUser.email,
    image: "#",
    name: "",
    docId: "",
  };

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.uploadImage(uri, this.state.userId);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName)
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: "#" });
      });
  };

  getUserProfile() {
    db.collection("Users")
      .where("emailId", "==", this.state.userId)
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          this.setState({
            name: doc.data().firstName + " " + doc.data().lastName,
          });
        });
      });
  }

  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 0.3,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "green",
          }}
        >
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size={"xlarge"}
            onPress={() => this.selectPicture()}
            showEditButton
          />

          <Text
            style={{
              fontWeight: "300",
              fontSize: 30,
              color: "#fff",
              padding: 10,
            }}
          >
            {this.state.name}
          </Text>
        </View>
        <View style={{ flex: 0.6 }}>
          <DrawerItems {...this.props} />
        </View>
        <View style={{ flex: 0.1 }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              width: "100%",
              height: "100%",
            }}
            onPress={() => {
              this.props.navigation.navigate("WelcomeScreen");
              firebase.auth().signOut();
            }}
          >
            <Text style={styles.logOutText}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  logOutContainer: {
    flex: 0.2,
    justifyContent: "flex-end",
    paddingBottom: 30,
    flexDirection: "row",
  },
  logOutButton: {
    height: 30,
    width: "85%",
    justifyContent: "center",
    padding: 10,
  },
  imageContainer: {
    flex: 0.75,
    width: "40%",
    height: "20%",
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
  logOutText: {
    fontSize: 30,
    fontWeight: "bold",
  },
});
