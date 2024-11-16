const express=require("express")
const mongoose=require("mongoose")
const User=require("./model")
const app=express()
const dotenv =require("dotenv")
const bcrypt=require("bcrypt")


dotenv.config()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

mongoose.connect(process.env.MONGODB_URL).then(()=>console.log("DB Connnect Successfully")).catch(err=>console.log(err))

app.get("/",async(req,res)=>{
res.send("hello world")
})
app.get("/signin",async(req,res)=>{
    try {
        const email  = "abced@123"
        const password="99665655"
        const hashedPassword = await bcrypt.hash(password, 12);
        const find = await User.find({ email: email })
        if (find.length > 0) {
          let id = find[0]._id.toString()
          res.status(401).json({
            result: false,
            message: 'User Email Already exits ',
            id: find
          });
        } else {
          const user = await User.create({ email: email, password: hashedPassword });
        //   const token = jwt.sign({ id: user._id.toString() },process.env.JWT_SECRET, { expiresIn: '12h' });
          await user.save();
          res.status(201).json({ resulr: true, message: 'User created successfully',data:user });
        }
      } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
})


app.listen(process.env.PORT || 3000 ,(err)=>{
err?console.log(err):console.log(`server run in http://localhost:${process.env.PORT || 3000}`)
})