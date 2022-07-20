import { VStack } from 'native-base';

//Componentes
import { Input } from '../components/Input';
import { Header } from '../components/Header';
import { Button } from '../components/Button';


export function Register() {
  return (
    <VStack flex={1} p={6} bg="gray.600">

        <Header title='Nova Solicitação'/>

        <Input
            placeholder='Numero do patrimonio'
            mt={4}
        />

        <Input
            placeholder='Descrição do Problema'
            flex={1}
            mt={5}
            multiline
            textAlignVertical='top'  
        />

        <Button
            title='Cadastrar'
            mt={5}
        />

    </VStack>
  );
}