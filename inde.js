const { MongoClient } = require('mongodb');

async function migrateCollection() {
  const client = new MongoClient("mongodb+srv://slayde:slayde9638@cluster0.xycoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true");
  try {
    await client.connect();
    const db = client.db("test");
    const collection = db.collection("shop_locations");

    const cursor = collection.find({});
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      if (doc.x && doc.y) {
        await collection.updateOne(
          { _id: doc._id },
          {
            $set: {
              location: {
                type: "Point",
                coordinates: [parseFloat(doc.y), parseFloat(doc.x)]
              }
            }
          }
        );
      }
    }
    console.log("Migration completed successfully.");
  } catch (e) {
    console.error("Error during migration:", e);
  } finally {
    await client.close();
  }
}

migrateCollection();
