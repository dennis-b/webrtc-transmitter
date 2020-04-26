import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { split } from "apollo-link";
import { WebSocketLink } from 'apollo-link-ws';
import config from '../config';
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink: any = new HttpLink({
    uri: config.serverUrl,
});

const wsLink = new WebSocketLink({
    uri: config.serverWs as string,
    options: {
        reconnect: true
    }
});

const link: any = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

export const client: any = new ApolloClient({
    link,
    cache: new InMemoryCache(),
})
