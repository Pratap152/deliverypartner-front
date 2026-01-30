import { ORDER_STATUS } from '../../config/orderStates';

// Simulated delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class OrderService {
    constructor() {
        // In a real app, this might be a singleton or use a backend client
        this.currentOrder = null;
    }

    /**
     * Accepts an order
     * @param {string} orderId 
     * @returns {Promise<{success: boolean, status: string}>}
     */
    async acceptOrder(orderId) {
        console.log(`[OrderService] Accepting order ${orderId}...`);
        await delay(1000); // Simulate API call
        this.currentOrder = {
            id: orderId,
            status: ORDER_STATUS.PICKUP_ASSIGNED,
        };
        return { success: true, status: this.currentOrder.status };
    }

    /**
     * Updates the status of an order
     * @param {string} orderId 
     * @param {string} newStatus 
     * @returns {Promise<{success: boolean, status: string}>}
     */
    async updateOrderStatus(orderId, newStatus) {
        console.log(`[OrderService] Updating order ${orderId} to ${newStatus}...`);
        await delay(800); // Simulate API call

        // In a real app, we would validate if the transition is allowed
        if (this.currentOrder) {
            this.currentOrder.status = newStatus;
        }

        return { success: true, status: newStatus };
    }

    /**
     * Fetches current order details
     * @param {string} orderId 
     */
    async getOrderDetails(orderId) {
        console.log(`[OrderService] Fetching details for ${orderId}...`);
        await delay(500);
        return this.currentOrder;
    }
}

export const orderService = new OrderService();
