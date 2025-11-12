
import mongoInstance from "../database/mongoDatabase.mjs";

const adminData = new mongoInstance("adminData")

export async function getHomeSchema (req,res){
    try{
        const schema = await adminData.findData({ schema: { $exists: true } })  
        res.status(200)
        res.json(schema[0].schema) 
    }catch(e){
        res.status(400)
        res.json({"schema":"schema not found"}) 
    }
}

export async function saveHomeSchema(req, res) {
    try{

        await adminData._reload();
        const result = await adminData.db.update(
            { schema: { $exists: true } },
            { $set: { schema: req.body.schema } },
            { multi: false, upsert: true }
        );
    
        const docs = await adminData.findData({ schema: { $exists: true } });

        res.status(200)
        res.json({"schema":"schema updated"});
    }catch(e){
        res.status(400)
        res.json({"schema":"schema not updated \n "+e}) 
    }
}
