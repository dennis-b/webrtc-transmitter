import { Module } from '@nestjs/common';
import { GraphQLModule } from "@nestjs/graphql";
import * as path from 'path'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JsonScalar } from "./scalar/json.scalar";
import { SignalingModule } from "./signaling/signaling.module";

@Module({
    imports: [
        GraphQLModule.forRoot({
            autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
            installSubscriptionHandlers: true,
            context: async ({ req }) => ({ req }),
            subscriptions: { path: '/graphql' }
        }),
        SignalingModule
    ],
    controllers: [
        AppController
    ],
    providers: [
        AppService,
        JsonScalar,
    ],
})
export class AppModule {
}
