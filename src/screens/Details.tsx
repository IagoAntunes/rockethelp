import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'

import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { VStack ,Text, HStack, useTheme, ScrollView, Box} from 'native-base';
import { color } from 'native-base/lib/typescript/theme/styled-system';
import {CircleWavyCheck, Hourglass, DesktopTower, Clipboard } from 'phosphor-react-native'


import { CardDetails } from '../components/CardDetails';
import { Loading } from '../components/Loading';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormat';
type RouteParams = {
  orderId: string;
}
type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState('');
  const [order,setOrder] = useState<OrderDetails>({} as OrderDetails);

  const navigation = useNavigation();
  const {colors} = useTheme();
  const route = useRoute();
  const {orderId} = route.params as RouteParams;

  function handleOrderClose(){
    if(!solution){
      return Alert.alert('Solicitação','Informe a solução para encerrar a solicitação');
    }

    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .update({
      status: 'closed',
      solution,
      closed_at: firestore.FieldValue.serverTimestamp()
    })
    .then(()=>{
      Alert.alert('Solicitação','Solicitação encerrada.')
      navigation.goBack();
    })
    .catch((error) =>{
      console.log(error);
      Alert.alert('Soliitação','Não foi possivel encerrar a solicitação');
    })
  }


  useEffect(() => {
    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .get()
    .then((doc)=>{
      const {patrimony,description,status,created_at,closed_at,solution} = doc.data()
      const closed = closed_at ? dateFormat(closed_at): null;
 
      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed
      });
      setIsLoading(false);

    })

  })
  if(isLoading){
    return <Loading/>
  }
  return (
    <VStack flex={1} bg="gray.600">
        <Box px={5} bg='gray.600'>
          <Header title="solicitacao"/>
        </Box>
        <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === 'closed'
          ? <CircleWavyCheck size={22} color={colors.green[300]} />
          : <Hourglass size={22} color={colors.green[700]} />
        }

        <Text 
        fontSize="sm"
        color={order.status==='closed'?colors.green[300] : colors.secondary[700]}
        ml={2}
        textTransform="uppercase"
        />
        {order.status === 'closed'? 'finalizado' : 'em andamento'}
        </HStack>


        <ScrollView mx={5} showsVerticalScrollIndicator={false}>
          <CardDetails
            title='Equipamento'
            description={`Patrimonio ${order.patrimony}`}
            icon={DesktopTower}
            footer={order.when}
          />
          <CardDetails
            title='Descricao do Problema'
            description={order.description}
            icon={Clipboard}
          />
          <CardDetails
            title='Solução'
            icon={CircleWavyCheck}
            description={order.solution}
            footer={order.closed && `Encerrado em ${order.closed}`}
          />
          {
            order.status === 'open' &&
              <Input 
                placeholder='Descricao da Solução...'
                onChangeText={setSolution}
                textAlignVertical="top"
                multiline
                h={24}
              />
          } 

        </ScrollView>

        {
          order.status === 'open' &&
          <Button
            title='Encerrar Solicitação'
            m={5}
            onPress={handleOrderClose}
          />
        }

    </VStack>
  );
}