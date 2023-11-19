const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * renameColumn(type) => "Items"
 * removeColumn(price) => "Inventories"
 * removeColumn(variants) => "Items"
 * addColumn(date) => "Inventories"
 * addColumn(category) => "Items"
 * addColumn(unit_price) => "Items"
 * addColumn(refill_count) => "Items"
 *
 */

const info = {
  revision: 6,
  name: "ItemsAndInventoryEdit",
  created: "2023-11-19T21:09:58.874Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "renameColumn",
    params: ["Items", "type", "name"],
  },
  {
    fn: "removeColumn",
    params: ["Inventories", "price", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Items", "variants", { transaction }],
  },
  {
    fn: "addColumn",
    params: [
      "Inventories",
      "date",
      { type: Sequelize.DATE, field: "date" },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Items",
      "category",
      { type: Sequelize.STRING, field: "category" },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Items",
      "unit_price",
      { type: Sequelize.INTEGER, field: "unit_price" },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Items",
      "refill_count",
      { type: Sequelize.INTEGER, field: "refill_count" },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "renameColumn",
    params: ["Items", "name", "type"],
  },
  {
    fn: "removeColumn",
    params: ["Inventories", "date", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Items", "category", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Items", "unit_price", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Items", "refill_count", { transaction }],
  },
  {
    fn: "addColumn",
    params: [
      "Inventories",
      "price",
      { type: Sequelize.INTEGER, field: "price" },
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
