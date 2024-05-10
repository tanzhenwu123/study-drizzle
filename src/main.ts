import "dotenv/config";
import { db } from "./drizzle/db";
import { UserPreferencesTable, UserTable } from "./drizzle/schema";
import { asc, count, eq, gt, sql } from "drizzle-orm";

async function delForm() {
  await db.delete(UserTable);
}

async function insert() {
// create user table 
//   const user = await db
//     .insert(UserTable)
//     .values([
//       {
//         name: "tzw",
//         age: 23,
//         email: "1105049762@qq.com",
//       },
//       {
//         name: "sallya",
//         age: 23,
//         email: "test@test.com",
//       },
//     ])
//     .returning({
//       id: UserTable.id,
//       userName: UserTable.name
//     })
//     .onConflictDoUpdate({
//         target: UserTable.email,
//         set: { name: 'Updated Name' }
//     });
const userPreferences = await db.insert(UserPreferencesTable).values({
    userId: '7245f041-1867-48ea-8bb5-c3c920584b9b',
    emailUpdates: true
})
  console.log(userPreferences);
}

async function query() {
    const user = await db.query.UserTable.findMany({
        columns: {
            email: true,
            name: true,
            id: true,
            age: true
        },
        // with: { posts: { with: { PostCategories: true } } },
        // orderBy: asc(UserTable.age),
        orderBy: (table, funcs) => funcs.asc(UserTable.age),
        // where: (table, funcs) => funcs.eq(UserTable.age, 23),
        where: (table, funcs) => funcs.between(UserTable.age,20, 25),
        extras: { lowerCaseName: sql<string>`lower(${UserTable.name})`.as("lowerCaseName") }
    })
    console.log(user)
}

async function select() {
    const user = await db
    // .select({id: UserTable.id, name:UserTable.name, emalUpdated: UserPreferencesTable.emailUpdates})
    .select({age: UserTable.age, count: count(UserTable.age)})
    .from(UserTable)
    // .where(eq(UserTable.age, 23))
    .leftJoin(UserPreferencesTable, eq(UserPreferencesTable.userId, UserTable.id))
    .groupBy(UserTable.age)
    // .having(columns => gt(columns.count, 1))
    console.log(user)
}

// insert()

// delForm();

// query()

select()
