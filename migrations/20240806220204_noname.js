const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * addColumn(userId) => "Inventories"
 * changeColumn(itemId) => "Inventories"
 *
 */

const info = {
  revision: 18,
  name: "noname",
  created: "2024-08-06T22:02:04.275Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "addColumn",
    params: [
      "Inventories",
      "userId",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        field: "userId",
        references: { model: "Users", key: "id" },
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Inventories",
      "itemId",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        field: "itemId",
        references: { model: "Items", key: "id" },
        allowNull: true,
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["Inventories", "userId", { transaction }],
  },
  {
    fn: "changeColumn",
    params: [
      "Inventories",
      "itemId",
      {
        type: Sequelize.INTEGER,
        field: "itemId",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Items", key: "id" },
        allowNull: true,
      },
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
