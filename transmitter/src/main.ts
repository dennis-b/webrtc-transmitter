import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startStream } from "./gstreamer/gstreamer.utils";

async function bootstrap() {
    startStream()
    const app = await NestFactory.create(AppModule);
    await app.listen(3009);
}

bootstrap();
