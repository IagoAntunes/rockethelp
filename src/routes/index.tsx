import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { Loading } from '../components/Loading';
import { AppRoutes } from './app.routes' ;
import { SignIn } from '../screens/SignIn';

export function Routes() {
  const [loading, setIsLoading] = useState(true);//AAnotar se ta carregando
  const [user, setUser] = useState<FirebaseAuthTypes.User>();//Se usuario esta autenticado

  useEffect(() =>{
     const subscriber = auth().onAuthStateChanged(response =>{
        setUser(response);
        setIsLoading(false);
     })

     return subscriber;
  },[]);

  if(loading){
    return <Loading/>
  }

  return (
    <NavigationContainer>
        {user ? <AppRoutes/> : <SignIn/>}
    </NavigationContainer>
  );
}