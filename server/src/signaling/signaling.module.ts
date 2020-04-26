import { Module } from "@nestjs/common";
import { SignalingResolver } from "./signaling.resolver";
import { PubSub } from "graphql-subscriptions";
import { MessagesModule } from "../messages/messages.module";
import { SignalingService } from "./signaling.service";

@Module({
    imports: [
        MessagesModule
    ],
    providers: [
        SignalingService,
        SignalingResolver,
        { provide: 'PUB_SUB', useValue: new PubSub() },
    ],
})
export class SignalingModule {

}
