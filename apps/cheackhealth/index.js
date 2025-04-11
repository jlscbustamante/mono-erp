
const express=require('express')
const { exec } = require('child_process');
const app=express()

const port=5551



app.get('/api/check/check',async (req,res)=>{
  const url='https://erpraul.com/api/v2/test'
  const request=await fetch(url)
  const content=await request.json()
  return res.json({
    message: 'ok reset api',
    response : content
  })
}).get('/api/check/reset',(req,res)=>{
  try {
    exec('pm2 restart server', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
      }
      if (stderr) {
        console.error(`Command stderr: ${stderr}`);
      }
      console.log(`Command stdout: ${stdout}`);
    });

    return res.json({
      message: 'ok'
    })

  }catch(err){
    return res.json({
      message: 'error'
    })
  }
})


app.listen(port,()=>{
  console.log(`Server is running on port ${port}`)
})


