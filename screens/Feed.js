import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback
  } from 'react';
  import { TouchableOpacity, StyleSheet, Text, View, Button, Image, TextInput, RefreshControlBase } from 'react-native';
  import {
    collection,
    orderBy,
    query,
    where,
    getDocs
    } from 'firebase/firestore';
  import { signOut } from 'firebase/auth';
  import { auth, database } from '../config/firebase';


  
  export default function Feed({ navigation }) {
    const onSignOut = () => {
      signOut(auth).catch(error => console.log('Error logging out: ', error));
    };

    const[feed, setFeed] = useState({
      user: '',
      emojiStatus: '',
      questionAnswer: ''
    });
    const[friendList, setFriendList] = useState([]);
    const[friendFeed, setFriendFeed] = useState({
      user: '',
      emojiStatus: '',
      questionAnswer: ''
    });
    const[friendStatus, setFriendStatus] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 10
              }}
              onPress={onSignOut}
            >
              <Text>Logout</Text>
            </TouchableOpacity>
          )
        });
      }, [navigation]);

    const getStatus = async() => {
      const collectionRef = collection(database, 'status');
      const q = query(collectionRef, orderBy('date'), where("user", "==", auth?.currentUser?.email));
      const querySnapshot = await getDocs(q);
      const yourStatus = querySnapshot.docs[querySnapshot.docs.length - 1].data()
      setFeed({ user: yourStatus.user, emojiStatus: yourStatus.emojiStatus, questionAnswer: yourStatus.questionAnswer })
    }


    const getAllFriends = async() => {
      const collectionRef = collection(database, 'friendlist');
      const q = query(collectionRef, where("user", "==", auth?.currentUser?.email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setFriendList(prevFriends => prevFriends.concat(doc.data().friend))
      })
      console.log(friendList);
    }

    const getFriendStatus = async() => {
      for (i = 0; i < friendList.length; i++){
        const collectionRef = collection(database, 'status');
        const q = query(collectionRef, orderBy('date'), where("user", "==", friendList[i]));
        const querySnapshot = await getDocs(q);
        if (typeof querySnapshot !== 'undefined') {
          const yourStatus = querySnapshot.docs[querySnapshot.docs.length - 1].data()
          setFriendStatus(prev => 
            prev.concat([{ user: yourStatus.user, emojiStatus: yourStatus.emojiStatus,
               questionAnswer: yourStatus.questionAnswer }]))
        }
      };
    }

    const onRefresh = () => {
      getStatus();
      getAllFriends();
      getFriendStatus();
    }

    const statusList = friendStatus.map(info => (
      <View key={info.user}>
        <Text style={styles.info}>{info.user}</Text>
        <Text style={styles.info}>{info.emojiStatus}</Text>
        <Text style={styles.info}>{info.questionAnswer}</Text>
        <Text></Text>
      </View>
    ));


    return (
      <View style={styles.container}>
        <Button onPress={() => onRefresh()} color='#f57c00' title='Refresh' />
        <Text style={styles.title}>Your Status</Text>
        <Text style={styles.info}>{feed.user}</Text>
        <Text style={styles.info}>{feed.emojiStatus}</Text>
        <Text style={styles.info}>{feed.questionAnswer}</Text>
        <Text></Text>
        <Text style={styles.title}>Your Friends</Text>
        {statusList}
        <Button onPress={() => navigation.navigate('Friend')} color='#f57c00' title='Add Friend' />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 50,
      fontSize: 24,
      paddingHorizontal: 12
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: '#444',
      alignSelf: 'center',
      paddingBottom: 24
    },
    input: {
      backgroundColor: '#fff',
      marginBottom: 20,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#333',
      borderRadius: 8,
      padding: 12
    },
    info: {
      textAlign: 'center',
      padding: 2.5
    }
  });