import mysql2 from 'mysql2'
import 'dotenv/config'

const con = mysql2.createPool({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE || 'test_schema',
    user:process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD 
});

con.getConnection(e=>{
    if(e)throw e;
    console.log("connected !!")
})


export default con;