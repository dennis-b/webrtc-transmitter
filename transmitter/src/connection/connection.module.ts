import { Module } from "@nestjs/common";
import { MessagesModule } from "../messages/messages.module";
import { ConnectionService } from "./connection.service";

@Module({
    imports: [
        MessagesModule
    ],
    providers: [
        ConnectionService,
    ],
})
export class ConnectionModule {

}
