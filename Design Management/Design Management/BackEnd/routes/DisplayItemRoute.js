import express from 'express';
import { DisplayItem } from '../models/DisplayItemModel.js'; // Import DisplayItem model
import { Inventory } from '../models/bookModels.js'; // Import Inventory model to fetch itemCode
import upload from '../multer/multerConfig.js'; // Multer for file uploads

const router = express.Router();

// Create a new Display Item
router.post('/', upload.single('image'), async (req, res) => { // Added async here
    const { itemCode, productName, productDescription, unit, price } = req.body;
    const image = req.file; // Extract image from req.file
    console.log('Received:', { itemCode, productName, productDescription, unit, price });

    try {
        // Ensure itemCode is provided
        if (!itemCode) {
            return res.status(400).json({ message: 'Item code is required.' });
        }

        // Check if itemCode already exists in DisplayItem
        const existingItem = await DisplayItem.findOne({ itemCode }); // Added await here
        if (existingItem) {
            return res.status(400).json({ message: 'Item code already exists.' });
        }

        // Fetch Quantity from Inventory for the itemCode
        const inventoryItem = await Inventory.findOne({ itemCode });
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Item not found in inventory' });
        }

        // Create a new Display Item
        const newItem = new DisplayItem({
            itemCode,
            productName,
            productDescription, // Include productDescription
            unit,
            price,
            image: image ? { data: image.buffer, contentType: image.mimetype } : undefined // Check if image exists
        });

        // Save the new item to the database
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.error('Error creating display item:', error.stack);
        res.status(500).json({ message: 'Error creating display item: ' + error.message }); // Improved error message
    }
});

// Get all Display Items
router.get('/', async (req, res) => {
    try {
        const items = await DisplayItem.find();
        const formattedItems = items.map(item => {
            const imageUrl = item.image && item.image.data && item.image.contentType
                ? `data:${item.image.contentType};base64,${item.image.data.toString('base64')}`
                : null;
            return { ...item.toObject(), image: imageUrl };
        });

        res.status(200).json(formattedItems);
    } catch (error) {
        console.error('Error fetching display items:', error.stack);
        res.status(500).json({ message: 'Error fetching display items: ' + error.message }); // Improved error message
    }
});

// Get a Display Item by itemCode
router.get('/:itemCode', async (req, res) => {
    const { itemCode } = req.params;

    try {
        // Find the item by itemCode
        const item = await DisplayItem.findOne({ itemCode });
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Prepare the image data if it exists
        const imageUrl = item.image
            ? `data:${item.image.contentType};base64,${item.image.data.toString('base64')}`
            : null;

        res.status(200).json({ ...item.toObject(), image: imageUrl });
    } catch (error) {
        console.error('Error fetching display item:', error.stack);
        res.status(500).json({ message: 'Internal Server Error: ' + error.message }); // Improved error message
    }
});

// Update a Display Item by itemCode
router.put('/:itemCode', upload.single('image'), async (req, res) => {
    const { itemCode } = req.params;

    try {
        // Update fields based on the request body
        const updatedFields = {
            productName: req.body.productName,
            productDescription: req.body.productDescription, // Include productDescription
            unit: req.body.unit,
            price: req.body.price,
        };

        // Update image if a new file is uploaded
        if (req.file) {
            updatedFields.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        // Find and update the item
        const item = await DisplayItem.findOneAndUpdate({ itemCode }, updatedFields, { new: true });
        if (!item) return res.status(404).json({ message: 'Item not found!' });

        // Prepare the updated image data if it exists
        const imageUrl = item.image
            ? `data:${item.image.contentType};base64,${item.image.data.toString('base64')}`
            : null;

        return res.status(200).json({ message: 'Item updated successfully!', item: { ...item.toObject(), image: imageUrl } });
    } catch (error) {
        console.error('Error updating display item:', error.stack);
        return res.status(500).json({ message: 'Error updating display item: ' + error.message }); // Improved error message
    }
});

// Delete a Display Item by itemCode
router.delete('/:itemCode', async (req, res) => {
    const { itemCode } = req.params;

    try {
        // Find and delete the item
        const result = await DisplayItem.findOneAndDelete({ itemCode });
        if (!result) return res.status(404).json({ message: 'Item not found!' });

        return res.status(200).json({ message: 'Item deleted successfully!' });
    } catch (error) {
        console.error('Error deleting display item:', error.stack);
        res.status(500).json({ message: 'Error deleting display item: ' + error.message }); // Improved error message
    }
});

export default router;
