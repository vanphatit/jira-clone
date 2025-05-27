import { z } from "zod";
import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"

import { loginSchema, signUpSchema } from "../schemas";

const app = new Hono()
    .post(
        "/login",
        zValidator("json", loginSchema),
        async (c) => {
            const { email, password } = c.req.valid("json")
            return c.json({ success: "ok" })
        }
    )
    .post(
        "/register",
        zValidator("json", signUpSchema),
        async (c) => {
            const { name, email, password, repassword } = c.req.valid("json")

            return c.json({ name, email, password })
        }
    )

export default app