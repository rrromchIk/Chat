const ChatRoom = require('../models/chatRoom');

async function getAllUserChats(req, res) {
    console.log("chatRoomController ### getAllUserChats");

    try {
        const userId = req.params.id;
        
        const chatRooms = await ChatRoom.find(
            { members: { 
                $elemMatch: { 
                    id: { 
                        $eq: userId 
                    } 
                } 
            } 
        });

        console.log("chatRoomController ### extracted {" + chatRooms.length + "} chat rooms for user id: " + userId);

        res.status(201).json(chatRooms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
}

module.exports = {
    getAllUserChats
}