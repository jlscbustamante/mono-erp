
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import Client from 'ssh2-sftp-client';


const sftp=new Client()

const delay=async(ms)=> {
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve()
    },ms)
  })
}

const app=async()=>{
  await delay(2000)
  const responseDir = './response';
  const filePath = path.join(responseDir, 'conten.txt');
  const content = 'done';

    // await sftp.connect({
  //   host: '',
  //   port: 22,
  //   username: '',
  //   password: ''
  // })

  try {
    await mkdir(responseDir, { recursive: true });
    await writeFile(filePath, content);
    console.log(`Successfully wrote "${content}" to ${filePath}`);
  } catch (err) {
    console.error('Error writing file:', err);
    throw err; // Re-throw the error to be caught by the main catch block
  }


}


app().then(el=>{
  console.log("done")
  return 'ok'
}).catch(err=>{
  console.log("error",err)
})