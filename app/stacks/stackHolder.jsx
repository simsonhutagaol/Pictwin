import { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, Text, Image, View } from "react-native";
import * as SecureStore from "expo-secure-store";

import { LoginContext } from "../contexts/LoginContext";
import Home from "../screens/homeScreen";
import Profile from "../screens/profileScreen";
import Search from "../screens/searchScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import LoginScreen from "../screens/loginScreen";
import RegisterScreen from "../screens/registerScreen";
import NewPost from "../screens/newPostScreen";
import DetailPost from "../screens/detailPost";
import DetailProfile from "../screens/detailProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


export default function StackHolder(){
  const { isLoggedIn } = useContext(LoginContext);

  return(
      <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator initialRouteName="Tab">
          <Stack.Screen
            name="Tab"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DetailProfile"
            component={DetailProfile}
            options={({ navigation }) => ({
              title: "",
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons
                    name="close"
                    size={25}
                    color="black"
                    style={{ marginLeft: 10 }}
                  />
                </TouchableOpacity>
              ),
              headerBackTitleVisible: false,
              tabBarLabel: "",
            })}
          />
          <Stack.Screen
            name="DetailPost"
            component={DetailPost}
            options={({ navigation }) => ({
              title: "",
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons
                    name="close"
                    size={25}
                    color="black"
                    style={{ marginLeft: 10 }}
                  />
                </TouchableOpacity>
              ),
              headerBackTitleVisible: false,
              tabBarLabel: "",
            })}
          />
        </Stack.Navigator>
        
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}

function TabNavigator() {
  const { setIsLoggedIn } = useContext(LoginContext);

  const handleLogout = async()=>{
     await SecureStore.deleteItemAsync("token");
      setIsLoggedIn(false);
  }
  return (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Search") {
          iconName = focused ? "search" : "search-outline";
        } else if (route.name === "AddPost") {
          iconName = focused ? "add-circle" : "add-circle-outline";
        } else if (route.name === "Profile") {
          iconName = focused
            ? "person-circle"
            : "person-circle-outline";
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "orange",
      tabBarInactiveTintColor: "black",
    })}
  >
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarLabel: "",
        headerTitle: "Pictwin 📸",
      }}
    />

    <Tab.Screen
      name="Search"
      component={Search}
      options={{ tabBarLabel: "",headerTitle: "Search User 📸" }}

    />
    
    <Tab.Screen
      name="AddPost"
      component={NewPost}
      options={({ navigation }) => ({
        title: "New Post",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Ionicons
              name="close"
              size={25}
              color="black"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        ),
        headerBackTitleVisible: false,
        tabBarLabel: "",
      })}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={({navigation})=>({
        headerTitle: "My profile 📸",
        tabBarLabel: "",
        headerRight:()=>(
          <Text style={{
            width: 100,
            height: 20,
            marginRight: 15 ,
            textAlign:"center"
          }} onPress={handleLogout}>Logout</Text>
        ),
      })}
    />
  </Tab.Navigator>
  );
}