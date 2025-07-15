const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });

const URL = sequelize.define('URL', {
  original_url: { type: DataTypes.STRING, allowNull: false },
  shortcode: { type: DataTypes.STRING, allowNull: false, unique: true },
  expiry: { type: DataTypes.DATE, allowNull: false },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
}, {
  timestamps: false,
});

const Click = sequelize.define('Click', {
  timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  referrer: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
}, {
  timestamps: false,
});

URL.hasMany(Click, { foreignKey: 'urlId' });
Click.belongsTo(URL, { foreignKey: 'urlId' });

module.exports = { sequelize, URL, Click }; 