const mongoose = require('mongoose');

exports.connect = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://yankarlo:texto123@cluster0.ojkcx.mongodb.net/code_challenge?retryWrites=true'
      , { useNewUrlParser: true, useUnifiedTopology: true });


  } catch (error) {
    console.error('Error when connecting with the database');
    console.error(error.message);
  }
}