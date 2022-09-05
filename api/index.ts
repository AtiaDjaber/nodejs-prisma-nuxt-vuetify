// index.js
import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
import mysqldump from "mysqldump";

app.use(express.json());

app.get(`/user`, async (req, res) => {
  var fs = require("fs");

  var spawn = require("child_process").spawn;
  // var wstream = fs.createWriteStream("dumpfilename.sql");

  // var mysqldump = spawn("mysqldump", [
  //   "-u",
  //   "root",
  //   "laravel",
  //   ">",
  //   "da.sql",
  //   "&&",
  //   "gzip",
  //   "da.sql",
  // ]);

  // mysqldump.stdout
  //   .pipe(wstream)
  //   .on("finish", function () {
  //     console.log("Completed");
  //   })
  //   .on("error", function (err) {
  //     console.log(err);
  //   });
  var exec = require("child_process").exec(
    "mysqldump -u root laravel > dumpfilename.sql && gzip dumpfilename.sql"
  );
  //command decompress => gzip -d dumpfilename.sql.gz
  var filterRestaurant = {
    title: {
      contains: req.query.title as string,
    },
    // is_available: { equals: true },
    // created_at: {
    //   gte: new Date("2022-08-30"),
    // },
    // menu_restaurant: { none: {} },
  } as Prisma.restaurantsWhereInput;

  const userCount = await prisma.restaurants.count({
    where: filterRestaurant,
  });
  const result = await prisma.restaurants.findMany({
    take: 10,
    skip: Number(req.query.skip) || 0,
    where: filterRestaurant,
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
            },
          },
        },
      },
    },
  });
  result["count"] = userCount;
  res.json({
    count: userCount,
    data: JSON.parse(
      JSON.stringify(
        result,
        (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
      )
    ),
  });
});

app.get(`/places`, async (req, res) => {
  const count = await prisma.places.count({
    where: {
      title: { contains: req.query.search as string },
    },
  });
  const result = await prisma.places.findMany({
    take: 10,
    skip: (Number(req.query.skip) - 1 || 0) * 10,
    where: {
      title: { contains: req.query.search as string },
    },
  });
  res.json({
    count: count,
    data: JSON.parse(
      JSON.stringify(
        result,
        (_, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
      )
    ),
  });
});
// app.listen(3001, () => {
//   console.log('listening on port 3001');
// });

/**
 * logic for our api will go here
 */
export default {
  path: "/api",
  handler: app,
};
