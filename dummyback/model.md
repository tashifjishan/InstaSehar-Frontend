```js


db.conversations.aggregate([
    {$match: {participants: ObjectId('6a97eec52154dff3947c2909')}},

    {$lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participatingUsers"
    }},

    {$project: {
        _id: "$_id",
        participants: {
            $map:{
                input: "$participatingUsers",
                as: "user",
                in: {
                    _id: "$$user._id",
                    name: "$$user.name"
                }
            }
        }
    }},

    {
        $lookup:{
            from: "messages",
            localField: "_id",
            foreignField: "conconversationId"
            as: "messages" 
        }
    }
])

```