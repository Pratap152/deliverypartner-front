// import { ORDER_STATUS } from '../../config/orderStates';

// // Simulated delay helper
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// class OrderService {
//     constructor() {
//         // In a real app, this might be a singleton or use a backend client
//         this.currentOrder = null;
//     }

//     /**
//      * Accepts an order
//      * @param {string} orderId 
//      * @returns {Promise<{success: boolean, status: string}>}
//      */
//     async acceptOrder(orderId) {
//         console.log(`[OrderService] Accepting order ${orderId}...`);
//         await delay(1000); // Simulate API call
//         this.currentOrder = {
//             id: orderId,
//             status: ORDER_STATUS.PICKUP_ASSIGNED,
//         };
//         return { success: true, status: this.currentOrder.status };
//     }

//     /**
//      * Updates the status of an order
//      * @param {string} orderId 
//      * @param {string} newStatus 
//      * @returns {Promise<{success: boolean, status: string}>}
//      */
//     async updateOrderStatus(orderId, newStatus) {
//         console.log(`[OrderService] Updating order ${orderId} to ${newStatus}...`);
//         await delay(800); // Simulate API call

//         // In a real app, we would validate if the transition is allowed
//         if (this.currentOrder) {
//             this.currentOrder.status = newStatus;
//         }

//         return { success: true, status: newStatus };
//     }

//     /**
//      * Fetches current order details
//      * @param {string} orderId 
//      */
//     async getOrderDetails(orderId) {
//         console.log(`[OrderService] Fetching details for ${orderId}...`);
//         await delay(500);
//         return this.currentOrder;
//     }
// }

// export const orderService = new OrderService();

import axios from 'axios';
import { ORDER_STATUS } from '../../config/orderStates';
import WEBSITE_URL from '../../utils/host';
 
class OrderService {
 
    /**
     * Accept order (can be connected to backend later)
     */
    async acceptOrder(orderId) {
        console.log(`[OrderService] Accepting order ${orderId}`);
        return {
            success: true,
            status: ORDER_STATUS.PICKUP_ASSIGNED,
        };
    }
 
    /**
     * Update order status (future backend integration)
     */
    async updateOrderStatus(orderId, newStatus) {
        console.log(`[OrderService] Updating order ${orderId} to ${newStatus}`);
        return {
            success: true,
            status: newStatus,
        };
    }
 
    /**
     * GET ORDER DETAILS (REAL API)
     */
    async getOrderDetails(orderId) {
        try {
            const response = await axios.get(
                `${WEBSITE_URL}/api/orders/${orderId}/details`
            );
 
            if (!response.data?.success) {
                throw new Error(response.data?.message || 'Order fetch failed');
            }
 
            return response.data.filteredOrder;
        } catch (error) {
            console.error(
                '[OrderService] getOrderDetails error:',
                error?.response?.data || error.message
            );
            throw error;
        }
    }
}
 
export const orderService = new OrderService();