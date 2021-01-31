import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import Amplify from 'aws-amplify'
import config from './aws-exports'


// import logo from './logo.svg';
import './App.css';

import Index from './views/Index/Index';

Amplify.configure(config)

function App() {
  return (

      <Index />
         

  );
}

export default withAuthenticator(App);
