export const create = async (Model, req, res) => {
    try {
        const item = new Model(req.body);

        item.user_id = item._id.toString();

        await item.save();
        res.status(201).json(item)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}