const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const res1 = await mongoose.connection.collection('feedbacks').deleteMany({ userName: 'Anonymous User' });
  console.log('Deleted anonymous reviews:', res1.deletedCount);
  
  const res2 = await mongoose.connection.collection('feedbacks').updateMany({ userName: 'Anshika Asati' }, { $set: { approved: true } });
  console.log('Approved true reviews:', res2.modifiedCount);
  
  process.exit(0);
}).catch(console.error);
