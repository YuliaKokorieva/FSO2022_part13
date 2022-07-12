const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Blog extends Model {}
Blog.init({
  id: {    
    type: DataTypes.INTEGER,    
    primaryKey: true,    
    autoIncrement: true  
  },  
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false  
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false  
  },
  likes: {
    type: DataTypes.INTEGER, 
    defaultValue: 0   
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      checkYear: function(value) {

        if (value>=1991 && value <= new Date().getFullYear()) {
          return true
        } else {
          throw new Error("Year not correct: cannot be earlier than 1991 and later than current year")
        }
     
      }
      // min: {
      //   args: 1991,
      //   msg: "Cannot be before 1991"
      // },
      // max: {
      //   checkCurrentYear(value) {
      //     const currentYear = new Date().getFullYear()
      //     console.log(`current year: ${currentYear}, value: ${value}`)
      //     if (value>currentYear) {
      //       throw new Error("Cannot be later than current year")
      //     } 
      //   }
      // }
    }
  }
}, {
    sequelize,  
    underscored: true,  
    timestamps: true,  
    modelName: 'blog'
  }
)

module.exports=Blog