import React from 'react';
import { client } from "./ apollo/init-apollo";
import { ApolloProvider } from '@apollo/react-hooks';
import { Stream } from "./Stream";
import './App.css';

function App() {
    return (
        <ApolloProvider client={client}>
            <Stream />
        </ApolloProvider>
    );
}

export default App;
