import { z } from "zod";

import type { User } from "@acme/services";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }): Promise<User | null> => {
    const userService = ctx.servicesFactory.getUserService();
    const user = await userService.getUser(ctx.user.sub);
    if (user !== null) {
      return user;
    }
    const newUser: User = {
      id: ctx.user.sub,
      name: ctx.user.name,
      emailAddress: ctx.user.emailAddress,
    };
    await userService.createUser(newUser);
    console.log("getting user");
    return userService.getUser(ctx.user.sub);
  }),
});
