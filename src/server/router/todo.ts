import { createRouter } from "./context";
import { prisma } from "../db/client";
import { z } from "zod";

export const todoRouter = createRouter()
  .query("get-todos", {
    async resolve() {
      return prisma.todo.findMany({
        orderBy: {
          done: 'asc',
        },
      })
    },
  }).mutation("update-todo", {
    input: z.object({id: z.string(), done: z.boolean()}),
    async resolve({ input }) {
      const { id, done } = input;
      return await prisma.todo.update({
        where: {
          id,
        },
        data: {
          done,
        },
      });
    }
  }).mutation("create-todo", {
    input: z.object({text: z.string()}),
    async resolve({ input }) {
      const { text } = input;
      await prisma.todo.create({
        data: {
          text
        }
      });
    }
  });
