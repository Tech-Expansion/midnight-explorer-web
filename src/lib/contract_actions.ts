import {pool} from '@/lib/db';



async function getData(){
    const rs = await pool.query(
        'SELECT * FROM transactions order by id desc limit 10');
    return rs.rows;
}
// getData();
async function main(){
    const data = await getData();
    console.log(data);
}
main();
