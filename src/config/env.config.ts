import { ConfigModuleOptions } from "@nestjs/config";

export class EnvConfig {
    static options: ConfigModuleOptions = {
        isGlobal: true,
        envFilePath: (() => {
            switch (process.env.NODE_ENV) {
                default:
                    return "src/env/.env";
            }
        })(),
    };
}
