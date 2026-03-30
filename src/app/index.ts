import express from "express";
import type { Express } from "express";

export function createExpressApplication(): Express.Application{
    const app = express()

    //middlewarres


    //routes
    app.get("/", (req, res) => {
        res.send("Hello World!")
    })

    return app
}