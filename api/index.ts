// index.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get(`/user`, async (req, res) => {
  const result = await prisma.restaurants.findMany({
    take: 10,
    skip: Number(req.query.skip) || 0,
    where: req.query.title
      ? {
          title: {
            contains: req.query.title as string,
          },
        }
      : {},
    include: {
      menu_restaurant: {
        include: {
          menus: {
            include: {
              menu_menu_section: {
                where: {},
                take: 1,
                include: {
                  menu_sections: {
                    include: {
                      menu_item_menu_section: {
                        take: 1,
                        include: { menu_items: true },
                      },
                    },
                  },
                },
              },
              _count: true,
            },
          },
        },
      },
    },
  });
  res.json(
    JSON.parse(
      JSON.stringify(
        result,
        (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
      )
    )
  );
});

/**
 * logic for our api will go here
 */
export default {
  path: "/api",
  handler: app,
};
