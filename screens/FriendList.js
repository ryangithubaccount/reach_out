import React, {
    useState,
    useLayoutEffect,
    useEffect,
    useCallback
  } from 'react';
  import { TouchableOpacity, StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
  import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot
  } from 'firebase/firestore';
  import { signOut } from 'firebase/auth';
  
  import { auth, database } from '../config/firebase';
  
  export default function FriendDisplay({ navigation }) {
    const onSignOut = () => {
      signOut(auth).catch(error => console.log('Error logging out: ', error));
    };
    const [friend_name, setFriendName] = useState();
    const [friends, setFriends] = useState(
      {
        user : 'default',
        friend : ''
      }
    );
  /*
    useEffect(() => {
      const collectionRef = collection(database, 'friendlist');
      const q = query(collectionRef, orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, querySnapshot => {
        setFriends(
          querySnapshot.docs.map(doc => ({
            user: doc.data().user,
            friend: doc.data().friend
          }))
        );
      });
  
  return unsubscribe;
    });
  */
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
  
    const onAdd = (new_friend) => {
      console.log(new_friend.friend_name)
      if (typeof new_friend.friend_name === 'undefined') {
        Alert.alert(
          'No name entered',
          'Please enter a username when adding to your friend list',
          [
            {
              text: 'Understood',
              style: 'cancel',
            },
          ],
          {cancelable: true},
        );
      }
      else{
        setFriends(
          {user: auth?.currentUser?.email, friend: new_friend.friend_name}
        );
        const { user, friend } = friends;    
        console.log(friends);
        addDoc(collection(database, 'friendlist'), {
          user,
          friend
        });
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Friends!</Text>
        <TextInput
          style={styles.input}
          placeholder='Enter friend username'
          autoCapitalize='none'
          keyboardType='email-address'
          textContentType='emailAddress'
          autoFocus={true}
          value={friend_name}
          onChangeText={text => setFriendName(text)}
        />
        <Button onPress={() => onAdd({friend_name})} color='#f57c00' title='Add Friend' />
        <Button
          onPress={() => navigation.navigate('Chat')}
          title='Go to Chat'
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 50,
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
    }
  });