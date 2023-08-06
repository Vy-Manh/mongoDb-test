const connectToDb = (callback) => {
  const client = new MongoClient("mongodb://localhost:27017");
  client.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      callback(err);
      return;
    }
    const database = client.db("your_db_name");
    db.inventories = database.collection("inventories");
    db.orders = database.collection("orders");
    db.users = database.collection("users");
    callback(); //  Không có lỗi, gọi lại hàm callback mà không có đối số lỗi
  });
};
