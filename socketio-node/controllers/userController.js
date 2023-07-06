const axios = require("axios");

async function getAllUsers(req, res) {
    console.log("userController ### getAllUsers");

    const url = `${process.env['PHP_SERVER_HOST']}/cmsproject/index.php/users/all`;
    const result = await axios.get(url).then(response => response.data);

    console.log("Sending request to: " + url);

    const users = result.map(({ id, fullName }) => ({ id, fullName }));
    res.json(users);

    console.log("Sending response to " + req.hostname);
    console.log(users);
}

module.exports = {
    getAllUsers
};

