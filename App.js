import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { firebase } from './config'
import { TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { FlatList } from 'react-native';

export default function App() {
  // Establish a connection from our app to our Firestore Collection
  // Firestore Collection is similar to an SQLite Table
  const appRef = firebase.firestore().collection('myTable')
  
  // Using useEffect, the function to pull data from the database will be called
  useEffect(() => {
    pullDataFromFirestore()
  }, [] // Only limits useEffect to run once
  )

  // Variable that will store the user input
  const [userInput, setUserInput] = useState('')
  // Function that will add the userInput to the Firestore Database
  const pushToFirebase = () => {
    // Validation: If the TextInput/userInput is empty
    if (!userInput) {
      alert('Empty fields detected')
      return
    }
    // Create a variable that would store when the data is pushed into the database
    // This variable can be used to organize the data that you will fetch later on by order (ascending/descending)
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    // Create a variable that would store all the data that we need to push to the database
    const container = {
      // Column name : value
      createdAt: timestamp,
      userInput: userInput
    }

    // Push the data into the Firestore Database
    appRef.add(container).then(() => {
      // A confirmation message
      alert('Successfully added!')
      // Resets the TextInput value
      setUserInput('')
      // Dismisses the Keyboard
      Keyboard.dismiss()
    })
    // Catch error if there will be any
    .catch((error) => {console.log(error)})
  }

  // Variable that will store the pulled data
  const [pulledData, setPulledData] = useState([])
  // Function to pull data from the database
  const pullDataFromFirestore = () => {
    // This is where the timestamp variable from adding/pushing data to the database comes into play
    // orderBy('createdAt','desc') - display the latest added data to the oldest
    appRef.orderBy('createdAt','desc').onSnapshot(
      querySnapshot => {
        // Variable that will store the pulled data from the database
        const dataContainer = []
        querySnapshot.forEach((document) => {
          // Variable that will store the values pulled from the columns provided
          const { createdAt, userInput } = document.data()

          // Push the pulled data into our container
          dataContainer.push({
            // Id is not included in const { createdAt, userInput } = document.data() because it is not inside the collection but the identifier for the document where { createdAt, userInput } is stored.
            id: document.id,
            userInput,
            createdAt
          })
          // Sets the pulled data to our useState array so that our Flatlist will be able to access it
          setPulledData(dataContainer)
        })
      }
    )
  }

  // Function to delete data from the database
  const deleteFromFirestore = (id) => {
    appRef.doc(id).delete().then(() => {
      alert('Successfully deleted.')
    })
    .catch((error) => {console.log(error)})
  }

  // Variable that will store the new input
  const [userInputNew, setUserInputNew] = useState('')
  // Variable that will store the id of the selected data
  const [dataID, setDataID] = useState('')
  // Function that will update the data to the database
  const updateFirestoreData = () => {
    appRef.doc(dataID).update({
      // Column Name: Value
      userInput : userInputNew
    })
    .then(() => {
      alert('Data updated')
      setUserInputNew('')
      Keyboard.dismiss()
    })
    .catch((error) => {console.log(error)})
  }
  return (
    <View style={styles.container}>
      <View style={{width: '100%', paddingTop: 16}}>
        <Text>Add New Data</Text>
        <TextInput 
          placeholder='Enter Text Here'
          style={styles.inputText}
          // Sets the entered value to the variable userInput
          onChangeText={(val) => setUserInput(val)}
          value={userInput}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={pushToFirebase}
        >
          <Text>Add to Database</Text>
        </TouchableOpacity>
      </View>
      <View style={{width: '100%', paddingTop: 16}}>
        <Text>Update Data</Text>
        <TextInput 
          placeholder='Enter Text Here'
          style={styles.inputText}
          value={userInputNew}
          onChangeText={setUserInputNew}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={updateFirestoreData}
        >
          <Text>Update Data</Text>
        </TouchableOpacity>
      </View>
      <View style={{paddingTop: 16, flex: 1}}>
        <FlatList 
          data={pulledData}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginVertical: 4
              }}
            >
              <Text>{ item.userInput }</Text>
              <View
                style={{
                  flexDirection: 'row'
                }}
              >
                <TouchableOpacity
                  style={{
                    marginRight: 8,
                    backgroundColor: '#E5625E',
                    padding: 8,
                    borderRadius: 8
                  }}
                  // CAREFUL! If you call the function like this: onPress={function}, it will delete everything in the database (Keep iterating until no data is left)
                  onPress={() => {deleteFromFirestore(item.id)}}
                >
                  <Text>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginRight: 8,
                    backgroundColor: '#BBB567',
                    padding: 8,
                    borderRadius: 8
                  }}
                  onPress={() => {
                    setDataID(item.id),
                    setUserInputNew(item.userInput)
                  }}
                >
                  <Text>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 35
  },
  inputText: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    fontSize: 16,
    width: '100%'
  },
  submitButton: {
    backgroundColor: 'gray',
    padding: 16,
    alignItems: 'center',
    width: '100%',
    borderRadius: 8,
    marginTop: 8
  }
});
