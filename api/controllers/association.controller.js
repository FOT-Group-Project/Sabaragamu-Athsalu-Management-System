const models = require('../models');

async function getAssociations(req, res) {

    models.User.findByPk(1).then(result => {
        if(result){
            res.status(200).json(result)
        }else{
            res.status(404).json({
                message: "User not found"
            })
        }
    }
    ).catch(error => {
        res.status(500).json({
            message: "Error getting user",
            error: error
        })
    })
}


//     const user = await models.User.findByPk(1);

//     res.status().json({
//         data:user
//     });
// }

module.exports = {
    getAssociations: getAssociations
}