import "./rxjs-extensions";

import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { BrowserModule, Title } from "@angular/platform-browser";
import { MomentModule } from "angular2-moment";

import { AppComponent } from "./app.component";

import { AppErrorHandlerModule } from "./modules/app-error-handler/app-error-handler.module";
import { AppHttpModule } from "./modules/app-http/app-http.module";
import { ContentModule } from "./modules/content/content.module";
import { CoreModule } from "./modules/core/core.module";
import { DataModule } from "./modules/data/data.module";
import { LoggerModule } from "./modules/logger/logger.module";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent
    ],
    imports: [

        // Angular & External
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule,
        MomentModule,

        // Internal
        AppErrorHandlerModule,
        AppHttpModule,
        ContentModule,
        CoreModule,
        DataModule,
        LoggerModule,
    ],
    providers: [
        Title
    ]
})
export class AppModule { }
