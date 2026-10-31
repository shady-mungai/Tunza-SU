import mysql2 from 'mysql2'
import 'dotenv/config'

const con = mysql2.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    database: process.env.MYSQL_DATABASE || 'tunza_su',
    user:process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

con.getConnection(e=>{
    if(e)throw e;
    console.log("connected !!")
})


export default con;
