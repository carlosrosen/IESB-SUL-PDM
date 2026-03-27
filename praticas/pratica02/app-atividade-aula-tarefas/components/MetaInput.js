import { Button, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import { useState } from 'react';

import { 
  rotulo_btn_cadastro_meta, 
  rotulo_input_meta 
} from '../mensagens';

function MetaInput(props){
    const [inputMetaText, setInputMetaText] = useState("");

    function metaInputHandler(inputText){
        setInputMetaText(inputText)
    }

    function addMetaHandler(){
        props.onAddMeta(inputMetaText);
        setInputMetaText("");
    }

    return (
        <View style={{  flexDirection: 'row', justifyContent: 'space-between', flex:1 }}>
        <View style={{width: '65%'}}>
          <TextInput style={styles.inputText} 
          onChangeText={metaInputHandler}
          placeholder={rotulo_input_meta} />
        </View>
        <View style={{width:'30%'}}>
          <Button title={rotulo_btn_cadastro_meta}
          onPress={addMetaHandler} />
        </View>
      </View>
    );
};

export default MetaInput;

const styles = StyleSheet.create({
    inputText: {
    borderWidth: 1,
    borderColor: '#cccccc',
  },
});