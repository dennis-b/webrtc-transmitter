import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { SignalingService } from "./signaling.service";
import { Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";

@Resolver()
export class SignalingResolver {
    constructor(private signalingService: SignalingService, @Inject('PUB_SUB') private pubSub: PubSub) {
    }

    @Query(() => Object)
    async dummy() {
        return { type: 'dummy' }
    }

    @Mutation(() => Object)
    async requestStream(@Args({ name: 'connectionId' }) connectionId: string) {
        this.signalingService.onStartNegotiation({ connectionId })
        return { ok: true }
    }

    @Mutation(() => Object)
    async signalingAnswer(
        @Args({ name: 'localDescription' }) localDescription: string,
        @Args({ name: 'connectionId' }) connectionId: string,
    ) {
        this.signalingService.onSdpAnswer({ connectionId, localDescription })
        return { ok: true }
    }

    @Subscription(returns => Object, {
        filter: (payload, variables) => payload.signalingRemoteOffer.connection.id === variables.connectionId,
    })
    signalingRemoteOffer(@Args('connectionId') connectionId: string) {
        return this.pubSub.asyncIterator('signalingRemoteOffer');
    }
}
