const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * changeColumn(cost) => "Inventories"
 * changeColumn(unit_price) => "Items"
 *
 */

const info = {
  revision: 16,
  name: "noname",
  created: "2024-05-17T21:59:35.440Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "Inventories",
      "cost",
      { type: Sequelize.DECIMAL, field: "cost" },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Items",
      "unit_price",
      { type: Sequelize.DECIMAL(10, 2), field: "unit_price" },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "Inventories",
      "cost",
      { type: Sequelize.DOUBLE, field: "cost" },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Items",
      "unit_price",
      { type: Sequelize.INTEGER, field: "unit_price" },
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
