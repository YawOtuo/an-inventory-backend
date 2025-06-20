const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Shops", deps: []
 * addColumn(shopId) => "Inventories"
 * addColumn(shopId) => "Items"
 *
 */

const info = {
  revision: 7,
  name: "ShopModel",
  created: "2024-02-12T20:37:52.282Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "Shops",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: { type: Sequelize.STRING, field: "name" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Inventories",
      "shopId",
      {
        type: Sequelize.INTEGER,
        field: "shopId",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "Shops", key: "id" },
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Items",
      "shopId",
      {
        type: Sequelize.INTEGER,
        field: "shopId",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "Shops", key: "id" },
        allowNull: true,
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["Inventories", "shopId", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Items", "shopId", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Shops", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
