const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Inventories", deps: [Items]
 * addColumn(variants) => "Items"
 *
 */

const info = {
  revision: 5,
  name: "InventoryTableAndVariantsColumn",
  created: "2023-10-23T23:24:36.228Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "Inventories",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        action: { type: Sequelize.STRING, field: "action" },
        price: { type: Sequelize.INTEGER, field: "price" },
        quantity: { type: Sequelize.INTEGER, field: "quantity" },
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
        itemId: {
          type: Sequelize.INTEGER,
          field: "itemId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Items", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Items",
      "variants",
      { type: Sequelize.JSON, field: "variants", allowNull: true },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["Items", "variants", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Inventories", { transaction }],
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
