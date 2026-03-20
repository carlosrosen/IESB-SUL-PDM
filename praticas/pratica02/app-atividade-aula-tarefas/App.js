import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';

import { 
  rotulo_btn_cadastro_meta, 
  rotulo_lista_metas, 
  rotulo_input_meta 
} from './mensagens';

import { useState } from 'react';

import MetasList from './components/MetasList';

export default function App() {

  const [inputMetaText, setInputMetaText] = useState('');
  const [metas, setMetas] = useState([]);

  function metaInputHandler(inputText){
    setInputMetaText(inputText)
  }

  function adicionarMetaHandler(){
    setMetas([...metas, inputMetaText]);
  }

  return (
    <View style={styles.mainContainer}>
      <View style={{  flexDirection: 'row', justifyContent: 'space-between', flex:1 }}>
        <View style={{width: '65%'}}>
          <TextInput style={styles.inputText} 
          onChangeText={metaInputHandler}
          placeholder={rotulo_input_meta} />
        </View>
        <View style={{width:'30%'}}>
          <Button title={rotulo_btn_cadastro_meta}
          onPress={adicionarMetaHandler} />
        </View>
      </View>
      <View style={styles.metaContainer}>
        <MetasList array={metas} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    padding: 30,
    flex: 1,
    flexDirection: 'column',
  },
  inputText: {
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  metaContainer: {
    flex: 15,
  },
});
