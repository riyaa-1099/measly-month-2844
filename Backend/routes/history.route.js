const express=require("express")
const historyRouter=express.Router();
const  authentication  = require("../middleware/authentication");

const {Historymodel}=require("../models/history.model")


historyRouter.post('/history',authentication, (req, res) => {
    // console.log(req.body)
    const { userId, url, method } = req.body;
    const query = new Historymodel({ userId, url, method });
    // console.log(req.body)
    if (req.body.headers) {
        query.headers = req.body.headers;
    }
    if (req.body.params) {
        query.params = req.body.params;
    }
    query.save()
        .then(query => {
            res.status(200).json({ message: 'Query saved successfully' });
        })
        .catch(error => {
            res.status(500).json({ message: 'Error saving query', error });
        });
});


historyRouter.get('/showhistory',authentication, (req, res) => {
    const { userId } = req.body;
    Historymodel.find({ userId: userId }).sort({ date: -1 }).limit(7)
        .then(queries => {
            res.status(200).json(queries);
        })
        .catch(error => {
            res.status(500).json({ message: 'Error retrieving queries', error });
        });
});



module.exports={
    historyRouter
}