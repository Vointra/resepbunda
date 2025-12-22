import { execSql, querySql } from "./client";
import { schema } from "./schema";
import { recipes as recipeSeeds } from "./seeds/recipes";

const MOCK = {
  email: "bunda@example.com",
  password: "Bunda123!",
};

async function seedRecipes() {
  await execSql(schema.recipes);

  const r = await querySql<{ cnt: number }>("SELECT COUNT(*) as cnt FROM recipes");
  if ((r[0]?.cnt ?? 0) === 0) {
    console.log("Seeding recipes...");
    const insertQuery = `
      INSERT INTO recipes (title, description, creator, creatorType, cookingTime, category, isPrivate, rating, calories, ingredients, steps) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    for (const recipe of recipeSeeds) {
      await execSql(insertQuery, [
        recipe.title,
        recipe.description,
        recipe.creator,
        recipe.creatorType,
        recipe.cookingTime,
        recipe.category,
        recipe.isPrivate ? 1 : 0,
        recipe.rating,
        recipe.calories,
        JSON.stringify(recipe.ingredients),
        JSON.stringify(recipe.steps),
      ]);
    }
    console.log("Seeding complete.");
  }
}

export async function initDb() {
  await execSql(schema.users);
  await execSql(schema.session);

  const u = await querySql<{ cnt: number }>(
    "SELECT COUNT(*) as cnt FROM users WHERE email = ?",
    [MOCK.email]
  );
  if ((u[0]?.cnt ?? 0) === 0) {
    await execSql(
      "INSERT INTO users (email, password, created_at) VALUES (?,?,?)",
      [MOCK.email, MOCK.password, new Date().toISOString()]
    );
  }

  const s = await querySql<{ cnt: number }>("SELECT COUNT(*) as cnt FROM session WHERE id = 1");
  if ((s[0]?.cnt ?? 0) === 0) {
    await execSql("INSERT INTO session (id, is_logged_in, email, logged_in_at) VALUES (1,0,' ',' ')");
  }

  await seedRecipes();
}
