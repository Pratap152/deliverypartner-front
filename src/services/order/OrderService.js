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
    /**
     * Mark order as picked up
     */
    async pickupOrder(orderId, riderId) {
        try {
            const response = await axios.patch(
                `${WEBSITE_URL}/api/orders/${orderId}/pickup`,
                { riderId }
            );
            return response.data;
        } catch (error) {
            console.error(
                '[OrderService] pickupOrder error:',
                error?.response?.data || error.message
            );
            throw error;
        }
    }

    /**
     * Mark order as delivered
     */
    async deliverOrder(orderId, riderId) {
        try {
            const response = await axios.patch(
                `${WEBSITE_URL}/api/orders/${orderId}/deliver`,
                { riderId }
            );
            return response.data;
        } catch (error) {
            console.error(
                '[OrderService] deliverOrder error:',
                error?.response?.data || error.message
            );
            throw error;
        }
    }

    /**
     * Cancel order
     */
    async cancelOrder(orderId, riderId, reasonCode, reasonText) {
        try {
            const response = await axios.patch(
                `${WEBSITE_URL}/api/orders/${orderId}/cancel`,
                { riderId, reasonCode, reasonText }
            );
            return response.data;
        } catch (error) {
            console.error(
                '[OrderService] cancelOrder error:',
                error?.response?.data || error.message
            );
            throw error;
        }
    }
}

export const orderService = new OrderService();