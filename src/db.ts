import { Sequelize } from "sequelize";

const pool = new Sequelize(
  process.env.pg!,
  {
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  }
);

export default pool;
