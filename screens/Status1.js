import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback
  } from 'react';
  import { TouchableOpacity, StyleSheet, Text, View, Button, TextInput } from 'react-native';
  import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot
  } from 'firebase/firestore';
  import { signOut } from 'firebase/auth';
  
  import { auth, database } from '../config/firebase';
  import EmojiBoard from 'react-native-emoji-board'

  
  export default function Status1({ navigation }) {
    const onSignOut = () => {
      signOut(auth).catch(error => console.log('Error logging out: ', error));
    };
    
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
    
    const [emojiStatus, setEmojiStatus] = useState();
    const [questionAnswer, setQuestionAnswer] = useState('');
    const [show, setShow] = useState(false);
    const onClick = emoji => {
        setEmojiStatus(emoji.code);
    };
    const IconType = {
        material: 'material',
        fontAwesome: 'fontAwesome'
    };
    const category = [
        {
            name: 'Smileys & Emotion',
            iconType: IconType.material,
            icon: 'sticker-emoji'
        }]
    
    return (
      <View style={styles.container}>
        <Text>Choose your emoji mood for today!</Text>
        <Text>{emojiStatus}</Text>
        <Button onPress={() => setShow(!show)} color='#f57c00' title='Select' />
        <EmojiBoard showBoard={show} onClick={onClick} categories={category}/>
        <Text>What are you most looking forward to today?</Text>
        <TextInput
          style={styles.input}
          placeholder='Answer'
          autoCapitalize='none'
          keyboardType='email-address'
          textContentType='emailAddress'
          autoFocus={true}
          value={questionAnswer}
          onChangeText={text => setQuestionAnswer(text)}
        />
        <Button onPress={() => navigation.navigate('Status2')} color='#f57c00' title='Next' />
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