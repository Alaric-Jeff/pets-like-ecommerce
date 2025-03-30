import CartModel from "../models/CartModel.js";
 const updateCartModelQuantity = async (req, res) => {
    try {
        const { cartId, productId, quantity } = req.body;

        if (!cartId || !productId || quantity == null) {
            console.log(`the problem is here cartID ${cartId}, product id: ${productId}, quantity: ${quantity}   `)
            return res.status(400).json({ message: 'cartId, productId, and quantity are required' });
        }

        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        const cartItem = await CartModel.findOne({ where: { cartId, productId } });
        
        if (!cartItem) {
            return res.status(404).json({ message: 'CartModel item not found' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        return res.status(200).json({ message: 'CartModel quantity updated', cartItem });
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default updateCartModelQuantity
